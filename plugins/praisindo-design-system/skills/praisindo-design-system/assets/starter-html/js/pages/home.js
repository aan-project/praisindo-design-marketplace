// PLACEHOLDER home page. Replace it with the product's home; keep the page head (breadcrumb, title, one-line description) and build with the design-system markup (js/ui.js, pages/design.*.html).
import { t } from '../shell.js';
import { pageHead, card, emptyState } from '../ui.js';

export function renderHome(main) {
  main.innerHTML = pageHead([['#/home', t('nav.home')]], t('nav.home'), t('shell.homeSub')) + card(t('shell.homeCard'), emptyState(t('shell.homeEmptyT'), t('shell.homeEmptyD')));
}
