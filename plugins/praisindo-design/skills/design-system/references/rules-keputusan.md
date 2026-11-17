# Decision rules DK-01 to DK-20 (Praisindo DS v2.124.0)

The ids are those of the Praisindo owner rules register (decisions of the owner, 2026-11-11). Every rule is permanent: do not change, loosen or re-interpret it; a need for something else goes to "Rule proposals" in `docs/design-system/new-components.md`. The decision table that uses them is `decisions.md`; read it first.

Example pages: `features/examples/FormPage.tsx` (add / edit), `ListPage.tsx` (list), `DetailPage.tsx` (detail), `DialogsPage.tsx` (dialogs).

## Rules

### DK-01
**Rule.** Adding or editing data, short or long, is a form PAGE (route `<list>/new`, `<list>/<id>/edit`; page layout `detail` like the Signal rule editor; breadcrumb back, footer Cancel then Save, the leave dialog DR-06, the menu entry stays highlighted), never a drawer or a dialog with a form. The exceptions are DK-03 (one value in place) and DK-04 (a contextual action). The guard `tools/dk01_allowlist.json` lists the DK-04 contextual actions (no conversion is waiting since DS 2.66); the list only shrinks
**Meet.** Form page pattern at `<list>/new` and `<list>/<id>/edit` (the example `features/examples/FormPage.tsx`, route layout `detail`); footer Cancel then Save; leave dialog `warning`.
**Check.** Audit (DK-01: a `Drawer` with two or more fields and a Save / Add / Create / Update button; exception `/* ds-allow: <reason> */`). Open every add and edit flow: it is a page.
**Guarded in Praisindo by** a unit test and a browser test.

### DK-02
**Rule.** A form page of several groups of fields, and a flow with several steps, is a stepper form page: every group of fields is a step of the `Wizard` (the numbered Wizard in the horizontal layout, the vertical Wizard as the rail in the vertical layout, DK-24); Back and Next are in the card of actions on the right; a step with an error turns red; a summary at the last step of a flow; a form of one group has no Wizard; `Wizard` is never inside a drawer
**Meet.** Give every group of fields of a form page as a step; Back and Next in the card of actions; a summary at the last step of a flow.
**Check.** No `Wizard` inside a `Drawer`; walk the steps; a field with an error turns its step red.
**Guarded in Praisindo by** a unit test.

### DK-03
**Rule.** Changing ONE value (a switch, a status, a role) is a control in place, saved at once, with a toast and a way to undo; not a drawer or a page
**Meet.** `Switch` or `Select` in the row or page, saved at once, a toast and a way to undo.
**Check.** Change the value: no drawer and no page opens.
**Guarded in Praisindo by** a unit test.

### DK-04
**Rule.** A contextual ACTION (assign, reject with a reason, take action, log an outcome) is a centred dialog when it needs 1 to 2 inputs and a drawer size sm when it needs 3 to 5; it is never used to add or edit a record (defaults of the owner, to be confirmed: the border between 2 and 3 inputs)
**Meet.** A centred `Dialog` for 1 to 2 inputs; a `Drawer` size sm for 3 to 5; never for adding or editing a record.
**Check.** Count the inputs of every action drawer.
**Guarded in Praisindo by** a unit test.

### DK-05
**Rule.** A bulk action is a bulk bar in its own row above the table; its parameters are in a dialog; an action that cannot be undone is confirmed
**Meet.** The bulk bar (`.bulk`) in its own row above the table; parameters in a dialog; confirm what cannot be undone.
**Check.** Select rows: the bar shows the count and a way to clear.
**Guarded in Praisindo by** a unit test.

### DK-06
**Rule.** Import is a stepper page (file, column mapping, validation, result); Export is a dialog or a drawer size sm (the Export drawer, EX-01), a page only when there is a preview or a history
**Meet.** Import: a stepper page; Export: a dialog or a drawer sm.
**Check.** Run an import and an export.
**Guarded in Praisindo by** a unit test.

### DK-07
**Rule.** Settings are a settings page, one card per section, saved per section
**Meet.** A settings page of cards, saved per section.
**Check.** One Save per section, not one at the end of a long page.
**Guarded in Praisindo by** a unit test.

### DK-08
**Rule.** A list of records is the List pattern (TB-17): stat cards, tabs (optional), toolbar (search combo, Advanced filter, Show / hide columns), table, standard Pagination, Disclaimers (optional)
**Meet.** The List pattern (`features/examples/ListPage.tsx`).
**Check.** Audit (TB-03, TB-06, TB-10).
**Guarded in Praisindo by** a unit test.

### DK-09
**Rule.** One record in full is a detail page with one layout of the catalogue (two columns, three panels, or long page with jump rail) and the page layout `detail` (SB-05)
**Meet.** One layout of the catalogue (`DetailLayout`, three panels, `AnchorNav`) and `layout: 'detail'` in the route table.
**Check.** Open a detail page: the sidebar collapses (SB-30).
**Guarded in Praisindo by** a unit test.

### DK-10
**Rule.** A quick look without leaving the page is a read-only drawer (no form field) with a link to the full page
**Meet.** A read-only `Drawer` with a link to the full page.
**Check.** The drawer has no form field.
**Guarded in Praisindo by** a unit test.

### DK-11
**Rule.** Search, filter and columns are the Advanced filter drawer and the Show / hide columns drawer, size sm, opened from the toolbar
**Meet.** The Advanced filter and Show / hide columns drawers, size sm, from the toolbar.
**Check.** Open each from the toolbar.
**Guarded in Praisindo by** a unit test.

### DK-12
**Rule.** The history of events is the Activity log list (`LogList`), or the List pattern for an audit table
**Meet.** The Activity log list or the List pattern.
**Check.** Open the history of a record.
**Guarded in Praisindo by** a unit test.

### DK-13
**Rule.** Confirmations are centred dialogs by consequence: `danger` (cannot be undone), `confirm` (an important normal action), `warning` (leave with unsaved changes) (DR-02, DR-05)
**Meet.** `Dialog kind="danger|confirm|warning"` by consequence.
**Check.** No `window.confirm`; the kind fits the consequence.
**Guarded in Praisindo by** a unit test.

### DK-14
**Rule.** Success is a toast (a success dialog only when the person must know before going on); validation is the message in the field then one Alert after Save (CD-08); every area that shows data has an error state with Retry, an empty state with the next step, a loading state and a disabled control with its reason
**Meet.** `useToast` for success; the field `err` then one `Alert` after Save; the error, empty, loading and disabled states.
**Check.** Every data area shows all four states.
**Guarded in Praisindo by** a unit test.

### DK-15
**Rule.** Every page uses ONE layout of the catalogue and declares it (`PAGE_LAYOUT`); no page layout is composed from loose elements; one `fill` button per area; one `h1` with a short description; a breadcrumb on detail and form pages (NV-01)
**Meet.** One catalogued layout declared in the route table; one `fill` button per area; one `h1`; a breadcrumb on detail and form pages.
**Check.** Audit (TB-06, TB-03, TB-10, BT-02); the route table is exhaustive.
**Guarded in Praisindo by** a unit test.

### DK-16
**Rule.** Tokens and existing components only; no local CSS for layout, colour, spacing or weight; a deviation goes to the owner as a proposal (PR-04, LY-01)
**Meet.** Tokens and existing components only; a deviation goes to "Rule proposals".
**Check.** Audit (CODE-02, LY-01, PR-04).
**Guarded in Praisindo by** a unit test.

### DK-17
**Rule.** On a form page the title of a card is never the title of the page (a card says what its fields are: Brief basics, Threshold, Report settings); a form with several groups of fields is one card per group and one step per group, a form of one group has one card; the buttons of the form are NOT the footer of the last card: they are the card of actions without a header in the side column on the right (DK-24); a form whose fields feed a live result keeps the inputs and the result as groups of the content and its summary in the right column under the card of actions
**Meet.** Card title differs from the page title; one card and one step per group of fields; the buttons in the card of actions on the right.
**Check.** Audit (the Card title equals the `h1`); the example form page.
**Guarded in Praisindo by** the audit.

### DK-18
**Rule.** The record of a request, a report or a read-only brief is a detail page, never a drawer: two columns for a request and a read-only brief (`DetailLayout side="right"`: the cards in the wide column, the status, the facts and the next step in the narrow one); a problem report has three panels as the customer record (`DetailLayout third`: information left, the report and its history in the centre, the hold or release card on the right; a closed report has no such card and is two columns); the quick-look drawer of DK-10 stays for lists that keep the person on the page
**Meet.** A record that was a read-only drawer is a detail page (layout `detail`, breadcrumb, Back) with two columns.
**Check.** Audit (DK-01, NV-01); the route table declares the layout `detail`.
**Guarded in Praisindo by** the audit.

### DK-19
**Rule.** The toast (the feedback of an action) is fixed at the bottom right, 24px from the edges
**Meet.** `.toast` at `right:24px;bottom:24px`.
**Check.** The stylesheet of the starters.
**Guarded in Praisindo by** the stylesheet.

### DK-20
**Rule.** A field popover (date, country code, multi select, rich select) is fitted to the viewport when it opens: moved inside the left and right edges (8px) and flipped above or below the field when it would run off the top or the bottom
**Meet.** Use `useFieldPopover` of the starter; do not position a popover by hand.
**Check.** The component `popoverHost.ts`.
**Guarded in Praisindo by** the component.
