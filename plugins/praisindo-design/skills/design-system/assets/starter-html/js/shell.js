// The Praisindo shell (rules SB-01..SB-33): sidebar 232px / 68px rail, no desktop topbar (a topbar below 1100px), footer with language, theme and the user menu, edge toggle, bottom navigation on a phone.
// The same in every application: do NOT restyle it. Only js/nav.config.js (menu), the brand (Branding page) and the pages change.
import { NAV, PROFILE_NAV, ROUTE_META, UTIL, UTIL_RUN, navCount } from './nav.config.js';
import { translate, fill } from './i18n.js';
import { applyBrand } from './brand/brandStore.js';
import { prefs, setPref, resetPrefs, CARD_SLOTS, CARD_VIEWS, looksOf } from './prefs.js';
import { select } from './select.js';
import { session, signOut } from './session.js';
import { esc, icon, button, drawer, pageHead, card, menu, midText } from './ui.js';
import { sideSearch } from './sidesearch.js';

const S = { brand: null, page: { route: 'home' }, mnav: false, still: false, ov: null, onRoute: () => {} };
export const state = S;
export const lang = () => prefs(S.brand).lang;
export const t = (k) => translate(lang(), k);
const mq = (q) => matchMedia(q).matches;
const pageId = (p) => `${p.route}/${p.arg ?? ''}/${p.sub ?? ''}`;
export const parseHash = (h = location.hash) => { const [route = 'home', arg, sub] = h.replace(/^#\/?/, '').split('/').filter(Boolean); return { route: route || 'home', arg, sub }; };
const routeKey = (p) => (ROUTE_META[p.route] ? p.route : 'home');
const detail = (p) => ROUTE_META[routeKey(p)].layout === 'detail';
const collapsed = (p) => {
  const mode = prefs(S.brand).sidebar;
  if (detail(p)) return S.ov && S.ov.at === pageId(p) ? S.ov.coll : true;
  return mode === 'collapsed' ? true : mode === 'expanded' ? false : innerWidth < 1100;
};
const navHas = (it, cur) => it.k === cur || (it.kids || []).some((c) => navHas(c, cur));
const cnt = (k) => { const n = navCount(k); return n ? `<span class="chp chp-s on" aria-hidden="true" title="${n}">${n > 99 ? '99+' : n}</span><span class="sr-only">${n}</span>` : ''; };

function sideNav(cur) {
  const item = (it, L) => {
    const on = it.k === cur, has = !on && navHas(it, cur);
    const body = `${L === 1 ? icon(it.icon || 'circle') : ''}<span class="lbl">${midText(t(it.labelKey))}</span>${cnt(it.k)}`;
    if (it.kids && it.kids.length && L < 3) {
      return `<div class="nvp l${L}"><button type="button" class="nvi nvt l${L}${has ? ' has-on' : ''}" aria-expanded="${has}" title="${esc(t(it.labelKey))}" data-grp>${body}<span class="nvc">${icon('expand_more')}</span></button><div class="nvk" role="group" aria-label="${esc(t(it.labelKey))}"${has ? '' : ' hidden'}>${it.kids.map((c) => item(c, L + 1)).join('')}</div></div>`;
    }
    return `<a href="${esc(it.href || '#')}" class="nvi l${L}${on ? ' on' : ''}"${on ? ' aria-current="page"' : ''} title="${esc(t(it.labelKey))}">${body}</a>`;
  };
  return `<nav class="nav" aria-label="Main">${NAV.map((g) => `<div class="ng${g.labelKey ? '' : ' ng0'}"${g.labelKey ? ` role="group" aria-label="${esc(t(g.labelKey))}"` : ''}>${g.labelKey ? `<div class="ngt" aria-hidden="true">${esc(t(g.labelKey))}</div>` : ''}${g.items.map((it) => item(it, 1)).join('')}</div>`).join('')}</nav>`;
}
function mobileNav(cur) {
  const flat = NAV.flatMap((g) => g.items), top = flat.length > 5 ? flat.slice(0, 4) : flat, more = flat.length > 5 ? flat.slice(4) : [];
  return `${S.mnav ? '<div class="scrim mscrim" aria-hidden="true"></div>' : ''}<nav class="bn" aria-label="${esc(t('nav.mobile'))}">${top.map((it) => `<a href="${esc(it.href)}" class="${navHas(it, cur) ? 'on' : ''}"${navHas(it, cur) ? ' aria-current="page"' : ''}>${icon(it.icon || 'circle')}<span>${esc(t(it.labelKey))}</span>${cnt(it.k)}</a>`).join('')}<button type="button" data-more aria-expanded="${S.mnav}" class="${more.some((it) => navHas(it, cur)) ? 'on' : ''}">${icon(S.mnav ? 'close' : 'menu')}<span>${esc(t('nav.more'))}</span></button></nav>`;
}
const userBtn = (top) => { const ini = session.name.split(' ').map((w) => w[0]).join('').slice(0, 2); return `<div class="rel"><button class="user${top ? ' user-top' : ''}" type="button" aria-haspopup="menu" aria-expanded="false" aria-label="${esc(t('hdr.user'))}" title="${esc(session.name)}" data-user><span class="av">${esc(ini)}</span><span class="uname"><span class="fw6">${esc(session.name)}</span>${session.role ? `<span class="sub">${esc(session.role)}</span>` : ''}</span>${icon('chevron_right')}</button></div>`; };

/** (Re)draw the chrome. The page body is drawn by renderPage(); a language change redraws both. */
export function renderChrome() {
  const p = prefs(S.brand), pg = S.page, key = routeKey(pg), coll = collapsed(pg), dark = p.mode === 'dark', below = mq('(max-width: 1099px)');
  applyBrand(document, S.brand, p.mode, p.lang, p.fs);
  document.documentElement.dataset.sg = p.cards.statGroup; document.documentElement.dataset.kg = p.cards.kpiGroup;   // the cards of a row: each a card, or one card with dividers (PP-05)
  const sh = document.getElementById('shell');
  sh.className = `shell${coll ? ' coll' : ''}${S.still && coll ? ' nohov' : ''}${S.mnav ? ' mnav' : ''}`;
  const full = !!(dark ? S.brand.logoDark || S.brand.logoLight : S.brand.logoLight), url = dark ? S.brand.logoDark || S.brand.logoLight : S.brand.logoLight, ini = esc(S.brand.appName.charAt(0).toUpperCase());
  const mono = `<span class="mono" style="width:32px;height:32px">${ini}</span>`;
  // The items of the panel (rule PP-01): each one is in the sidebar or, on a desktop, in the toolbar at the top of the page (My Preferences); on a tablet or a phone they stay where they are (SB-33).
  const inTb = (k) => !below && p.items[k] === 'toolbar';
  const langNode = `<div class="lgt" role="group" aria-label="${esc(t('hdr.lang'))}">${[['en', 'EN', 'English'], ['id', 'ID', 'Bahasa Indonesia']].map(([v, a, l]) => `<button type="button" aria-pressed="${p.lang === v}" title="${l}" lang="${v}" data-lang="${v}">${a}</button>`).join('')}</div><button type="button" class="btn b-transparent i-neutral s-md io lgt1" aria-label="${esc(t('hdr.lang'))}" title="${esc(t('hdr.lang'))}" data-lang-flip><span class="lgt1t">${p.lang.toUpperCase()}</span></button>`;
  const themeNode = button({ icon: dark ? 'light_mode' : 'dark_mode', type: 'transparent', intent: 'neutral', aria: t('hdr.theme'), attrs: 'data-theme-btn' });
  // an action with a `count` (the bell) shows the number of items waiting: a chip over the button and the number for a screen reader (none at 0, 9+ above 9)
  const utilNode = (u) => {
    const b = button({ icon: u.icon, type: 'transparent', intent: 'neutral', aria: t(u.labelKey), attrs: `data-util="${u.k}" aria-haspopup="menu" aria-expanded="false"` }), n = u.count ? u.count() : 0;
    return u.count ? `<div class="nbell">${b}${n ? `<span class="chp chp-s on" aria-hidden="true">${n > 9 ? '9+' : n}</span><span class="sr-only">${n}</span>` : ''}</div>` : b;
  };
  // the action row of the sidebar shows three items at most (rule PP-02): the first three stay, the rest are in the "more" menu (icon and name rows); an item taken to the toolbar leaves the row
  const all = [{ k: 'lang', node: langNode, row: { label: t('hdr.lang'), ic: 'translate', run: () => { setPref('lang', lang() === 'en' ? 'id' : 'en'); S.onRoute(true); } } },
    { k: 'theme', node: themeNode, row: { label: t('hdr.theme'), ic: dark ? 'light_mode' : 'dark_mode', run: () => { setPref('mode', dark ? 'light' : 'dark'); renderChrome(); S.onRoute(false); } } },
    ...UTIL.map((u) => ({ k: u.k, node: utilNode(u), row: { label: t(u.labelKey), ic: u.icon, run: () => UTIL_RUN[u.k]?.(document.querySelector('[data-util-more]')) } }))].filter((i) => !inTb(i.k));
  S.moreRows = all.slice(3).map((i) => i.row);
  const vis = all.slice(0, 3), more = all.slice(3);
  sh.querySelector('.sb').innerHTML = `<button type="button" class="edge" aria-label="${esc(t('hdr.sidebar'))}" title="${esc(t('hdr.sidebar'))}" aria-expanded="${!coll}" data-edge>${icon(coll ? 'chevron_right' : 'chevron_left')}</button>
    <div class="brandrow${full ? ' full' : ''}"><span class="bm">${full && S.brand.favicon ? `<img class="logo mark" style="height:32px;width:32px" src="${esc(S.brand.favicon)}" alt="${esc(S.brand.appName)}">` : mono}</span><span class="bl">${url ? `<img class="logo full" style="height:32px" src="${esc(url)}" alt="${esc(S.brand.appName)}">` : mono}</span>${full ? '' : `<span class="nm">${esc(S.brand.appName)}</span>`}</div>
    ${inTb('search') ? '' : sideSearch()}
    ${sideNav(key)}
    <div class="foot"><div class="util${inTb('profile') ? ' nobd' : ''}">${vis.map((i) => i.node).join('')}<span class="grow"></span>${more.length ? `<span class="umore">${button({ icon: 'more_horiz', type: 'transparent', intent: 'neutral', aria: t('hdr.more'), attrs: 'data-util-more aria-haspopup="menu" aria-expanded="false"' })}</span>` : ''}</div>${inTb('profile') ? '' : userBtn(false)}</div>`;
  document.getElementById('mnav').innerHTML = mobileNav(key);
  const mn = sh.querySelector('.mn'); let tb = mn.querySelector('.topbar');
  if (below) {
    if (!tb) { tb = document.createElement('header'); tb.className = 'topbar'; mn.prepend(tb); }
    tb.innerHTML = `${button({ icon: 'menu', type: 'transparent', intent: 'neutral', size: 'lg', aria: t('hdr.sidebar'), attrs: `data-topmenu aria-pressed="${mq('(max-width: 640px)') ? S.mnav : !coll}"` })}<p class="topbar-t">${esc(t(ROUTE_META[key].titleKey))}</p><span class="grow"></span>${userBtn(true)}`;
  } else tb?.remove();
  // the toolbar (rule PP-03): the items put there by My Preferences, on a desktop only, at the top of the main column; it is not frozen
  let tool = mn.querySelector('.topbar.tool');
  const inBar = ['search', 'lang', 'theme', ...UTIL.map((u) => u.k), 'profile'].filter(inTb);
  if (inBar.length) {
    if (!tool) { tool = document.createElement('header'); tool.className = 'topbar tool'; mn.prepend(tool); }
    tool.setAttribute('aria-label', t('tb.label'));
    tool.innerHTML = `${inTb('search') ? `<div class="tool-s">${sideSearch({ id: 'sq-tool', placement: 'below' })}</div>` : ''}<span class="grow"></span>${inTb('lang') ? langNode : ''}${inTb('theme') ? themeNode : ''}${UTIL.filter((u) => inTb(u.k)).map(utilNode).join('')}${inTb('profile') ? userBtn(true) : ''}`;
  } else tool?.remove();
}

function userMenu(btn) {
  document.querySelector('.upop')?.remove(); document.querySelector('.upop-scrim')?.remove();
  if (btn.getAttribute('aria-expanded') === 'true') { btn.setAttribute('aria-expanded', 'false'); return; }
  const top = btn.classList.contains('user-top'), sb = btn.closest('.sb'), left = (sb ? sb.getBoundingClientRect().right : 0) + 8;
  const ini = session.name.split(' ').map((w) => w[0]).join('').slice(0, 2), it = 'btn b-transparent i-neutral s-md';
  const wrap = document.createElement('div');
  wrap.innerHTML = `<div class="upop-scrim" aria-hidden="true"></div><div class="pop upop${top ? ' upop-top' : ''}" role="menu" aria-label="${esc(t('hdr.user'))}"${top ? '' : ` style="left:${left}px"`}><div class="uhb"><span class="uh"><span class="av">${esc(ini)}</span><span class="uname"><span class="fw6">${esc(session.name)}</span><span class="sub">${esc(session.email)}</span></span></span></div><button type="button" class="${it}" role="menuitem" data-prefs>${icon('tune')}${esc(t('hdr.prefs'))}</button><a class="${it}" role="menuitem" href="#/mylog" data-testid="mylog">${icon('history')}${esc(t('nav.mylog'))}</a>${PROFILE_NAV.length ? '<hr>' : ''}${PROFILE_NAV.map(([k, ic, label, href]) => `<a class="${it}" role="menuitem" href="${href}" data-testid="user-${k}">${icon(ic)}${esc(t(label))}</a>`).join('')}${signOut ? `<hr><button type="button" class="${it} danger" role="menuitem" data-signout>${icon('logout')}${esc(t('hdr.logout'))}</button>` : ''}</div>`;
  btn.parentElement.append(...wrap.children); btn.setAttribute('aria-expanded', 'true');
  const pop = btn.parentElement.querySelector('.upop'), close = () => { pop.remove(); btn.parentElement.querySelector('.upop-scrim')?.remove(); btn.setAttribute('aria-expanded', 'false'); document.removeEventListener('keydown', key); };
  const key = (e) => { if (e.key === 'Escape') { close(); btn.focus(); } };
  document.addEventListener('keydown', key);
  btn.parentElement.querySelector('.upop-scrim').addEventListener('click', close);
  pop.querySelector('[data-prefs]').addEventListener('click', () => { close(); prefsDrawer(); });
  pop.querySelector('[data-signout]')?.addEventListener('click', () => { close(); signOut(); });
  pop.querySelector('[role=menuitem]')?.focus();
}
function prefsDrawer() {
  const p = prefs(S.brand);
  const seg = (id, label, val, items, full = true) => `<div class="fld">${label ? `<label>${esc(label)}</label>` : ''}<div class="sgc${full ? ' full' : ''}" id="${id}" role="radiogroup" aria-label="${esc(label)}" style="--seg-n:${items.length};--seg-to:${Math.max(0, items.findIndex(([v]) => v === val))}"><span class="sgc-th" aria-hidden="true"></span>${items.map(([v, l]) => `<button type="button" role="radio" aria-checked="${v === val}" class="sgc-o${v === val ? ' on' : ''}" data-v="${v}">${esc(l)}</button>`).join('')}</div></div>`;
  // My Preferences (rules PP-04, PP-01): an info note, Font size, Table size and, last, the link to the panel items. No Language (the switch is in the sidebar) and no Sidebar setting (the sidebar is automatic).
  const body = `<div class="al i-info" role="alert">${icon('info')}<span>${esc(t('prefs.noteG'))}</span></div>`
    + seg('pf-fs', t('prefs.fs'), p.fs, [['small', t('prefs.small')], ['regular', t('prefs.regular')], ['large', t('prefs.large')]])
    + seg('pf-table', t('prefs.table'), p.table, [['sm', t('size.sm')], ['md', t('size.md')], ['lg', t('size.lg')]])
    + `<div class="prefs-links"><a class="li prefs-link" href="#" role="button" data-panel><span class="hp-ic i-brand">${icon('dashboard_customize')}</span><div class="m"><span class="t">${esc(t('prefs.panel'))}</span><span class="mut">${esc(t('prefs.panelL'))}</span></div>${icon('chevron_right')}</a><a class="li prefs-link" href="#" role="button" data-view="stat"><span class="hp-ic i-brand">${icon('space_dashboard')}</span><div class="m"><span class="t">${esc(t('prefs.sv.t'))}</span><span class="mut">${esc(t('prefs.sv.l'))}</span></div>${icon('chevron_right')}</a><a class="li prefs-link" href="#" role="button" data-view="kpi"><span class="hp-ic i-brand">${icon('bar_chart')}</span><div class="m"><span class="t">${esc(t('prefs.kv.t'))}</span><span class="mut">${esc(t('prefs.kv.l'))}</span></div>${icon('chevron_right')}</a></div>`;
  const d = drawer({ title: t('prefs.title'), bodyHtml: body, closeLabel: t('lg.close'), footerHtml: button({ label: t('prefs.reset2'), type: 'transparent', intent: 'neutral', attrs: 'data-reset' }) + button({ label: t('prefs.done'), attrs: 'data-done' }) });
  d.el.querySelector('[data-done]').addEventListener('click', d.close);
  d.el.querySelector('[data-reset]').addEventListener('click', () => { resetPrefs(); S.onRoute(true); d.close(); prefsDrawer(); });
  d.el.querySelector('[data-panel]').addEventListener('click', (e) => { e.preventDefault(); d.close(); panelDrawer(); });
  for (const v of d.el.querySelectorAll('[data-view]')) v.addEventListener('click', (e) => { e.preventDefault(); d.close(); cardDrawer(v.dataset.view); });
  for (const [id, k] of [['pf-fs', 'fs'], ['pf-table', 'table']]) d.el.querySelector('#' + id).addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) { setPref(k, b.dataset.v); S.onRoute(true); d.close(); prefsDrawer(); } });
}
/** The third and the fourth drawer of My preferences: Stat view and KPI view (rule PP-05): the look of the cards in each place, the choice of one card or separate cards first. The options of a look are the registry
 *  `js/tokens/cardLooks.js`, so a look that is added there appears here by itself (WG-14). */
function cardDrawer(view) {
  const cur = prefs(S.brand).cards, en = lang() === 'en', k = view === 'stat' ? 'sv' : 'kv';
  const field = (slot) => select({ id: 'pf-cd-' + slot, label: t('prefs.cd.' + slot), hint: t('prefs.cd.h.' + slot), size: 'md', val: cur[slot],
    opts: slot.endsWith('Group') ? CARD_SLOTS[slot].map((v) => [v, t('prefs.cd.v.' + v)]) : looksOf(slot).map((l) => [l.id, en ? l.en : l.idn]) });
  const back = () => { d.close(); prefsDrawer(); };
  const d = drawer({ title: t(`prefs.${k}.t`), size: 'sm', layer: 'l2', back: t('hdr.back'), onBack: back, closeLabel: t('lg.close'), bodyHtml: `<p class="mut">${esc(t(`prefs.${k}.h`))}</p><div class="prefs-grp">${CARD_VIEWS[view].map(field).join('')}</div>`, footerHtml: button({ label: t('prefs.done'), attrs: 'data-done' }) });
  d.el.querySelector('[data-done]').addEventListener('click', back);
  d.el.addEventListener('change', (e) => { const n = e.target.closest?.('select.sl-n'); if (!n) return; const slot = n.id.replace('pf-cd-', ''); setPref('cards', { ...prefs(S.brand).cards, [slot]: n.value }); const p = prefs(S.brand); document.documentElement.dataset.sg = p.cards.statGroup; document.documentElement.dataset.kg = p.cards.kpiGroup; });
}
/** The second drawer of My Preferences (rule PP-01): where each item of the panel sits, the sidebar or the toolbar. Opened from the link of the first drawer, with Back (DR-03). */
function panelDrawer() {
  const items = ['search', 'lang', 'theme', ...UTIL.map((u) => u.k), 'profile'], cur = prefs(S.brand).items;
  const row = (k) => `<div class="rw" style="justify-content:space-between"><span>${esc(t('prefs.pi.' + k))}</span><div class="sgc" id="pf-pi-${k}" role="radiogroup" aria-label="${esc(t('prefs.pi.' + k))}" style="--seg-n:2;--seg-to:${cur[k] === 'toolbar' ? 1 : 0}"><span class="sgc-th" aria-hidden="true"></span>${[['sidebar', t('prefs.piSb')], ['toolbar', t('prefs.piTb')]].map(([v, l]) => `<button type="button" role="radio" aria-checked="${cur[k] === v}" class="sgc-o${cur[k] === v ? ' on' : ''}" data-k="${k}" data-v="${v}">${esc(l)}</button>`).join('')}</div></div>`;
  const back = () => { d.close(); prefsDrawer(); };
  const d = drawer({ title: t('prefs.panel'), size: 'sm', layer: 'l2', back: t('hdr.back'), onBack: back, closeLabel: t('lg.close'), bodyHtml: `<p class="mut">${esc(t('prefs.panelH'))}</p>${items.map(row).join('')}`, footerHtml: button({ label: t('prefs.done'), attrs: 'data-done' }) });
  d.el.querySelector('[data-done]').addEventListener('click', back);
  d.el.addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (!b) return; setPref('items', { ...prefs(S.brand).items, [b.dataset.k]: b.dataset.v }); S.onRoute(true); d.close(); panelDrawer(); });
}

/** Wire the chrome once (event delegation: the chrome is redrawn, the listeners are not). */
export function mountShell(root) {
  root.innerHTML = `<div class="shell" id="shell"><aside class="sb"></aside><div id="mnav"></div><div class="mn"><main class="ct" id="main"></main></div></div>`;
  const sh = document.getElementById('shell');
  const toggleSb = (pointer) => {
    const next = !collapsed(S.page);
    if (detail(S.page)) S.ov = { at: pageId(S.page), coll: next }; else setPref('sidebar', next ? 'collapsed' : 'expanded');
    S.still = next ? (pointer ? 'ptr' : 'kbd') : false; renderChrome();
  };
  sh.addEventListener('click', (e) => {
    const el = e.target;
    if (el.closest('[data-edge]')) { toggleSb(e.detail > 0); if (e.detail > 0) el.closest('[data-edge]').blur(); return; }
    const g = el.closest('[data-grp]'); if (g) { const ex = g.getAttribute('aria-expanded') !== 'true'; g.setAttribute('aria-expanded', String(ex)); g.nextElementSibling.hidden = !ex; return; }
    const l = el.closest('[data-lang]'); if (l) { setPref('lang', l.dataset.lang); S.onRoute(true); return; }
    if (el.closest('[data-lang-flip]')) { setPref('lang', lang() === 'en' ? 'id' : 'en'); S.onRoute(true); return; }
    if (el.closest('[data-theme-btn]')) { setPref('mode', prefs(S.brand).mode === 'dark' ? 'light' : 'dark'); renderChrome(); S.onRoute(false); return; }
    if (el.closest('[data-more]') || el.closest('.mscrim')) { S.mnav = !S.mnav; renderChrome(); return; }
    if (el.closest('[data-topmenu]')) { if (mq('(max-width: 640px)')) { S.mnav = !S.mnav; renderChrome(); } else toggleSb(false); return; }
    const u = el.closest('[data-user]'); if (u) { userMenu(u); return; }
    const ut = el.closest('[data-util]'); if (ut) { UTIL_RUN[ut.dataset.util]?.(ut); return; }
    const um = el.closest('[data-util-more]'); if (um) menu(um, S.moreRows, { side: 'right' });
  });
  sh.addEventListener('mouseleave', () => { if (S.still === 'ptr') { S.still = false; renderChrome(); } }, true);
  matchMedia('(max-width: 1099px)').addEventListener('change', renderChrome);
}
export const restricted = () => pageHead([['#/home', t('nav.home')], ['#/' + S.page.route, t(ROUTE_META[routeKey(S.page)].titleKey)]], t(ROUTE_META[routeKey(S.page)].titleKey), t('sub.restricted'))
  + card(t(ROUTE_META[routeKey(S.page)].titleKey), `<div class="state s-lg" role="alert">${icon('lock')}<h3>${esc(t('rs.t'))}</h3><p class="mut">${esc(fill(t('rs.d'), { r: session.role || t('ui.roleNow') }))}</p><a class="btn b-outlined i-neutral s-md" href="#/home">${icon('arrow_back')}${esc(t('rs.home'))}</a></div>`);
export { routeKey, pageId, ROUTE_META, session, fill };
