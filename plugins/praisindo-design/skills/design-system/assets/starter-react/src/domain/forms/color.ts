// Colour maths of the colour picker (rule FM-19): hex <-> hue, saturation, brightness. Pure functions, no DOM.
export interface Hsv { h: number; s: number; v: number }   // h 0 to 360, s and v 0 to 1

const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
export const isHex6 = (h: string): boolean => /^#[0-9a-f]{6}$/i.test(h);

/** `#rrggbb` to hue / saturation / brightness; null when the text is not a complete hex colour. */
export function hexToHsv(hex: string): Hsv | null {
  if (!isHex6(hex)) return null;
  const r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) h = max === r ? ((g - b) / d + (g < b ? 6 : 0)) * 60 : max === g ? ((b - r) / d + 2) * 60 : ((r - g) / d + 4) * 60;
  return { h, s: max ? d / max : 0, v: max };
}

/** Hue / saturation / brightness to `#rrggbb` (lower case). */
export function hsvToHex({ h, s, v }: Hsv): string {
  const hh = ((h % 360) + 360) % 360 / 60, i = Math.floor(hh), f = hh - i, S = clamp(s), V = clamp(v);
  const p = V * (1 - S), q = V * (1 - S * f), t = V * (1 - S * (1 - f));
  const [r, g, b] = [[V, t, p], [q, V, p], [p, V, t], [p, q, V], [t, p, V], [V, p, q]][i % 6]!;
  const x = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
  return '#' + x(r) + x(g) + x(b);
}

/** A colour as the browser gives it (`#007bff`, `rgb(0, 123, 255)`) to `#rrggbb`; '' when it is neither. */
export function toHex(css: string): string {
  const s = css.trim();
  if (/^#[0-9a-f]{6}$/i.test(s)) return s.toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(s)) return '#' + s.slice(1).split('').map((c) => c + c).join('').toLowerCase();
  const m = /^rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)/i.exec(s);
  return m ? '#' + [m[1], m[2], m[3]].map((n) => Math.min(255, +n!).toString(16).padStart(2, '0')).join('') : '';
}
