#!/usr/bin/env node
// Icon font detector test (rule LD-01, skill design-system v2.172.0): loads the index.html of each starter in headless Chromium and checks that <html data-icons> becomes "ready" within 5 seconds
// and that an icon is not transparent. It fails on a detector that walks document.fonts with an array method called on it (a FontFaceSet is a Set and has no length, so nothing is ever found).
//   node scripts/icons-check.mjs --playwright-from <dir with node_modules/playwright>   (needs network: the icon font comes from fonts.googleapis.com; exit 0 ok, 1 failed, 2 usage or no network)
//   --file <index.html> (repeatable) tests other pages, for example the index.html of a project built from a starter.
// The page is the real index.html: the module script (the application) is removed, the rule of 05-states.css and an icon (class ic) are added, and the page is served at a fake origin through a route.
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const arg = (k) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : undefined; };
const here = dirname(fileURLToPath(import.meta.url));
const from = arg('playwright-from') || process.cwd();
let chromium;
try { ({ chromium } = createRequire(join(resolve(from), 'package.json'))('playwright')); } catch { console.error('playwright not found: pass --playwright-from <dir with node_modules/playwright>'); process.exit(2); }
const files = process.argv.flatMap((a, i) => (a === '--file' ? [process.argv[i + 1]] : []));
if (!files.length) for (const s of ['starter-react', 'starter-html']) files.push(join(here, '..', 'assets', s, 'index.html'));

let bad = 0, offline = false;
const browser = await chromium.launch();
for (const f of files) {
  if (!existsSync(f)) { console.log('  ✘ not found: ' + f); bad++; continue; }
  const root = dirname(f), css = ['css/05-states.css', 'src/design-system/styles/05-states.css'].map((c) => join(root, c)).find(existsSync);   // the rule that makes an icon transparent while the font is not there
  if (!css) { console.log('  ✘ 05-states.css not found next to ' + f); bad++; continue; }
  const html = readFileSync(f, 'utf8').replace(/<script[^>]*type="module"[^>]*><\/script>/g, '').replace(/<link rel="stylesheet" href="css\/[^>]*>/g, '').replace('</body>', `<style>${readFileSync(css, 'utf8')}</style><span class="ic material-icons-outlined" id="probe" style="font-size:24px">home</span></body>`);
  for (const cold of [true, false]) {   // empty cache, then warm cache (the second load is served from the HTTP cache of the same context)
    const ctx = cold ? await browser.newContext() : (globalThis.__ctx ||= await browser.newContext()), page = await ctx.newPage();
    await page.route('http://starter.test/**', (r) => r.fulfill({ status: 200, contentType: 'text/html', body: html }));
    try { await page.goto('http://starter.test/', { waitUntil: 'domcontentloaded' }); } catch { console.log('  - cannot load the page (offline?)'); offline = true; await page.close(); continue; }
    const t0 = Date.now(); let st = 'wait';
    while (Date.now() - t0 < 5000) { st = await page.evaluate(() => document.documentElement.dataset.icons); if (st !== 'wait') break; await page.waitForTimeout(100); }
    const fontOk = await page.evaluate(() => document.fonts.check('16px "Material Icons Outlined"') && [...document.fonts].some((x) => String(x.family).replace(/["']/g, '') === 'Material Icons Outlined' && x.status === 'loaded'));
    const colour = await page.evaluate(() => getComputedStyle(document.getElementById('probe')).color);
    const ok = st === 'ready' && colour !== 'rgba(0, 0, 0, 0)' && colour !== 'transparent';
    if (!fontOk) { console.log(`  - ${f} (${cold ? 'empty' : 'warm'} cache): the icon font did not load (no network?), skipped`); offline = true; }
    else { console.log(`  ${ok ? '✔' : '✘'} ${f.split('/').slice(-2).join('/')} (${cold ? 'empty' : 'warm'} cache): data-icons=${st} in ${Date.now() - t0} ms, icon colour ${colour}`); if (!ok) bad++; }
    await page.close(); if (cold) await ctx.close();
  }
}
await browser.close();
console.log(bad ? `icons check: ${bad} failed` : offline ? 'icons check: skipped (the icon font could not be loaded)' : 'icons check: ok');
process.exit(bad ? 1 : offline ? 2 : 0);
