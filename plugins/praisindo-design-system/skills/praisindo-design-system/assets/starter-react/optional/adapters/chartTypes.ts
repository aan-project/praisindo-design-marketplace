// Minimal structural types for the chart library, so the adapter and its tests never depend on the ApexCharts typings.
// ApexCharts 3.54.1 (the version the prototype loads from the CDN) satisfies ChartCtor.

/** ApexCharts options are a large open object; the adapter only passes them through. */
export type ChartOptions = Record<string, unknown>;

export interface ChartHandle {
  render(): unknown;
  updateOptions(options: ChartOptions, redraw?: boolean, animate?: boolean): unknown;
  destroy(): void;
}

export type ChartCtor = new (el: HTMLElement, options: ChartOptions) => ChartHandle;
