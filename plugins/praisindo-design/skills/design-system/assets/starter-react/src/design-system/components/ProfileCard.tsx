// ProfileCard (DS 1.84, rules PC-01 to PC-03, owner decision 2026-10-25): a small card with the avatar, name, role and, when the viewer may see them, the team and the status of a person, opened from the
// person's name or avatar in a list. It shows only what exists in the data (the caller passes the fields the viewer is allowed to see: domain/roles/profile.ts); an actor without a person shows "System".
// Pattern: a non-modal popover (role="dialog", aria-modal="false"), not a Tooltip. The trigger is a button (aria-haspopup="dialog", aria-expanded) so Enter / Space open it, and the card holds
// rows and, for a customer, a button; a Tooltip (role="tooltip") describes its trigger and takes no activation. Mouse: opens after a short delay and stays open while the pointer is on the card; keyboard: opens on
// focus-visible and on Enter / Space; touch: a tap toggles it; Escape, a tap outside and blur close it. One card is open at a time. The card is in a layer on <body>, so Tab on the trigger moves
// into the card's button ("View Detail") when there is one; leaving the card closes it. Focus is never trapped.
// Placement: fixed, in a layer on <body> (not clipped by a scroll container), below the trigger or above it when there is no room, kept inside the viewport (ttPlace of the Tooltip).
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type FocusEvent as ReactFocusEvent, type PointerEvent, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { usePrefsOptional } from '../../app/providers/PrefsProvider';
import { fill } from '../../i18n/fill';
import { translate } from '../../i18n';
import { initials } from '../../lib/text';
import { LinkButton } from './Button';
import { Icon } from './Icon';
import { ttPlace, type Placed } from './Tooltip';

export interface ProfileCardData {
  /** the person's name; empty for a system actor */
  name: string;
  /** under the name: the position of an internal user, the segment of a customer */
  subtitle?: string;
  /** label (left) and value (right), only the rows the viewer may see; the caller decides (domain/roles/profile.ts) */
  rows?: readonly (readonly [string, ReactNode])[];
  /** a full-width button at the bottom (customer: "View Detail") */
  action?: { label: string; href: string };
  /** an actor that is not a person: the card says "System" and shows nothing else */
  system?: boolean;
}
export interface ProfileCardProps {
  data: ProfileCardData;
  /** what opens the card: the name as text (default) or the avatar */
  trigger?: 'name' | 'avatar';
  /** keep it open and in the flow (documentation previews, tests) */
  forceOpen?: boolean;
}

const HOVER_IN = 250, HOVER_OUT = 150;
let current: { close(): void } | null = null;

/** The avatar of a person (initials) or of the system (icon), `size` 24 / 32 / 40 px through the class. */
function Face({ data, size }: { data: ProfileCardData; size: 'sm' | 'xl' }) {
  return data.system
    ? <span className={`hav pcx-f pcx-${size} pcx-sys`} aria-hidden="true"><Icon name="auto_awesome" /></span>
    : <span className={`hav pcx-f pcx-${size}`} aria-hidden="true">{initials(data.name)}</span>;
}

/** The content of the card (also used alone for the Design page preview): avatar, name, subtitle, rows, and an optional full-width button. */
export function ProfileCardBody({ data, id, label, preview }: { data: ProfileCardData; id?: string; label?: string; /** a static preview on the Design page: a group, not a dialog */ preview?: boolean }) {
  const p = usePrefsOptional(), t = (k: string) => (p ? p.t(k) : translate('en', k)), who = data.system ? t('lg.system') : data.name;
  const rows = data.system ? [] : data.rows ?? [];
  return (
    <div className="pcx" role={preview ? 'group' : 'dialog'} aria-modal={preview ? undefined : 'false'} id={id} aria-label={label ?? fill(t('pc.card'), { n: who })}>
      <Face data={data} size="xl" />
      <div className="pcx-n"><span className="fw6">{who}</span>{data.subtitle && !data.system ? <span className="mut">{data.subtitle}</span> : null}</div>
      {rows.length ? <dl className="pcx-r">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl> : null}
      {data.action && !data.system ? <LinkButton label={data.action.label} href={data.action.href} type="soft" intent="neutral" cls="pcx-act" /> : null}
    </div>
  );
}

/** The card in its layer, mounted only while it is open (so the layout effect that places it never runs on the server). */
function CardLayer({ btn, card, data, id, onEnter, onLeave, onFocus, onBlur }: { btn: RefObject<HTMLElement>; card: RefObject<HTMLDivElement>; data: ProfileCardData; id: string; onEnter(e: PointerEvent<HTMLDivElement>): void; onLeave(e: PointerEvent<HTMLDivElement>): void; onFocus(): void; onBlur(e: ReactFocusEvent<HTMLDivElement>): void }) {
  const [pos, setPos] = useState<Placed | null>(null);
  const place = useCallback(() => {
    const b = btn.current, c = card.current; if (!b || !c) return;
    setPos(ttPlace(b.getBoundingClientRect(), { w: c.offsetWidth, h: c.offsetHeight }, 'bottom', window.innerWidth, window.innerHeight));
  }, [btn, card]);
  useLayoutEffect(() => { place(); }, [place, data.name, data.subtitle, data.rows?.length]);
  useEffect(() => {
    window.addEventListener('resize', place); window.addEventListener('scroll', place, true);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [place]);
  return createPortal(
    <div ref={card} className="pcx-w" data-ready={pos ? '' : undefined} style={pos ? { left: pos.left, top: pos.top } : undefined} onPointerEnter={onEnter} onPointerLeave={onLeave} onFocus={onFocus} onBlur={onBlur}>
      <ProfileCardBody data={data} id={id} />
    </div>, document.body);
}

export function ProfileCard({ data, trigger = 'name', forceOpen }: ProfileCardProps) {
  const p = usePrefsOptional(), t = (k: string) => (p ? p.t(k) : translate('en', k));
  const id = useId(), who = data.system ? t('lg.system') : data.name;
  const [open, setOpen] = useState(false), shown = open || !!forceOpen;
  const btn = useRef<HTMLSpanElement>(null), card = useRef<HTMLDivElement>(null), timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined), ptr = useRef('mouse');
  const cancel = () => { if (timer.current) { clearTimeout(timer.current); timer.current = undefined; } };
  const close = useCallback(() => { cancel(); setOpen(false); }, []);
  const openNow = () => { cancel(); if (current && current.close !== close) current.close(); current = { close }; setOpen(true); };
  const later = (fn: () => void, ms: number) => { cancel(); timer.current = setTimeout(fn, ms); };
  useEffect(() => cancel, []);
  useEffect(() => { if (!open && current && current.close === close) current = null; }, [open, close]);
  useEffect(() => {
    if (!open) return undefined;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); close(); btn.current?.focus({ preventScroll: true }); } };
    const down = (e: Event) => { const n = e.target as Node; if (!btn.current?.contains(n) && !card.current?.contains(n)) close(); };   // a tap or click outside
    document.addEventListener('keydown', key, true); document.addEventListener('pointerdown', down, true);
    return () => { document.removeEventListener('keydown', key, true); document.removeEventListener('pointerdown', down, true); };
  }, [open, close]);

  const aria = trigger === 'avatar' ? { 'aria-hidden': true as const, tabIndex: -1 } : { tabIndex: 0 };   // the avatar is the pointer target; the name is the one stop of the keyboard
  // A span with role="button", not a <button>: a button is one unbreakable box, and a name inside a sentence or a heading must wrap like the text around it (rule UN-01).
  const trig = (
    <span ref={btn} role="button" className={`pcx-t${trigger === 'avatar' ? ' pcx-ta' : ''}`} aria-haspopup="dialog" aria-expanded={shown} aria-controls={shown ? id : undefined}
      aria-label={trigger === 'name' ? fill(t('pc.open'), { n: who }) : undefined} data-user={data.system ? undefined : data.name} {...aria}
      onPointerDown={(e) => { ptr.current = e.pointerType; }}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') later(openNow, HOVER_IN); }} onPointerLeave={(e) => { if (e.pointerType === 'mouse') later(close, HOVER_OUT); }}
      onFocus={(e) => { if (ptr.current === 'mouse' && e.currentTarget.matches(':focus-visible')) later(openNow, HOVER_IN); }} onBlur={() => later(close, HOVER_OUT)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ptr.current = 'key'; e.currentTarget.click(); }
        else if (e.key === 'Tab' && !e.shiftKey && open) { const f = card.current?.querySelector<HTMLElement>('a,button'); if (f) { e.preventDefault(); cancel(); f.focus(); } }
      }}
      onClick={() => { if (ptr.current === 'touch' || ptr.current === 'pen') { cancel(); if (open) close(); else openNow(); } else openNow(); ptr.current = 'mouse'; }}>
      {trigger === 'avatar' ? <Face data={data} size="sm" /> : who}
    </span>
  );
  const enter = (e: PointerEvent<HTMLDivElement>) => { if (e.pointerType === 'mouse') cancel(); };
  const leave = (e: PointerEvent<HTMLDivElement>) => { if (e.pointerType === 'mouse') later(close, HOVER_OUT); };
  const cardFocus = () => cancel();
  const cardBlur = (e: ReactFocusEvent<HTMLDivElement>) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) later(close, HOVER_OUT); };
  return <>{trig}{forceOpen ? <div ref={card} className="pcx-w pcx-pin"><ProfileCardBody data={data} id={id} /></div> : open && typeof document !== 'undefined' ? <CardLayer btn={btn} card={card} data={data} id={id} onEnter={enter} onLeave={leave} onFocus={cardFocus} onBlur={cardBlur} /> : null}</>;
}
