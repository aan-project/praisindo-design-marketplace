# Cards, Alert, Tooltip, Disclaimers, states, detail frame, names (Praisindo DS v2.127.0, skill v2.127.0)

The ids are those of the Praisindo owner rules register (general rules only; product-domain rules are not in the skill). Every rule is permanent: do not change, loosen or re-interpret it; a need for something else goes to "Rule proposals" in `docs/design-system/new-components.md`. Examples in brackets name pages of the Praisindo reference application; apply the rule to the equivalent page of your product.

## Pattern: Alert, helper text, Tooltip, Disclaimers

| Need | Use | Never |
|---|---|---|
| Something happened or is true now: an error, a failed save/load, stale or partial data, a denied permission, a status that blocks the action, validation after the user acted | `Alert` (intent danger / warning / info), rendered from state set by that event | an Alert on screen when the page or drawer first opens (CD-08) |
| A short permanent note under a title | helper text `<p className="mut">` | an info Alert |
| An explanation of a term or a field | `InfoTooltip text` (or `hint` on a field) | `title=`, `data-tip`, a CSS tip |
| A tooltip with a title or a docs link, or a custom trigger | `Tooltip variant="title|action"` | essential information only in a tooltip |
| Standing notes of a page (legal, data source, scope) | ONE `Disclaimers` card, last block of the page | notes between the page head and the content |
| A short confirmation after an action | `useToast()` | a success Alert that stays |

## Pattern: states of a data view

Every list, table, chart and detail that loads data has the three states: `LoadingState` (while loading), `ErrorState` with `RetryButton` in `cta` (failure; the text says what failed and what to do), `EmptyState` (no data; with the primary action in `cta` when the user can create one). A search or filter with no result is an `EmptyState` with a "Clear filters" button.

## Pattern: a detail page

Example page: `features/examples/DetailPage.tsx` (React) and `pages/examples/detail.html` (HTML). Route with `layout: 'detail'` (the sidebar collapses, SB-30); `PageHeader` with breadcrumb and `onBack` (NV-01, BK-01); `DetailLayout panel={<DetailPanel>…</DetailPanel>}` with `DetailSummary` and `Tabs` in the main column; label / value pairs as `DR`; extra details in a `Drawer`; the side panel scrolls with the page (CU-02).

## Rules

### CD-01
**Rule.** Cards, KPI and similar containers use the card radius token (8px); the token has one edit point
**Meet.** `Card`, `KPI`, `StatCards` already use `var(--r-card)`; project CSS too.
**Check.** Audit (radius literal check).
**Guarded in Praisindo by** a unit test.

### CD-02
**Rule.** One card is one box: no card inside a card (CSS rule and no nested .card in the source markup)
**Meet.** Inside a `Card` use `GroupTitle`, `Section` or a divider, never another `Card`.
**Check.** Audit (card in card check).
**Guarded in Praisindo by** a unit test.

### CD-03
**Rule.** Alerts are a card on the card surface with a soft tint (the intent's subtle colour) fading from the left, a 1px subtle border and NO shadow, an icon in a rounded surface tile in the intent colour, an optional bold title above a muted description, an optional action button on the right and an optional close button; toasts have no border and a danger variant
**Meet.** `<Alert intent title text action onClose />`.
**Check.** Look at an Alert in light and dark.
**Guarded in Praisindo by** a unit test.

### CD-04
**Rule.** Text hierarchy: three stacked lines go neutral default, subtle-4, subtle-3 (.t3 and the listed components)
**Meet.** Three lines: default, `.mut` (subtle-4), `.t3` (subtle-3).
**Check.** Look at list rows.
**Guarded in Praisindo by** a unit test.

### CD-05
**Rule.** Group titles (captions) are small, uppercase, weight 500, neutral subtle-3; icon sizes are 14 / 18 / 20px by context
**Meet.** `<GroupTitle text />`; icons 14 / 18 / 20px by context.
**Check.** Look at captions.
**Guarded in Praisindo by** a unit test.

### CD-06
**Rule.** Detail rows: the label is xs-sized subtle-3 and the value below it sm-sized subtle-4 (DR component)
**Meet.** `<DetailRow label>value</DetailRow>` for every label/value pair.
**Check.** Look at the details card.
**Guarded in Praisindo by** a unit test.

### CD-07
**Rule.** The Tooltip is a dark bubble with a tail, left-aligned text, at most 280px wide; there are no CSS-only tips (.hint / data-tip)
**Meet.** `<Tooltip>` / `<InfoTooltip text />` only; no `data-tip`, no `title` for help.
**Check.** Audit (home-made tooltip check).
**Guarded in Praisindo by** a unit test.

### CD-08
**Rule.** Alerts only for real conditions: a page or drawer never opens with an Alert on screen (enforced by tests/e2e/noInitialAlerts.spec.ts); an Alert that shows a rejection with its reason, because the record was rejected, is a real condition; permanent notes are helper text, EXCEPT the information note of a page or drawer that is a box of its own: it is an `Alert` of intent `info`, on screen from the start (owner decision 2026-11-11; warning and danger stay real conditions only, CD-21)
**Meet.** Render an `Alert` only from state set by an event (error, stale data, denied, blocking status, validation after submit); a standing note is `<p className="mut">`, `InfoTooltip` or `Disclaimers`.
**Check.** Audit (CD-08 check: Alert rendered unconditionally); open every page and drawer fresh.
**Guarded in Praisindo by** a unit test.

### CD-09
**Rule.** A card has a header (title + up to two actions) and a body separated by a divider; the footer is for actions, except on a form page, where the buttons of the form are the card of actions without a header in the right column and never the footer of a card (DK-17, DK-24, DK-27)
**Meet.** `<Card title actions body footer />`: at most two header actions.
**Check.** Look at the card header.
**Guarded in Praisindo by** a unit test.

### CD-10
**Rule.** A Tooltip opens on hover and on focus, closes with Escape, and its bubble is described by role=tooltip
**Meet.** Use `Tooltip`; nothing to wire.
**Check.** Hover, Tab, Escape.
**Guarded in Praisindo by** a unit test.

### CD-11
**Rule.** The info trigger is a fixed 16px icon box that cannot stretch (it once printed an 11-letter icon name and was 144px wide)
**Meet.** Use `InfoTooltip`; never size its trigger.
**Check.** Measure the trigger: 16px.
**Guarded in Praisindo by** a unit test.

### CD-12
**Rule.** Card-like containers (preview box `.bp`, `.bp-card`, dropzone `.fdz`, drawer header `.drh`, status drawer `.drs`, ChangeNotice `.cn`, sign-in panel `.lgs`, nav demo `.dsnavw .nav`) use `var(--r-card)` (8px), never a 12px literal. Not cards, so unchanged: badge, avatar tile `.odav`, category pill
**Meet.** Card-like boxes in project CSS use `var(--r-card)`.
**Check.** Audit (radius literal check).
**Guarded in Praisindo by** a unit test.

### CD-15
**Rule.** A list row `.li` has no side padding of its own (padding top and bottom only, 12px); the container gives the inset: a flush card body that holds list rows (`.cb.flush:has(>.li)`) has 16px side padding, a drawer body keeps its own; a standalone bordered row sets its own side padding where it is the container; a bordered preview box `.pv` that holds list rows has 12px side padding (found 2026-10-27: the Reschedule, Dismiss and Assign drawers, keputusan owner 2026-10-26 to fix the broken drawers) (keputusan owner 2026-10-24, was padding 12px 16px)
**Meet.** `.li` rows in a `Card flush` body; do not pad `.li` sideways.
**Check.** Look at a list card.
**Guarded in Praisindo by** a unit test.

### IC-01
**Rule.** The trailing chevron icon of a list row (chevron_right, expand_more and the like in `.li`, `.rem`, `.alog-chev`) uses `var(--color-text-tertiary)`, from one shared CSS rule (`.li>.ic, .rem>.ic, .alog-chev>.ic`), not per component. Leading tile icons (`.hp-ic`, `IconTile`) keep their intent colour, and an icon inside a button keeps the button colour
**Meet.** Use `.li` and its trailing `<Icon />`; never colour the chevron by hand.
**Check.** Look at list rows in dark mode.
**Guarded in Praisindo by** a unit test.

### CD-20
**Rule.** A block that is drawn inside a card, `.card .card` and `.card .pv`, uses the card radius token (`var(--r-card)`, 8px), not a 4px literal
**Meet.** Use `var(--r-card)` for blocks inside a card.
**Check.** Audit (radius literal check).
**Guarded in Praisindo by** a unit test.

### CU-02
**Rule.** The side panels of Customer 360 and Opportunity detail scroll with the page: no sticky, no scroll of their own
**Meet.** `DetailLayout panel={...}`: the side panel scrolls with the page; no sticky.
**Check.** Scroll a detail page.
**Guarded in Praisindo by** a unit test.

### OP-02
**Rule.** The Decision bar is a sticky bottom layer (bottom 16px) that sits above the page and, on a phone, above the bottom navigation
**Meet.** A sticky decision bar of a detail page: bottom 16px, above the bottom navigation on a phone (class `.odbar` of stylesheet 19).
**Check.** Scroll the detail page at 1440 and 390.
**Guarded in Praisindo by** a unit test.

### DT-05
**Rule.** `DetailLayout`, `DetailPanel` and `DetailSummary` (src/design-system/components/DetailLayout.tsx) are the one implementation of the detail frame: Opportunity detail and Signal rule detail both use them, with the CSS of `19-opportunity-detail-customer-panel-left-o.css`; a detail page does not write its own two-column CSS. They have a live example in the Page layouts section of the Design page
**Meet.** Every detail page uses `DetailLayout`, `DetailPanel`, `DetailSummary`.
**Check.** grep detail pages for a home-made two-column frame.
**Guarded in Praisindo by** a unit test.

### DT-07
**Rule.** The "Proposal" card of the Proposal tab shows where the work version is with the `Wizard` (variant `status`, `readOnly`: the steps are not buttons) Draft, Proposed, Active, then its rows (maker, version, business objective, rationale, last decision) under a divider; a rejected proposal marks its step as an error. The old list of radio icons (`.sbstep`) and the helper sentence for draft and proposed are gone (the stepper says it); the rejected Alert stays (a real condition, DT-03)
**Meet.** Show the stage of a record with `<Wizard variant="status" readOnly />` above its rows.
**Check.** Look at the card.
**Guarded in Praisindo by** a unit test.

### PC-02
**Rule.** The profile card is a non-modal popover (`role="dialog"`, `aria-modal="false"`, labelled by the name) opened by a trigger button (`aria-haspopup="dialog"`, `aria-expanded`): on hover (mouse) after a short delay and on keyboard focus; Enter or Space toggles it; it stays open while the pointer moves onto the card; Escape closes it and keeps focus on the trigger; blur closes it; on touch (390) a tap opens it and a tap outside or Escape closes it; one card is open at a time; focus is never trapped (the card has no focusable content)
**Meet.** `<ProfileCard />` trigger for a person; never a home-made popover.
**Check.** Hover, Tab, Enter, Escape on a name.
**Guarded in Praisindo by** a browser test.

### PC-03
**Rule.** The profile card is placed next to its trigger (below by default, above when there is no room, shifted to stay inside the viewport) in a layer above the page (not clipped by a scroll container); at most 260px wide (owner revision 2026-10-25: was 320px) (owner revision 2026-10-25: was 280px, the card is larger); no overflow-x at 390
**Meet.** Use `ProfileCard` (overlay host placement).
**Check.** Open a card near the bottom and the right edge.
**Guarded in Praisindo by** a browser test.

### PC-04
**Rule.** Layout of the profile card (owner reference image, revision 3), in tokens: a flat card (1px border, `--r-card`, no shadow, 260px wide, padding 16px) with the avatar centred on top (64px, initials; the system has an icon), the name below it (weight 600, centred), the subtitle (position of an internal user, segment of a customer) in muted text, then rows with the label on the left and the value on the right (label muted, value weight 500, status as the one badge (BD-01; keputusan owner 2026-10-26, it was a medium status dot badge)), and, for a customer, a full-width soft button (`b-soft`, neutral) "View Detail" at the bottom. Two variants: internal user and customer
**Meet.** Use `ProfileCardBody`; do not restyle it.
**Check.** Look at the card in light and dark.
**Guarded in Praisindo by** a unit test.

### UN-01
**Rule.** Wherever the name of a user (a staff member of the user directory: RM, supervisor, marketing, admin) is shown as a value or a label, it is the trigger of the profile card (`UserName` / `ProfileCard`, the internal-user card, PC-04): it can be hovered, focused with the keyboard and tapped, and it never has a text decoration (no underline, in any state; hover changes the colour only). It inherits the font of the text around it, so the screen looks the same at rest. Not covered: a name inside another interactive control (a row that is one button, a link, a menu item, an option or input), chart labels in SVG, toast and alert sentences, exported files, and the signed-in user's own name in the avatar menu. Customer names are not user names. A new place that shows a user name uses `UserName`; `tests/e2e/rules/usernames.spec.ts` scans every route of every role and fails on a user name that is neither a trigger nor in the list above
**Meet.** Every person name shown as a value is the `ProfileCard` trigger.
**Check.** Hover names in tables, detail rows and logs.
**Guarded in Praisindo by** a browser test.

### UN-02
**Rule.** The same for the name of a customer or of a company (a corporate customer; every name or label of a person or an organisation shows its quick view on hover, owner 2026-11-18): wherever a customer name is shown as a value or a label it is a `CustomerName` (the trigger of the customer card, PC-05): hover, focus, tap, no text decoration, the font of the text around it. Not covered: a customer name inside another interactive control (a link or button to the customer, a row that is one button, an option), chart labels, system sentences, exported files, and the page title of the customer itself. `tests/e2e/rules/usernames.spec.ts` scans the routes for it
**Meet.** Every customer-like entity name shown as a value is the trigger of its card (same pattern as `ProfileCard`).
**Check.** Hover names.
**Guarded in Praisindo by** a browser test.

### UN-03
**Rule.** The name or label of a PRODUCT (a catalogue item, or the thing the product sells or manages) shows its quick view when the cursor is on it, as the name of a user (UN-01) and of a customer (UN-02) do, with only the most important facts. The card is the `ProfileCard` with `logo` (the image of the product or of its issuer instead of the initials, the texts say product): the name, the category under it, three or four rows (the code, the issuer or owner, one more fact such as risk or stock) and one link to the detail; the trigger is `ProductName` (HTML: `productName()`), a name from the product's own catalogue (`profile.config`): hover after a short delay, keyboard focus and tap, no text decoration, the font of the text around it. Not covered: a product name inside another interactive control (a link, a menu item, an option), chart labels, exported files, the title of the product's own detail page, and a category label that is not a catalogue item. A name that is not in the catalogue stays plain text.
**Meet.** Never print a product name from a record as plain text: use `ProductName` (`profileProduct`, `productRows` in `profile.config`); give the card only the facts that matter.
**Check.** Hover a product name in a table and in a sentence: the card opens with the logo, name, category, code, issuer and one fact, and View product opens the detail.
**Guarded in Praisindo by** a unit test.

### OR-01
**Rule.** Lists of events come NEWEST FIRST: the Activity log of a rule (the day, then the reverse of the order the events were written in), the Activity log of the application (time, then id, descending) and the notifications of every role (the date; a stable order inside a day). A new list of events follows the same order
**Meet.** Sort every event list by time descending, then id descending, before rendering.
**Check.** Look at the first rows: newest.
**Guarded in Praisindo by** a unit test.

### DC-01
**Rule.** The standing notes of a page (what was a `p.mut` between the page head and the content: Signal rules, Source systems of Data & Integration, Users & Roles, Branding) are in ONE card titled Disclaimers (`Disclaimers`, `src/design-system/components/Card.tsx`: one paragraph per note, nothing drawn without a note) at the very bottom of the page; the Monitoring tab of Signal rules adds its own note while it is open. Alerts (real conditions) stay on top; the subtitle of the page head and the descriptions of the sections of a page (`JumpHead`) do not move. A page that gets a standing note uses this card, not a `p.mut`
**Meet.** `<Disclaimers items={[t('...'), ...]} />` as the last block of the page; nothing when there is no note.
**Check.** Look at the page bottom.
**Guarded in Praisindo by** a unit test.

### ES-01
**Rule.** The button of an empty state and of an error state (`ErrorState`, `ErrorState`, `StateErr`) is 16px under its description whatever the size of the state (sm, md, lg) or the gap of the card body (`--card-gap`): inside the state (`cta` prop) or, in older markup, in the element right after it; the space below the button is the bottom padding the state had. Before: the state's own bottom padding (32 to 48px) plus the body gap (12px) left 60px
**Meet.** `<EmptyState cta={...} />` / `<ErrorState cta={<RetryButton />} />`: pass the button through `cta`.
**Check.** Measure the gap under the description: 16px.
**Guarded in Praisindo by** a browser test.

### DR-08
**Rule.** (renamed DS 2.88, DL-03; it was `DR` variant `split`, `.dr.dr-s`, group `.dr-g`) The DetailList layout `rows` (`.dl-rows` > `.dl-row`): the label on the left (subtle), the value on the right (500), a line under each row except the last of its group; a group of them has a `GroupTitle` title without a line under it (owner decision 2026-11-09, third revision); Key information of a product detail shows one group at a time as tabs, so its group has no title. Key information of a product detail is built with it
**Meet.** `<DetailList layout="rows"><GroupTitle text /><DetailItem label>value</DetailItem>…</DetailList>` for key information blocks (HTML: `detailList(items, 'rows')`).
**Check.** Look at a Key information card: label left, value right, a line under each row except the last of a group.
**Guarded in Praisindo by** a unit test.

### DL-01
**Rule.** A list of label and value pairs is a DetailList with one of two layouts: `grid` (the label above the value, the pairs side by side; one column in a narrow panel) for a wide card or panel, and `rows` (the label on the left, the value on the right, a line under each row but the last) for a narrow card or panel. A wide space never gets the rows and a narrow one never gets the grid
**Meet.** `<DetailList layout="grid|rows">` with `<DetailItem label>value</DetailItem>`; in the HTML starter `detailList(items, layout)` and `detailItem(label, value, layout)` from `js/ui.js`. Pick the layout by the space the list sits in.
**Check.** Open a wide card and a narrow panel with a list of pairs: the wide one shows the grid, the narrow one the rows with a line under each row but the last.
**Guarded in Praisindo by** a unit test.

### DL-02
**Rule.** `layout="auto"` chooses by the width of the list itself, not of the window: rows below 480px, grid from 480px
**Meet.** `<DetailList layout="auto">` (React, a ResizeObserver on the list); in the HTML starter `detailList(items, 'auto')` and `watchDetailLists(root)` after it is in the page.
**Check.** Put the same list in a 720px and a 320px box: grid in the first, rows in the second.
**Guarded in Praisindo by** a unit test.

### DL-03
**Rule.** Names: `.dl-grid` and `.dl-item` (were `.c3fl` and `.c3f`), `.dl-rows` and `.dl-row` (were `.dr-g` and `.dr.dr-s`); the component is `DetailList` with `DetailItem` (was `C3Field`, and `DetailRow split`). The old names do not exist any more; `DetailRow` is only the plain row of a drawer (label in a 140px column)
**Meet.** Use only the new names; `references/renames.json` and `scripts/migrate-names.mjs` convert a project that still has the old ones.
**Check.** No `c3f`, `c3fl`, `dr-g` or `dr-s` class and no `C3Field` or `DetailRow split` in the source.
**Guarded in Praisindo by** a unit test.

### WG-01
**Rule.** In every widget, KPI and `Delta` a number that goes up is green (success) and one that goes down is red (danger), 0 is neutral, whatever the metric; the old `good` argument no longer decides the colour
**Meet.** Pass the number and its delta to the widget or KPI; do not pick the colour (up is green, down red, 0 neutral).
**Check.** A rising delta is green and a falling one red, whatever the metric.
**Guarded in Praisindo by** a unit test.

### WG-02
**Rule.** The header of every card (`.ch`) has 16px padding on all sides
**Meet.** Use `Card`; do not set the padding of a card header.
**Check.** Measure `.ch`: 16px on all sides.
**Guarded in Praisindo by** a browser test.

### HC-07
**Rule.** The text of an article is shown with the design system component `ArticleBody` (one reading column, tokens only); the front page and the topic and article pages use `Card`, `Input`, `LinkButton` and `EmptyState`, with no class that does the job of a component
**Meet.** Show the text of a help article with `ArticleBody` inside `Card`; no class of your own for headings, lists or tables.
**Check.** Open an article: one reading column.
**Guarded in Praisindo by** a unit test.

### HC-10
**Rule.** The text of an article (`.abd`, `ArticleBody`) has no `max-width` of its own: it fills the column of the page next to the contents list
**Meet.** Show an article with `ArticleBody` and do not give it a `max-width`; the page gives the column.
**Check.** Open an article: the text fills the column next to the contents list.
**Guarded in Praisindo by** a unit test.

### DL-04
**Rule.** `.dl-grid` has no padding of its own: the card body (16px) or the panel that holds the list gives it, so a list in a card is not padded twice; only the entity panel pads its list (`.cpanel>.dl-grid`, 16px).
**Meet.** Put a `DetailList` in a card body or a panel; never add padding to the list.
**Check.** A DetailList in a card has 16px around it, not 32px.
**Guarded in Praisindo by** a unit test.

### WG-04
**Rule.** The cards that show one number, the KPI card and the stat card (and their variants: icon, ring, solid, compact, with a sparkline or with a footer band), are components and not widgets: on the Design page each has a page of its own, Stat cards and KPI cards (two pages), in Components. A widget is a card that shows data as a chart or a share (line, area, bars, donut, gauge, progress list, ring list) and stays on the page Widgets.
**Meet.** Group the number cards apart from the chart widgets in the Design page and in the code; do not call a number card a widget.
**Check.** Open the Design page: Stat and KPI cards lists the KPI, stat, solid and compact cards; Widgets lists only charts and shares.
**Guarded in Praisindo by** a unit test.

### WG-05
**Rule.** The names of the number cards follow their family and never start with `W` (a `W` name is a widget): the KPI family is `KPI`, `KpiCompact` and `KpiTrend`, the stat family is `StatCards`, `StatIcon`, `StatRing` and `StatSolid`; there is no separate group of highlighted or compact cards, each card is in its family.
**Meet.** Name a new number card `Kpi...` or `Stat...`; use `W...` only for a chart widget.
**Check.** Search the code for number cards starting with `W`: none.
**Guarded in Praisindo by** a unit test.

### WG-06
**Rule.** When a row holds more than one stat card, no two cards have the same colour: a card keeps the intent it was given when it is the only one with it, and a card that repeats an intent takes the next free colour of the palette (brand, info, success, warning, purple, cyan, danger, secondary, neutral).
**Meet.** Use `StatCards` of the system (it does it with `statIntents`); do not give the same colour to the cards of a row by hand.
**Check.** Open a list page with stat cards: every card of the row has its own colour.
**Guarded in Praisindo by** a unit test.

### WG-07
**Rule.** A number card has looks (variants) and its place decides which one is shown: the stat card has Ring (default, `StatCards`), Icon (`StatIcon`), Percent (`StatRing`) and Solid (`StatSolid`); the KPI card has Card (default, `KPI`), Compact (`KpiCompact`) and Trend (`KpiTrend`): every number card of the system is a choice. The place is the `slot` prop (stat cards: `statList` a list page, `statDetail` a detail page, `statOther` elsewhere; KPI cards: `kpiPage` the top of a page, `kpiCard` inside a card or a drawer) and the look of a place is read from My Preferences (PP-05); the `variant` prop sets a look that does not depend on the place. Every look keeps the data, the filter of a stat card (TB-31) and the colours (WG-06).
**Meet.** Give every number card a `slot`; never style a look by hand; use `variant` only on the Design page.
**Check.** Set the stat cards of the list pages to Icon in My Preferences: the stat cards of every list page show the icon look and the detail pages keep the ring.
**Guarded in Praisindo by** a unit test.

### WG-08
**Rule.** A number that goes up or means a gain is green and a number that goes down or means a loss is red, wherever it is written and not only in a `Delta` chip: use the classes `.tnd-up` and `.tnd-dn` (`trendCls(n)`) on the return of a product, the difference of two counts and every signed number; zero and a missing number have no colour.
**Meet.** Wrap a signed number in `<span className={trendCls(n)}>`; never colour it by hand.
**Check.** Open a table with a return column: positive returns are green, negative returns are red, zero is plain.
**Guarded in Praisindo by** a unit test.

### WG-09
**Rule.** The chart of a number that goes up or means a gain is brand and the chart of a number that goes down or means a loss is red (danger): the sparkline of the KPI card, `KpiCompact`, `WArea`, `WLine`, the bars of `WBars` take their colour from the change (`chartIntentOfDelta(delta, fallback)`); `KpiTrend` is the exception: its line follows its footer band, green when the number goes up and red when it goes down, and the line chart of a price from its first and last point; a chart with no change given keeps its own colour and one whose change is zero is neutral. The number itself stays green or red (WG-08).
**Meet.** Give the card its `delta`; use `chartIntentOfDelta` for a chart of your own.
**Check.** A KPI with a sparkline and a delta of -6: the line is red; with +6: brand.
**Guarded in Praisindo by** a unit test.

### WG-10
**Rule.** The number cards can be one card instead of separate cards, by a choice of the user in My Preferences, Number cards (`statGroup`, `kpiGroup`: Separate cards or One card): `html[data-sg]` and `html[data-kg]` make a row `.stats` or `.kpis` one card with 1px dividers.
**Meet.** Keep the two places in `CARD_SLOTS`, set `data-sg` and `data-kg` on the page from the preferences and keep the CSS of `42-widgets.css`.
**Check.** Choose One card for the stat cards: a list page shows its stat cards inside one bordered box with dividers.
**Guarded in Praisindo by** a unit test.

### WG-11
**Rule.** The KPI and stat cards do not use the class `wg-sml` (`KpiCompact` writes its value at the normal widget size); the stat card has the look Soft (`StatSoft`, `.wg-soft`: the soft colour of its intent, the icon in a white circle like Solid) beside Ring, Icon, Percent and Solid.
**Meet.** Do not add `wg-sml` to a number card; offer `soft` in the looks of the stat cards.
**Check.** Choose Soft for the stat cards: each card has the soft colour of its intent and no fill.
**Guarded in Praisindo by** a unit test.

### WG-12
**Rule.** The border of a number card that is a filter and is active (pressed) is soft and follows the colour of the card: 40% of the intent colour over the neutral border, with the soft colour of the intent as its background; the solid look has a soft ring of the intent colour instead of an outline. Every card that is a filter carries its intent class on the card itself in every look, so that these colours exist.
**Meet.** Use the pressed rules of `.stat` and `.wg.wg-act` of the stylesheets; do not draw a strong border on an active card.
**Check.** Press a stat card of a list page: its border is a soft tint of its colour, not a strong line.
**Guarded in Praisindo by** a unit test.

### WG-13
**Rule.** The Total card of a row of stat cards (the key `all`, `c:all` and the like: the card that stands for no filter) is never shown active: with no status filter set no card of the row is active, and pressing the Total card clears the filter. It looks like every card that is not active, on every list page and in every look.
**Meet.** Use `StatCards` of the system (it ignores `on` for a key `all` or `*:all`); give the Total card the key `all`.
**Check.** Open a list page with no filter: no stat card is highlighted; press Active: only Active is highlighted; press Total: none is.
**Guarded in Praisindo by** a unit test.

### WG-14
**Rule.** The looks of the number cards are written once, in a registry (`STAT_LOOKS` and `KPI_LOOKS` in `design-system/tokens/cardLooks.ts`: id, the name in English and in Indonesian, the component that draws it). A look that is added to the registry is an option of Stat view or KPI view in My preferences by itself and a stored choice is checked against it; the component must draw it and the Design page must show it with its component.
**Meet.** Add a new look to the registry, draw it in `StatCards` or `KPI` and give it a demo on the Design page; never list the looks by hand in the preferences.
**Check.** Add a look to `STAT_LOOKS`: it is in the Stat view drawer without any other change, and the unit test fails until the component draws it.
**Guarded in Praisindo by** a unit test.
