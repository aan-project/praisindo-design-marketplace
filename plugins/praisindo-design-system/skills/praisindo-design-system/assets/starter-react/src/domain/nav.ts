// Pure logic of the navigation components (ported from the prototype's Pagination(), the `pg` action, Wizard() and SegmentedControl()).

/** Page-number window shown by Pagination: at most five numbers, centred on the current page and pinned to the ends. */
export function pgWindow(page: number, pages: number): number[] {
  const w0 = Math.max(1, Math.min(page - 2, pages - 4)), w1 = Math.min(pages, w0 + 4);
  const out: number[] = [];
  for (let i = w0; i <= w1; i++) out.push(i);
  return out;
}

export type PgTarget = 'first' | 'prev' | 'next' | 'last' | number;
/** Prototype action `pg`: where a pagination button leads. */
export function pgTarget(v: PgTarget, page: number, pages: number): number {
  return v === 'first' ? 1 : v === 'last' ? pages : v === 'prev' ? Math.max(1, page - 1) : v === 'next' ? Math.min(pages, page + 1) : Number(v);
}

export type StepState = 'err' | 'done' | 'cur' | 'todo';
export const stepState = (i: number, cur: number, err?: boolean): StepState => (err ? 'err' : i < cur ? 'done' : i === cur ? 'cur' : 'todo');
export const stepBarWidth = (i: number, cur: number): number => (i < cur ? 100 : i === cur ? 50 : 0);
export const stepPad = (i: number): string => String(i + 1).padStart(2, '0');

/** SegmentedControl thumb position: index of the selected item, 0 when the value is unknown. */
export const segIndex = (items: readonly (readonly [string, ...unknown[]])[], val: string | undefined): number => Math.max(0, items.findIndex((x) => x[0] === val));

export const MD_INT: Record<string, string> = { success: 'success', info: 'info', progress: 'info', warning: 'warning', danger: 'danger', confirm: 'brand' };
export const MD_ICON: Record<string, string> = { success: 'check_circle', info: 'info', progress: 'schedule', warning: 'warning_amber', danger: 'error_outline', confirm: 'help_outline' };
export const MD_KINDS = ['success', 'info', 'progress', 'warning', 'danger', 'confirm'] as const;
/** Modal(): kind from `kind`, else from `tone` (brand → confirm); an unknown kind becomes confirm. */
export function modalKind(o: { kind?: string; tone?: string }): string {
  const k = o.kind || (o.tone === 'brand' ? 'confirm' : o.tone) || 'confirm';
  return MD_INT[k] ? k : 'confirm';
}
