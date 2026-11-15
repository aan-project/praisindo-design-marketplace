# Badge (status, category) and Chip (count, tag, name) (Praisindo DS v2.116.0, skill v2.116.0)

The ids are those of the Praisindo owner rules register (general rules only; product-domain rules are not in the skill). Every rule is permanent: do not change, loosen or re-interpret it; a need for something else goes to "Rule proposals" in `docs/design-system/new-components.md`. Examples in brackets name pages of the Praisindo reference application; apply the rule to the equivalent page of your product.

## Pattern: Badge or Chip?

| The label is | Component |
|---|---|
| a status (Active, Pending, Rejected) or a category (segment, priority, risk) | `Badge` with intent and icon from `badgeFor(domain, value)` (`src/domain/badgeIcons.ts`) |
| a count, a number, a tag, a name, a version, a permission | static `Chip` |
| a choice the user makes, a filter, a removable value | interactive `Chip` (`onClick` / `selected` / `onRemove`) |

A badge is never clickable. A pill made with CSS is never allowed. A new domain added to `badgeIcons.ts` (with its `bdg.d.<domain>` keys) is shown on the Design System page in the "This project" section: one Badge per value, so that intent and icon can be reviewed.

## Rules

### BG-04
**Rule.** Purple and cyan are accent intents and may label a category (revised keputusan owner 2026-10-26; the old uses of purple and cyan as a status colour stay, their meaning is not changed); text on warning soft surfaces uses the warning-strong foreground token
**Meet.** Use `intent="purple"` / `"cyan"` for a category only.
**Check.** Read the badge map.
**Guarded in Praisindo by** a unit test.

### BG-05
**Rule.** No read-only badge on cards: the card markup has no "read-only" badge label
**Meet.** Do not show read-only as a badge; say it in helper text or disable the actions with a reason.
**Check.** grep "read-only" / "Read only" badges.
**Guarded in Praisindo by** a unit test.

### BG-08
**Rule.** A category label such as the data confidence of a recommendation (high, medium, low) is the Badge (`.bdg`, soft, with the confidence icon of the central map, never fill, never dot): High = success, Medium = warning, Low = danger, size sm, in the plan card, the pick summary, the compare table and the detail row; there is no `.rxp-cf` or any pill of its own
**Meet.** Category values (for example High / Medium / Low) are entries of `badgeIcons.ts` with their intent and icon.
**Check.** Look at the badges together: different icons.
**Guarded in Praisindo by** a browser test.

### BD-01
**Rule.** There is ONE badge look, soft: a rectangle with the radius token `--r-badge` (8px; it was 4px until keputusan owner 2026-10-26, digantikan), background `--int-sub`, text and icon `--int-fg` of the intent, no border, not a full pill, no dot, no animation, no fill, no outline; one size (20px high, text `--fs-xs`, padding 0 4px (it was 0 8px until keputusan owner 2026-10-29, revisi UI), gap 4px); intents are the existing ones (brand, success, warning, danger, info, neutral, purple, cyan)
**Meet.** `<Badge intent label icon />` only; never a pill class.
**Check.** Audit (dot / fill badge and pill checks).
**Guarded in Praisindo by** a unit test.

### BD-02
**Rule.** Every badge shows an icon (14px, `aria-hidden`, left of the text) that fits its value. A badge without an icon exists only through the explicit `noIcon` flag (version numbers, product names, permission names, tags, scenario labels); never by omission
**Meet.** `Badge` takes its icon from `badgeFor(domain, key)`; `noIcon` only for version, product, permission, tag.
**Check.** Audit (badge without icon).
**Guarded in Praisindo by** a unit test.

### BD-03
**Rule.** Icons come from one central map (`src/domain/badgeIcons.ts`, built from docs/badge-icon-map.json): the same value has the same icon in the whole app, values that show together in one group have different icons, every value of the map has an icon, and no page has a map of its own
**Meet.** Add every status / category value to `src/domain/badgeIcons.ts`; never a map in a page.
**Check.** grep for icon maps outside `badgeIcons.ts`.
**Guarded in Praisindo by** a unit test.

### BD-04
**Rule.** Colours: the text and icon of a soft badge are the `--int-fg` of its intent; in light mode success, danger and info use `--color-surface-<intent>-strong-2` (7.00, 5.75 and 7.56:1 on their soft background), the other intents their `*-strong` foreground; in dark mode every intent uses its `*-strong` foreground (7.2:1 or more). Every intent reaches 4.5:1 in a new project (the Praisindo warning-in-light exception is not copied)
**Meet.** Nothing to write: `Badge` sets `--int-fg` / `--int-sub` per intent.
**Check.** `contrast.mjs`.
**Guarded in Praisindo by** a unit test.

### BD-05
**Rule.** A badge is one line: a text that does not fit is cut with an ellipsis (the icon stays), and the badge then carries the full label in its `title`; the badge never grows wider than its container
**Meet.** `Badge` cuts the text and sets `title`; do not set a width.
**Check.** Put a long label in a narrow cell.
**Guarded in Praisindo by** a browser test.

### BD-06
**Rule.** The risk profile badge (Conservative, Moderate, Growth, Aggressive) has one colour per level, chosen by its position on the scale: info, success, warning, danger, with the icons `shield`, `balance`, `show_chart`, `trending_up`; the channel badge stays brand
**Meet.** Profile-like categories: a neutral Badge with one icon per value in `badgeIcons.ts`.
**Check.** Look at the three values together.
**Guarded in Praisindo by** a unit test.

### BD-08
**Rule.** The data confidence badge uses the icons `check_circle` (High, success), `error_outline` (Medium, warning), `help_outline` (Low, danger): the cellular-bar icons were unreadable at 14px. Two badges that show in one row never share an icon: "Score N/A" has `question_mark` for that reason (keputusan owner 2026-10-26)
**Meet.** Pick icons that read at 14px (`check_circle`, `error_outline`, `help_outline`) and never repeat one in the same row.
**Check.** Look at a row with two badges.
**Guarded in Praisindo by** a unit test.

### BD-09
**Rule.** The header of a Kanban lane is the one badge with the icon and intent of its status from the central map (`badgeFor('oppStatus', key)`), no pulse, no `DotBadge`; the title of a card stays a `<button>` with the `::after` cover, no `role=button`, no nested interactive element (keputusan owner 2026-10-26, decision 13)
**Meet.** A board lane header is `Badge` from `badgeFor(domain, key)`; the card title is a `<button>`.
**Check.** Look at the board lane headers.
**Guarded in Praisindo by** a unit test.

### BD-10
**Rule.** A badge is a STATUS or CATEGORY label and never interactive: no click handler, no button or link role, no tabindex, no button inside it. A label that is only a number, a name, a value, a version or a user's choice is a Chip (CH-01). The `noIcon` badge stays a Badge (it is still a status or category). Written exceptions (a badge as a plain label inside a large button that is itself the one action): the header of a `Accordion` (`.ccb`), a Home list row (`.hp-m`, `.si2`) and an opportunity row of Customer 360 (`.c3c`); the tags of an `RadioCard` are static Chips now. Since keputusan owner 2026-10-30 a badge shows an information tooltip on hover and tap (BD-13); that is not an action: the badge still has no tabindex, role, button or click handler of its own
**Meet.** Never put `onClick`, `role`, `tabIndex` or a button on a `Badge`; a clickable label is a `Chip` button.
**Check.** Audit (interactive badge check).
**Guarded in Praisindo by** a unit test.

### CH-01
**Rule.** The Chip is the compact NON-STATUS label, in two modes. STATIC (no handler: a `span`, no hover, no focus, no pointer): a count or a number ("3 improved"), a tag, a product or entity name, a version, a permission, a scenario label; 20px high, SOLID neutral (the neutral default fill with `--color-text-secondary` text, CH-08), solid brand when `selected` (a count that asks for attention, the count of the active tab). INTERACTIVE (a handler): selectable (`aria-pressed`), removable (own close button with an `aria-label`) or clickable; 28px high, neutral outline at rest, soft brand when selected, hover, focus-visible, disabled, a touch target of 40px or more on a phone (42px). Both are full pills (`--r-pill`); a static Chip never has a semantic intent or a status icon. The Badge is the STATUS or CATEGORY (BD-10): "what is its status?" answered by the label is a Badge, a label that is only a number, a name, a value or a user's choice is a Chip. The Chip is the only component added for the badge migration (PR-04)
**Meet.** `<Chip label />` static; `<Chip label onClick|onRemove|selected />` interactive.
**Check.** Tab to a chip: only interactive chips take focus.
**Guarded in Praisindo by** a unit test.

### CH-02
**Rule.** A removable Chip is a non-interactive container with the label and ONE close button; a selectable or clickable Chip is one `<button>`: no interactive element is ever nested in another (axe `nested-interactive` does not grow)
**Meet.** `<Chip label onRemove />` (one close button); never a button inside a button.
**Check.** axe `nested-interactive` is 0.
**Guarded in Praisindo by** a unit test.

### CH-03
**Rule.** The suggestion buttons of a field, the date presets, the removable tags of TagInput and MultiSelect and the value toggles of the rule editor are Chips; `.chip`, `.fsg` and `.sbc` do not exist any more. Behaviour, data and test ids are unchanged
**Meet.** Suggestion buttons, date presets and removable tags are `Chip` (Field `sugg`, `TagInput`, `MultiSelect`).
**Check.** grep `.chip` / `.fsg`: none.
**Guarded in Praisindo by** a browser test.

### CH-04
**Rule.** `--r-pill` (999px) is the one token for a full pill; the Chip uses it, no stylesheet writes a pill radius literal for a tag, count or chip (keputusan owner 2026-10-26)
**Meet.** `border-radius: var(--r-pill)` is used only by Chip and SegmentedControl; never 999px in project CSS.
**Check.** Audit (radius literal check).
**Guarded in Praisindo by** a unit test.

### CH-05
**Rule.** Every count of the app is a static Chip (tab counts, section counts, menu counts, button counts, the scenario button, the rule editor tools); `Count`, `.cnt`, `.jcnt` and `.qa-n` do not exist any more. A score number with a tooltip (`.c3sc`) is a static Chip too. `.lga-pill` is not decided (decorative tagline on the sign-in aura) and stays in the PR-05 list for the owner
**Meet.** Every count is `<Chip label={n} />` (or `count` of Button / Tabs / nav).
**Check.** grep `.cnt`: none in project code.
**Guarded in Praisindo by** a unit test.

### CH-06
**Rule.** The count of a TAB is a static Chip in the `default` tone (`tone="default"`): a solid fill, not the soft look. In a tab that is not selected the fill is `--color-surface-neutral-tertiary` (the neutral default fill of the DS) with `--color-text-secondary` text (owner decision 2026-11-02; contrast is checked by the test, 4.5:1 or more); in the selected tab it is `--color-surface-brand-default` with white text (check 4.5:1 for the brand colour with `scripts/contrast.mjs`; the Praisindo exception is not copied). Since CH-08 every static count is solid and `tone="default"` is the same look (kept as the old name); the soft Chip is only for a chip on a component with a solid fill. The soft Chip on a tab strip was invisible (the same #f7f7f7). One place: the shared `Tabs` container (keputusan owner 2026-10-26)
**Meet.** `Tabs items={[[key, label, n], ...]}`: the count is drawn as a default-tone Chip.
**Check.** Look at selected and unselected tab counts.
**Guarded in Praisindo by** a unit test.

### CH-08
**Rule.** A static Chip (a count, a tag, a name, a version) is SOLID by default: `--color-surface-neutral-tertiary` with `--color-text-secondary` text (changed 2026-11-02, owner decision), and `--color-surface-brand-default` with white text when `selected`. The SOFT look (`--color-surface-neutral-secondary`; `--color-surface-brand-subtle-1` when selected) is used only on a component that has a solid fill: a fill Button does it by itself (`.btn.b-fill .chp-s`), any other solid host asks for it with `tone="soft"` (class `chp-sf`). Changes CH-01, CH-05, CH-06, CH-07 and SB-23 (they said soft)
**Meet.** `<Chip label />` is solid neutral; `selected` makes it brand.
**Check.** Look in light and dark.
**Guarded in Praisindo by** a unit test.

### CH-09
**Rule.** No Chip has a shadow (`box-shadow`): the ring that separated the count of the scenario button and of the bell from the button is gone
**Meet.** Never add `box-shadow` to a chip.
**Check.** Audit.
**Guarded in Praisindo by** a unit test.

### BD-11
**Rule.** `local_fire_department` (a flame) is the icon of every value that means "new": the opportunity status New, the rule run result New and the Kanban lane header New; no other value uses it (keputusan owner 2026-10-26; it was `fiber_new`)
**Meet.** Map every "new" value to `local_fire_department` in `badgeIcons.ts`; no other value uses it.
**Check.** Read the map.
**Guarded in Praisindo by** a unit test.

### BD-12
**Rule.** The Badges of the Opportunity recommendation cards (the plan card, the compare table, the detail rows, the provenance tags, the selection summary and the signal row of the Opportunity detail) are `noIcon` Badges: the intent still comes from the central map, the icon is left out because the card is dense and the text is clear (keputusan owner 2026-10-26). `noIcon` stays a Badge variant. The "Top pick" ribbon (RB-01) is not a badge and is unchanged
**Meet.** `<Badge noIcon />` inside dense recommendation-like cards; the intent still from the map.
**Check.** Look at the card.
**Guarded in Praisindo by** a unit test.

### BD-13
**Rule.** Every badge says what it is for in a tooltip (the Tooltip bubble, dark with a tail) when the mouse is on it or it is tapped: a domain badge reads "<domain name> is <label>" ("Status is Active", "Risk profile is Moderate"; keys `bdg.d.<domain>`, `bdg.is`), a fixed single-value badge has its own sentence (`bdg.fx.<key>`), a badge outside the central map passes `what` or `tip`; a badge with no information has no tooltip. The bubble exists only while it is open and is drawn in the body, so the text of a badge or of its cell never changes; it never catches the pointer; Escape and a tap outside close it. Hover and tap only: a badge is never focusable (BD-10). A cut label still carries its `title` (BD-05)
**Meet.** `Badge` shows its tooltip from `badgeTips.ts` (`bdg.d.<domain>`, `bdg.is`); add the domain name key in EN and ID.
**Check.** Hover and tap a badge.
**Guarded in Praisindo by** a unit test.

### PR-05
**Rule.** A pill, tag or chip (category, level, label) is the Badge (`.bdg` soft); a status is the Badge with its icon; a count, a tag, a name, a version and an interactive tag are the Chip (CH-01). A selector outside the badge files that makes a text element a pill (radius 999px or more, or 50%) with a soft semantic background is a shadow badge and fails the guard unless it is in its written allowlist; a selector outside the badge files that uses `var(--r-badge)` is a shadow badge too Written exception: `.lga-pill` (the tagline pill on the sign-in aura, a decorative glass label and not a status or a tag; owner 2026-10-26)
**Meet.** A pill / tag / chip is `Badge` or `Chip`; never a class with `border-radius:999px` and a soft background.
**Check.** Audit (home-made pill check).
**Guarded in Praisindo by** a unit test.

### CH-10
**Rule.** A Chip that is not selected (the interactive one and the static default) has the text colour subtle-4; a selected one keeps brand strong
**Meet.** Do not set the colour of a Chip by hand: the `Chip` component draws subtle-4 text, and brand strong when selected.
**Check.** Look at a Chip that is not selected: subtle-4 text.
**Guarded in Praisindo by** a unit test.

### BD-15
**Rule.** The label and the icon of a badge always have the colour and the size of the badge itself, and the badge has its intent colour (`--int-fg`): no rule of the surroundings (a list, a card, a table, the documentation) may recolour or resize them. A descendant rule such as `.list span{color:...}` must name the texts it means (`.list>li>span`) and never reach a badge or its tooltip wrapper `.tt-wrap`.
**Meet.** Use `Badge` and write the CSS of a container with child selectors that name the texts; never `.container span`.
**Check.** Compare the label and the icon of every badge with the badge (computed colour and font size) in the browser, on every page.
**Guarded in Praisindo by** a browser audit of every badge of every route.
