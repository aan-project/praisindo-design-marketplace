#!/usr/bin/env node
// Name migration of the Praisindo Design System (skill design-system v2.117.0). Zero dependencies.
//   node scripts/migrate-names.mjs <project-dir>            dry run: lists every old name found (file:line old -> new), writes nothing
//   node scripts/migrate-names.mjs <project-dir> --apply    writes the new names into the files
//   node scripts/migrate-names.mjs <project-dir> --json     the findings as JSON
//   node scripts/migrate-names.mjs <project-dir> --docs     also looks at .md files (off by default)
// Reads renames.json (next to this script, or ../references/renames.json). It converts components (names in code), classes (selectors and
// class attributes) and custom properties (--name). It never touches node_modules, dist, build, .git or the rename map itself.
// What it cannot decide is listed under "review" (a merged component, a short name): the script reports those and does not change them blindly.
import { existsSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const mapFile = [join(here, 'renames.json'), join(here, '..', 'references', 'renames.json')].find(existsSync);
export const MAP = mapFile ? JSON.parse(readFileSync(mapFile, 'utf8')) : { components: [], classes: [], tokens: [] };

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Short or common words: converted only as a JSX tag or in an import list, never as plain text.
const AMBIGUOUS = new Set(['Av', 'DR', 'Section', 'Sugg']);
const CODE = /\.(tsx?|jsx?|mjs|html?)$/, STYLE = /\.css$/, DOC = /\.md$/;

const tokenRx = MAP.tokens.map((t) => ({ ...t, rx: new RegExp(`(?<![\\w-])${esc(t.old)}(?![\\w-])`, 'g') }));
const compRx = MAP.components.map((c) => ({ ...c, amb: AMBIGUOUS.has(c.old), rx: new RegExp(`(?<![\\w$.-])${esc(c.old)}(?![\\w$-])`, 'g'),
  tag: new RegExp(`(<\\/?)${esc(c.old)}(?=[\\s/>])`, 'g') }));
const clsRx = MAP.classes.map((c) => ({ ...c, sel: new RegExp(`(?<![\\w-])\\.${esc(c.old)}(?![\\w-])`, 'g') }));
const clsByOld = new Map(MAP.classes.map((c) => [c.old, c.new]));
// .ccb is the badge of the accordion header only inside .acc / .cc; the .ccb of the phone country button stays. It is not in the map on purpose.

/** Replace the old class tokens inside one string whose content is only class names. */
const inClassString = (s) => /^[\w\s-]*$/.test(s) ? s.replace(/[\w-]+/g, (w) => clsByOld.get(w) ?? w) : s;

/** Returns the text converted and the list of changes [{line, kind, old, new}]. */
export function convert(text, file) {
  const changes = []; let out = text;
  const lineOf = (i) => text.slice(0, i).split('\n').length;
  const note = (kind, o, n, i) => changes.push({ line: lineOf(i), kind, old: o, new: n });
  const sub = (rx, repl, kind, label) => { out = out.replace(rx, (m, ...a) => { const i = a[a.length - 2]; const r = repl(m, ...a); if (r !== m) note(kind, label(m), label(r), typeof i === 'number' ? i : 0); return r; }); };

  for (const t of tokenRx) sub(t.rx, () => t.new, 'token', (x) => x);
  // the colour names without the dashes (the token engine writes set('color-foreground-neutral-subtle-4', ...) and swatch names on a page)
  for (const t of tokenRx) if (t.old.startsWith('--color-')) sub(new RegExp(`(?<![\\w-])${esc(t.old.slice(2))}(?![\\w-])`, 'g'), () => t.new.slice(2), 'token', (x) => x);
  if (CODE.test(file)) for (const l of MAP.literals || []) sub(new RegExp(esc(l.old), 'g'), () => l.new, 'token', (x) => x);
  if (CODE.test(file) || DOC.test(file)) {
    for (const c of compRx) {
      if (c.amb) {
        sub(c.tag, (m, p) => p + c.new, 'component', (x) => x);
        // import { A, B } from '...'
        sub(/import\s*\{([^}]*)\}\s*from/g, (m, list) => m.replace(new RegExp(`(?<![\\w$])${esc(c.old)}(?![\\w$])`, 'g'), c.new), 'component', () => c.old);
      } else sub(c.rx, () => c.new, 'component', (x) => x);
    }
    if (DOC.test(file)) return finish();
    // class="a b", className="a b", className={`a ${x} b`}, className={'a'} and string arguments on a line that talks about classes
    sub(/(class(?:Name)?\s*=\s*)(["'])([^"'\n]*)\2/g, (m, pre, q, v) => { const r = inClassString(v); return r === v ? m : `${pre}${q}${r}${q}`; }, 'class', (x) => x);
    sub(/(class(?:Name)?\s*=\s*\{\s*)`([^`]*)`/g, (m, pre, v) => { const r = v.split(/(\$\{[^}]*\})/).map((p) => p.startsWith('${') ? p : inClassString(p)).join(''); return r === v ? m : `${pre}\`${r}\``; }, 'class', (x) => x);
    sub(/^(?=.*(?:class|classList|className)).*$/gm, (line) => line.replace(/(['"`])([\w\s-]+)\1/g, (m, q, v) => { const r = inClassString(v); return r === v ? m : `${q}${r}${q}`; }), 'class', (x) => x.trim().slice(0, 60));
  }
  return finish();
  function finish() {
    // two names that became one (ErrState and ErrorState, WoCard and Card) leave a repeated name in an import list: keep it once
    if (CODE.test(file)) out = out.replace(/import\s*(type\s+)?\{([^}]*)\}\s*from/g, (m, ty, list) => { const parts = list.split(',').map((x) => x.trim()).filter(Boolean), seen = new Set(), uniq = parts.filter((x) => (seen.has(x) ? false : (seen.add(x), true))); return uniq.length === parts.length ? m : `import ${ty || ''}{ ${uniq.join(', ')} } from`; });
    if (CODE.test(file) || STYLE.test(file) || DOC.test(file)) for (const c of clsRx) sub(c.sel, () => '.' + c.new, 'class', (x) => x);
    return { text: out, changes };
  }
}

const SKIP = new Set(['node_modules', 'dist', 'build', '.git', 'coverage', '.vite']);
export function walkFiles(root, docs = false) {
  const files = [];
  (function walk(d) {
    for (const n of readdirSync(d)) {
      const p = join(d, n); let s; try { s = statSync(p); } catch { continue; }
      if (s.isDirectory()) { if (!SKIP.has(n)) walk(p); }
      else if ((CODE.test(n) || STYLE.test(n) || (docs && /\.md$/.test(n))) && n !== 'renames.json' && n !== 'migrate-names.mjs') files.push(p);
    }
  })(root);
  return files;
}

/** Findings only (no write): used by the audit (check RN-01). */
export function findOld(text, file) { return convert(text, file).changes; }

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = process.argv[2];
  if (!root || root.startsWith('--') || !existsSync(root)) { console.error('usage: node scripts/migrate-names.mjs <project-dir> [--apply] [--json] [--docs]'); process.exit(2); }
  const apply = process.argv.includes('--apply'), docs = process.argv.includes('--docs'), json = process.argv.includes('--json');
  const all = []; let touched = 0;
  for (const f of walkFiles(root, docs)) {
    const src = readFileSync(f, 'utf8'), { text, changes } = convert(src, f);
    if (!changes.length) continue;
    touched++;
    for (const c of changes) all.push({ file: relative(root, f), ...c });
    if (apply && text !== src) writeFileSync(f, text);
  }
  // a file named after an old component (RowMenu.tsx): its imports were converted, so the file is renamed too
  const compNew = new Map(MAP.components.filter((c) => !AMBIGUOUS.has(c.old)).map((c) => [c.old, c.new]));
  for (const f of walkFiles(root, false)) {
    const m = basename(f).match(/^([A-Za-z]+)\.(tsx?|jsx?|mjs)$/);
    if (!m || !compNew.has(m[1])) continue;
    const to = join(dirname(f), compNew.get(m[1]) + '.' + m[2]);
    if (existsSync(to)) { all.push({ file: relative(root, f), line: 0, kind: 'file', old: basename(f), new: basename(to) + ' (exists: merge by hand)' }); continue; }
    all.push({ file: relative(root, f), line: 0, kind: 'file', old: basename(f), new: basename(to) });
    if (apply) renameSync(f, to);
  }
  if (json) console.log(JSON.stringify(all, null, 1));
  else {
    for (const c of all) console.log(`${c.file}:${c.line}  ${c.kind}  ${c.old} -> ${c.new}`);
    console.log(`\n${apply ? 'Converted' : 'Found'} ${all.length} old name(s) in ${touched} file(s).${apply ? '' : ' Nothing was written; run again with --apply.'}`);
    const rv = (MAP.review || []);
    if (rv.length) { console.log('\nCheck by hand after the conversion:'); for (const r of rv) console.log(`- ${r.old} -> ${r.new}: ${r.why}`); }
    console.log('Then run: npx tsc --noEmit (or your build), node scripts/audit.mjs <project-dir>, and look at the pages.');
  }
}
