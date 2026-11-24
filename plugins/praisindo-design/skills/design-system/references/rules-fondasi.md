# Foundations: tokens, colour, type, grid, accessibility, code, process (Praisindo DS v2.172.1, skill v2.172.1)

The ids are those of the Praisindo owner rules register (general rules only; product-domain rules are not in the skill). Every rule is permanent: do not change, loosen or re-interpret it; a need for something else goes to "Rule proposals" in `docs/design-system/new-components.md`. Examples in brackets name pages of the Praisindo reference application; apply the rule to the equivalent page of your product.

## Rules

### BG-07
**Rule.** No large decorative shape sits behind the content of a work page: no element wider or higher than 600px with a radius of 50% or more, and no large radial gradient or blur on a content ancestor, outside the sign-in screen, the modal glow and the page-transition veil (the places that are designed to have an aura). The sliding thumb of a SegmentedControl stays inside its own toggle (position relative on `.sgc`)
**Meet.** Do not add decorative circles, blobs or large radial gradients to work pages.
**Check.** Look at every page; audit (decoration check).
**Guarded in Praisindo by** a unit test.

### TH-01
**Rule.** Root tokens: --r-card 8px, letter-spacing .02em, page padding 24px, h1 is the xl heading size and weight 700
**Meet.** Nothing to write: `--r-card`, `--ls`, `--pp` and the h1 size come from `buildTokens` and `01-base.css`.
**Check.** Computed style of `h1` (xl, 700) and `.card` (radius 8px) in the browser.
**Guarded in Praisindo by** a unit test.

### TH-02
**Rule.** The density preference is gone: preferences are mode, font size, language, sidebar and table size only
**Meet.** Use `PrefsDrawer` of the starter; do not add a density option.
**Check.** Open My preferences: only mode, font size, language, sidebar and table size.
**Guarded in Praisindo by** a unit test.

### TH-03
**Rule.** User preferences are stored locally per user and never touch the brand colours (separate keys)
**Meet.** Store preferences only through `PrefsProvider` (`app.prefs`); brand values only through `brandStore`.
**Check.** Change mode and font size, then check that the brand colour tokens did not change.
**Guarded in Praisindo by** a unit test.

### TH-04
**Rule.** Icons are Material Icons, outlined by default, filled on request
**Meet.** `<Icon name="..." />` (Material Icons Outlined); `filled` only where the look needs it.
**Check.** Audit: no other icon font or SVG icon set.
**Guarded in Praisindo by** a unit test.

### TH-05
**Rule.** Language and theme are switchable from the sidebar footer (EN / ID and light / dark)
**Meet.** Keep the language and theme buttons of the sidebar footer (shell).
**Check.** Switch EN/ID and light/dark from the sidebar footer.
**Guarded in Praisindo by** a unit test.

### TH-06
**Rule.** The preferences drawer offers font size, language and table size (no density) and the table size reaches the tables
**Meet.** Use `PrefsDrawer`; the table size (`prefs.table`) reaches tables through `t-${size}` on `.tw`.
**Check.** Change table size S/M/L and look at a table row height.
**Guarded in Praisindo by** a unit test.

### TH-08
**Rule.** Typography: page title 28px (regular size), body letter-spacing 2%, default font Figtree, page padding 24px, card radius 8px
**Meet.** Nothing to write: the tokens set Figtree, 28px title, 24px page padding.
**Check.** Computed style of `body` and `h1`.
**Guarded in Praisindo by** a browser test.

### TH-09
**Rule.** The user preferences (font size, language, table size, sidebar, theme) are local: they change the page for this user and survive a reload, and never change the brand colour
**Meet.** Read preferences with `usePrefs()`; never store them elsewhere.
**Check.** Change every preference, reload, the choice stays; the brand colour stays.
**Guarded in Praisindo by** a browser test.

### TH-10
**Rule.** The font size preference scales the type (small / regular / large) and the table size preference changes the font size of the table text (the row padding is 12px for every size since 2026-11-09, TB-18)
**Meet.** Write sizes with `--fs-*` and table row sizes with `t-sm/t-md/t-lg`; never a px font size.
**Check.** Switch font size small / regular / large and table size S / M / L.
**Guarded in Praisindo by** a browser test.

### TH-12
**Rule.** The 2% letter-spacing of the body (`--ls:.02em`, TH-08) belongs to Figtree: with any other brand font (Inter, Plus Jakarta Sans, Poppins, Roboto) the body and the Branding preview have no letter-spacing (`html:root{--ls:0}`, written by `buildTokens` only for a font other than Figtree, so the tokens of Figtree are unchanged; `html:root` outranks the `:root` of the stylesheet, which a lazily loaded chunk may insert after the tokens); Plus Jakarta Sans is one of the brand fonts and is loaded from Google Fonts like the others (owner decision 2026-11-03: "tambahkan pilihan font plus jakarta sans ... selain font family figtree hilangkan letter-spacing pada body")
**Meet.** Never set the body letter-spacing; `buildTokens` writes `html:root{--ls:0}` for a non-Figtree font.
**Check.** Audit (TH-12 check); switch the brand font in Branding and read `--ls`.
**Guarded in Praisindo by** a unit test.

### CL-01
**Rule.** Colours written explicitly in `src/design-system/tokens/palette.ts` are used verbatim: the neutral ramp N and the dark neutrals DK (light and dark), the light intent ramps (BR0, R, G, A, IB, PU, CY) and any value written in `DK_INTENT` (dark intent tokens). A light ramp slot is NOT a manual dark value: dark intent tokens that are not written in `DK_INTENT` are derived (CL-02)
**Meet.** Write fixed colours only in `palette.ts`; never in a component.
**Check.** Audit (literal colour check).
**Guarded in Praisindo by** a unit test.

### CL-02
**Rule.** The contrast engine (`colorEngine.ts` `ramp`, `darkIntent`) derives every dark intent token that is not written in `DK_INTENT` (all 8 intents, a brand chosen in Branding and the secondary colour): intent text on the dark card >= 4.5:1, strong text on the subtle surface >= 4.5:1, white on the fill >= 4.5:1 for brand, secondary, danger, info, purple; it also validates a new primary colour (contrast against white >= 3)
**Meet.** Let `colorEngine.ts` derive dark intent tokens; do not write dark values by hand.
**Check.** `node <skill>/scripts/contrast.mjs` on the brand colours.
**Guarded in Praisindo by** a unit test.

### CL-03
**Rule.** A dark intent value written in `DK_INTENT` (palette.ts, empty today) is used verbatim by `buildTokens`; the other tokens of that intent stay derived
**Meet.** A dark value that must be fixed goes in `DK_INTENT` of `palette.ts`.
**Check.** Read the generated token in dark mode.
**Guarded in Praisindo by** a unit test.

### LY-01
**Rule.** Every px width, height, min- / max-width / height, padding, margin, gap, offset (top / right / bottom / left / inset), line-height, flex-basis, grid track size and px inside calc() / clamp() / min() / max() or a size token (`--tbl-row-pad`, `--tbl-head-pad`, `--ring-th`, `--ring-sz`, `--page-pad`, ...) in the stylesheets, inline styles (`style={{}}`, `sty('...')`, `style="..."` markup strings) and the Design page examples is a multiple of 4. A value off the grid rounds to the nearest multiple of 4 and a tie rounds UP (10 -> 12, 14 -> 16, 6 -> 8, 2 -> 4, 33 -> 32). Do not write an off-grid value: an exception goes only into the allowlist `tools/grid4_allowlist.json` (file, selector, property, reason)
**Meet.** Use 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64 px only, or a token.
**Check.** Audit (off-grid px check).
**Guarded in Praisindo by** a unit test.

### LY-02
**Rule.** Exempt from the grid, never changed by it: border, outline, box-shadow and ring widths (1px, 2px); radius; font-size; letter-spacing; icon sizes 14 / 18 / 20px (a separate owner decision is pending); hairlines (a px value under 2px, or a 2px line on width / height such as a divider or indicator); `%`, `vh`, `vw`, `em`, `rem`, `fr`, `auto`, 0; transform / translate and animation keyframes; background-size / position; images, illustration and mascot dimensions; third-party intrinsic sizes (ApexCharts, DataTables); element sizes that come from content (auto height)
**Meet.** Border, radius, font-size, letter-spacing, icon sizes 14/18/20 and hairlines may be any value.
**Check.** Audit skips them; nothing else to check.
**Guarded in Praisindo by** a unit test.

### LY-03
**Rule.** Line-height is a px multiple of 4 or a `--lh-*` token (xs 16, sm 20, md 20, lg 24, h-sm 24, h-md 24, h-lg 28, h-xl 32px, defined in `01-base.css`); a unitless line-height is not used. The tokens do not follow the font scale, so the grid holds in every scale
**Meet.** `line-height: var(--lh-md)` (or a px multiple of 4).
**Check.** Audit (unitless line-height check).
**Guarded in Praisindo by** a unit test.

### LY-04
**Rule.** In the browser, key elements are on the grid at 1440 and 390: button, input, select, the unified badge (one size, 20px high) and tab (sm / md / lg), table header cell and row, stat card, sidebar level-1 / level-2 item, drawer header; the border box or the box without its 1px borders is a multiple of 4; button, input, select and tab of one size are equally high
**Meet.** Use the DS controls at their default size; do not override their height.
**Check.** In the browser, measure button, input, select, badge, tab, table row: multiples of 4.
**Guarded in Praisindo by** a browser test.

### PR-01
**Rule.** CSS is changed only with a targeted edit (exact string) or with postcss (parse, change nodes, serialize); never with regex / sed / search-and-replace scripts on raw CSS text. After every change to `src/design-system/styles/*.css`, `npm run check:css` (`tools/check_css.mjs`, postcss) must pass: it fails on a comment inside a selector or between a selector and its `{`, an empty rule, unbalanced braces or comment markers; it warns (never fails) on contradicting duplicate declarations without a comment and on classes no source file uses (allowlist `tools/css_unused_allowlist.json`; nothing is deleted because of a warning)
**Meet.** Change CSS with an exact-string edit or postcss.
**Check.** Read the diff: no regex replacement on CSS text; balanced braces.
**Guarded in Praisindo by** a unit test.

### PR-02
**Rule.** The base selector of each key component is a single selector without prefix and carries its base properties: `.sgc` (position relative, inline-grid), `.sgc-th` (position absolute), `.btn`, `.inp`, `.sel`, `.swi`, `.swt`, `.bdg`, `.card`, `.pop`, `.li`, `.tt`, `.drawer`, `.scrim`, `.tab`, `.cnt`, `.al`; a prefix that turns one into a descendant selector fails the test at once
**Meet.** Never prefix or split the base rule of `.btn`, `.inp`, `.sel`, `.swi`, `.swt`, `.bdg`, `.card`, `.pop`, `.li`, `.tt`, `.drawer`, `.scrim`, `.tab`, `.al`, `.sgc`.
**Check.** grep the base selectors in `src/design-system/styles`.
**Guarded in Praisindo by** a unit test.

### PR-04
**Rule.** No new component without the owner's explicit permission: no new TSX component, no new variant, no new class that replaces the job of a design-system component. When the need cannot be met by the components and variants that exist, the work stops at that item: describe the need and the options and wait for the owner (keputusan owner 2026-10-25). Guard: `tests/unit/noShadowComponents.test.ts` fails when a component file of `src/design-system/components` is not in its allowlist
**Meet.** First meet the need with an existing component and variant; if impossible, follow `SKILL.md` step 6 (tokens only, Design page, `new-components.md`).
**Check.** Every new component has a record in `docs/design-system/new-components.md` and a live example.
**Guarded in Praisindo by** a unit test.

### AX-01
**Rule.** Keyboard focus is a 2px outline in the strong brand border colour and is never removed
**Meet.** Never write `outline:none` without the DS focus ring; DS components already have it.
**Check.** Tab through the page: every control shows the 2px brand ring.
**Guarded in Praisindo by** a unit test.

### AX-02
**Rule.** Motion is switched off when the system asks for reduced motion (pulse, veil, sidebar, steps)
**Meet.** Use DS motion classes; a new animation sits inside `@media (prefers-reduced-motion: no-preference)`.
**Check.** Turn on reduced motion in the OS and reload.
**Guarded in Praisindo by** a unit test.

### AX-04
**Rule.** Light and dark themes use the same token names; the dark palette is computed to keep text contrast (>= 4.5:1) on the card surface
**Meet.** Use the same token names in light and dark; never a mode-specific colour.
**Check.** `contrast.mjs`; look at the page in dark mode.
**Guarded in Praisindo by** a unit test.

### CODE-01
**Rule.** No <b> tag in the markup: bold text uses the font-weight class (fw6)
**Meet.** Bold text: `<span className="fw6">`.
**Check.** Audit (`<b>` check).
**Guarded in Praisindo by** a unit test.

### CODE-02
**Rule.** No literal colour in a component (tokens only): no hex colour in src/design-system/components or features outside the colour demo
**Meet.** Only `var(--color-...)` in components and project CSS.
**Check.** Audit (literal colour check, Blocker).
**Guarded in Praisindo by** a unit test.

### TH-13
**Rule.** Weights: every bold text (the class `fw6`, a name, a value, a label) is `font-weight:500`; only an `h2` (TH-14), the title of the hero (`.dshero-t`) and the heading of a topic on the Help Center front page (`.hcbh h3`) are 600 (owner decision 2026-11-11, was the title of a card, an entity summary or panel alone); nothing else in the style files has 600
**Meet.** Use `fw6` for bold text; it is weight 500. Never write another weight; only `h2`, the hero title and the Help Center topic heading are 600.
**Check.** Computed weight of a name, value and label: 500.
**Guarded in Praisindo by** a browser test.

### TH-14
**Rule.** Every `h2` is at least 600: the base rule `h2` is 600 and no rule for an h2 sets a lower weight; the title of the hero `.dshero-t` is 600 and its note `.dsnote` is the small size
**Meet.** Never set a weight below 600 on an `h2`.
**Check.** Computed weight of every `h2`: 600 or more.
**Guarded in Praisindo by** a browser test.

### MO-01
**Rule.** Between ordinary pages the content of the new page (`.ct > *`) fades in over 0.2 s (token `--dur-page`, keyframes `pgfade`, no fill after the end); nothing slides and nothing is shown while a page loads; the page veil stays for sign-in and sign-out only (NV-09 unchanged)
**Meet.** Do not add page transitions of your own; the shell fades `.ct > *` with `--dur-page`.
**Check.** Change page: the new content fades in over 0.2 s, nothing slides.
**Guarded in Praisindo by** a browser test.

### MO-02
**Rule.** The numbers of the stat cards, the KPI and the widgets count up once from 0 to their value in 0.6 s when they appear, through the prop `animate` of the existing components (on by default, `animate={false}` shows them at once; no new component); the decimals, the grouping and the currency of the text are kept, the last frame is exactly the text, a later change of the value shows at once
**Meet.** Use `StatCards`, `KPI` and the widgets as they are; they count up through `animate` (default on); pass `animate={false}` to show at once.
**Check.** Open a page with stat cards: the numbers count up once, the last frame equals the text.
**Guarded in Praisindo by** a unit test.

### MO-03
**Rule.** Motion stands still, and the final screen is shown at once, when the system asks for reduced motion and in automated browsers (tests and screenshots), through `data-motion="off"` on the root element set from `motionOn()` (`src/lib/countUp.ts`) and the media query; AX-02 unchanged
**Meet.** Set `data-motion` on the root from `motionOn()` (`main.tsx`); never write an animation without the `[data-motion="off"]` guard.
**Check.** Reduced motion on, or an automated browser: nothing moves and the final screen shows at once.
**Guarded in Praisindo by** a unit test.

### MO-04
**Rule.** The motion layer has three durations and one easing (`--dur-fast` .12 s, `--dur-base` .2 s, `--dur-slow` .32 s, `--ease-out`); only opacity, transform and the colour of a row or the ring of a step move; nothing runs longer than 0.4 s except the glow of a new row (1.2 s, once) and the pulse of the waiting step (2 s, a quiet loop); every moving rule is under `:root:not([data-motion="off"])` so MO-03 holds
**Meet.** Use only the tokens `--dur-fast`, `--dur-base`, `--dur-slow`, `--ease-out`; animate only opacity, transform and colour.
**Check.** No animation longer than 0.4 s except the glow of a new row.
**Guarded in Praisindo by** a unit test.

### MO-05
**Rule.** Quick feedback and entrances: a button presses in (scale .98) with its colours easing in .12 s; table cells and chips ease their colour; a popover (`.fpop`, `.pop`) rises 4px while fading in (.2 s); a toast comes up 8px; the scrim and the centred dialog fade
**Meet.** Do not write hover or entrance animations of your own; buttons, chips, table cells, popovers, toasts, scrims and dialogs already have them.
**Check.** Press a button, open a popover and a dialog: short, quiet motion.
**Guarded in Praisindo by** a browser test.

### MO-06
**Rule.** The first eight rows of a table fade in 20 ms apart; a row with the class `mo-new` glows brand-subtle and fades back in 1.2 s; the Activities list sets it for about two seconds on the activity an outcome completed and on its follow-up
**Meet.** Table rows fade in by the kit; give a row the class `mo-new` only to show a record that was just made.
**Check.** Open a table: the first eight rows fade in 20 ms apart.
**Guarded in Praisindo by** a browser test.

### MO-07
**Rule.** Status: in the vertical Wizard the line under a finished step draws downward (.32 s) and the waiting step has a soft ring that pulses every 2 s; the tick of a done screen (`.state.ok`) pops in; a chart draws its series in .6 s (ease-out) when motion is on and not at all when it is off
**Meet.** Use `Wizard variant="vertical"` or `"status"` and the `.state.ok` tick; do not animate steps yourself.
**Check.** A finished step draws its line down; the waiting step has a soft ring.
**Guarded in Praisindo by** a browser test.

### DA-01
**Rule.** Every fact has ONE source and the screens that show it read that source; they never make a copy of their own. When a fact changes at one point (a confirmed request, a new product in the catalogue, an extra record), every point that shows it changes with it: other pages, totals, counts and lists. A screen that needs a number the source does not give gets it from a function of the source, not from a table of its own.
**Meet.** Put what a customer holds (or any shared fact) in one domain function and import it in every screen, export and total; do not recompute it in a page. A change (a confirmation, an edit) is written to the source, never patched into one screen.
**Check.** Change the source (confirm a purchase, add a product): the detail page, the list, the totals and the export all show the change; grep the screens for a second calculation of the same fact.
**Guarded in Praisindo by** a unit test.
