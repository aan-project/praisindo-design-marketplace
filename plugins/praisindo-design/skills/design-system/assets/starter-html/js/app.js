// Boot: brand (cached first paint, then the adapter), shell, router. Pages are functions (main, ctx) -> void; register them in PAGES.
// To use a server for the branding: import { httpAdapter } from './brand/brandHttp.js'; import { setAdapter } from './brand/adapter.js'; setAdapter(httpAdapter('/api'));  (before boot())
// rule MO-03: motion stands still for reduced motion and for automated browsers (the CSS reads data-motion)
document.documentElement.dataset.motion = (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) || navigator.webdriver ? 'off' : 'on';
import { adapter } from './brand/adapter.js';
import { initDateFields } from './datefield.js';
import { initRichSelects } from './richselect.js';
import { initSelects } from './select.js';
import { initColorFields } from './colorfield.js';
import { initUploads } from './upload.js';
import { initSideSearch } from './sidesearch.js';
import { initTooltips } from './tooltip.js';
import './copybutton.js';   // CopyButton (CB-01): one click handler for every [data-copy] button
import { cachedBrand, normalizeBrand } from './brand/brandStore.js';
import { ROUTE_META, UTIL, UTIL_RUN } from './nav.config.js';
import { renderBranding } from './pages/branding.js';
import { renderDesign } from './pages/design.js';
import { renderExDetail, renderExDialogs, renderExForm, renderExList } from './pages/examples.js';
import { renderHome } from './pages/home.js';
import { renderMyLog } from './pages/mylog.js';
import { ntUnread, openNotifications } from './notifications.js';
import { initProfileCards } from './profile.js';
import { closeOverlays } from './ui.js';
import { mountShell, parseHash, pageId, renderChrome, restricted, routeKey, session, state } from './shell.js';

/** route key -> render(main, ctx). A new page: add its entry in nav.config.js (ROUTE_META and NAV) and here. */
const PAGES = {
  home: renderHome,
  branding: (main) => renderBranding(main, { onSaved: (b) => { state.brand = b; renderChrome(); } }),
  design: renderDesign,
  mylog: renderMyLog,   // Activity history (rule GN-01)
  'ex-list': renderExList, 'ex-form': renderExForm, 'ex-detail': renderExDetail, 'ex-dialogs': renderExDialogs,   // pattern examples (reference)
};

// The bell (rule GN-02): the number on it and what it opens; notifications.config.js defines what it shows.
UTIL.push({ k: 'notif', icon: 'notifications', labelKey: 'nt.bell', count: ntUnread });
UTIL_RUN.notif = openNotifications;

let lastId = '';
function renderPage() {
  const main = document.getElementById('main'), key = routeKey(state.page);
  if (pageId(state.page) !== lastId) { state.ov = null; state.still = false; state.mnav = false; lastId = pageId(state.page); }
  if (ROUTE_META[key].admin && !session.admin) { main.innerHTML = restricted(); return; }
  PAGES[key](main);
}
/** Redraw: the chrome always, the page when the language changed or the route did. */
function update(withPage = true) { renderChrome(); if (withPage) renderPage(); }

export function boot() {
  initSelects(); initUploads(); initColorFields(); initRichSelects(); initDateFields(); initTooltips(); initSideSearch(); initProfileCards();   // the Select list (SL-01 to SL-05), the calendar of the date field (FP-02) and the tooltip work for markup drawn by a page, now or later
  state.brand = cachedBrand();
  mountShell(document.getElementById('app'));
  state.onRoute = update;
  addEventListener('hashchange', () => { closeOverlays(); state.page = parseHash(); update(); window.scrollTo(0, 0); });
  state.page = parseHash();
  update();
  adapter().getBrand().then((b) => { state.brand = normalizeBrand(b); renderChrome(); }).catch(() => { /* keep the cached brand */ });
}
// FM-21: a single choice is a row of chips (role radio); a press selects it, the check icon moves to it.
document.addEventListener('click', (e) => {
  const c = e.target instanceof Element ? e.target.closest('fieldset.rg [role="radio"]') : null;
  if (!c || c.disabled) return;
  c.closest('fieldset.rg').querySelectorAll('[role="radio"]').forEach((o) => { const on = o === c; o.classList.toggle('on', on); o.setAttribute('aria-checked', String(on)); o.querySelector('.ic')?.remove(); if (on) o.insertAdjacentHTML('afterbegin', '<span aria-hidden="true" class="material-icons-outlined ic">check</span>'); });
});
boot();
