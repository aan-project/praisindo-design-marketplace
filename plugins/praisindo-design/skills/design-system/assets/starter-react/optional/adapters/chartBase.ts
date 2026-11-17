// Base options of the prototype's mkChart(el) (the first prototype, section 5c). Every value that depends on the theme is read from CSS
// custom properties at creation time, which is why the adapter recreates the chart when mode, brand, font size or language changes.
import { motionOn } from '../../lib/countUp';
import type { ChartOptions } from './chartTypes.ts';

export type CssVarReader = (name: string) => string;

export function chartBase(dark: boolean, cv: CssVarReader): ChartOptions & { chart: ChartOptions } {
  return {
    chart: { height: 240, fontFamily: cv('--ff'), foreColor: cv('--color-text-secondary'), toolbar: { show: false }, animations: motionOn() ? { enabled: true, easing: 'easeout', speed: 600 } : { enabled: false }, background: 'transparent' },
    theme: { mode: dark ? 'dark' : 'light' },
    dataLabels: { enabled: false },
    grid: { borderColor: cv('--color-border-neutral-default') },
  };
}

/** `Object.assign({}, base, {chart: Object.assign({}, base.chart, chartPatch), ...rest})`, the pattern every prototype chart uses. */
export function withChart(base: ReturnType<typeof chartBase>, chartPatch: ChartOptions, rest: ChartOptions = {}): ChartOptions {
  const o: ChartOptions = Object.assign({}, base, { chart: Object.assign({}, base.chart, chartPatch) }, rest);
  return multiLine(o);
}

/** CT-01 (owner 2026-11-17, revised the same day): every line or area chart is drawn like the Opportunity trend chart of Analytics: straight lines of 2px, a soft solid fill of 12%, no marker on the points, the legend on top
 *  (with more than one series) and a shared tooltip that lists the value of every series at the hovered point. A bar chart, a donut and a mixed chart (a series with a type of its own, the candlesticks) keep their own look. */
export function multiLine(o: ChartOptions): ChartOptions {
  const type = (o.chart as ChartOptions | undefined)?.type, series = o.series as unknown;
  if ((type !== 'area' && type !== 'line') || !Array.isArray(series) || series.length < 1) return o;
  if (series.some((s) => s && typeof s === 'object' && 'type' in (s as object))) return o;
  const out = Object.assign({}, o, {
    stroke: Object.assign({}, o.stroke as ChartOptions | undefined, { curve: 'straight', width: 2 }),
    fill: Object.assign({}, o.fill as ChartOptions | undefined, { type: 'solid', opacity: 0.12 }),
    markers: Object.assign({}, o.markers as ChartOptions | undefined, { size: 0 }),
    tooltip: Object.assign({}, o.tooltip as ChartOptions | undefined, { shared: true, intersect: false }),
  });
  return series.length > 1 ? Object.assign(out, { legend: Object.assign({}, o.legend as ChartOptions | undefined, { position: 'top' }) }) : out;
}
