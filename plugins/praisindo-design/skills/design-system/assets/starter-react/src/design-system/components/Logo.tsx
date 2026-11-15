// Brand logo (prototype logoUrl / logoFull / Logo / LogoMark / LogoOnBrand). The uploaded logo already contains the brand name, so with a logo the name is never repeated as text.
//   Logo        : sidebar and light surfaces. The dark-theme logo is used in dark mode and falls back to the light one; without any logo, a monogram tile with the first letter.
//   LogoMark    : tight spots (collapsed sidebar): the favicon when a logo exists and a favicon was uploaded, else the monogram.
//   LogoOnBrand : on a brand-colour surface (login aura, page veil): always the dark-mode logo (falls back to the light one), without a tile; no logo -> light monogram.
import { usePrefs } from '../../app/providers/PrefsProvider';
import type { Brand } from '../tokens/palette.ts';

export const logoUrl = (b: Pick<Brand, 'logoLight' | 'logoDark'>, dark: boolean): string => (dark ? b.logoDark || b.logoLight : b.logoLight);
export const onBrandUrl = (b: Pick<Brand, 'logoLight' | 'logoDark'>): string => b.logoDark || b.logoLight;

/** What the brand shows right now: the logo for the current theme, whether it is a full logo, and the logo for brand surfaces. */
export function useLogo() {
  const { brand, prefs } = usePrefs();
  const url = logoUrl(brand, prefs.mode === 'dark'), ob = onBrandUrl(brand);
  return { brand, url, full: !!url, ob, initial: brand.appName.charAt(0).toUpperCase() };
}

export function Logo({ h = 32 }: { h?: number }) {
  const { brand, url, full, initial } = useLogo();
  return url ? <img className={`logo${full ? ' full' : ''}`} style={{ height: h }} src={url} alt={brand.appName} /> : <span className="mono" style={{ width: h, height: h }}>{initial}</span>;
}
export function LogoMark({ h = 32 }: { h?: number }) {
  const { brand, full, initial } = useLogo();
  return full && brand.favicon ? <img className="logo mark" style={{ height: h, width: h }} src={brand.favicon} alt={brand.appName} /> : <span className="mono" style={{ width: h, height: h }}>{initial}</span>;
}
export function LogoOnBrand({ h = 40 }: { h?: number }) {
  const { brand, ob, initial } = useLogo();
  return ob ? <img className="logo full ob" src={ob} alt={brand.appName} /> : <span className="mono inv" style={{ width: h, height: h }}>{initial}</span>;
}
