# Triage of the owner rules register (rebuilt 2026-11-17)

The working file of the skill sync (`node scripts/rules-coverage.mjs --triage triage-register.md --register docs/design-system/rules-register.md`). It was rebuilt from the register and `references/rules-general.json` after the file was overwritten by mistake: U = a general rule of the skill, D = not general (domain or exception of Kora). Earlier notes on the X exceptions were lost.

| id | section | summary | class | in the skill |
|---|---|---|---|---|
| SK-04 | Konflik (perlu keputusan owner) | DS-04, DS-13 and DS-14 are not written in the skill: they are `digantikan oleh` DS-19 and DS-22 in this register, so in the skill triage they are X (l | D | tidak |
| SK-05 | Konflik (perlu keputusan owner) | The starters ship the Activity history (GN-01) with four generic categories (create, update, delete, auth), shown with a category filter and a search  | D | tidak |
| SK-06 | Konflik (perlu keputusan owner) | The form example of the starters records only `create` with `logActivity`; the list example records `update` (edit, duplicate, order) and `delete`; th | D | tidak |
| SK-07 | Konflik (perlu keputusan owner) | The starters ship three notification categories (Work, Data, System) as removable examples built on the supplier example pages, so that the tabs of th | D | tidak |
| RLG-05 | Konflik (perlu keputusan owner) | The column Requested by of the Rules log is read from the source column of the register: a source that says `keputusan agen` or `decision made by the  | D | tidak |
| RLG-06 | Konflik (perlu keputusan owner) | The Object of a rule in the Rules log is the name of its area by the prefix of its id, from `tools/rules_prefix_names.json` (English and Indonesian);  | D | tidak |
| RLG-07 | Konflik (perlu keputusan owner) | The column For of the Rules log (DS, Skill, or both) is read from `docs/design-system/rules-audience.json` (a default, the prefixes, the exceptions by | D | tidak |
| RLG-08 | Konflik (perlu keputusan owner) | The data of the Rules log is generated from the register by `tools/gen_rules_log.mjs` (run by `npm run docs:ds`) into `src/features/design/rulesLog.ge | D | tidak |
| AV-01 | Shell / Sidebar | Order: header with the three stats, My preferences, Activity history, divider, Sign out, divider, role switcher | D | tidak |
| AV-02 | Shell / Sidebar | The header (avatar, name, email, three stats) is a static block: no button, role, tabindex, chevron or handler, and the header is never the entry to the profile: My profile is a menu item of its own (AV-06) | U | ya |
| AV-03 | Shell / Sidebar | The menu buttons have no min-height override and the stat cards use the card radius token | U | ya |
| AV-04 | Shell / Sidebar | Sign out is the danger item; My preferences opens the preferences drawer and Activity history goes to the log | U | ya |
| AV-05 | Shell / Sidebar | The avatar menu: stat cards use the card radius (8px), buttons are at least 36px high, the order is stats / preferences / history / sign out / role sw | D | tidak |
| SB-01 | Shell / Sidebar | On a desktop (1100px and wider) there is no topbar: no header.hd; the global actions (language, theme, quick access) and the user button are in the si | U | ya |
| SB-02 | Shell / Sidebar | The sidebar is 232px expanded and 68px collapsed | U | ya |
| SB-03 | Shell / Sidebar | The sidebar is exactly one screen high and sticky; only the menu list scrolls | U | ya |
| SB-04 | Shell / Sidebar | A list, overview or admin list page (not a detail-layout page, see SB-30) is expanded by default (Auto) and follows the stored preference (Auto, Expan | U | ya |
| SB-05 | Shell / Sidebar | A detail-layout page collapses the sidebar by default, whatever the preference, also Expanded (opportunity detail, Customer 360, Signal rule detail, S | U | ya |
| SB-06 | Shell / Sidebar | Going back to a list page restores the sidebar according to the stored preference; a manual override on the detail page is gone | U | ya |
| SB-07 | Shell / Sidebar | A window narrower than 1100px collapses the sidebar automatically | U | ya |
| SB-08 | Shell / Sidebar | A collapsed sidebar expands on hover as an overlay: the content does not shift | U | ya |
| SB-09 | Shell / Sidebar | The round collapse button is visible, on top, clickable and keyboard operable | U | ya |
| SB-10 | Shell / Sidebar | (dihapus, keputusan owner 2026-10-25) The tip card shows title, text and action when expanded and is hidden when collapsed. The tip card and the small | D | tidak |
| SB-11 | Shell / Sidebar | Level-1 items are 32px (padding 0 8px, gap 12px), level-2 also 32px with padding-left 40px (level 2 differs from level 1 by indent only), the sub-menu | U | ya |
| SB-12 | Shell / Sidebar | Group titles (.ngt) are uppercase, letter-spacing .08em, weight 500, neutral subtle-3 (caption) | U | ya |
| SB-13 | Shell / Sidebar | No divider between groups when expanded (12px gap); the divider shows when collapsed | U | ya |
| SB-14 | Shell / Sidebar | The demo role switcher is in the avatar menu (four roles: Administrator, RM, Supervisor, Marketing; it was six until 2026-10-30) and nowhere else in t | D | tidak |
| SB-15 | Shell / Sidebar | Menu items are grouped under caption headings, Home stands alone, and so does Help Center, the last item of every role (HC-01, keputusan owner 2026-11 | U | ya |
| SB-16 | Shell / Sidebar | Menu order: Marketing has its workspace right after Home; Admin reads Users & Roles, Rules, Data & Integration, then Problem reports (IR-10), Branding | D | tidak |
| SB-18 | Shell / Sidebar | The collapsed sidebar shows the logo mark and hides labels and group titles (the tip card and its lightbulb link are gone: SB-31; owner revision 2026- | U | ya |
| SB-19 | Shell / Sidebar | The sidebar width is 232px expanded and 68px collapsed, and a collapsed sidebar expands over the content (margin-right keeps the content in place) | U | ya |
| SB-20 | Shell / Sidebar | The sidebar is exactly one screen high and the page does not scroll because of it | U | ya |
| SB-21 | Shell / Sidebar | No divider between menu groups when expanded; a divider when collapsed | U | ya |
| SB-22 | Shell / Sidebar | Menu item heights: level 1 and level 2 are 32px (level 2 has padding-left 40px); the count of a menu item is a static Chip, 20px high (keputusan owner | U | ya |
| SB-23 | Shell / Sidebar | The count on a menu item is a static Chip (solid brand since CH-08: it asks for attention), 20px high, 16px in the 68px rail and in the bottom bar whe | U | ya |
| SB-24 | Shell / Sidebar | On a phone the sidebar is an off-canvas panel (fixed, translated out of view, width 280px) opened from More | U | ya |
| SB-29 | Shell / Sidebar | (dihapus, keputusan owner 2026-10-25) Tip card on hover-expand: when a collapsed sidebar widens on hover or focus, the tip card (title, text, action)  | D | tidak |
| SB-25 | Shell / Sidebar | Sidebar "collapsed by default, expands on hover" (judul CSS 11, komentar prototipe) | D | tidak |
| SB-26 | Shell / Sidebar | Topbar dengan aksi global (prototipe shellView) | D | tidak |
| SB-27 | Shell / Sidebar | Ukuran sidebar 248px / item 38px (prototipe .nvt 38px, 1.48) | D | tidak |
| SB-28 | Shell / Sidebar | (amended 2026-11-12, DS 2.72: My Preferences has NO Sidebar control any more, the default is automatic by the rules; only the edge button writes the c | U | ya |
| SB-30 | Shell / Sidebar | Detail-layout pages collapse the sidebar (68px) on entry whatever the preference (Auto, Expanded, Collapsed); hover / keyboard focus widens it tempora | U | ya |
| SB-31 | Shell / Sidebar | The sidebar has no tip card (`.tip`, with the title, text and action of the role) and, collapsed, no small lightbulb link (`.tipi`): the sidebar was t | U | ya |
| SB-33 | Shell / Sidebar | Below 1100px (tablet 641 to 1099px with the 68px rail, and phone up to 640px with the bottom bar) a topbar (`header.topbar`, 56px, sticky, on the page | U | ya |
| SB-35 | Shell / Sidebar | The sidebar example of the Design page is built like the real sidebar (`SideNav` in the shell): its labels go through `midText` (SB-34), a menu item c | U | ya |
| SB-34 | Shell / Sidebar | A label of the sidebar (level 1, 2 and 3) is on one line: when it does not fit it is cut in the middle with an ellipsis and its last word stays visibl | U | ya |
| NV-01 | Navigasi | The back icon / breadcrumb trail with a back link appears only on detail pages and on the add / edit form pages (DK-01); never on a list, overview or  | U | ya |
| NV-02 | Navigasi | The page header is a small breadcrumb above the title; nothing breadcrumb-like is in a header | U | ya |
| NV-03 | Navigasi | Every page title has a short description (the page head renders h1 and a .sub line) | U | ya |
| NV-04 | Navigasi | A new page opens at the top; Back returns to the previous scroll position | U | ya |
| NV-09 | Navigasi | One short page transition only (slide / fade); the page veil is for sign-in and sign-out | U | ya |
| NV-10 | Navigasi | Avatar di top bar membuka drawer profil; Profile ada di menu pengguna | D | tidak |
| NV-11 | Navigasi | The Customer 360 tab strip never clips a label: the strip scrolls horizontally (DS tab strip pattern) and the active tab scrolls into view, at 1440 an | U | ya |
| NV-12 | Navigasi | A tab strip that scrolls sideways opens at its start with the first tab fully visible when the first tab is active; the active tab is moved into view  | U | ya |
| NV-13 | Navigasi | Branding & Customization, Design System and Help Center are not in the sidebar or the bottom bar: they are in the menu of the user, under a divider af | U | ya |
| TB-01 | Tabel | The right (action) column is right-aligned and frozen, the first column is frozen, and neither has a border | U | ya |
| TB-02 | Tabel | The table has no vertical scroll of its own | U | ya |
| TB-03 | Tabel | Pagination: on the left the rows per page, a Select without a label with the suffix `/page` after the value (`10 /page`, the `suf` variant of FM-16),  | U | ya |
| TB-04 | Tabel | Table cells have padding and clamp to two lines | U | ya |
| TB-05 | Tabel | The table size (S / M / L) is a user preference that reaches the table classes (t-sm / t-md / t-lg) | U | ya |
| TB-06 | Tabel | The table toolbar has the search combo and Advanced Filter | U | ya |
| TB-07 | Tabel | The Customers toolbar has Show / hide columns as its right-most control | U | ya |
| TB-08 | Tabel | Selecting a row shows the bulk-action bar on its own row above the toolbar (the search and the buttons stay visible under it; since 2026-11-09 it no l | U | ya |
| TB-09 | Tabel | The action column holds at most three buttons (View, a second text action, the more icon) | U | ya |
| TB-10 | Tabel | A list page has summary stat cards above the table | U | ya |
| TB-11 | Tabel | Every main list table has Show / hide columns as its right-most toolbar control, reusing the same column drawer, and remembers the choice per table (` | U | ya |
| TB-12 | Tabel | Summary stat cards sit above every list table (same StatCard component). Exceptions: Opportunity (Kanban is the default view, spec 2026-10-21). Users  | U | ya |
| TB-13 | Tabel | A table header is never hidden under the frozen action column: every header of the Signal rules library reads fully next to the sticky column at 1440  | D | tidak |
| TB-14 | Tabel | The columns given to the table library match the table: a table without an action column passes `hasA: false` (Customer 360 Transactions has 8 columns | U | ya |
| TB-15 | Tabel | The header of a kit table is aligned: every title of a header cell has the same vertical centre (±1px) in its row and the sort icon is on the row of i | U | ya |
| TB-16 | Tabel | The Signal rules library is not squeezed (owner decision 2026-11-03, the Indonesian screenshot: Status "Revisi v3: Diusulkan" in three lines, "Kesiapa | D | tidak |
| TB-17 | Tabel | The Audit log and Users & Roles use the List pattern: stat cards, ONE card with the toolbar (SearchBar, Advanced filter with the count of active filte | U | ya |
| BT-01 | Tombol | Button types are fill, soft, outlined, transparent and link; the cancel / reset next to a primary is transparent | U | ya |
| BT-02 | Tombol | The execution button says "Apply", never "Done" (preferences, table and field panels), in English and Indonesian | U | ya |
| BT-03 | Tombol | Link buttons have no horizontal padding; menu items have a 12px gap | U | ya |
| BT-04 | Tombol | An icon-only button always has an aria-label (Button requires `aria` when there is no label) | U | ya |
| BT-05 | Tombol | Controls are always size M: the default size token is md and there is no density option | U | ya |
| BT-06 | Tombol | Buttons have the 8px control radius (`var(--r-ctl)` / `.btn{border-radius:8px}`); only the count `.cnt`, the chips (CH-01) and the segmented toggle (a | U | ya |
| BT-07 | Tombol | Tombol kecil dengan ikon varian lama (Fluent / Phosphor) | D | tidak |
| BT-08 | Tombol | Every button type has a disabled look of its own that keeps the shape of the type and ignores the hover: fill is a solid grey block (`--color-surface- | U | ya |
| BT-09 | Tombol | The exact disabled colours of BT-08 (fill `neutral-tertiary`, soft `neutral-secondary`, outlined `border-neutral-subtle`, transparent and link without | U | ya |
| BT-10 | Tombol | The buttons of a choice group (`.seg`, for example the channel of Take action and the format of Export) are as wide as their label: no button grows to | U | ya |
| TG-01 | Tombol | The SegmentedControl (`.sgt`) looks like the language toggle (`.lgt`): a pill track with 4px padding, the secondary surface and a 1px subtle border; o | U | ya |
| BG-01 | Badge / Status | A badge is soft only (category); there is no fill badge type | D | tidak |
| BG-02 | Badge / Status | Every status badge is the animated status dot; the domain wrappers all render .dbg | D | tidak |
| BG-03 | Badge / Status | Ongoing statuses pulse (endless, soft); finished ones stay still; reduced motion stops the pulse | D | tidak |
| BG-04 | Badge / Status | Purple and cyan are accent intents and may label a category (revised keputusan owner 2026-10-26; the old uses of purple and cyan as a status colour st | U | ya |
| BG-05 | Badge / Status | No read-only badge on cards: the card markup has no "read-only" badge label | U | ya |
| BG-06 | Badge / Status | Status memakai badge soft atau StMeta di baris list (prototipe 1.20) | D | tidak |
| BG-07 | Badge / Status | No large decorative shape sits behind the content of a work page: no element wider or higher than 600px with a radius of 50% or more, and no large rad | U | ya |
| BG-08 | Badge / Status | A category label such as the data confidence of a recommendation (high, medium, low) is the Badge (`.bdg`, soft, with the confidence icon of the centr | U | ya |
| BD-01 | Badge / Status | There is ONE badge look, soft: a rectangle with the radius token `--r-badge` (8px; it was 4px until keputusan owner 2026-10-26, digantikan), backgroun | U | ya |
| BD-02 | Badge / Status | Every badge shows an icon (14px, `aria-hidden`, left of the text) that fits its value. A badge without an icon exists only through the explicit `noIco | U | ya |
| BD-03 | Badge / Status | Icons come from one central map (`src/domain/badgeIcons.ts`, built from docs/badge-icon-map.json): the same value has the same icon in the whole app,  | U | ya |
| BD-04 | Badge / Status | Colours: the text and icon of a soft badge are the `--int-fg` of its intent; in light mode success, danger and info use `--color-surface-<intent>-stro | U | ya |
| BD-05 | Badge / Status | A badge is one line: a text that does not fit is cut with an ellipsis (the icon stays), and the badge then carries the full label in its `title`; the  | U | ya |
| BD-06 | Badge / Status | The risk profile badge (Conservative, Moderate, Growth, Aggressive) has one colour per level, chosen by its position on the scale: info, success, warn | U | ya |
| BD-08 | Badge / Status | The data confidence badge uses the icons `check_circle` (High, success), `error_outline` (Medium, warning), `help_outline` (Low, danger): the cellular | U | ya |
| BD-09 | Badge / Status | The header of a Kanban lane is the one badge with the icon and intent of its status from the central map (`badgeFor('oppStatus', key)`), no pulse, no  | U | ya |
| BD-10 | Badge / Status | A badge is a STATUS or CATEGORY label and never interactive: no click handler, no button or link role, no tabindex, no button inside it. A label that  | U | ya |
| CH-01 | Badge / Status | The Chip is the compact NON-STATUS label, in two modes. STATIC (no handler: a `span`, no hover, no focus, no pointer): a count or a number ("3 improve | U | ya |
| CH-02 | Badge / Status | A removable Chip is a non-interactive container with the label and ONE close button; a selectable or clickable Chip is one `<button>`: no interactive  | U | ya |
| CH-03 | Badge / Status | The suggestion buttons of a field, the date presets, the removable tags of TagInput and MultiSelect and the value toggles of the rule editor are Chips | U | ya |
| CH-04 | Badge / Status | `--r-pill` (999px) is the one token for a full pill; the Chip uses it, no stylesheet writes a pill radius literal for a tag, count or chip (keputusan  | U | ya |
| CH-05 | Badge / Status | Every count of the app is a static Chip (tab counts, section counts, menu counts, button counts, the scenario button, the rule editor tools); `Count`, | U | ya |
| CH-06 | Badge / Status | The count of a TAB is a static Chip in the `default` tone (`tone="default"`): a solid fill, not the soft look. In a tab that is not selected the fill  | U | ya |
| CH-07 | Badge / Status | A button that shows a count has the label WITHOUT "(n)" and the count as a static Chip inside the button (`Button` props `count`, and `zero` to show a | U | ya |
| CH-08 | Badge / Status | A static Chip (a count, a tag, a name, a version) is SOLID by default: `--color-surface-neutral-tertiary` with `--color-text-secondary` text (changed  | U | ya |
| CH-09 | Badge / Status | No Chip has a shadow (`box-shadow`): the ring that separated the count of the scenario button and of the bell from the button is gone | U | ya |
| CH-10 | Badge / Status | A Chip that is not selected (the interactive one and the static default) has the text colour subtle-4; a selected one keeps brand strong | U | ya |
| BD-11 | Badge / Status | `local_fire_department` (a flame) is the icon of every value that means "new": the opportunity status New, the rule run result New and the Kanban lane | X | tidak |
| BD-12 | Badge / Status | The Badges of the Opportunity recommendation cards (the plan card, the compare table, the detail rows, the provenance tags, the selection summary and  | X | tidak |
| BD-13 | Badge / Status | Every badge says what it is for in a tooltip (the Tooltip bubble, dark with a tail) when the mouse is on it or it is tapped: a domain badge reads "<do | U | ya |
| BD-15 | Badge / Status | The label and the icon of a badge always have the colour and the size of the badge itself, and the badge has its intent colour (`--int-fg`): no rule o | U | ya |
| BD-14 | Badge / Status | The segment of a customer (Priority, Affluent, Mass) is always the segment Badge (`SegBadge`, with its colour and icon from the central map) in a tabl | D | tidak |
| FM-01 | Form / Field | Label above the field; required shows a mark, optional shows "Optional" | U | ya |
| FM-02 | Form / Field | The info icon sits on the label only (hint), inline, never in the input | U | ya |
| FM-03 | Form / Field | Phone: flag + country code button and the number input side by side; digits are grouped per 4 and a leading 0 is removed | U | ya |
| FM-04 | Form / Field | Money: currency prefix (no money icon) and thousands separators while typing | U | ya |
| FM-05 | Form / Field | Shortcut chips (Tenor, amount) sit 4px below the field and fill it when clicked | U | ya |
| FM-06 | Form / Field | Placeholders are soft (subtle-3) and dashed outlines use 6px dash / 6px gap | U | ya |
| FM-07 | Form / Field | The checkbox is soft: a soft border, brand fill only when checked | U | ya |
| FM-08 | Form / Field | The Tenor shortcut chips fill the field (30, 90, 180, 365) | U | ya |
| FM-09 | Form / Field | The phone field shows the country selector and a usable number input; the money field shows Rp and thousands: ${vp.width} | U | ya |
| FM-10 | Form / Field | The toggle switch (`Switch`, `.swi` / `.swt`) is a 40x24 track with a 16px knob inset 4px on every side; on moves the knob 16px; it is a native checkb | U | ya |
| FM-11 | Form / Field | A date field (`Input type="date"`: Signal rule editor, Marketing brief, Outcome follow-up, RX decline, Analytics and Reports filters) follows the them | D | tidak |
| FM-12 | Form / Field | A control that is a form field takes the field props: `Select` and `SegmentedControl` with a `label` are a `.fld` (label above, `req` / `opt`, `hint`, | U | ya |
| FM-13 | Form / Field | `RichSelect` is the select whose options have an icon tile and a short description (the Outcome of an activity): a combobox with a listbox in the form | U | ya |
| FM-14 | Form / Field | A `DateField` at the edge of a card that clips (the card is `overflow:hidden`, so a popover that runs past it is cut and the card scrolls to reach it) | U | ya |
| FM-15 | Form / Field | The days of the calendar of `DateField` are equal: the seven columns have the same width and a chosen day, the start and the end of a range keep their | U | ya |
| FM-16 | Form / Field | The `Select` has the variant with `pre` and `suf` (strings): a short text inside the field before and after the value, drawn like the `pre` and `suf`  | U | ya |
| FM-17 | Form / Field | A form field that asks for ONE value from a list of options (a category, a type, a status, a channel) is a `Select` by default, also when there are on | U | ya |
| FM-18 | Form / Field | The colour field is the variant `<Input format="color">` of the text field (not a component of its own): it accepts a hex colour with or without the p | U | ya |
| FM-19 | Form / Field | The color picker opens under the color field (FM-18) when the swatch is pressed, as a form popover (FP-01: closes with Escape and a press outside, foc | U | ya |
| FM-20 | Form / Field | What the color picker (FM-19) leaves out of the reference of the owner (Untitled UI): the alpha slider and the alpha field (the field holds an opaque  | U | ya |
| FM-21 | Form / Field | A single choice from a few options (what was a group of radio buttons) is a row of `Chip`s: the selected chip is soft brand with a leading check icon, | U | ya |
| FM-22 | Form / Field | A field with several options to switch on or off (the columns of Show / hide columns, the sections of an export or a report, the recommendation candid | U | ya |
| FM-23 | Form / Field | The `SegmentedControl` is only for a small space (the header of a card, a toolbar, a drawer, a table cell, the page head): it is not the control of a  | U | ya |
| FM-24 | Form / Field | The exceptions to FM-22 are checkboxes by decision of the owner: the checkbox of a row of a table and the select-all of its header, the Remember me ch | D | tidak |
| CD-01 | Kartu / Alert / Tip / Tooltip | Cards, KPI and similar containers use the card radius token (8px); the token has one edit point | U | ya |
| CD-02 | Kartu / Alert / Tip / Tooltip | One card is one box: no card inside a card (CSS rule and no nested .card in the source markup) | U | ya |
| CD-03 | Kartu / Alert / Tip / Tooltip | Alerts are a card on the card surface with a soft tint (the intent's subtle colour) fading from the left, a 1px subtle border and NO shadow, an icon i | U | ya |
| CD-04 | Kartu / Alert / Tip / Tooltip | Text hierarchy: three stacked lines go neutral default, subtle-4, subtle-3 (.t3 and the listed components) | U | ya |
| CD-05 | Kartu / Alert / Tip / Tooltip | Group titles (captions) are small, uppercase, weight 500, neutral subtle-3; icon sizes are 14 / 18 / 20px by context | U | ya |
| CD-06 | Kartu / Alert / Tip / Tooltip | Detail rows: the label is xs-sized subtle-3 and the value below it sm-sized subtle-4 (DR component) | U | ya |
| CD-07 | Kartu / Alert / Tip / Tooltip | The Tooltip is a dark bubble with a tail, left-aligned text, at most 280px wide; there are no CSS-only tips (.hint / data-tip) | U | ya |
| CD-08 | Kartu / Alert / Tip / Tooltip | Alerts only for real conditions: a page or drawer never opens with an Alert on screen (enforced by tests/e2e/noInitialAlerts.spec.ts); audit of 2026-1 | U | ya |
| CD-09 | Kartu / Alert / Tip / Tooltip | A card has a header (title + up to two actions) and a body separated by a divider; the footer is for actions | U | ya |
| CD-10 | Kartu / Alert / Tip / Tooltip | A Tooltip opens on hover and on focus, closes with Escape, and its bubble is described by role=tooltip | U | ya |
| CD-11 | Kartu / Alert / Tip / Tooltip | The info trigger is a fixed 16px icon box that cannot stretch (it once printed an 11-letter icon name and was 144px wide) | U | ya |
| CD-12 | Kartu / Alert / Tip / Tooltip | Card-like containers (preview box `.bp`, `.bp-card`, dropzone `.fdz`, drawer header `.drh`, status drawer `.drs`, ChangeNotice `.cn`, sign-in panel `. | U | ya |
| CD-15 | Kartu / Alert / Tip / Tooltip | A list row `.li` has no side padding of its own (padding top and bottom only, 12px); the container gives the inset: a flush card body that holds list  | U | ya |
| CD-16 | Kartu / Alert / Tip / Tooltip | Customer 360 Signals & Opportunities opens with a summary strip of three KPI cards (Signals, Active opportunities, Need action = active and not starte | D | tidak |
| CD-17 | Kartu / Alert / Tip / Tooltip | The tab lists one row (`.li.sgr`) per signal, most relevant first (active opportunity, then closed, then none; then priority, then newest): the signal | D | tidak |
| CD-18 | Kartu / Alert / Tip / Tooltip | The tab has a SegmentedControl filter (All, Needs action, No opportunity) only when there are four rows or more; with no signals an empty state explai | D | tidak |
| CD-19 | Kartu / Alert / Tip / Tooltip | The as-of footnote of the customer and detail panels (`p.mut.c3src`) is `var(--color-text-tertiary)`. Measured contrast: light 2.92:1 on the card, dar | D | tidak |
| IC-01 | Kartu / Alert / Tip / Tooltip | The trailing chevron icon of a list row (chevron_right, expand_more and the like in `.li`, `.rem`, `.alog-chev`) uses `var(--color-text-tertiary)`, fr | U | ya |
| CD-13 | Kartu / Alert / Tip / Tooltip | Radius kartu 12px lewat token --r-card | D | tidak |
| CD-14 | Kartu / Alert / Tip / Tooltip | Tooltip CSS-only (.hint, data-tip, .jb::after) | D | tidak |
| CD-20 | Kartu / Alert / Tip / Tooltip | A block that is drawn inside a card, `.card .card` and `.card .pv`, uses the card radius token (`var(--r-card)`, 8px), not a 4px literal | U | ya |
| CD-21 | Kartu / Alert / Tip / Tooltip | There is no class `.note` (the blue box that did the job of an Alert, removed in DS 2.68 on the owner's question): the note that stays on a page or in | U | ya |
| CD-22 | Kartu / Alert / Tip / Tooltip | The content of a card (and of the panels of the detail pages) has 16px padding, not 20px: `.c3id`, `.c3qa`, `.c3s`, `.c3src`, `.odh`, `.odf`, `.odnx`, | U | ya |
| CD-23 | Kartu / Alert / Tip / Tooltip | A generic class name is never defined twice for different jobs: the bare class `.pct` (the top holders box of the product detail) overrode the progres | U | ya |
| CD-24 | Kartu / Alert / Tip / Tooltip | The label of the action button or link of a Tooltip (`.tt-link`) is always white (`--color-text-white`) on the dark bubble, wherever the bubble sits:  | U | ya |
| CD-25 | Kartu / Alert / Tip / Tooltip | In dark mode the border of the Tooltip bubble is faint: the subtle neutral border (`--color-border-neutral-subtle`), not the strong one, so the dark b | U | ya |
| CD-26 | Kartu / Alert / Tip / Tooltip | Only the glyph of the icon of an Alert rings like a bell, the tile behind it stands still (owner 2026-11-16: hanya iconnya saja yang bergerak): the gl | U | ya |
| CD-27 | Kartu / Alert / Tip / Tooltip | Only the glyph of the icon of an Empty state and of an Error state bounces up and down, like the ring of the Alert icon (CD-26): two small bounces of  | U | ya |
| CD-28 | Kartu / Alert / Tip / Tooltip | A Tooltip is shown only while the pointer is on its trigger or on its bubble, or while the trigger has keyboard focus: a focus that a mouse click gave | U | ya |
| DR-01 | Drawer / Modal | Drawer sizes are S 400, M 560, L 760 and XL 960px (XL added 2026-11-14 on the owner's request; the 960px width is the agent's choice, to be confirmed  | U | ya |
| DR-02 | Drawer / Modal | Dialogs have six kinds (success, info, progress, warning, danger, confirm) and accept a third (alt) action | U | ya |
| DR-03 | Drawer / Modal | A drawer opened from another drawer shows a Back button (optional back / onBack on Drawer) | U | ya |
| DR-04 | Drawer / Modal | Tabs inside a drawer are segmented and sticky flush with the drawer top | U | ya |
| DR-12 | Drawer / Modal | The Compare recommendations drawer (the comparison of the recommendations of an opportunity, `RxPanel`) is the XL drawer (`size="xl"`, 960px), because | D | tidak |
| DR-05 | Drawer / Modal | A confirmation is a centred dialog template, never a drawer; the kind follows the consequence: `confirm` (a normal but important action), `warning` (c | U | ya |
| DR-06 | Drawer / Modal | Leaving the rule editor with unsaved changes asks in a centred dialog, not in a drawer | U | ya |
| DR-07 | Drawer / Modal | Konfirmasi memakai modal polos | D | tidak |
| DL-01 | Drawer / Modal | A list of label and value pairs is a DetailList with one of two layouts: `grid` (the label above the value, the pairs side by side; one column in a na | U | ya |
| DL-02 | Drawer / Modal | `layout="auto"` chooses by the width of the list itself, not of the window: rows below 480px, grid from 480px | U | ya |
| DL-04 | Drawer / Modal | `.dl-grid` has no padding of its own: the card body (16px) or the panel that holds the list gives it, so a list in a card is not padded twice; only th | U | ya |
| DL-03 | Drawer / Modal | Names: `.dl-grid` and `.dl-item` (were `.c3fl` and `.c3f`), `.dl-rows` and `.dl-row` (were `.dr-g` and `.dr.dr-s`); the component is `DetailList` with | U | ya |
| DR-08 | Drawer / Modal | (renamed 2026-11-14, DS 2.88, DL-03: it was `DR` variant `split`, `.dr.dr-s`, group `.dr-g`) The DetailList layout `rows` (`.dl-rows` > `.dl-row`): th | U | ya |
| DR-09 | Drawer / Modal | The action of a form in a drawer (for example "Add sub class" in Manage sub classes) is a button of the drawer footer (`Drawer` `footer`: the quiet bu | U | ya |
| DR-10 | Drawer / Modal | A preview box that holds list rows (`.pv > .li`, as in the Reschedule, Dismiss and Assign drawers) stays tidy in a narrow space: below 480px of box wi | U | ya |
| DR-11 | Drawer / Modal | When a card or list row has a third text (after the title and the second line, for example the date and time of the activity in the Reschedule preview | U | ya |
| CU-01 | Kanban / Opportunity | Customer 360 is a three-panel layout (identity panel, tabs, side panel) that drops to two and one column on narrower windows | D | tidak |
| CU-02 | Kanban / Opportunity | The side panels of Customer 360 and Opportunity detail scroll with the page: no sticky, no scroll of their own | U | ya |
| KB-01 | Kanban / Opportunity | Columns: New, Assigned, In Progress, Completed, then Dismissed and Expired as their own columns next to Completed | D | tidak |
| KB-02 | Kanban / Opportunity | Cards cannot be dragged (no draggable, no drag handlers, no move-to-stage action) | U | ya |
| KB-03 | Kanban / Opportunity | The whole card is the View action: no View button; the title is a real button covering the card; Take Action and More do not trigger it | U | ya |
| KB-04 | Kanban / Opportunity | The More menu of a card offers only Export and Dismiss | D | tidak |
| KB-05 | Kanban / Opportunity | No score on the Kanban card (title, description, priority + due, owner, actions only) | D | tidak |
| KB-06 | Kanban / Opportunity | Cards have no shadow and no drag cursor | U | ya |
| KB-07 | Kanban / Opportunity | The Opportunity list opens in Kanban by default; Table is the alternative and the choice is remembered (kora.react.oppView) | D | tidak |
| KB-08 | Kanban / Opportunity | Opportunity: Kanban is the default, Table the alternative; no stat cards in either view | D | tidak |
| KB-09 | Kanban / Opportunity | Kanban columns: New, Assigned, In Progress, Completed, Dismissed, Expired; cards are not draggable and show no score | D | tidak |
| KB-10 | Kanban / Opportunity | Clicking a card opens the opportunity (View); there is no View button; the More menu has only Export and Dismiss | D | tidak |
| KB-13 | Kanban / Opportunity | In the Kanban view the board scrolls inside itself, both ways, and the header of every lane (the status Badge and the count) is sticky at the top of t | U | ya |
| KB-14 | Kanban / Opportunity | The toolbar of the Kanban view (`.tb.tb-stk`: search, Advanced filter, Export) is sticky under the top of the window, under the top bar below 1100px,  | U | ya |
| OP-01 | Kanban / Opportunity | Opportunity detail is two columns: the customer panel on the left (288px) and the main column with the summary above the content tabs | D | tidak |
| OP-02 | Kanban / Opportunity | The Decision bar is a sticky bottom layer (bottom 16px) that sits above the page and, on a phone, above the bottom navigation | U | ya |
| OP-03 | Kanban / Opportunity | Take Action (Opportunity Table, Kanban and detail): when the opportunity has no selected recommendation, the pick drawer opens first (option cards, Co | D | tidak |
| RP-01 | Kanban / Opportunity | Reports is two columns: a narrow left column (340px) with the report, saved configurations and generated files, and the preview on the right | D | tidak |
| KB-11 | Kanban / Opportunity | Kartu Kanban punya tombol View (kanban-spec section 3 langkah 5) | D | tidak |
| KB-12 | Kanban / Opportunity | Kartu stat di atas daftar Opportunity | D | tidak |
| SG-01 | Signal rules | Rules is a level-2 menu: Signal rules, Recommendation scoring, Products & rates, Opportunity detection, Activity log policy | D | tidak |
| SG-02 | Signal rules | The rule editor is a numbered stepper form with Back / Next and an aside decision bar, on its own page (not a drawer) | D | tidak |
| SG-03 | Signal rules | The condition builder uses the SegmentedControl for Match all / any and a nested AND / OR group | D | tidak |
| SG-04 | Signal rules | The Signal rules page is open to RM, Supervisor and Marketing (view and propose), and to Admin; there is no other role | D | tidak |
| SG-05 | Signal rules | Rules are evaluated in a daily run, not in real time: the texts say "daily run" and nothing promises real-time evaluation | D | tidak |
| SG-06 | Signal rules | Signal rules approval is an option "Require approval" in Rules config (Governance, admin), default OFF. OFF: a saved rule goes active directly, with n | D | tidak |
| SG-07 | Signal rules | Require approval ON keeps the maker-checker flow unchanged: Approver approves, Auditor reads the log, `sig.review` / `sig.approve`, Review queue tab,  | D | tidak |
| SG-08 | Signal rules | In the View result drawer the numbers come first: the scenario toolbar and the five KPI cards (the source line `p.rsc`, "Simulation on mock demo data  | D | tidak |
| SG-09 | Signal rules | The items of the lists of impact (`.sbim li`) and of findings (`.sbfind li`) are aligned to the centre of their row (`align-items:center`), so an icon | D | tidak |
| SG-10 | Signal rules | A customer row of the View result drawer is a card made of the existing parts (`Badge`, `DR`, `Stars`, the tree of conditions): closed it shows only t | D | tidak |
| SG-11 | Signal rules | A validation result of the Design page (Validation levels: blocking error, warning, information) is shown with the Alert in its compact variant (`Aler | U | ya |
| SG-12 | Signal rules | The findings panel of the rule editor and of the rule detail (`SrFindPanel`, class `.sbfind`) shows each finding (blocking error, warning, information | D | tidak |
| RN-01 | Run harian (Rules ke Opportunity) | The daily run evaluates only LIVE rules (status active, inside its from / to dates) at their published version, never the working copy `rev`; every si | D | tidak |
| RN-02 | Run harian (Rules ke Opportunity) | One matching rule is one Signal. One Opportunity is created per (customer, opportunity type) and merges every signal of that type; its priority is the | D | tidak |
| RN-03 | Run harian (Rules ke Opportunity) | The owner of a new opportunity is the RM of the customer. A customer that already has an ACTIVE opportunity of the same type is skipped. Cooldown is p | D | tidak |
| RN-04 | Run harian (Rules ke Opportunity) | At most 10 new opportunities per RM per day (the rule or setting value when there is one), chosen by score (highest first, then customer id); the rest | D | tidak |
| RN-05 | Run harian (Rules ke Opportunity) | A customer a rule cannot evaluate (stale or missing data) makes no signal; the run log counts them per rule with the cause and the Monitoring tab show | D | tidak |
| RN-06 | Run harian (Rules ke Opportunity) | A rule whose hits are more than 10% of the customers evaluated (and at least 5) is HELD: no signal until an administrator confirms it | D | tidak |
| RN-07 | Run harian (Rules ke Opportunity) | The run is idempotent per business date: running the same date again creates nothing; confirming a held rule completes only that rule | D | tidak |
| RN-08 | Run harian (Rules ke Opportunity) | A run is atomic: when it fails midway nothing is stored, neither in memory nor in the browser (no partial result) | D | tidak |
| RN-09 | Run harian (Rules ke Opportunity) | The seed is kept as the baseline and the first screen of every page is identical to the one before the run existed; opportunities made by a run carry  | D | tidak |
| RN-10 | Run harian (Rules ke Opportunity) | The run state (log, signals, opportunities, demo date) is one JSON in the `kora.react.` namespace with a schema version; older or unreadable content i | D | tidak |
| RN-11 | Run harian (Rules ke Opportunity) | Only a role with `sig.publish` (Administrator) can run, advance the day, confirm a held rule or reset; other roles do not see the buttons and the doma | D | tidak |
| RN-12 | Run harian (Rules ke Opportunity) | The demo date is 2026-10-03 until "Advance 1 day" is used; the new date lives in the run state, moves the whole app (overdue, expiry, cooldown) and is | D | tidak |
| RN-13 | Run harian (Rules ke Opportunity) | `runDaily` is pure and deterministic: the same input gives the same output twice, the input is not mutated, no random value and no clock | D | tidak |
| RN-14 | Run harian (Rules ke Opportunity) | The Monitoring tab shows the last run (date, rules evaluated, hits, created, skipped, deferred, not evaluable) with the Run and Advance buttons for an | D | tidak |
| RN-15 | Run harian (Rules ke Opportunity) | The note at the top of the Signal rules page says that Run today (Monitoring tab) runs the live rules on the demo customers and makes real Signals and | D | tidak |
| PM-01 | Performa rule (Outcome ke Rule) | The performance of a rule is counted per rule AND per rule version from the opportunities that carry the source marker of that rule (`src.signals`): H | D | tidak |
| PM-02 | Performa rule (Outcome ke Rule) | The window is the last 30 business days of the demo clock (`TODAY`, a live binding). The SAMPLE is the opportunities of the window that are at least 1 | D | tidak |
| PM-03 | Performa rule (Outcome ke Rule) | "Needs review" when, on an enough sample, engaged is below 20%, OR converted is below 5%, OR dismissed is above 50% (strict comparisons on the ratio). | D | tidak |
| PM-04 | Performa rule (Outcome ke Rule) | A flag never pauses, archives or changes a rule. It shows as a status Badge in the Library and in the detail header, as the "Performance (from outcome | D | tidak |
| PM-05 | Performa rule (Outcome ke Rule) | Ignoring a flag needs a note (required, shown as an error only after the user acted) and the permission `sig.publish`; other roles only see the flag a | D | tidak |
| PM-06 | Performa rule (Outcome ke Rule) | The Activity log of the rule shows the events "flagged" (a version went from not flagged to Needs review) and "flag dismissed" (with the note); the ac | D | tidak |
| PM-07 | Performa rule (Outcome ke Rule) | The Outcome factor of the recommendation score of an opportunity made by a run uses the history of its rule(s) when their sample is enough: shrunk rat | D | tidak |
| PM-08 | Performa rule (Outcome ke Rule) | Where the Outcome factor used the history, the reason of the factor says "Based on the history of the rule: X of Y converted" (EN and ID); without it  | D | tidak |
| PM-09 | Performa rule (Outcome ke Rule) | The simulated monitoring of the Monitoring tab (`srMonitor`, rule SG and DT) is not changed; a heading "Simulation" (new key) sits above it and the re | D | tidak |
| PM-10 | Performa rule (Outcome ke Rule) | Status, owner and outcomes (activities and outcome records) of opportunities made by a run are kept as an overlay in the run state (`kora.react.rundai | D | tidak |
| PM-11 | Performa rule (Outcome ke Rule) | "Simulate outcomes" (Administrator only, on the Monitoring tab) makes deterministic demo outcomes for the opportunities of runs that are at least 14 d | D | tidak |
| PM-12 | Performa rule (Outcome ke Rule) | Nothing changes before a run opportunity has an outcome: with no run, or with runs and no outcome, every page, golden and snapshot of the app is ident | D | tidak |
| PM-13 | Performa rule (Outcome ke Rule) | Five negative scenarios on the Monitoring tab: outcome data not available, sample too small, damaged overlay (restored), role without permission to ig | D | tidak |
| PM-14 | Performa rule (Outcome ke Rule) | The Performance card and the Ignore drawer are built from design-system parts (Card, KPI, Badge, Button, Drawer, Textarea, Alert only for real conditi | D | tidak |
| PM-15 | Performa rule (Outcome ke Rule) | The six thresholds of PM-02 and PM-03 (minimum sample 5, minimum age 14 days, window 30 days, engaged minimum 20%, converted minimum 5%, dismissed max | D | tidak |
| PM-16 | Performa rule (Outcome ke Rule) | The Performance card of the Monitoring tab has a button "Performance thresholds" that only an Administrator sees; it opens a drawer with the six field | D | tidak |
| PM-17 | Performa rule (Outcome ke Rule) | Validation: whole numbers; shares 0 to 100; minimum sample 1 to 100; minimum age 0 to 90; window 7 to 180; the window is at least the minimum age; one | D | tidak |
| PM-18 | Performa rule (Outcome ke Rule) | The flags are recomputed with the new thresholds; an Ignore stays only while the failing criteria did not grow (PM-05), and a criterion that now passe | D | tidak |
| PM-19 | Performa rule (Outcome ke Rule) | The values are kept in the run state (schema 3, migrated from schema 2: no values means the defaults); stored values that are not valid are ignored an | D | tidak |
| PM-20 | Performa rule (Outcome ke Rule) | Every change (and every reset to defaults) is written to the audit log (who, when, old and new value of each field that changed) and, for each rule ve | D | tidak |
| PM-21 | Performa rule (Outcome ke Rule) | Conflict and failure: Apply is refused with a conflict message when the thresholds or the Ignore decisions changed since the drawer opened; an Ignore  | D | tidak |
| PM-22 | Performa rule (Outcome ke Rule) | Three negative scenarios on the Monitoring tab: the save fails, the stored thresholds are not valid (the defaults apply and a message says so), the th | D | tidak |
| RC-01 | Rekomendasi pada rule (Rules ke rx) | A rule may have an optional block "Recommendation candidates" (`rc`): 1 to 5 ordered candidates. Each has a product reference (a catalogue product cod | D | tidak |
| RC-02 | Rekomendasi pada rule (Rules ke rx) | Eligibility is not bypassed: a candidate of a rule goes through every check of `rxEval` (availability, risk, amount, funds, hold, window, liquidity an | D | tidak |
| RC-03 | Rekomendasi pada rule (Rules ke rx) | A rule without the block (every seed rule and every older rule) keeps the old behaviour exactly: `rxCands` by opportunity type, and the same Recommend | D | tidak |
| RC-04 | Rekomendasi pada rule (Rules ke rx) | An opportunity made by several rules gets the union of their candidates, one per product; the candidates are ordered by score; when two rules offer th | D | tidak |
| RC-05 | Rekomendasi pada rule (Rules ke rx) | Validation of the block: the product exists and is available in the catalogue (a category has at least one available product); every channel is allowe | D | tidak |
| RC-06 | Rekomendasi pada rule (Rules ke rx) | A live rule whose candidate product later disappears or is made unavailable is a finding (a warning on the Monitoring tab); the run skips that candida | D | tidak |
| RC-07 | Rekomendasi pada rule (Rules ke rx) | The block is part of the rule version: it is in the content that is saved, compared (Versions diff), restored, rolled back, duplicated and sent as a p | D | tidak |
| RC-08 | Rekomendasi pada rule (Rules ke rx) | The result drawer ("View result") shows, for a matching customer, the recommendation examples of the rule: up to three ranked candidates and the Exclu | D | tidak |
| RC-09 | Rekomendasi pada rule (Rules ke rx) | An opportunity made by a run keeps a snapshot of the candidates of its rules (rule id, version and the items that were available at the run); the Oppo | D | tidak |
| RC-10 | Rekomendasi pada rule (Rules ke rx) | Six negative scenarios on the editor (screen `signal-rule`): a product that is not available, a channel that is not allowed, a duplicate candidate, an | D | tidak |
| RC-11 | Rekomendasi pada rule (Rules ke rx) | The editor section, the detail summary, the result drawer examples and the origin line exist only for a rule or a candidate that has the block: withou | D | tidak |
| RC-12 | Rekomendasi pada rule (Rules ke rx) | Talking points of a rule candidate go to the opening remarks of Take Action when the RM selects that recommendation: only for a recommendation that co | D | tidak |
| RC-13 | Rekomendasi pada rule (Rules ke rx) | The editor and the result drawer warn (a warning, never a blocking error) when the amount preset of a candidate gives "No amount" for MORE than 50% of | D | tidak |
| DI-01 | Data & Integration (sumber data ke Rules) | The five source systems (Core Banking, Transaction System, CRM, WMS, Customer Master) each have: a connection status (connected, error, disconnected), | D | tidak |
| DI-02 | Data & Integration (sumber data ke Rules) | Initial state: all five sources are connected with exactly the data age the constants had (Core Banking 1, Transaction System 1, CRM 1, WMS 2, Custome | D | tidak |
| DI-03 | Data & Integration (sumber data ke Rules) | A disconnected source takes its fields out of the field catalogue of the rule editor (a condition that already uses one keeps showing it), and a rule  | D | tidak |
| DI-04 | Data & Integration (sumber data ke Rules) | A source whose data age is above the limit of the rule ("skip if data older than N days") makes the customers that rule reads from it "cannot be evalu | D | tidak |
| DI-05 | Data & Integration (sumber data ke Rules) | The daily run is never blocked by a stale or missing source: only the rules that read it are skipped and counted. A new run keeps a snapshot of the st | D | tidak |
| DI-06 | Data & Integration (sumber data ke Rules) | Controls on the Data & Integration page for an Administrator only (permission `sig.publish`): Load now (last load = the demo date, only for a connecte | D | tidak |
| DI-07 | Data & Integration (sumber data ke Rules) | The page Data & Integration shows each source with its status badge, last load, data age and threshold, and the field mapping canonical field -> sourc | D | tidak |
| DI-08 | Data & Integration (sumber data ke Rules) | The state lives in its own store `kora.react.integration` with a schema version and a migration: a stored value that is not valid is thrown away and t | D | tidak |
| DI-09 | Data & Integration (sumber data ke Rules) | Negative scenarios (contexts Data & Integration and Monitoring): a source fails in the middle of a run (no partial result is stored), a disconnected s | D | tidak |
| DI-10 | Data & Integration (sumber data ke Rules) | Data & Integration is a group of the sidebar (like Rules and Users & Roles) with five submenus, in this order: Source systems (the status of the sourc | D | tidak |
| DI-11 | Data & Integration (sumber data ke Rules) | The old address `#/integration` (and `#/integration/<unknown>`) stays valid and replaces itself with the first submenu `#/integration/sources` (no ext | D | tidak |
| DI-12 | Data & Integration (sumber data ke Rules) | Permission and the pack gate of the pages: only the Administrator has the route (the other roles get the restricted view at every page), the Entity pa | D | tidak |
| XS-01 | Sinyal eksternal (sistem asal ke Opportunity) | An external signal is a record {id, source (one of the five sources of DI-01), external reference, canonical customer id, event code, time of the even | D | tidak |
| XS-02 | Sinyal eksternal (sistem asal ke Opportunity) | Mapping (Administrator): an external event code of a source maps to a Kora signal type (one of the 5 types), an opportunity type (one of the 5), a sev | D | tidak |
| XS-03 | Sinyal eksternal (sistem asal ke Opportunity) | Source label: a signal carries `origin` (`rule` or `external`), its source and its external reference (a rule signal carries no new key). The Opportun | D | tidak |
| XS-04 | Sinyal eksternal (sistem asal ke Opportunity) | Merge: external and rule signals for the same (customer, opportunity type) are merged into ONE opportunity whose evidence lists all of them; the same  | D | tidak |
| XS-05 | Sinyal eksternal (sistem asal ke Opportunity) | Source priority is an ordered list set by an Administrator (default: Kora rule, then external). It orders the evidence and decides the main "Why?" (th | D | tidak |
| XS-06 | Sinyal eksternal (sistem asal ke Opportunity) | Freshness: an event older than N days (default 3, a whole number 1 to 30, set by an Administrator; exactly N days old is still fresh) is ignored at th | D | tidak |
| XS-07 | Sinyal eksternal (sistem asal ke Opportunity) | A source that is disconnected or in error (the state of DI-01) is not processed: its events wait, nothing is created, and the impact shows in the card | D | tidak |
| XS-08 | Sinyal eksternal (sistem asal ke Opportunity) | Suitability cannot be skipped: the recommendations of an opportunity that has an external signal go through `rxEval` and `rxScore` like any other; an  | D | tidak |
| XS-09 | Sinyal eksternal (sistem asal ke Opportunity) | Performance per mapping: `computePerformance` also groups the opportunities by external mapping (key EXT:<source>:<code>) with the same funnel, minimu | D | tidak |
| XS-10 | Sinyal eksternal (sistem asal ke Opportunity) | Outbound log (Data & Integration): every Action created and every Outcome saved on an opportunity that has an external signal produces one message to  | D | tidak |
| XS-11 | Sinyal eksternal (sistem asal ke Opportunity) | Kora never edits or overrides the rules or alerts of the source system: the received events are never changed by a run or a command, the only thing se | D | tidak |
| XS-12 | Sinyal eksternal (sistem asal ke Opportunity) | Initial state: without received events the result of `runDaily`, the run record, the opportunities, the performance and every page are identical to be | D | tidak |
| XS-13 | Sinyal eksternal (sistem asal ke Opportunity) | Store: events, mappings, source priority, freshness days and the outbound log live in `kora.react.external` with a schema version and a migration; a v | D | tidak |
| XS-14 | Sinyal eksternal (sistem asal ke Opportunity) | Only an Administrator (permission `sig.publish`) sees the controls (Receive demo events, mapping, source priority, freshness days, Retry, Pause); othe | D | tidak |
| XS-15 | Sinyal eksternal (sistem asal ke Opportunity) | Negative scenarios (Data & Integration and Monitoring): event without mapping, duplicate event, stale event, unknown customer, source disconnected, ou | D | tidak |
| XS-16 | Sinyal eksternal (sistem asal ke Opportunity) | An opportunity that an external event made WITHOUT the number its source reports (`n`) never shows a number it does not have: its title, reason, evide | D | tidak |
| DQ-01 | Ketersediaan data rule (data hilang dan operator tak dikenal) | Data that is not available is never zero, false or "did not happen". A condition that depends on it is "cannot be evaluated" with the cause (missing d | D | tidak |
| DQ-02 | Ketersediaan data rule (data hilang dan operator tak dikenal) | The three-valued combination is unchanged: AND with one failed condition is failed; AND with one "cannot be evaluated" and the rest passed is "cannot  | D | tidak |
| DQ-03 | Ketersediaan data rule (data hilang dan operator tak dikenal) | An operator that the field type does not have (a made-up one, or one of another type) is "cannot be evaluated" with the cause `op` ("unknown operator" | D | tidak |
| DQ-04 | Ketersediaan data rule (data hilang dan operator tak dikenal) | The daily run records an unknown operator per rule (`badOp` in the rule result and in the not-evaluable list, counted in the not-evaluable total), mak | D | tidak |
| DQ-05 | Ketersediaan data rule (data hilang dan operator tak dikenal) | An unknown operator is shown with the existing warning mechanisms and no new UI: a warning Alert per rule on the Monitoring run card (a real condition | D | tidak |
| DQ-06 | Ketersediaan data rule (data hilang dan operator tak dikenal) | The editor validation still refuses an unknown operator (`sr.v.cv`) in every field type; it is the first line, the evaluator (DQ-03) the second | D | tidak |
| DQ-07 | Ketersediaan data rule (data hilang dan operator tak dikenal) | The initial state does not change: for the 10 seed rules, 60 customers, 3 data presets and 3 source states (none, default, one source down) the result | D | tidak |
| DQ-08 | Ketersediaan data rule (data hilang dan operator tak dikenal) | An opportunity made by the daily run from a RULE whose type has a number (days or percent: investment idle days, maturity days, inactivity days, reten | D | tidak |
| EN-01 | Entitas goal dan asuransi (fondasi data, P6c tahap 1) | The goal, portfolio, benchmark, product-holding extension, recurring-instruction, insurance-policy and service-case records come only from an adapter  | D | tidak |
| EN-02 | Entitas goal dan asuransi (fondasi data, P6c tahap 1) | A relation is one hop and has three states that are told apart: `established` (the target exists), `none` (the relation really does not exist) and `un | D | tidak |
| EN-03 | Entitas goal dan asuransi (fondasi data, P6c tahap 1) | Every derived feature of an entity is a pure function of the entity, its relations and the live demo date (`TODAY`, never `Date.now`): the same input  | D | tidak |
| EN-04 | Entitas goal dan asuransi (fondasi data, P6c tahap 1) | The entity pack is OFF by default. While it is off every access function returns "not available" (cause `off`), and the whole application, the seed, t | D | tidak |
| EN-05 | Entitas goal dan asuransi (fondasi data, P6c tahap 1) | The availability of an entity follows the source status of P4: Goal, Portfolio, Benchmark, Product holding and Recurring instruction read WMS; Service | D | tidak |
| EN-06 | Entitas goal dan asuransi (fondasi data, P6c tahap 1) | Activating or deactivating the pack needs the permission of the administrator (`sig.publish`, the one of the source commands), refuses without it (`de | D | tidak |
| EN-07 | Entitas goal dan asuransi (fondasi data, P6c tahap 1) | The demo records are generated by a separate deterministic function for 8 existing customers (never the customer, product or transaction data of the g | D | tidak |
| EN-08 | Entitas goal dan asuransi (fondasi data, P6c tahap 1) | The derived features of the entities are registered in a separate catalogue (`ENT_FEATURES`) with their entity, unit, window and data need, but in sta | D | tidak |
| EN-09 | Entitas goal dan asuransi (fondasi data, P6c tahap 1) | Attributes and features added for the scenarios R01 to R20: a holding has an asset class and a 30-day return (`holding_return_30d_pct`, not available  | D | tidak |
| EN-10 | Entitas goal dan asuransi (fondasi data, P6c tahap 1) | The demo records also serve the 20 scenarios R01 to R20 (`docs/rules-scenarios-R01-R20.md`): tags R01..R20 in `ENT_DEMO_TAGS` next to the SR tags, and | D | tidak |
| EN-11 | Entitas goal dan asuransi (fondasi data, P6c tahap 1) | Activity data and the "Block A" features of the P scenarios (docs/rules-derived-features.md): a customer's transactions (kind, time, amount, status, c | D | tidak |
| EN-12 | Entitas goal dan asuransi (fondasi data, P6c tahap 1) | The demo activity data serves the scenarios R01, R05, R08, R10, R11, R16, R17 and R18 and the obligations and cash of R20 N3: a separate deterministic | D | tidak |
| FT-01 | Fitur turunan, NOT dan field-vs-field (P6b) | The derived features are one fixed catalogue (`src/domain/features/`), a list of ids with an EN and an ID label, a type (number, percent, percentage p | D | tidak |
| FT-02 | Fitur turunan, NOT dan field-vs-field (P6b) | A feature whose history does not cover its window, whose baseline is too short, whose source is not available or whose data is missing has no value (" | D | tidak |
| FT-03 | Fitur turunan, NOT dan field-vs-field (P6b) | The editor offers the features of the customer level in the field list, under the group "Derived", chosen like any field, each with a category Badge ( | D | tidak |
| FT-04 | Fitur turunan, NOT dan field-vs-field (P6b) | A group can be negated: a flag on the group (`not`), shown by a NOT marker and set from the group menu, three-valued: NOT(pass) = fail, NOT(fail) = pa | D | tidak |
| FT-05 | Fitur turunan, NOT dan field-vs-field (P6b) | The value of a numeric condition can be a reference to another numeric field or feature with an optional multiplier (a number above 0; empty = 1), wit | D | tidak |
| FT-06 | Fitur turunan, NOT dan field-vs-field (P6b) | The stored rules have schema version 6 (`SR_SCHEMA`; 6 drops the maker-checker statuses and fields, RL-04, keputusan owner 2026-10-30; 2 added the Rec | D | tidak |
| FT-07 | Fitur turunan, NOT dan field-vs-field (P6b) | The values a rule used are kept as evidence: the value of each derived feature and of both sides of a field-to-field condition are in the facts of the | D | tidak |
| FT-08 | Fitur turunan, NOT dan field-vs-field (P6b) | The initial state does not change: with the pack off, `srEval` and the daily run of the 10 seed rules over the 60 customers, the 3 data presets and 3  | D | tidak |
| FT-09 | Fitur turunan, NOT dan field-vs-field (P6b) | In this stage the editor and the evaluator read only the features of the customer level (one value per customer: the Block A features of `ACT_FEATURES | D | tidak |
| PE-01 | Evaluasi rule per entitas (P6c tahap 2) | A rule may have a scope: `scope` = the kind of entity that makes the signals (goal, portfolio, product holding, recurring instruction, insurance polic | D | tidak |
| PE-02 | Evaluasi rule per entitas (P6c tahap 2) | A scoped rule is evaluated for each instance of the scope entity of each customer, and the instance matches when the customer conditions AND the condi | D | tidak |
| PE-03 | Evaluasi rule per entitas (P6c tahap 2) | A relation block follows ONE relation of the instance (one hop; the relations are a fixed list per kind of entity: holding to goal, portfolio to goal  | D | tidak |
| PE-04 | Evaluasi rule per entitas (P6c tahap 2) | The conditions of the scope and of the blocks use the attributes and the features of the entity they are about (ENT_FEATURES, through the unified cata | D | tidak |
| PE-05 | Evaluasi rule per entitas (P6c tahap 2) | The validation refuses: an unknown kind of entity, an attribute or feature that the kind does not have, a relation the kind does not have, a block wit | D | tidak |
| PE-06 | Evaluasi rule per entitas (P6c tahap 2) | A scoped rule makes ONE signal per matching instance: a customer with three matching goals has three signals, merged into ONE opportunity per (custome | D | tidak |
| PE-07 | Evaluasi rule per entitas (P6c tahap 2) | Dedupe and cooldown use a key of three parts, (rule, customer, instance): the same instance is not signalled again inside the cooldown of the rule (14 | D | tidak |
| PE-08 | Evaluasi rule per entitas (P6c tahap 2) | The evidence of a signal of a scoped rule holds, per instance: the kind and id of the instance, every attribute and feature of the instance the rule r | D | tidak |
| PE-09 | Evaluasi rule per entitas (P6c tahap 2) | The summary of the run of a scoped rule reports the number of instances evaluated, matched, not matched and not evaluable, next to the existing number | D | tidak |
| PE-10 | Evaluasi rule per entitas (P6c tahap 2) | A scoped rule needs the entity pack (EN-04, EN-06) and the sources of its kinds (EN-05): with the pack off, a source that is missing or too old for th | D | tidak |
| PE-11 | Evaluasi rule per entitas (P6c tahap 2) | The scope and the blocks are in the content of a rule version: saved, compared (Versions diff, with readable lines), restored, rolled back, duplicated | D | tidak |
| PE-12 | Evaluasi rule per entitas (P6c tahap 2) | The initial state does not change, with the pack off and with the pack on: `srEval` and the daily run of the 10 seed rules over the 60 customers, the  | D | tidak |
| PE-13 | Evaluasi rule per entitas (P6c tahap 2) | The evaluation per entity is pure and deterministic (the same input gives the same result, instances in the order of their ids) and never changes its  | D | tidak |
| PE-14 | Evaluasi rule per entitas (P6c tahap 2) | A scoped rule may have an OR across the levels: `anyOf`, 2 to 4 branches, each branch being the customer conditions (`customer`), the conditions on th | D | tidak |
| PE-15 | Evaluasi rule per entitas (P6c tahap 2) | The validation refuses an `anyOf` that has fewer than 2 or more than 4 branches, that has no scope, that has a branch of an unknown level, a branch wi | D | tidak |
| PE-16 | Evaluasi rule per entitas (P6c tahap 2) | The evidence of an instance of a rule with `anyOf` lists every branch with its state, the related record that satisfied a block branch with its values | D | tidak |
| PE-17 | Evaluasi rule per entitas (P6c tahap 2) | `anyOf` is part of the content of a rule version: saved, compared (Versions diff, a readable line with the branches joined by OR), restored (and remov | D | tidak |
| PE-18 | Evaluasi rule per entitas (P6c tahap 2) | The product holdings of the scenario R11 (HX-0201 to HX-0211, customers CUS-0141 to CUS-0150) are read by the evaluator from the repository like any o | D | tidak |
| UI-01 | Antarmuka evaluasi per entitas (P6c tahap 3) | Every new element of the interface for the evaluation per entity is rendered ONLY while the entity pack is active (EN-06), or, for evidence, when the  | D | tidak |
| UI-02 | Antarmuka evaluasi per entitas (P6c tahap 3) | The step "Conditions" of the editor has a control "Evaluate per": Customer (default, the rule is a customer rule) or one of the six kinds of entity. C | D | tidak |
| UI-03 | Antarmuka evaluasi per entitas (P6c tahap 3) | With a scope, the editor lists the conditions on the instance (add, change the field, the operator and the value, remove; all / any at the root) and a | D | tidak |
| UI-04 | Antarmuka evaluasi per entitas (P6c tahap 3) | With a scope, the editor has the group "Any of" (PE-14): 2 to 4 branches, each of the level customer, instance or related record (with its relation),  | D | tidak |
| UI-05 | Antarmuka evaluasi per entitas (P6c tahap 3) | The field list of a condition on an entity offers only the attributes and the features of that kind of entity (the kind of the scope, or of the relate | D | tidak |
| UI-06 | Antarmuka evaluasi per entitas (P6c tahap 3) | The labels of the fields of the entities are in the i18n files, in English and Indonesian, under `sr.efld.<id>` (every attribute and every feature of  | D | tidak |
| UI-07 | Antarmuka evaluasi per entitas (P6c tahap 3) | The result drawer of a rule with a scope shows one row per instance (the customer and the instance, the three states, the cause when it cannot be eval | D | tidak |
| UI-08 | Antarmuka evaluasi per entitas (P6c tahap 3) | An Opportunity Detail made by a rule with a scope shows, for each signal with an instance, the section "Triggering entity": the kind and the id, the v | D | tidak |
| UI-09 | Antarmuka evaluasi per entitas (P6c tahap 3) | Data & Integration shows a sixth row "Insurance system" only while the pack is active, with the status, the connection, the last load, the age, the th | D | tidak |
| UI-10 | Antarmuka evaluasi per entitas (P6c tahap 3) | The diff of two versions of a rule shows the lines of the scope, the relation blocks and the group "Any of" in the page of the rule and in the audit,  | D | tidak |
| UI-11 | Antarmuka evaluasi per entitas (P6c tahap 3) | The initial state does not change: with the pack off the 99 results of the seed rules (seed-eval-before.json), the golden DOM and the snapshots of the | D | tidak |
| UI-12 | Antarmuka evaluasi per entitas (P6c tahap 3) | The new controls have names for the screen readers, work with the keyboard, use tokens and multiples of 4px only, fit at 390px without a horizontal sc | D | tidak |
| PK-01 | Paket rule R01-R20 (draft) | The rule pack R01-R20 is DECLARATIVE data (`src/domain/rules/pack/`): one definition for each of R01 to R18 and R20 (R19 is not a rule of opportunity  | D | tidak |
| PK-02 | Paket rule R01-R20 (draft) | "Load the demo pack R01-R20" is a command of the Administrator only (denied and logged for any other role): it needs the entity pack on (when it is of | D | tidak |
| PK-03 | Paket rule R01-R20 (draft) | "Delete the demo pack" removes only the rules that carry the mark of the pack (a rule of the pack the user made a copy of, and every other rule, stay) | D | tidak |
| PK-04 | Paket rule R01-R20 (draft) | The pack is not a seed: it is not in `srSeed()`, not in the golden files and not in the initial state; until it is loaded everything is what it was, a | D | tidak |
| PK-05 | Paket rule R01-R20 (draft) | R05, R10, R16 and R18 are labelled "activity review" ("tinjauan aktivitas") in the name, the text "Why?" and the description, in both languages: they  | D | tidak |
| PK-06 | Paket rule R01-R20 (draft) | The cooldown of R20 is 14 days and the one of every other rule of the pack is 30 days; the type of opportunity of each rule is the one of the spec (th | D | tidak |
| PK-07 | Paket rule R01-R20 (draft) | Each of the 19 rules is proved with the real evaluator on the demo anchors of its scenario, against an oracle written from the text of the scenario (n | D | tidak |
| PK-08 | Paket rule R01-R20 (draft) | A draft of the pack takes no part in the daily run; once published and run on the demo data, a customer rule (R07), an entity rule (R04) and a rule wi | D | tidak |
| PK-09 | Paket rule R01-R20 (draft) | Data & Integration has a card "Goal and insurance entities" with a switch that only an Administrator sees and can use; it calls `applyEntPack` (EN-06, | D | tidak |
| PK-10 | Paket rule R01-R20 (draft) | The initial state does not change: with the pack off and the rule pack not loaded the 99 results of the seed rules (seed-eval-before.json), the golden | D | tidak |
| HM-01 | Home | Every role's Home has content: the hero (page heading) and at least one section, card or empty state; no role opens a Home that is only the sidebar | U | ya |
| HM-02 | Home | The Approver Home is the rules Home of the prototype (`srRoleHome`): the hero, four KPI cards (waiting for my review, approved not published, sent bac | D | tidak |
| HM-03 | Home | Every role's Home has the card Signal rules & data (`HomeRulesCard`, rows of the Home reminders `RemA` / `RemD` in a `Card`, "Open signal rules" on it | D | tidak |
| DT-01 | Signal rule detail | The Signal rule detail page has the layout of the Opportunity detail (`DetailLayout`: `.c3 .od`): the summary card and the tabs in the wide column on  | D | tidak |
| DT-02 | Signal rule detail | Order in the wide column (on the left since 2026-11-02, DT-01): alerts, summary card, tabs Overview, Logic, Proposal (only when there is a work versio | D | tidak |
| DT-03 | Signal rule detail | Special states are Alerts only when they are real conditions: paused (skipped by the daily run), rejected (with its reason; not repeated on the Propos | D | tidak |
| DT-04 | Signal rule detail | Actions per role: the page head has no View result since 2026-11-02 (DT-10: the result is the Overview tab); Pause / Resume and the workflow action of | D | tidak |
| DT-05 | Signal rule detail | `DetailLayout`, `DetailPanel` and `DetailSummary` (src/design-system/components/DetailLayout.tsx) are the one implementation of the detail frame: Oppo | U | ya |
| DT-06 | Signal rule detail | The conditions of a rule are one card, the same in the Logic tab ("Conditions") and the Proposal tab ("Rule logic"): the AND / OR sentence in regular  | D | tidak |
| DT-07 | Signal rule detail | The "Proposal" card of the Proposal tab shows where the work version is with the `Wizard` (variant `status`, `readOnly`: the steps are not buttons) Dr | U | ya |
| DT-08 | Signal rule detail | The two frames of the Signal rule detail have their contents swapped (owner decision 2026-11-02): the wide card of the left column (`DetailSummary`, ` | D | tidak |
| DT-09 | Signal rule detail | Compare versions (Versions tab) is one card: the heading, the two versions (From, To) in a padded row, then under a divider the heading Changes as the | D | tidak |
| DT-10 | Signal rule detail | On the Signal rule detail the result of the rule is NOT a drawer: the Overview tab holds the whole result (source line, the preset and Refresh, the no | D | tidak |
| DT-11 | Signal rule detail | The Administrator sees Reject next to Publish in the lifecycle panel of a rule whose work version is a proposal (it opens the Proposal tab and puts th | D | tidak |
| DT-12 | Signal rule detail | On the Overview tab of the Signal rule detail the customers of the result are a TABLE (`Table`), not cards and not rows that open: the columns Custome | D | tidak |
| DT-13 | Signal rule detail | The data of a result is TRANSPARENT for every role: real names, the relationship manager and the amounts, also for the Administrator, who sees every c | D | tidak |
| DT-14 | Signal rule detail | The View result drawer (from the rule list, the Proposal tab and the editor) has the content of the Overview tab: the toolbar, the KPI cards, the note | D | tidak |
| DT-15 | Signal rule detail | The changes of a proposal (Proposal tab, card Changes in this version) are the same table as Compare versions (`SrDiffTable`): the line Changes from v | D | tidak |
| AL-01 | Signal rule detail | The Activity log tab of the Signal rule detail lists the events of the rule with the existing History list item (`LogList`, the item of My log and of  | D | tidak |
| AL-02 | Signal rule detail | An item of the Activity log is the History list item: time · avatar of the actor · `<actor> <action>` (the actor is the trigger of the profile card, U | D | tidak |
| AL-03 | Signal rule detail | An event that belongs to a version (published, scheduled, paused, resumed, restored) with a matching row in Versions (same action, version and date) h | D | tidak |
| AL-04 | Signal rule detail | `SrEvent` has an optional time `tm` (`HH:MM`, device clock). Events written by the workflow carry it (`SrCtx.tm`); the seed events do not and show no  | D | tidak |
| AL-05 | Signal rule detail | Scope: the static variant of `LogList` is used by the Activity log tab of the Signal rule detail and, since 2.38, by the Recent activity drawer of the | D | tidak |
| PC-01 | Signal rule detail | What the profile card shows, by viewer (owner decision 2026-10-25, revision 3: fields NIK, branch and position now exist as demo data of the user dire | D | tidak |
| PC-02 | Signal rule detail | The profile card is a non-modal popover (`role="dialog"`, `aria-modal="false"`, labelled by the name) opened by a trigger button (`aria-haspopup="dial | U | ya |
| PC-03 | Signal rule detail | The profile card is placed next to its trigger (below by default, above when there is no room, shifted to stay inside the viewport) in a layer above t | U | ya |
| PC-04 | Signal rule detail | Layout of the profile card (owner reference image, revision 3), in tokens: a flat card (1px border, `--r-card`, no shadow, 260px wide, padding 16px) w | U | ya |
| PC-05 | Signal rule detail | Customer card: subtitle = segment (Priority / Affluent / Mass); rows NIK (masked: first 4 and last 4 digits, demo value derived from the customer id), | D | tidak |
| UN-01 | Signal rule detail | Wherever the name of a user (a staff member of the user directory: RM, supervisor, marketing, admin) is shown as a value or a label, it is the trigger | U | ya |
| UN-02 | Signal rule detail | The same for the name of a customer: wherever a customer name is shown as a value or a label it is a `CustomerName` (the trigger of the customer card, | U | ya |
| DS-01 | Design page | The Design page has a grouped contents list (Guide, Foundations, Components, Patterns & layout, Content & quality) and a search field | U | ya |
| DS-02 | Design page | What's new shows only the newest change (the highest version, rule DS-10) with View all, and the log has a search (keputusan owner 2026-10-24: was the | U | ya |
| DS-03 | Design page | Every user-facing text exists in English and Indonesian: the two i18n files have the same keys | U | ya |
| DS-04 | Design page | The Design page contents list follows the section in view and a click scrolls to the section and marks it | D | tidak |
| DS-05 | Design page | The Design page order: guide, foundations (with Motion), components, patterns and layout, content and quality; Signal rules is a page of Patterns & la | D | tidak |
| DS-06 | Design page | The Design page search is a 44px field and the contents list becomes wrapping chips below 1100px; there is no Previous / Next at the end of a section | U | ya |
| DS-07 | Design page | Colour tokens show their hex on the page and copy it on click | U | ya |
| DS-08 | Design page | The language toggle demo of the Design page (Selection controls) is visible whatever the state of the sidebar: collapsed (a phone, a window under 1100 | D | tidak |
| DS-09 | Design page | On a phone the API tables of the Design page keep a width of 920px (they scroll sideways) so that the Notes column is at least 200px wide and a row is | D | tidak |
| DS-10 | Design page | The "What's new" guide of the Design page shows only the newest entry (the highest version of the whole log, found in the data with `latestEntry`, not | U | ya |
| DS-11 | Design page | The rows per page select of the pagination keeps room for its value on a phone: at least 80px wide (`.pgn .selw{flex:none;min-width:112px}`; it was 46 | U | ya |
| DS-12 | Design page | The finished step of the chevron Wizard is brand-default in dark mode (white text 4.6:1), never a white box: `brand-strong-2` is navy in light and alm | U | ya |
| SN-01 | Design page | `Wizard` variant `status` shows no support caption ("Step 1", "Langkah 2"): the step has its title and its written status (Completed, In progress, Pen | U | ya |
| OR-01 | Design page | Lists of events come NEWEST FIRST: the Activity log of a rule (the day, then the reverse of the order the events were written in), the Activity log of | U | ya |
| BN-01 | Design page | Button names follow the writing rule of the Design System: sentence case (a capital only on the first word and on the names of the product: Take Actio | U | ya |
| DC-01 | Design page | The standing notes of a page (what was a `p.mut` between the page head and the content: Signal rules, Source systems of Data & Integration, Users & Ro | U | ya |
| DS-13 | Design page | The Design page contents list marks the section in view with `aria-current="location"` on exactly one entry (never `true`), follows the scroll of the  | D | tidak |
| DS-14 | Design page | The Design page search field (`#dsq`, the existing DS search Input) is a combobox: after 150 ms it lists up to 12 results built from the live page and | D | tidak |
| DS-15 | Design page | The Design page opens with a hero (`.dshero`, owner mockup 2026-10-25): the page title ("Design System") and the search field on a brand background (l | U | ya |
| DS-16 | Design page | The title of the Design page hero has a version badge next to it (`.dshero .top`): the highest version of the change log data (`DS_LIVE.version`, from | U | ya |
| DS-17 | Design page | Every component example of the Design page sits in a labelled row, like the Badge section: the variant name and the component name (`Icon stat · WIcon | U | ya |
| DS-18 | Design page | The version Chip of a row of the change log (What's new and View all) never shrinks: the row is a flex row and its first child, the Chip, has `flex:no | U | ya |
| DS-19 | Design page | The Design System has one page per item (61 since 2.118: Guide 3, Foundations 6, Components 35 in 7 kinds, Assembled components 8, Patterns 7, Content | U | ya |
| DS-20 | Design page | One example, one page: every example (`.dsx`) of the old sections is on exactly one page (the examples of all pages are the examples of the sections,  | D | tidak |
| DS-21 | Design page | The old section ids stay as aliases: `#/design/<old id>` (for example `forms`, `chips`, `overlays`) opens the page that took its place and rewrites th | D | tidak |
| DS-22 | Design page | The search of the Design page (`#dsq`, in the hero, DS-15) finds a PAGE by its name or an alias (the first group of the results; the code names are th | U | ya |
| DS-23 | Design page | Component names are the universal ones (owner decision 2026-11-12; audit `docs/design-system/menu-penamaan.md`): Wizard (was StepNav, classes `.wz-*`) | U | ya |
| DS-24 | Design page | Every page of Components and Patterns (and Principles) has a description under its title (`.dslead`), in English and Indonesian, of its own: not the l | U | ya |
| DS-25 | Design page | The order of the Design System is A to Z (owner decision 2026-11-13): the groups keep their order (Guide, Foundations, Components, Patterns & layout,  | U | ya |
| DS-28 | Design page | A change of the language on the Design System page keeps the page in view where it is on the screen: the pages are in A to Z order of the language sho | D | tidak |
| DS-26 | Design page | The custom properties have readable names (owner decision 2026-11-13: consistent abbreviations, semantic names for the neutral text colours, the old n | U | ya |
| TB-25 | Design page | A table that lists records sorts by its headers: a click on the header of a column sorts up, a second click down, a third puts the rows back in their  | U | ya |
| FP-01 | Design page | The popover of a field (the calendar of DateField, the list of MultiSelect and RichSelect, the country list of PhoneInput) is never clipped by a card, | U | ya |
| FP-02 | Design page | (replaces FM-11) No field of the product is a native date field: a date is the `DateField` (the calendar popover; `min` and `max` disable days; a valu | U | ya |
| TB-26 | Design page | The tabs Role mapping, Role definitions and Permission matrix of Users & Roles are tables of the List pattern like the tab Users (owner revision 2026- | U | ya |
| TB-27 | Design page | The page buttons of the Pagination: only the arrows `chevron_left` and `chevron_right` (icons, no "Previous" or "Next" text and no first / last page i | U | ya |
| TB-28 | Design page | The rows per page options stay 5, 10 and 25: the field reads `5 /page`, `10 /page` (the `suf` of FM-16) but the list that opens under it shows only th | U | ya |
| TX-01 | Design page | Every text key that the code asks for with `t('key')` exists in the English and in the Indonesian dictionary, so a raw key (such as the label `ff.time | U | ya |
| DS-27 | Design page | The search of the Design System also finds the code names, in groups under the pages (owner decision 2026-11-13, after the mockup): Pages (DS-22), Com | U | ya |
| DG-01 | Design page | The Design menu has a group of its own for assembled components (a component built from several components, with its own look and behaviour), between  | U | ya |
| VN-01 | Design page | The version of the design system and of the skill is three parts, `MAJOR.MINOR.PATCH`: MAJOR.MINOR is the number of the design system, PATCH is a fix  | D | tidak |
| SD-01 | Design page | The distribution of the skill has fixed names: marketplace and repository `praisindo-design-marketplace` (GitHub `aan-project/praisindo-design-marketp | D | tidak |
| SD-02 | Design page | A release of the skill raises `version` in `plugin.json` and in `marketplace.json` (the plugin entry and `metadata.version`) to the number of VN-01, a | D | tidak |
| RB-01 | Design page | The "Top pick" label of the recommendation plans (`.rxp-rib`) is a fill ribbon (not a badge) with WHITE text (`--color-text-white`) on `--color-surfac | D | tidak |
| PF-01 | Design page | (dihapus, keputusan owner 2026-10-25) The header of the profile drawer (`.pfb`) and its contrast rule: the profile drawer had no trigger since v1.66 a | D | tidak |
| BR-01 | Branding / Logo | One logo type: with an uploaded logo the sidebar shows only the logo (it already contains the name), never the name text next to it | U | ya |
| BR-02 | Branding / Logo | Without a logo the sidebar shows the initial and the application name | U | ya |
| BR-03 | Branding / Logo | The collapsed-sidebar mark is the favicon when a logo and a favicon exist, else the initial | U | ya |
| BR-04 | Branding / Logo | On a brand-colour surface (sign-in panel, page transition) the dark-mode logo is used (light as fallback), without a tile; no logo gives a light monog | U | ya |
| BR-05 | Branding / Logo | In dark mode the sidebar logo is the dark logo and falls back to the light one | U | ya |
| BR-06 | Branding / Logo | Branding is global and separate: app name, primary and secondary colour, light / dark logo, favicon, font, default mode and language; defaults are Kor | U | ya |
| BR-07 | Branding / Logo | A user preference never changes a brand colour: switching mode, language, font size or table size leaves the brand untouched | U | ya |
| BR-08 | Branding / Logo | The default language comes from the brand and the user can override it for themselves (a stored brand default applies, a user choice wins) | U | ya |
| BR-09 | Branding / Logo | The application is named Kora (owner decision 2026-11-15, rebrand): the default app name is `Kora`, the default logos are the Kora logos (owner files  | D | tidak |
| LG-01 | Tema / Bahasa / Preferensi | Sign-in is full screen with two framed panels (form and glass aura) and no role picker: the role is detected from the account | D | tidak |
| LG-02 | Tema / Bahasa / Preferensi | Five failed attempts lock sign-in for one minute | D | tidak |
| LG-05 | Tema / Bahasa / Preferensi | The sign-in screen fits a laptop viewport of 660px height without a vertical scroll (the form side pads 48px top and 16px bottom, the gap of the form  | D | tidak |
| TH-01 | Tema / Bahasa / Preferensi | Root tokens: --r-card 8px, letter-spacing .02em, page padding 24px, h1 is the xl heading size and weight 700 | U | ya |
| TH-02 | Tema / Bahasa / Preferensi | The density preference is gone: preferences are mode, font size, language, sidebar and table size only | U | ya |
| TH-03 | Tema / Bahasa / Preferensi | User preferences are stored locally per user and never touch the brand colours (separate keys) | U | ya |
| TH-04 | Tema / Bahasa / Preferensi | Icons are Material Icons, outlined by default, filled on request | U | ya |
| TH-05 | Tema / Bahasa / Preferensi | Language and theme are switchable from the sidebar footer (EN / ID and light / dark) | U | ya |
| TH-06 | Tema / Bahasa / Preferensi | The preferences drawer offers font size, language and table size (no density) and the table size reaches the tables | U | ya |
| TH-08 | Tema / Bahasa / Preferensi | Typography: page title 28px (regular size), body letter-spacing 2%, default font Figtree, page padding 24px, card radius 8px | U | ya |
| TH-09 | Tema / Bahasa / Preferensi | The user preferences (font size, language, table size, sidebar, theme) are local: they change the page for this user and survive a reload, and never c | U | ya |
| TH-10 | Tema / Bahasa / Preferensi | The font size preference scales the type (small / regular / large) and the table size preference changes the font size of the table text (the row padd | U | ya |
| TH-07 | Tema / Bahasa / Preferensi | Font default Fira Sans (400 / 500 / 700) | D | tidak |
| TH-11 | Tema / Bahasa / Preferensi | Opsi density preference | D | tidak |
| TH-12 | Tema / Bahasa / Preferensi | The 2% letter-spacing of the body (`--ls:.02em`, TH-08) belongs to Figtree: with any other brand font (Inter, Plus Jakarta Sans, Poppins, Roboto) the  | U | ya |
| LG-03 | Tema / Bahasa / Preferensi | Layar masuk memakai pemilih role | D | tidak |
| LG-04 | Tema / Bahasa / Preferensi | On the sign-in story panel (`.lga`) the text (brand name, pill, headline, sub line) has a contrast of at least 4.5:1 against the pixels behind it, in  | D | tidak |
| MB-01 | Mobile | On a phone the sidebar is replaced by a bottom navigation (four items and More) and an off-canvas menu | U | ya |
| MB-02 | Mobile | Bottom navigation targets are at least 44px high | U | ya |
| MB-03 | Mobile | No horizontal page scroll at 390px | U | ya |
| MB-04 | Mobile | Drawers are full screen on a phone | U | ya |
| MB-05 | Mobile | Below 640px the bottom navigation replaces the sidebar (touch targets 44px) and the page never scrolls sideways | U | ya |
| CL-01 | Cor / Token | Colours written explicitly in `src/design-system/tokens/palette.ts` are used verbatim: the neutral ramp N and the dark neutrals DK (light and dark), t | U | ya |
| CL-02 | Cor / Token | The contrast engine (`colorEngine.ts` `ramp`, `darkIntent`) derives every dark intent token that is not written in `DK_INTENT` (all 8 intents, a brand | U | ya |
| CL-03 | Cor / Token | A dark intent value written in `DK_INTENT` (palette.ts, empty today) is used verbatim by `buildTokens`; the other tokens of that intent stay derived | U | ya |
| CL-04 | Cor / Token | The text and icon of the warning soft badge in light mode are `--color-foreground-warning-strong` on `--color-surface-warning-subtle-1`: 1.92:1. No to | D | tidak |
| LY-01 | Grid 4px | Every px width, height, min- / max-width / height, padding, margin, gap, offset (top / right / bottom / left / inset), line-height, flex-basis, grid t | U | ya |
| LY-02 | Grid 4px | Exempt from the grid, never changed by it: border, outline, box-shadow and ring widths (1px, 2px); radius; font-size; letter-spacing; icon sizes 14 /  | U | ya |
| LY-03 | Grid 4px | Line-height is a px multiple of 4 or a `--lh-*` token (xs 16, sm 20, md 20, lg 24, h-sm 24, h-md 24, h-lg 28, h-xl 32px, defined in `01-base.css`); a  | U | ya |
| LY-04 | Grid 4px | In the browser, key elements are on the grid at 1440 and 390: button, input, select, the unified badge (one size, 20px high) and tab (sm / md / lg), t | U | ya |
| ES-01 | Grid 4px | The button of an empty state and of an error state (`ErrorState`, `StateErr`) is 16px under its description whatever the size of the state (sm, md, lg | U | ya |
| LD-01 | Grid 4px | While the page loads it never shows broken content, it shows a skeleton: until the application is drawn the page is a skeleton of the shell (the sideb | U | ya |
| LD-02 | Grid 4px | The skeleton that shows before the application is drawn is the skeleton of the page that will appear: the sign-in page gets the two panels of the sign | U | ya |
| PR-01 | Proses / penjaga | CSS is changed only with a targeted edit (exact string) or with postcss (parse, change nodes, serialize); never with regex / sed / search-and-replace  | U | ya |
| PR-02 | Proses / penjaga | The base selector of each key component is a single selector without prefix and carries its base properties: `.sgt` (position relative, inline-grid),  | U | ya |
| PR-03 | Proses / penjaga | Code the owner removed as unused stays removed (keputusan owner 2026-10-25): the profile drawer (`ProfileDrawer`), `profile-demo.html` with `src/demo/ | D | tidak |
| PR-04 | Proses / penjaga | No new component without the owner's explicit permission: no new TSX component, no new variant, no new class that replaces the job of a design-system  | U | ya |
| PR-05 | Proses / penjaga | A pill, tag or chip (category, level, label) is the Badge (`.bdg` soft); a status is the Badge with its icon; a count, a tag, a name, a version and an | U | ya |
| VR-01 | Proses / penjaga | Visual snapshots are compared with `maxDiffPixelRatio` 0.002 at most (key pages and small component sections 0.001 where stable) so that a broken comp | D | tidak |
| VR-02 | Proses / penjaga | The visual spec checks the size of the key components on the Design page (SegmentedControl thumb inside its toggle, switch track 40x24, badge height a | D | tidak |
| VR-04 | Proses / penjaga | The pixel `threshold` of a visual snapshot is 0.2, and 0.1 for the sign-in screen only (`login-*`, all four variants; `tests/e2e/visual/tolerance.ts`, | D | tidak |
| VR-05 | Proses / penjaga | Design page section snapshots wait for the section to be stable before the screenshot (fonts ready, two equal heights 200ms apart); a snapshot that fa | D | tidak |
| ID-01 | Identitas dan organisasi | Kora is signed in through SSO Cashdoor and manages no account: it does not create, deactivate or reset one and stores no password of Cashdoor users; ' | D | tidak |
| ID-02 | Identitas dan organisasi | The Administrator of Kora maps the roles of the identity source to the four Kora roles (Users & Roles, tab Role mapping, React key `rolemap`); the def | D | tidak |
| ID-03 | Identitas dan organisasi | The sign-in screen has the button 'Sign in with Cashdoor' (in the prototype it opens a drawer labelled Cashdoor (demo) with the people who can sign in | D | tidak |
| OG-01 | Identitas dan organisasi | Every person has an id, a role, at most ONE manager (`managerId`, empty for the top of a branch and for Admin), a unit and a position from the identit | D | tidak |
| OG-02 | Identitas dan organisasi | The team of a person is all their subordinates at any depth (`subordinatesOf`, safe against a cycle): the scope 'team' of records covers the RMs under | D | tidak |
| OG-03 | Identitas dan organisasi | Role (capability) and position (place in the hierarchy) are separate: there are still four roles (RL-01); the role `sup` is the Branch Manager (label  | D | tidak |
| OG-04 | Identitas dan organisasi | Data that is missing or wrong never becomes a silent 'no team': an unknown role, a manager that does not exist or is not a manager, a person who is th | D | tidak |
| OG-05 | Identitas dan organisasi | A move in the hierarchy takes effect without a step by hand: the new manager has the person in their team and the old one does not, and the opportunit | D | tidak |
| OG-06 | Identitas dan organisasi | Users & Roles lists the people of the identity source read only: no Edit, create, invite or deactivate; columns role, position, manager, status and la | D | tidak |
| EX-01 | Export | The Export drawer (every list, detail, Analytics and Reports export) is one screen with these fields in this order: Rows (a Select of the scopes with  | U | ya |
| EX-02 | Export | Choose columns is a second drawer on top of the Export drawer (layer l2, with Back), opened from Data to send (Selected columns): a search, the column | U | ya |
| EX-03 | Export | The presets of Choose columns: Essential (`EXP_ESSENTIAL`, 12 for opportunities; not shown for a kind without one), All (every allowed column) and My  | U | ya |
| EX-04 | Export | After an export the drawer shows what was made (file, records, format, size), says the file was made on the device, and offers Close, Change settings  | U | ya |
| EX-05 | Export | File type is a row of `Chip`s (selected = soft brand, an unavailable format is disabled), one or more can be chosen, each format makes its own file, t | U | ya |
| EX-06 | Export | Recipients (only with Send via email) is a multi-select field: the chosen people are removable chips; a list of suggestions appears under the field on | U | ya |
| EX-07 | Export | A new export has NO file type chosen (no chip is selected; Export asks for at least one, EX-05; owner decision 2026-11-10) and the option Download fil | U | ya |
| EX-08 | Export | In the Export drawer of an opportunity or a customer (the kinds with a detail level) the level is a field of chips like File type, one of two (Summary | U | ya |
| PD-01 | Export | The page Products & rates (route `catalog`) is open to every role. For an Administrator it stays under Rules (a Rules group item); for the other roles | D | tidak |
| PD-02 | Export | Rates and fees are shown as the source system sends them and cannot be changed in this product, for any role: there is no input or any other control t | D | tidak |
| PD-03 | Export | There are nine categories: Mutual fund, Bonds, CASA, Time deposit, FX, Stocks, ETF Gold (added 2026-11-11, DS 2.69: key `gold`, sub classes domestic a | D | tidak |
| PD-04 | Export | The list is the List pattern WITHOUT a card: stat cards, then the toolbar (SearchBar, Advanced filter with a count, Show / hide columns last), then th | D | tidak |
| PD-05 | Export | The product detail is a full page (not a drawer) with a breadcrumb, `DetailLayout` in two columns (the wide column on the left with the charts and tab | D | tidak |
| PD-06 | Export | Customers holding a product follow the scope of the role: an RM sees the own customers, a Supervisor the team (the whole subtree of the hierarchy), Ma | D | tidak |
| PD-07 | Export | The logo of an issuer or a product is `ProductLogo`: a white box with a border and the image inside (`object-fit: contain`), white in light and in dar | D | tidak |
| PD-08 | Export | Charts of the detail go through the `ApexChart` adapter with the default legend (no inline legend of our own): the NAV or price is a line with the per | D | tidak |
| PD-09 | Export | The recommendation engine is not changed: the ten products of `createCatalog` keep their codes and values, the engine keeps its own classes (`Product. | D | tidak |
| PD-10 | Export | An Administrator switches the availability of one product (the switch of its row) or of the selected rows (the bulk bar of the checkboxes, with the nu | D | tidak |
| TB-18 | Export | Tables of the table kit: a cell of `.tw th` and `.tw td` has 12px padding above and below whatever the table size (the table size still sets the font  | U | ya |
| TB-19 | Export | A link in a table (`a` and the link button `a.btn.b-link` inside `.tw`) has the neutral text colour, no underline and the weight of its cell; the titl | U | ya |
| TB-20 | Export | A long name in a table cell: the product cell of the product list is at most 320px wide (`.tcl`); a longer name is cut in the middle with an ellipsis  | U | ya |
| TB-21 | Export | The tabs of a list page sit in a `.srtabs` wrapper inside the card body (Users & Roles, Signal rules, Marketing and the product tabs; Activities has n | U | ya |
| TB-29 | Export | The variant of the tabs follows where they sit, on every page: tabs OUTSIDE a card use the underline variant (the tabs above the card of My log; the t | U | ya |
| TB-30 | Export | A segmented tab is as wide as its label: it never grows to fill the tab bar (the bar may fill the width, the tabs sit at the left as on the Tabs page) | U | ya |
| TB-31 | Export | A stat card above a table is a filter of that table: pressing it narrows the rows to its group, pressing it again (or Total) shows every row (`StatCar | U | ya |
| TB-22 | Export | The columns of the Activities list after Activity are Customer, Opportunity, Status, Channel and Due (Status next to Opportunity, so it is seen at onc | D | tidak |
| TB-23 | Export | The line under the main text of a table cell (a code, an id, a date: `.mut`) is `--fs-xs` with 4px above it, as the direct `.mut` of a cell (TB rule o | U | ya |
| TB-24 | Export | The table of the Monitoring tab of Signal rules is a table of the List pattern like every other (TB-01, TB-03, TB-06, TB-07, TB-11): the toolbar (sear | D | tidak |
| TH-13 | Export | Weights: every bold text (the class `fw6`, a name, a value, a label) is `font-weight:500`; only an `h2` (TH-14), the title of the hero (`.dshero-t`) a | U | ya |
| TH-14 | Export | Every `h2` is at least 600: the base rule `h2` is 600 and no rule for an h2 sets a lower weight; the title of the hero `.dshero-t` is 600 and its note | U | ya |
| PR-06 | Export | No hint, tip or note says that the product is a prototype or a demo (a provenance badge Demo data, a line Prototype:, a note about demo data or simula | U | ya |
| PD-11 | Export | A percentage with decimals in Products & rates (returns, rates, fees, weights, chart labels) always shows two digits after the point (0.40%, 6.78%) | D | tidak |
| PD-12 | Export | The product detail: the page title is "Product detail" and the product name is the heading next to the logo; the left column starts with the product h | D | tidak |
| PD-13 | Export | The price chart of the product detail has a date range field (`DateField` mode range) at the right of the period toggle; choosing a range replaces the | D | tidak |
| PD-14 | Export | Product detail (owner revision 2026-11-11): the right column is Availability, Key information, then Documents (Documents under Key information); Key i | D | tidak |
| CT-01 | Export | (corrected 2026-11-17: the first reading copied the Return by period look; the owner wants the opposite) Every line or area chart is drawn like the Op | U | ya |
| CT-02 | Export | The legend of every chart, of the application and of the Design System, is under the chart (`legend.position: 'bottom'`, done once in `withChart`, `le | U | ya |
| PD-15 | Export | In the Products & rates list the count on a tab is the number of products of that category that pass the filters in use (the search and the Advanced f | D | tidak |
| WG-01 | Export | In every widget, KPI and `Delta` a number that goes up is green (success) and one that goes down is red (danger), 0 is neutral, whatever the metric; t | U | ya |
| WG-02 | Export | The header of every card (`.ch`) has 16px padding on all sides | U | ya |
| WG-03 | Export | The `HighlightText` (named `Statistic` in 2.101) is the pair of a small text and a highlighted text (a figure, an object or a value to stress) with th | U | ya |
| WG-04 | Export | The cards that show one number, the KPI card and the stat card (and their variants: icon, ring, solid, compact, with a sparkline or a footer band), ar | U | ya |
| WG-05 | Export | The names of the number cards follow their family and never start with `W` (a `W` name is a widget): the KPI family is `KPI`, `KpiCompact` and `KpiTre | U | ya |
| WG-06 | Export | When a row holds more than one stat card (`StatCards`), no two cards have the same colour: a card keeps the intent it was given when it is the only on | U | ya |
| WG-07 | Export | A number card has looks (variants) and its place decides which one is shown: the stat card has the looks of its family, Ring (default, `StatCards`), I | U | ya |
| WG-08 | Export | A number that goes up or means a gain is green and a number that goes down or means a loss is red, wherever it is written and not only in a `Delta` ch | U | ya |
| WG-09 | Export | The chart of a number that goes up or means a gain is brand and the chart of a number that goes down or means a loss is red (danger): the sparkline of | U | ya |
| WG-10 | Export | The number cards can be one card instead of separate cards, by a choice of the user in My Preferences, Number cards (two places, `statGroup` and `kpiG | U | ya |
| WG-11 | Export | The KPI and stat cards do not use the class `wg-sml` (`KpiCompact` writes its value at the normal widget size), and the stat card has the look Soft (` | U | ya |
| WG-12 | Export | The border of a number card that is a filter and is active (pressed) is soft and follows the colour of the card: 40% of the intent colour over the neu | U | ya |
| WG-13 | Export | The Total card of a row of stat cards (the key `all`, `c:all` and the like: the card that stands for no filter) is never shown active: with no status  | U | ya |
| HT-01 | Export | The `HighlightText` is a category of its own: its code is in `components/HighlightText.tsx` and `styles/70-highlight-text.css` (classes `.hlt`, `.hlt- | U | ya |
| TS-01 | Export | The toast is a dark pill: the black surface (`--color-text-black`) with white text, the radius of the Alert (`--r-card`), and a dot of 8px in the colo | U | ya |
| UP-02 | Export | The states of a file row of the upload are shown by the ring, the tile and its icon (all three take the colour of the scenario: the soft tint and the  | U | ya |
| UP-03 | Export | A file row of the upload (as in the owner's chosen simulation) is the round tile with the icon of the file type (pdf, table, image, document) inside t | U | ya |
| UP-04 | Export | The file upload checks every file against its rules and refuses the ones that do not fit: over the size (`maxMb`, as the prototype), a type that is no | U | ya |
| UP-01 | Export | When a file is added to the file upload, a ring fills around its icon (`--fdl-p`, 0 to 100, about 0.8 s; at once when motion is off) and turns green w | U | ya |
| MO-01 | Gerak (motion) | Between ordinary pages the content of the new page (`.ct > *`) fades in over 0.2 s (token `--dur-page`, keyframes `pgfade`, no fill after the end); no | U | ya |
| MO-02 | Gerak (motion) | The numbers of the stat cards, the KPI and the widgets count up once from 0 to their value in 0.6 s when they appear, through the prop `animate` of th | U | ya |
| MO-03 | Gerak (motion) | Motion stands still, and the final screen is shown at once, when the system asks for reduced motion and in automated browsers (tests and screenshots), | U | ya |
| MO-04 | Gerak (motion) | The motion layer has three durations and one easing (`--dur-fast` .12 s, `--dur-base` .2 s, `--dur-slow` .32 s, `--ease-out`), plus `--ease-spring` fo | U | ya |
| MO-05 | Gerak (motion) | Quick feedback and entrances: a button presses in (scale .98) with its colours easing in .12 s; table cells and chips ease their colour; a popover (`. | U | ya |
| MO-06 | Gerak (motion) | The first eight rows of a table fade in 20 ms apart; a row with the class `mo-new` glows brand-subtle and fades back in 1.2 s; the Activities list set | U | ya |
| MO-07 | Gerak (motion) | Status: in the vertical Wizard the line under a finished step draws downward (.32 s) and the waiting step has a soft ring that pulses every 2 s; the t | U | ya |
| MO-08 | Gerak (motion) | Hover of the buttons (the option "Fluid", owner decision 2026-11-14): fill gets a light sweep and grows to 1.02; soft fills like liquid from below wit | U | ya |
| MO-09 | Gerak (motion) | The exact values of MO-08 are as built: the sweep of the fill uses `color-mix` of `--color-text-white` (30%) over `--dur-slow` (.32 s, because of MO-0 | U | ya |
| AX-01 | Aksesibilitas | Keyboard focus is a 2px outline in the strong brand border colour and is never removed | U | ya |
| AX-02 | Aksesibilitas | Motion is switched off when the system asks for reduced motion (pulse, veil, sidebar, steps) | U | ya |
| AX-03 | Aksesibilitas | Every role has an axe budget; a rule not listed has budget 0 and the budget is the frozen prototype's own violations (it only goes down, or up by an o | D | tidak |
| AX-04 | Aksesibilitas | Light and dark themes use the same token names; the dark palette is computed to keep text contrast (>= 4.5:1) on the card surface | U | ya |
| CODE-01 | Aksesibilitas | No <b> tag in the markup: bold text uses the font-weight class (fw6) | U | ya |
| CODE-02 | Aksesibilitas | No literal colour in a component (tokens only): no hex colour in src/design-system/components or features outside the colour demo | U | ya |
| RL-01 | Peran dan izin (RL) | The only roles are Administrator, Relationship Manager, Supervisor and Marketing (`RoleKey` = adm, rm, sup, mkt). The Approver and Auditor roles are g | D | tidak |
| RL-02 | Peran dan izin (RL) | There is no maker-checker. Nobody reviews or approves a rule: there is no review step, no approval status, no approval badge, no reviewer, no review q | D | tidak |
| RL-03 | Peran dan izin (RL) | An Administrator rejects a proposal with a reason (required, up to 300 characters; the Reject button of the Proposal tab or the row menu). The proposa | D | tidak |
| RL-04 | Peran dan izin (RL) | Rules stored in the old shape are migrated by `srMig` (schema 6) without a change of their evaluation: a stored `changes` (changes requested) becomes  | D | tidak |
| RL-05 | Peran dan izin (RL) | The Supervisor Home shows four KPI cards of the proposals of the person who is signed in (the rules they own; a revision of a published rule counts as | D | tidak |
| RL-06 | Peran dan izin (RL) | There is no self-approval error: an Administrator publishes their own rule (RL-02), so the message `sr.e.self` does not exist, no code path returns it | D | tidak |
| RL-07 | Peran dan izin (RL) | There is no "Use a template" feature: the rule editor starts empty (no name, no objective, the default type and severity, one empty condition), withou | D | tidak |
| RL-08 | Peran dan izin (RL) | The maker deletes a rule that is a draft, a proposal or rejected (`srCanDelete`, `srDelete`; the row menu of the Library and the Proposal tab and the  | D | tidak |
| BK-01 | Peran dan izin (RL) | The Back icon of a page that has one (Opportunity detail, Customer 360, Signal rule detail, Signal rule editor) goes back to the screen the person cam | U | ya |
| MN-01 | Peran dan izin (RL) | An action menu (`.pop` without `.upop`: the row menu of every table, the node menu of the builder) is a column as wide as its widest item (176 to 320p | U | ya |
| MN-02 | Peran dan izin (RL) | The ⋮ menu of a condition row and of a group row opens and stays open; every item can be chosen with the mouse, the keyboard (Enter opens, the first e | U | ya |
| DK-01 | Keputusan baku (DK) | Adding or editing data, short or long, is a form PAGE (route `<list>/new`, `<list>/<id>/edit`; page layout `detail` like the Signal rule editor; bread | U | ya |
| DK-02 | Keputusan baku (DK) | A form page of several groups of fields, and a flow with several steps, is a stepper form page: every group of fields is a step of the `Wizard` (the n | U | ya |
| DK-03 | Keputusan baku (DK) | Changing ONE value (a switch, a status, a role) is a control in place, saved at once, with a toast and a way to undo; not a drawer or a page | U | ya |
| DK-04 | Keputusan baku (DK) | A contextual ACTION (assign, reject with a reason, take action, log an outcome) is a centred dialog when it needs 1 to 2 inputs and a drawer size sm w | U | ya |
| DK-05 | Keputusan baku (DK) | A bulk action is a bulk bar in its own row above the table; its parameters are in a dialog; an action that cannot be undone is confirmed | U | ya |
| DK-06 | Keputusan baku (DK) | Import is a stepper page (file, column mapping, validation, result); Export is a dialog or a drawer size sm (the Export drawer, EX-01), a page only wh | U | ya |
| DK-07 | Keputusan baku (DK) | Settings are a settings page, one card per section, saved per section | U | ya |
| DK-08 | Keputusan baku (DK) | A list of records is the List pattern (TB-17): stat cards, tabs (optional), toolbar (search combo, Advanced filter, Show / hide columns), table, stand | U | ya |
| DK-09 | Keputusan baku (DK) | One record in full is a detail page with one layout of the catalogue (two columns, three panels, or long page with jump rail) and the page layout `det | U | ya |
| DK-10 | Keputusan baku (DK) | A quick look without leaving the page is a read-only drawer (no form field) with a link to the full page | U | ya |
| DK-11 | Keputusan baku (DK) | Search, filter and columns are the Advanced filter drawer and the Show / hide columns drawer, size sm, opened from the toolbar | U | ya |
| DK-12 | Keputusan baku (DK) | The history of events is the Activity log list (`LogList`), or the List pattern for an audit table | U | ya |
| DK-13 | Keputusan baku (DK) | Confirmations are centred dialogs by consequence: `danger` (cannot be undone), `confirm` (an important normal action), `warning` (leave with unsaved c | U | ya |
| DK-14 | Keputusan baku (DK) | Success is a toast (a success dialog only when the person must know before going on); validation is the message in the field then one Alert after Save | U | ya |
| DK-15 | Keputusan baku (DK) | Every page uses ONE layout of the catalogue and declares it (`PAGE_LAYOUT`); no page layout is composed from loose elements; one `fill` button per are | U | ya |
| DK-16 | Keputusan baku (DK) | Tokens and existing components only; no local CSS for layout, colour, spacing or weight; a deviation goes to the owner as a proposal (PR-04, LY-01) | U | ya |
| DK-17 | Keputusan baku (DK) | On a form page the title of a card is never the title of the page (a card says what its fields are: Brief basics, Threshold, Report settings); a form  | U | ya |
| DK-18 | Keputusan baku (DK) | The record of a problem report (`#/issues/<id>`, page key `issuesd`), an engagement request (`#/marketing/request/<id>`, `mktreq`) and a read-only eng | U | ya |
| DK-19 | Keputusan baku (DK) | The toast (the feedback of an action) is fixed at the bottom right, 24px from the edges | U | ya |
| DK-20 | Keputusan baku (DK) | A field popover (date, country code, multi select, rich select) is fitted to the viewport when it opens: moved inside the left and right edges (8px) a | U | ya |
| DK-21 | Keputusan baku (DK) | A long form (five groups of fields or more, the engagement brief) has the vertical Wizard as its rail in the right column (DK-24), never a jump rail:  | U | ya |
| DK-22 | Keputusan baku (DK) | Every list page has the layout of the Signal rules page (the List pattern, DK-08 and TB-17): the stat cards on top, then ONE card with the tabs (`.srt | U | ya |
| DK-23 | Keputusan baku (DK) | Activity log policy, Source systems and External signals are long pages of several cards and have a jump rail (DK-21: `AnchorNav`, one group per card) | D | tidak |
| DK-24 | Keputusan baku (DK) | Every form page (DK-01) of several groups of fields (the Marketing brief and segment forms, the rule editor, the forms of Data & Integration, Configur | U | ya |
| DK-25 | Keputusan baku (DK) | The number in the circle of the jump rail (`.anv-n` of the `AnchorNav`) is in the secondary text colour (`--color-text-secondary`) when it is neither  | U | ya |
| DK-26 | Keputusan baku (DK) | On a form page, above the card of actions, the right panel always holds the tools row: Tips (a lightbulb with a count) and Recent activity (a history  | U | ya |
| GN-01 | Aturan otomatis (GN) dan pencatatan aturan (RG) | Every application has an Activity history item in the user menu (under My preferences, above Sign out) that opens the page of what the signed-in user  | U | ya |
| GN-02 | Aturan otomatis (GN) dan pencatatan aturan (RG) | Every application has Notifications built by default: the bell, the dropdown and the drawer of NT-01 to NT-12; the categories (three to five) and the  | U | ya |
| GN-03 | Aturan otomatis (GN) dan pencatatan aturan (RG) | Every badge has its hover tooltip automatically (BD-13) from one central map (`badgeProps(domain, value)`): a `Badge` carries `domain`, `what`, `tip`  | U | ya |
| GN-04 | Aturan otomatis (GN) dan pencatatan aturan (RG) | Every name of a user of the application is the trigger of the profile card (`UserName`, UN-01, PC-01 to PC-04), whose fields are defined for the proje | U | ya |
| GN-05 | Aturan otomatis (GN) dan pencatatan aturan (RG) | The motion layer (MO-01 to MO-07, AX-02) runs by itself: the application has no `@keyframes` and no `transition` or `animation` with a literal time ou | U | ya |
| GN-06 | Aturan otomatis (GN) dan pencatatan aturan (RG) | What a piece of work makes obsolete is deleted in the same work: starter example pages and routes, unused menu entries, routes, components, styles, i1 | U | ya |
| RG-01 | Aturan otomatis (GN) dan pencatatan aturan (RG) | Every rule the owner gives, in a prompt, in chat or in an image, and every rule the agent creates by itself (a default, a generated feature, an audit  | U | ya |
| RG-02 | Aturan otomatis (GN) dan pencatatan aturan (RG) | A new or changed rule that contradicts a rule that already exists is NOTICED to the owner at once, in the same reply, before anything is built on it:  | U | ya |
| RG-03 | Aturan otomatis (GN) dan pencatatan aturan (RG) | The register and the skill agree: at each update of the skill (`docs/design-system/skill-sync.md`) every register id is classified for the skill (gene | U | ya |
| RG-04 | Aturan otomatis (GN) dan pencatatan aturan (RG) | A rule or decision the agent creates on its own is never `aktif` by itself: it stays `perlu keputusan owner` in the Konflik section, with the reason i | U | ya |
| SK-01 | Aturan otomatis (GN) dan pencatatan aturan (RG) | The skill audit does not flag an `Alert` of intent `info` or class `al i-info` on first open: it is the note of a page or drawer that is a box of its  | D | tidak |
| SK-02 | Aturan otomatis (GN) dan pencatatan aturan (RG) | The skill audit does not flag FM-01 on a `SegmentedControl` that sets a preference (`setPref(`): it is a choice that applies at once, not a form field | D | tidak |
| SK-03 | Aturan otomatis (GN) dan pencatatan aturan (RG) | `compare-ds.mjs` of the skill accepts a rendered DOM match of at least 95%, and 65% for the sidebar and 90% for the Design page, because the starters  | D | tidak |
| RLG-01 | Rules log (RLG) | The page Principles of the Design System (`#/design/principles`) is the Rules log: it no longer shows the six old principles. The card shows the lead, | D | tidak |
| RLG-02 | Rules log (RLG) | View all opens a Drawer of size xl titled Rules log with the status tabs and their counts (All, Active, Replaced, Pending owner), the search combo (Se | D | tidak |
| RLG-03 | Rules log (RLG) | In the Rules log the Status is a Badge of the central map (domain `ruleLogStatus`: Active success, Replaced neutral, Pending owner warning, each with  | D | tidak |
| RLG-04 | Rules log (RLG) | Export of the Rules log writes a CSV of the rows the person sees (search, filters, tab and sort applied, the visible columns), named `rules-log-YYYY-M | D | tidak |
| XR-01 | Permintaan eksekusi (XR) | "Customer agreed" saved by the RM makes an execution request (id REQ-xxxx) with the opportunity, activity, customer (CIF derived from the customer id  | D | tidak |
| XR-02 | Permintaan eksekusi (XR) | The RM no longer picks "Converted": the outcome list has "Customer agreed" (`agreed`) in its place. A conversion is the outcome `converted` that the s | D | tidak |
| XR-03 | Permintaan eksekusi (XR) | The fields below the common block of a request are configuration per category (`EXEC_SCHEMA`: key, type, required, options; labels `xr.f.*`, options ` | D | tidak |
| XR-04 | Permintaan eksekusi (XR) | The check of the risk profile holds the save: an expired profile or a product riskier than the profile is a real condition (a warning Alert shown only | D | tidak |
| XR-05 | Permintaan eksekusi (XR) | The email has one fixed format per category: subject `[Kora] <request> REQ-xxxx`, the common block (customer CIF, RM, the day the customer agreed), th | D | tidak |
| XR-06 | Permintaan eksekusi (XR) | Data & Integration › Execution routing (Administrator): for each of the eight categories a team, a group address (checked, empty = no route) and the w | D | tidak |
| XR-07 | Permintaan eksekusi (XR) | The source system confirms by itself: the key is the customer, the product, the amount (±1%) and a date on or after the day the customer agreed, in th | D | tidak |
| XR-08 | Permintaan eksekusi (XR) | Working days are Monday to Friday (bank holidays are a production item). Overdue is derived. Reminders (notifications, NT-03): overdue to the RM and t | D | tidak |
| XR-09 | Permintaan eksekusi (XR) | The request is shown on the Opportunity detail to the roles that see the opportunity (RM own, Supervisor the team at any depth, Marketing by scope); t | D | tidak |
| XR-10 | Permintaan eksekusi (XR) | Every request created, email sent, email failed, email resent, request confirmed or cancelled, route changed and test email sent is an entry of the ac | D | tidak |
| XR-11 | Permintaan eksekusi (XR) | The product of the form is chosen from the catalogue of Products & rates and only the available products of the category are offered | D | tidak |
| XR-12 | Permintaan eksekusi (XR) | While an opportunity has an execution request that is not confirmed or cancelled (waiting, overdue or failed), Take Action is closed on the Opportunit | D | tidak |
| XR-13 | Permintaan eksekusi (XR) | When the RM picks "Customer agreed", the category, the product and the amount are filled in from the recommendation the RM selected on the opportunity | D | tidak |
| XR-14 | Permintaan eksekusi (XR) | The card of an execution request on the Opportunity detail has, from the top: the steps across (`Wizard` status with `detail`, the waiting step in war | D | tidak |
| XR-15 | Permintaan eksekusi (XR) | A request has an Order type (rule of 2026-11-10: a recommendation is not always a purchase): the first field after the product, with the options of th | D | tidak |
| RK-01 | Skala risk (RK) | The risk scale is configuration (`domain/risk/scale.ts`), not code: a list of levels from the lowest, each with its name and the colour of its badge b | D | tidak |
| RK-02 | Skala risk (RK) | Data & Integration › Source systems has a card "Risk profile mapping": a table of the codes the source system sends for the risk profile and the level | D | tidak |
| NT-01 | Notifications | The bell is an icon-only button (Material Icons outlined `notifications`, 18px) in the util row of the sidebar footer, right of the theme button and l | U | ya |
| NT-02 | Notifications | The bell opens a DROPDOWN to the right of the sidebar, like the user menu (a phone: across the screen above the bottom bar): the title with "Mark all  | U | ya |
| NT-03 | Notifications | Notifications are DERIVED on render from records the app already keeps (rules and their events, the daily run, the state of the source systems, opport | D | tidak |
| NT-04 | Notifications | The read state is kept in the browser per account (role and email of the session) under `kora.react.notifread`, survives a reload, never reaches anoth | D | tidak |
| NT-05 | Notifications | Who gets what. Administrator: a proposal waiting for a decision, a rule held by the flood check, a source that is not connected or not fresh, the summ | D | tidak |
| NT-06 | Notifications | Every title and summary exists in English and Indonesian, and the relative time (today, yesterday, N days ago) is counted from the demo clock (`TODAY` | U | ya |
| NT-07 | Notifications | A notification carries only business values: the name of a rule, an opportunity id, a product, a count, the name of the proposer or a source; never a  | D | tidak |
| NT-08 | Notifications | The initial state is unchanged: opening a page shows no Alert, no toast and no extra request because of notifications, the pages and their data are th | U | ya |
| NT-09 | Notifications | "View all notifications" closes the dropdown and opens a right-hand Drawer (sm) with EVERY notification of the last 3 months, read and unread, newest  | U | ya |
| NT-10 | Notifications | Every kind of notification belongs to one category: Rules (proposal, held, review, published, rejected, paused, deleted), Data (source, run) or Work ( | D | tidak |
| NT-11 | Notifications | Only the last 3 months are listed (`ntSince`: three calendar months before the demo date, `TODAY`): an older fact is not a notification, in the dropdo | D | tidak |
| NT-12 | Notifications | Layout of the notification screens (owner 2026-11-02): the drawer body gap is 16px (`.db`), the rows (`.nti`) have no radius, the group label above th | U | ya |
| AU-01 | Preview of an audience (AU) | The preview of an audience (the card Preview of the audience builder, the card Audience preview of an engagement request) is the stat cards (customers | D | tidak |
| SQ-01 | Pencarian sidebar (SQ) | The sidebar has a search field under the logo (`GlobalSearch`, `.sse`) that searches the PAGES of the menu of the role (and the entries of its user me | U | ya |
| SQ-02 | Pencarian sidebar (SQ) | The results open in a popover to the RIGHT of the sidebar (the position of the user menu), in groups Pages and Content with their counts; a result sho | U | ya |
| SQ-03 | Pencarian sidebar (SQ) | Enter or a click on a Page opens its route; on a Content result it opens the article with the word marked in its text (`mark.sqm`, the first match scr | U | ya |
| SQ-04 | Pencarian sidebar (SQ) | The field is in the sidebar for every role, between the logo and the menu, also in the off-canvas menu of a phone (the popover is then as wide as the  | U | ya |
| PP-01 | Panel shell (PP) dan font weight (FW) | My Preferences, under Font size, has "Panel items": for each of Search, Language, Light and dark, Notifications, Scenarios and Profile a choice Sideba | U | ya |
| PP-02 | Panel shell (PP) dan font weight (FW) | The action row of the sidebar (language, light and dark, notifications, scenarios) shows at most three items; with more than three the first three sta | U | ya |
| PP-03 | Panel shell (PP) dan font weight (FW) | The toolbar (`header.topbar.tool`) holds the items put there by PP-01, on a desktop only, at the top of the main column; it is NOT frozen: it scrolls  | U | ya |
| PP-04 | Panel shell (PP) dan font weight (FW) | My Preferences has Font size and Table size as segmented choices (`SegmentedControl`, full width), no Sidebar setting (the sidebar is automatic by the | U | ya |
| PP-05 | Panel shell (PP) dan font weight (FW) | My Preferences has a third drawer, Number cards (a link row under Panel items, opened with Back like the second drawer, DR-03): the places of the numb | U | ya |
| PP-06 | Panel shell (PP) dan font weight (FW) | The Preferences drawer keeps its fields (Font size, Table size) apart from its links (Panel items, Number cards): the links are a list of their own (` | U | ya |
| PP-07 | Panel shell (PP) dan font weight (FW) | The preferences belong to the person who is signed in: what one person sets in My Preferences (font size, table size, the places of the panel, the loo | U | ya |
| FW-01 | Panel shell (PP) dan font weight (FW) | Branding & Customization has, under Font family, "Default font weight" (RichSelect): 300 Light, 400 Regular (default), 500 Medium, 600 Semibold; the o | U | ya |
| FW-02 | Panel shell (PP) dan font weight (FW) | The default font weight moves every weight of the app by one step each way (owner revision 2026-11-12: "semua font weight teks naik maupun turun 1 tin | U | ya |
| CP-01 | Revisi komponen DS 2.73 (CP) | `SegmentedControl` has a size: `md` (default) and `sm` (`size="sm"`, class `s-sm`: 4px 12px around the text in `--fs-xs`, 16px icons); a toggle in the | U | ya |
| CP-02 | Revisi komponen DS 2.73 (CP) | `Wizard` fills its container; the label and the support text of a step are on one line cut with an ellipsis, so the steps of a row keep their baseline | U | ya |
| CP-03 | Revisi komponen DS 2.73 (CP) | The icon of an Alert is centred in its tile (line height of the icon box = its height) | U | ya |
| CP-04 | Revisi komponen DS 2.73 (CP) | The icon of a state (`EmptyState`, `ErrorState`) is in a round soft tile (56px, 40px in the small size; red soft for an error) and the rule colours on | U | ya |
| CP-05 | Revisi komponen DS 2.73 (CP) | Charts: when the container of a chart changes width after the chart was drawn (a detail page collapses the sidebar while it arrives), the chart is red | U | ya |
| CP-06 | Revisi komponen DS 2.73 (CP) | Branding: Default mode is a `Select` like Default language (not two buttons) | U | ya |
| CP-07 | Revisi komponen DS 2.73 (CP) | The Design page shows the four states of a data area (loading, empty, error, empty with a button) side by side, each in its own card under a caption ( | U | ya |
| SL-01 | Select com lista (SL) | The `Select` has a list of its own on a device with a mouse or a trackpad (`(hover: hover) and (pointer: fine)`): the field is a button (`.sl-t`, role | U | ya |
| SL-02 | Select com lista (SL) | The list is a popover in the overlay host (so a table or a drawer never clips it), under the field and above it when there is no room, at least as wid | U | ya |
| SL-03 | Select com lista (SL) | A Select with more than five options has a search field at the top of its list (focus goes to it on opening); it filters the options by the text in th | U | ya |
| SL-04 | Select com lista (SL) | Keys: Down or Up on the field opens the list; in the list Down, Up, Home and End move, Enter or Space chooses, Tab closes, and in a list without a sea | U | ya |
| SL-05 | Select com lista (SL) | Only one Select list is open: a press on another field closes it (only its own field is let through, so its click toggles it) and the focus stays on w | U | ya |
| HC-01 | Help Center (HC) | Help Center is in the menu of the user (the avatar menu) of the four roles, under a divider, with the icon `help_outline` and the route `#/help`; it i | D | tidak |
| HC-02 | Help Center (HC) | The front page of Help Center has, under the hero, the learning path of the role (the articles of the topics "start" and "flow", in order) as link car | D | tidak |
| HC-03 | Help Center (HC) | An article is read only by the roles it lists. For any other role, and for an unknown id, the same "Article not found" screen shows; the title of the  | D | tidak |
| HC-04 | Help Center (HC) | No Alert is on screen when the front page, a topic, an article or "not found" opens (permanent notes are helper text) | D | tidak |
| HC-05 | Help Center (HC) | An article states the app version it was last checked for ("Checked for version N"); the app version constant equals the newest line of the design sys | D | tidak |
| HC-06 | Help Center (HC) | A tooltip links to the Help Center ("Learn more") only for a term that is really hard to understand: a short list (fewer than 15) in `domain/help/tipL | D | tidak |
| HC-07 | Help Center (HC) | The text of an article is shown with the design system component `ArticleBody` (one reading column, tokens only); the front page and the topic and art | U | ya |
| HC-08 | Help Center (HC) | The front page of Help Center opens with the hero of the Design System page (`.dshero.top`: the brand fill, the title "Help Center", one line and the  | D | tidak |
| HC-09 | Help Center (HC) | The hero of the front page says "Last updated {date}" under the title (`APP_DATE`, equal to the date of the newest changelog line) and has no Back but | D | tidak |
| HC-10 | Help Center (HC) | The text of an article (`.abd`, `ArticleBody`) has no `max-width` of its own: it fills the column of the page next to the contents list | U | ya |
| HC-11 | Help Center (HC) | The search of Help Center matches whole word starts (every word of the query must start a word of the title or the body; the middle of a word never ma | D | tidak |
| IR-01 | Problem reports (IR) | A problem report is only added to: no function updates, deletes, removes or edits one, and its text never changes when its status does (the record is  | D | tidak |
| IR-02 | Problem reports (IR) | A report number is RPT-0001 and up, in order, and never repeats; the person who sends sees only "Report sent" and this number (no status page, no repl | D | tidak |
| IR-03 | Problem reports (IR) | The free text of a report is checked when it is sent: a CIF (seven digits, or a customer id CUS-xxxx) or an account number (ten digits or more) refuse | D | tidak |
| IR-04 | Problem reports (IR) | A problem report has no attachment: the form has no file field and no screenshot (screens of Kora almost always show customer data) | D | tidak |
| IR-05 | Problem reports (IR) | The Administrator holds a report with a reason of 1 to 300 characters; the report stays whole, but a held report is not exported until the hold is lif | D | tidak |
| IR-06 | Problem reports (IR) | The export is one CSV (fixed English columns) of the new reports; a cell that starts with = + - @ cannot run as a formula; a report that was exported  | D | tidak |
| IR-07 | Problem reports (IR) | Every hold, release and export of problem reports, and every report sent, is written to the activity log (a sent report: Business action; hold and rel | D | tidak |
| IR-08 | Problem reports (IR) | The Administrator sees the reports (reporter, screen, text, history) and no customer: the screen shows no customer name and no customer id | D | tidak |
| IR-09 | Problem reports (IR) | After sending, the person sees "Report sent" and the report number only: no status page, no reply, no list of own reports | D | tidak |
| IR-10 | Problem reports (IR) | The Problem reports menu and page are for the Administrator only (menu: Administration group, right after Data & Integration) | D | tidak |
| IR-11 | Problem reports (IR) | The Administrator screen says in helper text (no Alert) that in the demo the reports are kept in this browser and in production in a database | D | tidak |
| IR-12 | Problem reports (IR) | A reset of the demo data brings back the demo reports (one of each status, none with customer data) | D | tidak |
| IR-13 | Problem reports (IR) | The list of problem reports is the List pattern of Signal rules (TB-17, DK-08): stat cards by status (New, Held, Exported), the tabs in a `.srtabs` wr | D | tidak |
| LG-04c | regression | (a regression row of the register, found while closing LG-04b) | D | tidak |
| UN-01r | regression | (a regression row of the register) | D | tidak |
| WG-14 | (2026-11-17 sync) | The looks of the number cards are a registry; a look added there is an option of Stat view or KPI view by itself | U | ya |
| PP-08 | (2026-11-17 sync) | The drawer of the preferences is titled like its button, My preferences | U | ya |
| VR-05r | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| RLG-03r | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| LS-01 | (2.158.0 sync) | (2.158.0 sync) general rule | U | ya |
| BD-16 | (2.158.0 sync) | (2.158.0 sync) general rule | U | ya |
| CD-29 | (2.158.0 sync) | (2.158.0 sync) general rule | U | ya |
| DR-13 | (2.158.0 sync) | (2.158.0 sync) general rule | U | ya |
| RC-14 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| RC-15 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| HM-04 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| HM-05 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| DT-17 | (2.158.0 sync) | (2.158.0 sync) general rule | U | ya |
| DT-18 | (2.158.0 sync) | (2.158.0 sync) general rule | U | ya |
| DT-16 | (2.158.0 sync) | (2.158.0 sync) general rule | U | ya |
| PC-06 | (2.158.0 sync) | (2.158.0 sync) general rule | U | ya |
| UN-03 | (2.158.0 sync) | (2.158.0 sync) general rule | U | ya |
| DS-29 | (2.158.0 sync) | (2.158.0 sync) the Design page category Quick view cards; not built in the starters yet (open) | D | tidak |
| TB-32 | (2.158.0 sync) | (2.158.0 sync) general rule | U | ya |
| TB-33 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| WG-15 | (2.158.0 sync) | (2.158.0 sync) general rule | U | ya |
| MO-10 | (2.158.0 sync) | (2.158.0 sync) general rule | U | ya |
| RL-09 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| AC-01 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| AC-02 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| AR-01 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| AR-02 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| AR-03 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| AR-04 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| AR-05 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| AR-06 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| AR-07 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| SH-01 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| VC-01 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| RV-01 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| DK-27 | (2.158.0 sync) | (2.158.0 sync) general rule | U | ya |
| DK-28 | (2.158.0 sync) | (2.158.0 sync) general rule | U | ya |
| DK-29 | (2.158.0 sync) | (2.158.0 sync) general rule | U | ya |
| DK-30 | (2.158.0 sync) | (2.158.0 sync) replaced by DK-31 | X | tidak |
| DK-31 | (2.158.0 sync) | (2.158.0 sync) general rule | U | ya |
| DA-01 | (2.158.0 sync) | (2.158.0 sync) general rule | U | ya |
| DA-02 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| DA-03 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| DA-04 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| DA-05 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| DA-06 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| XR-16 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| XR-17 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| XR-18 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| XR-19 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| PP-09 | (2.158.0 sync) | (2.158.0 sync) general rule | U | ya |
| RS-01 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| RS-02 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| RS-03 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| RS-04 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| RS-05 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| RS-06 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| RS-07 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| RS-08 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| RS-09 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| RS-10 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| RS-11 | (2.158.0 sync) | (2.158.0 sync) rule of the Kora product or a regression row | D | tidak |
| CD-30 | (2.172.0 sync) | (2.172.0 sync) general rule | U | ya |
| HM-06 | (2.172.0 sync) | (2.172.0 sync) rule of the Kora product or a regression row | D | tidak |
| DT-19 | (2.172.0 sync) | (2.172.0 sync) general rule | U | ya |
| CB-01 | (2.172.0 sync) | (2.172.0 sync) general rule | U | ya |
| TB-34 | (2.172.0 sync) | (2.172.0 sync) general rule | U | ya |
| PD-16 | (2.172.0 sync) | (2.172.0 sync) rule of the Kora product or a regression row | D | tidak |
| WG-16 | (2.172.0 sync) | (2.172.0 sync) general rule | U | ya |
| SM-01 | (2.172.0 sync) | (2.172.0 sync) rule of the Kora product or a regression row | D | tidak |
| SM-02 | (2.172.0 sync) | (2.172.0 sync) rule of the Kora product or a regression row | D | tidak |
| SM-03 | (2.172.0 sync) | (2.172.0 sync) rule of the Kora product or a regression row | D | tidak |
| SM-04 | (2.172.0 sync) | (2.172.0 sync) rule of the Kora product or a regression row | D | tidak |
| SM-05 | (2.172.0 sync) | (2.172.0 sync) rule of the Kora product or a regression row | D | tidak |
| SM-06 | (2.172.0 sync) | (2.172.0 sync) rule of the Kora product or a regression row | D | tidak |
| AV-06 | Shell / Sidebar | My profile above My preferences in the avatar menu, a read-only drawer with the detail of the person | U | ya |
| LS-02 | (2.183.0 sync) | long lists of a detail page: 10 rows, then 10 more at the end | U | ya |
| TK-01 | (2.183.0 sync) | no hardcoded colour or shadow in styles | U | ya |
| CD-31 | (2.183.0 sync) | description of a tab or section is an info Alert | U | ya |
| CD-32 | (2.183.0 sync) | title of a card of a tab is above the card on detail pages | U | ya |
| DK-33 | (2.183.0 sync) | detail page template by subject | U | ya |
| AN-01 | (2.183.0 sync) | Analytics sections are tabs | D | tidak |
| RD-01 | (2.183.0 sync) | page of one RM | D | tidak |
| PC-07 | (2.183.0 sync) | RM profile card View Detail button | D | tidak |
| DK-32 | (2.183.0 sync) | Take Action in three steps (exception) | X | tidak |
| AN-02 | (2.193.0 sync) | Analytics Advanced filter drawer | D | tidak |
| DT-25 | (2.193.0 sync) | Opportunity detail tables (Kora detail) | D | tidak |
| FM-25 | (2.193.0 sync) | form field label is a .fld label | U | ya |
| IC-02 | (2.193.0 sync) | icon contrast on soft tiles | U | ya |
| DR-14 | (2.193.0 sync) | DrawerSummary at top of a drawer | U | ya |
| DR-15 | (2.193.0 sync) | PlanCard choice and read-only chosen plan | U | ya |
| DT-20 | (2.193.0 sync) | table on a detail page as three blocks | U | ya |
| DT-21 | (2.193.0 sync) | stat cards 220px scroll | U | ya |
| DT-22 | (2.193.0 sync) | activities as timeline | U | ya |
| DT-23 | (2.193.0 sync) | one-row toolbar with More menu | U | ya |
| DT-24 | (2.193.0 sync) | detail page size 5 | U | ya |
| CL-05 | (2.193.0 sync) | softer dark borders | U | ya |
| CL-06 | (2.193.0 sync) | darker field fill in dark | U | ya |
