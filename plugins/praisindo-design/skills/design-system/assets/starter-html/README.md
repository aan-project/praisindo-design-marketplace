# starter-html (skill design-system v2.184.0)

A plain HTML + CSS + JavaScript (ES modules) app with the Praisindo shell, the Design System page and the Branding page. No build step.

## Run
ES modules do not load from `file://`: serve the folder, e.g. `npx serve .` or `python3 -m http.server 8080`, then open `http://localhost:8080/`.

## Start
1. Put the product's name and brand colours in `BDEF` of `js/tokens/palette.js` (nothing else in that file), and the name in `<title>`.
2. Menu and routes: `js/nav.config.js` (`NAV`, `ROUTE_META`; labels are dictionary keys in `js/i18n.js`, same keys in English and Indonesian). Pages: `js/pages/*.js`, registered in `PAGES` in `js/app.js`. A detail or editor page declares `layout: 'detail'`.
3. Replace `js/session.js` with the product's sign-in. Mark admin routes `admin: true`.
4. Branding saves through `js/brand/adapter.js`. The default is the TEMPORARY localStorage adapter; with a server call `setAdapter(httpAdapter('/api'))` (`js/brand/brandHttp.js`, contract in `references/branding.md`).
5. Build screens with the markup in `pages/design.en.html` (every component, live, with the real classes) and the helpers in `js/ui.js`. Escape every dynamic string with `esc()`. A Select is `select({ id, label, opts, val })` from `js/select.js` (a list of its own on a device with a mouse, rules SL-01 to SL-05); `initSelects()` runs once at boot; after a script sets `select.value`, call `syncSelects(root)`. A date is `dateField({ id, label, mode: 'single' | 'range', from, to })` from `js/datefield.js` (the calendar popover; never a native date input, rule FP-02; read it with `dateValue(root, id)`, set it with `setDate`; it fires a bubbling `datechange` event; `initDateFields()` at boot). A tooltip is `tooltip({ text, placement, trigger })` from `js/tooltip.js` (`initTooltips()` at boot). A centred decision is `dialog({ kind, title, bodyHtml, ok, cancel, onOk })`, a floating layer is `popover(trigger, html)`, an action menu is `menu(trigger, items)` (all in `js/ui.js`; drawers and dialogs close on a page change through `closeOverlays()`). Their texts are the `ui.*` keys of `js/ui-texts.js`. A select with a soft name or a description on its options (the default font weight of Branding) is `richSelect({ id, label, opts: [{ v, label, soft, desc }], val })` from `js/richselect.js` (`initRichSelects()` at boot; read it with `richValue`, set it with `setRich`). The sidebar has a search field (`js/sidesearch.js`, SQ-01 to SQ-04: it searches the pages of `NAV` and `PROFILE_NAV`; add a group of content through `searchHooks.extraGroups`). The action row of the sidebar shows three items at most (PP-02): language, theme and the actions you list in `UTIL` of `js/nav.config.js` (`{ k: 'notif' | 'qa', icon, labelKey }`, handler `UTIL_RUN[k]`); the rest go to the "more" menu. My Preferences (`prefs.title`) has Font size, Table size and the link "Panel items" (PP-01, PP-04) that moves search, language, theme, your actions and the profile to the toolbar at the top of the page (PP-03).

## Layout
- `css/` the Praisindo stylesheets in cascade order (`index.css`). Do not reorder, edit or delete.
- `js/tokens/` palette, colour engine, token builder. `js/brand/` brand model and adapters. `js/shell.js` the shell (do not restyle). `js/pages/design.js` behaviour of the Design System page; `pages/design.*.html` its content (generated from the React starter: re-export it when the design system version changes).
- `docs/design-system/changelog.md` and `new-components.md` (the log for the design-system owner). A new component is added only when no existing one fits, is built from tokens, is shown on the Design System page ("This project" section) and logged.
- `scripts/audit.mjs` (`node scripts/audit.mjs .`) and `scripts/contrast.mjs`.
- `js/pages/examples.js` + `pages/examples/<page>.<lang>.html`: **pattern examples, a REFERENCE, not product pages** (list, form, detail, dialogs and menus; menu Admin > "Pattern examples (reference)", routes `ex-*`). The markup is generated from the React starter (`features/examples`, whose file headers list the rule ids); this module only shows the states and overlays. Build product pages with the same markup, then delete the module, the four routes, the menu entry and `pages/examples/`.

**Built by default (GN-01 to GN-06).** Five features exist without being asked; adapt their content to the product (see `references/rules-otomatis.md` of the skill):
- Activity history (GN-01): the item `data-testid="mylog"` in the user menu, the page `#/mylog` and the one function `logActivity({ category, action, targetType, targetId, note })`; categories in `js/activity.config.js`. Call `logActivity` from every create, update, delete, approve, publish, export and sign-in.
- Notifications (GN-02): the bell in the action row, its dropdown and the drawer "View all"; categories, kinds, audiences and texts in `js/notifications.config.js`; the list is derived from the product's data in `ntBuild()` in `js/notifications.js`.
- Badge tooltips (GN-03): one central map and ``badgeProps(domain, value)` and `badge()` (`js/badges.js`)`; a badge never gets a hand-written tooltip.
- Profile card (GN-04): `userName()` (`js/profile.js`) for every user name, fields in `js/profile.config.js`.
- Motion (GN-05) is on by default (`data-motion` on the root, the design-system layer only). Delete the pattern examples (`ex-*`) when the real pages exist (GN-06).

**Rules register.** `docs/design-system/rules-register.md` holds the rules of this project (RG-01 to RG-04): record every rule you are given or create, and report a contradiction to the owner at once (`node scripts/rules-conflicts.mjs --new <ids>` from the skill).
