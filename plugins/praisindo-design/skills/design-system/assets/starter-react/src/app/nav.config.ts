// The ONLY per-application part of the shell: the menu. Labels are i18n KEYS, never text. Home stands alone (group key '' = no caption).
// Mandatory in every application (rule NV-13): Branding and Design System are NOT in the sidebar; they are in the menu of the user (`PROFILE_NAV`, UserMenu), under a divider after My preferences and before Sign out. Their routes stay `branding` and `design`.
import { createElement } from 'react';
import { NotificationHost } from '../features/notifications/NotificationHost';
export interface NavItem { k: string; icon?: string; labelKey: string; href?: string; kids?: NavItem[] }
export interface NavGroup { key: string; labelKey: string; items: NavItem[] }

export const NAV: NavGroup[] = [
  { key: '', labelKey: '', items: [{ k: 'home', icon: 'home', labelKey: 'nav.home', href: '#/home' }] },
  // { key: 'work', labelKey: 'ng.work', items: [{ k: 'orders', icon: 'receipt_long', labelKey: 'nav.orders', href: '#/orders' }] },   // add the product's groups here
  { key: 'admin', labelKey: 'ng.admin', items: [
    // Pattern examples (reference pages of the skill): remove this entry and the 'ex-*' routes when the product pages exist.
    { k: 'examples', icon: 'auto_stories', labelKey: 'nav.examples', href: '#/ex-list', kids: [
      { k: 'ex-list', labelKey: 'nav.exList', href: '#/ex-list' },
      { k: 'ex-form', labelKey: 'nav.exForm', href: '#/ex-form' },
      { k: 'ex-dialogs', labelKey: 'nav.exDialogs', href: '#/ex-dialogs' },
    ] },
  ] },
];
/** The pages in the menu of the user (rule NV-13): [key, icon, label key, href]. Add a role filter here when the product has roles (the routes and their access do not change). */
export const PROFILE_NAV: readonly (readonly [string, string, string, string])[] = [
  ['branding', 'palette', 'nav.branding', '#/branding'],
  ['design', 'design_services', 'nav.design', '#/design'],
];
/** Extra actions of the action row of the sidebar (rule PP-02): `node` is the button (for example a notification bell), `icon` and `labelKey` draw its row in the "more" menu. The row shows three items at most
 *  (language, theme and the first action); each one can be moved to the toolbar in My Preferences (PP-01). Empty by default: add `{ k: 'notif', icon: 'notifications', labelKey: 'x.notif', node: <Bell /> }` here. */
export interface UtilItem { k: 'notif' | 'qa'; icon: string; labelKey: string; node: import('react').ReactNode }
export const UTIL: UtilItem[] = [{ k: 'notif', icon: 'notifications', labelKey: 'nt.bell', node: createElement(NotificationHost) }];   // the bell (rule GN-02); `notifications.config.ts` defines what it shows
export const navGroups = (): NavGroup[] => NAV;
export const navHas = (it: NavItem, cur: string): boolean => it.k === cur || (it.kids ?? []).some((c) => navHas(c, cur));
/** Mobile bottom bar: the first 4 entries and "More" when there are more than 5, else all. */
export function mobileSplit(): { top: NavItem[]; more: NavItem[] } {
  const flat = NAV.flatMap((g) => g.items);
  return flat.length > 5 ? { top: flat.slice(0, 4), more: flat.slice(4) } : { top: flat, more: [] };
}
/** Number of items waiting for attention per menu entry (0 draws nothing, above 99 shows "99+"). Wire it to the product's data. */
export const navCount = (_k: string): number => 0;
