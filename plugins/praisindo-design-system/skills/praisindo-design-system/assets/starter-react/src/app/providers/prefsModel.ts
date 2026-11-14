// Pure model of the prototype's preferences (the prototype section 1: DEF, ovr, effPrefs, resolvedMode) and
// brand validation (setBrand). No React, no DOM, no storage: persistence lives in PrefsProvider via reactStorage.
import type { Brand } from '../../design-system/tokens/palette.ts';

export type Mode = 'light' | 'dark' | 'system';
export type Lang = 'en' | 'id';
export type FontSizePref = 'small' | 'regular' | 'large';
export type SidebarPref = 'expanded' | 'collapsed' | 'auto';
export type TableSize = 'sm' | 'md' | 'lg';
/** The items of the panel of the shell and where each one is (rule PP-01): the sidebar (default) or the toolbar at the top of the page. An application lists only the ones it has (nav.config.ts: UTIL). */
export const PANEL_ITEMS = ['search', 'lang', 'theme', 'notif', 'qa', 'profile'] as const;
export type PanelItem = (typeof PANEL_ITEMS)[number];
export type PanelPos = 'sidebar' | 'toolbar';
export type PanelItems = Record<PanelItem, PanelPos>;

/** User overrides as stored (`ovr` in the prototype). Every field is optional. */
export interface PrefOverrides { mode?: Mode; fs?: FontSizePref; lang?: Lang; sidebar?: SidebarPref; table?: TableSize; items?: Partial<Record<PanelItem, PanelPos>>; [legacy: string]: unknown }
/** Effective preferences (`prefs` in the prototype). `mode` is never 'system' here and `sidebar` is never 'auto'. */
export interface Prefs { mode: 'light' | 'dark'; fs: FontSizePref; lang: Lang; sidebar: 'expanded' | 'collapsed'; table: TableSize; items: PanelItems }

export const DEF = { mode: 'light', fs: 'regular', lang: 'en', sidebar: 'expanded', table: 'md' } as const;

/** Reads stored overrides: non-objects become {}; the retired `density` key is dropped (prototype behaviour). */
export function sanitizeOverrides(raw: unknown): PrefOverrides {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const o = { ...(raw as PrefOverrides) };
  delete o.density;
  return o;
}

/** Same merge order as the prototype: DEF < brand defaults < user overrides, then normalise 'system' and 'auto'. */
export function effPrefs(brand: Brand, ovr: PrefOverrides): Prefs {
  const p = Object.assign({}, DEF, { mode: brand.defaultMode, lang: brand.defaultLang }, ovr) as Record<string, unknown>;
  if (p.mode === 'system') p.mode = brand.defaultMode;
  if (p.sidebar === 'auto') p.sidebar = 'expanded';
  const it = (ovr.items && typeof ovr.items === 'object' ? ovr.items : {}) as Partial<Record<PanelItem, PanelPos>>;
  p.items = Object.fromEntries(PANEL_ITEMS.map((k) => [k, it[k] === 'toolbar' ? 'toolbar' : 'sidebar']));
  return p as unknown as Prefs;
}
