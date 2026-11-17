// Personal preferences (language, theme, font size, table size, sidebar). Local to the browser, never changes the brand (rule BR-07). The ONLY module that touches Web Storage besides js/brand/brandStore.js.
import { session } from './session.js';
import { STAT_LOOKS, KPI_LOOKS } from './tokens/cardLooks.js';
const KEY = 'app.prefs';   // change to the application's namespace: the shared base
/** The storage key of the preferences of the person who is signed in (rule PP-07): one key for each person, so what one person sets is never seen by another on the same device. */
const mineKey = () => { const id = String(session?.email || session?.name || '').trim().toLowerCase(); return id ? KEY + '.u.' + id.replace(/[^a-z0-9]+/g, '_') : null; };
export const DEF = { mode: 'light', fs: 'regular', lang: 'en', sidebar: 'auto', table: 'md' };
/** The look of the number cards in each place (rule PP-05): a place (slot) and the looks it can have, the first one is the default. The looks come from the registry (WG-14). */
const STAT_IDS = STAT_LOOKS.map((l) => l.id), KPI_IDS = KPI_LOOKS.map((l) => l.id);
export const CARD_SLOTS = { statList: STAT_IDS, statDetail: STAT_IDS, statOther: STAT_IDS, kpiPage: KPI_IDS, kpiCard: KPI_IDS, statGroup: ['separate', 'one'], kpiGroup: ['separate', 'one'] };
/** The two drawers of the number cards, Stat view and KPI view: the fields of each, the choice of one card or separate cards first. */
export const CARD_VIEWS = { stat: ['statGroup', 'statList', 'statDetail', 'statOther'], kpi: ['kpiGroup', 'kpiPage', 'kpiCard'] };
export const looksOf = (slot) => (slot.startsWith('stat') ? STAT_LOOKS : KPI_LOOKS);
const resolveCards = (raw) => { const o = raw && typeof raw === 'object' ? raw : {}; return Object.fromEntries(Object.keys(CARD_SLOTS).map((k) => [k, CARD_SLOTS[k].includes(o[k]) ? o[k] : CARD_SLOTS[k][0]])); };
/** The items of the panel of the shell (rule PP-01): each one is in the sidebar (default) or, on a desktop, in the toolbar at the top of the page. An application adds its own (`notif`, `qa`) in js/nav.config.js (UTIL). */
export const PANEL_ITEMS = ['search', 'lang', 'theme', 'notif', 'qa', 'profile'];
const read = (key) => { try { const r = JSON.parse(localStorage.getItem(key) || '{}'); return r && typeof r === 'object' && !Array.isArray(r) ? r : {}; } catch { return {}; } };
/** The shared base under the personal choices of the person who is signed in. */
const all = () => ({ ...read(KEY), ...(mineKey() ? read(mineKey()) : {}) });
export const setPref = (k, v) => { const key = mineKey() || KEY; try { localStorage.setItem(key, JSON.stringify({ ...read(key), [k]: v })); } catch { /* ignore */ } };
/** Effective preferences: defaults < brand defaults < the user's own. `sidebar` stays 'auto' | 'expanded' | 'collapsed' (SB-28). */
export const prefs = (brand) => {
  const ovr = all();
  const p = { ...DEF, mode: brand.defaultMode, lang: brand.defaultLang, ...ovr }; if (p.mode === 'system') p.mode = brand.defaultMode;
  const it = ovr.items && typeof ovr.items === 'object' ? ovr.items : {};
  p.items = Object.fromEntries(PANEL_ITEMS.map((k) => [k, it[k] === 'toolbar' ? 'toolbar' : 'sidebar']));
  p.cards = resolveCards(ovr.cards);
  return p;
};
/** Reset to defaults (My Preferences): every personal override goes, the brand is untouched. */
export const resetPrefs = () => { try { localStorage.removeItem(mineKey() || KEY); } catch { /* ignore */ } };
