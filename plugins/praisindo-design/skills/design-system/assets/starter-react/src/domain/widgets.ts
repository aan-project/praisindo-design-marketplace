// Pure geometry and numbers of the chart widgets (ported from wgN, Delta, wgPath, Spark, Ring, DonutSegs, WGauge, WBars, WProgressList in the prototype).
import { localeOf } from '../lib/dateFormat';

export const wgN = (v: unknown): number => (Number.isFinite(+(v as number)) ? +(v as number) : 0);
export const clamp100 = (v: number): number => Math.max(0, Math.min(100, v));

export interface DeltaModel { dir: 1 | 0 | -1; intent: 'neutral' | 'success' | 'danger'; text: string; icon: string; wordKey: 'wg.up' | 'wg.down' | 'wg.flat' }
export function deltaModel(v: unknown, lang: string, good = 1, unit = '%'): DeltaModel {
  const n = wgN(v), dir = (n > 0 ? 1 : n < 0 ? -1 : 0) as 1 | 0 | -1, ok = dir === 0 ? null : dir === good;
  return {
    dir, intent: ok === null ? 'neutral' : ok ? 'success' : 'danger',
    text: (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n).toLocaleString(localeOf(lang)) + unit,
    icon: dir > 0 ? 'trending_up' : dir < 0 ? 'trending_down' : 'trending_flat',
    wordKey: dir > 0 ? 'wg.up' : dir < 0 ? 'wg.down' : 'wg.flat',
  };
}
export const dirOf = (v: unknown): 1 | 0 | -1 => (wgN(v) > 0 ? 1 : wgN(v) < 0 ? -1 : 0);
/** The colour of a chart that shows a number that goes up or down (rule WG-09, owner 2026-11-17): a chart of a number that goes up is brand, one that goes down is red (danger); with no change given the chart keeps its own colour. */
export const chartIntentOfDelta = (delta: unknown, fallback = 'brand'): string => (delta == null ? fallback : dirOf(delta) < 0 ? 'danger' : dirOf(delta) > 0 ? 'brand' : 'neutral');
/** The class of a number that goes up (green) or down (red) wherever it is written, not only in a chip (rule WG-08, owner 2026-11-17); 0 and a missing number have none. */
export const trendCls = (n: unknown): string => { const v = Number(n); return !Number.isFinite(v) || v === 0 ? '' : v > 0 ? 'tnd-up' : 'tnd-dn'; };
export const intentOfDir = (dir: number, good = 1): 'neutral' | 'success' | 'danger' => (dir === 0 ? 'neutral' : dir === good ? 'success' : 'danger');

const f1 = (x: number) => x.toFixed(1);
/** Smooth path through points (Catmull-Rom → cubic Bézier). */
export function wgPath(P: readonly (readonly [number, number])[]): string {
  if (P.length < 2) return '';
  let d = `M${f1(P[0]![0])},${f1(P[0]![1])}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[i - 1] || P[i]!, p1 = P[i]!, p2 = P[i + 1]!, p3 = P[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f1(c1[0]!)},${f1(c1[1]!)} ${f1(c2[0]!)},${f1(c2[1]!)} ${f1(p2[0])},${f1(p2[1])}`;
  }
  return d;
}

export interface SparkModel { d: string; area: string; dot: { cx: string; cy: string } }
export function sparkModel(vals: readonly unknown[], w: number, h: number): SparkModel {
  const V = vals.map(wgN), mn = Math.min(...V), mx = Math.max(...V), pad = 4, rg = mx - mn || 1;
  const P = V.map((v, i): [number, number] => [pad + i * (w - 2 * pad) / Math.max(1, V.length - 1), h - pad - (v - mn) / rg * (h - 2 * pad)]);
  const d = wgPath(P), L = P[P.length - 1]!;
  return { d, area: `${d} L${f1(L[0])},${h} L${f1(P[0]![0])},${h} Z`, dot: { cx: f1(L[0]), cy: f1(L[1]) } };
}

export function ringModel(pct: unknown, size: number, stroke: number) {
  const p = clamp100(wgN(pct)), r = (size - stroke) / 2, C = 2 * Math.PI * r;
  return { p, r, dash: `${(C * p / 100).toFixed(2)} ${C.toFixed(2)}`, c: size / 2 };
}

export function donutArcs(segs: readonly { v: unknown; intent: string }[], size: number, stroke: number) {
  const tot = segs.reduce((n, x) => n + wgN(x.v), 0) || 1, r = (size - stroke) / 2, C = 2 * Math.PI * r;
  let off = 0;
  return segs.map((x) => {
    const len = C * wgN(x.v) / tot, gap = segs.length > 1 ? 2 : 0;
    const a = { intent: x.intent, dash: `${Math.max(0, len - gap).toFixed(2)} ${C.toFixed(2)}`, offset: (-off).toFixed(2) };
    off += len;
    return a;
  });
}
export const segTotal = (segs: readonly { v: unknown }[]): number => segs.reduce((n, x) => n + wgN(x.v), 0) || 1;

export function gaugeModel(value: unknown, target: unknown) {
  const v = wgN(value), tg = Math.max(0, wgN(target)), p = tg ? clamp100(v / tg * 100) : 0, L = Math.PI * 70;
  return { v, tg, rest: Math.max(0, tg - v), pc: Math.round(p), dash: `${(L * p / 100).toFixed(2)} ${L.toFixed(2)}` };
}
/** WProgressList row percentage. */
export const progressPct = (v: unknown, of: unknown): number => clamp100(Math.round(wgN(v) / Math.max(1, wgN(of)) * 100));
/** WBars bar height (percent of the tallest). */
export const barHeight = (v: unknown, mx: number): number => Math.max(4, Math.round(wgN(v) / mx * 100));
/** StatCards percentage. */
export const statPct = (pct: unknown): number => Math.max(0, Math.min(100, Math.round((pct as number) || 0)));
