// Personal preferences (language, theme, font size, table size, sidebar). Local to the browser, never changes the brand (rule BR-07). The ONLY module that touches Web Storage besides js/brand/brandStore.js.
const KEY = 'app.prefs';   // change to the application's namespace
export const DEF = { mode: 'light', fs: 'regular', lang: 'en', sidebar: 'auto', table: 'md' };
/** The items of the panel of the shell (rule PP-01): each one is in the sidebar (default) or, on a desktop, in the toolbar at the top of the page. An application adds its own (`notif`, `qa`) in js/nav.config.js (UTIL). */
export const PANEL_ITEMS = ['search', 'lang', 'theme', 'notif', 'qa', 'profile'];
let ovr = {};
try { const r = JSON.parse(localStorage.getItem(KEY) || '{}'); if (r && typeof r === 'object' && !Array.isArray(r)) ovr = r; } catch { /* storage unavailable */ }
export const setPref = (k, v) => { ovr = { ...ovr, [k]: v }; try { localStorage.setItem(KEY, JSON.stringify(ovr)); } catch { /* ignore */ } };
/** Effective preferences: defaults < brand defaults < the user's own. `sidebar` stays 'auto' | 'expanded' | 'collapsed' (SB-28). */
export const prefs = (brand) => {
  const p = { ...DEF, mode: brand.defaultMode, lang: brand.defaultLang, ...ovr }; if (p.mode === 'system') p.mode = brand.defaultMode;
  const it = ovr.items && typeof ovr.items === 'object' ? ovr.items : {};
  p.items = Object.fromEntries(PANEL_ITEMS.map((k) => [k, it[k] === 'toolbar' ? 'toolbar' : 'sidebar']));
  return p;
};
/** Reset to defaults (My Preferences): every personal override goes, the brand is untouched. */
export const resetPrefs = () => { ovr = {}; try { localStorage.removeItem(KEY); } catch { /* ignore */ } };
