// Ported from the prototype (colour engine: rgb, mix, lum, contrastW, ramp, cRatio, darkIntent).
// Arithmetic, rounding and loop limits are intentionally identical to the prototype.
import { BR0, DK, type Ramp } from './palette.ts';

export type RGB = number[];

export const validHex = (h: string): boolean => /^#[0-9a-f]{6}$/i.test(h);
export const rgb = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.substr(i, 2), 16));
export const mix = (a: RGB, b: RGB, w: number): string =>
  '#' + a.map((v, i) => Math.round(v + (b[i] - v) * w).toString(16).padStart(2, '0')).join('');
export const lum = (c: RGB): number => {
  const [r, g, b] = c.map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrastW = (h: string): number => 1.05 / (lum(rgb(h)) + 0.05);

export function ramp(p: string): Ramp {
  p = p.toLowerCase();
  if (p === '#007bff') return BR0;
  const c = rgb(p), W = [255, 255, 255], K = [0, 0, 0];
  return {
    50: mix(c, W, 0.95), 100: mix(c, W, 0.85), 200: mix(c, W, 0.75), 300: mix(c, W, 0.55), 400: mix(c, W, 0.25),
    500: p, 600: mix(c, K, 0.08), 700: mix(c, K, 0.3), 800: mix(c, K, 0.4), 900: mix(c, K, 0.5), 950: mix(c, K, 0.7),
  };
}

export const cRatio = (a: string, b: string): number => {
  const x = lum(rgb(a)), y = lum(rgb(b));
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

export interface DarkIntent { sub: string; fill: string; fg: string; strong: string; bSub: string; bDef: string }

export function darkIntent(hex: string, onWhite: boolean): DarkIntent {
  const c = rgb(hex), W = [255, 255, 255], K = [0, 0, 0], card = rgb(DK.card);
  let fill = hex;
  if (onWhite) {
    let k = 0;
    while (cRatio('#ffffff', fill) < 4.5 && k < 0.6) { k += 0.02; fill = mix(c, K, k); }
  }
  let fg = mix(c, W, 0.28), n = 0;
  while (cRatio(fg, DK.card) < 4.5 && n < 20) { fg = mix(rgb(fg), W, 0.15); n++; }
  return { sub: mix(card, c, 0.18), fill, fg, strong: mix(c, W, 0.58), bSub: mix(card, c, 0.35), bDef: mix(card, c, 0.6) };
}
