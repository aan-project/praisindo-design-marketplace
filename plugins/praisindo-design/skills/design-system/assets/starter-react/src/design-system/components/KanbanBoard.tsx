// Kanban board (docs/design-system/kanban-spec.md): one lane per column, cards stacked inside. Generic and presentational; no drag and drop (stages are automatic).
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { Badge } from './Badge';

/** `intent` and `icon` come from the central badge map (`badgeFor('oppStatus', key)`): the lane header is the one badge (rule BD-01, owner decision 13 of 2026-10-26). */
export interface KanbanColumn { key: string; label: string; intent: string; icon: string }
export interface KanbanBoardProps<T> {
  columns: readonly KanbanColumn[]; items: readonly T[]; columnOf: (item: T) => string; keyOf: (item: T) => string; renderCard: (item: T) => ReactNode;
  emptyText: string; aria?: string;
  /** The board takes the room under it in the window and scrolls inside itself, so the lane headers stay at its top (rule KB-13). Without it the board is as tall as its lanes, unless an ancestor sets `--kb-h`. */
  fit?: boolean;
}

/** Writes `--kb-top` (the distance from the top of the page to the board) on the board; the CSS turns it into the height limit. Measured again when the window or the page changes size (an alert above the board appears, the toolbar wraps). */
function useFit(ref: { current: HTMLElement | null }, on: boolean): void {
  useLayoutEffect(() => {
    const el = ref.current; if (!on || !el) return;
    const set = (): void => { el.style.setProperty('--kb-top', Math.round(el.getBoundingClientRect().top + window.scrollY) + 'px'); };
    set(); window.addEventListener('resize', set);
    const host = el.closest('main'), ro = typeof ResizeObserver !== 'undefined' && host ? new ResizeObserver(set) : null; if (ro && host) ro.observe(host);
    return () => { window.removeEventListener('resize', set); ro?.disconnect(); el.style.removeProperty('--kb-top'); };
  }, [on, ref]);
}

export function KanbanBoard<T>({ columns, items, columnOf, keyOf, renderCard, emptyText, aria = '', fit = false }: KanbanBoardProps<T>) {
  const ref = useRef<HTMLDivElement>(null); useFit(ref, fit);
  return (
    <div className="kb" ref={ref} role="group" aria-label={aria || undefined} data-testid="kanban">
      {columns.map((c) => {
        const col = items.filter((x) => columnOf(x) === c.key);
        return (
          <section key={c.key} className="kbl" aria-label={c.label} data-col={c.key}>
            <header className="kbh"><Badge label={c.label} intent={c.intent} icon={c.icon} /><span className="kbn" aria-label={String(col.length)}>{col.length}</span></header>
            {col.length
              ? <ul className="kbs">{col.map((x, i) => <li key={keyOf(x) + '#' + i}>{renderCard(x)}</li>)}</ul>
              : <div className="kbe">{emptyText}</div>}
          </section>);
      })}
    </div>);
}
