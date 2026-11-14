// Port of Switch(), RadioGroup(), Select(), SearchBar(), NumberInput(), OtpInput(), PasswordInput(), FileUpload(), TagInput().
// Markup parity: baseline/golden/ui-kit.forms.json. Behaviour comes from src/domain/forms/formatters.ts (golden: form-behaviour.json).
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ChangeEvent, type ClipboardEvent, type CSSProperties, type DragEvent, type KeyboardEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useEscapeClose } from './escapeStack';
import { toOverlay } from './overlayHost';
import { fill } from '../../i18n/fill';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { Button } from './Button';
import { DashBox, FieldLabel, Input } from './Field';
import { Icon } from './Icon';
import { SZ } from './uiSize';
import { fileCheck, intField, isTagCommitKey, otpInput, otpKey, otpPaste, otpState, pwScore, stepperStep, tagAdd, tagRemove } from '../../domain/forms/formatters';
import { Chip } from './Chip';

export function Switch({ id, label, on = false, dis, checked, onChange, hideLabel }: { id: string; label: string; /** the label stays the accessible name but is not drawn (a switch in a table cell) */ hideLabel?: boolean; on?: boolean; dis?: boolean; /** controlled: the value and its change (a setting that is saved) */ checked?: boolean; onChange?: (v: boolean) => void }) {
  const ctl = checked !== undefined ? { checked, onChange: (e: { target: { checked: boolean } }) => onChange?.(e.target.checked) } : { defaultChecked: on };
  return (
    <label className="swi" htmlFor={id}>
      <input id={id} type="checkbox" role="switch" {...ctl} disabled={dis || undefined} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.click(); } }} /><span className="swt" aria-hidden="true" /><span className={hideLabel ? 'sr-only' : undefined}>{label}</span>
    </label>
  );
}

export function RadioGroup({ name, label, opts, val }: { name: string; label: string; opts: readonly (readonly [string, string])[]; val?: string }) {
  return (
    <fieldset className="rg"><legend>{label}</legend>
      {opts.map(([v, l]) => <label className="rad" key={v}><input type="radio" name={name} value={v} defaultChecked={v === val} /><span>{l}</span></label>)}
    </fieldset>
  );
}

export type SelOpts = readonly (readonly [string | number, string])[];
interface SelectCore { opts: SelOpts; val?: string | number; size: string; aria: string; dis?: boolean; onChange?: (v: string) => void; id?: string; label?: string; req?: boolean; err?: string; help?: string }

/** True on a device with a mouse or a trackpad (hover and a fine pointer). Without `matchMedia` (a server render, the unit tests) it is false: the Select is then the native one. */
function useFinePointer(): boolean {
  const q = '(hover: hover) and (pointer: fine)', get = () => typeof matchMedia === 'function' && matchMedia(q).matches;
  const [on, setOn] = useState(get);
  useEffect(() => {
    if (typeof matchMedia !== 'function') return undefined;
    const m = matchMedia(q), f = () => setOn(m.matches); f(); m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return on;
}

/** The list of a Select (rule SL-01..SL-04, DS 2.74): a popover under the field (above it when there is no room), rows of 40px (32px in the small size), the chosen row in the brand colour with a check, a search field
 *  when there are more than five options, keys (Up, Down, Home, End, Enter, Escape, the first letter). It renders into the overlay host so a table or a drawer never clips it. */
function SelectList({ opts, val, size, anchor, onPick, onClose }: { opts: SelOpts; val: string; size: string; /** the field the list hangs from: the list follows it when the page scrolls */ anchor: HTMLElement; onPick: (v: string) => void; /** `refocus` false when the person went elsewhere (a click outside, the field scrolled out of view): the focus is not taken back */ onClose: (refocus?: boolean) => void }) {
  const { t } = usePrefs(), [q, setQ] = useState(''), list = useRef<HTMLDivElement>(null), root = useRef<HTMLDivElement>(null), [rect, setRect] = useState(() => anchor.getBoundingClientRect());
  const searchable = opts.length > 5, n = q.trim().toLowerCase();
  const shown = searchable && n ? opts.filter(([, l]) => l.toLowerCase().includes(n)) : opts;
  useEscapeClose(() => onClose(), 3);
  useEffect(() => {
    // a press outside closes the list, also on the field of another Select (only the own field is let through: its click toggles); the focus stays where the person pressed
    const down = (e: PointerEvent) => { const el = e.target as Node; if (root.current && !root.current.contains(el) && !anchor.contains(el)) onClose(false); };
    // the page scrolls (or any area of it): the list follows its field (placed again on each scroll event), and goes away when the field is out of view
    const follow = (e: Event) => { if (e.target instanceof Node && root.current?.contains(e.target)) return; const r = anchor.getBoundingClientRect(); if (r.bottom < 0 || r.top > window.innerHeight) onClose(false); else setRect(r); };
    const away = () => onClose(false);
    document.addEventListener('pointerdown', down, true); window.addEventListener('resize', away); window.addEventListener('scroll', follow, true);
    return () => { document.removeEventListener('pointerdown', down, true); window.removeEventListener('resize', away); window.removeEventListener('scroll', follow, true); };
  }, [onClose, anchor]);
  useEffect(() => { (root.current?.querySelector<HTMLElement>('.slp-q input') ?? list.current?.querySelector<HTMLElement>('[aria-selected=true]') ?? list.current?.querySelector<HTMLElement>('button'))?.focus(); }, []);
  const vh = window.innerHeight, below = vh - rect.bottom - 12, up = below < 200 && rect.top > below, max = Math.max(160, Math.min(320, up ? rect.top - 12 : below));
  const style: CSSProperties = { left: Math.max(8, Math.min(rect.left, window.innerWidth - 8 - Math.max(rect.width, 200))), minWidth: Math.max(rect.width, 160), maxHeight: max, ...(up ? { bottom: vh - rect.top + 4 } : { top: rect.bottom + 4 }) };
  const btns = () => [...(list.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])];
  const onKey = (e: ReactKeyboardEvent) => {
    const items = btns(), i = items.indexOf(document.activeElement as HTMLButtonElement), go = (k: number) => { e.preventDefault(); items[Math.max(0, Math.min(items.length - 1, k))]?.focus(); };
    if (e.key === 'ArrowDown') go(i + 1); else if (e.key === 'ArrowUp') { if (i <= 0 && searchable) { e.preventDefault(); root.current?.querySelector<HTMLElement>('.slp-q input')?.focus(); } else go(i - 1); }
    else if (e.key === 'Home' && i >= 0) go(0); else if (e.key === 'End' && i >= 0) go(items.length - 1);
    else if (e.key === 'Tab') onClose();
    else if (e.key.length === 1 && !searchable && !e.ctrlKey && !e.metaKey) { const c = e.key.toLowerCase(), at = [...items.slice(i + 1), ...items.slice(0, i + 1)].find((b) => (b.textContent ?? '').trim().toLowerCase().startsWith(c)); at?.focus(); }
  };
  return toOverlay(
    <div ref={root} className={`slp s-${size}`} style={style} onKeyDown={onKey}>
      {searchable ? <div className="slp-q"><Input id="slp-q" type="text" icon="search" size="sm" auto="off" ph={t('fnd.search')} val={q} onChange={setQ} inputProps={{ 'aria-label': t('fnd.search'), onKeyDown: (e) => { if (e.key === 'ArrowDown') { e.preventDefault(); btns()[0]?.focus(); } else if (e.key === 'Enter' && shown[0]) { e.preventDefault(); onPick(String(shown[0][0])); } } }} /></div> : null}
      <div ref={list} className="slp-l" role="listbox">
        {shown.length ? shown.map(([v, l]) => { const on = String(v) === val; return <button key={String(v)} type="button" role="option" aria-selected={on} data-v={String(v)} className="slo" onClick={() => onPick(String(v))}><span>{l}</span>{on ? <Icon name="check" /> : null}</button>; })
          : <p className="slp-e mut">{fill(t('ost.noResT'), { q: q.trim() })}</p>}
      </div>
    </div>);
}

/** The Select on a device with a mouse: the field is a button that opens `SelectList`; a hidden native `<select>` (same options, same label) keeps the value for forms, scripts and assistive tests. */
function ListSelect({ opts, val, size, aria, dis, onChange, id, label, req, err, help }: SelectCore) {
  const [own, setOwn] = useState(val === undefined ? '' : String(val)), cur = onChange ? (val === undefined ? '' : String(val)) : own;
  const [open, setOpen] = useState(false), trig = useRef<HTMLButtonElement>(null);
  const shownOpt = opts.find(([v]) => String(v) === cur) ?? opts[0];
  const close = useCallback((refocus = true) => { setOpen(false); if (refocus) trig.current?.focus(); }, []);
  const openIt = () => { if (dis || !trig.current) return; setOpen(true); };
  const pick = (v: string) => { setOwn(v); setOpen(false); trig.current?.focus(); onChange?.(v); };
  const onTrigKey = (e: ReactKeyboardEvent) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); openIt(); } };
  return (
    <span className={`selw sl${err ? ' err' : ''}${open ? ' open' : ''}`}>
      <button ref={trig} type="button" id={id} role="combobox" aria-haspopup="listbox" aria-expanded={open} className={`sel s-${size} sl-t`} aria-label={label ? undefined : aria} disabled={dis || undefined} aria-required={req ? 'true' : undefined} aria-invalid={err ? 'true' : undefined}
        aria-describedby={err || help ? `${id}-d` : undefined} onClick={() => (open ? close() : openIt())} onKeyDown={onTrigKey}><span className="sl-v">{shownOpt?.[1] ?? ''}</span></button>
      <Icon name="expand_more" />
      <select className="sl-n" tabIndex={-1} aria-hidden="true" aria-label={label ?? aria} disabled={dis || undefined} value={cur} onChange={(e) => pick(e.target.value)}>
        {opts.map(([v, l]) => <option key={String(v)} value={v}>{l}</option>)}
      </select>
      {open && trig.current ? <SelectList opts={opts} val={cur} size={size} anchor={trig.current} onPick={pick} onClose={close} /> : null}
    </span>
  );
}

/** 2.31 (FM-12): a Select that is a FORM field passes `label` (+ `id`, `req` | `opt`, `hint`, `help`, `err`) and is drawn as a `.fld` with the label above it, `aria-required` and `aria-invalid`.
 *  Without `label` it is the bare control of a toolbar, a pagination or a combo. DS 2.74: on a device with a mouse the list is the `SelectList` popover (a search field above five options); on a touch device it stays the native select. */
export function Select({ opts, val, size = SZ, aria = '', dis, onChange, id, label, req, opt, hint, help, err }: { opts: SelOpts; val?: string | number; size?: string; aria?: string; dis?: boolean; onChange?: (v: string) => void; id?: string; label?: string; req?: boolean; opt?: boolean; hint?: string; help?: string; err?: string }) {
  const fine = useFinePointer();
  const value = onChange ? { value: val === undefined ? '' : String(val), onChange: (e: { target: { value: string } }) => onChange(e.target.value) } : { defaultValue: val === undefined ? undefined : String(val) };
  const sel = fine ? <ListSelect opts={opts} val={val} size={size} aria={aria} dis={dis} onChange={onChange} id={id} label={label} req={req} err={err} help={help} /> : (
    <span className={`selw${err ? ' err' : ''}`}>
      <select id={id} className={`sel s-${size}`} aria-label={label ? undefined : aria} disabled={dis || undefined} aria-required={req ? 'true' : undefined} aria-invalid={err ? 'true' : undefined} aria-describedby={err || help ? `${id}-d` : undefined} {...value}>
        {opts.map(([v, l]) => <option key={String(v)} value={v}>{l}</option>)}
      </select>
      <Icon name="expand_more" />
    </span>
  );
  if (!label) return sel;
  return (
    <div className="fld">
      <label htmlFor={id}><FieldLabel label={label} req={req} opt={opt} hint={hint} /></label>
      {sel}
      {err ? <span className="hlp" id={`${id}-d`}>{err}</span> : help ? <span className="fhelp" id={`${id}-d`}>{help}</span> : null}
    </div>
  );
}

/** `label` (2.32, TB-17) names the search box and is its placeholder when the default "Search…" is too vague, e.g. the Audit log: "Search user, action, object or ID". */
export function SearchBar({ fields, size = SZ, fv, q = '', id = '', label, onField, onQuery, onClear }: { fields: SelOpts; label?: string; size?: string; fv?: string; q?: string; id?: string; onField?: (v: string) => void; onQuery?: (v: string) => void; onClear?: () => void }) {
  const { t } = usePrefs();
  const field = fv || String(fields[0]![0]);
  return (
    <div className="combo">
      <Select opts={fields} val={field} size={size} aria={t('f.search')} onChange={onField} />
      <div className={`inp s-${size}`}>
        <Icon name="search" />
        <input id={id || undefined} type="text" {...(onQuery ? { value: q, onChange: (e: { target: { value: string } }) => onQuery(e.target.value) } : { defaultValue: q })} placeholder={label || t('fnd.search')} aria-label={label || t('fnd.search')} />
        {q && id ? <Button icon="close" type="transparent" intent="neutral" size={size} cls="scl" aria={t('tbl.clearSearch')} title={t('tbl.clearSearch')} onClick={onClear} /> : null}
      </div>
    </div>
  );
}

export function NumberInput({ id, label, val = 1, min = 0, max = 99, step = 1, suf = '' }: { id: string; label?: string; val?: number; min?: number; max?: number; step?: number; suf?: string }) {
  const { t } = usePrefs();
  const [v, setV] = useState(String(val));
  // The prototype recomputes the +/- disabled state only when a button is used, not while typing.
  const [dis, setDis] = useState({ dec: val <= min, inc: val >= max });
  const click = (dir: 1 | -1) => { const r = stepperStep({ value: v, min, max, step, dir }); setV(String(r.value)); setDis({ dec: r.decDisabled, inc: r.incDisabled }); };
  return (
    <div className="fld fstp">
      {label ? <label htmlFor={id}>{label}</label> : null}
      <div className="stp" data-min={min} data-max={max} data-step={step}>
        <Button icon="remove" type="outlined" intent="neutral" aria={t('ff.dec')} disabled={dis.dec} onClick={() => click(-1)} />
        <div className="inp s-md">
          <input id={id} type="text" inputMode="numeric" value={v} onChange={(e: ChangeEvent<HTMLInputElement>) => setV(intField(e.target.value))} aria-label={label || ''} />
          {suf ? <span className="suf">{suf}</span> : null}
        </div>
        <Button icon="add" type="outlined" intent="neutral" aria={t('ff.inc')} disabled={dis.inc} onClick={() => click(1)} />
      </div>
    </div>
  );
}

export function OtpInput({ id, label, len = 6, hint }: { id: string; label?: string; len?: number; hint?: string }) {
  const { t } = usePrefs();
  const [vals, setVals] = useState<string[]>(() => Array.from({ length: len }, () => ''));
  const cells = useRef<(HTMLInputElement | null)[]>([]);
  const focusAt = useRef<number | null>(null);
  // Cells are uncontrolled (the prototype's markup has no value attribute); their DOM value is synced from state after each change.
  useLayoutEffect(() => {
    vals.forEach((v, i) => { const el = cells.current[i]; if (el && el.value !== v) el.value = v; });
    const i = focusAt.current;
    if (i != null) { focusAt.current = null; cells.current[i]?.focus(); }
  });
  const apply = (r: { values: string[]; focus: number | null }) => { setVals(r.values); if (r.focus != null) focusAt.current = r.focus; };
  const st = otpState(vals);
  return (
    <div className={`fld fotp${st.done ? ' done' : ''}`} data-len={len} id={id}>
      {label ? <label htmlFor={`${id}-0`}><FieldLabel label={label} hint={hint} /></label> : null}
      <div className="otp" role="group" aria-label={label || t('ff.otp')}>
        {vals.map((_v, i) => (
          <input key={i} id={`${id}-${i}`} ref={(el) => { cells.current[i] = el; }} className="otpd" type="text" inputMode="numeric" maxLength={1}
            autoComplete={i === 0 ? 'one-time-code' : 'off'} aria-label={fill(t('ff.otpD'), { i: i + 1, n: len })}
            onChange={(e: ChangeEvent<HTMLInputElement>) => { const r = otpInput(vals, i, e.target.value); e.target.value = r.values[i] ?? ''; apply(r); }}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { const r = otpKey(vals, i, e); if (r.prevented) e.preventDefault(); apply(r); }}
            onPaste={(e: ClipboardEvent<HTMLInputElement>) => { e.preventDefault(); apply(otpPaste(vals, i, e.clipboardData.getData('text'))); }} />
        ))}
      </div>
      <span className="fhelp" aria-live="polite">{st.done ? fill(t('ff.otpOk'), { n: st.n }) : fill(t('ff.otpH'), { n: st.n })}</span>
    </div>
  );
}

export function PasswordInput({ id, label, val = '', req, meter = true }: { id: string; label?: string; val?: string; req?: boolean; meter?: boolean }) {
  const { t } = usePrefs();
  const [v, setV] = useState(val);
  const [show, setShow] = useState(false);
  // The strength meter starts at 0 even for a prefilled value; it is recomputed on typing only (as in the prototype).
  const [lvl, setLvl] = useState(0);
  return (
    <div className="fld fpwd">
      {label ? <label htmlFor={id}><FieldLabel label={label} req={req} /></label> : null}
      <div className="inp s-md">
        <input id={id} type={show ? 'text' : 'password'} value={v} autoComplete="new-password"
          onChange={(e: ChangeEvent<HTMLInputElement>) => { setV(e.target.value); setLvl(pwScore(e.target.value)); }} />
        <button type="button" className="ib" aria-pressed={String(show) as 'true' | 'false'} aria-label={t(show ? 'ff.pwHide' : 'ff.pwShow')} onClick={() => setShow(!show)}>
          <Icon name={show ? 'visibility_off' : 'visibility'} />
        </button>
      </div>
      {meter ? <div className="pwm" data-l={String(lvl)} aria-live="polite"><span className="pwb"><i /><i /><i /><i /></span><span className="pwt">{t('ff.pw' + lvl)}</span></div> : null}
    </div>
  );
}

interface FileItem { key: number; name: string; kb: string }
export function FileUpload({ id, label, accept = '', hint = '', multiple = true, maxMb = 5 }: { id: string; label?: string; accept?: string; hint?: string; multiple?: boolean; maxMb?: number }) {
  const { t } = usePrefs();
  const [items, setItems] = useState<FileItem[]>([]);
  const [bad, setBad] = useState<string[]>([]);
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const seq = useRef(0);
  const add = (list: FileList | null) => {
    const files = Array.from(list ?? []);
    const r = fileCheck(files.map((f) => ({ name: f.name, size: f.size })), maxMb);
    setItems((cur) => [...cur, ...r.accepted.map((x) => ({ key: ++seq.current, name: x.name, kb: x.kb }))]);
    setBad(r.bad);
  };
  const drag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setOver(e.type === 'dragover');
    if (e.type === 'drop') add(e.dataTransfer.files);
  };
  const err = bad.length ? fill(t('ff.fdBig'), { f: bad.join(', '), n: maxMb }) : '';
  return (
    <div className="fld ffd" data-max={maxMb}>
      {label ? <label htmlFor={id}>{label}</label> : null}
      <div className={`fdz${over ? ' over' : ''}`} onDragOver={drag} onDragLeave={drag} onDrop={drag}>
        <DashBox /><span className="fdi"><Icon name="cloud_upload" /></span>
        <span className="fw6">{t('ff.fdT2')}</span><small>{hint || fill(t('ff.fdH'), { n: maxMb })}</small>
        <Button label={t('ff.fdBrowse')} type="outlined" intent="neutral" size="md" onClick={() => input.current?.click()} />
        <input id={id} ref={input} type="file" accept={accept || undefined} multiple={multiple || undefined} className="sr-only" tabIndex={-1}
          onChange={(e: ChangeEvent<HTMLInputElement>) => { add(e.target.files); e.target.value = ''; }} />
      </div>
      <ul className="fdl">
        {items.map((it) => (
          <li key={it.key}><Icon name="description" /><span>{it.name}</span><small>{it.kb} KB</small>
            <button type="button" aria-label={fill(t('ff.rm'), { x: it.name })} onClick={() => setItems((cur) => cur.filter((x) => x.key !== it.key))}><Icon name="close" /></button></li>
        ))}
      </ul>
      <span className="hlp" hidden={!err}>{err}</span>
    </div>
  );
}

/** One suggestion of the suggest mode of TagInput: a person with a second line and a label (rule EX-06). */
export interface TagSuggestion { id: string; label: string; sub?: string; tag?: string; group?: string }
export interface TagInputProps {
  id: string; label?: string; val?: readonly string[]; ph?: string;
  /** 2.37 (EX-06): the suggest mode. `suggest(q)` gives what to offer for what is typed (the caller decides the minimum of characters); the chosen ones are `sel` and every change goes to `onSel`; `free(raw)` turns a complete typed value (an email) into a suggestion on Enter. */
  suggest?: (q: string) => readonly TagSuggestion[]; sel?: readonly TagSuggestion[]; onSel?: (s: TagSuggestion[]) => void; free?: (raw: string) => TagSuggestion | null;
  req?: boolean; hint?: string; err?: string; /** under the field while something is typed and nothing matches */ none?: string; /** characters before a list can show, and the hint while fewer are typed */ min?: number; keep?: string;
}
export function TagInput(p: TagInputProps) { return p.suggest ? <SuggestTagInput {...p} /> : <PlainTagInput id={p.id} label={p.label} val={p.val} ph={p.ph} />; }
function PlainTagInput({ id, label, val = [], ph }: { id: string; label?: string; val?: readonly string[]; ph?: string }) {
  const { t } = usePrefs();
  const [list, setList] = useState<string[]>([...val]);
  const input = useRef<HTMLInputElement>(null);
  const remove = (v: string) => { setList((cur) => tagRemove(cur, v)); input.current?.focus(); };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    if (isTagCommitKey(e.key)) { e.preventDefault(); const r = tagAdd(list, el.value); setList(r.list); el.value = r.input; }
    else if (e.key === 'Backspace' && !el.value && list.length) remove(list[list.length - 1]!);
  };
  return (
    <div className="fld ftag" data-val={JSON.stringify(list)}>
      {label ? <label htmlFor={id}>{label}</label> : null}
      <div className="inp tagi s-md">
        {list.map((v) => <Chip key={v} label={v} removeLabel={fill(t('ff.rm'), { x: v })} onRemove={() => remove(v)} />)}
        <input id={id} ref={input} type="text" placeholder={ph || t('ff.tagPh')} onKeyDown={onKeyDown} />
      </div>
    </div>
  );
}

/** The suggest mode of TagInput: chips of the chosen ones, a list of suggestions in groups under the field (avatar, name, second line, label), keyboard: Arrow keys, Enter, Escape, Backspace. */
function SuggestTagInput({ id, label, ph, suggest, sel = [], onSel, free, req, hint, err, none, min = 3, keep }: TagInputProps) {
  const { t } = usePrefs(), [q, setQ] = useState(''), [open, setOpen] = useState(false), [act, setAct] = useState(0), input = useRef<HTMLInputElement>(null);
  const list = suggest ? suggest(q) : [], shown = open && list.length > 0, typed = q.trim().length, lid = id + '-l';
  const pick = (s: TagSuggestion) => { onSel?.([...sel, s]); setQ(''); setAct(0); input.current?.focus(); };
  const remove = (x: string) => { onSel?.(sel.filter((s) => s.id !== x)); input.current?.focus(); };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && list.length) { e.preventDefault(); setOpen(true); setAct((a) => Math.min(list.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp' && list.length) { e.preventDefault(); setAct((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const chosen = shown ? list[act] : undefined, f = !chosen && free ? free(q.trim()) : null, one = chosen ?? f;
      if (one && !sel.some((s) => s.id === one.id)) pick(one);
    } else if (e.key === 'Escape' && shown) { e.stopPropagation(); setOpen(false); }
    else if (e.key === 'Backspace' && !q && sel.length) remove(sel[sel.length - 1]!.id);
  };
  const groups: { g: string; items: { s: TagSuggestion; i: number }[] }[] = [];
  list.forEach((s, i) => { const g = s.group ?? ''; let b = groups.find((x) => x.g === g); if (!b) { b = { g, items: [] }; groups.push(b); } b.items.push({ s, i }); });
  return (
    <div className={`fld ftag ftgs${err ? ' err' : ''}`} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false); }}>
      {label ? <label htmlFor={id} id={lid}><FieldLabel label={label} req={req} /></label> : null}
      <div className={`inp tagi s-md${err ? ' err' : ''}`}>
        {sel.map((s) => <Chip key={s.id} label={s.label} title={s.sub} removeLabel={fill(t('ff.rm'), { x: s.label })} onRemove={() => remove(s.id)} />)}
        <input id={id} ref={input} type="text" value={q} placeholder={sel.length ? '' : ph || t('ff.tagPh')} role="combobox" aria-autocomplete="list" aria-expanded={shown} aria-controls={id + '-list'} aria-activedescendant={shown ? `${id}-o${act}` : undefined} aria-required={req ? 'true' : undefined} aria-invalid={err ? 'true' : undefined}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setAct(0); }} onFocus={() => setOpen(true)} onKeyDown={onKeyDown} />
      </div>
      {shown ? (
        <div className="tgs" role="listbox" id={id + '-list'} aria-labelledby={label ? lid : undefined}>
          {groups.map((b) => (
            <div key={b.g} role="group" aria-label={b.g || undefined}>
              {b.g ? <div className="grpt tgs-g">{b.g}</div> : null}
              {b.items.map(({ s, i }) => (
                <button type="button" key={s.id} id={`${id}-o${i}`} role="option" aria-selected={i === act} className={`tgs-o${i === act ? ' on' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(s)}>
                  <span className="hav" aria-hidden="true">{s.label.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()}</span>
                  <span className="m"><span className="fw6">{s.label}</span>{s.sub ? <span className="mut">{s.sub}</span> : null}</span>
                  {s.tag ? <Chip label={s.tag} /> : null}
                </button>))}
            </div>))}
        </div>) : null}
      {err ? <span className="hlp">{err}</span> : typed && typed < min && keep ? <span className="mut">{keep}</span> : typed >= min && !list.length && none ? <span className="mut">{none}</span> : hint ? <span className="mut">{hint}</span> : null}
    </div>
  );
}
