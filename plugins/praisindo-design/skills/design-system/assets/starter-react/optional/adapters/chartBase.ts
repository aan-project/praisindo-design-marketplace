// Base options of the prototype's mkChart(el) (the prototype, section 5c). Every value that depends on the theme is read from CSS
// custom properties at creation time, which is why the adapter recreates the chart when mode, brand, font size or language changes.
import type { ChartOptions } from './chartTypes.ts';

export type CssVarReader = (name: string) => string;

export function chartBase(dark: boolean, cv: CssVarReader): ChartOptions & { chart: ChartOptions } {
  return {
    chart: { height: 240, fontFamily: cv('--ff'), foreColor: cv('--color-text-secondary'), toolbar: { show: false }, animations: { enabled: false }, background: 'transparent' },
    theme: { mode: dark ? 'dark' : 'light' },
    dataLabels: { enabled: false },
    grid: { borderColor: cv('--color-border-neutral-default') },
  };
}

/** `Object.assign({}, base, {chart: Object.assign({}, base.chart, chartPatch), ...rest})`, the pattern every prototype chart uses. */
export function withChart(base: ReturnType<typeof chartBase>, chartPatch: ChartOptions, rest: ChartOptions = {}): ChartOptions {
  return Object.assign({}, base, { chart: Object.assign({}, base.chart, chartPatch) }, rest);
}
