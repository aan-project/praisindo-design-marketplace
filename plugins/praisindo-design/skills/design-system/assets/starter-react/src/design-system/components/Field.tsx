// Port of FL(), Input(), ShortcutChips(), MoneyInput(), GroupedNumberInput(), DashBox() (golden: baseline/golden/ui-kit.forms.json).
// Markup parity: baseline/golden/ui-kit.forms.json. Behaviour (grouping, caret, validation, suggestions): src/domain/forms/formatters.ts + form-behaviour golden.
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FocusEvent, type InputHTMLAttributes, type KeyboardEvent as KbEvent, type MutableRefObject, type PointerEvent as PtEvent, type ReactNode, type Ref } from 'react';
import { fill } from '../../i18n/fill';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { Icon } from './Icon';
import { InfoTooltip } from './Hints';
import { SZ } from './uiSize';
import { clearsGroupedError, colorInput, ffDig, formatGrouped, formatMoney, validateGrouped } from '../../domain/forms/formatters';
import { validHex } from '../tokens/colorEngine';
import { hexToHsv, hsvToHex, toHex, type Hsv } from '../../domain/forms/color';
import { Button } from './Button';
import { useFieldPopover } from './popoverHost';
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
  format?: 'money' | 'color'; cur?: string; onValue?: (v: string) => void;
  /** `format="color"`: the swatch opens the color picker (default); `false` makes it a plain swatch (the field inside the picker itself). */
  picker?: boolean;
  /** The root of the field (the popover of the color picker is placed under it). */
  rootRef?: Ref<HTMLDivElement>;
}

function InputBase({ rootRef, id, label, type = 'text', size = SZ, val = '', ph = '', icon, err = '', trail, auto = '', req, opt, hint, pre = '', suf = '', help = '', sugg, dis, ro, cls = '', inputProps, onChange, onSugg, controlled, inputRef, ffe, ffeMade, errCleared }: InputProps) {
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
    <div ref={rootRef} className={`fld${cls ? ' ' + cls : ''}`}>
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

/** The color picker of the color field (rule FM-19, owner request 2026-11-15, the reference is the picker of Untitled UI): a square of saturation (left to right) and brightness (bottom to top) in the hue of the color, a hue slider, the eyedropper where the browser has one, and the hex field. Keys: the arrows move a handle by 1% or 1 degree (Shift: 10). The alpha of the reference is not here: the field holds an opaque `#rrggbb`. */
const HUES = [0, 60, 120, 180, 240, 300, 360].map((h) => `hsl(${h} 100% 50%)`).join(',');
const unit = (n: number) => Math.min(1, Math.max(0, n));
function ColorPop({ id, hex, onPick, close }: { id: string; hex: string; onPick: (h: string) => void; close: () => void }) {
  const { t } = usePrefs();
  const [c, setC] = useState<Hsv>(() => hexToHsv(hex) ?? { h: 210, s: 1, v: 1 });
  useEffect(() => { const n = hexToHsv(hex); if (n && hsvToHex(n) !== hsvToHex(c)) setC(n); }, [hex]);   // eslint-disable-line react-hooks/exhaustive-deps
  const push = (n: Hsv) => { setC(n); onPick(hsvToHex(n)); };
  const cur = hsvToHex(c), eye = typeof window !== 'undefined' && 'EyeDropper' in window;
  const at = (e: PtEvent<HTMLElement>, f: (x: number, y: number) => void) => { const r = e.currentTarget.getBoundingClientRect(); if (r.width) f(unit((e.clientX - r.left) / r.width), unit((e.clientY - r.top) / r.height)); };
  const slide = (f: (x: number, y: number) => void) => ({
    onPointerDown: (e: PtEvent<HTMLElement>) => { e.currentTarget.setPointerCapture?.(e.pointerId); at(e, f); },
    onPointerMove: (e: PtEvent<HTMLElement>) => { if (e.buttons) at(e, f); },
  });
  const step = (e: KbEvent) => (e.shiftKey ? 10 : 1);
  const svKey = (e: KbEvent<HTMLDivElement>) => {
    const d = step(e) / 100, k = e.key;
    if (k === 'ArrowLeft') push({ ...c, s: unit(c.s - d) }); else if (k === 'ArrowRight') push({ ...c, s: unit(c.s + d) }); else if (k === 'ArrowUp') push({ ...c, v: unit(c.v + d) }); else if (k === 'ArrowDown') push({ ...c, v: unit(c.v - d) }); else return;
    e.preventDefault();
  };
  const hueKey = (e: KbEvent<HTMLDivElement>) => {
    const d = step(e);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') push({ ...c, h: Math.max(0, c.h - d) }); else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') push({ ...c, h: Math.min(360, c.h + d) }); else return;
    e.preventDefault();
  };
  const pickEye = () => { const E = (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper; void new E().open().then((r) => { const n = hexToHsv(toHex(r.sRGBHex)); if (n) push(n); }, () => undefined); };
  return (
    <div className="fpop cpk" role="dialog" aria-label={t('ff.cpT')}>
      <div className="cpk-t"><span className="fw6">{t('ff.cpT')}</span><Button icon="close" type="transparent" intent="neutral" size="sm" aria={t('lg.close')} onClick={close} /></div>
      <div className="cpk-sv" role="slider" tabIndex={0} aria-label={t('ff.cpSv')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(c.s * 100)} aria-valuetext={`${Math.round(c.s * 100)}% / ${Math.round(c.v * 100)}%`}
        style={{ backgroundColor: `hsl(${c.h} 100% 50%)` }} onKeyDown={svKey} {...slide((x, y) => push({ ...c, s: x, v: 1 - y }))}>
        <span className="cpk-hd" style={{ left: `${c.s * 100}%`, top: `${(1 - c.v) * 100}%`, background: cur }} />
      </div>
      <div className="cpk-r">
        {eye ? <Button icon="colorize" type="outlined" intent="neutral" size="md" aria={t('ff.cpEye')} onClick={pickEye} /> : null}
        <div className="cpk-hue" role="slider" tabIndex={0} aria-label={t('ff.cpHue')} aria-valuemin={0} aria-valuemax={360} aria-valuenow={Math.round(c.h)} style={{ backgroundImage: `linear-gradient(90deg,${HUES})` }} onKeyDown={hueKey} {...slide((x) => push({ ...c, h: x * 360 }))}>
          <span className="cpk-hd" style={{ left: `${(c.h / 360) * 100}%`, background: `hsl(${c.h} 100% 50%)` }} />
        </div>
      </div>
      <Input id={id + '-hex'} size="md" format="color" picker={false} val={hex} onChange={(v) => { const n = hexToHsv(v); if (n) push(n); else onPick(v); }} />
    </div>
  );
}

/** `format="color"` (rule FM-18): a field for a hex color with the swatch of the color at its end. It accepts the color with or without the pound sign and adds the pound by itself (`007bff` becomes `#007bff`); `onChange` gets the value with the pound; `val` is shown as it comes (an invalid value from outside stays visible so that the page can say why). The swatch is a button that opens the color picker (rule FM-19) under the field. */
function ColorField({ val = '', onChange, trail: _t, inputProps, format: _f, picker = true, dis, ro, ...rest }: InputProps) {
  void [_t, _f];
  const { t } = usePrefs();
  const [v, setV] = useState(val);
  useEffect(() => { setV(val); }, [val]);
  const sw = useRef<HTMLButtonElement>(null);
  const pop = useFieldPopover(() => sw.current);
  const set = (x: string) => { const n = colorInput(x); setV(n); onChange?.(n); };
  const back = validHex(v) ? { background: v } : undefined;
  const swatch = picker
    ? <button ref={sw} type="button" className="csw" data-sw aria-haspopup="dialog" aria-expanded={pop.open} aria-label={t('ff.cpOpen')} disabled={dis || ro || undefined} style={back} onClick={pop.toggle} />
    : <span className="csw" data-sw aria-hidden="true" style={back} />;
  const memo = useMemo(() => rest.id, [rest.id]);
  return <>
    <InputBase {...rest} dis={dis} ro={ro} rootRef={pop.root} val={v} onChange={set} inputProps={{ spellCheck: false, autoCapitalize: 'off', ...inputProps }} trail={swatch} />
    {pop.open ? pop.float(<ColorPop id={memo} hex={v} onPick={set} close={() => { pop.setOpen(false); sw.current?.focus(); }} />) : null}
  </>;
}

/** The text field of every form. `format="money"` makes it a money field (the former MoneyInput), `format="color"` a color field. */
export function Input(p: InputProps) {
  if (p.format === 'color') return <ColorField {...p} />;
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
