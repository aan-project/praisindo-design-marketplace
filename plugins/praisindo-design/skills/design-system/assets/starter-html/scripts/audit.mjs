#!/usr/bin/env node
// Praisindo Design System audit (skill design-system v2.184.1). Zero dependencies: node scripts/audit.mjs <project-dir> [--json] [--strict]
// Scans a web project for rule violations that a script can see, and checks that the mandatory outputs exist. It reports; it never changes a file.
// Findings are classified Blocker / Fix / Cleanup (see references/audit.md). Exit code 1 when there is a Blocker (or any finding with --strict).
// What it cannot see (visual checks, states, copy, contrast of composed screens) is listed at the end: check those by hand or with a browser.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { convert } from './migrate-names.mjs';

const args = process.argv.slice(2);
const root = args.find((a) => !a.startsWith('--')) || '.';
const asJson = args.includes('--json'), strict = args.includes('--strict');
if (!existsSync(root)) { console.error('No such directory: ' + root); process.exit(2); }

const SKIP_DIR = new Set(['node_modules', 'dist', 'build', '.git', '.next', 'coverage', 'optional', '.vite']);
const files = [];
(function walk(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n), s = statSync(p);
    if (s.isDirectory()) { if (!SKIP_DIR.has(n)) walk(p); } else files.push(p);
  }
})(root);
const rel = (p) => relative(root, p).split(sep).join('/');
const ext = (p) => (p.match(/\.([a-z0-9]+)$/i)?.[1] || '').toLowerCase();
const CODE = new Set(['ts', 'tsx', 'js', 'jsx', 'mjs', 'html', 'vue', 'svelte']);
const STYLE = new Set(['css', 'scss']);
// the design system itself (tokens, stylesheets, components, the Design and Branding pages of the starter) is allowed to hold literals; a project must not edit it,
// and its own components live outside `design-system/` (for example src/components/)
const DS_OWN = /(^|\/)(scripts|design-system|features\/design|features\/branding|js\/tokens|css|branding\/brand\.ts|js\/brand\/brand\.js|pages\/(design\.(en|id)\.html|branding\.js|design\.js)|i18n\.js|i18n\/[a-z]+\.json)(\/|$|\.)/;
const text = (p) => { try { return readFileSync(p, 'utf8'); } catch { return ''; } };

const F = [];   // { cls, rule, file, line, msg }
const add = (cls, rule, file, line, msg) => F.push({ cls, rule, file, line, msg });
const lines = (s) => s.split('\n');

for (const p of files) {
  const e = ext(p), r = rel(p);
  if (!CODE.has(e) && !STYLE.has(e)) continue;
  if (DS_OWN.test(r) || /\.(test|spec)\./.test(r) || /\.d\.ts$/.test(r)) continue;
  // the loading skeleton of index.html (LD-01) runs before the tokens exist: its own style block (the one with .boot-s) keeps literal sizes, greys and times and is not read as project code
  const src = text(p).replace(/<style>(?=(?:(?!<\/style>)[\s\S])*\.boot-s)[\s\S]*?<\/style>/, (x) => x.replace(/[^\n]/g, ' ')), L = lines(src);
  // RN-01: a name that the design system renamed (component, class, custom property): the project was built with an older skill; node scripts/migrate-names.mjs converts it
  for (const c of convert(src, p).changes) add('Fix', 'RN-01', r, c.line, `${c.old} was renamed to ${c.new}: run node scripts/migrate-names.mjs <project> --apply`);
  L.forEach((ln, i) => {
    const n = i + 1, code = ln.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '');
    if (/^\s*(\/\/|\*|\/\*)/.test(ln)) return;
    // BD-15: a descendant rule on span or * that sets a colour or a size recolours the label of every badge, chip and tooltip inside the container; name the texts it means (`.list>li>span`)
    if (STYLE.has(e) && /(^|[,}\s])[^{}]*[^>+~\s]\s+(span|\*)\s*(,[^{]*)?\{[^}]*\b(color|font-size)\s*:/.test(code)) add('Fix', 'BD-15', r, n, 'a descendant `span` or `*` rule with color or font-size reaches the label of a badge: name the texts it means (.list>li>span) and never `.container span`');
    // literal colours (CODE-02)
    if (/#[0-9a-fA-F]{3,8}\b/.test(code) && !/&#\d+;|href="#|href='#|#\/|id="#|['"`]#[a-z-]+['"`]|url\(#/.test(code) && /['":(\s,]#[0-9a-fA-F]{3,8}\b/.test(code)) add('Fix', 'CODE-02', r, n, 'literal hex colour: use a var(--color-...) token');
    else if (/\b(rgb|rgba|hsl|hsla)\(\s*\d/.test(code)) add('Fix', 'CODE-02', r, n, 'literal rgb/hsl colour: use a var(--color-...) token');
    // radius, font size, shadow literals
    if (/border-radius\s*:\s*(?!0\b|50%|var\()[^;"'`}]+/.test(code) || /borderRadius\s*:\s*['"]?\d/.test(code)) add('Fix', 'CODE-02', r, n, 'literal border-radius: use --r-card / --r-badge / --r-pill');
    if (/font-size\s*:\s*\d+(\.\d+)?(px|rem|em)/.test(code) || /fontSize\s*:\s*['"]?\d/.test(code)) add('Fix', 'CODE-02', r, n, 'literal font-size: use a --fs-* token');
    // letter-spacing comes from the tokens only (TH-12: 2% with Figtree, 0 with any other brand font, written by buildTokens)
    if (/letter-spacing\s*:\s*(?!0(?![.\d])|normal\b|var\()[^;"'`}]+/.test(code) || /letterSpacing\s*:\s*['"]?(?!0(?![.\d])|normal\b|var\()[\d.-]/.test(code)) add('Fix', 'TH-12', r, n, 'literal letter-spacing: the body letter-spacing comes from the tokens (--ls), never by hand');
    if (/box-shadow\s*:\s*(?!none|var\()/.test(code) || /boxShadow\s*:\s*['"](?!none|var\()/.test(code)) add('Fix', 'CODE-02', r, n, 'literal box-shadow: use an elevation token');
    // line-height unitless (LY)
    if (/line-height\s*:\s*\d+(\.\d+)?\s*[;"'}]/.test(code) || /lineHeight\s*:\s*['"]?\d+(\.\d+)?['"]?\s*[,}]/.test(code)) add('Fix', 'LY-03', r, n, 'unitless line-height: use a --lh-* token');
    // off-grid px (LY-01..03): padding, margin, gap, offsets, width/height
    for (const m of code.matchAll(/(?:^|[\s{;'"`])(padding|margin|gap|row-gap|column-gap|top|left|right|bottom|width|height|min-width|min-height|max-width|max-height|line-height)(?:-(?:top|right|bottom|left|inline|block))?\s*:\s*([^;}"'`]+)/g)) {
      for (const v of m[2].matchAll(/(-?\d+(?:\.\d+)?)px/g)) { const px = Math.abs(parseFloat(v[1])); if (px && px % 4 !== 0 && ![1, 2, 14, 18, 20].includes(px)) add('Cleanup', 'LY-01', r, n, `off-grid ${m[1]}: ${v[0]} is not a multiple of 4`); }
    }
    // style objects in TSX: padding: 10, gap: 6 ...
    for (const m of code.matchAll(/\b(padding|margin|gap|top|left|right|bottom|width|height)\s*:\s*(\d+)\s*[,}]/g)) { const px = +m[2]; if (px && px % 4 !== 0 && ![1, 2].includes(px)) add('Cleanup', 'LY-01', r, n, `off-grid ${m[1]}: ${px} is not a multiple of 4`); }
    // bold tag, focus removal, css-only / data tooltips, dot badges
    if (/<b[\s>]/.test(code)) add('Cleanup', 'CODE-01', r, n, '<b> tag: use a weight class (fw6)');
    if (/outline\s*:\s*(none|0)\b/.test(code) && !/:focus-visible|:focus\s*\{[^}]*outline-offset/.test(ln)) add('Fix', 'AX-01', r, n, 'outline removed: the focus ring (2px --color-border-brand-strong) must stay');
    if (/data-tip\b|data-tooltip\b/.test(code)) add('Fix', 'CD-07', r, n, 'home-made tooltip: use the Tooltip component');
    if (/DotBadge|bdg-dot|class(Name)?=["'][^"']*\bdot\b/.test(code)) add('Fix', 'BD-01', r, n, 'dot badge: there is one soft Badge, without an icon');
    // storage outside the storage module
    if (/\b(localStorage|sessionStorage|indexedDB)\b/.test(code) && !/(reactStorage|brandStore|prefs)\.(ts|js)$/.test(r)) add('Cleanup', 'TH-03', r, n, 'direct Web Storage use: go through the storage module (reactStorage.ts / prefs.js)');
    // home-made alert on mount is hard to see by script: flag only the obvious literal
    if (/dangerouslySetInnerHTML/.test(code) && e !== 'tsx') add('Cleanup', 'SK-01', r, n, 'dangerouslySetInnerHTML: escape dynamic strings or avoid it');
  });
}

// ---- page patterns (skill v2.184.1): forms, list pages, buttons, alerts. File level, on the markup of JSX / TSX and of HTML (also HTML built in JS template strings).
const enDict = (() => { for (const f of ['src/i18n/en.json']) { try { return JSON.parse(text(join(root, f))); } catch { /* none */ } } return {}; })();
const lineAt = (src, i) => src.slice(0, i).split('\n').length;
const allowed = (src) => /\/\*\s*ds-allow:\s*\S[^*]*\*\/|<!--\s*ds-allow:\s*\S.*?-->/.test(src);
/** JSX / HTML start tags of the given names: { name, attrs, i }. Braces and quotes are skipped, so `onClick={() => a > b}` stays inside the tag. */
function tags(src, names) {
  const out = [], re = new RegExp(`<(${names})(?=[\\s/>])`, 'g');
  for (let m; (m = re.exec(src));) {
    let j = m.index + m[0].length, d = 0, q = '';
    for (; j < src.length; j++) {
      const c = src[j];
      if (q) { if (c === q && src[j - 1] !== '\\') q = ''; continue; }
      if (c === '"' || c === "'" || c === '`') { if (d || /[=\s]/.test(src[j - 1])) q = c; continue; }
      if (c === '{') d++; else if (c === '}') d--; else if (c === '>' && d <= 0) break;
    }
    out.push({ name: m[1], attrs: src.slice(m.index + m[0].length, j), i: m.index });
  }
  return out;
}
const prop = (attrs, p) => new RegExp(`(^|\\s)${p}(?=[\\s=/>]|$)`).test(attrs);
/** The block of the element that starts at index i (balanced on its tag name). */
function block(src, i, tag = 'div') {
  const re = new RegExp(`<${tag}[\\s>]|</${tag}>`, 'g'); re.lastIndex = i; let d = 0;
  for (let m; (m = re.exec(src));) { d += m[0][1] === '/' ? -1 : 1; if (!d) return src.slice(i, m.index + m[0].length); }
  return src.slice(i);
}
/** HTML split into the parts a reader sees on first open: templates other than data-main="default" are states after an action. */
const firstOpen = (src) => src.replace(/<template data-(?:main="(?!default")[^"]*"|ov="[^"]*")>[\s\S]*?<\/template>/g, (x) => x.replace(/[^\n]/g, ' '));
const FIELD = 'Input|Textarea|PhoneInput|DateField|PasswordInput|MultiSelect|TagInput|GroupedNumberInput|MoneyInput|Select|SegmentedControl';

for (const p of files) {
  const e = ext(p), r = rel(p);
  if (!['tsx', 'jsx', 'html', 'js', 'vue', 'svelte'].includes(e)) continue;
  if (DS_OWN.test(r) || /\.(test|spec)\./.test(r)) continue;
  const raw = text(p).replace(/<style>(?=(?:(?!<\/style>)[\s\S])*\.boot-s)[\s\S]*?<\/style>/, (x) => x.replace(/[^\n]/g, ' ')), jsx = e === 'tsx' || e === 'jsx';   // the loading skeleton of index.html is not project code (LD-01)
  // comments do not count (blanked with spaces so that line numbers stay); the ds-allow exception is read from the raw text
  const src = e === 'html' ? raw.replace(/<!--[\s\S]*?-->/g, (x) => x.replace(/[^\n]/g, ' ')) : raw.replace(/\/\*[\s\S]*?\*\/|(^|[^:'"`\\])\/\/[^\n]*/g, (x) => x.replace(/[^\n]/g, ' '));
  // DK-27: ONE rule for a form page. A page with a Back arrow (onBack) and a Save / Submit / Create button is a form page: its buttons are the card of actions without a header in the right column (FormShell), never the `footer` of a Card, and
  // every group of fields is its own Card (never one Card with several GroupTitle captions). Plain HTML: the same on a page with a breadcrumb (`.cf` card footer with Save, a card with two `.grpt` captions). Exception: /* ds-allow: <reason> */
  if (jsx && /\bonBack=/.test(src) && !allowed(raw) && /(label=\{?\s*t\(['"`][^'"`)]*(save|submit|create)|label=["'`][^"'`]*\b(save|submit|create)\b)/i.test(src)) {
    for (const t of tags(src, 'Card')) if (prop(t.attrs, 'footer') && /<Button\b|<button\b/.test(t.attrs)) add('Fix', 'DK-27', r, lineAt(src, t.i), 'the buttons of a form page are the footer of a Card: they are the card of actions without a header in the right column (FormShell, DK-17, DK-24, DK-27)');
    const gt = [...src.matchAll(/<GroupTitle\b/g)];
    if (gt.length >= 2) add('Fix', 'DK-27', r, lineAt(src, gt[1].index), 'a form page with several GroupTitle captions in one Card: one Card per group of fields and one step per group (FormShell groups, DK-17, DK-27)');
  }
  if (e === 'html' && /aria-label=["']Breadcrumb["']/.test(src) && !allowed(raw)) {
    for (const m of src.matchAll(/<div class=["']cf["'][^>]*>/g)) if (/\b(save|submit|create)\b/i.test(block(src, m.index))) add('Fix', 'DK-27', r, lineAt(src, m.index), 'the buttons of a form page are the footer of a Card: they are the card of actions without a header in the right column (DK-17, DK-24, DK-27)');
    for (const m of src.matchAll(/<section class=["'][^"']*\bcard\b[^"']*["'][^>]*>/g)) if ((block(src, m.index).match(/class=["']grpt["']/g) || []).length >= 2) add('Fix', 'DK-27', r, lineAt(src, m.index), 'a form page with several group captions (.grpt) in one card: one card per group of fields (DK-17, DK-27)');
  }
  // DK-29: Cancel is drawn by FormShell as the LAST button of the card of actions; the `footer` a page gives to a FormShell holds the buttons of its action only. Exception: /* ds-allow: <reason> */
  if (jsx && !allowed(raw)) for (const t of tags(src, 'FormShell')) {
    const m = /footer=\{([\s\S]*)/.exec(t.attrs)?.[1] || '';
    if (/(label=\{?\s*t\(['"`][^'"`)]*cancel|label=["'`]cancel["'`]|label=["'`]batal["'`])/i.test(m)) add('Fix', 'DK-29', r, lineAt(src, t.i), 'a Cancel button in the footer of a FormShell: FormShell draws Cancel itself, last at the bottom of the card of actions (DK-29); the footer holds the action only');
  }
  // BD-02: a badge never has an icon (owner 2026-11-18): no `icon` and no `noIcon` on a Badge, no icon element inside a `.bdg` of hand-written markup. Exception: /* ds-allow: <reason> */
  if (jsx && !allowed(raw)) for (const t of tags(src, 'Badge')) if (prop(t.attrs, 'icon') || prop(t.attrs, 'noIcon')) add('Fix', 'BD-02', r, lineAt(src, t.i), 'a Badge with `icon` or `noIcon`: the badge has no icon any more (BD-02)');
  if (e === 'html' && !allowed(raw)) for (const m of src.matchAll(/<span class=["'][^"']*\bbdg\b[^"']*["'][^>]*>\s*<span class=["'][^"']*\bic\b/g)) add('Fix', 'BD-02', r, lineAt(src, m.index), 'an icon inside a badge: the badge has no icon any more (BD-02)');
  // FM-01: every labelled field of a form declares `req` (red *) or `opt` ("Optional"); a Select / SegmentedControl with a `label` is a form field too; a search box is not a form field
  if (jsx) for (const t of tags(src, FIELD)) {
    if (!prop(t.attrs, 'label') || /type=["']search["']/.test(t.attrs)) continue;
    if (/setPref\(/.test(t.attrs)) continue;   // a setting of My Preferences applies at once (PP-04): it is not a field of a form
    if (t.name === 'SegmentedControl' && !allowed(raw)) add('Fix', 'FM-17', r, lineAt(src, t.i), '<SegmentedControl> with a label is a form field that picks one value: use <Select> (FM-17); a segmented control is for a view, a period or Match all / any. Exception: /* ds-allow: <reason> */');
    if (!prop(t.attrs, 'req') && !prop(t.attrs, 'opt')) add('Fix', 'FM-01', r, lineAt(src, t.i), `<${t.name}> without req or opt: mark it required (req, red *) or optional (opt)`);
  }
  // FM-01 (markup by hand): a .fld whose label has no .req / .opt; a .req label whose control has no aria-required
  for (const m of src.matchAll(/<div class(?:Name)?=["'`]fld\b[^"'`]*["'`][^>]*>/g)) {
    const b = block(src, m.index), lab = /<label\b[\s\S]*?<\/label>/.exec(b)?.[0] || '';
    const ctl = /<(input|textarea)\b(?![^>]*type=["'](?:search|checkbox|radio|hidden)["'])[^>]*>/.exec(b)?.[0];
    if (!ctl || !lab || /<FieldLabel\b/.test(lab)) continue;
    const isReq = /class(Name)?=["']req["']/.test(lab);
    if (!isReq && !/class(Name)?=["']opt["']/.test(lab)) add('Fix', 'FM-01', r, lineAt(src, m.index), 'field label without the required (*) or optional mark');
    if (isReq && !/aria-required/.test(ctl)) add('Fix', 'FM-01', r, lineAt(src, m.index), 'required field without aria-required="true" on its control');
  }
  // FM-17 (markup by hand): a .fld whose control is a segmented control (.sgc) picks one value in a form: it is a Select by default
  for (const m of src.matchAll(/<div class(?:Name)?=["'`]fld\b[^"'`]*["'`][^>]*>/g)) {
    const b = block(src, m.index);
    if (/<label\b/.test(b) && /class(?:Name)?=["'`][^"'`]*\bsgc\b/.test(b) && !allowed(raw) && !/setPref\(/.test(src)) add('Fix', 'FM-17', r, lineAt(src, m.index), 'a form field with a segmented control: use a Select (FM-17); a segmented control is for a view, a period or Match all / any. Exception: <!-- ds-allow: <reason> -->');
  }
  // LD-01: the entry page of the application (index.html with the #root or #app) keeps the loading skeleton: the icons are skeleton blocks until the icon font is loaded (data-icons) and the font stylesheets do not block the first paint
  if (e === 'html' && /(^|\/)index\.html$/.test(r) && /id=["'](root|app)["']/.test(src) && !allowed(raw)) {
    if (!/data-icons|dataset\.icons/.test(src)) add('Fix', 'LD-01', r, 1, 'index.html has no loading state for the icons: set data-icons="wait" until the icon font is loaded (the DS CSS draws skeleton blocks), the word of a ligature must never show');
    if (/Array\.prototype\.\w+\.call\(\s*document\.fonts/.test(src)) add('Fix', 'LD-01', r, 1, 'the icon font detector walks document.fonts (a FontFaceSet, a Set without length) with an array method: nothing is ever found and data-icons stays wait, then failed. Use Array.from(document.fonts) or for...of');
    if (/<link[^>]*fonts\.googleapis\.com[^>]*rel=["']stylesheet["'](?![^>]*media=["']print["'])[^>]*>|<link[^>]*rel=["']stylesheet["'][^>]*fonts\.googleapis\.com(?![^>]*media=["']print["'])[^>]*>/.test(src.replace(/<noscript>[\s\S]*?<\/noscript>/g, ''))) add('Fix', 'LD-01', r, 1, 'a font stylesheet blocks the first paint: load it with media="print" onload="this.media=\'all\'" so the skeleton shows at once');
  }
  // DK-01: adding or editing data is a form PAGE, not a drawer. A drawer with two or more form fields and a Save / Add / Create / Submit / Update button is a finding; filter, column and apply drawers are not. Exception: /* ds-allow: <reason> */
  if (jsx && !allowed(raw)) for (const m of src.matchAll(/<Drawer\b/g)) {
    const b = block(src, m.index, 'Drawer');
    const fields = (b.match(new RegExp(`<(${FIELD})\\b`, 'g')) || []).length;
    if (fields >= 2 && /(footer=\{[\s\S]*?(\bsave|\bsubmit|\bcreate|\badd\b|\bupdate)|label=["'{`][^"'}`]*\b(save|submit|create|add|update)\b)/i.test(b) && !/tbl\.(adv|apply)|\bfilter|\bcolumns?\b/i.test(b)) add('Fix', 'DK-01', r, lineAt(src, m.index), 'a form with Save in a Drawer: adding or editing data is a form page (references/decisions.md); or write /* ds-allow: <reason> */');
  }
  // TB-06, TB-03, TB-10: a page with a data table has the toolbar (search combo + Advanced filter), pagination and stat cards. Exception: /* ds-allow: <reason> */
  const view = e === 'html' ? firstOpen(src) : src;
  if (/<table[\s>]|className=["'`]tw\b|class=["'`]tw\b|<Table\b/.test(view) && !allowed(raw)) {
    const ln = lineAt(src, view.search(/<table[\s>]|className=["'`]tw\b|class=["'`]tw\b|<Table\b/));
    if (!/<SearchBar\b|class=["'`]combo\b/.test(view) || !/filter_list|tbl\.adv|Advanced filter|Filter lanjutan/.test(view)) add('Fix', 'TB-06', r, ln, 'table without the standard toolbar (SearchBar + Advanced filter); or write /* ds-allow: <reason> */');
    if (!/<Pagination\b|class=["'`]pgn\b/.test(view)) add('Fix', 'TB-03', r, ln, 'table without Pagination; or write /* ds-allow: <reason> */');
    if (!/<StatCards\b|class=["'`]stats\b/.test(view)) add('Fix', 'TB-10', r, ln, 'table page without StatCards above the table; or write /* ds-allow: <reason> */');
  }
  // BT-04: an icon-only button has an accessible name
  if (jsx) for (const t of tags(src, 'Button')) {
    if (prop(t.attrs, 'icon') && !prop(t.attrs, 'label') && !prop(t.attrs, 'aria')) add('Fix', 'BT-04', r, lineAt(src, t.i), 'icon-only Button without aria');
  }
  for (const m of src.matchAll(/<button\b([^>]*)>\s*<span class(?:Name)?=["'][^"']*material-icons[^"']*["'][^>]*>[^<]*<\/span>\s*<\/button>/g)) {
    if (!/aria-label(ledby)?=/.test(m[1])) add('Fix', 'BT-04', r, lineAt(src, m.index), 'icon-only <button> without aria-label');
  }
  // BT-02: the button that applies a panel says "Apply", never "Done"
  const DONE = /^(done|selesai)$/i;
  if (jsx) for (const t of tags(src, 'Button|LinkButton')) {
    const lit = /label=["']([^"']+)["']/.exec(t.attrs)?.[1], key = /label=\{t\(['"]([\w.]+)['"]\)\}/.exec(t.attrs)?.[1];
    if ((lit && DONE.test(lit)) || (key && DONE.test(String(enDict[key] ?? '')))) add('Fix', 'BT-02', r, lineAt(src, t.i), 'button label "Done": the execution button says "Apply"');
  }
  for (const m of src.matchAll(/class(?:Name)?=["'`]df\b/g)) {
    if (/>\s*(Done|Selesai)\s*<\/button>/.test(block(src, src.lastIndexOf('<', m.index)))) add('Fix', 'BT-02', r, lineAt(src, m.index), 'panel button "Done": the execution button says "Apply"');
  }
  // TB-09: at most three buttons in the action column of a table
  for (const m of src.matchAll(/<div class(?:Name)?=["'`]acts\b[^>]*>/g)) {
    const n = (block(src, m.index).match(/<(Button|LinkButton|button|a)[\s>]/g) || []).length;
    if (n > 3) add('Fix', 'TB-09', r, lineAt(src, m.index), `${n} buttons in the action column: at most View, one text action and the more menu`);
  }
  // CD-08: no Alert on screen when a page or drawer opens; an Alert is rendered from a condition (error, stale data, denied, blocking status, validation after the user acted)
  if (jsx) for (const t of tags(src, 'Alert')) {
    if (/intent=["']info["']/.test(t.attrs)) continue;   // the information note of a page or drawer that is a box of its own is an info Alert (owner decision 2026-11-11, CD-08)
    const before = src.slice(Math.max(0, t.i - 200), t.i).replace(/\s+$/, '').replace(/\(\s*$/, '').replace(/<>\s*$/, '').replace(/\s+$/, '');
    if (!/(\?|&&|\|\||:|=>|return|\{\s*\})$/.test(before)) add('Fix', 'CD-08', r, lineAt(src, t.i), '<Alert> rendered unconditionally: an Alert shows only for a real condition, never on first open');
  }
  // GN-03: a badge explains itself in a tooltip (BD-13): domain / what / tip, or the spread of badgeProps(...)
  if (jsx) for (const t of tags(src, 'Badge')) if (!/\b(domain|what|tip)=|\{\.\.\./.test(t.attrs)) add('Fix', 'GN-03', r, lineAt(src, t.i), '<Badge> without domain, what or tip: every badge has a hover tooltip (BD-13); use {...badgeProps(domain, value)}');
  // GN-05: the motion comes from the design system; a project has no keyframes and no transition or animation with a literal time (MO-04)
  lines(src).forEach((ln, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(ln)) return;
    if (/@keyframes\s/.test(ln)) add('Fix', 'GN-05', r, i + 1, '@keyframes in project code: the motion layer of the design system is the only one (MO-04)');
    else if (/\b(transition|animation)(-duration)?\s*:\s*[^;{}]*\b\d*\.?\d+m?s\b/.test(ln) || /\b(transition|animation)(Duration)?\s*:\s*['"`][^'"`]*\b\d*\.?\d+m?s\b/.test(ln)) add('Fix', 'GN-05', r, i + 1, 'transition / animation with a literal time: use --dur-fast, --dur-base or --dur-slow and --ease-out (MO-04)');
  });
  if (e === 'html') for (const m of firstOpen(src).matchAll(/class=["']al(?! i-info)\b/g)) add('Fix', 'CD-08', r, lineAt(src, m.index), 'Alert in the markup of a page on first open');
}

// GN-06: remove what is not needed any more. The starter example pages (`ex-*` routes and the Examples menu entry) are deleted once real product pages exist.
{
  const navFile = ['src/app/nav.config.ts', 'js/nav.config.js'].find((p) => existsSync(join(root, p)));
  if (navFile) {
    const nav = text(join(root, navFile)), keys = [...nav.matchAll(/^\s*'?([a-z][a-z0-9-]*)'?\s*:\s*\{\s*layout\b/gm)].map((m) => m[1]);
    const real = keys.filter((k) => !/^ex-/.test(k) && !['home', 'branding', 'design', 'mylog'].includes(k)), ex = keys.filter((k) => /^ex-/.test(k));
    if (real.length && ex.length) add('Cleanup', 'GN-06', navFile, lineAt(nav, nav.indexOf("'" + ex[0] + "'")), `starter example routes (${ex.join(', ')}) are still there although real pages exist (${real.join(', ')}): delete the ex-* routes, their pages and the Examples menu entry`);
  }
}

// i18n parity
const dictPairs = [['src/i18n/en.json', 'src/i18n/id.json']];
for (const [a, b] of dictPairs) {
  const pa = join(root, a), pb = join(root, b);
  if (existsSync(pa) && existsSync(pb)) {
    try {
      const A = Object.keys(JSON.parse(text(pa))), B = Object.keys(JSON.parse(text(pb))), sa = new Set(A), sb = new Set(B);
      for (const k of A) if (!sb.has(k)) add('Fix', 'DS-03', b, 0, `missing Indonesian key: ${k}`);
      for (const k of B) if (!sa.has(k)) add('Fix', 'DS-03', a, 0, `missing English key: ${k}`);
    } catch (x) { add('Fix', 'DS-03', a, 0, 'dictionary is not valid JSON'); }
  }
}

// mandatory outputs
const all = files.map(rel);
const has = (re) => all.some((f) => re.test(f));
const grepAny = (re, exts = CODE) => files.some((p) => CODE.has(ext(p)) && !DS_OWN.test(rel(p)) && re.test(text(p)));
const out = {
  shell: grepAny(/class(Name)?=\{?["'`]shell|id=["']shell["']/) && grepAny(/class(Name)?=\{?["'`][^"'`]*\bsb\b|<aside[^>]*\bsb\b|\.sb\b/),
  design: grepAny(/\bdesign\b['"]?\s*:\s*\{|route\s*===?\s*['"]design['"]|#\/design|path:\s*['"]\/?design/) || has(/design(Page|\.js)/i),
  branding: grepAny(/\bbranding\b['"]?\s*:\s*\{|#\/branding|path:\s*['"]\/?branding/) || has(/branding(Page|\.js)/i),
  adapter: has(/brandStore\.(ts|js)$/) || has(/brandHttp|adapter\.js$/),
  log: has(/docs\/design-system\/new-components\.md$/),
  changelog: has(/docs\/design-system\/changelog\.md$/),
};
if (!out.shell) add('Blocker', 'PJ-01', '(project)', 0, 'Praisindo shell not found (.shell > aside.sb): every application needs it');
if (!out.design) add('Blocker', 'PJ-02', '(project)', 0, 'Design System page not found (route "design")');
if (!out.branding) add('Blocker', 'PJ-03', '(project)', 0, 'Branding page not found (route "branding", linked from the menu of the user, rule NV-13)');
if (out.branding && !out.adapter) add('Blocker', 'PJ-04', '(project)', 0, 'Branding has no save adapter: it must save for real through the contract (references/branding.md)');
if (!out.log) add('Blocker', 'PJ-05', '(project)', 0, 'docs/design-system/new-components.md is missing');
if (!out.changelog) add('Cleanup', 'PJ-06', '(project)', 0, 'docs/design-system/changelog.md is missing (the "What\'s new" panel reads it)');

// NV-13: Branding and Design System are in the menu of the user (PROFILE_NAV), not in the sidebar menu (NAV)
for (const p of files) {
  if (!/(^|\/)nav\.config\.(ts|js)$/.test(rel(p)) || DS_OWN.test(rel(p))) continue;
  const navPart = text(p).split('PROFILE_NAV')[0];
  if (/\bk:\s*['"](branding|design)['"]/.test(navPart)) add('Fix', 'NV-13', rel(p), 1, 'Branding / Design System in the sidebar menu: they belong in the menu of the user (PROFILE_NAV)');
}
// MO-03: the root carries data-motion (set from motionOn()) so that the motion of the design system can stand still
if (files.some((p) => /(^|\/)(main\.(tsx|ts)|app\.js)$/.test(rel(p)) && !DS_OWN.test(rel(p))) && !grepAny(/dataset\.motion|data-motion/)) add('Cleanup', 'MO-03', '(project)', 0, 'the root element has no data-motion (main.tsx / app.js): set it from motionOn() so that motion stands still for reduced motion and automation');

// report
const order = { Blocker: 0, Fix: 1, Cleanup: 2 };
F.sort((x, y) => order[x.cls] - order[y.cls] || x.file.localeCompare(y.file) || x.line - y.line);
const count = (c) => F.filter((f) => f.cls === c).length;
if (asJson) { console.log(JSON.stringify({ root, scanned: files.length, counts: { Blocker: count('Blocker'), Fix: count('Fix'), Cleanup: count('Cleanup') }, mandatory: out, findings: F }, null, 2)); }
else {
  console.log(`# UI audit — ${root} — skill design-system v2.184.1\n\nScanned ${files.length} files. Blockers ${count('Blocker')}, Fixes ${count('Fix')}, Cleanups ${count('Cleanup')}.\n`);
  for (const c of ['Blocker', 'Fix', 'Cleanup']) {
    const list = F.filter((f) => f.cls === c);
    if (!list.length) continue;
    console.log(`## ${c === 'Fix' ? 'Fixes' : c + 's'}\n`);
    for (const f of list.slice(0, 200)) console.log(`- ${f.file}${f.line ? ':' + f.line : ''} [${f.rule}] ${f.msg}`);
    if (list.length > 200) console.log(`- ... and ${list.length - 200} more (use --json for the full list)`);
    console.log('');
  }
  console.log(`## Mandatory outputs\n\nShell: ${out.shell ? 'found' : 'MISSING'}\nDesign System page: ${out.design ? 'found' : 'MISSING'}\nBranding page: ${out.branding ? 'found' : 'MISSING'}\nBranding adapter (real saving): ${out.adapter ? 'found' : 'MISSING'}\nNew-component log: ${out.log ? 'found' : 'MISSING'}\nChangelog: ${out.changelog ? 'found' : 'missing'}\n`);
  console.log('## What this script did not check\n\nVisual result at 390px / light / dark, empty-loading-error states, aria labels of hand-made icon buttons, alerts that a condition shows on first open anyway, card inside card, whether a page matches its example page (references/migrate.md, page compliance check), badge vs chip choice, copy and language, contrast of composed screens (use scripts/contrast.mjs for brand colours), and whether Branding really persists. Check these by hand or with a browser.');
}
process.exit(count('Blocker') || (strict && F.length) ? 1 : 0);
