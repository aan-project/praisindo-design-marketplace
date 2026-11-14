// One open form popover at a time, closed by: another field opening, a mousedown outside it, or Escape (which also returns focus to the
// field's trigger and stops the event, so an enclosing drawer does not also close). Mirrors the prototype's ffOpen / ffClose.
import { createElement, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactElement, type RefObject } from 'react';
import { toOverlay } from './overlayHost';

interface Entry { has(n: Node): boolean; close(): void; focusTrigger(): void }
let current: Entry | null = null;

function onMouseDown(e: MouseEvent) { if (current && !current.has(e.target as Node)) current.close(); }
function onKeyDown(e: KeyboardEvent) {
  if (e.key !== 'Escape' || !current) return;
  const c = current;
  c.close();
  c.focusTrigger();
  e.stopPropagation();
}
function claim(en: Entry) {
  if (current && current !== en) current.close();
  if (!current) { document.addEventListener('mousedown', onMouseDown, true); document.addEventListener('keydown', onKeyDown, true); }
  current = en;
}
function release(en: Entry) {
  if (current !== en) return;
  current = null;
  document.removeEventListener('mousedown', onMouseDown, true);
  document.removeEventListener('keydown', onKeyDown, true);
}

/** `trigger` returns the element that gets focus back on Escape. The returned `root` goes on the field wrapper.
 *  DS 2.81 (rule FP-01): the popover is not drawn inside the field (a card, a drawer or a table with `overflow: hidden` clipped it): `float(node)` draws it in the overlay host, in `position: fixed` under the field
 *  (above it when there is no room, moved inside the left and right edges, aligned to the right of the field with `.end`, above with `.up`). It follows the field while the page or an area of it scrolls and closes,
 *  without taking the focus, when the field leaves the screen. Where there is no overlay host (a server render, a test DOM) it stays inside the field as before. */
export function useFieldPopover(trigger: () => HTMLElement | null) {
  const root = useRef<HTMLDivElement>(null), popRef = useRef<HTMLDivElement>(null);
  const trig = useRef(trigger);
  trig.current = trigger;
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState<CSSProperties | null>(null);
  const match = useRef(false);
  useEffect(() => {
    if (!open) return;
    const en: Entry = { has: (n) => !!root.current && root.current.contains(n) || !!popRef.current && popRef.current.contains(n), close: () => setOpen(false), focusTrigger: () => trig.current()?.focus() };
    claim(en);
    return () => release(en);
  }, [open]);
  const place = () => {
    const host = root.current, el = popRef.current;
    if (!host || !el) return;
    const f = host.getBoundingClientRect(), M = 8, gap = 8, vh = window.innerHeight, vw = window.innerWidth;
    if (!f.width && !f.height) return;   // no layout (a server render, a test DOM): nothing to place
    if (f.bottom < 0 || f.top > vh) { setOpen(false); return; }   // the field left the screen
    const w = match.current || vw <= 640 ? f.width : el.offsetWidth, h = el.offsetHeight, end = host.classList.contains('end'), up = host.classList.contains('up');
    const left = Math.max(M, Math.min(end ? f.right - w : f.left, vw - M - w));
    let top = f.bottom + gap;
    if ((up && f.top - gap - h >= M) || (top + h > vh - M && f.top - gap - h >= M)) top = f.top - gap - h;
    top = Math.max(M, Math.min(top, vh - M - h));   // neither side has room: it covers the field a little rather than leave the screen
    setBox({ left, top, ...(match.current || vw <= 640 ? { width: w } : {}) });
  };
  useLayoutEffect(() => {
    if (!open) { setBox(null); return; }
    place();
    const follow = (e: Event) => { if (e.target instanceof Node && popRef.current?.contains(e.target)) return; place(); };
    window.addEventListener('scroll', follow, true); window.addEventListener('resize', place);
    return () => { window.removeEventListener('scroll', follow, true); window.removeEventListener('resize', place); };
  }, [open]);   // eslint-disable-line react-hooks/exhaustive-deps
  const float = (node: ReactElement, matchWidth = false): ReactElement => { match.current = matchWidth; return toOverlay(createElement('div', { ref: popRef, className: 'fpop-fix', style: box ?? undefined }, node)); };
  return { root, open, setOpen, toggle: () => setOpen((o) => !o), float };
}

/**
 * Behaviour of a floating action menu (`.pop`, role="menu": the row menu of a table, the node menu of the condition builder).
 * Closes on a press outside the menu and its trigger (pointerdown: a mouse, a finger or a pen; the trigger itself toggles), on Escape (focus returns to the
 * trigger and the event stops, so an enclosing drawer stays open) and on Tab; the arrow keys, Home and End move between the enabled items; the first enabled
 * item takes the focus when the menu opens. A scroll that moves the trigger closes it. After the first paint the menu is fitted to the viewport: it flips above the
 * trigger when it would run off the bottom and is moved inside the left and right edges (8px margin); its own max-height scrolls inside.
 */
export function useActionMenu(ref: RefObject<HTMLElement | null>, onClose: () => void, trigger?: HTMLElement | null) {
  const trg = useRef<HTMLElement | null>(trigger ?? null);
  const close = useRef(onClose); close.current = onClose;
  useEffect(() => {   // (an effect, not a layout effect: the server render of the editor must stay quiet) a menu opens from a click, so React runs it before the next paint
    const el = ref.current; if (!el) return;
    if (!trg.current) trg.current = document.activeElement as HTMLElement | null;
    const M = 8, r = el.getBoundingClientRect(), vh = window.innerHeight, vw = window.innerWidth, tr = trg.current && trg.current !== document.body ? trg.current.getBoundingClientRect() : null;
    if (r.bottom > vh - M) { const above = tr ? tr.top - 4 - r.height : -1; el.style.top = Math.max(M, above >= M ? above : vh - M - r.height) + 'px'; }
    if (r.left < M || r.right > vw - M) { el.style.left = Math.max(M, Math.min(r.left, vw - M - r.width)) + 'px'; el.style.right = 'auto'; }
  }, [ref]);
  useEffect(() => {
    const el = ref.current, items = () => [...(el?.querySelectorAll<HTMLElement>('button:not(:disabled)') ?? [])];
    items()[0]?.focus({ preventScroll: true });
    const back = () => { close.current(); trg.current?.focus?.({ preventScroll: true }); };
    const down = (e: PointerEvent) => { const n = e.target as Node; if (el?.contains(n) || trg.current?.contains(n)) return; close.current(); };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); back(); return; }
      if (e.key === 'Tab') { back(); return; }
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key) || !el?.contains(document.activeElement) && document.activeElement !== trg.current) return;
      const L = items(); if (!L.length) return; e.preventDefault();
      const i = L.indexOf(document.activeElement as HTMLElement), n = L.length;
      L[e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : e.key === 'ArrowDown' ? (i + 1) % n : (i - 1 + n) % n]?.focus();
    };
    const t0 = trg.current?.getBoundingClientRect(), moved = () => { const t1 = trg.current?.getBoundingClientRect(); return !t0 || !t1 || Math.abs(t1.top - t0.top) > 1 || Math.abs(t1.left - t0.left) > 1; };
    const scroll = (e: Event) => { if (!el?.contains(e.target as Node) && moved()) close.current(); };   // only a scroll that carries the trigger away (a late scroll event of the scroll that brought it into view does not)
    document.addEventListener('pointerdown', down, true); document.addEventListener('keydown', key, true); window.addEventListener('scroll', scroll, true);
    return () => { document.removeEventListener('pointerdown', down, true); document.removeEventListener('keydown', key, true); window.removeEventListener('scroll', scroll, true); };
  }, [ref]);
}
