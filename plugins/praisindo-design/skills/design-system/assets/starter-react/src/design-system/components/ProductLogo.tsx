// The logo of an issuer or a product (rule PD-07): a white box with a border and the image inside, white in light and in dark mode (the logos are JPG on white); an initials fallback when there is no logo or the file does not load.
import { useState } from 'react';

export interface ProductLogoProps {
  /** the URL of the image; none (or a file that does not load) shows the initials */ src?: string | null;
  /** the name of the issuer or product: the text alternative of the image and the source of the initials */ name: string;
  /** sm 32px (a table row), md 48px, lg 64px (a detail page) */ size?: 'sm' | 'md' | 'lg';
}
const initials = (name: string): string => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export function ProductLogo({ src, name, size = 'sm' }: ProductLogoProps) {
  const [bad, setBad] = useState<string | null>(null);
  const ok = !!src && bad !== src;
  return ok
    ? <span className={`plg plg-${size}`}><img src={src!} alt={name} loading="lazy" onError={() => setBad(src!)} /></span>
    : <span className={`plg plg-${size} plg-fb`} role="img" aria-label={name}>{initials(name)}</span>;
}
