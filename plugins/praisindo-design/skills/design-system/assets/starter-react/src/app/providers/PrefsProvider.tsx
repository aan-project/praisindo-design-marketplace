// Holds the brand (loaded and saved through the branding adapter, rule BR-01..BR-08) and the personal preferences (local only, BR-07), and applies them to the document.
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react';
import { applyBrand, brandError, cachedBrand, localAdapter, normalizeBrand, type BrandAdapter } from '../../branding/brandStore';
import { BDEF, type Brand } from '../../design-system/tokens/palette';
import { translate } from '../../i18n';
import { readJSON, writeJSON } from '../../lib/reactStorage';
import { effPrefs, sanitizeOverrides, type PrefOverrides, type Prefs } from './prefsModel';

/** THE brand adapter of the application. Replace `localAdapter` (temporary, front-end only) with the HTTP adapter in optional/adapters when a server exists. */
export const brandAdapter: BrandAdapter = localAdapter;

interface PrefsApi {
  prefs: Prefs;
  /** the sidebar choice as stored: 'auto' (collapse on detail pages and narrow windows; nothing stored), 'expanded' or 'collapsed' (rule SB-28) */ sidebarMode: 'auto' | 'expanded' | 'collapsed';
  brand: Brand;
  setPref: <K extends 'mode' | 'fs' | 'lang' | 'sidebar' | 'table' | 'items' | 'cards'>(key: K, value: NonNullable<PrefOverrides[K]>) => void;
  /** Saves the brand through the adapter. Resolves with an error code when the brand is invalid or the adapter fails. */
  saveBrand: (b: Brand) => Promise<{ ok: boolean; error?: string }>;
  resetBrand: () => Promise<void>;
  resetPrefs: () => void;
  t: (key: string) => string;
}

const Ctx = createContext<PrefsApi | null>(null);

/** The storage key of the preferences of the person who is signed in (rule PP-07, owner 2026-11-17): one key for each person, so what one person sets is never seen by another on the same device.
 *  Without a session (the sign-in page) the preferences are the shared ones, `prefs`; they are also the base under the personal ones. */
export const prefsKeyOf = (): string | null => {
  const s = readJSON<{ email?: string; name?: string } | null>('sess', null, 'session');
  const id = (s?.email || s?.name || '').trim().toLowerCase();
  return id ? 'prefs.u.' + id.replace(/[^a-z0-9]+/g, '_') : null;   // a storage key is letters, digits and _ . -
};
export const SESSION_EVENT = 'kora-session';

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [base, setBase] = useState<PrefOverrides>(() => sanitizeOverrides(readJSON<unknown>('prefs', {})));
  const [mine, setMine] = useState<PrefOverrides>(() => { const k = prefsKeyOf(); return k ? sanitizeOverrides(readJSON<unknown>(k, {})) : {}; });
  const ovr = useMemo<PrefOverrides>(() => ({ ...base, ...mine }), [base, mine]);
  useEffect(() => {   // a person signs in or out (the application dispatches `kora-session`): their own preferences are read
    const on = () => { const k = prefsKeyOf(); setMine(k ? sanitizeOverrides(readJSON<unknown>(k, {})) : {}); };
    window.addEventListener(SESSION_EVENT, on); return () => window.removeEventListener(SESSION_EVENT, on);
  }, []);
  const [brand, setBrandState] = useState<Brand>(() => cachedBrand());   // first paint from the cache, then the adapter (server) decides
  const prefs = useMemo(() => effPrefs(brand, ovr), [brand, ovr]);
  const sidebarMode = ovr.sidebar === 'expanded' || ovr.sidebar === 'collapsed' ? ovr.sidebar : 'auto';

  useEffect(() => { let live = true; brandAdapter.getBrand().then((b) => { if (live) setBrandState(normalizeBrand(b)); }).catch(() => { /* keep the cached brand */ }); return () => { live = false; }; }, []);
  // Layout effect: the CSS variables must be written before any child effect reads them.
  useLayoutEffect(() => { applyBrand(document, brand, prefs.mode, prefs.lang, prefs.fs); document.documentElement.dataset.sg = prefs.cards.statGroup; document.documentElement.dataset.kg = prefs.cards.kpiGroup; }, [brand, prefs]);   // the cards of a row: separate or one card (WG-10)

  const setPref = useCallback<PrefsApi['setPref']>((key, value) => {
    const k = prefsKeyOf();
    if (k) setMine((o) => { const n = { ...o, [key]: value }; writeJSON(k, n); return n; });
    else setBase((o) => { const n = { ...o, [key]: value }; writeJSON('prefs', n); return n; });
  }, []);
  const saveBrand = useCallback<PrefsApi['saveBrand']>(async (b) => {
    const n = normalizeBrand(b), e = brandError(n);
    if (e) return { ok: false, error: e };
    try { setBrandState(normalizeBrand(await brandAdapter.saveBrand(n))); return { ok: true }; } catch (x) { return { ok: false, error: x instanceof Error ? x.message : 'adm.upfail' }; }
  }, []);
  const resetBrand = useCallback(async () => { setBrandState(normalizeBrand(await brandAdapter.saveBrand({ ...BDEF }))); }, []);
  const resetPrefs = useCallback(() => { const k = prefsKeyOf(); if (k) { writeJSON(k, {}); setMine({}); } else { writeJSON('prefs', {}); setBase({}); } }, []);
  const t = useCallback((key: string) => translate(prefs.lang, key), [prefs.lang]);

  const api = useMemo<PrefsApi>(() => ({ prefs, sidebarMode, brand, setPref, saveBrand, resetBrand, resetPrefs, t }), [prefs, sidebarMode, brand, setPref, saveBrand, resetBrand, resetPrefs, t]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function usePrefs(): PrefsApi {
  const v = useContext(Ctx);
  if (!v) throw new Error('usePrefs must be used inside <PrefsProvider>');
  return v;
}

/** Like usePrefs, but returns null outside a provider (components that must stay usable in isolation). */
export function usePrefsOptional(): PrefsApi | null {
  return useContext(Ctx);
}
