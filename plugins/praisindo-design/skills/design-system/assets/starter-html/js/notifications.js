// The bell of the sidebar footer, its dropdown (the five newest unread, with the category tabs) and the drawer with every notification (rule GN-02, NT-01..NT-12). The notifications are derived on every call from the records
// the product holds (NT-03); the read state is kept per account in the browser (NT-04). Opening one marks it read and goes to what it is about. Registered in js/app.js (UTIL and UTIL_RUN).
import { NT_CATEGORIES, NT_KINDS } from './notifications.config.js';
import { readJSON, writeJSON } from './reactStorage.js';
import { session } from './session.js';
import { fill, lang, t } from './shell.js';
import { drawer, esc, icon } from './ui.js';

const READ_KEY = 'notifread', POP_MAX = 5, DOT = 'nti-' + 'dot';   // DOT: the class of the unread dot of the DS row (NT-02)
/** Replace with the product's data: the notifications this account receives, newest first: { id, kind, cat, args, age (days ago) }. */
export function ntBuild() {
  const raw = [{ id: 'pending:3', kind: 'pending', cat: 'work', args: { n: 3 }, age: 0 }, { id: 'new:5', kind: 'new', cat: 'work', args: { n: 5 }, age: 1 }, { id: 'synced', kind: 'synced', cat: 'data', args: {}, age: 2 }, { id: 'maintenance', kind: 'maintenance', cat: 'system', args: {}, age: 3 }];
  return raw.filter((n) => { const k = NT_KINDS.find((x) => x.kind === n.kind); return k && (k.audience === 'all' || session.admin); }).sort((a, b) => a.age - b.age);
}
const account = () => String(session.email || '').toLowerCase() || 'anonymous';
const readAll = () => { const v = readJSON(READ_KEY, {}); return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; };
const readIds = () => (Array.isArray(readAll()[account()]) ? readAll()[account()] : []);
const saveRead = (ids) => { const all = readAll(), keep = new Set(ntBuild().map((n) => n.id)); all[account()] = [...new Set(ids)].filter((i) => keep.has(i)).slice(-200); writeJSON(READ_KEY, all); };
/** The number on the bell (0 draws nothing). */
export const ntUnread = () => { const seen = new Set(readIds()); return ntBuild().filter((n) => !seen.has(n.id)).length; };

const rows = () => {
  const L = lang(), seen = new Set(readIds());
  return ntBuild().map((n) => {
    const k = NT_KINDS.find((x) => x.kind === n.kind), c = NT_CATEGORIES.find((x) => x.key === n.cat);
    return { id: n.id, icon: k.icon, intent: k.intent, title: k[L].title, desc: fill(k[L].summary, n.args), time: n.age === 0 ? t('nt.ago.0') : n.age === 1 ? t('nt.ago.1') : fill(t('nt.ago.n'), { n: n.age }), cat: n.cat, catLabel: c ? c[L] : n.cat, unread: !seen.has(n.id), to: k.to };
  });
};
const item = (r) => `<li class="nti-li"><button type="button" class="nti${r.unread ? ' unread' : ''}" data-testid="notif-${esc(r.id)}" data-nid="${esc(r.id)}" data-unread="${r.unread ? 1 : 0}" data-cat="${esc(r.cat)}"><span class="hp-ic i-${r.intent}" aria-hidden="true">${icon(r.icon)}</span><span class="m"><span class="fw6">${esc(r.title)}</span><span class="nti-d">${esc(r.desc)}</span><span class="nti-t">${esc(r.time)} · ${esc(r.catLabel)}</span></span>${r.unread ? `<span class="${DOT}" aria-hidden="true"></span><span class="sr-only">${esc(t('nt.unread'))}</span>` : ''}</button></li>`;
const list = (rs) => (rs.length ? `<ul class="ntl" data-testid="notif-list">${rs.map(item).join('')}</ul>` : `<div class="state s-sm">${icon('notifications_none')}<h3>${esc(t('nt.empty.t'))}</h3><p class="mut">${esc(t('nt.empty.d'))}</p></div>`);
const tabs = (cur, size) => `<div class="tabs" role="tablist">${[['all', t('nt.cat.all')], ...NT_CATEGORIES.map((c) => [c.key, c[lang()]])].map(([k, l]) => `<button role="tab" class="tab s-${size}" aria-selected="${k === cur}" data-nt-tab="${k}"><span>${esc(l)}</span></button>`).join('')}</div>`;
const markAll = () => saveRead([...readIds(), ...ntBuild().map((n) => n.id)]);
const open = (id) => { saveRead([...readIds(), id]); const n = ntBuild().find((x) => x.id === id), k = n && NT_KINDS.find((x) => x.kind === n.kind); return k ? k.to : null; };
const refreshBell = () => { const b = document.querySelector('[data-util="notif"]')?.closest('.nbell'); if (!b) return; b.querySelectorAll('.chp, .sr-only').forEach((e) => e.remove()); const n = ntUnread(); if (n) b.insertAdjacentHTML('beforeend', `<span class="chp chp-s on" aria-hidden="true">${n > 9 ? '9+' : n}</span><span class="sr-only">${n}</span>`); };

/** The handler of the bell (UTIL_RUN.notif): the dropdown under it; "View all notifications" opens the drawer. */
export function openNotifications(trigger) {
  document.querySelector('.npop')?.remove(); document.querySelector('.upop-scrim')?.remove();
  if (trigger.getAttribute('aria-expanded') === 'true') { trigger.setAttribute('aria-expanded', 'false'); return; }
  let tab = 'all';
  const sb = trigger.closest('.sb'), top = !sb, left = (sb ? sb.getBoundingClientRect().right : 0) + 8;
  const wrap = document.createElement('div');
  wrap.innerHTML = `<div class="upop-scrim" aria-hidden="true" data-testid="notif-scrim"></div><div class="pop upop npop${top ? ' upop-top' : ''}" role="dialog" aria-label="${esc(t('nt.t'))}" tabindex="-1" id="notifpop"${top ? '' : ` style="left:${left}px"`}></div>`;
  trigger.parentElement.append(...wrap.children); trigger.setAttribute('aria-expanded', 'true');
  const pop = trigger.parentElement.querySelector('.npop');
  const close = () => { pop.remove(); trigger.parentElement.querySelector('.upop-scrim')?.remove(); trigger.setAttribute('aria-expanded', 'false'); document.removeEventListener('keydown', key); refreshBell(); };
  const key = (e) => { if (e.key === 'Escape') { close(); trigger.focus(); } };
  const draw = () => {
    const inTab = rows().filter((r) => tab === 'all' || r.cat === tab), unread = inTab.filter((r) => r.unread);
    pop.innerHTML = `<div class="nph"><h2>${esc(t('nt.t'))}</h2>${unread.length ? `<button type="button" data-testid="notif-markall" class="btn b-link i-brand s-sm" data-nt-all aria-label="${esc(t('nt.markAll'))}">${esc(t('nt.markAll'))}</button>` : ''}</div>${tabs(tab, 'sm')}<div class="npl">${list((unread.length ? unread : inTab).slice(0, POP_MAX))}</div><div class="npf"><button type="button" class="btn b-transparent i-brand s-md" data-testid="notif-viewall" data-nt-viewall>${esc(t('nt.viewAll'))}${icon('arrow_forward')}</button></div>`;
  };
  draw(); document.addEventListener('keydown', key); pop.focus();
  trigger.parentElement.querySelector('.upop-scrim').addEventListener('click', close);
  pop.addEventListener('click', (e) => {
    const tb = e.target.closest('[data-nt-tab]'); if (tb) { tab = tb.dataset.ntTab; draw(); return; }
    if (e.target.closest('[data-nt-all]')) { markAll(); draw(); refreshBell(); return; }
    const row = e.target.closest('[data-nid]'); if (row) { const to = open(row.dataset.nid); close(); if (to) location.hash = to; return; }
    if (e.target.closest('[data-nt-viewall]')) { close(); viewAll(); }
  });
}
/** The drawer with every notification (the last three months, read and unread, newest first). */
function viewAll() {
  let tab = 'all';
  const d = drawer({ title: t('nt.t'), size: 'sm', closeLabel: t('lg.close'), bodyHtml: '<div id="ntall"></div>' });
  const draw = () => {
    const inTab = rows().filter((r) => tab === 'all' || r.cat === tab);
    d.el.querySelector('#ntall').innerHTML = `${tabs(tab, 'md')}${list(inTab)}${inTab.length ? `<p class="nti-w" data-testid="notif-window">${esc(t('nt.window'))}</p>` : ''}`;
  };
  draw();
  d.el.addEventListener('click', (e) => {
    const tb = e.target.closest('[data-nt-tab]'); if (tb) { tab = tb.dataset.ntTab; draw(); return; }
    const row = e.target.closest('[data-nid]'); if (row) { const to = open(row.dataset.nid); d.close(); refreshBell(); if (to) location.hash = to; }
  });
}
