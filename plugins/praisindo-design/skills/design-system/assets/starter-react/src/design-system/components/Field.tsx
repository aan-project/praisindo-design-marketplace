// Port of FL(), Input(), ShortcutChips(), MoneyInput(), GroupedNumberInput(), DashBox() (golden: baseline/golden/ui-kit.forms.json).
// Markup parity: baseline/golden/ui-kit.forms.json. Behaviour (grouping, caret, validation, suggestions): src/domain/forms/formatters.ts + form-behaviour golden.
import { useEffect, useRef, useState, type ChangeEvent, type FocusEvent, type InputHTMLAttributes, type MutableRefObject, type ReactNode, type Ref } from 'react';
import { fill } from '../../i18n/fill';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { Icon } from './Icon';
import { InfoTooltip } from './Hints';
import { SZ } from './uiSize';
import { clearsGroupedError, ffDig, formatGrouped, formatMoney, validateGrouped } from '../../domain/forms/formatters';
import { useCaretInput } from './useCaretInput';
import { Chip } from './Chip';

export function DashBox() {
  return <svg className="dshb" aria-hidden="true" focusable="false"><rect /></svg>;
}

export function FieldLabel({ label, req, opt, hint }: { label: string; req?: boolean; opt?: boolean; hint?: string }) {
  const { t } = usePrefs();
  return (
    <>
      {label}
      {req ? <><span className="req" aria-hidden="true">*</span><span className="sr-only"> ({t('fld.req')})</span></> : null}
      {opt ? <span className="opt">{t('fld.opt')}</span> : null}
      {hint ? <InfoTooltip text={hint} /> : null}
    </>
  );
}

export type SuggList = readonly (readonly [string, string | number])[];
/** Suggestion chips. After a click the prototype sets aria-pressed on every chip (true on the clicked one); before that the attribute is absent. */
export function ShortcutChips({ list, onPick }: { list: SuggList; onPick?: (v: string | number) => void }) {
  const { t } = usePrefs();
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="fsug" role="group" aria-label={t('ff.sugg')}>
      {list.map(([l, v], i) => (
        <Chip key={String(v)} label={l} selected={picked === null ? undefined : picked === i} onClick={() => { setPicked(i); onPick?.(v); }} />
      ))}
    </div>
  );
}

export interface InputProps {
  id: string; label?: string; type?: string; size?: string; val?: string; ph?: string; icon?: string; err?: string; trail?: ReactNode; auto?: string;
  req?: boolean; opt?: boolean; hint?: string; pre?: string; suf?: string; help?: string; sugg?: SuggList; dis?: boolean; ro?: boolean; cls?: string;
  /** Extra attributes for the <input> (e.g. inputMode). */
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  /** When given the input is controlled by `val`; otherwise `val` is the initial value. */
  onChange?: (value: string) => void; onSugg?: (v: string | number) => void;
  /** Controlled by `val` with the handlers supplied in `inputProps` (used by the formatting inputs). */
  controlled?: boolean; inputRef?: Ref<HTMLInputElement>;
  /** Error created at runtime by focusout validation (the prototype's `.hlp.ffe`, id `<id>-e`); `ffeMade` keeps aria-describedby on it once it has existed. */
  ffe?: string | null; ffeMade?: boolean;
  /** The prototype removes the error styling (class err, aria-invalid) when a digit field is complete, leaving the `err` text in place. */
  errCleared?: boolean;
  /** `format="money"`: currency prefix (`cur`, default Rp), thousands separators while typing, caret kept after the same digit, inputMode decimal; `onValue` gets the formatted text. */
  format?: 'money'; cur?: string; onValue?: (v: string) => void;
}

function InputBase({ id, label, type = 'text', size = SZ, val = '', ph = '', icon, err = '', trail, auto = '', req, opt, hint, pre = '', suf = '', help = '', sugg, dis, ro, cls = '', inputProps, onChange, onSugg, controlled, inputRef, ffe, ffeMade, errCleared }: InputProps) {
  const errOn = !!(err && !errCleared) || !!ffe;
  const own = useRef<HTMLInputElement | null>(null);
  const setRef = (el: HTMLInputElement | null) => { own.current = el; if (typeof inputRef === 'function') inputRef(el); else if (inputRef) (inputRef as MutableRefObject<HTMLInputElement | null>).current = el; };
  // A suggestion chip fills the field. The formatting inputs pass their own onSugg; for a plain field the chip sets the value itself (v1.66: Tenor chips did nothing because an uncontrolled field had no handler).
  const pick = (v: string | number) => {
    if (onSugg) { onSugg(v); return; }
    const el = own.current, text = String(v);
    if (onChange) onChange(text);
    else if (el && !controlled) { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(el, text); el.dispatchEvent(new Event('input', { bubbles: true })); }
    el?.focus();
  };
  const value = controlled ? { value: val } : onChange ? { value: val, onChange: (e: { target: { value: string } }) => onChange(e.target.value) } : { defaultValue: val };
  return (
    <div className={`fld${cls ? ' ' + cls : ''}`}>
      {label ? <label htmlFor={id}><FieldLabel label={label} req={req} opt={opt} hint={hint} /></label> : null}
      <div className={`inp s-${size}${errOn ? ' err' : ''}${dis ? ' dis' : ''}${ro ? ' ro' : ''}`}>
        {ro ? <DashBox /> : null}
        {icon ? <Icon name={icon} /> : null}
        {pre ? <span className="pre" aria-hidden="true">{pre}</span> : null}
        <input id={id} type={type} ref={setRef} {...value} placeholder={ph} autoComplete={auto || undefined}
          aria-invalid={errOn ? 'true' : undefined} aria-required={req ? 'true' : undefined} disabled={dis || undefined} readOnly={ro || undefined}
          aria-describedby={ffeMade ? `${id}-e` : help || err ? `${id}-d` : undefined}
          aria-label={pre || suf ? (label || '') + (pre ? ' (' + pre + ')' : '') + (suf ? ' (' + suf + ')' : '') : undefined}
          {...inputProps} />
        {suf ? <span className="suf" aria-hidden="true">{suf}</span> : null}
        {trail}
      </div>
      {ffe ? <span className="hlp ffe" id={`${id}-e`}>{ffe}</span> : null}
      {err ? <span className="hlp" id={`${id}-d`}>{err}</span> : help ? <span className="fhelp" id={`${id}-d`}>{help}</span> : null}
      {sugg && sugg.length ? <ShortcutChips list={sugg} onPick={pick} /> : null}
    </div>
  );
}

type FormattedProps = Omit<InputProps, 'onChange' | 'controlled' | 'inputRef' | 'ffe' | 'ffeMade' | 'errCleared' | 'inputProps'> & { inputProps?: InputHTMLAttributes<HTMLInputElement>; onValue?: (v: string) => void };

/** data-fmt="num": thousands separators while typing, caret kept after the same digit. Suggestion chips fill the field through the same formatter. */
function MoneyField({ cur = 'Rp', suf = '', val = '', ph = '0', onValue, onSugg, ...o }: Omit<FormattedProps, 'pre'> & { cur?: string }) {
  const f = useCaretInput(val, formatMoney);
  useEffect(() => { if (val !== f.value) f.commit({ value: val, caret: val.length }); }, [val]); // eslint-disable-line react-hooks/exhaustive-deps -- follow value changes made outside the field (a scenario, a reset)
  return (
    <InputBase pre={cur} suf={suf} ph={ph} {...o} controlled val={f.value} inputRef={f.ref}
      onSugg={(v) => { const r = f.apply(String(v), null); onValue?.(r.value); f.ref.current?.focus(); onSugg?.(v); }}
      inputProps={{ inputMode: 'decimal', autoComplete: 'off', ...o.inputProps, onChange: (e: ChangeEvent<HTMLInputElement>) => { const r = f.onChange(e); onValue?.(r.value); } }} />
  );
}

/** The text field of every form. `format="money"` makes it a money field (the former MoneyInput). */
export function Input(p: InputProps) {
  if (p.format === 'money') { const { format: _f, onChange: _c, controlled: _k, inputRef: _r, ffe: _e, ffeMade: _m, errCleared: _x, ...m } = p; void [_f, _c, _k, _r, _e, _m, _x]; return <MoneyField {...m} />; }
  const { format: _f, cur: _u, onValue: _v, ...rest } = p; void [_f, _u, _v];
  return <InputBase {...rest} />;
}

/** @deprecated since 1.66: use `<Input format="money" />`. Kept as a thin alias so nothing breaks. */
export function MoneyInput(p: Omit<FormattedProps, 'pre'> & { cur?: string }) { return <Input {...p} format="money" />; }

const GRP: Record<string, number> = { ktp: 16, npwp: 16, card: 16, acct: 16 };
/** data-fmt="g4": digits grouped by four, "a/n digits" help, completeness errors on blur (card numbers also Luhn-checked). */
export function GroupedNumberInput({ kind = 'ktp', max, val = '', ph, onValue, onSugg, ...o }: Omit<FormattedProps, 'help'> & { kind?: string; max?: number }) {
  const { t } = usePrefs();
  const n = max || GRP[kind] || 16;
  const f = useCaretInput(val, (raw, pos) => formatGrouped(raw, pos, { max: n }));
  const [count, setCount] = useState(ffDig(val).length);
  const [ffe, setFfe] = useState<string | null>(null);
  const [made, setMade] = useState(false);
  const [cleared, setCleared] = useState(false);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const r = f.onChange(e);
    setCount(r.digits.length);
    if (clearsGroupedError(r.digits, n)) { setFfe(null); setCleared(true); }
    onValue?.(r.value);
  };
  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    const x = validateGrouped(e.target.value, { max: n, kind });
    if (!x) { setFfe(null); return; }
    setMade(true);
    setFfe(x.key === 'ff.digErr' ? fill(t('ff.digErr'), { n: x.n }) : t('ff.cardErr'));
  };
  return (
    <Input ph={ph || '0000 0000 0000 0000'.slice(0, n + Math.floor((n - 1) / 4))} help={fill(t('ff.digits'), { a: count, n })} {...o}
      controlled val={f.value} inputRef={f.ref} ffe={ffe} ffeMade={made} errCleared={cleared}
      onSugg={(v) => { const r = f.apply(String(v), null); setCount(r.digits.length); onValue?.(r.value); f.ref.current?.focus(); onSugg?.(v); }}
      inputProps={{ inputMode: 'numeric', autoComplete: 'off', ...o.inputProps, onChange, onBlur }} />
  );
}

/** Port of Textarea(): `err` is an i18n key filled with {n: max}; the character counter of the prototype is wired by the form that owns it.
 *  With `onChange` the field is controlled by `val` (same markup); without it `val` is the initial value. */
export function Textarea({ id, label, val = '', err = '', max, req, opt, hint, onChange }: { id: string; label: string; val?: string; err?: string; max?: number; req?: boolean; opt?: boolean; hint?: string; onChange?: (v: string) => void }) {
  const { t } = usePrefs();
  return (
    <div className="fld">
      <label htmlFor={id}><FieldLabel label={label} req={req} opt={opt} hint={hint} /></label>
      <div className={`inp ta s-md${err ? ' err' : ''}`}><textarea id={id} rows={3} aria-invalid={err ? 'true' : undefined} {...(onChange ? { value: val, onChange: (e: { target: { value: string } }) => onChange(e.target.value) } : { defaultValue: val })} /></div>
      {err ? <span className="hlp">{fill(t(err), { n: max ?? '' })}</span> : null}
    </div>
  );
}
