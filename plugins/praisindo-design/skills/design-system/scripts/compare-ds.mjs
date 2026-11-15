#!/usr/bin/env node
// Compare a starter (or a product built from it) with the real Design System app (skill design-system v2.116.0).
// The audit checks a few mechanical rules; this checks that what is RENDERED is the same: CSS files, tokens and the DOM skeleton of the shell, Branding, the Preferences drawer and the Design page.
//
//   node scripts/compare-ds.mjs --ds <DS source root> --starter <starter root> [--ds-url http://localhost:5173] [--starter-url http://localhost:8123] [--user fikri.ramadhan] [--min 95]
//
//   Static part (always, no browser):  css/*.css of the starter against src/design-system/styles/*.css of the DS (byte for byte).
//   Rendered part (when both URLs are given; needs `playwright` resolvable from the DS root): the DOM skeleton (tag + sorted classes + role/type) of
//     sidebar, Branding page, Preferences drawer, Design page sections, in light mode, compared line by line. Prints a match percentage per area and the differing lines.
//   Exit code 0 when the static part is identical and every rendered area reaches its minimum (--min, default 95; Sidebar 65 and Design page 90 because of product content the starter lacks), 1 otherwise, 2 on a usage or setup error.
//
// Start both apps first:   (DS root) npm run dev          (starter) node scripts/serve-nocache.mjs 8123 .   — a plain `python3 -m http.server` caches ES modules and shows an OLD starter.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const dsRoot = arg('ds'), stRoot = arg('starter'), dsUrl = arg('ds-url'), stUrl = arg('starter-url'), user = arg('user', 'fikri.ramadhan'), min = Number(arg('min', '95'));
if (!dsRoot || !stRoot) { console.error('usage: compare-ds.mjs --ds <DS root> --starter <starter root> [--ds-url U --starter-url U] [--user NAME] [--min 95]'); process.exit(2); }
let failed = false;
const bad = (m) => { failed = true; console.log('  ✘ ' + m); };

// ---- static: CSS byte for byte ----
{
  const a = join(resolve(dsRoot), 'src/design-system/styles'), b = [join(resolve(stRoot), 'css'), join(resolve(stRoot), 'src/design-system/styles')].find(existsSync) || join(resolve(stRoot), 'css');   // starter HTML: css/, starter React: src/design-system/styles/
  const sty = (d) => (existsSync(d) ? readdirSync(d).filter((f) => f.endsWith('.css')) : []);
  const fa = sty(a), fb = sty(b), diff = [];
  for (const f of new Set([...fa, ...fb])) {
    if (!fa.includes(f)) diff.push(f + ' only in the starter'); else if (!fb.includes(f)) diff.push(f + ' only in the DS'); else if (readFileSync(join(a, f), 'utf8') !== readFileSync(join(b, f), 'utf8')) diff.push(f + ' differs');
  }
  console.log(`CSS: ${fa.length} files in the DS, ${fb.length} in the starter`);
  if (diff.length) diff.forEach((d) => bad(d)); else console.log('  ✔ identical');
}

if (!dsUrl || !stUrl) { console.log('\n(no URLs given: rendered comparison skipped — pass --ds-url and --starter-url)'); process.exit(failed ? 1 : 0); }

// ---- rendered ----
let chromium;
try { ({ chromium } = createRequire(join(resolve(dsRoot), 'package.json'))('playwright')); } catch { console.error('playwright is not installed in the DS root (npm i in the DS repo)'); process.exit(2); }

// Skeleton of an element: one line per node, indented; tag + sorted classes + role/type/aria-haspopup. Text is ignored (it is product content and language).
const SKELETON = `(sel) => { const root = document.querySelector(sel); if (!root) return null; const out = [];
  const walk = (el, d) => { if (el.hidden || el.getAttribute('aria-hidden') === 'true' && !el.children.length) return;
    const cls = [...el.classList].filter((c) => !/^(on|open|sel|act|cur)$/.test(c)).sort().join('.');
    out.push('  '.repeat(d) + el.tagName.toLowerCase() + (cls ? '.' + cls : '') + (el.getAttribute('role') ? '[' + el.getAttribute('role') + ']' : '') + (el.getAttribute('type') && el.tagName !== 'BUTTON' ? '(' + el.getAttribute('type') + ')' : ''));
    [...el.children].forEach((c) => walk(c, d + 1)); };
  walk(root, 0); return out.join('\\n'); }`;

const AREAS = [
  { name: 'Sidebar', hash: '#/home', sel: '.sb', min: 65 },   // the DS demo has a bell, a role line and a product menu the starter does not have
  { name: 'Branding page', hash: '#/branding', sel: 'main', after: 600 },
  { name: 'Preferences drawer', hash: '#/home', sel: '.drawer', open: async (p) => { await p.locator('button.user:visible').first().click(); await p.locator('[data-testid="prefs-open"], [data-prefs]').first().click(); await p.waitForSelector('.drawer'); } },
  { name: 'Design page', hash: '#/design', sel: 'main', after: 600, min: 90 },   // the product examples (customer popover, logo, request wizard) are not in the starter
];

const browser = await chromium.launch(); const results = [];
async function grab(url, isDs) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' }), p = await ctx.newPage(), out = {};
  await p.goto(url + '/#/home'); await p.waitForTimeout(800);
  if (isDs && (await p.locator('#u').count())) { await p.locator('#u').fill(user); await p.locator('#pw').fill('demo1234'); await p.getByTestId('submit').click(); await p.waitForTimeout(1500); }
  for (const a of AREAS) {
    try {
      await p.evaluate((h) => { location.hash = h; }, a.hash); await p.waitForTimeout(a.after || 400);
      if (a.open) await a.open(p);
      await p.waitForTimeout(500); out[a.name] = await p.evaluate(`(${SKELETON})(${JSON.stringify(a.sel)})`);
      await p.keyboard.press('Escape'); await p.waitForTimeout(200);
    } catch (e) { out[a.name] = null; }
  }
  await ctx.close(); return out;
}
const ds = await grab(dsUrl.replace(/\/$/, ''), true), st = await grab(stUrl.replace(/\/$/, ''), false);
await browser.close();

// ---- line-based similarity (LCS ratio, like difflib) ----
function ratio(a, b) {
  const n = a.length, m = b.length; if (!n && !m) return 1; let prev = new Array(m + 1).fill(0);
  for (let i = 1; i <= n; i++) { const cur = new Array(m + 1).fill(0); for (let j = 1; j <= m; j++) cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]); prev = cur; }
  return (2 * prev[m]) / (n + m);
}
console.log('\nRendered DOM skeleton (light, 1440px):');
for (const a of AREAS) {
  const x = ds[a.name], y = st[a.name];
  if (x == null || y == null) { bad(`${a.name}: could not be read (DS ${x == null ? 'no' : 'yes'}, starter ${y == null ? 'no' : 'yes'})`); continue; }
  const la = x.split('\n'), lb = y.split('\n'), r = ratio(la, lb) * 100, need = a.min ?? min;
  console.log(`  ${r >= need ? '✔' : '✘'} ${a.name.padEnd(20)} ${r.toFixed(1)}%   (DS ${la.length} lines, starter ${lb.length}, needs ${need}%)`);
  if (r < need) failed = true;
  if (r < 100) { const sa = new Set(la), sb = new Set(lb); const only = (s, o, tag) => [...new Set(s.filter((l) => !o.has(l)).map((l) => l.trim()))].slice(0, 8).forEach((l) => console.log(`      ${tag} ${l}`)); only(la, sb, 'DS only     '); only(lb, sa, 'starter only'); }
}
console.log(failed ? '\nDIFFERENCES FOUND' : '\nOK');
process.exit(failed ? 1 : 0);
