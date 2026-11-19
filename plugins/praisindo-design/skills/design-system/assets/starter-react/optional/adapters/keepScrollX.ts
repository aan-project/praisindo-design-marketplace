// Rule TB-32 (owner 2026-11-19): a table the person scrolled sideways stays where it is when they sort, change the page or the page size. The data table library is rebuilt on those changes (the element that holds the <table> has a new key),
// so the new element would start at the left edge; this callback ref gives it back the position the old one had. A plain function (not a hook): it is safe where the table is made inside a branch.
// The library fills the element a moment after it is made, so the position is set again on each frame until the content is wide enough; the position is only remembered from the person's own scrolling, never from that.
const pos = new Map<string, number>();
type Held = HTMLElement & { _kx?: number };
export const keepScrollX = (id: string) => (n: HTMLElement | null): void => {
  if (!n || (n as Held)._kx) return;
  (n as Held)._kx = 1;
  const x = pos.get(id) ?? 0;
  let restoring = x > 0;
  const give = (left: number): void => { n.scrollLeft = x; if (Math.abs(n.scrollLeft - x) > 1 && left > 0) requestAnimationFrame(() => give(left - 1)); else window.setTimeout(() => { restoring = false; }, 80); };
  if (restoring) give(90);
  n.addEventListener('scroll', () => { if (!restoring) pos.set(id, n.scrollLeft); }, { passive: true });
};
