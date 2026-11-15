# The Design System page (mandatory in every application)

Entry "Design System" in the menu of the user (rule NV-13; route `design`). It is the live catalogue of the project's tokens, components and rules. Rules DS-01 to DS-27 (`rules-design-page.md`), "design changes are visible at once". Since DS 2.77 the layout is DS-19: one long page of one card per item, a menu that is always open in three levels, A to Z (DS-25), with a description for each page (DS-24) and a search over pages and code names (DS-22, DS-27). The starter Design page still has the earlier frame (sections and a contents list); a project that builds the long page follows DS-19 to DS-27, and every project component gets its own page.

## What it must contain

1. **Hero** (DS-15): at the top, a hero (`.dshero`) on a brand background: the page title "Design System", a version Chip (DS-16: a static Chip, the highest version of the change log, read from the log data, never typed in a component) and the search field; the contents list sits on the left. In light mode the fill is brand-default mixed with brand-strong-1 so the white title is 4.5:1 or more. When the user scrolls down the hero goes away; scrolling up shows a small hero with the search field.
2. **Contents list** (DS-01, DS-05, DS-19): grouped (Guide, Foundations, Components, Patterns & layout, Content & quality). It follows the section in view (scroll-spy), a click scrolls to the section and marks it with `aria-current="location"` on exactly one entry (never `true`); the spy is silent only while a click scroll runs. Below 1100px the list becomes wrapping chips. Sticky.
3. **Search** (DS-22, DS-27): a combobox that finds pages by name or alias (English and Indonesian) and, in groups under them, the code names: components in the code, classes and tokens, read from the live page and the loaded stylesheets, all results listed with their count. Up/Down/Enter/Esc; clear button; empty state. Choosing a result scrolls to it and marks the first example that uses it.
4. **Sections** (order: guide, foundations, components, patterns, content):
   - Guide: Getting started, What's new, Principles.
   - Foundations: Color (tokens with hex shown; click copies it, DS-07), Typography, Spacing/radius/elevation, **Grid 4px**, Icons, Motion.
   - Components: Button, Badge, Chip, Alert, Form fields, Selection controls, Tabs, Card & section, List rows, Table, Widget, Tooltip, States & feedback (empty/loading/error), Drawer/menu/toast (overlays), Page header, Page layouts, Navigation & shell.
   - Patterns & content: Mobile, Content & language, anything the project adds.
5. **What's new** (DS-02, DS-10): the guide shows only the newest entry (the highest version of the whole log) with "View all", which opens a drawer with the full history and its own search. The log is read from one source (`docs/design-system/changelog.md`), never typed in a component. The version Chip of each row keeps its width (DS-18, `.dslog>div>:first-child{flex:none}`).
6. **Labelled examples** (DS-17): every component example sits in a labelled row: variant name and component name on the left ("Error · Input err"), the example on the right.
7. **API table per component**: signature, props, defaults, notes. On a phone API tables keep a width of 920px and scroll sideways (DS-09).
8. **A live example uses the real component**, never a hand-written copy of its markup. A component without an example is a defect.
9. **Search field** is 44px high; no Previous/Next at the end of a section (DS-06). The language-toggle demo stays visible whatever the state of the sidebar (DS-08).

## Keep it current (rule "design changes are visible at once")

A change to a component, token or rule is finished only when:
- the Design page shows it with a live example of the real component,
- the changelog has a line (version, date, one or two sentences) and the page's What's new reads it,
- the changed areas were checked at 1440px and 390px, in light and dark.

When the project adds a component that is not in the DS (see `new-components-log.md`), it appears in a section "Project components" of the page with the same live example and API table, marked as "not in the DS master yet".

## Minimum version for a small project

Hero + contents + search; sections Principles, Color, Typography, Spacing/Grid, Icons, Button, Badge, Chip, Alert, Form fields, Card & section, Table, States, Navigation & shell; What's new; every component actually used by the project.

## Implementation

- Data-driven: a list of section ids/titles/descriptions (EN + ID) feeds the contents list, the search index and the section order. A test or script fails when a component in the components folder has no example.
- Pure helpers for search words, section hit, log hit and scroll-spy pick (`dsTerms`, `dsSecHit`, `dsLogHit`, `dsSpyPick`) are easy to unit test.
- Constants used by the Praisindo page: show-to-top at 600 px scrolled, click-scroll lock 900 ms, small hero shows after 48 px scrolled up in a row and hides after 8 px down.
