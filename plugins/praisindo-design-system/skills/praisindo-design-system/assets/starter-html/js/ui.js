// Small helpers that produce the design-system markup (same classes as the React components). Escape every dynamic string with esc().
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/** A text on one line: when it does not fit it is cut in the middle with an ellipsis and its last word stays visible (rules TB-20, SB-34; the markup `.mid`, `.mid-s`, `.mid-e` of the table kit). Returns markup; the text is escaped. */
export const midText = (s) => { const i = String(s).lastIndexOf(' '); return i < 1 ? `<span class="mid"><span class="mid-s">${esc(s)}</span></span>` : `<span class="mid"><span class="mid-s">${esc(String(s).slice(0, i))}</span><span class="mid-e">${esc(String(s).slice(i))}</span></span>`; };
export const icon = (name) => `<span class="material-icons-outlined ic" aria-hidden="true">${esc(name)}</span>`;
/** Button. type: fill | soft | outlined | transparent | link; intent: brand | neutral | danger ...; size: sm | md | lg. Icon-only when no label (then `aria` is the name). */
export function button({ label = '', icon: ic = '', type = 'fill', intent = 'brand', size = 'md', aria = '', id = '', attrs = '' }) {
  return `<button type="button"${id ? ` id="${id}"` : ''} class="btn b-${type} i-${intent} s-${size}${label ? '' : ' io'}" aria-label="${esc(aria || label)}" ${attrs}>${ic ? icon(ic) : ''}${esc(label)}</button>`;
}
/** Detail list (DS 2.88, rules DL-01..DL-03): one label / value pair in the layout `grid` (label above the value, for a wide card or panel) or `rows` (label left, value right, a line under each row, for a narrow one). `value` is markup: escape what is dynamic. */
export const detailItem = (label, value, layout = 'grid') => (layout === 'rows'
  ? `<div class="dl-row"><span class="mut">${esc(label)}</span><div>${value}</div></div>`
  : `<div class="dl-item"><span>${esc(label)}</span><span class="fw6">${value}</span></div>`);
/** items = [[label, valueHtml], ...]; layout 'grid' | 'rows', or 'auto' (the list follows its own width: rows below 480px, grid from 480px; call watchDetailLists(root) after it is in the page). */
export const detailList = (items, layout = 'grid') => { const L = layout === 'rows' ? 'rows' : 'grid'; return `<div class="dl-${L}"${layout === 'auto' ? ' data-dl-auto' : ''}>${items.map(([l, v]) => detailItem(l, v, L)).join('')}</div>`; };
/** Makes every `[data-dl-auto]` list inside `root` choose its layout by its own width (rule DL-02, break 480px). */
export function watchDetailLists(root = document) {
  root.querySelectorAll('[data-dl-auto]').forEach((el) => {
    const pairs = [...el.children].map((c) => (c.classList.contains('dl-row') ? [c.querySelector(':scope>.mut').textContent, c.querySelector(':scope>div').innerHTML] : [c.children[0].textContent, c.children[1].innerHTML]));
    const apply = (w) => { const L = w < 480 ? 'rows' : 'grid'; if (el.classList.contains('dl-' + L)) return; el.className = 'dl-' + L; el.innerHTML = pairs.map(([l, v]) => detailItem(l, v, L)).join(''); };
    new ResizeObserver((e) => apply(Math.round(e[0].contentRect.width))).observe(el);
  });
}
/** Page head: breadcrumb, title, one-line description (rule: every page has all three). crumbs = [[href, text], ...], the last one is the current page. */
export function pageHead(crumbs, title, sub) {
  const c = crumbs.map(([h, x], i) => (i === crumbs.length - 1 ? `<span aria-current="page">${esc(x)}</span>` : `<a href="${h}">${esc(x)}</a>${icon('chevron_right')}`)).join('');
  return `<div class="ph"><div><nav class="crumb" aria-label="Breadcrumb">${c}</nav><div class="ttl"><h1>${esc(title)}</h1></div><p class="mut">${esc(sub)}</p></div></div>`;
}
export const card = (title, body, footer = '') => `<section class="card"><div class="ch"><h2>${esc(title)}</h2></div><div class="cb">${body}</div>${footer ? `<div class="cf">${footer}</div>` : ''}</section>`;
export const emptyState = (title, desc, ic = 'inbox') => `<div class="state s-md">${icon(ic)}<h3>${esc(title)}</h3><p class="mut">${esc(desc)}</p></div>`;
let timer;
export function toast(msg, intent = 'success') {
  document.querySelector('.toast')?.remove(); clearTimeout(timer);
  const d = document.createElement('div'); d.className = `toast t-${intent}`; d.setAttribute('role', intent === 'danger' ? 'alert' : 'status'); d.textContent = msg; document.body.appendChild(d);
  timer = setTimeout(() => d.remove(), 2400);
}
/** Drawer (right side). Returns { el, close }. footerHtml/bodyHtml are trusted markup. Escape and the scrim close it; focus returns to the opener. */
const live = new Set();
/** Closes every drawer and dialog that is open (a page change does not leave them behind). */
export const closeOverlays = () => [...live].forEach((c) => c());
/** Drawer (right side). `back` (a label) adds the Back button of the header (rule DR-03) and `onBack` runs on it; `layer` (for example 'l2') stacks a second drawer over the first. */
export function drawer({ title, size = 'sm', bodyHtml, footerHtml = '', closeLabel = 'Close', onClose, back = '', onBack, layer = '' }) {
  const opener = document.activeElement, host = document.createElement('div');
  host.innerHTML = `<div class="scrim ${layer}"></div><aside class="drawer ${layer} dw-${size}" role="dialog" aria-modal="true" aria-label="${esc(title)}" tabindex="-1"><div class="dh">${back ? button({ icon: 'arrow_back', type: 'transparent', intent: 'neutral', aria: back, attrs: 'data-back' }) : ''}<h2>${esc(title)}</h2>${button({ icon: 'close', type: 'transparent', intent: 'neutral', aria: closeLabel, attrs: 'data-close' })}</div><div class="db">${bodyHtml}</div>${footerHtml ? `<div class="df">${footerHtml}</div>` : ''}</aside>`;
  document.body.appendChild(host);
  const close = () => { live.delete(close); document.removeEventListener('keydown', key); host.remove(); opener?.focus?.(); onClose?.(); };
  const key = (e) => { if (e.key === 'Escape') close(); };
  live.add(close); document.addEventListener('keydown', key);
  host.querySelector('.scrim').addEventListener('click', close); host.querySelector('[data-close]').addEventListener('click', close);
  host.querySelector('[data-back]')?.addEventListener('click', () => onBack?.());
  host.querySelector('.drawer').focus();
  return { el: host, close };
}
const DLG_ICON = { info: 'info', success: 'check_circle', warning: 'warning_amber', danger: 'error_outline', confirm: 'help_outline' };
/** Dialog (centred, one short decision). kind: info | success | warning | danger | confirm. `bodyHtml` is trusted markup. Returns { el, close }.
 *  ok = { label, intent, id }, cancel = { label } (omit for a message with one button). Escape and the scrim close it unless `persist`; focus returns to the opener. */
export function dialog({ kind = 'confirm', title, bodyHtml = '', ok, cancel, onOk, onClose, persist = false }) {
  const opener = document.activeElement, host = document.createElement('div'), id = 'dlg' + Math.random().toString(36).slice(2, 7);
  const okIntent = ok?.intent || (kind === 'confirm' || kind === 'info' ? 'brand' : kind);
  host.innerHTML = `<div class="scrim mdl-s"></div><section class="mdl i-${kind} fx" role="alertdialog" aria-modal="true" aria-labelledby="${id}-t" aria-describedby="${id}-d" tabindex="-1"><span class="mdl-g" aria-hidden="true"></span><span class="mdl-ic">${icon(DLG_ICON[kind])}</span><h2 id="${id}-t">${esc(title)}</h2><div class="mdl-b" id="${id}-d">${bodyHtml}</div><div class="mdl-f">${cancel ? button({ label: cancel.label, type: 'soft', intent: 'neutral', attrs: 'data-dlg-cancel' }) : ''}${ok ? button({ label: ok.label, intent: okIntent, id: ok.id || '', attrs: 'data-dlg-ok' }) : ''}</div></section>`;
  document.body.appendChild(host);
  const close = () => { live.delete(close); document.removeEventListener('keydown', key); host.remove(); opener?.focus?.(); onClose?.(); };
  const key = (e) => { if (e.key === 'Escape' && !persist) { e.stopPropagation(); close(); } };
  live.add(close); document.addEventListener('keydown', key);
  host.querySelector('[data-dlg-cancel]')?.addEventListener('click', close);
  host.querySelector('[data-dlg-ok]')?.addEventListener('click', () => { if (onOk?.(close) !== false) close(); });
  if (!persist) host.querySelector('.scrim').addEventListener('click', close);
  (host.querySelector('[data-dlg-ok]') || host.querySelector('.mdl')).focus();
  return { el: host, close };
}

let openPop = null;
/** A floating layer (`.pop`) next to its trigger, drawn in the body so no card clips it. side: 'below' (right edge under the trigger, above it when there is no room) or 'right' (to the right of the trigger, as the user menu).
 *  Escape and a press outside close it and give the focus back. Returns { el, close }. */
export function popover(trigger, html, { side = 'below', label = '' } = {}) {
  openPop?.close(false);
  const el = document.createElement('div'); el.className = 'pop'; el.setAttribute('role', 'menu'); if (label) el.setAttribute('aria-label', label); el.innerHTML = html; document.body.appendChild(el);
  const place = () => {
    const r = trigger.getBoundingClientRect(), h = el.offsetHeight; el.style.position = 'fixed';
    if (side === 'right') { el.style.left = r.right + 8 + 'px'; el.style.right = ''; el.style.top = Math.max(8, Math.min(r.top, innerHeight - h - 8)) + 'px'; }
    else { el.style.left = ''; el.style.right = Math.max(8, innerWidth - r.right) + 'px'; el.style.top = (r.bottom + 4 + h > innerHeight ? Math.max(8, r.top - h - 4) : r.bottom + 4) + 'px'; }
  };
  place(); trigger.setAttribute('aria-expanded', 'true');
  const close = (refocus = true) => { document.removeEventListener('pointerdown', down, true); document.removeEventListener('keydown', key); removeEventListener('scroll', away, true); removeEventListener('resize', away); el.remove(); trigger.setAttribute('aria-expanded', 'false'); if (refocus) trigger.focus(); if (openPop?.el === el) openPop = null; };
  const down = (e) => { if (!el.contains(e.target) && !trigger.contains(e.target)) close(false); };
  const away = (e) => { if (!el.contains(e.target)) close(false); };
  const key = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    const b = [...el.querySelectorAll('button:not([disabled])')], i = b.indexOf(document.activeElement);
    if (b.length && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) { e.preventDefault(); b[e.key === 'Home' ? 0 : e.key === 'End' ? b.length - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + b.length) % b.length]?.focus(); }
  };
  document.addEventListener('pointerdown', down, true); document.addEventListener('keydown', key); addEventListener('scroll', away, true); addEventListener('resize', away);
  openPop = { el, close }; return openPop;
}
/** An action menu (the three dots menu, rule MN-01): items = [{ label, ic, intent, run }] or 'divider'. */
export function menu(trigger, items, opts) {
  const p = popover(trigger, items.map((it, i) => (it === 'divider' ? '<hr>' : `<button type="button" class="btn b-transparent i-${it.intent || 'neutral'} s-md" role="menuitem" aria-label="${esc(it.label)}" data-i="${i}">${it.ic ? icon(it.ic) : ''}${esc(it.label)}</button>`)).join(''), opts);
  p.el.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; const it = items[Number(b.dataset.i)]; p.close(false); it.run?.(); });
  p.el.querySelector('button')?.focus();
  return p;
}
