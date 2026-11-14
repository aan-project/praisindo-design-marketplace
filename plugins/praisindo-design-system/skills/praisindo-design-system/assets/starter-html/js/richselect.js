// RichSelect (css/65-rich-select.css): a select whose options may carry a soft name and a short description (the default font weight of Branding is "400 - Regular").
//   richSelect({ id, label, opts: [{ v, label, soft, desc }], val, size, hint, req, err, ph })   -> markup of the field
//   richValue(root, id)  ·  setRich(root, id, v)  ·  initRichSelects() once at boot (delegated); the field fires a bubbling `richchange` event ({ id, value }).
// Keys: Enter, Space or Down open it; Down, Up, Home and End move; Enter or Space chooses; Escape closes and gives the focus back.
import { t } from './shell.js';
import { tooltip } from './tooltip.js';
import { esc, icon } from './ui.js';

const nm = (o) => `<span class="rsnm">${esc(o.label)}${o.soft ? ` - <span class="rsns">${esc(o.soft)}</span>` : ''}</span>`;
export function richSelect({ id, label = '', opts = [], val = '', size = 'md', hint = '', req = false, err = '', ph = '', aria = '' }) {
  const cur = opts.find((o) => String(o.v) === String(val));
  return `<div class="fld frs" id="f_${id}" data-val="${esc(val)}" data-opts="${esc(JSON.stringify(opts))}">${label ? `<label id="${id}-l">${esc(label)}${req ? `<span class="req" aria-hidden="true">*</span><span class="sr-only"> (${esc(t('ui.required'))})</span>` : ''}${hint ? tooltip({ text: hint, label: hint }) : ''}</label>` : ''}<div class="inp rsf s-${size}${err ? ' err' : ''}" role="combobox" tabindex="0" id="${id}" ${label ? `aria-labelledby="${id}-l"` : `aria-label="${esc(aria)}"`} aria-haspopup="listbox" aria-expanded="false"><span class="rsv">${cur ? nm(cur) : `<span class="rsph">${esc(ph)}</span>`}</span>${icon('expand_more')}</div>${err ? `<span class="hlp" id="${id}-d">${esc(err)}</span>` : ''}</div>`;
}
const wrap = (root, id) => root.querySelector('#f_' + id);
export const richValue = (root, id) => wrap(root, id)?.dataset.val ?? '';
export function setRich(root, id, v) {
  const f = wrap(root, id); if (!f) return; const o = JSON.parse(f.dataset.opts).find((x) => String(x.v) === String(v)); f.dataset.val = o ? String(o.v) : '';
  f.querySelector('.rsv').innerHTML = o ? nm(o) : `<span class="rsph"></span>`;
}

let pop = null;   // { field, el, cleanup }
function close(refocus = true) {
  if (!pop) return; const { field, el, cleanup } = pop; pop = null; cleanup(); el.remove();
  const trig = field.querySelector('.rsf'); trig.setAttribute('aria-expanded', 'false'); field.classList.remove('open'); if (refocus) trig.focus();
}
function open(field) {
  close(false);
  const trig = field.querySelector('.rsf'), opts = JSON.parse(field.dataset.opts), cur = field.dataset.val, id = trig.id;
  const el = document.createElement('div'); el.className = 'fpop-fix';
  el.innerHTML = `<div class="fpop rsp"><ul class="rsl" role="listbox" ${field.querySelector('label') ? `aria-labelledby="${id}-l"` : `aria-label="${esc(trig.getAttribute('aria-label') || '')}"`}>${opts.map((o) => `<li><button type="button" role="option" aria-selected="${String(o.v) === cur}" data-v="${esc(o.v)}"${o.disabled ? ' disabled' : ''}><span class="rst">${nm(o)}${o.desc ? `<span class="rsd">${esc(o.desc)}</span>` : ''}</span>${String(o.v) === cur ? icon('check') : ''}</button></li>`).join('')}</ul></div>`;
  document.body.appendChild(el);
  const place = () => {
    const r = trig.getBoundingClientRect(), box = el.firstElementChild, h = box.offsetHeight, up = innerHeight - r.bottom < h + 16 && r.top > h;
    el.style.left = r.left + 'px'; el.style.width = r.width + 'px'; el.style.top = (up ? Math.max(8, r.top - h - 4) : r.bottom + 4) + 'px';
  };
  place();
  const choose = (v) => { setRich(document, id, v); close(); field.dispatchEvent(new CustomEvent('richchange', { bubbles: true, detail: { id, value: v } })); };
  el.addEventListener('click', (e) => { const b = e.target.closest('button[role=option]'); if (b) choose(b.dataset.v); });
  el.addEventListener('keydown', (e) => {
    const items = [...el.querySelectorAll('button:not(:disabled)')], i = items.indexOf(document.activeElement), go = (k) => { e.preventDefault(); items[Math.max(0, Math.min(items.length - 1, k))]?.focus(); };
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); } else if (e.key === 'ArrowDown') go(i + 1); else if (e.key === 'ArrowUp') go(i - 1); else if (e.key === 'Home') go(0); else if (e.key === 'End') go(items.length - 1); else if (e.key === 'Tab') close(false);
  });
  const down = (e) => { if (!el.contains(e.target) && !field.contains(e.target)) close(false); };
  const away = () => close(false);
  document.addEventListener('pointerdown', down, true); addEventListener('resize', away); addEventListener('scroll', place, true);
  pop = { field, el, cleanup: () => { document.removeEventListener('pointerdown', down, true); removeEventListener('resize', away); removeEventListener('scroll', place, true); } };
  field.classList.add('open'); trig.setAttribute('aria-expanded', 'true');
  (el.querySelector('[aria-selected=true]') ?? el.querySelector('button:not(:disabled)'))?.focus();
}

let ready = false;
export function initRichSelects() {
  if (ready) return; ready = true;
  document.addEventListener('click', (e) => { const f = e.target.closest?.('.frs'); if (!f || !e.target.closest('.rsf') || f.querySelector('.rsf[aria-disabled=true]')) return; if (pop?.field === f) close(); else open(f); });
  document.addEventListener('keydown', (e) => { const trig = e.target.closest?.('.rsf'); if (!trig || e.target !== trig || !['Enter', ' ', 'ArrowDown'].includes(e.key)) return; e.preventDefault(); open(trig.closest('.frs')); });
}
