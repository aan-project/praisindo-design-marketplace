// Activity history (rule GN-01): what the SIGNED-IN user did in the application, newest first, grouped by day. A List pattern page: a category filter and a search field appear when there are more than ten events (TB-17).
// The empty state says that nothing was done yet; it is not an Alert (CD-08).
import { ACTIVITY_CATEGORIES, activityCategory } from '../activity.config.js';
import { myEvents } from '../activityLog.js';
import { select } from '../select.js';
import { lang, t } from '../shell.js';
import { card, emptyState, esc, icon, pageHead } from '../ui.js';

const MANY = 10;
const day = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString(lang() === 'id' ? 'id-ID' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
/** The History list item of the design system: time, the icon tile of the category, the action and its target, the note and the category (static rows: a name in a row can be a profile-card trigger, GN-04). */
export function logList(events) {
  let d = '';
  return `<div class="tl alog" data-testid="activity-list">${events.map((e) => {
    const dd = e.ts.slice(0, 10), head = dd !== d ? ((d = dd), `<div class="alog-d"><h3 class="grpt">${esc(day(dd))}</h3></div>`) : '', c = activityCategory(e.category), target = [e.targetType, e.targetId].filter(Boolean).join(' · ');
    return `${head}<div class="ti alog-i alog-st"><span class="alog-tm">${esc(e.ts.slice(11, 16))}</span><span class="hp-ic i-${c ? c.intent : 'neutral'}" aria-hidden="true">${icon(c ? c.icon : 'history')}</span><span class="tc"><span class="alog-t">${esc(e.action)}</span>${target ? `<span class="mut">${esc(target)}</span>` : ''}<span class="alog-m"><span>${esc(c ? c[lang()] : e.category)}</span>${e.note ? `<span>${esc(e.note)}</span>` : ''}</span></span></div>`;
  }).join('')}</div>`;
}
export function renderMyLog(main) {
  const all = myEvents(), many = all.length > MANY, st = { cat: '', q: '' };
  const draw = () => {
    const q = st.q.trim().toLowerCase(), ev = all.filter((e) => (!st.cat || e.category === st.cat) && (!q || [e.action, e.targetType, e.targetId, e.note].join(' ').toLowerCase().includes(q)));
    main.querySelector('#mylog-list').innerHTML = ev.length ? logList(ev) : emptyState(t('mylog.noResT'), t('mylog.noResD'), 'search_off');
  };
  const tools = many ? `<div class="tb"><div class="inp s-md">${icon('search')}<input id="mylogq" type="search" placeholder="${esc(t('mylog.all'))}" aria-label="${esc(t('mylog.all'))}"></div>${select({ id: 'mylogc', opts: [['', t('mylog.allCats')], ...ACTIVITY_CATEGORIES.map((c) => [c.key, c[lang()]])], val: '', aria: t('mylog.cat') })}</div>` : '';
  main.innerHTML = pageHead([['#/home', t('nav.home')], ['#/mylog', t('nav.mylog')]], t('nav.mylog'), t('sub.mylog'))
    + card(t('mylog.card'), `${tools}<div id="mylog-list">${all.length ? logList(all) : emptyState(t('mylog.noneT'), t('mylog.noneD'), 'history')}</div>`);
  main.querySelector('#mylogq')?.addEventListener('input', (e) => { st.q = e.target.value; draw(); });
  main.querySelector('#mylogc')?.addEventListener('change', (e) => { st.cat = e.target.value; draw(); });
}
