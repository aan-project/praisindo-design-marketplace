// DateField with its calendar popover (rule FP-02: no native date input anywhere). Markup and classes are the design system's (css/45-form-kit.css).
//   dateField({ id, label, mode: 'single' | 'range', from, to, req, err, ph, min, max, end, size })   -> markup
//   dateValue(root, id) -> { from, to }  (ISO days, '' when empty)   ·   setDate(root, id, from, to)
//   initDateFields()    -> once at boot (delegated); the field dispatches a bubbling `datechange` event when the value changes.
import { lang, t } from './shell.js';
import { esc, icon } from './ui.js';

const pad2 = (n) => String(n).padStart(2, '0');
const loc = () => (lang() === 'id' ? 'id-ID' : 'en-GB');
const fmt = (iso) => (iso ? new Date(iso + 'T00:00:00').toLocaleDateString(loc(), { day: '2-digit', month: 'short', year: 'numeric' }) : '');
const isoOf = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const text = (mode, from, to) => (mode === 'range' ? (from ? fmt(from) + ' – ' + (to ? fmt(to) : '…') : '') : fmt(from));

export function dateField({ id, label = '', mode = 'single', from = '', to = '', req = false, err = '', ph = '', min = '', max = '', end = false, size = 'md', aria = '' }) {
  const range = mode === 'range';
  return `<div class="fld fdt${end ? ' end' : ''}" id="f_${id}" data-mode="${mode}" data-from="${from}" data-to="${to}" data-min="${min}" data-max="${max}">${label ? `<label for="${id}">${esc(label)}${req ? `<span class="req" aria-hidden="true">*</span><span class="sr-only"> (${esc(t('ui.required'))})</span>` : ''}</label>` : ''}<div class="inp s-${size} dtf${err ? ' err' : ''}"><input id="${id}" type="text" readonly placeholder="${esc(ph || t(range ? 'ui.dp.range' : 'ui.dp.one'))}"${label ? '' : ` aria-label="${esc(aria)}"`} aria-haspopup="dialog" aria-expanded="false"${req ? ' aria-required="true"' : ''}${err ? ' aria-invalid="true"' : ''} aria-describedby="${id}-d" value="${esc(text(mode, from, to))}"><button type="button" class="ib" aria-label="${esc(t('ui.dp.open'))}">${icon(range ? 'date_range' : 'calendar_today')}</button></div><input class="dt-n" type="text" tabindex="-1" aria-hidden="true" name="${id}-iso" value="${from}"><span class="hlp" id="${id}-d"${err ? '' : ' hidden'}>${esc(err)}</span></div>`;
}
const wrap = (root, id) => root.querySelector('#f_' + id) || root.querySelector('#f_' + id.replace(/^in_/, ''));
export const dateValue = (root, id) => { const f = wrap(root, id); return { from: f?.dataset.from || '', to: f?.dataset.to || '' }; };
export function setDate(root, id, from = '', to = '') {
  const f = wrap(root, id); if (!f) return;
  f.dataset.from = from; f.dataset.to = to; f.querySelector('input.dt-n').value = from; f.querySelector('.dtf input').value = text(f.dataset.mode, from, to);
}

let pop = null;   // { field, el, cleanup }
function close(refocus = true) {
  if (!pop) return; const { field, el, cleanup } = pop; pop = null; cleanup(); el.remove();
  field.querySelector('.dtf input').setAttribute('aria-expanded', 'false'); field.classList.remove('open'); if (refocus) field.querySelector('.dtf input').focus();
}
const PRESETS = ['today', 'last7', 'last30', 'month'];
function preset(k) {
  const now = new Date(), a = new Date(now), z = new Date(now);
  if (k === 'last7') a.setDate(a.getDate() - 6); else if (k === 'last30') a.setDate(a.getDate() - 29); else if (k === 'month') a.setDate(1);
  return [isoOf(a), isoOf(z)];
}

function open(field) {
  close(false);
  const mode = field.dataset.mode, range = mode === 'range', min = field.dataset.min, max = field.dataset.max, input = field.querySelector('.dtf input');
  const st = { from: field.dataset.from, to: field.dataset.to, vm: (field.dataset.from || isoOf(new Date())).slice(0, 7) };
  const el = document.createElement('div'); el.className = 'fpop-fix';
  const draw = () => {
    const [y, m] = st.vm.split('-').map(Number), first = new Date(y, m - 1, 1), days = new Date(y, m, 0).getDate(), lead = (first.getDay() + 6) % 7, today = isoOf(new Date());
    const wd = Array.from({ length: 7 }, (_, i) => `<small>${new Date(2024, 0, 1 + i).toLocaleDateString(loc(), { weekday: 'narrow' })}</small>`).join('');
    const lo = range && st.from && st.to ? (st.from <= st.to ? st.from : st.to) : st.from, hi = range && st.from && st.to ? (st.from <= st.to ? st.to : st.from) : st.to;
    const cells = Array.from({ length: days }, (_, i) => {
      const iso = `${st.vm}-${pad2(i + 1)}`, sel = range ? iso === lo || iso === hi : iso === st.from, inr = range && lo && hi && iso > lo && iso < hi;
      const cls = `dpd${sel ? ' sel' : ''}${inr ? ' inr' : ''}${iso === today ? ' tdy' : ''}${range && iso === lo && hi ? ' rs' : ''}${range && iso === hi && lo ? ' re' : ''}`;
      return `<button type="button" class="${cls}" data-d="${iso}" aria-pressed="${sel}" aria-label="${esc(fmt(iso))}"${(min && iso < min) || (max && iso > max) ? ' disabled' : ''}>${i + 1}</button>`;
    }).join('');
    el.innerHTML = `<div class="fpop dp" role="dialog" aria-label="${esc(t(range ? 'ui.dp.range' : 'ui.dp.one'))}">${range ? `<div class="dpp">${PRESETS.map((k) => `<button type="button" class="chp" data-preset="${k}">${esc(t('ui.dp.' + k))}</button>`).join('')}</div>` : ''}<div class="dph"><button type="button" class="btn b-transparent i-neutral s-sm io" aria-label="${esc(t('ui.dp.prev'))}" data-nav="-1">${icon('chevron_left')}</button><span class="fw6">${esc(first.toLocaleDateString(loc(), { month: 'long', year: 'numeric' }))}</span><button type="button" class="btn b-transparent i-neutral s-sm io" aria-label="${esc(t('ui.dp.next'))}" data-nav="1">${icon('chevron_right')}</button></div><div class="dpg">${wd}${'<span></span>'.repeat(lead)}${cells}</div>${range ? `<p class="dps">${esc(st.from ? fmt(lo) + ' – ' + (hi ? fmt(hi) : t('ui.dp.end')) : t('ui.dp.start'))}</p><div class="dpf"><button type="button" class="btn b-transparent i-neutral s-sm" data-cancel>${esc(t('ui.cancel'))}</button><button type="button" class="btn b-fill i-brand s-sm" data-apply${st.from && st.to ? '' : ' disabled'}>${esc(t('ui.dp.apply'))}</button></div>` : ''}</div>`;
  };
  const place = () => {
    const r = input.closest('.dtf').getBoundingClientRect(), h = el.firstElementChild.offsetHeight || 320, up = innerHeight - r.bottom < h + 16 && r.top > h;
    const w = el.firstElementChild.offsetWidth || 280, left = field.classList.contains('end') ? r.right - w : r.left;
    el.style.left = Math.max(8, Math.min(left, innerWidth - 8 - w)) + 'px'; el.style.top = (up ? Math.max(8, r.top - h - 8) : r.bottom + 8) + 'px';
  };
  const commit = (from, to) => {
    field.dataset.from = from; field.dataset.to = to; field.querySelector('input.dt-n').value = from; input.value = text(mode, from, to);
    close(); field.dispatchEvent(new CustomEvent('datechange', { bubbles: true, detail: { from, to } }));
  };
  draw(); document.body.appendChild(el); place();
  el.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.nav) { const [y, m] = st.vm.split('-').map(Number), d = new Date(y, m - 1 + Number(b.dataset.nav), 1); st.vm = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`; draw(); place(); el.querySelector(`[data-nav="${b.dataset.nav}"]`)?.focus(); return; }
    if (b.dataset.preset) { [st.from, st.to] = preset(b.dataset.preset); st.vm = st.from.slice(0, 7); draw(); place(); return; }
    if (b.dataset.cancel !== undefined) { close(); return; }
    if (b.dataset.apply !== undefined) { const [a, z] = st.from <= st.to ? [st.from, st.to] : [st.to, st.from]; commit(a, z); return; }
    if (b.dataset.d) {
      if (!range) { commit(b.dataset.d, ''); return; }
      if (!st.from || st.to) { st.from = b.dataset.d; st.to = ''; } else st.to = b.dataset.d;
      draw(); place(); el.querySelector(`[data-d="${b.dataset.d}"]`)?.focus();
    }
  });
  el.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); } });
  const down = (e) => { if (!el.contains(e.target) && !field.contains(e.target)) close(false); };
  const away = () => close(false);
  document.addEventListener('pointerdown', down, true); addEventListener('resize', away); addEventListener('scroll', place, true);
  pop = { field, el, cleanup: () => { document.removeEventListener('pointerdown', down, true); removeEventListener('resize', away); removeEventListener('scroll', place, true); } };
  field.classList.add('open'); input.setAttribute('aria-expanded', 'true');
  (el.querySelector('.dpd.sel') ?? el.querySelector('.dpd.tdy') ?? el.querySelector('.dpd'))?.focus();
}

let ready = false;
export function initDateFields() {
  if (ready) return; ready = true;
  document.addEventListener('click', (e) => {
    const f = e.target.closest?.('.fdt'); if (!f || !e.target.closest('.dtf') || f.querySelector('input:disabled')) return;
    if (pop?.field === f) close(); else open(f);
  });
}
