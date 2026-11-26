# Decision table: which surface for which intent (skill v2.184.2)

Read this BEFORE you build a page or a flow. The choices below are made already: do not ask the user which surface to use, and do not invent another one. The ids DK-01 to DK-29 are rules of the Praisindo register (decisions of the Praisindo owner, 2026-11-11). If no row fits, STOP and write the need under "Rule proposals" in `docs/design-system/new-components.md`; do not improvise a layout, a drawer or a dialog.

How to use it: (1) name the user's intent, (2) find its row, (3) build exactly that surface with the components named in the row, (4) copy the example page of that type (`features/examples/`), (5) write one line in the page spec: "intent -> row DK-xx".

## A. Entering and changing data

| Id | Intent | The ONE surface | Required | Not allowed |
|---|---|---|---|---|
| DK-01 | Add data (simple or complex) | **Form page** (`FormPage` example, route `<list>/new`) | Breadcrumb back to the list, page title and description, one card per group of fields with its own title (never `GroupTitle` captions in one card), the buttons `Save` (fill) and, last at the bottom, `Cancel` (transparent) in the card of actions without a header in the right column (never a card footer, DK-27, DK-29), the warning dialog when leaving with unsaved changes (DR-06), the menu entry of the list stays highlighted | A drawer, or a dialog with a form |
| DK-01 | Edit data (simple or complex) | **The same form page** (route `<list>/<id>/edit`), or the detail layout when the page is a full editor of an entity | Values filled in, Back, the same card of actions and leave dialog | A drawer |
| FM-17 | Pick ONE value from a list in a form field (category, type, status, channel) | **`Select`** (`label`, `req`/`opt`), also with two to four options | `label`, `req` or `opt`, `opts` | `SegmentedControl` as the field, radio buttons for a long list; a segmented control is for a view, a period or Match all / any |
| DK-02 | A flow with several steps (a wizard, a long create) | **Stepper form page** (`Wizard`, horizontal with Back / Next or vertical as the rail, DK-24; `Accordion` for optional parts) | A step with an error turns red; a summary at the last step | One endless form |
| DK-03 | Change ONE value (a switch, a status, a role) | **Control in place** (`Switch`, `Select` in the row or the page), saved at once | A toast that confirms; a way to undo | A drawer or a page for one value |
| DK-04 | A contextual action that needs 1 to 2 inputs (assign, reject with a reason) | **Centred dialog** (`Dialog` kind by consequence) | Title as a question, a required reason when the action is a rejection | A drawer *(default, to be confirmed)* |
| DK-04 | A contextual action with 3 to 5 inputs (take action, schedule) | **Drawer size sm** | Footer: Cancel, then the main action. It is an ACTION, never "add / edit data" | Using it to add or edit a record |
| DK-05 | Bulk action on selected rows | **Bulk bar in its own row** above the table; parameters in a dialog | Count of selected rows, a way to clear | An action without confirmation when it cannot be undone |
| DK-06 | Import | **NumberInput page** (choose file, map columns, validate, result) | Preview, counts of valid and invalid rows | An import with no preview |
| DK-06 | Export | **Dialog or drawer sm** *(default, to be confirmed)*; a page only when there is a preview or a history | Format and scope are explicit | |
| DK-07 | Settings | **Settings page**, one card per section, save per section | A saved confirmation (toast) | One Save at the end of a long page |

## B. Showing data

| Id | Intent | The ONE surface | Required |
|---|---|---|---|
| DK-08 | A list of records | **List pattern** (TB-17): stat cards (widget), tabs (optional), toolbar (`SearchBar`, Advanced filter, Show / hide columns), table, `Pagination`, `Disclaimers` (optional) | Copy `features/examples/ListPage.tsx`; a row opens the detail page |
| DK-09 | One record in full | **Detail page**, one layout of the catalogue: two columns (summary then tabs), three panels (profile, tabs, summary), or long page with jump rail | Breadcrumb Back; the sidebar collapses on a detail page (SB-30) |
| DK-10 | A quick look without leaving the page | **Read-only drawer** | A link "open the full page" |
| DK-11 | Search, filter, choose columns | **Advanced filter drawer** and **Show / hide columns drawer**, both size sm, opened from the toolbar | The count of active filters on the button |
| DK-12 | History of events | **Activity log list** (`LogList`) or the List pattern for an audit table | |

## C. Confirming, telling, failing

| Id | Intent | The ONE surface |
|---|---|---|
| DK-13 | Delete or revoke (cannot be undone) | Dialog `danger` |
| DK-13 | An important normal action (send, publish) | Dialog `confirm` |
| DK-13 | Leave with unsaved changes | Dialog `warning` (Stay / Leave) |
| DK-14 | Success | A **toast**; a success dialog only when the person must know before going on |
| DK-14 | Validation | The message in the field (`err`), then one `Alert` after the person pressed Save (never on open) |
| DK-14 | System error, no data, loading, no permission | An error state with Retry, an empty state with the next step, a loading state, a disabled control with the reason; every area that shows data has all four |

## D. Page rules that need no decision

| Id | Rule |
|---|---|
| DK-15 | Every page uses ONE layout of the catalogue (list, detail variants, form, stepper, settings, home, sign-in, documentation); until the catalogue is complete use the example pages (`ListPage`, `FormPage`, `DetailPage`). Never compose a page layout from loose `div`s. One `fill` button per area, one `h1` with a short description, a breadcrumb on detail and form pages. |
| DK-17 | Form page cards | A card title is never the page title; one step per group, one or more cards in a step, each titled for its fields (DK-28); the buttons are the card of actions in the right column, never the footer of a card (DK-27); two columns when the fields feed a live result (inputs left, result next to them) | `FormPage` example |
| DK-21 | Long form (five groups or more) | **Vertical Wizard rail** in the right column (`FormShell`, DK-24), never a jump rail | `FormPage` example |
| DK-22 | Every list page | **List pattern**: stat cards, one card with tabs, toolbar, table, Pagination; a bare table under the stat cards is converted | `ListPage` example |
| DK-24 | Stepper form layout | Horizontal (the numbered Wizard on top, Back / Next in the card of actions) or vertical (the vertical Wizard as the rail), an icon toggle at the right end of the page title, remembered per page | `FormPage` example |
| DK-26 | Tools row of a form page | Above the card of actions: Tips always, Recent activity only for an existing record, Data readiness only for data that needs an integration | `FormPage` example |
| DK-27 | Form page, the one rule | One card per group of fields with its own title, a stepper for several groups, the fields grouped first and a step with one or more cards (DK-28), the buttons in the card of actions on the right with Cancel last (DK-29), never a card footer or `GroupTitle` captions in one card, the leave dialog (DR-06) | `FormPage` example |
| DK-28 | Fields of a form page | Group first: related fields together in a card with its own title; a step of a stepper form holds one or more cards | `FormPage` example |
| DK-29 | Card of actions of a form page | Back, the primary action, Cancel last at the bottom, in both layouts; `FormShell` draws Cancel | `FormPage` example |
| DK-18 | Record of a request, report or read-only brief | **Two-column detail page** (cards wide, status and next step narrow), never a drawer | `DetailPage` example |
| DK-19 | Toast | Fixed at the bottom right | |
| DK-20 | Field popover | Fitted to the viewport (`useFieldPopover`) | |
| DK-16 | Tokens and existing components only; no local CSS for layout, colour, spacing or weight. A deviation goes to "Rule proposals", never into the page. |

## Rules (Meet / Check)
The text, Meet and Check of DK-01 to DK-20 are in `rules-keputusan.md`; DK-21 to DK-29 are in `rules-komponen.md`.

## Open points (defaults used until the owner confirms)
1. The border between the dialog (1 to 2 inputs) and the drawer sm (3 to 5 inputs) for contextual actions.
2. Export as a dialog or drawer sm, a page only with a preview or a history.
3. The catalogue of page layouts (2 to 3 variants per page type) is prepared with the owner's wireframes; until then DK-15 points to the example pages.
