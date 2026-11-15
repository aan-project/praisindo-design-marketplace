# Mandatory rules: index and summary (Praisindo DS v2.107.0, skill v2.107.0)

This file is the SUMMARY. The full text of every general rule of the Praisindo owner rules register, with how to meet it (component and prop) and how to check it, is in the area files below. Read the area file of what you build before you write code; `scripts/rules-coverage.mjs` checks that every general rule is in them.

| Area file | Covers | Example page |
|---|---|---|
| `rules-fondasi.md` | tokens, colour, type, grid 4px, accessibility, code, process (TH, CL, LY, AX, CODE, PR, BG-07) | all |
| `rules-shell.md` | shell, sidebar, navigation, mobile, branding, notifications (AV, SB, NV, MB, BK, NT, HM, BR) | all |
| `rules-tabel.md` | list page pattern, toolbar, table, columns drawer, pagination, board (TB, DS-11, KB) | ListPage |
| `rules-tombol.md` | button hierarchy, icon side, Apply, footer order, segmented toggle (BT, TG, BN, CH-07) | all |
| `rules-form.md` | required `*` / optional, info icon criteria with examples, form behaviour, fields (FM, SN) | FormPage |
| `rules-komponen.md` | notes as Alerts, card padding, class names, long form jump rail, list pages, sidebar search and label, action row, font weight, component fixes, the Select list, field popovers, native dates, sortable tables, text keys (CD-21..23, DK-21, DK-22, SB-34, SQ, PP-02, FW, CP, SL, FP, TB-25, TB-26, TX-01) | all |
| `rules-otomatis.md` | GN-01 to GN-06: built by default and adapted to the project (Activity history, Notifications, badge tooltips, profile card on user names, motion, removal of obsolete elements) | all |
| `rules-badge-chip.md` | Badge or Chip, the central icon map (BD, BG, CH, PR-05) | ListPage, DetailPage |
| `rules-kartu.md` | cards, Alert vs helper text vs Tooltip vs Disclaimers, states, detail frame, names (CD, IC, ES, DC, CU, OP, DT, PC, UN, OR) | DetailPage |
| `rules-dialog.md` | six dialog kinds, drawer or dialog, action menu (DR, MN) | DialogsPage |
| `decisions.md` | the decision table: the one surface for each intent (add / edit = form page) | all |
| `rules-keputusan.md` | the text, Meet and Check of DK-01 to DK-20 | all |
| `rules-export.md` | the export drawer: one screen, file types, Send via email, recipient suggestions (EX) | none (use the rules) |
| `rules-design-page.md` | the Design System page (DS) | Design page |
| `rules-teks.md` | UI text: capitalisation, buttons, messages, abbreviations, EN / ID (DS-03, BN-01) | all |

Example pages (`assets/starter-react/src/features/examples/`, `assets/starter-html/pages/examples/`) are references: build a page of the same type in the same way.

## Summary (from the Praisindo owner rules register, 2026-11-05)

The ids (BT-01, BD-02, ...) are the ids in the Praisindo register. Keep them when you cite a rule. These rules are permanent: do not change, loosen or re-interpret one. If a project needs something different, record the need in `docs/design-system/new-components.md` (section "Rule proposals") and keep following the rule.

Rules marked **[default]** are Praisindo defaults you may adapt when the product truly needs it (state the reason in the log). Everything else is mandatory.

## 1. Tokens, colour, type, grid

- **CODE-02 / tokens only.** No literal colour, font size, radius or spacing in a component. Use the tokens in `tokens-komponen.md`. Colour carries meaning through intent (brand, secondary, success, warning, danger, info, neutral; purple and cyan for categories only), never decoration.
- **CL-01..CL-03 manual colours win.** Values written by hand in the palette file are used verbatim; every dark intent token that is not written is derived by the contrast engine (text on the dark card at least 4.5:1). A brand colour chosen in Branding gets a derived ramp 50..950.
- **TH-01 / TH-08 typography.** Default font Figtree (set in Branding), letter-spacing .02em, page title 28px (regular scale), body `--fs-md`, page padding 24px, card radius 8px.
- **TH-12 letter-spacing per font.** The 2% body letter-spacing (`--ls:.02em`) belongs to Figtree only. With any other brand font (Inter, Plus Jakarta Sans, Poppins, Roboto) the body and the Branding preview have no letter-spacing: `buildTokens` writes `html:root{--ls:0}` (it outranks the `:root` of the stylesheet, which a lazily loaded chunk may insert after the tokens) and `--ls:0;letter-spacing:0` in a scoped preview; the output for Figtree is unchanged. Never set the body letter-spacing by hand. Font scale small / regular / large is a user preference.
- **TH-04 icons.** Material Icons, Outlined by default, Filled only when the look needs it (rating stars). Sizes 14px (small controls, table meta), 18px (buttons, navigation), 20px (large controls).
- **LY-01..LY-04 grid 4px.** Every px width, height, min/max size, padding, margin, gap, offset, line-height, flex-basis, grid track and every px inside calc()/clamp()/min()/max() is a multiple of 4. Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64. A value off the grid rounds to the nearest multiple; a tie rounds up. Exempt: border/outline/ring widths, radius, font-size, letter-spacing, icon sizes 14/18/20, hairlines under 2px, %, vh, vw, em, rem, fr, transforms. Line-height: px multiple of 4 or `--lh-xs/sm/md/lg/h-sm/h-md/h-lg/h-xl` (16/20/20/24/24/24/28/32). Never a unitless line-height. Controls of the same size stay equally high after rounding.
- **AX-01..AX-04 accessibility.** Focus is a 2px outline in `--color-border-brand-strong` and is never removed. Reduced motion switches off pulse, veil, sidebar and step animation. Light and dark use the same token names; dark text contrast at least 4.5:1 on the card surface.
- **CODE-01.** No `<b>` tag; bold uses a font-weight 600 class.
- **BG-07 no decoration.** No large decorative shape (radius 50% or more above 600px, large radial gradient or blur) behind the content of a work page. Auras exist only on the sign-in screen, the modal glow and the page transition veil.
- **PR-01 CSS safety.** Edit CSS with an exact-string edit or a parser (postcss). Never regex/sed/search-and-replace on raw CSS. Keep one unprefixed base rule per key component (`.btn`, `.inp`, `.sel`, `.swi`, `.swt`, `.bdg`, `.card`, `.pop`, `.li`, `.tt`, `.drawer`, `.scrim`, `.tab`, `.al`, `.sgc`). Run a CSS check after every CSS change (balanced braces, no comment inside a selector, no empty rule).
- **PR-04 / PR-05 in a project without the DS owner.** A pill, tag or chip is the Badge or the Chip, never a custom pill (a selector that makes a text a pill with a soft semantic background is a violation). New components follow `SKILL.md` step 6 and are logged.

## 2. Status, category, badge, chip

- **BD-01 one badge.** Status AND category use ONE look: soft, a rectangle with `--r-badge` (8px), 20px high, text `--fs-xs`, padding 0 4px, gap 4px, background `--int-sub`, text and icon `--int-fg` of the intent; no border, no dot, no animation, no fill, no outline. One size.
- **BD-02 / BD-03 icon from one central map.** Every badge shows a 14px icon (aria-hidden, left of the text) that fits its value, taken from ONE central map (value -> intent + icon). The same value has the same icon everywhere; values shown together in a group have different icons; no page keeps a map of its own. `noIcon` is an explicit flag for version numbers, product names, permission names, tags (never by omission).
- **BD-04 colours.** Light: success, danger, info text/icon use `--color-surface-<intent>-strong-2`; other intents their `*-strong` foreground. Dark: every intent uses its `*-strong` foreground. (Do not copy the Praisindo warning-in-light exception CL-04; aim for 4.5:1.)
- **BD-05.** A badge is one line; a text that does not fit is cut with an ellipsis and the full label becomes the `title`.
- **BD-10 never interactive.** A badge has no click handler, no button/link role, no tabindex and no button inside it. A label that is only a number, a name, a value, a version or a user's choice is a Chip.
- **BD-13 tooltip on every badge.** A badge states what it is for on hover/tap ("Status is Active") through the Tooltip bubble.
- **BG-04.** Purple and cyan are accent intents that may label a category. **BG-05** no "read-only" badge on cards.
- **CH-01 chip.** Compact non-status label, two modes. STATIC (a `span`, no hover/focus/pointer): count, tag, name, version, permission, scenario label; 20px high, SOLID neutral (`--color-surface-neutral-tertiary` with `--color-text-secondary`), solid brand when `selected` (a count that asks for attention). INTERACTIVE (a `button`): select (`aria-pressed`), click or remove (own close button); 28px high, neutral outline at rest, soft brand when selected, focus ring, disabled state, touch target 40px or more on a phone. Both are full pills (`--r-pill`, 999px; the only token for a pill). No shadow on a chip (CH-09).
- **CH-02.** A removable chip is a non-interactive container with the label and ONE close button. No interactive element is nested in another.
- **CH-05 / CH-06 / CH-07.** Every count is a static Chip (tabs, sections, menu, buttons). A tab count is a solid chip (neutral tertiary when not selected, brand when selected). A button that shows a count keeps its label without "(n)" and shows the count as a Chip inside (accessible name stays "label (n)").

## 3. Buttons, forms

- **BT-01** types: fill, soft, outlined, transparent, link. The cancel/reset next to a primary is transparent. One `fill` per area.
- **BT-02** the execution button says "Apply", never "Done". **BN-01** button names: sentence case (capital only on the first word and on product names), verb first, one action has one name everywhere, in English and Indonesian.
- **BT-03** link buttons have no horizontal padding; menu items have a 12px gap. **BT-04** an icon-only button always has an aria label. **BT-05** controls are always size M (md); only table rows have S/M/L as a user preference. **BT-06** buttons have the 8px control radius (`--r-ctl`); chips and the segmented toggle are pills.
- A disabled action says why (tooltip or helper text). `iconRight` for Next/Submit/toggles.
- **TG-01 segmented toggle** (2 to 4 exclusive options; more than that: Select or RadioGroup): pill track with 4px padding, secondary surface, 1px subtle border; options 28px high, at least 36px wide, selected text in brand strong, sliding thumb.
- **FM-12** controls that are form fields take `label`, `req` / `opt`, `hint`, `err`, `onChange` (Select, SegmentedControl, DateField, MultiSelect, PhoneInput). **FM-01** label above the field; required shows a mark, optional shows "Optional". **FM-02** the info icon sits on the label only, never in the input. **FM-03** phone: flag + country code button and number input side by side, digits grouped per 4, leading 0 removed. **FM-04** money: currency prefix and thousands separators while typing. **FM-05** shortcut chips sit 4px below the field and fill it when clicked. **FM-06** placeholders are subtle-3; dashed outlines 6px dash / 6px gap. **FM-07** checkbox is soft: soft border, brand fill only when checked. **FM-10** switch: 40x24 track, 16px knob inset 4px, native checkbox with role=switch, Space/Enter, 2px brand focus, disabled half opacity. **FM-11** date fields follow the theme (`color-scheme`).
- Validation on blur and on submit; errors in the field's `err`, hints in `hint`. Long forms: numbered Wizard with Back/Next and Accordion for optional sections; a step with errors turns red.

## 4. Surfaces, feedback, help

- **CD-01 / CD-12 / CD-20** cards and card-like containers use `--r-card` (8px), one edit point. **CD-02** one card is one box: no card inside a card (use a group title or a divider). **CD-09** a card has a header (title + up to two actions) and a body separated by a divider; the footer is for actions.
- **CD-03 alerts**: a card with a soft intent tint fading from the left, 1px subtle border, no shadow, an icon tile, optional title, optional action and close button. **CD-08 alerts only for real conditions** (an error or failed action, stale or partial data, denied permission, a blocking status, validation after the user acted). A page or drawer NEVER opens with an Alert on screen. A standing note is helper text (`p.mut`, `--fs-sm`), a tooltip next to the title, or one **Disclaimers** card at the very bottom of the page (DC-01: one card titled Disclaimers, one paragraph per note, nothing drawn without a note).
- **CD-04 text hierarchy**: three stacked lines step down neutral default, subtle-4, subtle-3. **CD-05** group titles (captions) are small, uppercase, weight 500, subtle-3. **CD-06** detail rows: label xs subtle-3, value below it sm subtle-4. **CD-15 / IC-01** list rows have no side padding of their own (the container gives the inset, 16px in a flush card); the trailing chevron of a row is `--color-text-tertiary` from one shared rule.
- **CD-07 / CD-10 / CD-11 tooltip**: dark bubble with a tail, left-aligned, at most 280px wide, opens on hover and focus, closes with Escape, `role=tooltip`; the trigger icon is a fixed 16px box. No CSS-only tips (`data-tip`), no browser `title` for important help. Essential information, errors and warnings are never only in a tooltip.
- **DR-01..DR-06, DR-09..DR-11 drawer/dialog** (DR-09 the action of a drawer form is in the footer; DR-10 and DR-11 the preview box in a narrow drawer and its softer third text are done by the stylesheet). Drawer sizes S 400, M 560, L 760px; a drawer opened from a drawer has a Back button; tabs inside a drawer are segmented and sticky flush with the top. Dialog kinds: success, info, progress, warning, danger, confirm (+ an optional alt action). A confirmation (including leaving a page with unsaved changes) is a centred dialog, not a drawer. Never stack more than one dialog. Full screen drawers on a phone (MB-04).
- **EX-01..EX-07 export drawer.** One screen in one `Drawer` (Rows, Data to send, File type, File name, Export option, and for email Recipients, Subject, Message); footer Close + one primary button (Download or Send email). File type is `Chip`s (one or more, one file each); Export option is the `.seg` Segmented buttons; Choose columns is a second drawer with presets (Essential, All, My last choice); recipients are the suggest mode of `TagInput` (list after 3 characters, name, email, masked ID number, label); the done state offers Close, Change settings and Download again; email needs a recipient and a subject and is logged.
- **ES-01** the button of an empty or error state is 16px under its description. Empty, loading and error always use EmptyState, LoadingState, ErrorState/ErrorState with a Retry action.
- **OR-01** lists of events come newest first. **UN-01-style rule**: wherever a user name is shown, use one shared component that can open a profile card, with no text decoration.

## 5. Tables, data

- **TB-01** the right (action) column is right-aligned and frozen, the first column is frozen, neither has a border. **TB-02** no vertical scroll of its own. **TB-03** pagination: rows per page left, total label centre, navigation right (rows-per-page select at least 80px wide on a phone, DS-11). **TB-04** cells have padding and clamp to two lines. **TB-05** table size S/M/L is a user preference (`t-sm/t-md/t-lg`). **TB-06** toolbar has the search combo and Advanced Filter. **TB-07/TB-11** Show/hide columns is the right-most toolbar control, remembered per table. **TB-08** selecting a row shows the bulk-action layer. **TB-09** at most three buttons in the action column (View, one text action, the more icon). **TB-10/TB-12** summary stat cards sit above every list table (unless another view, such as a board, is the default). **TB-13..TB-16** a header is never hidden under the frozen column; give columns minimum widths and let the table scroll sideways instead of squeezing; header title and sort icon are on one row.
- Library note: Praisindo uses jQuery DataTables through an adapter and ApexCharts. In a new project use the stack's own table/chart library if the DS adapter is not provided, but keep the toolbar, frozen columns, pagination and states above.

## 6. Navigation, shell, mobile (shell is mandatory; see `shell.md`)

- **NV-01** the back icon / breadcrumb with a back link appears only on detail pages. **NV-02** the page header is a small breadcrumb above the title; nothing breadcrumb-like is in a header. **NV-03** every page title has a short description (h1 + `.sub`). **NV-04** a new page opens at the top; Back returns to the previous scroll position. **NV-09** one short page transition only (slide/fade); the veil is for sign-in and sign-out. **NV-11/NV-12** a tab strip never clips a label: it scrolls horizontally and the active tab scrolls into view.
- **MB-01..MB-05** on a phone (below 640px) the sidebar is replaced by a bottom navigation (four items and More) with an off-canvas menu; touch targets at least 44px; no horizontal page scroll at 390px; drawers are full screen.

## 7. Theme, language, preferences, branding

- **TH-02** preferences are mode, font size, language, sidebar and table size only (no density option). **TH-03/TH-09** user preferences are stored locally per user, survive a reload and never touch the brand colours (separate keys). **TH-05** language (EN/ID) and theme (light/dark) switch from the sidebar footer. **TH-06** the preferences drawer offers font size, language, table size and the sidebar control (Auto, Expanded, Collapsed).
- **BR-01..BR-08** (details in `branding.md`): with an uploaded logo the sidebar shows only the logo (it already contains the name); without a logo it shows the initial and the application name; the collapsed rail shows the favicon mark when a logo and a favicon exist, else the initial; on a brand-colour surface the dark logo is used; in dark mode the sidebar logo is the dark logo with fallback to the light one; branding is global (app name, primary and secondary colour, light/dark logo, favicon, font, default mode and language); a user preference never changes a brand colour; the default language comes from the brand and the user may override it for themselves.
- **DS-03** every user-facing text exists in English and Indonesian: the two dictionaries have the same keys.
- **DS-18** the version Chip of a change log row (What's new and View all of the Design System page) never shrinks: it is the first child of the flex row and has `flex:none` (`.dslog>div>:first-child`), so the whole version shows in a pill and is never squeezed into a circle with its text cut.

## 8. Process guards

- **PR-02** base selector of each key component stays a single unprefixed rule.
- **VR-01..VR-05** (if you add visual tests): snapshots compared at tolerance 0.001 to 0.002, each snapshot opened and looked at, wait for fonts and stable heights before a screenshot. A flaky snapshot is a bug, not a reason for a looser tolerance.
- Deleted code stays deleted unless the user asks for it back.

## 9. Defaults you may adapt [default]

- Sidebar menu content, group names, order and the demo role switcher; the sign-in screen design; the Kanban board; the Signal / Rules / Opportunity domain (not part of this skill). The sidebar behaviour and sizes themselves are NOT defaults: they are mandatory (see `shell.md`).
