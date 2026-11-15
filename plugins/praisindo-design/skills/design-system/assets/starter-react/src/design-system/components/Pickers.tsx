// Port of DateField() (with the calendar popover) and MultiSelect() (with its option popover).
// Markup parity: baseline/golden/ui-kit.forms.json (closed) and form-popovers.json (open, after events). Logic: src/domain/forms/popovers.ts.
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { fill } from '../../i18n/fill';
import { dfmt, pad2 } from '../../lib/dateFormat';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { calendarGrid, dayFlags, dpDay, dpNav, dpOpen, dpPreset, DP_PRESETS, matchesQuery, msAll, msToggle, type DpState } from '../../domain/forms/popovers';
import { Button } from './Button';
import { FieldLabel } from './Field';
import { Icon } from './Icon';
import { useFieldPopover } from './popoverHost';
import { Chip } from './Chip';
import { SZ } from './uiSize';

function CalendarPop({ mode, st, setSt, onCommit, onApply, onCancel, min, max }: {
  mode: 'single' | 'range'; st: DpState; setSt: (s: DpState) => void; onCommit: (from: string, to: string) => void; onApply: () => void; onCancel: () => void; min?: string; max?: string;
}) {
  const { t, prefs } = usePrefs();
  const root = useRef<HTMLDivElement>(null);
  // Opening focuses the selected day, else today, else the first day.
  useEffect(() => { const r = root.current; (r?.querySelector<HTMLElement>('.dpd.sel') ?? r?.querySelector<HTMLElement>('.dpd.tdy') ?? r?.querySelector<HTMLElement>('.dpd'))?.focus(); }, []);
  const g = calendarGrid(st.vm, prefs.lang);
  const range = mode === 'range';
  const days = Array.from({ length: g.days }, (_, i) => {
    const iso = st.vm + '-' + pad2(i + 1), fl = dayFlags(iso, mode, st.tf, st.tt);
    const cls = `dpd${fl.sel ? ' sel' : ''}${fl.inr ? ' inr' : ''}${fl.tdy ? ' tdy' : ''}${fl.rs ? ' rs' : ''}${fl.re ? ' re' : ''}`;
    return (
      <button key={iso} type="button" className={cls} data-d={iso} aria-pressed={fl.sel} aria-label={dfmt(iso, prefs.lang)} disabled={(!!min && iso < min) || (!!max && iso > max) || undefined}
        onClick={(e) => { const r = dpDay(mode, st, iso); if (r.commit) onCommit(r.commit.from, r.commit.to); else { setSt(r.st); e.currentTarget.focus(); } }}>{i + 1}</button>
    );
  });
  return (
    <div ref={root} className="fpop dp" role="dialog" aria-label={t(range ? 'ff.dRange' : 'ff.dOne')}>
      {range ? (
        <div className="dpp">
          {DP_PRESETS.map((k) => <Chip key={k} label={t('ff.dp.' + k)} data={{ k }} onClick={() => setSt(dpPreset(k))} />)}
        </div>
      ) : null}
      <div className="dph">
        <Button icon="chevron_left" type="transparent" intent="neutral" size="sm" aria={t('ff.prevM')} onClick={(e) => { setSt({ ...st, vm: dpNav(st.vm, -1) }); e.currentTarget.focus(); }} />
        <span className="fw6">{g.title}</span>
        <Button icon="chevron_right" type="transparent" intent="neutral" size="sm" aria={t('ff.nextM')} onClick={(e) => { setSt({ ...st, vm: dpNav(st.vm, 1) }); e.currentTarget.focus(); }} />
      </div>
      <div className="dpg">{g.weekdays.map((w, i) => <small key={i}>{w}</small>)}{Array.from({ length: g.lead }, (_, i) => <span key={'l' + i} />)}{days}</div>
      {range ? <p className="dps">{st.tf ? dfmt(st.tf, prefs.lang) + ' – ' + (st.tt ? dfmt(st.tt, prefs.lang) : t('ff.dEnd')) : t('ff.dStart')}</p> : null}
      {range ? (
        <div className="dpf">
          <Button label={t('fnd.cancel')} type="transparent" intent="neutral" size="sm" onClick={onCancel} />
          <Button label={t('ff.apply')} size="sm" disabled={!(st.tf && st.tt)} onClick={onApply} />
        </div>
      ) : null}
    </div>
  );
}

export interface DateFieldProps { /** the name of a field without a label (a value in a row of the rule builder) */ aria?: string; /** the earliest and the latest day that can be chosen (ISO); the days outside are disabled */ min?: string; max?: string; id: string; label?: string; mode?: 'single' | 'range'; from?: string; to?: string; req?: boolean; opt?: boolean; hint?: string; err?: string; ph?: string; size?: string; /** the popover opens to the left of the field (a field at the right edge of its card, rule FM-14) */ end?: boolean; /** the popover opens above the field (a field at the bottom of a card that clips: the card would scroll to reach it, rule FM-14) */ up?: boolean; onChange?: (from: string, to: string) => void }
/** `from` / `to` are the initial value; the field keeps its own state afterwards (ISO dates, `to` only in range mode). */
export function DateField({ aria, id, label, mode = 'single', from: from0 = '', to: to0 = '', req, opt, hint, err, ph, size = 'md', end, up, min, max, onChange }: DateFieldProps) {
  const { t, prefs } = usePrefs();
  const [val, setVal] = useState({ from: from0, to: to0 });
  useEffect(() => { setVal((v) => (v.from === from0 && v.to === to0 ? v : { from: from0, to: to0 })); }, [from0, to0]);   // a page that sets the value (a form that loads a record or clears) moves the field; a choice of the person comes back as the same value
  const [st, setSt] = useState<DpState>(() => dpOpen(from0, to0));
  const input = useRef<HTMLInputElement>(null);
  const pop = useFieldPopover(() => input.current);
  const txt = mode === 'range' ? (val.from ? dfmt(val.from, prefs.lang) + ' – ' + (val.to ? dfmt(val.to, prefs.lang) : '…') : '') : val.from ? dfmt(val.from, prefs.lang) : '';
  const toggle = () => { if (!pop.open) setSt(dpOpen(val.from, val.to)); pop.toggle(); };
  const commit = (from: string, to: string) => { setVal({ from, to }); pop.setOpen(false); input.current?.focus(); onChange?.(from, to); };
  return (
    <div ref={pop.root} className={`fld fdt${end ? ' end' : ''}${up ? ' up' : ''}${pop.open ? ' open' : ''}`} data-mode={mode} data-from={val.from} data-to={val.to}>
      {label ? <label htmlFor={id}><FieldLabel label={label} req={req} opt={opt} hint={hint} /></label> : null}
      <div className={`inp s-${size} dtf${err ? ' err' : ''}`}>
        <input ref={input} id={id} type="text" readOnly value={txt} placeholder={ph || t(mode === 'range' ? 'ff.dRange' : 'ff.dOne')} aria-label={label ? undefined : aria} aria-haspopup="dialog" aria-expanded={pop.open} aria-required={req ? 'true' : undefined} aria-invalid={err ? 'true' : undefined} aria-describedby={err ? `${id}-d` : undefined} onClick={toggle} />
        <button type="button" className="ib" aria-label={t('ff.dOpen')} onClick={toggle}><Icon name={mode === 'range' ? 'date_range' : 'calendar_today'} /></button>
      </div>
      {mode === 'single' ? <input className="dt-n" type="text" tabIndex={-1} aria-hidden="true" name={id + '-iso'} value={val.from} onChange={(e) => { const v = e.target.value; if (v === '' || /^\d{4}-\d{2}-\d{2}$/.test(v)) commit(v, ''); }} /> : null}   {/* the ISO value, for a form and for a test that sets the field (like the hidden select of Select) */}
      {err ? <span className="hlp" id={`${id}-d`}>{err}</span> : null}
      {pop.open ? pop.float(<CalendarPop min={min} max={max} mode={mode} st={st} setSt={setSt} onCommit={commit} onCancel={() => { pop.setOpen(false); input.current?.focus(); }} onApply={() => { if (st.tf && st.tt) commit(st.tf, st.tt); }} />) : null}
    </div>
  );
}

export type MsOpts = readonly (readonly [string, string])[];
function MsPop({ opts, val, setVal }: { opts: MsOpts; val: readonly string[]; setVal: (v: string[]) => void }) {
  const { t } = usePrefs();
  const [q, setQ] = useState('');
  const search = useRef<HTMLInputElement>(null);
  useEffect(() => { search.current?.focus(); }, []);
  const hits = opts.map(([, l]) => matchesQuery(q, l.toLowerCase()));
  return (
    <div className="fpop msp" role="dialog" aria-label={t('ff.msT')}>
      <div className="inp s-sm"><Icon name="search" /><input ref={search} type="text" className="msq" placeholder={t('ff.msQ')} aria-label={t('ff.msQ')} onChange={(e: ChangeEvent<HTMLInputElement>) => setQ(e.target.value)} /></div>
      <div className="msa">
        <span className="msc">{fill(t('ff.msN'), { n: val.length })}</span>
        <Button label={t('ff.msAll')} type="link" size="sm" onClick={() => setVal(msAll(val, opts.filter((_, i) => hits[i]).map(([v]) => v)))} />
        <Button label={t('ff.msClr')} type="link" size="sm" onClick={() => setVal([])} />
      </div>
      <ul className="msl" role="listbox" aria-multiselectable="true">
        {opts.map(([v, l], i) => (
          <li key={v} hidden={!hits[i]}>
            <button type="button" role="option" aria-selected={val.includes(v)} data-v={v} data-q={l.toLowerCase()} onClick={() => setVal(msToggle(val, v))}>
              <span className="mck" aria-hidden="true"><Icon name="check" /></span>{l}
            </button>
          </li>
        ))}
      </ul>
      <p className="fnone" hidden={hits.some(Boolean)}>{t('ff.none')}</p>
    </div>
  );
}

export interface MultiSelectProps { id: string; label?: string; opts: MsOpts; val?: readonly string[]; ph?: string; req?: boolean; opt?: boolean; hint?: string; err?: string; size?: string; onChange?: (v: string[]) => void }
/** `val` is the initial selection; the field keeps its own state afterwards. */
export function MultiSelect({ id, label, opts, val: val0 = [], ph, req, opt, hint, err, size = 'md', onChange }: MultiSelectProps) {
  const { t } = usePrefs();
  const [val, setValRaw] = useState<string[]>([...val0]);
  const trig = useRef<HTMLDivElement>(null);
  const pop = useFieldPopover(() => trig.current);
  const setVal = (v: string[]) => { setValRaw(v); onChange?.(v); };
  const chosen = opts.filter((o) => val.includes(o[0]));
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) { e.preventDefault(); pop.toggle(); }
  };
  return (
    <div ref={pop.root} className={`fld fms${pop.open ? ' open' : ''}`} data-val={JSON.stringify(val)} data-opts={JSON.stringify(opts)} data-ph={ph || t('ff.msPh')}>
      {label ? <label id={`${id}-l`}><FieldLabel label={label} req={req} opt={opt} hint={hint} /></label> : null}
      <div ref={trig} className={`inp ms s-${size}${err ? ' err' : ''}`} role="combobox" tabIndex={0} id={id} aria-labelledby={`${id}-l`} aria-haspopup="listbox" aria-expanded={pop.open} aria-required={req ? 'true' : undefined} aria-invalid={err ? 'true' : undefined} aria-describedby={err ? `${id}-d` : undefined} onClick={pop.toggle} onKeyDown={onKeyDown}>
        <span className="msv">
          {chosen.length
            ? chosen.map(([v, l]) => (
              <Chip key={v} label={l} removeLabel={fill(t('ff.rm'), { x: l })} removeData={{ v }} onRemove={(e) => { e.stopPropagation(); setVal(val.filter((x) => x !== v)); }} />))
            : <span className="msph">{ph || t('ff.msPh')}</span>}
        </span>
        <Icon name="expand_more" />
      </div>
      {err ? <span className="hlp" id={`${id}-d`}>{err}</span> : null}
      {pop.open ? pop.float(<MsPop opts={opts} val={val} setVal={setVal} />) : null}
    </div>
  );
}

/** One option of a RichSelect: an icon tile (the tile takes the colour of `intent`) and a short description under the label. */
export interface RichOpt { v: string; label: string; /** a second part of the name in a softer colour, after " - " (the weight names of the Branding font weight: "400 - Regular") */ soft?: string; desc?: string; icon?: string; intent?: string; disabled?: boolean }
export interface RichSelectProps { id: string; label?: string; opts: readonly RichOpt[]; val?: string; ph?: string; req?: boolean; opt?: boolean; hint?: string; err?: string; size?: string; aria?: string; dis?: boolean; onChange?: (v: string) => void }
const RsTile = ({ o }: { o: RichOpt }) => (o.icon ? <span className={`rsi i-${o.intent || 'neutral'}`} aria-hidden="true"><Icon name={o.icon} /></span> : null);
/**
 * A select whose options show an icon and a description (rule FM-13). A field like MultiSelect: the trigger is a combobox, the options are a listbox in the form popover (one open at a time,
 * Escape and a press outside close it). Keys: Enter, Space or the down arrow open it; the arrows, Home and End move between the options; Enter or Space chooses; Escape closes and returns the focus.
 * Controlled when `onChange` is given, else it keeps its own value.
 */
export function RichSelect({ id, label, opts, val: val0 = '', ph, req, opt, hint, err, size = SZ, aria, dis, onChange }: RichSelectProps) {
  const { t } = usePrefs();
  const [own, setOwn] = useState(val0), val = onChange ? val0 : own;
  const trig = useRef<HTMLDivElement>(null), list = useRef<HTMLUListElement>(null);
  const pop = useFieldPopover(() => trig.current);
  const cur = opts.find((o) => o.v === val);
  useEffect(() => { if (pop.open) (list.current?.querySelector<HTMLElement>('[aria-selected=true]') ?? list.current?.querySelector<HTMLElement>('button:not(:disabled)'))?.focus(); }, [pop.open]);
  const choose = (v: string) => { setOwn(v); pop.setOpen(false); trig.current?.focus(); onChange?.(v); };
  const onTrigKey = (e: KeyboardEvent<HTMLDivElement>) => { if (!dis && e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) { e.preventDefault(); pop.setOpen(true); } };
  const onListKey = (e: KeyboardEvent<HTMLUListElement>) => {
    const items = [...(list.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])], i = items.indexOf(document.activeElement as HTMLButtonElement);
    const go = (k: number) => { e.preventDefault(); items[Math.max(0, Math.min(items.length - 1, k))]?.focus(); };
    if (e.key === 'ArrowDown') go(i + 1); else if (e.key === 'ArrowUp') go(i - 1); else if (e.key === 'Home') go(0); else if (e.key === 'End') go(items.length - 1);
  };
  return (
    <div ref={pop.root} className={`fld frs${pop.open ? ' open' : ''}`}>
      {label ? <label id={`${id}-l`} onClick={() => trig.current?.focus()}><FieldLabel label={label} req={req} opt={opt} hint={hint} /></label> : null}
      <div ref={trig} className={`inp rsf s-${size}${err ? ' err' : ''}`} role="combobox" tabIndex={dis ? -1 : 0} id={id} aria-labelledby={label ? `${id}-l` : undefined} aria-label={label ? undefined : aria} aria-haspopup="listbox" aria-expanded={pop.open} aria-required={req ? 'true' : undefined} aria-invalid={err ? 'true' : undefined} aria-disabled={dis ? 'true' : undefined} aria-describedby={err ? `${id}-d` : undefined}
        onClick={() => { if (!dis) pop.toggle(); }} onKeyDown={onTrigKey}>
        <span className="rsv">{cur ? <><RsTile o={cur} /><span className="rsnm">{cur.label}{cur.soft ? <> - <span className="rsns">{cur.soft}</span></> : null}</span></> : <span className="rsph">{ph || t('ff.rsPh')}</span>}</span>
        <Icon name="expand_more" />
      </div>
      {err ? <span className="hlp" id={`${id}-d`}>{err}</span> : null}
      {pop.open ? pop.float(
        <div className="fpop rsp">
          <ul ref={list} className="rsl" role="listbox" aria-labelledby={label ? `${id}-l` : undefined} aria-label={label ? undefined : aria} onKeyDown={onListKey}>
            {opts.map((o) => (
              <li key={o.v}>
                <button type="button" role="option" aria-selected={o.v === val} data-v={o.v} disabled={o.disabled || undefined} onClick={() => choose(o.v)}>
                  <RsTile o={o} />
                  <span className="rst"><span className="rsnm">{o.label}{o.soft ? <> - <span className="rsns">{o.soft}</span></> : null}</span>{o.desc ? <span className="rsd">{o.desc}</span> : null}</span>
                  {o.v === val ? <Icon name="check" /> : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      , true) : null}
    </div>
  );
}
