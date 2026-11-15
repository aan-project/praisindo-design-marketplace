// Port of SegmentedControl(): pill radio group with a sliding thumb. The prototype marks the previous index on click (sgMark) so the thumb animates from there; here the
// previous index is remembered on click and the thumb is remounted (key) so the CSS animation restarts. Controlled by `val`.
import { useState, type CSSProperties } from 'react';
import { segIndex } from '../../domain/nav';
import { Icon } from './Icon';
import { FieldLabel } from './Field';

export interface SegToggleProps { id: string; /** `aria` (4th) is the accessible name of an option that is an icon only (an empty label), also its tooltip. */
  items: readonly (readonly [value: string, label: string, icon?: string, aria?: string])[]; val?: string; aria?: string; full?: boolean; /** `sm`: the small size for a toggle in the header of a card (rule SG-11); default `md` */ size?: 'sm' | 'md'; onChange?: (v: string) => void;
  /** 2.31 (FM-12): a SegmentedControl that is a FORM field passes `label` (+ `req` | `opt`, `hint`, `err`): drawn as a `.fld` with the label above it and `aria-required` / `aria-invalid` on the radiogroup. */
  label?: string; req?: boolean; opt?: boolean; hint?: string; err?: string }

export function SegmentedControl({ id, items, val, aria = '', full, size = 'md', onChange, label, req, opt, hint, err }: SegToggleProps) {
  const ix = segIndex(items, val);
  const [from, setFrom] = useState<{ p: number; to: number } | null>(null);
  const mv = from !== null && from.to === ix && from.p !== ix;
  const grp = (
    <div className={`sgc${size === 'sm' ? ' s-sm' : ''}${full ? ' full' : ''}${err ? ' err' : ''}`} id={id} role="radiogroup" aria-label={label ? undefined : aria} aria-labelledby={label ? `${id}-l` : undefined} aria-required={req ? 'true' : undefined} aria-invalid={err ? 'true' : undefined} aria-describedby={err ? `${id}-d` : undefined} style={{ '--seg-n': items.length, '--seg-to': ix } as CSSProperties}>
      <span key={mv ? `${from!.p}>${ix}` : 'th'} hidden={val === ''} className={`sgc-th${mv ? ' mv' : ''}`} style={mv ? ({ '--seg-from': from!.p } as CSSProperties) : undefined} aria-hidden="true" />
      {items.map(([v, l, ic, nm], i) => (
        <button key={v} type="button" role="radio" aria-checked={v === val} className={`sgc-o${v === val ? ' on' : ''}${!l && ic ? ' ico' : ''}`} aria-label={nm || undefined} title={nm || undefined}
          onClick={() => { setFrom({ p: ix, to: i }); onChange?.(v); }}>{ic ? <Icon name={ic} /> : null}{l}</button>
      ))}
    </div>
  );
  if (!label) return grp;
  return (
    <div className="fld">
      <label id={`${id}-l`}><FieldLabel label={label} req={req} opt={opt} hint={hint} /></label>
      {grp}
      {err ? <span className="hlp" id={`${id}-d`}>{err}</span> : null}
    </div>
  );
}
