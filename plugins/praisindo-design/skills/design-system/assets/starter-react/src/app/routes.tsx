// Route table: route key -> page element and layout. PAGE_LAYOUT drives the sidebar (a 'detail' page collapses it on entry, rule SB-30).
// The table is exhaustive on purpose: a new page does not exist until it declares its layout.
import type { ReactNode } from 'react';
import { BrandingPage } from '../features/branding/BrandingPage';
import { DesignRoute } from '../features/design/DesignPage';
import { DetailPage } from '../features/examples/DetailPage';
import { DialogsPage } from '../features/examples/DialogsPage';
import { FormPage } from '../features/examples/FormPage';
import { ListPage } from '../features/examples/ListPage';
import { HomePage } from '../features/home/HomePage';
import { MyLogPage } from '../features/log/MyLogPage';
import type { PageInfo } from './routing';

export interface RouteDef { layout: 'list' | 'detail'; titleKey: string; element: (p: PageInfo) => ReactNode; admin?: boolean }
export const ROUTES: Readonly<Record<string, RouteDef>> = {
  home: { layout: 'list', titleKey: 'nav.home', element: () => <HomePage /> },
  mylog: { layout: 'list', titleKey: 'nav.mylog', element: () => <MyLogPage /> },   // Activity history of the signed-in user (rule GN-01)
  branding: { layout: 'list', titleKey: 'nav.branding', element: () => <BrandingPage />, admin: true },
  design: { layout: 'list', titleKey: 'nav.design', element: (p) => <DesignRoute id={p.arg} /> },
  // Pattern examples (reference pages of the skill, features/examples): build product pages like them, then remove these four routes and their menu entry.
  'ex-list': { layout: 'list', titleKey: 'nav.exList', element: (p) => <ListPage preview={p.arg} /> },
  'ex-form': { layout: 'detail', titleKey: 'nav.exForm', element: () => <FormPage /> },
  'ex-detail': { layout: 'detail', titleKey: 'nav.exDetail', element: (p) => <DetailPage id={p.arg} /> },
  'ex-dialogs': { layout: 'list', titleKey: 'nav.exDialogs', element: () => <DialogsPage /> },
  // orders: { layout: 'list', titleKey: 'nav.orders', element: () => <OrdersPage /> },
  // order:  { layout: 'detail', ... }   // a detail or editor page: the sidebar collapses on entry
};
/** A detail page = one entity worked on at full width (a detail, an editor). `orders/ORD-1` can map to the route key 'order' here. */
export const routeKeyOf = (p: PageInfo): string => (ROUTES[p.route] ? p.route : 'home');
export const isDetailPage = (p: PageInfo): boolean => ROUTES[routeKeyOf(p)]?.layout === 'detail';
