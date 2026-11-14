// The search of the Design System by what is in the code (DS 2.83, rule DS-27, owner decision 2026-11-13): after the pages (name and alias, DS-22) the search lists the code names it finds in three more groups:
// the components of the code (`LinkButton`), the classes (`.chp-s`) and the tokens (`--color-text-secondary`). The index is read from the page itself (the examples of every page card and the loaded stylesheets),
// so it follows the code and nothing is listed by hand. Pure functions apart from `buildCodeIndex`, which reads a DOM.

export type CodeKind = 'comp' | 'class' | 'token';
export interface CodeHit { kind: CodeKind; name: string; /** the page the name is shown on (where it is used most) */ page: string; /** how many pages use it */ pages: number; /** 0 exact, 1 starts with, 2 holds */ rank: number }
export interface CodeIndex { classes: Map<string, Map<string, number>>; comps: Map<string, Map<string, number>>; tokens: string[] }

/** The classes of the documentation itself (the page frame, the example rows, the menu) are not the classes of the system. */
const DOC = /^(ds|dss$|dsx$|dsl$|dsv$)/;
const bump = (m: Map<string, Map<string, number>>, name: string, page: string) => { const p = m.get(name) ?? m.set(name, new Map()).get(name)!; p.set(page, (p.get(page) ?? 0) + 1); };

/** The page a token belongs to: the colour tokens on Color, the type tokens on Typography, and so on; a local token of a component goes to the page of that component. */
export function tokenPage(name: string): string {
  const n = name.replace(/^--/, '');
  if (/^color-|^int-/.test(n)) return 'colors';
  if (/^(fs|lh|ls|ff|fw)(-|$)/.test(n)) return 'type';
  if (/^(r|page-pad)(-|$)/.test(n)) return 'space';
  if (/^(dur|ease)(-|$)/.test(n)) return 'motion';
  if (/^card-gap/.test(n)) return 'card';
  if (/^drawer-pad/.test(n)) return 'drawer';
  if (/^dlg-/.test(n)) return 'modal';
  if (/^(tbl-|frozen-)/.test(n)) return 'table';
  if (/^seg-/.test(n)) return 'segmented';
  if (/^ring-/.test(n)) return 'widgets';
  if (/^tt-/.test(n)) return 'tooltip';
  if (/^kb-/.test(n)) return 'kanban';
  if (/^sign-/.test(n)) return 'start';
  if (/^hero-/.test(n)) return 'start';
  return 'colors';
}

/** The custom properties declared in the loaded stylesheets (a sheet that cannot be read is skipped). */
export function collectTokens(sheets: StyleSheetList | readonly CSSStyleSheet[] = typeof document !== 'undefined' ? document.styleSheets : []): string[] {
  const out = new Set<string>();
  const walk = (rules: CSSRuleList | undefined) => {
    if (!rules) return;
    for (const r of Array.from(rules)) {
      const st = (r as CSSStyleRule).style;
      if (st) for (let i = 0; i < st.length; i++) { const p = st.item(i); if (p.startsWith('--')) out.add(p); }
      walk((r as CSSGroupingRule).cssRules);
    }
  };
  for (const s of Array.from(sheets as ArrayLike<CSSStyleSheet>)) { try { walk(s.cssRules); } catch { /* a sheet of another origin */ } }
  if (typeof document !== 'undefined') document.querySelectorAll('style').forEach((st) => { for (const m of (st.textContent ?? '').matchAll(/(?<![\w-])(--[a-z][\w-]*)\s*:/g)) out.add(m[1]!); });   // the text of an inline style (where the browser does not list a custom property)
  return [...out].sort();
}

/** Reads the classes and the component names of the examples of every page card (`#ds-<id>`) of `root`. */
export function buildCodeIndex(root: ParentNode, pageIds: readonly string[], tokens: readonly string[] = collectTokens()): CodeIndex {
  const classes = new Map<string, Map<string, number>>(), comps = new Map<string, Map<string, number>>();
  for (const id of pageIds) {
    const card = root.querySelector('#ds-' + id); if (!card) continue;
    const body = card.querySelector('.cb'); if (!body) continue;
    body.querySelectorAll('*').forEach((el) => { for (const c of Array.from(el.classList)) if (c.length > 1 && !DOC.test(c)) bump(classes, c, id); });
    body.querySelectorAll('.dsx > .dsl').forEach((l) => {   // "Variant · Component prop": the words that start with a capital after the last " · "
      const t = l.textContent ?? '', tail = t.includes(' · ') ? t.slice(t.lastIndexOf(' · ') + 3) : '';
      for (const m of tail.matchAll(/\b([A-Z][A-Za-z0-9]{2,})\b/g)) bump(comps, m[1]!, id);
    });
    body.querySelectorAll('.dsapi tbody td:first-child').forEach((td) => { const m = /^\s*([A-Z][A-Za-z0-9]{2,})\b/.exec(td.textContent ?? ''); if (m) bump(comps, m[1]!, id); });
  }
  return { classes, comps, tokens: [...tokens] };
}

const norm = (s: string) => s.toLowerCase().replace(/^(\.|--)/, '').trim();
const rankOf = (name: string, q: string): number => { const n = norm(name); return n === q ? 0 : n.startsWith(q) ? 1 : n.includes(q) ? 2 : -1; };
const best = (pages: Map<string, number>) => [...pages].sort((a, b) => b[1] - a[1])[0]![0];
const byRank = (a: CodeHit, b: CodeHit) => a.rank - b.rank || b.pages - a.pages || a.name.length - b.name.length || (a.name < b.name ? -1 : 1);

/** The code names that match `q` (at least two characters), best match first, in the three groups. */
export function searchCode(idx: CodeIndex, q: string): { comps: CodeHit[]; classes: CodeHit[]; tokens: CodeHit[] } {
  const n = norm(q);
  if (n.length < 2) return { comps: [], classes: [], tokens: [] };
  const from = (m: Map<string, Map<string, number>>, kind: CodeKind): CodeHit[] => { const o: CodeHit[] = []; for (const [name, pages] of m) { const rank = rankOf(name, n); if (rank >= 0) o.push({ kind, name, page: best(pages), pages: pages.size, rank }); } return o.sort(byRank); };
  const tokens: CodeHit[] = []; for (const name of idx.tokens) { const rank = rankOf(name, n); if (rank >= 0) tokens.push({ kind: 'token', name, page: tokenPage(name), pages: 1, rank }); }
  return { comps: from(idx.comps, 'comp'), classes: from(idx.classes, 'class'), tokens: tokens.sort(byRank) };
}

/** The element of a page card to show for a code name: the first example that uses the class, the first row or API entry that names the component. */
export function findCodeTarget(card: ParentNode, hit: Pick<CodeHit, 'kind' | 'name'>): Element | null {
  if (hit.kind === 'class') return card.querySelector('.cb .' + hit.name.replace(/[^\w-]/g, '\\$&'));
  if (hit.kind === 'comp') {
    const row = [...card.querySelectorAll('.dsx')].find((x) => new RegExp('\\b' + hit.name + '\\b').test(x.querySelector('.dsl')?.textContent ?? ''));
    return row ?? [...card.querySelectorAll('.dsapi tbody tr')].find((r) => new RegExp('^\\s*' + hit.name + '\\b').test(r.querySelector('td')?.textContent ?? '')) ?? null;
  }
  return null;
}
