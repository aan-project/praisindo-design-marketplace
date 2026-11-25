# Design System page (Praisindo DS v2.183.0, skill v2.183.0)

The ids are those of the Praisindo owner rules register (general rules only; product-domain rules are not in the skill). Every rule is permanent: do not change, loosen or re-interpret it; a need for something else goes to "Rule proposals" in `docs/design-system/new-components.md`. Examples in brackets name pages of the Praisindo reference application; apply the rule to the equivalent page of your product.

## Rules

### DS-01
**Rule.** The Design page has a grouped contents list (Guide, Foundations, Components, Patterns & layout, Content & quality) and a search field
**Meet.** Keep the starter Design System page (`src/features/design/`) and add every project component to its "This project" section.
**Check.** Open the Design System page at 1440 and 390, light and dark; search for a component.
**Guarded in Praisindo by** a unit test.

### DS-02
**Rule.** What's new shows only the newest change (the highest version, rule DS-10) with View all, and the log has a search (keputusan owner 2026-10-24: was the five latest changes)
**Meet.** Keep the starter Design System page (`src/features/design/`) and add every project component to its "This project" section.
**Check.** Open the Design System page at 1440 and 390, light and dark; search for a component.
**Guarded in Praisindo by** a unit test.

### DS-06
**Rule.** The Design page search is a 44px field and the contents list becomes wrapping chips below 1100px; there is no Previous / Next at the end of a section
**Meet.** Keep the starter Design System page (`src/features/design/`) and add every project component to its "This project" section.
**Check.** Open the Design System page at 1440 and 390, light and dark; search for a component.
**Guarded in Praisindo by** a unit test.

### DS-07
**Rule.** Colour tokens show their hex on the page and copy it on click
**Meet.** Keep the starter Design System page (`src/features/design/`) and add every project component to its "This project" section.
**Check.** Open the Design System page at 1440 and 390, light and dark; search for a component.
**Guarded in Praisindo by** a unit test.

### DS-10
**Rule.** The "What's new" guide of the Design page shows only the newest entry (the highest version of the whole log, found in the data with `latestEntry`, not the first line of a file); "View all" opens the full history; the other entries stay in the data
**Meet.** Keep the starter Design System page (`src/features/design/`) and add every project component to its "This project" section.
**Check.** Open the Design System page at 1440 and 390, light and dark; search for a component.
**Guarded in Praisindo by** a unit test.

### DS-12
**Rule.** The finished step of the chevron Wizard is brand-default in dark mode (white text 4.6:1), never a white box: `brand-strong-2` is navy in light and almost white in dark. `tools/scan_white_text.mjs` (token backgrounds, color-mix and gradient stops, light and dark, a dark override replaces the base rule) is run by `tests/unit/rules/whitetext.rules.test.ts`: no white text below 4.5:1 (the Praisindo exceptions are not copied)
**Meet.** Keep the starter Design System page (`src/features/design/`) and add every project component to its "This project" section.
**Check.** Open the Design System page at 1440 and 390, light and dark; search for a component.
**Guarded in Praisindo by** a browser test.

### DS-15
**Rule.** The Design page opens with a hero (`.dshero`, owner mockup 2026-10-25): the page title ("Design System") and the search field on a brand background (light: brand-default mixed with brand-strong-1 so the white title is 4.5:1 or more, brand-default alone is 3.98:1; dark: brand-default 4.60:1), the contents list on the left and the sections on the right below it. Scrolling down takes the hero away with the page; scrolling up shows a small hero (field only, neutral surface, fixed at the top of the content area, 60px) that slides in; back at the top the large hero returns without moving the layout (the hero keeps its height). The field stays a single input (`#dsq`); a click on the contents list scrolls to 76px under the top of the page (`DS_HERO_ROOM`), so the small hero does not cover the section title; the small hero shows after 48px scrolled up in a row and hides after 8px down, so a small correction of the browser does not flip it
**Meet.** Keep the starter Design System page (`src/features/design/`) and add every project component to its "This project" section.
**Check.** Open the Design System page at 1440 and 390, light and dark; search for a component.
**Guarded in Praisindo by** a browser test.

### DS-16
**Rule.** The title of the Design page hero has a version badge next to it (`.dshero .top`): the highest version of the change log data (`DS_LIVE.version`, from docs/design-system/changelog.md, never typed in a component), label "v1.86" (the format of the change log), a static `Chip` 20px (a version is a Chip, CH-01; it was a soft `noIcon` Badge until keputusan owner 2026-10-26)
**Meet.** Keep the starter Design System page (`src/features/design/`) and add every project component to its "This project" section.
**Check.** Open the Design System page at 1440 and 390, light and dark; search for a component.
**Guarded in Praisindo by** a browser test.

### DS-17
**Rule.** Every component example of the Design page sits in a labelled row, like the Badge section: the variant name and the component name (`Icon stat · StatIcon`, `Error · Input err`, `Opportunity row · PrioRow`) on the left (`.dsx .dsl`), the example on the right (`.dsv`); this holds for the 19 component and pattern sections with examples (buttons, badges, chips, alerts, forms, selection, tabs, cards, lists, alog, sigrules, tables, widgets, kanban, tooltip, feedback, overlays, pagehead, nav); no field, card, KPI, stat card, list row, table or widget is shown outside a labelled row; in the Widget section the 3 KPI cards and the stat cards have their row too (17 widget rows); every form field has its own row (25); on a phone the label is above the example (owner decision 2026-11-03: "saya tidak tahu nama style widget compact yang di tengah"; amended 2026-11-03, 2.26: "kenapa variant kpi & stat tidak dibuat seperti compact ... buatkan juga tampilan untuk komponen lainnya")
**Meet.** Keep the starter Design System page (`src/features/design/`) and add every project component to its "This project" section.
**Check.** Open the Design System page at 1440 and 390, light and dark; search for a component.
**Guarded in Praisindo by** a browser test.

### DS-18
**Rule.** The version Chip of a row of the change log (What's new and View all) never shrinks: the row is a flex row and its first child, the Chip, has `flex:none` (`.dslog>div>:first-child`), so the whole version (v2.29) shows in a pill and is never squeezed into a circle with its text cut (owner decision 2026-11-03: "terdapat issue pada chip version")
**Meet.** Keep the starter Design System page (`src/features/design/`) and add every project component to its "This project" section.
**Check.** Open the Design System page at 1440 and 390, light and dark; search for a component.
**Guarded in Praisindo by** a browser test.

### DS-19
**Rule.** The Design System is one long page of one card per item (Guide, Foundations, Components in kinds, Patterns and layout, Content and quality; a page is the card `#ds-<id>`, in the order of the menu, no id of an example equals a page id). The menu on the left is always open in three levels (group, kind of component, page) with a line on the left of the pages of a group (none from the second level down) and the caption of a group in the brand colour; the spy marks the page in view with `aria-current="location"` on exactly one entry (brand background, weight 500) and is silent while a click scroll runs; a click on an entry or on a search result scrolls to the page (smooth, instant with `prefers-reduced-motion`) and writes `#/design/<id>`; the address opens the page at that page. Under 1100px the menu is one row of chips that scrolls sideways. A component has its examples on its own page only (see also links elsewhere; the Badge and Chip comparison is only on Chip)
**Meet.** Keep the starter Design System page (`src/features/design/`) as the frame, give every project component its own page and add it to the menu registry.
**Check.** Open the Design System page at 1440 and 390, light and dark: the menu, the spy, a click, a link with an id.
**Guarded in Praisindo by** a browser test.

### DS-22
**Rule.** The search of the Design page (`#dsq`, in the hero) finds a PAGE by its name or an alias, in English and in Indonesian (dropdown finds Select, toggle finds Switch, modal finds Modal and dialog): the pages whose name or alias starts with or holds the typed words, best match first; Up / Down / Enter choose and scroll to the page, Esc closes the list and then clears the text; a name that nothing has shows the empty card
**Meet.** Give each page a name and aliases in both languages in the page registry.
**Check.** Search a name, an alias and a word that matches nothing.
**Guarded in Praisindo by** a unit test.

### DS-23
**Rule.** Component names are the universal ones, never a short form: Wizard, NumberInput, SegmentedControl, Avatar, IconTile, GroupTitle, DetailRow, ShortcutChips, LinkButton, RetryButton, AlertAction, ActionMenu, InfoTooltip, AnchorNav, SidebarToggle, RadioCard, Accordion, PageHeader, SearchBar, GlobalSearch, Table, GroupedNumberInput, FileUpload, Dialog, DialogCard, PlainSection, ErrorState (with no title and no description it is the standard error with Retry) and Card without a title (class `.card-bare`). A new component takes its name from MUI, Bootstrap, Material or Radix. The old names (StepNav, SegToggle, JumpLayout, CollapseCard ...) exist nowhere; `references/renames.json` lists every old and new name and `scripts/migrate-names.mjs` converts a project
**Meet.** Import the components under these names; for a project made with an older skill run `node scripts/migrate-names.mjs <project> --apply`.
**Check.** `node scripts/audit.mjs` (check RN-01 lists every old name).
**Guarded in Praisindo by** the audit.

### DS-24
**Rule.** Every page of Components and Patterns (and Principles) has a description under its title (`.dslead`), in English and Indonesian, of its own: not the lead of a section that holds several items
**Meet.** Write the description of a new component page in the page registry in both languages.
**Check.** Open each page: a description under the title.
**Guarded in Praisindo by** a unit test.

### DS-25
**Rule.** The order of the Design System is A to Z: the groups keep their order (Guide, Foundations, Components, Patterns and layout, Content and quality); inside a group the pages are sorted by name; inside Components the kinds are sorted by name and then the pages of each kind. The sort uses the names of the language shown, in the menu and on the long page. The caption of a group is uppercase
**Meet.** Sort with the registry helper (`orderedPages`), not by hand.
**Check.** Switch the language: the order follows the names.
**Guarded in Praisindo by** a unit test.

### DS-26
**Rule.** The custom properties have readable names, the old ones are removed. Neutral text colours: `--color-text-primary`, `-secondary`, `-tertiary`, `-muted`, `-faint`, `-white`, `-black` (they replaced `--color-foreground-neutral-default`, `-subtle-4`, `-subtle-3`, `-subtle-2`, `-subtle-1`, `-inverse-white`, `-inverse-black`). Abbreviations are consistent: `--ff` (font family), `--fw-shift` (default font weight shift, FW-02), `--page-pad`, `--color-scrim`; the intent set of a component `--int-def`, `--int-hov`, `--int-prs`, `--int-fg`, `--int-bd`, `--int-sub`, `--int-on`; local ones carry the component (`--card-gap`, `--drawer-pad`, `--hero-*`, `--dlg-*`, `--frozen-r`, `--tbl-*`, `--seg-*`, `--ring-*`, `--sign-glow`). Kept: `--fs-*`, `--lh-*`, `--ls`, `--r-*`, `--dur-*`, `--ease-out`, `--tt-*`, `--kb-*` and the colours of the other roles (foreground-brand and the like)
**Meet.** Use `var(--color-text-secondary)` and the other new names; a local variable gets a prefix with its component.
**Check.** `node scripts/audit.mjs` (RN-01) and a search of the styles for the old names.
**Guarded in Praisindo by** a unit test.

### DS-27
**Rule.** The search of the Design page also finds the code names, in groups under the pages: Components in the code (`LinkButton`), Classes (`.chp-s`) and Tokens (`--color-text-secondary`), each with its count; every result is listed, none is cut (the list scrolls and the keys keep the chosen row in view); a code name needs two typed characters (a leading dot or two dashes are ignored); best match first (exact, starts with, holds). The index is read from the page (classes of the examples, components named in the labels and the API tables) and the loaded stylesheets, so it follows the code; choosing a class or a component goes to the page where it is used most and marks the first example that uses it for 2.4 s
**Meet.** Keep the index reading the page and the stylesheets; do not keep a hand-written list.
**Check.** Search `LinkButton`, `.chp-s` and `--color-text-secondary`.
**Guarded in Praisindo by** a unit test.

### DG-01
**Rule.** The Design menu may have a group of its own for assembled components (a component built from several components, with its own look and behaviour), between Components and Patterns: Assembled components, without kinds, A to Z. A page of such a component names the single components it is built from, so Card, Table or Wizard may be named on more than one page (an exception of DS-20). The execution request card and the proposal card of the Praisindo product are in this group; a project puts its own assembled components there.
**Meet.** Add the group when the project has an assembled component; give it a page and an example.
**Check.** The menu shows the group between Components and Patterns.
**Guarded in Praisindo by** a unit test.
