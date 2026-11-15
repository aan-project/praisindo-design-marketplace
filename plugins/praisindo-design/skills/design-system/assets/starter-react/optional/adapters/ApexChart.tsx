// React adapter for ApexCharts. React owns the container <div>; the library owns what it draws inside it.
// Lifecycle (blueprint section 4, decision D6):
//   - create in an effect, after PrefsProvider has written the CSS variables (it applies them in a layout effect);
//   - RECREATE when `themeKey` changes (colours, font and legend size are read from CSS variables at creation time);
//   - updateOptions when only `dataKey` changes;
//   - destroy() in cleanup, always;
//   - a library or build failure shows `fallback` (the prototype's ui.chartFail) until `resetKey` changes (the Retry button).
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { usePrefsOptional } from '../../app/providers/PrefsProvider.tsx';
import { cv } from '../../lib/cssVar.ts';
import { loadApex } from './apexLoader.ts';
import { chartBase } from './chartBase.ts';
import type { ChartCtor, ChartHandle, ChartOptions } from './chartTypes.ts';
import { adapterStats } from './lifecycle.ts';

export interface ChartTheme { dark: boolean; key: string }

/** Everything the prototype's mkChart reads from the environment: resolved mode, brand colours, font, font size, language. */
export function useChartTheme(): ChartTheme {
  const p = usePrefsOptional();
  if (!p) return { dark: false, key: 'no-prefs' };
  return { dark: p.prefs.mode === 'dark', key: [p.prefs.mode, p.prefs.lang, p.prefs.fs, p.brand.primary, p.brand.secondary, p.brand.font].join('|') };
}

export interface ApexChartProps {
  /** Chart id: written to `data-chart` exactly like the prototype (`dist`, `h-seg`, `an-trend`, ...). */
  id: string;
  /** Builds the options from the base options (same shape as the prototype's chart functions). Always called with fresh CSS variables. */
  build: (base: ReturnType<typeof chartBase>) => ChartOptions;
  /** Signature of the data behind `build`; a change calls updateOptions. */
  dataKey?: string;
  /** Minimum height in px (prototype: 240 home, 260 customer / analytics). */
  minHeight?: number;
  /** Shown instead of the container when the library cannot load or `build` throws. */
  fallback?: ReactNode;
  /** Change to try again after a failure. */
  resetKey?: unknown;
  onFail?: (id: string, error: unknown) => void;
  /** Inject the library (tests, e2e); default is the npm bundle. */
  lib?: ChartCtor;
  /** Override the theme (tests); default comes from PrefsProvider. */
  theme?: ChartTheme;
}

export function ApexChart({ id, build, dataKey = '', minHeight = 240, fallback = null, resetKey, onFail, lib, theme }: ApexChartProps) {
  const own = useChartTheme();
  const th = theme ?? own;
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ChartHandle | null>(null);
  const builtKey = useRef<string>('');
  const buildRef = useRef(build); buildRef.current = build;
  const failRef = useRef(onFail); failRef.current = onFail;
  const darkRef = useRef(th.dark); darkRef.current = th.dark;
  const dataKeyRef = useRef(dataKey); dataKeyRef.current = dataKey;
  const [failed, setFailed] = useState(false);

  useEffect(() => { setFailed(false); }, [resetKey]);

  useEffect(() => {
    const el = ref.current;
    if (!el || failed) return;
    let dead = false;
    let chart: ChartHandle | null = null;
    const fail = (e: unknown) => { if (dead) return; failRef.current?.(id, e); setFailed(true); };
    let wait: ReturnType<typeof setTimeout> | undefined;
    // While a lazily loaded page is still arriving, React keeps the page it is replacing in the document with `display: none`. ApexCharts measures its container when it is created and
    // writes NaN sizes into a hidden one, so creation waits until no ancestor is hidden that way (or the chart is gone).
    const hidden = () => !!el.closest('[style*="display: none"]');
    let ro: ResizeObserver | undefined, lastW = 0, raf = 0;
    // A chart that is still drawing when its page gets hidden (the next lazy page is arriving) would write NaN sizes: pause it (destroy) and build it again once it is visible.
    const pause = (L: ChartCtor) => {
      if (!chart) return;
      try { chart.destroy(); } catch { /* ignore, as in the cleanup */ }
      adapterStats.chartDown(); if (chartRef.current === chart) chartRef.current = null; chart = null; builtKey.current = '';
      wait = setTimeout(() => make(L), 50);
    };
    const make = (L: ChartCtor): void => {
      if (dead) return;
      if (hidden()) { wait = setTimeout(() => make(L), 50); return; }
      try {
        const opts = buildRef.current(chartBase(darkRef.current, cv));
        chart = new L(el, opts);
        chartRef.current = chart;
        builtKey.current = dataKeyRef.current;
        adapterStats.chartUp();
        // render() is asynchronous and its rejection is not a failure state: the prototype ignores it (only a throwing build / constructor shows the failure card).
        // It rejects, for one, when the page is left before it finishes (destroy() clears what render() was about to read); swallowing it keeps that out of the console.
        lastW = el.clientWidth;
        // The container can grow after the chart was drawn (a detail page collapses the sidebar while the page arrives): the chart then fits it again (DS 2.73; ApexCharts redraws on a window resize).
        if (!ro && typeof ResizeObserver === 'function') {
          ro = new ResizeObserver(() => {
            if (dead || !chart) return;
            if (hidden()) { pause(L); return; }
            const w = el.clientWidth;
            if (w > 0 && Math.abs(w - lastW) > 1) { lastW = w; if (raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { raf = 0; if (!dead) window.dispatchEvent(new Event('resize')); }); }
          });
          ro.observe(el);
        }
        const done = chart.render();
        if (done && typeof (done as Promise<unknown>).catch === 'function') (done as Promise<unknown>).catch(() => undefined);
      } catch (e) { fail(e); }
    };
    if (lib) make(lib);
    else loadApex().then(make, fail);
    return () => {
      dead = true; if (wait) clearTimeout(wait); if (raf) cancelAnimationFrame(raf); ro?.disconnect();
      if (chart) { try { chart.destroy(); } catch { /* the prototype ignores destroy errors too */ } adapterStats.chartDown(); }
      if (chartRef.current === chart) chartRef.current = null;
    };
  }, [id, th.key, lib, resetKey, failed]);

  useEffect(() => {
    const c = chartRef.current;
    if (!c || builtKey.current === dataKey) return;
    builtKey.current = dataKey;
    try { c.updateOptions(buildRef.current(chartBase(darkRef.current, cv)), true, false); } catch (e) { failRef.current?.(id, e); setFailed(true); }
  }, [dataKey, id]);

  if (failed) return <>{fallback}</>;
  return <div ref={ref} data-chart={id} style={{ minHeight }} />;
}
