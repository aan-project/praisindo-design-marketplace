// Color field (rules FM-18 and FM-19, the same as the React `Input format="color"`): a hex color typed with or without the pound sign; the pound is added by itself, what is not a hex digit is dropped, at most six digits; the swatch (.csw) at the end of the field shows a valid color. The swatch is a button that opens the color picker under the field (FM-19): a square of saturation and brightness, a hue slider, the eyedropper where the browser has one, and the hex field. The alpha, the tabs Gradient and Image and saved colors of other pickers are not part of it.
//   initColorFields()  -> call once at boot; it is delegated (capture phase, so a page handler of the same input already sees the normalised value), the markup is `.inp > input` followed by `button.csw` (a plain `span.csw` has no picker).
//   The picker sets the value of the input and dispatches `input` on it, so a page listens to the input as it does for typing.
import { icon, esc } from './ui.js';
import { t } from './shell.js';

const norm = (raw) => { const d = String(raw).replace(/[^0-9a-fA-F]/g, '').slice(0, 6); return d ? '#' + d : ''; };
const valid = (h) => /^#[0-9a-f]{6}$/i.test(h);
const unit = (n) => Math.min(1, Math.max(0, n));
export function hexToHsv(hex) {
  if (!valid(hex)) return null;
  const n = parseInt(hex.slice(1), 16), r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0; if (d) { if (mx === r) h = ((g - b) / d + 6) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60; }
  return { h, s: mx ? d / mx : 0, v: mx };
}
export function hsvToHex({ h, s, v }) {
  const f = (n) => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); };
  return '#' + [f(5), f(3), f(1)].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
}
const HUES = [0, 60, 120, 180, 240, 300, 360].map((h) => `hsl(${h} 100% 50%)`).join(',');
let pop = null;
function close(focus = true) { if (!pop) return; pop.cleanup(); pop.el.remove(); pop.sw.setAttribute('aria-expanded', 'false'); if (focus) pop.sw.focus(); pop = null; }

function open(sw) {
  const wrap = sw.closest('.inp'), input = wrap.querySelector('input');
  if (pop && pop.sw === sw) { close(false); return; }
  close(false);
  let c = hexToHsv(input.value) ?? { h: 210, s: 1, v: 1 };
  const el = document.createElement('div'); el.className = 'fpop-fix';
  const eye = 'EyeDropper' in window;
  el.innerHTML = `<div class="fpop cpk" role="dialog" aria-label="${esc(t('ff.cpT'))}"><div class="cpk-t"><span class="fw6">${esc(t('ff.cpT'))}</span><button type="button" class="btn b-transparent i-neutral s-sm io" data-close aria-label="${esc(t('lg.close'))}">${icon('close')}</button></div>`
    + `<div class="cpk-sv" role="slider" tabindex="0" aria-label="${esc(t('ff.cpSv'))}" aria-valuemin="0" aria-valuemax="100"><span class="cpk-hd"></span></div>`
    + `<div class="cpk-r">${eye ? `<button type="button" class="btn b-outlined i-neutral s-md io" data-eye aria-label="${esc(t('ff.cpEye'))}">${icon('colorize')}</button>` : ''}<div class="cpk-hue" role="slider" tabindex="0" aria-label="${esc(t('ff.cpHue'))}" aria-valuemin="0" aria-valuemax="360" style="background-image:linear-gradient(90deg,${HUES})"><span class="cpk-hd"></span></div></div>`
    + `<div class="fld"><div class="inp s-md"><input type="text" spellcheck="false" autocapitalize="off" aria-label="Hex"><span class="csw" data-sw aria-hidden="true"></span></div></div></div>`;
  const sv = el.querySelector('.cpk-sv'), hue = el.querySelector('.cpk-hue'), hex = el.querySelector('.fld input'), hexSw = el.querySelector('.fld .csw');
  const paint = (fromHex) => {
    const cur = hsvToHex(c), pure = `hsl(${c.h} 100% 50%)`;
    sv.style.backgroundColor = pure; sv.setAttribute('aria-valuenow', Math.round(c.s * 100)); sv.setAttribute('aria-valuetext', `${Math.round(c.s * 100)}% / ${Math.round(c.v * 100)}%`);
    const hd = sv.firstElementChild; hd.style.left = `${c.s * 100}%`; hd.style.top = `${(1 - c.v) * 100}%`; hd.style.background = cur;
    hue.setAttribute('aria-valuenow', Math.round(c.h)); const hh = hue.firstElementChild; hh.style.left = `${(c.h / 360) * 100}%`; hh.style.background = pure;
    if (!fromHex) hex.value = cur; hexSw.style.background = valid(hex.value) ? hex.value : '';
  };
  const push = (n) => { c = n; const v = hsvToHex(c); input.value = v; wrap.querySelector('.csw').style.background = v; input.dispatchEvent(new Event('input', { bubbles: true })); paint(false); };
  const at = (e, f) => { const r = e.currentTarget.getBoundingClientRect(); if (r.width) f(unit((e.clientX - r.left) / r.width), unit((e.clientY - r.top) / r.height)); };
  const slide = (node, f) => { node.addEventListener('pointerdown', (e) => { node.setPointerCapture?.(e.pointerId); at(e, f); }); node.addEventListener('pointermove', (e) => { if (e.buttons) at(e, f); }); };
  slide(sv, (x, y) => push({ ...c, s: x, v: 1 - y })); slide(hue, (x) => push({ ...c, h: x * 360 }));
  sv.addEventListener('keydown', (e) => {
    const d = (e.shiftKey ? 10 : 1) / 100, k = e.key;
    if (k === 'ArrowLeft') push({ ...c, s: unit(c.s - d) }); else if (k === 'ArrowRight') push({ ...c, s: unit(c.s + d) }); else if (k === 'ArrowUp') push({ ...c, v: unit(c.v + d) }); else if (k === 'ArrowDown') push({ ...c, v: unit(c.v - d) }); else return;
    e.preventDefault();
  });
  hue.addEventListener('keydown', (e) => {
    const d = e.shiftKey ? 10 : 1;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') push({ ...c, h: Math.max(0, c.h - d) }); else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') push({ ...c, h: Math.min(360, c.h + d) }); else return;
    e.preventDefault();
  });
  hex.addEventListener('input', () => { const n = norm(hex.value); if (hex.value !== n) hex.value = n; const h = hexToHsv(n); if (h) { c = h; input.value = n; wrap.querySelector('.csw').style.background = n; input.dispatchEvent(new Event('input', { bubbles: true })); paint(true); } else hexSw.style.background = ''; });
  el.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-close')) close();
    if (b.hasAttribute('data-eye')) void new EyeDropper().open().then((r) => { const n = hexToHsv(String(r.sRGBHex)); if (n) push(n); }, () => undefined);
  });
  el.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); } });
  document.body.appendChild(el);
  const place = () => {
    const r = wrap.getBoundingClientRect(), p = el.firstElementChild, h = p.offsetHeight || 380, w = p.offsetWidth || 320, up = innerHeight - r.bottom < h + 16 && r.top > h;
    el.style.left = Math.max(8, Math.min(r.left, innerWidth - 8 - w)) + 'px'; el.style.top = (up ? Math.max(8, r.top - h - 8) : r.bottom + 8) + 'px';
  };
  const down = (e) => { if (!el.contains(e.target) && !sw.contains(e.target)) close(false); };
  const away = () => close(false);
  document.addEventListener('pointerdown', down, true); addEventListener('resize', away); addEventListener('scroll', place, true);
  pop = { sw, el, cleanup: () => { document.removeEventListener('pointerdown', down, true); removeEventListener('resize', away); removeEventListener('scroll', place, true); } };
  sw.setAttribute('aria-expanded', 'true'); paint(false); place(); sv.focus();
}

export function initColorFields() {
  document.addEventListener('input', (e) => {
    const i = e.target; if (!(i instanceof HTMLInputElement) || !i.parentElement || i.closest('.cpk')) return;
    const sw = i.parentElement.querySelector(':scope > .csw'); if (!sw) return;
    const n = norm(i.value); if (i.value !== n) i.value = n;
    sw.style.background = valid(n) ? n : '';
  }, true);
  document.addEventListener('click', (e) => { const sw = e.target instanceof Element ? e.target.closest('button.csw') : null; if (sw && !sw.disabled) open(sw); });
}
