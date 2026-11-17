// Port of the chart widgets: Delta, Spark, Ring, DonutSegs, KPI, StatCards and W* (golden: baseline/golden/ui-kit.widgets.json). Geometry lives in domain/widgets.ts.
import type { CSSProperties, ReactNode } from 'react';
import { fill } from '../../i18n/fill';
import { usePrefs, usePrefsOptional } from '../../app/providers/PrefsProvider';
import { barHeight, deltaModel, dirOf, donutArcs, gaugeModel, chartIntentOfDelta, intentOfDir, progressPct, ringModel, segTotal, sparkModel, statPct, wgN } from '../../domain/widgets';
import { localeOf } from '../../lib/dateFormat';
import { Icon } from './Icon';
import { IconTile } from './Hints';
import { SZ } from './uiSize';
import { useCountUp } from '../../lib/countUp';

/** A number or text of a stat, KPI or widget that counts up once when it appears (rule MO-02); anything but a string or a number is drawn as it is. `animate={false}` turns it off. */
function Cnt({ v, animate = true }: { v: ReactNode; animate?: boolean }) {
  const { prefs } = usePrefs(), plain = typeof v === 'number' || typeof v === 'string', shown = useCountUp(plain ? String(v) : '', animate, prefs.lang);
  return <>{plain ? shown : v}</>;
}

export function Delta({ v, good = 1, unit = '%', sr = '' }: { v: unknown; good?: number; unit?: string; sr?: string }) {
  const { t, prefs } = usePrefs();
  const m = deltaModel(v, prefs.lang, good, unit);
  return <span className={`dlt i-${m.intent}`} aria-label={(sr ? sr + ' ' : '') + t(m.wordKey) + ' ' + m.text}><Icon name={m.icon} /><span aria-hidden="true">{m.text}</span></span>;
}
const D = ({ v, good }: { v: unknown; good?: number }) => <Delta v={v} good={good} />;

export interface SparkProps { vals: readonly unknown[]; intent?: string; w?: number; h?: number; area?: boolean; dot?: boolean; label?: string; cls?: string }
export function Spark({ vals, intent = 'brand', w = 120, h = 40, area = false, dot = false, label = '', cls = '' }: SparkProps) {
  const { t } = usePrefs();
  const m = sparkModel(vals, w, h);
  return (
    <svg className={`wg-spark i-${intent}${cls ? ' ' + cls : ''}`} viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" role="img" aria-label={label || t('wg.trend')}>
      {area ? <path className="ar" d={m.area} /> : null}
      <path className="ln" d={m.d} vectorEffect="non-scaling-stroke" />
      {dot ? <circle className="dt" cx={m.dot.cx} cy={m.dot.cy} r="4" /> : null}
    </svg>
  );
}

export function Ring({ pct, intent = 'brand', size = 48, stroke = 6, inner, label = '' }: { pct: unknown; intent?: string; size?: number; stroke?: number; inner?: ReactNode; label?: string }) {
  const m = ringModel(pct, size, stroke);
  return (
    <span className={`wg-ring i-${intent}`} style={{ width: size, height: size }} role="img" aria-label={label || Math.round(m.p) + '%'}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden="true">
        <circle className="bg" cx={m.c} cy={m.c} r={m.r} strokeWidth={stroke} />
        <circle className="fg" cx={m.c} cy={m.c} r={m.r} strokeWidth={stroke} strokeDasharray={m.dash} transform={`rotate(-90 ${m.c} ${m.c})`} />
      </svg>
      {inner ? <span className="wg-ri">{inner}</span> : null}
    </span>
  );
}

export type Seg = { v: unknown; intent: string; label: string };
export function DonutSegs({ segs, size = 140, stroke = 22, inner, label = '' }: { segs: readonly Seg[]; size?: number; stroke?: number; inner?: ReactNode; label?: string }) {
  const r = (size - stroke) / 2, c = size / 2, arcs = donutArcs(segs, size, stroke);
  return (
    <span className="wg-ring" style={{ width: size, height: size }} role="img" aria-label={label}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden="true">
        <circle className="bg" cx={c} cy={c} r={r} strokeWidth={stroke} />
        {arcs.map((a, i) => <circle key={i} className={`sg i-${a.intent}`} cx={c} cy={c} r={r} strokeWidth={stroke} strokeDasharray={a.dash} strokeDashoffset={a.offset} transform={`rotate(-90 ${c} ${c})`} />)}
      </svg>
      {inner ? <span className="wg-ri">{inner}</span> : null}
    </span>
  );
}

const WgHead = ({ title, actions }: { title: string; actions?: ReactNode }) => <div className="wg-h"><h3 className="wg-ht">{title}</h3>{actions}</div>;
const WgDot = ({ intent }: { intent: string }) => <i className={`wg-dot i-${intent}`} aria-hidden="true" />;

export function KPI({ animate = true, label, n, note, size = SZ, delta, good = 1, spark, intent = 'brand', slot = 'kpiPage', variant }: { /** the place of the card (rule PP-05): the look comes from My Preferences */ slot?: 'kpiPage' | 'kpiCard'; /** a look that does not depend on the place (Design page): card, solid or compact */ variant?: string; /** count the numbers up once when they appear (MO-02); false shows them at once */ animate?: boolean; label: string; n: ReactNode; note?: string; size?: string; delta?: unknown; good?: number; spark?: readonly unknown[]; intent?: string }) {
  const pf = usePrefsOptional(), v = variant ?? pf?.prefs.cards[slot] ?? 'card';
  if (v === 'compact') return <KpiCompact animate={animate} title={label} value={n} label={note} spark={spark} intent={intent} delta={delta} />;
  if (v === 'trend') return <KpiTrend animate={animate} title={label} value={n} spark={spark} delta={delta} good={good} note={note} />;
  return (
    <div className={`kpi s-${size}${spark ? ' has-sp' : ''}`}>
      <span className="l">{label}</span><span className="n"><Cnt v={n} animate={animate} />{delta != null ? <> <Delta v={delta} good={good} /></> : null}</span>
      {note ? <span className="mut">{note}</span> : null}{spark ? <Spark vals={spark} intent={chartIntentOfDelta(delta, intent)} h={32} label={label} /> : null}
    </div>
  );
}

export interface StatItem { k?: string; on?: boolean; intent: string; label: string; n: ReactNode; pct?: number; icon?: string }
/** The colours of the stat cards of one row (rule WG-06, owner 2026-11-17): no two cards of a row have the same colour. A card keeps the intent it was given when it is the only one with it;
 *  a card that repeats an intent takes the next colour of the palette that no card of the row uses. */
const STAT_PALETTE = ['brand', 'info', 'success', 'warning', 'purple', 'cyan', 'danger', 'secondary', 'neutral'] as const;
export function statIntents(given: readonly string[]): string[] {
  if (given.length < 2) return [...given];
  const taken = new Set<string>(), keep = given.map((g) => { if (taken.has(g)) return false; taken.add(g); return true; });
  return given.map((g, i) => { if (keep[i]) return g; const n = STAT_PALETTE.find((c) => !taken.has(c)); if (!n) return g; taken.add(n); return n; });
}
export function StatCards({ animate = true, items, size = SZ, onStat, slot = 'statList', variant }: { /** the place of the cards (rule PP-05): the look comes from My Preferences */ slot?: 'statList' | 'statDetail' | 'statOther'; /** a look that does not depend on the place (Design page): ring, bar or plain */ variant?: string; /** count the numbers up once when they appear (MO-02); false shows them at once */ animate?: boolean; items: readonly StatItem[]; size?: string; onStat?: (k: string) => void }) {
  const pf = usePrefsOptional(), look = variant ?? pf?.prefs.cards[slot] ?? 'ring';
  return (
    <div className="stats">
      {items.map((x, i) => {
        const intent = statIntents(items.map((y) => y.intent))[i]!, v = look;
        const p = statPct(x.pct), b = !!x.k;
        const click = b ? () => onStat?.(x.k!) : undefined;
        if (v === 'icon') return <StatIcon key={x.k ?? i} animate={animate} icon={x.icon ?? 'analytics'} intent={intent} value={x.n} label={x.label} onClick={click} pressed={!!x.on} />;
        if (v === 'soft') return <StatSoft key={x.k ?? i} animate={animate} icon={x.icon ?? 'analytics'} intent={intent} value={x.n} label={x.label} onClick={click} pressed={!!x.on} />;
        if (v === 'solid') return <StatSolid key={x.k ?? i} animate={animate} icon={x.icon ?? 'analytics'} intent={intent} value={x.n} label={x.label} onClick={click} pressed={!!x.on} />;
        if (v === 'percent') return <StatRing key={x.k ?? i} animate={animate} pct={p} intent={intent} label={x.label} note={String(x.n)} onClick={click} pressed={!!x.on} />;
        const inner = (
          <>
            <span className="sring" role="progressbar" aria-valuenow={p} aria-valuemin={0} aria-valuemax={100} aria-label={`${x.label}: ${p}%`} style={{ '--seg-from': p } as CSSProperties}><span className="fw6"><Cnt v={p} animate={animate} /><small>%</small></span></span>
            <span className="nv"><span className="l">{x.label}</span><span className="n"><Cnt v={x.n} animate={animate} /></span></span>
          </>
        );
        const cls = `stat i-${intent} s-${size}${b ? ' act' : ''}`;
        return b
          ? <button key={x.k} type="button" className={cls} aria-pressed={!!x.on} onClick={() => onStat?.(x.k!)}>{inner}</button>
          : <div key={i} className={cls}>{inner}</div>;
      })}
    </div>
  );
}

const Fw = ({ children }: { children: ReactNode }) => <span className="fw6">{children}</span>;

export function KpiTrend({ animate = true, title, value, spark, delta, good = 1, note }: { /** count the numbers up once when they appear (MO-02); false shows them at once */ animate?: boolean; title: string; value: ReactNode; spark?: readonly unknown[]; delta?: unknown; good?: number; note?: string }) {
  const { prefs } = usePrefs();
  const dir = dirOf(delta), intent = intentOfDir(dir, good);
  return (
    <section className="wg wg-trend">
      <div className="wg-tr"><div className="wg-c"><span className="wg-t">{title}</span><span className="wg-v wg-big"><Cnt v={value} animate={animate} /></span></div>{spark ? <div className="wg-sp"><Spark vals={spark} intent={chartIntentOfDelta(delta)} h={44} label={title} /></div> : null}</div>
      {delta == null ? (note ? <div className="wg-n">{note}</div> : null) : <div className={`wg-f i-${intent}`}><Icon name={dir > 0 ? 'trending_up' : dir < 0 ? 'trending_down' : 'trending_flat'} /><Fw>{(dir > 0 ? '+' : dir < 0 ? '−' : '') + Math.abs(wgN(delta)).toLocaleString(localeOf(prefs.lang)) + '%'}</Fw><span>{note || ''}</span></div>}
    </section>
  );
}
/** The root of a number card: a `section`, or a `button` (a filter: TB-31) when the card has `onClick`. */
function WgRoot({ cls, onClick, pressed, children }: { cls: string; onClick?: () => void; pressed?: boolean; children: ReactNode }) {
  return onClick ? <button type="button" className={`${cls} wg-act`} aria-pressed={!!pressed} onClick={onClick}>{children}</button> : <section className={cls}>{children}</section>;
}
export function StatIcon({ animate = true, icon, intent = 'brand', value, label, delta, good = 1, onClick, pressed }: { onClick?: () => void; pressed?: boolean; /** count the numbers up once when they appear (MO-02); false shows them at once */ animate?: boolean; icon: string; intent?: string; value: ReactNode; label: string; delta?: unknown; good?: number }) {
  return <WgRoot cls="wg wg-row" onClick={onClick} pressed={pressed}><IconTile icon={icon} intent={intent} /><div className="wg-c"><span className="wg-v"><Cnt v={value} animate={animate} /></span><span className="wg-t">{label}</span></div>{delta != null ? <D v={delta} good={good} /> : null}</WgRoot>;
}
export function StatRing({ animate = true, pct, label, intent = 'brand', note, onClick, pressed }: { onClick?: () => void; pressed?: boolean; /** count the numbers up once when they appear (MO-02); false shows them at once */ animate?: boolean; pct: unknown; label: string; intent?: string; note?: string }) {
  return (
    <WgRoot cls="wg wg-row" onClick={onClick} pressed={pressed}><Ring pct={pct} intent={intent} size={48} stroke={7} label={label + ' ' + Math.round(wgN(pct)) + '%'} />
      <div className="wg-c"><span className="wg-v"><Cnt v={Math.round(wgN(pct)) + '%'} animate={animate} /></span><span className="wg-t">{label}</span>{note ? <span className="wg-n">{note}</span> : null}</div></WgRoot>
  );
}
export function WArea({ animate = true, icon, intent = 'brand', label, value, delta, good = 1, spark }: { /** count the numbers up once when they appear (MO-02); false shows them at once */ animate?: boolean; icon: string; intent?: string; label: string; value: string; delta?: unknown; good?: number; spark: readonly unknown[] }) {
  return (
    <section className="wg"><div className="wg-row0"><IconTile icon={icon} intent={intent} /><div className="wg-c"><span className="wg-t">{label}</span><span className="wg-v"><Cnt v={value} animate={animate} /></span></div>{delta != null ? <D v={delta} good={good} /> : null}</div>
      <Spark vals={spark} intent={chartIntentOfDelta(delta, intent)} w={280} h={96} area dot label={label} /></section>
  );
}
export function WDonut({ animate = true, pct, center, value, label, intent = 'brand' }: { /** count the numbers up once when they appear (MO-02); false shows them at once */ animate?: boolean; pct: unknown; center?: string; value: string; label: string; intent?: string }) {
  const c = center || Math.round(wgN(pct)) + '%';
  return (
    <section className="wg wg-mid"><Ring pct={pct} intent={intent} size={148} stroke={26} inner={<span className="fw6">{c}</span>} label={label + ' ' + c} />
      <div className="wg-c wg-ctr"><span className="wg-v"><Cnt v={value} animate={animate} /></span><span className="wg-t">{label}</span></div></section>
  );
}
export function WBars({ animate = true, title, value, delta, good = 1, note, vals, labels, hi, intent = 'brand', actions }: { /** count the numbers up once when they appear (MO-02); false shows them at once */ animate?: boolean; title: string; value: string; delta?: unknown; good?: number; note?: string; vals: readonly unknown[]; labels: readonly string[]; hi?: number | null; intent?: string; actions?: ReactNode }) {
  const mx = Math.max(...vals.map(wgN)) || 1, h = hi == null ? vals.length - 1 : hi;
  return (
    <section className="wg"><WgHead title={title} actions={actions} />
      <div className="wg-c"><span className="wg-v"><Cnt v={value} animate={animate} /></span><span className="wg-n">{delta != null ? <><Delta v={delta} good={good} /> </> : null}{note || ''}</span></div>
      <div className={`wg-bars i-${chartIntentOfDelta(delta, intent)}`} role="img" aria-label={title + ': ' + labels.map((l, i) => l + ' ' + vals[i]).join(', ')}>
        {vals.map((v, i) => <span key={i} className="wg-b"><i className={i === h ? 'wg-hi' : ''} style={{ height: `${barHeight(v, mx)}%` }} /><small>{labels[i] || ''}</small></span>)}
      </div></section>
  );
}
export function WLine({ animate = true, title, value, delta, good = 1, note, spark, labels = [], intent = 'brand', actions }: { /** count the numbers up once when they appear (MO-02); false shows them at once */ animate?: boolean; title: string; value: string; delta?: unknown; good?: number; note?: string; spark: readonly unknown[]; labels?: readonly string[]; intent?: string; actions?: ReactNode }) {
  return (
    <section className="wg"><WgHead title={title} actions={actions} />
      <div className="wg-c"><span className="wg-v"><Cnt v={value} animate={animate} />{delta != null ? <> <Delta v={delta} good={good} /></> : null}</span>{note ? <span className="wg-n">{note}</span> : null}</div>
      <Spark vals={spark} intent={chartIntentOfDelta(delta, intent)} w={280} h={110} area label={title} />
      {labels.length ? <div className="wg-xl">{labels.map((l, i) => <small key={i}>{l}</small>)}</div> : null}</section>
  );
}
export function WProgressList({ animate = true, title, items, actions }: { /** count the numbers up once when they appear (MO-02); false shows them at once */ animate?: boolean; title: string; items: readonly { label: string; value: string; target: string; v: unknown; of: unknown; intent?: string }[]; actions?: ReactNode }) {
  return (
    <section className="wg"><WgHead title={title} actions={actions} />
      <div className="wg-pl">{items.map((x, i) => {
        const p = progressPct(x.v, x.of);
        return (
          <div key={i} className="wg-pr"><span className={`wg-pbar i-${x.intent || 'brand'}`} role="progressbar" aria-valuenow={p} aria-valuemin={0} aria-valuemax={100} aria-label={x.label}><i style={{ width: `${p}%` }} /></span>
            <div className="wg-prl"><span>{x.label}</span><span><Fw><Cnt v={x.value} animate={animate} /></Fw> <span className="wg-n">/ {x.target}</span></span></div></div>
        );
      })}</div></section>
  );
}
export function WGauge({ animate = true, title, value, target, fmt = (v: number) => String(v), note = '', intent = 'brand', actions }: { /** count the numbers up once when they appear (MO-02); false shows them at once */ animate?: boolean; title: string; value: unknown; target: unknown; fmt?: (v: number) => string; note?: string; intent?: string; actions?: ReactNode }) {
  const { t } = usePrefs();
  const g = gaugeModel(value, target);
  return (
    <section className="wg"><WgHead title={title} actions={actions} />
      <div className={`wg-gauge i-${intent}`} role="img" aria-label={fill(t('wg.g.sr'), { t: title, p: g.pc, v: fmt(g.v), g: fmt(g.tg) })}>
        <svg viewBox="0 0 172 96" width="172" height="96" aria-hidden="true"><path className="bg" d="M16,86 A70,70 0 0 1 156,86" /><path className="fg" d="M16,86 A70,70 0 0 1 156,86" strokeDasharray={g.dash} /></svg>
        <span className="wg-gc"><span className="fw6"><Cnt v={g.pc + '%'} animate={animate} /></span><small>{t('wg.g.of')}</small></span></div>
      <p className="wg-gt">{fill(t('wg.g.txt'), { v: fmt(g.v), g: fmt(g.tg) })}</p>
      <div className="wg-g2">
        <div className="wg-c"><span className="wg-t"><WgDot intent={intent} />{t('wg.g.ach')}</span><span className="wg-v wg-sml"><Cnt v={fmt(g.v)} animate={animate} /></span></div>
        <div className="wg-c"><span className="wg-t"><i className="wg-dot wg-dot-track" aria-hidden="true" />{t('wg.g.rest')}</span><span className="wg-v wg-sml">{fmt(g.rest)}</span></div>
      </div>
      {note ? <span className="wg-n">{note}</span> : null}</section>
  );
}
export function WRingList({ animate = true, title, items, actions }: { /** count the numbers up once when they appear (MO-02); false shows them at once */ animate?: boolean; title: string; items: readonly { label: string; value: string; pct: unknown; intent?: string; icon?: string; delta?: unknown; good?: number }[]; actions?: ReactNode }) {
  return (
    <section className="wg"><WgHead title={title} actions={actions} />
      <div className="wg-rl">{items.map((x, i) => (
        <div key={i} className="wg-rli"><Ring pct={x.pct} intent={x.intent || 'brand'} size={52} stroke={6} inner={<Icon name={x.icon || 'circle'} />} label={x.label + ' ' + Math.round(wgN(x.pct)) + '%'} />
          <div className="wg-c"><span className="wg-t">{x.label}</span><span className="wg-v wg-sml"><Cnt v={x.value} animate={animate} />{x.delta != null ? <> <Delta v={x.delta} good={x.good || 1} /></> : null}</span></div></div>
      ))}</div></section>
  );
}
export function StatSolid({ animate = true, icon, value, label, delta, good = 1, intent = 'brand', onClick, pressed }: { onClick?: () => void; pressed?: boolean; /** count the numbers up once when they appear (MO-02); false shows them at once */ animate?: boolean; icon: string; value: ReactNode; label: string; delta?: unknown; good?: number; intent?: string }) {
  return <WgRoot cls={`wg wg-row wg-solid i-${intent}`} onClick={onClick} pressed={pressed}><span className="wg-si"><Icon name={icon} /></span><div className="wg-c"><span className="wg-v"><Cnt v={value} animate={animate} /></span><span className="wg-t">{label}</span></div>{delta != null ? <D v={delta} good={good} /> : null}</WgRoot>;
}
export function StatSoft({ animate = true, icon, value, label, delta, good = 1, intent = 'brand', onClick, pressed }: { onClick?: () => void; pressed?: boolean; /** count the numbers up once when they appear (MO-02); false shows them at once */ animate?: boolean; icon: string; value: ReactNode; label: string; delta?: unknown; good?: number; intent?: string }) {
  return <WgRoot cls={`wg wg-row wg-soft i-${intent}`} onClick={onClick} pressed={pressed}><IconTile icon={icon} intent={intent} /><div className="wg-c"><span className="wg-v"><Cnt v={value} animate={animate} /></span><span className="wg-t">{label}</span></div>{delta != null ? <D v={delta} good={good} /> : null}</WgRoot>;
}
export function WSegments({ title, segs, center, actions }: { title: string; segs: readonly Seg[]; center?: string; actions?: ReactNode }) {
  const tot = segTotal(segs);
  return (
    <section className="wg"><WgHead title={title} actions={actions} />
      <div className="wg-seg"><DonutSegs segs={segs} size={132} stroke={24} inner={center ? <span className="fw6">{center}</span> : undefined} label={title + ': ' + segs.map((x) => x.label + ' ' + Math.round(wgN(x.v) / tot * 100) + '%').join(', ')} />
        <ul className="wg-lg">{segs.map((x, i) => <li key={i}><WgDot intent={x.intent} /><span>{x.label}</span><Fw>{Math.round(wgN(x.v) / tot * 100)}%</Fw></li>)}</ul></div></section>
  );
}
export function KpiCompact({ animate = true, title, value, label, spark, intent = 'brand', delta }: { /** the change: it gives the colour of the sparkline (WG-09) */ delta?: unknown; /** count the numbers up once when they appear (MO-02); false shows them at once */ animate?: boolean; title: string; value: ReactNode; label?: string; spark?: readonly unknown[]; intent?: string }) {
  return (
    <section className="wg"><WgHead title={title} />
      <div className="wg-tr"><div className="wg-c"><span className="wg-v"><Cnt v={value} animate={animate} /></span>{label ? <span className="wg-t">{label}</span> : null}</div>{spark ? <div className="wg-sp"><Spark vals={spark} intent={chartIntentOfDelta(delta, intent)} h={36} dot label={title} /></div> : null}</div></section>
  );
}
