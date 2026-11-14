// Count-up of the numbers of the stat cards, KPI and widgets (rule MO-02). `countText` is pure (the first number of a text, counted from 0 to its value in the format of the language);
// `useCountUp` runs it once when the component appears and always ends on the exact text it was given. Motion is off for reduced motion and for automated browsers (rule MO-03).
import { useLayoutEffect, useState } from 'react';
import type { Lang } from '../i18n';
import { localeOf } from './dateFormat';

/** true when the interface may move: the system does not ask for reduced motion, the browser is not driven by automation and is not jsdom. */
export function motionOn(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  if (typeof navigator !== 'undefined' && (navigator.webdriver || /jsdom/i.test(navigator.userAgent))) return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
export const COUNT_MS = 600;
const ease = (p: number) => 1 - Math.pow(1 - p, 3);
const NUM = /\d[\d.,]*\d|\d/;

/** The text with its first number at progress p (0 to 1): "Rp1.5B" at .5 is "Rp0.8B"; the decimals and the grouping of the original are kept; p of 1 returns the text itself. */
export function countText(text: string, p: number, lang: Lang): string {
  if (p >= 1) return text;
  const m = NUM.exec(text); if (!m) return text;
  const tok = m[0], dec = lang === 'id' ? ',' : '.', grp = lang === 'id' ? '.' : ',';
  const decimals = tok.includes(dec) ? tok.length - tok.lastIndexOf(dec) - 1 : 0;
  const target = Number(tok.split(grp).join('').replace(dec, '.')); if (!Number.isFinite(target)) return text;
  const out = (target * ease(Math.max(0, p))).toLocaleString(localeOf(lang), { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: tok.includes(grp) });
  return text.slice(0, m.index) + out + text.slice(m.index + tok.length);
}

/** The text to show: the final text on the server and when motion is off; otherwise it counts up once after the first render and later changes of the text show at once. */
export function useCountUp(text: string, animate: boolean, lang: Lang): string {
  const [p, setP] = useState(1);
  useLayoutEffect(() => {
    if (!animate || !text || !motionOn()) return undefined;
    let raf = 0, t0 = 0; setP(0);
    const step = (t: number) => { if (!t0) t0 = t; const q = Math.min(1, (t - t0) / COUNT_MS); setP(q); if (q < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return countText(text, p, lang);
}
