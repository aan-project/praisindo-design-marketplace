#!/usr/bin/env node
// WCAG contrast checker (skill design-system v2.107.0). Zero dependencies.
//   node scripts/contrast.mjs <foreground> <background>        e.g. node scripts/contrast.mjs "#5c5c5c" "#ffffff"
//   node scripts/contrast.mjs --brand <primary> [<secondary>]   checks a Branding choice against the Praisindo rules
// Rules: text needs at least 4.5:1; the primary brand colour needs at least 3:1 against white (Branding form rule), because the engine derives the text colours from it.
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const rgb = (h) => { const m = /^#?([0-9a-f]{6})$/i.exec(String(h).trim()); if (!m) throw new Error('not a 6-digit hex colour: ' + h); const n = parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const L = (h) => { const [r, g, b] = rgb(h); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
export const contrast = (a, b) => { const x = L(a), y = L(b), [hi, lo] = x > y ? [x, y] : [y, x]; return (hi + 0.05) / (lo + 0.05); };

const a = process.argv.slice(2);
try {
  if (a[0] === '--brand') {
    const [p, s] = [a[1], a[2]];
    const cp = contrast(p, '#ffffff');
    console.log(`primary ${p}: ${cp.toFixed(2)}:1 against white — ${cp >= 3 ? 'ok (needs 3:1)' : 'FAILS the 3:1 rule of the Branding form'}`);
    if (s) { const cs = contrast(s, '#ffffff'); console.log(`secondary ${s}: ${cs.toFixed(2)}:1 against white — informational (only the primary is gated)`); }
    process.exit(cp >= 3 ? 0 : 1);
  }
  if (a.length < 2) { console.error('usage: contrast.mjs <fg> <bg>  |  contrast.mjs --brand <primary> [<secondary>]'); process.exit(2); }
  const c = contrast(a[0], a[1]);
  console.log(`${a[0]} on ${a[1]}: ${c.toFixed(2)}:1 — ${c >= 7 ? 'AAA' : c >= 4.5 ? 'AA (text ok)' : c >= 3 ? 'large text / UI only' : 'FAILS'}`);
  process.exit(c >= 4.5 ? 0 : 1);
} catch (e) { console.error(e.message); process.exit(2); }
