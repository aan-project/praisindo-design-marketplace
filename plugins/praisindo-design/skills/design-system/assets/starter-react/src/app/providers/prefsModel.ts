// Pure model of the prototype's preferences (the prototype section 1: DEF, ovr, effPrefs, resolvedMode) and
// brand validation (setBrand). No React, no DOM, no storage: persistence lives in PrefsProvider via reactStorage.
import { KPI_LOOKS, STAT_LOOKS, type CardLook } from '../../design-system/tokens/cardLooks.ts';
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

/** The look of the number cards in each place (rule PP-05, DS 2.120): a place (slot) and the looks it can have, the first one is the default. The stat cards (`StatCards`) are in a list page, a detail page or elsewhere;
 *  the KPI cards (`KPI`) are at the top of a page or inside a card or a drawer. */
const STAT_IDS = STAT_LOOKS.map((l) => l.id), KPI_IDS = KPI_LOOKS.map((l) => l.id);   // the looks come from the registry of the Design System (WG-14)
export const CARD_SLOTS = {
  statList: STAT_IDS, statDetail: STAT_IDS, statOther: STAT_IDS,
  kpiPage: KPI_IDS, kpiCard: KPI_IDS,
  /** one card or separate cards: the cards of a row are each a card (default) or one card with dividers (`html[data-sg]`, `html[data-kg]`) */
  statGroup: ['separate', 'one'], kpiGroup: ['separate', 'one'],
} as const satisfies Record<string, readonly string[]>;
export type CardSlot = keyof typeof CARD_SLOTS;
export type CardVariants = Record<CardSlot, string>;
/** The two drawers of the number cards, Stat view and KPI view: the fields of each, the choice of one card or separate cards first (rule PP-05). */
export const CARD_VIEWS: Readonly<Record<'stat' | 'kpi', readonly CardSlot[]>> = { stat: ['statGroup', 'statList', 'statDetail', 'statOther'], kpi: ['kpiGroup', 'kpiPage', 'kpiCard'] };
/** The looks of a place, with their names: the options of the fields of the drawers. */
export const looksOf = (slot: CardSlot): readonly CardLook[] => (slot.startsWith('stat') ? STAT_LOOKS : KPI_LOOKS);
export const CARD_SLOT_IDS = Object.keys(CARD_SLOTS) as CardSlot[];
export const CARD_DEFAULTS: CardVariants = Object.fromEntries(CARD_SLOT_IDS.map((k) => [k, CARD_SLOTS[k][0]])) as CardVariants;
/** A stored choice is kept only when the slot exists and the look is one of its looks; anything else is the default. */
export const resolveCards = (raw: unknown): CardVariants => {
  const o = (raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}) as Record<string, unknown>;
  return Object.fromEntries(CARD_SLOT_IDS.map((k) => [k, (CARD_SLOTS[k] as readonly string[]).includes(o[k] as string) ? o[k] : CARD_DEFAULTS[k]])) as CardVariants;
};

/** User overrides as stored (`ovr` in the prototype). Every field is optional. */
export interface PrefOverrides { mode?: Mode; fs?: FontSizePref; lang?: Lang; sidebar?: SidebarPref; table?: TableSize; items?: Partial<Record<PanelItem, PanelPos>>; cards?: Partial<CardVariants>; [legacy: string]: unknown }
/** Effective preferences (`prefs` in the prototype). `mode` is never 'system' here and `sidebar` is never 'auto'. */
export interface Prefs { mode: 'light' | 'dark'; fs: FontSizePref; lang: Lang; sidebar: 'expanded' | 'collapsed'; table: TableSize; items: PanelItems; cards: CardVariants }

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
  p.cards = resolveCards(ovr.cards);
  return p as unknown as Prefs;
}
