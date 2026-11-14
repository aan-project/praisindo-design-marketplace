// Port of PhoneInput(), Flag(), ctyCode(). Flag artwork and country list are generated from the oracle (flags.ts).
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { fill } from '../../i18n/fill';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { FieldLabel } from './Field';
import { CTRY, FLAG_DEFAULT, FLAG_INNER } from './flags';
import { Icon } from './Icon';
import { clearsGroupedError, formatGrouped } from '../../domain/forms/formatters';
import { useCaretInput } from './useCaretInput';
import { useFieldPopover } from './popoverHost';
import { ccHay, matchesQuery } from '../../domain/forms/popovers';

export const ctyCode = (c: string): string => (CTRY.find((x) => x[0] === c) ?? CTRY[0]!)[1];

export function Flag({ cc }: { cc: string }) {
  return <svg className="flag" viewBox="0 0 30 20" width={20} height={14} aria-hidden="true" dangerouslySetInnerHTML={{ __html: FLAG_INNER[cc] ?? FLAG_DEFAULT }} />;
}

/** The country list popover (prototype ccPop()): search box, option per country, "none" line. */
export function CcPop({ cc, onPick }: { cc: string; onPick: (c: string) => void }) {
  const { t } = usePrefs();
  const [q, setQ] = useState('');
  const search = useRef<HTMLInputElement>(null);
  useEffect(() => { search.current?.focus(); }, []);
  const hits = CTRY.map(([c, n]) => matchesQuery(q, ccHay(t('cty.' + c), c, n)));
  return (
    <div className="fpop ccp" role="dialog" aria-label={t('ff.ccT')}>
      <div className="inp s-sm"><Icon name="search" /><input ref={search} type="text" className="ccq" placeholder={t('ff.ccQ')} aria-label={t('ff.ccQ')} onChange={(e: ChangeEvent<HTMLInputElement>) => setQ(e.target.value)} /></div>
      <ul className="ccl" role="listbox" aria-label={t('ff.ccT')}>
        {CTRY.map(([c, n], i) => (
          <li key={c} hidden={!hits[i]}>
            <button type="button" role="option" aria-selected={c === cc} data-c={c} data-q={ccHay(t('cty.' + c), c, n)} onClick={() => onPick(c)}>
              <Flag cc={c} /><span>{t('cty.' + c)}</span><span className="fw6">+{n}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="fnone" hidden={hits.some(Boolean)}>{t('ff.none')}</p>
    </div>
  );
}

export interface PhoneInputProps { id: string; label?: string; cc?: string; val?: string; req?: boolean; opt?: boolean; hint?: string; err?: string; size?: string;
  /** 2.31 (FM-12): called with the formatted text on every change (digits grouped by four). Without it the value is read from the input by id. */
  onChange?: (value: string) => void }
/** data-fmt="phone": digits grouped by four, a leading national 0 dropped, the dial code dropped when the number is long enough to start with it. `cc` is the initial country. */
export function PhoneInput({ id, label, cc: cc0 = 'ID', val = '', req, opt, hint, err = '', size = 'md', onChange: onValue }: PhoneInputProps) {
  const { t } = usePrefs();
  const [cc, setCc] = useState(cc0);
  const btn = useRef<HTMLButtonElement>(null);
  const pop = useFieldPopover(() => btn.current);
  const f = useCaretInput(val, (raw, pos) => formatGrouped(raw, pos, { max: 13, dial: ctyCode(cc) }));
  const [cleared, setCleared] = useState(false);
  const errOn = !!err && !cleared;
  const onChange = (e: ChangeEvent<HTMLInputElement>) => { const r = f.onChange(e); if (clearsGroupedError(r.digits, 13)) setCleared(true); onValue?.(r.value); };
  const pick = (c: string) => {
    setCc(c);
    pop.setOpen(false);
    const el = f.ref.current;
    if (el) f.commit(formatGrouped(el.value, el.selectionStart, { max: 13, dial: ctyCode(c) }));
    el?.focus();
  };
  return (
    <div ref={pop.root} className={`fld fpw${pop.open ? ' open' : ''}`} data-cc={cc}>
      {label ? <label htmlFor={id}><FieldLabel label={label} req={req} opt={opt} hint={hint} /></label> : null}
      <div className={`inp tel s-${size}${errOn ? ' err' : ''}`}>
        <button ref={btn} type="button" className="ccb" aria-haspopup="listbox" aria-expanded={pop.open} aria-label={fill(t('ff.cc'), { c: t('cty.' + cc), n: '+' + ctyCode(cc) })} onClick={pop.toggle}>
          <Flag cc={cc} /><span className="ccn">+{ctyCode(cc)}</span><Icon name="expand_more" />
        </button>
        <input id={id} type="tel" inputMode="tel" autoComplete="tel-national" ref={f.ref} value={f.value} onChange={onChange} placeholder="812 3456 7890"
          aria-invalid={errOn ? 'true' : undefined} aria-required={req ? 'true' : undefined} aria-describedby={err ? `${id}-d` : undefined} />
      </div>
      {err ? <span className="hlp" id={`${id}-d`}>{err}</span> : null}
      {pop.open ? pop.float(<CcPop cc={cc} onPick={pick} />) : null}
    </div>
  );
}
