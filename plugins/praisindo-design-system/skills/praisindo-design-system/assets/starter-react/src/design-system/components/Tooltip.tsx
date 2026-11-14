// Tooltip (DS 1.63): a dark bubble with a tail that points at its trigger, left-aligned text, an optional title and an optional link button below the text.
// InfoTooltip is the shortcut for a plain text Tooltip (Hints.tsx); use Tooltip directly when the help needs a title or a link to the documentation, or a custom trigger.
// Behaviour: opens on hover AND keyboard focus, stays open while the pointer is inside the bubble (so its link can be clicked), closes on Escape, on blur and when the pointer
// leaves (short delay). Touch: tap opens, a tap outside closes. The bubble is always in the DOM (hidden) so `aria-describedby` on the trigger is always valid; it is
// `visibility:hidden` while closed, so its link is not in the Tab order until it opens. Placement flips to the opposite side when it does not fit and is kept inside the viewport.
import { cloneElement, isValidElement, useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type PointerEvent as RPointerEvent, type ReactElement, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
export type TooltipVariant = 'text' | 'action' | 'title';
export interface TooltipAction { label: string; href?: string; onClick?: () => void }
export interface TooltipProps {
  /** The description (left-aligned; keep it to two or three lines). */
  children: ReactNode;
  variant?: TooltipVariant; placement?: TooltipPlacement; title?: string; action?: TooltipAction;
  /** Accessible name of the default trigger (i18n `tt.help`). Not used with a custom trigger. */
  label?: string;
  /** Icon of the default trigger (default `help`; `lightbulb` in card headers). */
  icon?: string;
  /** A custom trigger; it must be a single focusable element (it gets `aria-describedby`). Default: the `help` icon button. */
  trigger?: ReactElement;
  /** Keep it open (documentation previews, tests). */
  forceOpen?: boolean;
}

const OPP: Record<TooltipPlacement, TooltipPlacement> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
const GAP = 8, EDGE = 8, ARROW_MIN = 14;
export interface Placed { placement: TooltipPlacement; left: number; top: number; arrow: number }
/** Pure placement: the preferred side, flipped when it does not fit and the opposite does, the bubble kept inside the viewport, the tail aimed at the trigger centre. */
export function ttPlace(tr: { left: number; top: number; right: number; bottom: number }, size: { w: number; h: number }, pref: TooltipPlacement, vw: number, vh: number): Placed {
  const { w, h } = size, space = { top: tr.top, bottom: vh - tr.bottom, left: tr.left, right: vw - tr.right };
  const need = (p: TooltipPlacement) => ((p === 'top' || p === 'bottom') ? h : w) + GAP;
  let p = pref;
  if (space[p] < need(p) && space[OPP[p]] >= need(OPP[p])) p = OPP[p];
  else if (space[p] < need(p) && space[OPP[p]] < need(OPP[p])) p = (['top', 'bottom', 'left', 'right'] as const).reduce((a, b) => (space[b] > space[a] ? b : a), p);
  const cx = (tr.left + tr.right) / 2, cy = (tr.top + tr.bottom) / 2, clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), Math.max(lo, hi));
  if (p === 'top' || p === 'bottom') {
    const left = clamp(cx - w / 2, EDGE, vw - w - EDGE), top = p === 'top' ? tr.top - h - GAP : tr.bottom + GAP;
    return { placement: p, left, top, arrow: clamp(cx - left, ARROW_MIN, w - ARROW_MIN) };
  }
  const top = clamp(cy - h / 2, EDGE, vh - h - EDGE), left = p === 'left' ? tr.left - w - GAP : tr.right + GAP;
  return { placement: p, left, top, arrow: clamp(cy - top, ARROW_MIN, h - ARROW_MIN) };
}

export function Tooltip({ children, variant, placement = 'top', title, action, label = '', icon = 'help', trigger, forceOpen }: TooltipProps) {
  const id = useId(), v: TooltipVariant = variant ?? (action ? 'action' : title ? 'title' : 'text');
  const [open, setOpen] = useState(false), shown = open || !!forceOpen;
  const [pos, setPos] = useState<Placed>({ placement, left: 0, top: 0, arrow: 24 });
  const wrap = useRef<HTMLSpanElement>(null), bubble = useRef<HTMLDivElement>(null), timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined), touch = useRef(false);
  const cancel = () => { if (timer.current) { clearTimeout(timer.current); timer.current = undefined; } };
  const openNow = () => { cancel(); setOpen(true); };
  const closeSoon = () => { cancel(); timer.current = setTimeout(() => setOpen(false), 120); };
  useEffect(() => cancel, []);

  const place = useCallback(() => {
    const t = wrap.current, b = bubble.current;
    if (!t || !b) return;
    const r = t.getBoundingClientRect();
    setPos(ttPlace(r, { w: b.offsetWidth, h: b.offsetHeight }, placement, window.innerWidth, window.innerHeight));
  }, [placement]);
  useLayoutEffect(() => { if (shown && !forceOpen) place(); }, [shown, forceOpen, place, children, title, action?.label]);
  useEffect(() => {
    if (!shown) return undefined;
    const on = () => place();
    window.addEventListener('resize', on); window.addEventListener('scroll', on, true);
    return () => { window.removeEventListener('resize', on); window.removeEventListener('scroll', on, true); };
  }, [shown, place]);
  useEffect(() => {
    if (!open) return undefined;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const down = (e: Event) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false); };   // tap / click outside
    document.addEventListener('keydown', key); document.addEventListener('pointerdown', down, true);
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('pointerdown', down, true); };
  }, [open]);

  const tap = () => { if (touch.current) { cancel(); setOpen((o) => !o); } };   // a tap toggles (and cancels a close that the previous blur scheduled); a mouse click leaves the hover state alone
  const trig = trigger && isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<Record<string, unknown>>, { 'aria-describedby': id, onClick: (e: unknown) => { (trigger.props as { onClick?: (e: unknown) => void }).onClick?.(e); tap(); } })
    : <button type="button" className="tt-trigger" aria-label={label} aria-describedby={id} onClick={tap}><Icon name={icon} /></button>;
  const link = action ? (action.href
    ? <a className="tt-link" href={action.href} target="_blank" rel="noopener noreferrer">{action.label}<Icon name="open_in_new" /></a>
    : <button type="button" className="tt-link" onClick={action.onClick}>{action.label}<Icon name="open_in_new" /></button>) : null;
  return (
    <span ref={wrap} className="tt-wrap"
      onPointerDown={(e) => { touch.current = e.pointerType !== 'mouse'; }}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') openNow(); }} onPointerLeave={(e) => { if (e.pointerType === 'mouse') closeSoon(); }}
      onFocus={() => { if (!touch.current) openNow(); }} onBlur={(e) => { if (!wrap.current?.contains(e.relatedTarget as Node | null)) closeSoon(); }}>
      {trig}
      <div ref={bubble} id={id} role="tooltip" className={`tt tt-${v} tt-${forceOpen ? placement : pos.placement}${forceOpen ? ' tt-pin' : ''}`} data-open={shown ? '' : undefined}
        style={forceOpen ? undefined : { left: pos.left, top: pos.top, ['--tt-arrow' as string]: pos.arrow + 'px' }}>
        {title ? <div className="tt-t">{title}</div> : null}
        <div className="tt-d">{children}</div>
        {link}
      </div>
    </span>
  );
}

/** The Tooltip bubble for a trigger that is never focusable, a Badge (BD-13): hover (mouse) and tap (touch) only, Escape and a tap outside close it. The bubble is built only while it is open and
 *  drawn in the body, so the text of the badge and of its cell never changes; it has no link, so it never catches the pointer (`tt-np`). Spread `props` on the trigger and render `bubble` next to it. */
export function useHoverTip(text: string) {
  const id = useId(), [open, setOpen] = useState(false), [pos, setPos] = useState<Placed>({ placement: 'top', left: 0, top: 0, arrow: 24 });
  const trig = useRef<HTMLSpanElement | null>(null), bubble = useRef<HTMLDivElement>(null), touch = useRef(false);
  const place = () => { const t = trig.current, b = bubble.current; if (t && b) setPos(ttPlace(t.getBoundingClientRect(), { w: b.offsetWidth, h: b.offsetHeight }, 'top', window.innerWidth, window.innerHeight)); };
  useLayoutEffect(() => { if (open) place(); }, [open, text]);
  useEffect(() => {
    if (!open) return undefined;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const down = (e: Event) => { if (trig.current && !trig.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('keydown', key); document.addEventListener('pointerdown', down, true); window.addEventListener('resize', place); window.addEventListener('scroll', place, true);
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('pointerdown', down, true); window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [open]);
  if (!text) return { props: {}, bubble: null };
  const props = {
    ref: (el: HTMLSpanElement | null) => { trig.current = el; },
    'aria-describedby': open ? id : undefined,
    onPointerDown: (e: RPointerEvent) => { touch.current = e.pointerType !== 'mouse'; },
    onPointerEnter: (e: RPointerEvent) => { if (e.pointerType === 'mouse') setOpen(true); },
    onPointerLeave: (e: RPointerEvent) => { if (e.pointerType === 'mouse') setOpen(false); },   // no link in the bubble, so no delay: moving from one badge to the next never shows two
    onClick: () => { if (touch.current) setOpen((o) => !o); },
  };
  const node = open ? createPortal(
    <div ref={bubble} id={id} role="tooltip" className={`tt tt-text tt-${pos.placement} tt-np`} data-open="" style={{ left: pos.left, top: pos.top, ['--tt-arrow' as string]: pos.arrow + 'px' }}><div className="tt-d">{text}</div></div>, document.body) : null;
  return { props, bubble: node };
}
