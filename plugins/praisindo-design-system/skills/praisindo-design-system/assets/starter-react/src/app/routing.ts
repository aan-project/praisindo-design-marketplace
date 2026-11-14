// Hash routing without a library: '#/design', '#/branding', '#/orders', '#/orders/ORD-1', '#/orders/ORD-1/edit'.
import { useEffect, useState } from 'react';

export interface PageInfo { route: string; arg?: string; sub?: string }
export function parseHash(h: string = typeof location === 'undefined' ? '' : location.hash): PageInfo {
  const [route = 'home', arg, sub] = h.replace(/^#\/?/, '').split('/').filter(Boolean);
  return { route: route || 'home', arg, sub };
}
export function usePage(): PageInfo {
  const [p, setP] = useState<PageInfo>(() => parseHash());
  useEffect(() => { const f = () => setP(parseHash()); window.addEventListener('hashchange', f); return () => window.removeEventListener('hashchange', f); }, []);
  return p;
}
/** Identity of the current page, for state that must end when the route changes. */
export const pageRouteId = (p: PageInfo): string => `${p.route}/${p.arg ?? ''}/${p.sub ?? ''}`;
