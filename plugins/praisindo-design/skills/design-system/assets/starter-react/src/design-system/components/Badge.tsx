// The Badge (rules BD-01 to BD-10, owner decision 2026-10-26): ONE look, a soft rectangle (radius `--r-badge`) with an icon on the left that fits its value and the text in the colour of its intent.
// A badge without an icon says so with `noIcon`. A badge only shows information: whatever can be touched is a Chip (CH-01). The icon is drawn by CSS (`content: attr(data-ic)`, the ligature of the Material
// Icons font), so the badge text stays the label alone for copy, search and tests.
import { useEffect, useRef, useState } from 'react';
import { usePrefsOptional } from '../../app/providers/PrefsProvider';
import type { BadgeDomain } from '../../domain/badgeIcons';
import { badgeTip } from '../../domain/badgeTips';
import { iconClass } from './iconClass';
import { useHoverTip } from './Tooltip';

// One ResizeObserver for all badges: a badge whose text is cut gets its full label as `title` (rule BD-05).
const subs = new Map<Element, (cut: boolean) => void>();
let ro: ResizeObserver | null = null;
const isCut = (e: Element) => (e as HTMLElement).scrollWidth > (e as HTMLElement).clientWidth;
function watchCut(el: Element, cb: (cut: boolean) => void): () => void {
  if (typeof ResizeObserver === 'undefined') { cb(isCut(el)); return () => {}; }
  ro ??= new ResizeObserver((es) => { for (const x of es) subs.get(x.target)?.(isCut(x.target)); });
  subs.set(el, cb); ro.observe(el);
  return () => { subs.delete(el); ro?.unobserve(el); };
}

export type BadgeProps = {
  label: string; intent?: string;
  /** the full text for a tooltip; when it is left out and the text is cut, the label is the title */ title?: string;
  /** what the badge is for, for the hover tooltip (rule BD-13): the domain and value of the central map (`badgeProps`), or `what` (the name of what it shows: "<what> is <label>"), or `tip` (the whole sentence) */
  domain?: BadgeDomain; value?: string; what?: string; tip?: string;
} & ({ icon: string; noIcon?: never } | { noIcon: true; icon?: never });

export function Badge({ label, intent = 'brand', title, icon, noIcon, domain, value, what, tip }: BadgeProps) {
  const ref = useRef<HTMLSpanElement>(null), [cut, setCut] = useState(false);
  useEffect(() => { const el = ref.current; return el ? watchCut(el, setCut) : undefined; }, []);
  const prefs = usePrefsOptional(), text = prefs ? badgeTip(prefs.t, { label, domain, value, what, tip }) : (tip ?? label);
  const hover = useHoverTip(text);
  return (
    <span className={`bdg t-soft i-${intent} bdg-u${noIcon ? ' bdg-ni' : ''}`} title={title ?? (cut ? label : undefined)} {...hover.props}>
      {noIcon ? null : <span className={iconClass()} data-ic={icon} aria-hidden="true" />}<span className="bdg-t" ref={ref}>{label}</span>{hover.bubble}
    </span>
  );
}
