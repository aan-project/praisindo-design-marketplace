# Drawer, dialog, action menu (Praisindo DS v2.115.0, skill v2.115.0)

The ids are those of the Praisindo owner rules register (general rules only; product-domain rules are not in the skill). Every rule is permanent: do not change, loosen or re-interpret it; a need for something else goes to "Rule proposals" in `docs/design-system/new-components.md`. Examples in brackets name pages of the Praisindo reference application; apply the rule to the equivalent page of your product.

Example page: `features/examples/DialogsPage.tsx` (React) and `pages/examples/dialogs.html` (HTML).

## Pattern: the six dialog kinds (`Dialog kind`)

| kind | Use it when | Buttons (Dialog defaults) |
|---|---|---|
| `success` | an action finished and the user must know before going on (rare: a toast is the usual choice) | one full-width Done / Selesai |
| `info` | a neutral fact that needs an acknowledgement | one full-width OK |
| `progress` | a long action runs; the user may wait or run it in the background | soft OK (run in background) |
| `warning` | an action has a consequence that can be undone with effort (leave without saving, discard a draft) | Cancel (soft) + OK (fill warning) |
| `danger` | an action cannot be undone (delete, revoke) | Cancel (soft) + OK (fill danger) |
| `confirm` | the user must confirm a normal but important action (submit for approval, publish) | Cancel (soft) + OK (fill brand) |

- A third action is the `alt` prop (outlined, between Cancel and OK), for example "Save as draft" next to "Leave" and "Stay".
- A dialog is always centred, modal, one at a time (never stack two). The title asks or states in a few words; the text says the consequence.
- Never `window.confirm` / `alert`.

## Pattern: drawer or dialog?

| Drawer (`Drawer`) | Dialog (`Dialog`) |
|---|---|
| view or edit something without leaving the page (details, a form, filters, columns) | a decision or a result that stops the flow |
| size sm 400 (filters, columns, short forms), md 560 (forms, details), lg 760 (wide tables, comparisons) | fixed size, centred |
| a drawer opened from a drawer gets Back (`back`, `onBack`) | never opened from a dialog |
| full screen on a phone | centred on a phone |

## Pattern: the action menu

The `more_vert` button of a row or card opens a menu: `.pop role="menu"` positioned at the button (flips above near the bottom), one `Button type="transparent"` per item, an icon on the left, dangerous items last with `intent="danger"`; keyboard through `useActionMenu(ref, onClose, trigger)`: the first item takes the focus, arrows / Home / End move, Escape closes and returns the focus to the trigger (MN-01, MN-02). A destructive item opens a `danger` dialog; it never acts at once. `Button` has no `role` prop: plain `Button` items inside `.pop role="menu"` are what the starter's menus use. Render the menu with `toOverlay(...)` and `position: fixed` at the trigger rectangle (below it, above it when it does not fit), so that a table's sideways scroll does not clip it: copy `features/examples/parts/ActionMenu.tsx` (`menuPos`, `ActionMenu`).

## Rules

### DR-01
**Rule.** Drawer sizes are S 400, M 560 and L 760px
**Meet.** `<Drawer size="sm|md|lg" />`.
**Check.** Measure: 400 / 560 / 760px.
**Guarded in Praisindo by** a unit test.

### DR-02
**Rule.** Dialogs have six kinds (success, info, progress, warning, danger, confirm) and accept a third (alt) action
**Meet.** `<Dialog kind="success|info|progress|warning|danger|confirm" ok cancel alt />`.
**Check.** Open each kind.
**Guarded in Praisindo by** a unit test.

### DR-03
**Rule.** A drawer opened from another drawer shows a Back button (optional back / onBack on Drawer)
**Meet.** Second drawer: `<Drawer back onBack={() => setStep(prev)} />`.
**Check.** Open a drawer from a drawer; Back returns.
**Guarded in Praisindo by** a unit test.

### DR-04
**Rule.** Tabs inside a drawer are segmented and sticky flush with the drawer top
**Meet.** `<DrawerTabs />` inside a drawer.
**Check.** Scroll a drawer with tabs.
**Guarded in Praisindo by** a unit test.

### DR-05
**Rule.** A confirmation is a centred dialog template, never a drawer. The kind follows the consequence: `confirm` (a normal but important action), `warning` (can be undone with effort, for example leaving unsaved changes), `danger` (cannot be undone). The register text said only "confirm"; 2.31 follows the code (owner recommendation DR-05). The browser check is DR-06
**Meet.** Confirmations: `<Dialog kind="confirm|warning|danger" />` chosen as above, never a drawer and never `window.confirm`; a destructive menu item or button opens `danger`.
**Check.** grep `confirm(`.
**Guarded in Praisindo by** a unit test.

### DR-06
**Rule.** Leaving the rule editor with unsaved changes asks in a centred dialog, not in a drawer
**Meet.** Leaving a form with unsaved changes: `<Dialog kind="warning" title text ok={{label: t('ex.leave')}} cancel={{label: t('ex.stay')}} />` (centred).
**Check.** Change a field, click Back or Cancel.
**Guarded in Praisindo by** a browser test.

### DR-09
**Rule.** The action of a form in a drawer (for example "Add sub class" in a manage drawer) is a button of the drawer footer (`Drawer` `footer`: the quiet button first, for example Close, then the primary action), never a button inside the body (owner decision 2026-11-13).
**Meet.** `<Drawer footer={<><Button label="Close" type="transparent" intent="neutral" /><Button label="Add" /></>}>`; the body holds only the content.
**Check.** Open the drawer: every action button is in the footer.
**Guarded in Praisindo by** a unit test.

### DR-10
**Rule.** A preview box that holds list rows (`.pv > .li`, as in the Reschedule, Dismiss and Assign drawers) stays tidy in a narrow space: below 480px of box width the row is a grid (icon, then the text, and the date or status under the text, left aligned) and the id next to the title does not break; wider, the row is the usual line (owner decision 2026-11-13). The stylesheet does it (`.pv` is a container); do not restyle the row.
**Meet.** `<div className="pv"><ListItem ... /></div>` with the stock classes; no width hack on the row.
**Check.** Open the drawer at 400px: the title does not wrap, the id does not break, the date sits under the text.
**Guarded in Praisindo by** a unit test.

### DR-11
**Rule.** When a card or list row has a third text (after the title and the second line, for example the date and time of the activity in the Reschedule preview, `.pv > .li > .x`), that text is softer than the second: `var(--color-text-tertiary)` (owner rule 2026-11-13).
**Meet.** Put the third text in the stock slot (`.x`); do not set its colour.
**Check.** Compare the third text with the second: it is lighter.
**Guarded in Praisindo by** a unit test.

### MN-01
**Rule.** An action menu (`.pop` without `.upop`: the row menu of every table, the node menu of the builder) is a column as wide as its widest item (176 to 320px, never wider than the viewport minus 16px, no sideways scroll), one 36px row per item, scrolls inside when it is taller than the viewport, opens above the trigger when it would run off the bottom, sits above the sticky decision bar (40) and the bottom navigation (70), and closes on a press outside, Escape (focus back on the trigger) or Tab. The shared ActionMenu is the only row menu of tables
**Meet.** Action menus: `.pop role=menu` with `Button type="transparent"` items, opened with `useActionMenu`; dangerous items `intent="danger"`.
**Check.** Open the last row menu near the bottom of the screen at 390px.
**Guarded in Praisindo by** a browser test.

### MN-02
**Rule.** The ⋮ menu of a condition row and of a group row opens and stays open; every item can be chosen with the mouse, the keyboard (Enter opens, the first enabled item takes the focus, arrows / Home / End move, Enter chooses, Escape closes and returns the focus) and a finger, at 1440 and 390, without a console error. Root cause of the old failure: the press outside was a document `click` listener that saw the click that opened the menu, and the ⋮ button was not the excluded trigger, so the menu closed at once
**Meet.** `useActionMenu(ref, onClose, trigger)` gives focus, arrows, Home/End, Escape and outside click.
**Check.** Use the menu with the keyboard only.
**Guarded in Praisindo by** a browser test.
