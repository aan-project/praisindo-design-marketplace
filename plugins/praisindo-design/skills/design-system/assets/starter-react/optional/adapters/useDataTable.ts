// React adapter for DataTables (blueprint section 4 / D4). The rules that keep React and the library from fighting over the DOM:
//   1. React renders the <table> and ALL its rows; the library only sorts and pages what is already there.
//   2. `order`, `page` and `rpp` are controlled by the caller. The adapter never keeps its own copy: a click on a header calls
//      `onOrder(key, dir)`, the caller changes its state, and the table is rebuilt.
//   3. The caller MUST key the ELEMENT THAT HOLDS the <table> (the `.tw` wrapper) with `dtKey(...)`, never the <table> itself.
//      DataTables moves the table into its own wrapper div, so React could not remove the <table> from its original parent
//      (NotFoundError, found by the first Mac run). A new key replaces the whole holder, so React never removes a table or a row
//      that the library moved or detached, and the library is destroyed right after.
//   4. init happens in a layout effect, destroy() in its cleanup, so the library never outlives the table.
import { useLayoutEffect, useRef, type RefObject } from 'react';
import { defaultDtLib } from './dtLib.ts';
import type { DtHandle, DtLib, SortDir } from './dtTypes.ts';
import { adapterStats } from './lifecycle.ts';

export type { DtLib, DtHandle, SortDir } from './dtTypes.ts';

/** Prototype hasDT(): is a table library available at all? */
export const hasDT = (lib: DtLib | null = defaultDtLib): boolean => !!lib;

/** Key for the element that holds the <table>: changes whenever the library must be rebuilt (sort, page, page size, columns, row identity or order). */
export const dtKey = (p: { keys: readonly string[]; order: readonly [string, SortDir]; page: number; rpp: number; ids: readonly string[] }): string =>
  [p.keys.join(','), p.order[0] + ':' + p.order[1], p.page, p.rpp, p.ids.join('|')].join('#');

const live = new WeakMap<HTMLTableElement, DtHandle>();

/** Prototype dtOrder(tbl): ids (from `input[data-id]`) of the rows in the library's applied order, or null when the table has no live instance. */
export function dtOrder(table: HTMLTableElement | null, attr = 'data-id'): string[] | null {
  const h = table ? live.get(table) : undefined;
  if (!h) return null;
  try {
    return h.appliedRows().map((n) => { const i = n.querySelector<HTMLInputElement>('input[' + attr + ']'); return i && i.getAttribute(attr); }).filter((x): x is string => !!x);
  } catch { return null; }
}

export interface UseDataTable {
  /** Column keys in display order, WITHOUT the selection / action columns (the prototype's `keys`). */
  keys: readonly string[];
  order: readonly [string, SortDir];
  /** 1-based. */
  page: number;
  rpp: number;
  /** Row identities in render order (what the caller puts in `dtKey`): a change rebuilds the library on the new table. */
  ids: readonly string[];
  /** Table has a trailing action column (prototype `hasA`, default true). */
  hasA?: boolean;
  /** Table has no leading selection column (prototype `noSel`, default false). */
  noSel?: boolean;
  /** The sort changed in the library (user clicked a header). Not called for the initial sort or when it equals the current one. */
  onOrder: (key: string, dir: SortDir) => void;
  /** Library failed to start (prototype `ui.dtFail = true`): the caller should render the table without it. */
  onFail?: (error: unknown) => void;
  lib?: DtLib | null;
}

export function useDataTable(ref: RefObject<HTMLTableElement | null>, o: UseDataTable): void {
  const cb = useRef(o); cb.current = o;
  const lib = o.lib === undefined ? defaultDtLib : o.lib;
  const sig = dtKey({ keys: o.keys, order: o.order, page: o.page, rpp: o.rpp, ids: o.ids }) + '|' + !!o.hasA + !!o.noSel;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !lib) return;
    const { keys, order, page, rpp, hasA = true, noSel = false } = cb.current;
    const off = noSel ? 0 : 1;
    const idx = Math.max(0, keys.indexOf(order[0])) + off;
    let handle: DtHandle;
    try {
      handle = lib.create(el, {
        orderIdx: idx, orderDir: order[1], pageLength: rpp, displayStart: (page - 1) * rpp,
        unsortable: hasA ? (noSel ? [keys.length] : [0, keys.length + 1]) : (noSel ? [] : [0]),
      });
    } catch (e) { console.error('[DataTables] the library could not start; the table is shown without it:', e); cb.current.onFail?.(e); return; }
    adapterStats.tableUp();
    live.set(el, handle);
    el.querySelectorAll('th.ck .dt-column-order, th.fr .dt-column-order').forEach((n) => n.remove());
    const stop = handle.onOrder(() => {
      const x = handle.order();
      if (!x) return;
      const k = keys[x[0] - off];
      const cur = cb.current.order;
      if (k && (k !== cur[0] || x[1] !== cur[1])) cb.current.onOrder(k, x[1]);
    });
    return () => {
      stop();
      live.delete(el);
      try { handle.destroy(); } catch { /* the table may already be detached */ }
      adapterStats.tableDown();
    };
    // `sig` covers keys, order, page, rpp, ids, hasA, noSel: exactly the inputs of the caller's table key (rule 3).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lib, sig]);
}
