# Shell, navigation, mobile, branding, notifications (Praisindo DS v2.158.0, skill v2.158.0)

The ids are those of the Praisindo owner rules register (general rules only; product-domain rules are not in the skill). Every rule is permanent: do not change, loosen or re-interpret it; a need for something else goes to "Rule proposals" in `docs/design-system/new-components.md`. Examples in brackets name pages of the Praisindo reference application; apply the rule to the equivalent page of your product.

The shell is mandatory and complete in the starters (`references/shell.md`). Only `nav.config.ts` (menu) and `routes.tsx` (route → page and layout) change per application. A list page is `layout: 'list'`, a detail or editor page `layout: 'detail'`.

## Rules

### AV-02
**Rule.** The header (avatar, name, email, three stats) is a static block: no button, role, tabindex, chevron or handler, and no Profile entry exists
**Meet.** Keep `UserMenu` of the starter: the header is a static block.
**Check.** Open the user menu: the header is not focusable.
**Guarded in Praisindo by** a unit test.

### AV-03
**Rule.** The menu buttons have no min-height override and the stat cards use the card radius token
**Meet.** Keep `UserMenu`; no min-height on its buttons.
**Check.** Measure the menu buttons and stat cards.
**Guarded in Praisindo by** a unit test.

### AV-04
**Rule.** Sign out is the danger item; My preferences opens the preferences drawer and Activity history goes to the log
**Meet.** Keep `UserMenu` items; Sign out is `intent="danger"`.
**Check.** Open the user menu: Sign out is red, My preferences opens the drawer.
**Guarded in Praisindo by** a unit test.

### SB-01
**Rule.** On a desktop (1100px and wider) there is no topbar: no header.hd; the global actions (language, theme, quick access) and the user button are in the sidebar footer, in that order; the quick access (scenario) button is the LAST of the row, at its far right (owner revision 2026-10-25: it was first); in the collapsed rail (68px, one column) it is the last item of the stack, still inside the rail. Below 1100px a topbar exists (SB-33)
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a unit test.

### SB-02
**Rule.** The sidebar is 232px expanded and 68px collapsed
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a browser test.

### SB-03
**Rule.** The sidebar is exactly one screen high and sticky; only the menu list scrolls
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a unit test.

### SB-04
**Rule.** A list, overview or admin list page (not a detail-layout page, see SB-30) is expanded by default (Auto) and follows the stored preference (Auto, Expanded, Collapsed)
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a browser test.

### SB-05
**Rule.** A detail-layout page collapses the sidebar by default, whatever the preference, also Expanded (opportunity detail, Customer 360, Signal rule detail, Signal rule editor; full rule SB-30; keputusan owner 2026-10-24, before: only in mode Auto)
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a browser test.

### SB-06
**Rule.** Going back to a list page restores the sidebar according to the stored preference; a manual override on the detail page is gone
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a browser test.

### SB-07
**Rule.** A window narrower than 1100px collapses the sidebar automatically
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a browser test.

### SB-08
**Rule.** A collapsed sidebar expands on hover as an overlay: the content does not shift
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a browser test.

### SB-09
**Rule.** The round collapse button is visible, on top, clickable and keyboard operable
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a browser test.

### SB-11
**Rule.** Level-1 items are 32px (padding 0 8px, gap 12px), level-2 also 32px with padding-left 40px (level 2 differs from level 1 by indent only), the sub-menu line is at left 16px (grid 4px, keputusan owner 2026-10-23; was gap 10px, level 2 30px, line 17px)
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a unit test.

### SB-12
**Rule.** Group titles (.ngt) are uppercase, letter-spacing .08em, weight 500, neutral subtle-3 (caption)
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a unit test.

### SB-13
**Rule.** No divider between groups when expanded (12px gap); the divider shows when collapsed
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a unit test.

### SB-15
**Rule.** Menu items are grouped under caption headings, Home stands alone, and so does Help Center, the last item of every role (HC-01, keputusan owner 2026-11-11: the groups per role end with one more group without a title); the groups per role
**Meet.** In `nav.config.ts` put Home in the group with `key: ''`, every other item in a captioned group.
**Check.** Look at the sidebar.
**Guarded in Praisindo by** a unit test.

### SB-18
**Rule.** The collapsed sidebar shows the logo mark and hides labels and group titles (the tip card and its lightbulb link are gone: SB-31; owner revision 2026-10-25)
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a unit test.

### SB-19
**Rule.** The sidebar width is 232px expanded and 68px collapsed, and a collapsed sidebar expands over the content (margin-right keeps the content in place)
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a unit test.

### SB-20
**Rule.** The sidebar is exactly one screen high and the page does not scroll because of it
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a browser test.

### SB-21
**Rule.** No divider between menu groups when expanded; a divider when collapsed
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a browser test.

### SB-22
**Rule.** Menu item heights: level 1 and level 2 are 32px (level 2 has padding-left 40px); the count of a menu item is a static Chip, 20px high (keputusan owner 2026-10-26; it was a 20px badge-like count)
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a browser test.

### SB-23
**Rule.** The count on a menu item is a static Chip (solid brand since CH-08: it asks for attention), 20px high, 16px in the 68px rail and in the bottom bar where it sits on the icon (keputusan owner 2026-10-26; was a 20px `.cnt`)
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a browser test.

### SB-24
**Rule.** On a phone the sidebar is an off-canvas panel (fixed, translated out of view, width 280px) opened from More
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a unit test.

### SB-28
**Rule.** (Amended in DS 2.72: My Preferences has NO Sidebar control; the sidebar is automatic by the rules and only the round edge button writes the choice, which survives a reload.) Auto = expanded, collapsed in a window narrower than 1100px (SB-07); an edge click makes Expanded / Collapsed explicit on list pages. On a detail-layout page the preference does not apply (SB-30: keputusan owner 2026-10-24, before: Expanded won there too); an edge click on a list page writes the preference, on a detail page it only overrides that page
**Meet.** Use `SidebarToggle` of the shell; do not add a Sidebar setting to Preferences. Font size and Table size in Preferences are `SegmentedControl` choices (full width).
**Check.** Click the edge button on a list page, reload; Preferences shows no Sidebar control.
**Guarded in Praisindo by** a browser test.

### SB-30
**Rule.** Detail-layout pages collapse the sidebar (68px) on entry whatever the preference (Auto, Expanded, Collapsed); hover / keyboard focus widens it temporarily; the edge button overrides that page only (the stored preference is not changed) and the override ends with the route; back on a list page the stored preference applies; between two detail pages it stays collapsed with no expand-then-collapse flicker; a narrow window and a phone keep their rules. Browser test: `tests/e2e/rules/sidebarDetail.spec.ts`. Detail-layout = `PAGE_LAYOUT[key] === 'detail'` in `src/app/routeKey.ts` (declared per page key, exhaustive): `opportunities/:id` (oppd), `customers/:id` (custd, Customer 360), `rules/:id` (ruled), `rules/:id/edit` and `rules/new` (rulee). Not detail (follow the preference): Home, Opportunity list and Kanban, Customers, Activities, Analytics, Reports, Marketing, Users, Audit log, My log, Branding, Design, Integration, Scoring, Catalog, Detection, Log policy, Signal rules list
**Meet.** Declare detail and editor pages with `layout: 'detail'` in `routes.tsx`.
**Check.** Open a detail page: the sidebar is 68px; go back: the stored preference applies.
**Guarded in Praisindo by** a unit test.

### SB-31
**Rule.** The sidebar has no tip card (`.tip`, with the title, text and action of the role) and, collapsed, no small lightbulb link (`.tipi`): the sidebar was too full. The menu, the footer and the edge toggle keep their sizes (232px / 68px, hover-expand, SB-04 to SB-30); the footer stays at the bottom without an empty gap. The `tip.*` dictionary keys stay (orphans, reported)
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a browser test.

### SB-33
**Rule.** Below 1100px (tablet 641 to 1099px with the 68px rail, and phone up to 640px with the bottom bar) a topbar (`header.topbar`, 56px, sticky, on the page surface with a bottom hairline) shows: the menu button (phone: opens the off-canvas menu like "More"; tablet: expands or collapses the rail like the edge button), the title of the page (`nav.<route>`) and the avatar of the user, which opens the same user menu as the sidebar footer. It is not rendered at 1100px and wider (SB-01). It was not shown before because the topbar was removed in DS 1.58 at every size (not hidden by CSS: not rendered). The page-head actions stay in the page (no duplicated primary action)
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a browser test.

### NV-01
**Rule.** The back icon / breadcrumb trail with a back link appears only on detail pages
**Meet.** Pass `onBack` / `backLabel` to `PageHeader` only on a `layout: 'detail'` page.
**Check.** List pages have no Back.
**Guarded in Praisindo by** a browser test.

### NV-02
**Rule.** The page header is a small breadcrumb above the title; nothing breadcrumb-like is in a header
**Meet.** `PageHeader crumbs={[[href, label], ...]}`: the breadcrumb sits above the title.
**Check.** Look at the page head.
**Guarded in Praisindo by** a unit test.

### NV-03
**Rule.** Every page title has a short description (the page head renders h1 and a .sub line)
**Meet.** `PageHeader title sub`: `sub` is required on every page (one line).
**Check.** Audit (page head check); every page shows a description.
**Guarded in Praisindo by** a unit test.

### NV-04
**Rule.** A new page opens at the top; Back returns to the previous scroll position
**Meet.** Use the starter routing (`routing.ts`); do not keep scroll by hand.
**Check.** Scroll a list, open a detail, press Back.
**Guarded in Praisindo by** a browser test.

### NV-09
**Rule.** One short page transition only (slide / fade); the page veil is for sign-in and sign-out
**Meet.** Do not add page transitions.
**Check.** Change page: only the short slide/fade.
**Guarded in Praisindo by** a unit test.

### NV-11
**Rule.** The Customer 360 tab strip never clips a label: the strip scrolls horizontally (DS tab strip pattern) and the active tab scrolls into view, at 1440 and 390
**Meet.** Use `Tabs` (it scrolls) for any tab strip; never wrap or cut tab labels.
**Check.** At 390px every tab label is whole; the active tab is in view.
**Guarded in Praisindo by** a browser test.

### NV-12
**Rule.** A tab strip that scrolls sideways opens at its start with the first tab fully visible when the first tab is active; the active tab is moved into view only when it is out of view (measured with rects from the strip, not `offsetLeft`, which counts from the offset parent: that scrolled the Customer 360 strip by the page offset and cut the first tab at 1440). After activating the last tab and then the first one, the first tab is fully visible again
**Meet.** Use `Tabs` / `DrawerTabs`; do not set `scrollLeft` by hand.
**Check.** Open a page with many tabs at 390px.
**Guarded in Praisindo by** a browser test.

### HM-01
**Rule.** Every role's Home has content: the hero (page heading) and at least one section, card or empty state; no role opens a Home that is only the sidebar
**Meet.** Home has `PageHeader` and at least one card, section or `EmptyState`.
**Check.** Open Home for every role.
**Guarded in Praisindo by** a browser test.

### BR-01
**Rule.** One logo type: with an uploaded logo the sidebar shows only the logo (it already contains the name), never the name text next to it
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a unit test.

### BR-02
**Rule.** Without a logo the sidebar shows the initial and the application name
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a unit test.

### BR-03
**Rule.** The collapsed-sidebar mark is the favicon when a logo and a favicon exist, else the initial
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a unit test.

### BR-04
**Rule.** On a brand-colour surface (sign-in panel, page transition) the dark-mode logo is used (light as fallback), without a tile; no logo gives a light monogram
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a unit test.

### BR-05
**Rule.** In dark mode the sidebar logo is the dark logo and falls back to the light one
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a unit test.

### BR-06
**Rule.** Branding is global and separate: app name, primary and secondary colour, light / dark logo, favicon, font, default mode and language; defaults are Praisindo Demo, #007bff, Figtree, light, English
**Meet.** Set the defaults in `BDEF` (`palette.ts`): app name, colours, font, mode, language.
**Check.** Open Branding; reset; the defaults show.
**Guarded in Praisindo by** a unit test.

### BR-07
**Rule.** A user preference never changes a brand colour: switching mode, language, font size or table size leaves the brand untouched
**Meet.** Store preferences and brand apart (`app.prefs` and `brandStore`).
**Check.** Change mode, language, font size, table size: the brand colour stays.
**Guarded in Praisindo by** a unit test.

### BR-08
**Rule.** The default language comes from the brand and the user can override it for themselves (a stored brand default applies, a user choice wins)
**Meet.** Read the default language from the brand; the user choice in prefs wins.
**Check.** Change the brand language, then the user language, reload.
**Guarded in Praisindo by** a unit test.

### MB-01
**Rule.** On a phone the sidebar is replaced by a bottom navigation (four items and More) and an off-canvas menu
**Meet.** Keep the shell; `mobileSplit()` in `nav.config.ts` decides the four bottom items.
**Check.** Open at 390px.
**Guarded in Praisindo by** a browser test.

### MB-02
**Rule.** Bottom navigation targets are at least 44px high
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a browser test.

### MB-03
**Rule.** No horizontal page scroll at 390px
**Meet.** Give tables `.tw` (it scrolls sideways inside), let long text wrap, never a fixed width wider than the screen.
**Check.** At 390px `document.documentElement.scrollWidth <= innerWidth`.
**Guarded in Praisindo by** a browser test.

### MB-04
**Rule.** Drawers are full screen on a phone
**Meet.** Use `Drawer`; it is full screen on a phone.
**Check.** Open a drawer at 390px.
**Guarded in Praisindo by** a browser test.

### MB-05
**Rule.** Below 640px the bottom navigation replaces the sidebar (touch targets 44px) and the page never scrolls sideways
**Meet.** Use the starter shell (`src/app/shell/`, `AppShell`, `PageHead`) unchanged; only `src/app/nav.config.ts` and `routes.tsx` are per application.
**Check.** Open the app at 1440 and 390, light and dark; compare with `references/shell.md`.
**Guarded in Praisindo by** a unit test.

### BK-01
**Rule.** The Back icon of a page that has one (Opportunity detail, Customer 360, Signal rule detail, Signal rule editor) goes back to the screen the person came from, by the navigation history (`src/app/routing/navHistory.ts`: every entry made in the app is stamped with its depth; a Back to the logical parent replaces the page in the history so Back does not loop). With no earlier screen in the app (a direct link, a new tab) it goes to the logical parent: the list, or the rule detail for the editor of a rule. The unsaved-changes dialog still comes first (also for the browser Back, which is held on the editor and never skips a screen); the drawer Back of Take Action is unchanged
**Meet.** Use `PageHeader onBack` with the starter navigation history (`history.back()` when the user came from inside the app, else the parent list).
**Check.** Open a detail from two different lists; Back returns to each.
**Guarded in Praisindo by** a browser test.

### NT-01
**Rule.** The bell is an icon-only button (Material Icons outlined `notifications`, 18px) in the util row of the sidebar footer, right of the theme button and left of the scenario button; it shows the number of unread notifications on it as a solid static Chip without a shadow (CH-08, CH-09; nothing at 0, the number to 9, "9+" above), its accessible name carries the count ("Notifications, 3 unread"), a polite live region announces a change of the count, it has the focus ring, and it works expanded (the row does not wrap), in the 68px rail (stacked, nothing overlaps) and in the phone menu, never overflowing sideways
**Meet.** Use `NotificationBell` of the starter in the sidebar util row.
**Check.** Look at the sidebar footer.
**Guarded in Praisindo by** a browser test.

### NT-02
**Rule.** The bell opens a DROPDOWN to the right of the sidebar, like the user menu (a phone: across the screen above the bottom bar): the title with "Mark all as read" as a link button on its right (no more button, no export), the category tabs (All, Rules, Data, Work, the `Tabs` component), at most FIVE rows, the newest unread ones of the selected tab (when everything of the tab is read, its five newest stay in the list), and "View all notifications" in the footer as a transparent brand button with a right arrow. A row (like the reference, owner 2026-11-02) has the icon tile of its kind, a title, one line, "time · category" and a dot and soft highlight while unread; opening a row marks it read, closes the dropdown and goes to what it is about (rule, opportunity, activity list, source systems). "Mark all as read" is not shown when everything is read. A tab with no notification shows "You are all caught up"; the footer button is always there. The scrim or Escape closes it and the focus returns to the bell. Replaces the first form of this rule (a Drawer)
**Meet.** Use `NotificationPopover` (dropdown) of the starter.
**Check.** Open the bell with mouse and keyboard.
**Guarded in Praisindo by** a browser test.

### NT-06
**Rule.** Every title and summary exists in English and Indonesian, and the relative time (today, yesterday, N days ago) is counted from the one clock source of the product (`src/domain/time.ts`), never from a second clock
**Meet.** Notification titles and summaries are i18n keys; relative time from `src/domain/time.ts`.
**Check.** Switch EN/ID with the panel open.
**Guarded in Praisindo by** a unit test.

### NT-08
**Rule.** The initial state is unchanged: opening a page shows no Alert, no toast and no extra request because of notifications, the pages and their data are the same, and nothing is stored until a notification is read. The panel has an empty state ("You are all caught up"), a loading state and an error state with Retry, and no console error or sideways scroll at 1440 and 390, light and dark
**Meet.** Do not load notifications with a toast or Alert; `NotificationPanel` has its own empty state.
**Check.** Open a page fresh: no toast, no Alert.
**Guarded in Praisindo by** a browser test.

### NT-09
**Rule.** "View all notifications" closes the dropdown and opens a right-hand Drawer (sm) with EVERY notification of the last 3 months, read and unread, newest first, the category tabs (`DrawerTabs`), "Mark all as read" as an icon button (`done_all`, name and tooltip "Mark all as read", gone when everything is read) in the header LEFT of Close, the tabs stay fixed at the top of the body while the list scrolls (`.db>.dtabs` is sticky), and at the end of the list the line "Only the last 3 months are shown."; a row works as in the dropdown (read, destination); Escape or Close returns the focus to the bell
**Meet.** "View all" opens `Drawer size="sm"` with `NotificationPanel` and `DrawerTabs`.
**Check.** Click View all.
**Guarded in Praisindo by** a browser test.

### NT-12
**Rule.** Layout of the notification screens (owner 2026-11-02): the drawer body gap is 16px (`.db`), the rows (`.nti`) have no radius, the group label above the tabs has no margin, and no `.pop .btn` sets a text colour (a menu item takes the colour of its intent: a danger item is red, the link of the dropdown is brand)
**Meet.** Use `NotificationItem` as it is; never colour `.pop .btn` text by hand.
**Check.** Look at the notification drawer in light and dark.
**Guarded in Praisindo by** a unit test.

### NV-13
**Rule.** Branding & Customization, Design System and Help Center are not in the sidebar or the bottom bar: they are in the menu of the user, under a divider after My preferences and Activity history and before Sign out (an Administrator has the three, the other roles Help Center); the routes and the access of the roles do not change (`PROFILE_NAV`, `profileNav`)
**Meet.** Put Branding and Design System in `PROFILE_NAV` (menu of the user, under a divider after My preferences, before Sign out); keep them out of `NAV`.
**Check.** Open the user menu: Branding and Design System are there, not in the sidebar or the bottom bar.
**Guarded in Praisindo by** a unit test.

### PP-05
**Rule.** My preferences has two more drawers, Stat view and KPI view (two link rows under Panel items, each opened with Back like the second drawer; no groups inside): the places of the stat cards (the choice of one card or separate cards first, then the list pages, the detail pages and other places) and of the KPI cards (the choice of one card or separate cards first, then the top of a page and inside a card), one Select for each with the looks of its card and an info icon with a short explanation, the fields 16px apart; the options of a look are the registry (WG-14). The choice is saved for the user in the preferences (`prefs.cards`); a stored choice that is not one of the looks of its place is the default; Reset returns every place to the default.
**Meet.** Keep `CARD_SLOTS`, `CARD_VIEWS`, `resolveCards` and `CardViewDrawer` of the starter (`app/providers/prefsModel.ts`, `app/shell/PrefsDrawer.tsx`); an application that adds a place adds it to `CARD_SLOTS` and `CARD_VIEWS` and to the i18n keys `prefs.cd.<slot>`.
**Check.** Open My preferences, Stat view: the one card or separate choice first, then one Select per place; change one, close and reload: the choice is kept.
**Guarded in Praisindo by** a unit test.

### PP-06
**Rule.** The Preferences drawer keeps its fields (Font size, Table size) apart from its links (Panel items, Number cards): the links are a list of their own (`.prefs-links`) under the fields, the rows touch each other with no gap between them.
**Meet.** Put the link rows of the Preferences drawer in one `<div className="prefs-links">` after the fields.
**Check.** Open My Preferences: the fields, then one block of link rows with only their 1px lines between them.
**Guarded in Praisindo by** a unit test.

### PP-07
**Rule.** The preferences belong to the person who is signed in: what one person sets in My Preferences is saved under their own key (`prefs.u.<email>`, every character that is not a letter or a digit as `_`) and another person on the same device never sees it; without a session the shared `prefs` are the base under the personal ones, and Reset clears only the personal ones. The brand stays the application's.
**Meet.** Read and write the preferences with `prefsKeyOf()` of the `PrefsProvider`; after a sign-in or a sign-out dispatch `window.dispatchEvent(new Event('kora-session'))` so the provider reads the preferences of the person.
**Check.** Sign in as A, change the font size, sign out, sign in as B: B has the default; sign in as A again: the choice is back.
**Guarded in Praisindo by** a unit test.

### PP-08
**Rule.** The drawer of the preferences is titled like the button that opens it, My preferences; one name for one thing.
**Meet.** Use the same i18n text for the button and for the title of the drawer.
**Check.** Open the user menu and press My preferences: the drawer is titled My preferences.
**Guarded in Praisindo by** a unit test.

### PP-09
**Rule.** The toolbar of a desktop (PP-03) comes back with a small scroll up: it goes up and out of the window while the person scrolls down (after 8px in that direction, past the top of the page) and returns to the top of the window as soon as they scroll up by 12px, wherever they are on the page. At the top of the page it is in its own place. It sits under the sidebar (`z-index:45`, the sidebar is 46) so the edge toggle of the sidebar is never covered.
**Meet.** `.topbar.tool{position:sticky;top:0;z-index:45}`, `data-pin="hide"` / `"show"` set by the shell on `window` scroll (the starters have it), a slide of `--dur-base` that stands still under `data-motion="off"`. Do not raise the z-index above 46.
**Check.** Put the theme in the toolbar, scroll down a long page: the toolbar leaves; scroll up a little: it comes back over the content; the Toggle sidebar button is fully visible all the time.
**Guarded in Praisindo by** a unit test and an e2e test.
