// Select with a list of its own (rules SL-01 to SL-05, the same as the React `Select`). Markup and classes are the design system's (css/03-fields.css).
//   select({ id, label, opts: [[value, text]], val, size, aria, req, err, help, pre, suf })   (pre and suf: a short text inside the field before and after the value, `10 /page`, rule FM-16)   -> markup (a form field when `label` is given, the bare control otherwise)
//   initSelects()                                                                      -> call once at boot; it is delegated, so markup drawn later works too
//   syncSelects(root)                                                                  -> after a script sets `select.value`, show the new text in the field
// On a device with a mouse or a trackpad the field is a button (.sl-t) and a hidden native <select class="sl-n"> keeps the value for forms and scripts (`id` is on the native select).
// On a touch device the native select takes the tap, so the phone shows its own picker.
import { esc, icon } from './ui.js';

const FINE = '(hover: hover) and (pointer: fine)';
export const finePointer = () => typeof matchMedia === 'function' && matchMedia(FINE).matches;

/** Markup of a Select. `opts` is [[value, text], ...]. A `label` makes it a form field (label above, aria-required, aria-invalid); without it it is the bare control of a toolbar. */
const deco = (l, pre, suf) => [pre, l, suf].filter(Boolean).join(' ');   // the native select and the screen reader read an option with its pre and suf; the list under the field shows only the value (FM-16)
export function select({ id = '', label = '', opts = [], val, size = 'md', aria = '', req = false, err = '', help = '', hint = '', dis = false, search = '', none = '', pre = '', suf = '' }) {
  const cur = val === undefined ? (opts[0]?.[0] ?? '') : val, shown = opts.find(([v]) => String(v) === String(cur)) ?? opts[0] ?? ['', ''];
  const name = label || aria, d = id && (err || help) ? ` aria-describedby="${id}-d"` : '';
  const options = opts.map(([v, l]) => `<option value="${esc(v)}" data-l="${esc(l)}"${String(v) === String(cur) ? ' selected' : ''}>${esc(deco(l, pre, suf))}</option>`).join('');
  const native = `<select class="sl-n" tabindex="-1" aria-hidden="true"${id ? ` id="${esc(id)}"` : ''} aria-label="${esc(name)}"${dis ? ' disabled' : ''}>${options}</select>`;
  const ctl = `<span class="selw sl${err ? ' err' : ''}" data-search="${esc(search)}" data-none="${esc(none)}"><button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" class="sel s-${size} sl-t"${label ? '' : ` aria-label="${esc(aria)}"`}${dis ? ' disabled' : ''}${req ? ' aria-required="true"' : ''}${err ? ' aria-invalid="true"' : ''}${d}>${pre ? `<span class="pre" aria-hidden="true">${esc(pre)}</span>` : ''}<span class="sl-v">${esc(shown[1])}</span>${suf ? `<span class="suf" aria-hidden="true">${esc(suf)}</span>` : ''}</button>${icon('expand_more')}${native}</span>`;
  if (!label) return ctl;
  return `<div class="fld"><label${id ? ` for="${esc(id)}"` : ''}>${esc(label)}${req ? '<span class="req" aria-hidden="true">*</span>' : ''}</label>${ctl}${err ? `<span class="err" id="${id}-d" role="alert">${esc(err)}</span>` : help || hint ? `<span class="mut" id="${id}-d">${esc(help || hint)}</span>` : ''}</div>`;
}

/** The text of an option without the `pre` and `suf` of its field: the field shows them beside the value and the list under it shows only the value (rule FM-16). */
function optText(w, o) {
  if (!o) return '';
  if (o.dataset.l !== undefined) return o.dataset.l;
  const pre = w.querySelector('.pre')?.textContent ?? '', suf = w.querySelector('.suf')?.textContent ?? '';
  let tx = o.textContent ?? '';
  if (pre && tx.startsWith(pre + ' ')) tx = tx.slice(pre.length + 1);
  if (suf && tx.endsWith(' ' + suf)) tx = tx.slice(0, -(suf.length + 1));
  return tx;
}

/** Shows the value of the native select in its field (after a script changed it). */
export function syncSelects(root = document) {
  root.querySelectorAll('.selw.sl').forEach((w) => {
    const n = w.querySelector('.sl-n'), v = w.querySelector('.sl-v'); if (!n || !v) return;
    v.textContent = optText(w, n.selectedOptions[0]);
  });
}

let open = null;   // { wrap, trig, pop, cleanup }
const TXT = { en: { search: 'Search…', none: 'No results for “{q}”' }, id: { search: 'Cari…', none: 'Tidak ada hasil untuk “{q}”' } };
const txt = (w, k) => w.dataset[k] || TXT[document.documentElement.lang === 'id' ? 'id' : 'en'][k];

function closeList(refocus = true) {
  if (!open) return;
  const { wrap, trig, pop, cleanup } = open; open = null; cleanup(); pop.remove();
  wrap.classList.remove('open'); trig.setAttribute('aria-expanded', 'false'); if (refocus) trig.focus();
}

function pick(wrap, v) {
  const n = wrap.querySelector('.sl-n'); closeList();
  if (n.value !== v) { n.value = v; n.dispatchEvent(new Event('change', { bubbles: true })); }
  syncSelects(wrap.parentElement ?? wrap);
}

function openList(wrap) {
  const trig = wrap.querySelector('.sl-t'), n = wrap.querySelector('.sl-n'); if (!trig || trig.disabled) return;
  closeList(false);
  const opts = [...n.options].map((o) => [o.value, optText(wrap, o)]), cur = n.value, size = (trig.className.match(/\bs-(sm|md|lg)\b/) ?? [, 'md'])[1], searchable = opts.length > 5;
  const pop = document.createElement('div'); pop.className = `slp s-${size}`;
  pop.innerHTML = (searchable ? `<div class="slp-q"><div class="fld"><div class="inp s-sm">${icon('search')}<input type="text" autocomplete="off" placeholder="${esc(txt(wrap, 'search'))}" aria-label="${esc(txt(wrap, 'search'))}"></div></div></div>` : '') + '<div class="slp-l" role="listbox"></div>';
  const list = pop.querySelector('.slp-l'), qin = pop.querySelector('input');
  const draw = () => {
    const q = (qin?.value ?? '').trim().toLowerCase(), rows = searchable && q ? opts.filter(([, l]) => l.toLowerCase().includes(q)) : opts;
    list.innerHTML = rows.length ? rows.map(([v, l]) => `<button type="button" role="option" aria-selected="${v === cur}" data-v="${esc(v)}" class="slo"><span>${esc(l)}</span>${v === cur ? icon('check') : ''}</button>`).join('')
      : `<p class="slp-e mut">${esc(txt(wrap, 'none').replace('{q}', qin?.value.trim() ?? ''))}</p>`;
  };
  draw(); document.body.appendChild(pop);
  const place = () => {
    const r = trig.getBoundingClientRect(), vh = innerHeight, below = vh - r.bottom - 12, up = below < 200 && r.top > below, max = Math.max(160, Math.min(320, up ? r.top - 12 : below));
    pop.style.left = `${Math.max(8, Math.min(r.left, innerWidth - 8 - Math.max(r.width, 200)))}px`; pop.style.minWidth = `${Math.max(r.width, 160)}px`; pop.style.maxHeight = `${max}px`;
    if (up) { pop.style.top = ''; pop.style.bottom = `${vh - r.top + 4}px`; } else { pop.style.bottom = ''; pop.style.top = `${r.bottom + 4}px`; }
  };
  place();
  const down = (e) => { if (!pop.contains(e.target) && !wrap.contains(e.target)) closeList(false); };   // a press elsewhere closes it and the focus stays there
  const follow = (e) => { if (pop.contains(e.target)) return; const r = trig.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) closeList(false); else place(); };
  const away = () => closeList(false);
  document.addEventListener('pointerdown', down, true); addEventListener('scroll', follow, true); addEventListener('resize', away);
  open = { wrap, trig, pop, cleanup: () => { document.removeEventListener('pointerdown', down, true); removeEventListener('scroll', follow, true); removeEventListener('resize', away); } };
  wrap.classList.add('open'); trig.setAttribute('aria-expanded', 'true');
  (qin ?? list.querySelector('[aria-selected=true]') ?? list.querySelector('button'))?.focus();
  const btns = () => [...list.querySelectorAll('button')];
  pop.addEventListener('click', (e) => { const b = e.target.closest('.slo'); if (b) pick(wrap, b.dataset.v); });
  qin?.addEventListener('input', draw);
  pop.addEventListener('keydown', (e) => {
    const items = btns(), i = items.indexOf(document.activeElement), go = (k) => { e.preventDefault(); items[Math.max(0, Math.min(items.length - 1, k))]?.focus(); };
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeList(); }
    else if (e.target === qin) { if (e.key === 'ArrowDown') go(0); else if (e.key === 'Enter') { e.preventDefault(); const f = items[0]; if (f) pick(wrap, f.dataset.v); } }
    else if (e.key === 'ArrowDown') go(i + 1);
    else if (e.key === 'ArrowUp') { if (i <= 0 && qin) { e.preventDefault(); qin.focus(); } else go(i - 1); }
    else if (e.key === 'Home' && i >= 0) go(0); else if (e.key === 'End' && i >= 0) go(items.length - 1);
    else if (e.key === 'Tab') closeList();
    else if (e.key.length === 1 && !searchable && !e.ctrlKey && !e.metaKey) { const c = e.key.toLowerCase(), at = [...items.slice(i + 1), ...items.slice(0, i + 1)].find((b) => b.textContent.trim().toLowerCase().startsWith(c)); at?.focus(); }
  });
}

let ready = false;
export function initSelects() {
  if (ready) return; ready = true;
  document.addEventListener('click', (e) => {
    const t = e.target.closest?.('.sl-t'); if (!t || !finePointer()) return;
    const w = t.closest('.selw.sl'); if (open?.wrap === w) closeList(); else openList(w);
  });
  document.addEventListener('keydown', (e) => {
    const t = e.target.closest?.('.sl-t'); if (!t || !finePointer() || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
    e.preventDefault(); openList(t.closest('.selw.sl'));
  });
  // a touch device: the native select takes the tap (the phone's own picker) and the field shows its value afterwards
  const touch = () => { if (finePointer()) return; document.querySelectorAll('.sl-n').forEach((n) => { n.style.pointerEvents = 'auto'; n.removeAttribute('aria-hidden'); n.removeAttribute('tabindex'); }); };
  document.addEventListener('change', (e) => { if (e.target.classList?.contains('sl-n')) syncSelects(e.target.closest('.selw') ?? document); });
  new MutationObserver(touch).observe(document.body, { childList: true, subtree: true }); touch();
}
