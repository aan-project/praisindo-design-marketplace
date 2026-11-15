---
name: design-system
description: Apply the Praisindo design system (version 2.107.0) to ANY UI work in a web app, even when another skill for planning, brainstorming or process is also active: load this skill before writing or changing a screen, page, component, form, table, dashboard, layout, style or CSS (React + TypeScript + Vite or plain HTML), including short prompts like "make a customer list page", and to migrate a running application to the Praisindo design system step by step ("migrate / convert this app to Praisindo DS"). Enforces Praisindo tokens, components, rules, the mandatory shell, Design System page and Branding admin page.
---

# Praisindo Design System skill (v2.107.0)

Version 2.107.0, 2026-11-15 (three parts, MAJOR.MINOR.PATCH, rule VN-01: MAJOR.MINOR is the Praisindo DS number the skill was last synchronised with; PATCH is a fix of the skill only and goes back to 0 when the DS goes up; MAJOR goes up only when a project that uses the skill must be reworked, the owner decides). Synchronised with DS 2.107.0 (2.88 plus: the disabled look of every button type (BT-08) and the button hover Fluid (MO-08), the Select with `pre` and `suf` (FM-16) and the Pagination of TB-27, the tooltip that every badge has (BD-13), the drawer size XL, `.dl-grid` without padding (DL-04), the action label of a Tooltip always white (CD-24), the toast as a dark pill (TS-01), the file upload with its progress ring, the five states, the file icons and the validation of size, type and one file (UP-01 to UP-04), HighlightText as a category and a page of its own (HT-01, WG-03), the compact Alert for a validation result (SG-11) and the group Assembled components of the Design menu (DG-01); both starters carry them (CSS byte for byte, components, the Design page and the helpers `highlightText`, `initUploads`, the `pre` and `suf` of `select`); 2.88 was 2.86 plus SB-35 the sidebar example of the Design page is built like the real sidebar, DL-01 to DL-03 the DetailList component and its renames, and GN-01 to GN-05 built in both starters (Activity history, Notifications, badge map, profile card); 2.83 plus DR-09 the action of a drawer form is in the drawer footer, DR-10 and DR-11 the preview box in a narrow drawer and its softer third text, and the Help Center search of 2.84, which is not part of the skill; 2.83 was 2.73 plus: the universal component names and class families of DS 2.76 and the readable custom property names of DS 2.79 (`references/renames.json`, `scripts/migrate-names.mjs`, audit check RN-01), the Select with its own list (SL-01..SL-05), field popovers drawn in the overlay host (FP-01), no native date field (FP-02, replaces FM-11), sortable tables (TB-25), tables in tabs as List pattern (TB-26), text keys in both dictionaries (TX-01), and the Design System as a long page with a menu, descriptions, A to Z order, readable variable names and code search (DS-19, DS-22..DS-27, replacing DS-04, DS-13, DS-14); before that 2.73 (2.67 plus: 20 general rules CD-21..CD-23, DK-21, DK-22, SB-34, SQ-01..SQ-04, PP-02, FW-01, FW-02, CP-01..CP-07 in `references/rules-komponen.md`, the amended DK-18, SB-28 and CD-08, the component `GlobalSearch`, `SegmentedControl size`, `DetailLayout third`, `RichOpt.soft`, the default font weight in `buildTokens`, and the 2.68 to 2.73 stylesheet changes in both starters; before that 2.67 (2.66 plus the decision rules DK-17 to DK-20: card titles of form pages, two-column detail pages, toast at the bottom right, field popovers fitted to the viewport; before that 2.62 plus the decision rules DK-01 to DK-16, TB-23 and HC-10, three stylesheet fixes and the form example as a `detail` page); the 2.62 sync brought: 228 general rules in full, the full stylesheet (68 files), the new components (RichSelect, ProductLogo, ArticleBody), the motion layer, Branding and Design System in the menu of the user (NV-13), the List pattern (TB-17, TB-21), weights and card paddings (TH-13, TH-14, WG-01, WG-02), form-field props (FM-12) and the one-row pagination. Source of truth: the Praisindo Design System (DS) and its owner rules register. This skill carries a copy. The DS master is owned by the Praisindo design owner, not by you.

Answer the user in the language they write in. Keep code, identifiers and the files in this skill in English. Every user-facing text in the product must exist in English AND Indonesian.

## When this skill applies

Every time the user asks for UI work, even a short prompt, even when they do not mention Praisindo or the design system. It also applies to fixing or restyling the UI of a project that already runs (audit mode), and to migrating a running application to the Praisindo DS (migration mode, see below). If the project is not a web UI (a CLI, an API), do not use it.

## Mandatory outputs of every project (even if the user did not ask)

1. **The Praisindo shell** (see `references/shell.md`): sidebar 232px / 68px, no topbar on desktop, global actions in the sidebar footer, round edge toggle, bottom navigation on a phone. Same in every application.
2. **A Design System page** (menu "Design System", see `references/design-page.md`): a live catalogue that uses the real components.
3. **A Branding page in the menu of the user (NV-13)** (see `references/branding.md`) with REAL saving through the contract in that file (not a fake button).
4. **A new-component log** `docs/design-system/new-components.md` (see `references/new-components-log.md`).

5. **Generated by default, adapted to the project (GN-01 to GN-06, `references/rules-otomatis.md`)**: the **Activity history** item in the menu of the user with its page and one `logActivity` function; **Notifications** (bell, dropdown, drawer) with categories and kinds taken from the project's own workflows; a **tooltip on every badge** from one central badge map; the **profile card on every user name**, with fields from the project's user directory; the **motion layer** running without project animations of its own; and the **removal** of every element the work makes obsolete (starter examples, old copies of DS components, unused routes, styles, keys and files). Ask nothing about them: derive them, and list in the hand-over report what content you derived and what you removed.

6. **A rules register** `docs/design-system/rules-register.md` (RG-01 to RG-04, `references/rules-otomatis.md`; a copy is in each starter). Every rule the owner gives and every rule you create yourself is written in it in the same piece of work. **A new rule that contradicts an existing one (in the register or in this skill) is reported to the owner at once, before you build on it**: name both rules, record the new one as pending (`perlu keputusan owner`), keep the old one active, and run `scripts/rules-conflicts.mjs --new <ids>`. A rule you create on your own is pending until the owner confirms it.

If the project already exists and lacks any of these, add them (or report that they are missing, in audit mode) before the requested feature is finished.

## Workflow

1. **Detect the mode.** New project, existing project to extend, existing project to repair (audit), or running application to migrate (migration: the user says migrate, migration, convert, "migrasikan", "konversi" or "ubah aplikasi ini ke Praisindo DS"; follow `references/migrate.md` and the rules in "Migrating a running application" below). **Upgrade of a project made with an older skill** (the project already uses the Praisindo DS but its names are from an older version: `SegToggle`, `StepNav`, `--color-foreground-neutral-subtle-4`, `.sgt` ...): follow "Upgrading a project to a newer skill" at the end of `references/migrate.md`; first run `node scripts/migrate-names.mjs <project>` (a dry run) and `node scripts/audit.mjs <project>` (check RN-01). Detect the stack: React + TypeScript + Vite, or plain HTML. If both are possible, ask once; default to React + TypeScript + Vite for an app and plain HTML for a static page.
2. **Read the references** you need before writing code. Always read `references/decisions.md` (the decision table), `references/rules-wajib.md` (index and summary) and `references/tokens-komponen.md`, and the area file of what you build (`rules-tabel.md` for a list, `rules-form.md` for a form, ...; list in "References"). Read `shell.md`, `design-page.md`, `branding.md` when you build or change those parts. Read `audit.md` in audit mode, and `migrate.md` (with `audit.md`) in migration mode.
3. **Scaffold** what is missing from the mandatory outputs. Start from the starter of the stack, do not write from zero: `assets/starter-react/` (Vite + React 18 + TypeScript, builds and typechecks) or `assets/starter-html/` (plain HTML + ES modules, serve the folder). Copy it into the project, follow its `README.md`, set the product name and colours (`BDEF` in `palette`), add menu entries and routes in `nav.config`, and replace the placeholder Home and session. For an existing project, merge the shell, the Design System page, the Branding page, `docs/design-system/` and the stylesheets into it instead of replacing its files. Never edit `design-system/` (tokens, stylesheets, components) or the shell: they are the design system. New components go outside it (`src/components/`). The example pages and their `ex-*` routes and menu entry are references: remove them when the product pages exist.
4. **Decide the surface from `references/decisions.md` (never ask the user, never invent one), then pick the matching example page, read its rule type and write code.** Adding or editing data is a form PAGE, not a drawer (DK-01); a list is the List pattern; a detail page uses one layout of the catalogue.
   Then, as before: **pick the matching example page, read its rule type, then write code.** Classify the page (list, form, detail, dialog, dashboard, other), open its example page (`assets/starter-react/src/features/examples/` or `assets/starter-html/pages/examples/`) and the rules of its type (table in `references/migrate.md`, "Pemeriksaan kepatuhan per halaman"), and build the page the same way: same order, same components and props, same states. Do this in creation mode AND in migration mode. If your result differs from the example, change the result, not the example or the rules.
5. **Build the requested feature** using only tokens and existing components. Never write a colour, font size, radius or spacing literal. Use the DS component for the job before writing markup yourself.
6. **A needed component or variant that does not exist.** You may create it (nobody can give an owner permission in this context), but only after you tried to meet the need with the existing components and variants, and you MUST: build it from tokens only, add it to the project's Design System page with a live example, and add a record to `docs/design-system/new-components.md`. Do not edit the rules or the existing components of the DS.
7. **Keep the Design System page current.** Every component, variant or token the project adds or changes appears on the Design System page in the same piece of work.
8. **Run the final checklist** below and report the result to the user in one short list. Mention the skill version (v2.107.0) in the README or the first comment of the project, so an outdated copy can be spotted.

## Migrating a running application (mode "Migrasi aplikasi berjalan")

Triggered when the user asks to migrate or convert an application that already runs to the Praisindo DS (for example "Migrasikan aplikasi ini ke Praisindo DS memakai skill design-system"). Follow `references/migrate.md` stage by stage (Tahap 0 to 5, with the page compliance check of Tahap 4 and the final sweep Tahap 4b). These core rules hold in every stage:

- **Only the appearance changes.** Never change business logic, API calls, data shapes, routing, permissions or the product's content text. If the look cannot change without touching logic, stop and ask.
- **Branch `chore/praisindo-ds`.** Create it if it does not exist; never work on `main`.
- **One commit per step**, one kind of change per step; build, tests and `scripts/audit.mjs` after every step, compared with the baseline. Never loosen a test, a rule or the audit to pass.
- **Stop for approval after `docs/design-system/migration-plan.md`** (end of Tahap 1): show the plan and the questions and wait until the user writes "lanjutkan tahap 2". Do not change any file other than the plan and the screenshots before that.
- **Every migrated page is compared with its example page** and logged rule by rule in `docs/design-system/migration-log.md`; a page is not done while a general rule fails without a written reason.
- **No push and no pull request** until the user asks for it.

## The rules you must never break (full text in the area files `references/rules-*.md`, index in `references/rules-wajib.md`)

- Tokens only: no hex colour, no font size, radius or spacing literal in a component (CODE-02). Use `var(--color-...)`, `var(--fs-...)`, `var(--r-card)`, and so on.
- Grid 4px: every px size, gap, padding, margin, offset and line-height is a multiple of 4 (LY-01 to LY-04). Line-height uses `--lh-*`, never unitless.
- Light and dark mode and English and Indonesian for everything. Same token names in both modes.
- Controls are always size M. Radius: cards and buttons 8px (`--r-card`), badge 8px (`--r-badge`), pill 999px only for chips and segmented toggles (`--r-pill`).
- Status and category are the one soft **Badge** with an icon from one central map. Never interactive. A count, tag, name, version, permission or a user's choice is a **Chip**. There is no dot badge and no fill badge.
- No card inside a card. Alerts only for real conditions, never on first open of a page. A standing note is helper text or a Disclaimers card. Tooltips use the Tooltip component only.
- Buttons: one fill button per area; the cancel next to it is transparent; sentence case, verb first; icon-only buttons have an aria label; a disabled action says why.
- Forms: every field of a form is `req` (red `*`, `aria-required`) or `opt` ("(optional)"); a field gets an info icon (`hint`) when its format, effect, condition, unit, default, term or reader is not obvious (criteria and examples in `rules-form.md`); validate on blur and on submit; footer Cancel (transparent) then Save (fill); leaving with unsaved changes asks in a centred dialog.
- List pages: page head with the one primary action, stat cards, one card with the toolbar (SearchBar, Advanced filter, spacer, secondary actions, Show / hide columns LAST), bulk layer on selection, table with frozen first and action columns, at most View + one text action + the more menu per row, pagination, and the loading / error / empty / no-result states (`rules-tabel.md`). The execution button of a panel says "Apply".
- Brand colour (Branding) never changes status, focus or chart colours; a user preference never changes the brand. Focus ring is 2px `--color-border-brand-strong`, never removed.
- Text contrast at least 4.5:1 (the DS tokens are made for it). Do not copy the Praisindo contrast exceptions (CL-04, LG-04c, RB-01) into a new project.
- No decorative shapes behind work pages. No `<b>`: use a weight class. Icons: Material Icons Outlined, 14 / 18 / 20px.
- Edit CSS with exact edits or a parser, never with regex or sed on raw CSS.
- Built without being asked (GN-01..06): Activity history in the user menu, Notifications with project categories, a hover tooltip on every badge, the profile card on every user name, motion only from the DS, and obsolete elements deleted in the same change.
- The body letter-spacing comes from the tokens only: 2% with Figtree, 0 with any other brand font (TH-12, done by `buildTokens`); never set it by hand.

## Final checklist (run it before you hand over)

- [ ] No colour / size / radius / spacing literal in components; no off-grid px.
- [ ] Shell, Design System page and Branding page exist and work; Branding saves through the contract and applies the brand app-wide.
- [ ] The Design System page shows every component and variant the project uses, and any new one.
- [ ] Every new component or variant is logged in `docs/design-system/new-components.md`.
- [ ] Light and dark checked; English and Indonesian keys have the same set.
- [ ] Phone (390px) has no horizontal page scroll; touch targets at least 44px (40px minimum for chips).
- [ ] Empty, loading and error states exist for every list and data view (Retry on error).
- [ ] Keyboard focus visible; icon-only buttons labelled; no initial Alert.
- [ ] Every page was compared with its example page and the rules of its type (list, form, detail, dialog); `scripts/audit.mjs` shows no pattern finding (FM-01, TB-03, TB-06, TB-09, TB-10, BT-02, BT-04, CD-08).
- [ ] Built by default and adapted to the project (GN-01..05): the Activity history item in the user menu and its page with the one `logActivity` function; the bell, dropdown and drawer with the project's own `notifications.config`; every badge from the central map with its tooltip; every user name as `UserName` / `userName()` with `profile.config`; motion only from the design system.
- [ ] Removed what the work replaced (GN-06): the example pages (`ex-*` routes, their files and the Examples menu entry) once the real pages exist, and every menu entry, route, component, style, i18n key, mock record or test that nothing uses any more; the removals are in the report and in `docs/design-system/changelog.md` (the audit lists leftover `ex-*` as a Cleanup).
- [ ] Every rule given in this piece of work, and every rule or default you created yourself, is in `docs/design-system/rules-register.md` (RG-01, RG-04); a conflict was reported at once (RG-02).
- [ ] You said which skill version you used.

## Starters and scripts

- `assets/starter-react/`: complete app (shell, Design System page with every component, Branding page with real saving through an adapter, i18n, tokens, 63 stylesheets). `npm install`, `npm run dev`, `npm run typecheck`, `npm run build`, `npm run audit`.
- `assets/starter-html/`: the same without a build step (`js/` modules, `css/`, `pages/design.*.html`).
- Example pages (references, both starters, menu Admin > "Pattern examples (reference)"): list page, form page, detail page, dialogs and menus. Each React file lists in its header the rule ids it meets.
- `scripts/audit.mjs <dir>`: finds literal colours, radii, font sizes, off-grid px, unitless line-height, `<b>`, removed focus, home-made tooltips, dot badges, stray Web Storage, i18n key mismatch, and checks the mandatory outputs. It also checks the page patterns: form fields without `req` / `opt`, `req` without `aria-required`, a table page without SearchBar + Advanced filter, Pagination or StatCards (exception `/* ds-allow: <reason> */`), icon buttons without a name, "Done" labels, more than three row actions, unconditional Alerts. It reports and exits 1 on a Blocker. `scripts/audit-selftest.mjs` proves every pattern check on `scripts/fixtures/violations/`. `scripts/rules-coverage.mjs` checks that every general rule is in `references/rules-*.md` with Rule, Meet and Check. Run it in audit mode and before the final checklist. `scripts/contrast.mjs` checks colour pairs and Branding colours. The audit also flags a `<Badge>` without a tooltip source (GN-03) and project keyframes, transitions or animations with a literal time (GN-05). `scripts/rules-conflicts.mjs` finds contradicting rules in a register (RG-02). `scripts/compare-ds.mjs --ds <DS root> --starter <starter root> --ds-url <U> --starter-url <U>` proves a starter still matches the real DS app: CSS byte for byte, and the rendered DOM skeleton of the sidebar, Branding, the Preferences drawer and the Design page (needs Playwright in the DS root; serve the starter with `scripts/serve-nocache.mjs`). Run it after every skill update, because audit 0/0/0 does not prove the look.
- The Design System page of the starters is the design system. When the DS version changes, replace the starter, do not patch it.

## References

- `references/rules-wajib.md`: index of the rule files and summary of the mandatory rules (with Praisindo rule ids), and the defaults you may adapt.
- Area rule files, every general rule in full with how to meet it (component, prop) and how to check it:
  - `references/rules-fondasi.md`: tokens, colour, type, grid 4px, accessibility, code, process.
  - `references/rules-shell.md`: shell, sidebar, navigation, mobile, branding, notifications.
  - `references/rules-tabel.md`: list page pattern, toolbar, table, columns drawer, pagination, board.
  - `references/rules-tombol.md`: button hierarchy, icon side, "Apply", footer order, segmented toggle.
  - `references/rules-form.md`: required `*` and optional, info icon criteria with examples, form behaviour, fields.
  - `references/rules-badge-chip.md`: Badge or Chip, the central icon map.
  - `references/rules-kartu.md`: cards, Alert / helper text / Tooltip / Disclaimers, states, detail page.
  - `references/rules-dialog.md`: the six dialog kinds, drawer or dialog, action menu.
  - `references/decisions.md`: the DECISION TABLE (which surface for which intent: add / edit = form page, list, detail, preview, filter, confirm, feedback). Read it before building a page or a flow.
  - `references/rules-keputusan.md`: the text, Meet and Check of the decision rules DK-01 to DK-20. DK-21 and DK-22 (jump rail of a long form, the List pattern for every list page) are in `references/rules-komponen.md`.
  - `references/rules-komponen.md`: notes as Alerts, card padding, class names, sidebar search and label, action row, default font weight, component fixes (CD-21..23, DK-21, DK-22, SB-34, SQ-01..04, PP-02, FW-01..02, CP-01..07).
  - `references/rules-otomatis.md`: what is generated by default and adapted to the project: GN-01 Activity history, GN-02 Notifications and categories, GN-03 badge tooltips, GN-04 profile card on user names, GN-05 motion, GN-06 removal of obsolete elements.
  - `references/rules-export.md`: the export drawer (one screen, file types, Send via email, recipient suggestions).
  - `references/rules-design-page.md`: the Design System page.
  - `references/rules-teks.md`: UI text (capitalisation, buttons, messages, abbreviations, English and Indonesian).
  - `references/rules-general.json`: the ids of the general rules (for `scripts/rules-coverage.mjs`).
- `references/tokens-komponen.md`: tokens (light and dark) and the component list with signatures, and which component to use for what.
- `references/shell.md`: the mandatory shell, menu configuration, behaviours.
- `references/design-page.md`: spec of the Design System page.
- `references/branding.md`: spec of the Branding page, API contract, temporary adapter.
- `references/audit.md`: audit mode procedure and report format.
- `references/migrate.md`: migration mode, migrating a running application to the Praisindo DS in stages (Tahap 0 to 5) with the approval point after the migration plan, the page compliance check (Tahap 4) and the final sweep (Tahap 4b).
- `references/new-components-log.md`: format of the new-component log.
