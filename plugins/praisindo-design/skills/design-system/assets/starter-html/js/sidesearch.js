// The search of the sidebar (rules SQ-01 to SQ-04): a field under the logo that searches the PAGES of the menu (and the entries of the user menu) and opens the hits in a popover to the right of the sidebar
// (under the field when it is in the toolbar, PP-03). Up and Down choose, Enter opens, Escape closes, "/" puts the cursor in the field. The query is plain text, never a pattern.
// A product that has content to search (a Help Center) adds its own group in `extraGroups(q)` (see below).
//   sideSearch({ id, placement: 'side' | 'below' })  -> markup  ·  initSideSearch() once at boot (delegated)
import { NAV, PROFILE_NAV } from './nav.config.js';
import { t } from './shell.js';
import { esc, icon } from './ui.js';

/** The hook for more groups: return [{ key, title, hits: [{ id, icon, title, sub, href }] }]. Default: none. */
export const searchHooks = { extraGroups: (_q) => [] };

const mark = (text, q) => {
  const n = q.trim().toLowerCase(); if (!n) return esc(text);
  let out = '', i = 0;
  for (let j = text.toLowerCase().indexOf(n); j >= 0; j = text.toLowerCase().indexOf(n, i)) { out += esc(text.slice(i, j)) + '<mark>' + esc(text.slice(j, j + n.length)) + '</mark>'; i = j + n.length; }
  return out + esc(text.slice(i));
};
function pages() {
  const out = [], walk = (items, trail) => items.forEach((it) => { const label = t(it.labelKey); if (!it.kids?.length) out.push({ id: 'p:' + it.href, icon: it.icon || 'description', title: label, sub: trail.join(' › '), href: it.href }); if (it.kids) walk(it.kids, [...trail, label]); });
  NAV.forEach((g) => walk(g.items, g.labelKey ? [t(g.labelKey)] : []));
  PROFILE_NAV.forEach(([, ic, lk, href]) => out.push({ id: 'p:' + href, icon: ic, title: t(lk), sub: '', href }));
  return out;
}
function groups(q) {
  const n = q.trim().toLowerCase(); if (!n) return [];
  const hits = pages().filter((p) => (p.title + ' ' + p.sub).toLowerCase().includes(n));
  return [{ key: 'pages', title: t('sq.pages'), hits }, ...searchHooks.extraGroups(q)].filter((g) => g.hits.length);
}

export function sideSearch({ id = 'sq', placement = 'side' } = {}) {
  return `<div class="gs" data-gs="${placement}"><div class="fld"><div class="inp s-md">${icon('search')}<input id="${id}" type="text" autocomplete="off" placeholder="${esc(t('sq.ph'))}" aria-label="${esc(t('sq.label'))}" role="combobox" aria-expanded="false" aria-controls="${id}-list"><span class="gs-clr"></span></div></div></div>`;
}

let cur = 0, flat = [];
const closePop = () => { document.querySelectorAll('.gs-p, .gs-scrim').forEach((e) => e.remove()); document.querySelectorAll('.gs input').forEach((i) => i.setAttribute('aria-expanded', 'false')); };
function render(gs) {
  const input = gs.querySelector('input'), q = input.value, gr = groups(q);
  document.querySelectorAll('.gs-p, .gs-scrim').forEach((e) => e.remove());
  gs.querySelector('.gs-clr').innerHTML = q ? `<button type="button" class="btn b-transparent i-neutral s-sm io" data-gs-clear aria-label="${esc(t('tbl.clearSearch'))}" title="${esc(t('tbl.clearSearch'))}">${icon('close')}</button>` : '';
  if (!q.trim()) { input.setAttribute('aria-expanded', 'false'); return; }
  flat = gr.flatMap((g) => g.hits); cur = Math.min(cur, Math.max(0, flat.length - 1));
  const r = gs.getBoundingClientRect(), sb = gs.closest('.sb'), below = gs.dataset.gs === 'below';
  const left = below ? r.left : (sb ? sb.getBoundingClientRect().right : r.right) + 8, top = below ? r.bottom + 4 : Math.max(8, r.top - 4);
  let n = -1;
  const body = flat.length ? gr.map((g) => `<div role="group" aria-label="${esc(g.title)}"><p class="grpt gs-g">${esc(g.title)} · ${g.hits.length}</p>${g.hits.map((h) => { n += 1; return `<a href="${esc(h.href)}" role="option" aria-selected="${n === cur}" class="li gs-i${n === cur ? ' on' : ''}" data-i="${n}"><span class="hp-ic i-brand">${icon(h.icon)}</span><div class="m"><span class="t">${mark(h.title, q)}</span>${h.sub ? `<span class="mut">${mark(h.sub, q)}</span>` : ''}</div></a>`; }).join('')}</div>`).join('')
    : `<div class="state s-sm">${icon('search_off')}<h3>${esc(t('sq.noneT').replace('{q}', q.trim()))}</h3><p class="mut">${esc(t('sq.noneD'))}</p></div>`;
  const host = document.createElement('div');
  host.innerHTML = `<div class="upop-scrim gs-scrim" aria-hidden="true"></div><div class="pop upop gs-p" role="dialog" aria-label="${esc(t('sq.label'))}" style="left:${Math.round(left)}px;top:${Math.round(top)}px;max-height:calc(100vh - ${Math.round(top) + 16}px)"><div class="gs-l" id="${input.id}-list" role="listbox">${body}</div></div>`;
  document.body.append(...host.children); input.setAttribute('aria-expanded', 'true');
}
let ready = false;
export function initSideSearch() {
  if (ready) return; ready = true;
  document.addEventListener('input', (e) => { const gs = e.target.closest?.('.gs'); if (gs && e.target.matches('input')) { cur = 0; render(gs); } });
  document.addEventListener('focusin', (e) => { const gs = e.target.closest?.('.gs'); if (gs && e.target.matches('input') && e.target.value.trim()) render(gs); });
  document.addEventListener('click', (e) => {
    if (e.target.closest('.gs-scrim')) { closePop(); return; }
    const c = e.target.closest('[data-gs-clear]'); if (c) { const gs = c.closest('.gs'), i = gs.querySelector('input'); i.value = ''; render(gs); i.focus(); return; }
    if (e.target.closest('.gs-i')) { closePop(); document.querySelectorAll('.gs input').forEach((i) => { i.value = ''; }); document.querySelectorAll('.gs-clr').forEach((s) => { s.innerHTML = ''; }); }
  });
  document.addEventListener('mouseover', (e) => { const a = e.target.closest?.('.gs-i'); if (!a) return; document.querySelectorAll('.gs-i.on').forEach((x) => { x.classList.remove('on'); x.setAttribute('aria-selected', 'false'); }); a.classList.add('on'); a.setAttribute('aria-selected', 'true'); cur = Number(a.dataset.i); });
  document.addEventListener('keydown', (e) => {
    const typing = /^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable;
    if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) { const i = document.querySelector('.gs input'); if (i) { e.preventDefault(); i.focus(); } return; }
    const gs = e.target.closest?.('.gs'); if (!gs || !e.target.matches('input')) return;
    const open = !!document.querySelector('.gs-p');
    if (e.key === 'Escape') { if (open) { e.preventDefault(); closePop(); } else if (e.target.value) { e.target.value = ''; render(gs); } return; }
    if (!open || !flat.length) return;
    const move = (k) => { e.preventDefault(); cur = (cur + k + flat.length) % flat.length; render(gs); document.querySelector('.gs-i.on')?.scrollIntoView?.({ block: 'nearest' }); };
    if (e.key === 'ArrowDown') move(1); else if (e.key === 'ArrowUp') move(-1);
    else if (e.key === 'Enter') { e.preventDefault(); const h = flat[cur]; if (h) { closePop(); e.target.value = ''; render(gs); location.hash = h.href; e.target.blur(); } }
  });
}
