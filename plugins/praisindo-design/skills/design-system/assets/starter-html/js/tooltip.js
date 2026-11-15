// Tooltip (css/55-tooltip.css): the bubble opens on hover and on focus, closes on leave, blur and Escape, and is placed next to its trigger (fixed, so no card clips it).
//   tooltip({ id, text, placement: 'top' | 'right', trigger })   -> markup of `.tt-wrap` (the trigger is a given button markup or the info icon)  ·  initTooltips() once at boot.
import { esc, icon } from './ui.js';

let n = 0;
export function tooltip({ text, placement = 'top', trigger = '', label = 'More information' }) {
  const id = 'tt' + ++n;
  return `<span class="tt-wrap">${trigger ? trigger.replace('<button ', `<button aria-describedby="${id}" `) : `<button type="button" class="tt-trigger" aria-label="${esc(label)}" aria-describedby="${id}">${icon('info')}</button>`}<div id="${id}" role="tooltip" class="tt tt-text tt-${placement}"><div class="tt-d">${esc(text)}</div></div></span>`;
}
const place = (wrap) => {
  const b = wrap.querySelector('.tt'), r = wrap.getBoundingClientRect(), w = b.offsetWidth, h = b.offsetHeight, pl = b.classList.contains('tt-right') ? 'right' : 'top';
  if (pl === 'right') { b.style.left = r.right + 8 + 'px'; b.style.top = Math.max(8, r.top + r.height / 2 - h / 2) + 'px'; b.style.setProperty('--tt-arrow', h / 2 + 'px'); }
  else { const left = Math.max(8, Math.min(r.left + r.width / 2 - w / 2, innerWidth - 8 - w)); b.style.left = left + 'px'; b.style.top = Math.max(8, r.top - h - 8) + 'px'; b.style.setProperty('--tt-arrow', r.left + r.width / 2 - left + 'px'); }
};
const show = (wrap) => { const b = wrap.querySelector('.tt'); if (!b) return; place(wrap); b.setAttribute('data-open', ''); };
const hide = (wrap) => wrap.querySelector('.tt')?.removeAttribute('data-open');
let ready = false;
export function initTooltips() {
  if (ready) return; ready = true;
  const on = (e) => { const w = e.target.closest?.('.tt-wrap'); if (w) show(w); }, off = (e) => { const w = e.target.closest?.('.tt-wrap'); if (w) hide(w); };
  document.addEventListener('mouseover', on); document.addEventListener('mouseout', off); document.addEventListener('focusin', on); document.addEventListener('focusout', off);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.querySelectorAll('.tt[data-open]').forEach((b) => b.removeAttribute('data-open')); });
  addEventListener('scroll', () => document.querySelectorAll('.tt[data-open]').forEach((b) => hide(b.parentElement)), true);
}
