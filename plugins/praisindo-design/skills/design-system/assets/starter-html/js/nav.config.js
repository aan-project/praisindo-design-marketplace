// The ONLY per-application part of the shell: the menu and the routes. Labels are dictionary KEYS (js/i18n.js). Home stands alone (group key '' = no caption).
// Mandatory in every application (rule NV-13): Branding and Design System are NOT in the sidebar; they are in the menu of the user (PROFILE_NAV, js/shell.js), under a divider after My preferences. Their routes stay `branding` and `design`.
// A route declares its layout: 'list' (the sidebar follows the user's preference) or 'detail' (one entity at full width: the sidebar collapses on entry, rule SB-30).
export const NAV = [
  { key: '', labelKey: '', items: [{ k: 'home', icon: 'home', labelKey: 'nav.home', href: '#/home' }] },
  // { key: 'work', labelKey: 'ng.work', items: [{ k: 'orders', icon: 'receipt_long', labelKey: 'nav.orders', href: '#/orders' }] },   // add the product's groups here
  { key: 'admin', labelKey: 'ng.admin', items: [
    // Pattern examples (reference pages of the skill, js/pages/examples.js): remove this entry and the 'ex-*' routes when the product pages exist.
    { k: 'examples', icon: 'auto_stories', labelKey: 'nav.examples', href: '#/ex-list', kids: [
      { k: 'ex-list', labelKey: 'nav.exList', href: '#/ex-list' },
      { k: 'ex-form', labelKey: 'nav.exForm', href: '#/ex-form' },
      { k: 'ex-dialogs', labelKey: 'nav.exDialogs', href: '#/ex-dialogs' },
    ] },
  ] },
];
/** The pages in the menu of the user (rule NV-13): [key, icon, label key, href]. */
export const PROFILE_NAV = [
  ['branding', 'palette', 'nav.branding', '#/branding'],
  ['design', 'design_services', 'nav.design', '#/design'],
];
/** route key -> { layout, titleKey, admin, render(main, ctx) }. Pages register themselves in js/app.js. */
export const ROUTE_META = {
  home: { layout: 'list', titleKey: 'nav.home' },
  mylog: { layout: 'list', titleKey: 'nav.mylog' },   // Activity history of the signed-in user (rule GN-01)
  branding: { layout: 'list', titleKey: 'nav.branding', admin: true },
  design: { layout: 'list', titleKey: 'nav.design' },
  'ex-list': { layout: 'list', titleKey: 'nav.exList' },
  'ex-form': { layout: 'detail', titleKey: 'nav.exForm' },
  'ex-detail': { layout: 'detail', titleKey: 'nav.exDetail' },
  'ex-dialogs': { layout: 'list', titleKey: 'nav.exDialogs' },
  // order: { layout: 'detail', titleKey: 'nav.orders' },   // a detail or editor page
};
/** Extra actions of the action row of the sidebar (rule PP-02): { k: 'notif' | 'qa', icon, labelKey, count?: () => number }. A `count` (the bell) draws the number of items waiting over the button. The row shows three items at most (language, theme and the first action); the rest are in the "more" menu.
 *  Each one can be moved to the toolbar in My Preferences (PP-01). The handler of each is set in js/app.js: UTIL_RUN[k] = (triggerElement) => void. Empty by default. */
export const UTIL = [];
export const UTIL_RUN = {};
/** Number of items waiting for attention per menu entry (0 draws nothing, above 99 shows "99+"). */
export const navCount = (_k) => 0;
