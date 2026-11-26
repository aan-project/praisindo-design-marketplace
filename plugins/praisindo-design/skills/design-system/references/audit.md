# Audit mode (fixing the UI of a running project)

Use it when the user asks to repair, restyle or review an existing UI, or when you start on a project that was not built with this skill. Do not change anything before you have produced the report and the user has seen it, unless the user asked for fixes in the same message.

## Procedure

1. **Inventory.** Stack, entry points, routes/pages, shared components, global CSS, how colours/fonts/spacing are defined, the i18n set-up, the menu/shell, whether Design System and Branding pages exist.
2. **Scan** (use grep or a small script if code execution is available; otherwise read the files):
   - Literal colours: `#[0-9a-fA-F]{3,8}`, `rgb(`, `hsl(` in components and CSS outside the token file.
   - Literal sizes: `font-size`, `border-radius`, `box-shadow`, `letter-spacing` (TH-12: it comes from `--ls`, 2% with Figtree, 0 with another brand font), spacing values that are not tokens; px values (width, height, padding, margin, gap, top/left/right/bottom, line-height) that are not a multiple of 4 (exempt: border/outline widths, radius, font-size, letter-spacing, icon sizes 14/18/20, hairlines, %, vh, vw, em, rem, fr).
   - Unitless `line-height`; `<b>` tags; `data-tip` or CSS-only tooltips; browser `title` used as the only help text.
   - Home-made pills/tags/badges/cards/alerts/buttons that replace DS components; a card inside a card; a custom dot badge or fill badge; interactive badges; counts that are not Chips.
   - Alerts that are on screen when a page first opens; a standing note placed between the page head and the content.
   - Missing states (empty, loading, error with Retry) on lists and data views; missing aria labels on icon-only buttons; missing focus styles (`outline:none` without replacement).
   - i18n: strings in components, missing Indonesian or English keys (the two key sets must be equal).
   - Shell: topbar on desktop, sidebar sizes, missing edge toggle, missing bottom navigation on a phone, horizontal scroll at 390px.
   - Missing mandatory outputs: Design System page, Branding page with real saving, new-component log.
   - Contrast of text/tokens below 4.5:1; use the DS tokens instead of ad-hoc colours.
3. **Classify** every finding: **Blocker** (breaks a mandatory rule or the mandatory outputs), **Fix** (violates a rule, easy), **Cleanup** (inconsistency), **Question** (needs a decision). Cite the rule id from the area files (`rules-*.md`, index in `rules-wajib.md`).
4. **Report** in the format below. Then ask which groups to fix, unless the user already said "fix everything".
5. **Fix in small steps.** One kind of fix per step (e.g. all literal colours -> tokens), with the CSS safety rules (exact edits or a parser). After each step re-run the scan and list what is left. Do not change behaviour or copy; do not restyle what is not a violation.
6. **Close** with the final checklist from `SKILL.md`.

## What `scripts/audit.mjs` checks (rule ids)

Every finding cites a rule id: a register id (area files `rules-*.md`) or a skill id (MO = mandatory output of `SKILL.md`, SK = skill code rule). `node scripts/audit-selftest.mjs` proves that each pattern check finds its violation in `scripts/fixtures/violations/` and that both starters, with their example pages, are clean.

| Check | Class | Rule |
|---|---|---|
| literal hex / rgb / hsl colour | Fix | CODE-02 |
| literal border-radius, font-size, box-shadow | Fix | CODE-02 (radius: CD-01, CD-12, CH-04) |
| literal letter-spacing | Fix | TH-12 |
| unitless line-height | Fix | LY-03 |
| off-grid px (padding, margin, gap, offsets, sizes, style objects) | Cleanup | LY-01 |
| `<b>` tag | Cleanup | CODE-01 |
| focus outline removed | Fix | AX-01 |
| `data-tip` / `data-tooltip` (home-made tooltip) | Fix | CD-07 |
| dot badge | Fix | BD-01 |
| direct Web Storage outside the storage module | Cleanup | TH-03 |
| `ex-*` example routes still in `nav.config` although real product pages exist | Cleanup | GN-06 |
| `dangerouslySetInnerHTML` outside TSX | Cleanup | SK-01 (escape dynamic text) |
| English and Indonesian key sets differ | Fix | DS-03 |
| labelled form field (`Input`, `Textarea`, `PhoneInput`, `DateField`, `PasswordInput`, `MultiSelect`, `TagInput`, `GroupedNumberInput`, or a hand-made `.fld` with an input) with neither `req` nor `opt` | Fix | FM-01 |
| hand-made required label (`.req`) whose control has no `aria-required="true"` | Fix | FM-01 |
| page with a data table (`<table>`, `.tw`, `Table`) without `SearchBar` + Advanced filter | Fix | TB-06 |
| ... without `Pagination` | Fix | TB-03 |
| ... without `StatCards` | Fix | TB-10, TB-12 |
| icon-only `Button` without `aria`, icon-only `<button>` without `aria-label` | Fix | BT-04 |
| button label "Done" / "Selesai" (a `Button` / `LinkButton` label, or a button in a drawer footer `.df`) | Fix | BT-02 |
| more than three buttons in an action column `.acts` | Fix | TB-09 |
| `<Alert>` rendered without a condition (not after `?`, `&&`, `||`, `:`, `=>`, `return`), or `.al` in the first-open markup of an HTML page | Fix | CD-08 |
| a name that the design system renamed (component, class, custom property; list in `references/renames.json`) | Fix | RN-01 (DS-23, DS-26); `node scripts/migrate-names.mjs <project> --apply` converts it |
| shell missing | Blocker | PJ-01 (SB-01) |
| Design System page missing | Blocker | PJ-02 (DS-01) |
| Branding page missing | Blocker | PJ-03 (BR-06) |
| Branding without a save adapter | Blocker | PJ-04 |
| `docs/design-system/new-components.md` missing | Blocker | PJ-05 (PR-04) |
| `docs/design-system/changelog.md` missing | Cleanup | PJ-06 (DS-02, DS-10) |
| a `Drawer` with two or more form fields and a Save / Add / Create / Update button (adding or editing data in a drawer; exception `/* ds-allow: <reason> */`) | Fix | DK-01 |
| Branding or Design System in the sidebar menu (`NAV`) instead of the menu of the user (`PROFILE_NAV`) | Fix | NV-13 |
| the root element has no `data-motion` (set from `motionOn()`) | Cleanup | MO-03 |

**Exception for the table checks.** A table that is not a list page (a small table inside a detail card, a comparison) may skip the toolbar, pagination and stat cards when the file says why: `/* ds-allow: <reason> */` (HTML `<!-- ds-allow: <reason> -->`). No reason, no exception. There is no exception comment for the other checks.

**What a script cannot see** is checked by hand with the page compliance check of `references/migrate.md` (Tahap 4) and the matching example page: order of the list page, right-most Show / hide columns, frozen columns, states, info icons on terms that need one, footer order, dialog kinds, text rules.

## Report format

```
# UI audit — <project> — skill design-system v2.193.0 — <date>

Summary: <screens/files scanned>; Blockers n, Fixes n, Cleanups n, Questions n.

## Blockers
| # | Finding | Where (file:line / page) | Rule | Suggested fix |

## Fixes
...same table...

## Cleanups
...

## Questions for the owner
1. <question> — recommendation: <...>

## Mandatory outputs
Shell: ok / missing / partial — note
Design System page: ...
Branding page + real saving: ...
New-component log: ...

## What I did not check
<things that could not be read or run>
```

Keep facts (what you saw in the code) apart from assumptions; mark assumptions. If something could not be read or run, say so; do not guess.
