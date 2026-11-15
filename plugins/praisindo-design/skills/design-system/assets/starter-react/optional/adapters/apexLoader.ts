// Loads ApexCharts from the npm bundle on first use (the prototype used a CDN <script>). It is a dynamic import so that
// pages without charts, and unit tests that inject a fake library, never evaluate the real one.
import type { ChartCtor } from './chartTypes.ts';

let cached: Promise<ChartCtor> | null = null;

export function loadApex(): Promise<ChartCtor> {
  if (!cached) {
    cached = import('apexcharts').then((m) => {
      const mod = m as unknown as { default?: unknown };
      return (mod.default ?? m) as unknown as ChartCtor;
    });
    cached.catch(() => { cached = null; }); // a failed load may be retried (Retry button)
  }
  return cached;
}
