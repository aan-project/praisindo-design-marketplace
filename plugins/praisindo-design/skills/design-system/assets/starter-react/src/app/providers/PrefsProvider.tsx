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
  setPref: <K extends 'mode' | 'fs' | 'lang' | 'sidebar' | 'table' | 'items'>(key: K, value: NonNullable<PrefOverrides[K]>) => void;
  /** Saves the brand through the adapter. Resolves with an error code when the brand is invalid or the adapter fails. */
  saveBrand: (b: Brand) => Promise<{ ok: boolean; error?: string }>;
  resetBrand: () => Promise<void>;
  resetPrefs: () => void;
  t: (key: string) => string;
}

const Ctx = createContext<PrefsApi | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [ovr, setOvr] = useState<PrefOverrides>(() => sanitizeOverrides(readJSON<unknown>('prefs', {})));
  const [brand, setBrandState] = useState<Brand>(() => cachedBrand());   // first paint from the cache, then the adapter (server) decides
  const prefs = useMemo(() => effPrefs(brand, ovr), [brand, ovr]);
  const sidebarMode = ovr.sidebar === 'expanded' || ovr.sidebar === 'collapsed' ? ovr.sidebar : 'auto';

  useEffect(() => { let live = true; brandAdapter.getBrand().then((b) => { if (live) setBrandState(normalizeBrand(b)); }).catch(() => { /* keep the cached brand */ }); return () => { live = false; }; }, []);
  // Layout effect: the CSS variables must be written before any child effect reads them.
  useLayoutEffect(() => { applyBrand(document, brand, prefs.mode, prefs.lang, prefs.fs); }, [brand, prefs]);

  const setPref = useCallback<PrefsApi['setPref']>((key, value) => {
    setOvr((o) => { const n = { ...o, [key]: value }; writeJSON('prefs', n); return n; });
  }, []);
  const saveBrand = useCallback<PrefsApi['saveBrand']>(async (b) => {
    const n = normalizeBrand(b), e = brandError(n);
    if (e) return { ok: false, error: e };
    try { setBrandState(normalizeBrand(await brandAdapter.saveBrand(n))); return { ok: true }; } catch (x) { return { ok: false, error: x instanceof Error ? x.message : 'adm.upfail' }; }
  }, []);
  const resetBrand = useCallback(async () => { setBrandState(normalizeBrand(await brandAdapter.saveBrand({ ...BDEF }))); }, []);
  const resetPrefs = useCallback(() => { writeJSON('prefs', {}); setOvr({}); }, []);
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
