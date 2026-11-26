# Buttons and segmented toggle (Praisindo DS v2.193.1, skill v2.193.1)

The ids are those of the Praisindo owner rules register (general rules only; product-domain rules are not in the skill). Every rule is permanent: do not change, loosen or re-interpret it; a need for something else goes to "Rule proposals" in `docs/design-system/new-components.md`. Examples in brackets name pages of the Praisindo reference application; apply the rule to the equivalent page of your product.

## Pattern: button hierarchy

| Role | `type` | `intent` | Example |
|---|---|---|---|
| The one primary action of an area (page head, card footer, drawer footer, dialog) | `fill` | `brand` (or `danger` for a destructive primary) | Save, Add customer |
| A secondary action next to it | `outlined` | `neutral` | Export, Advanced filter |
| Cancel, Reset, Close, Back next to a primary | `transparent` | `neutral` | Cancel |
| A light action in a row, a menu item, a bulk action | `transparent` | `neutral` (`danger` for Delete) | Edit, Delete |
| A soft emphasis (dialog cancel, a toggle-like action) | `soft` | the area's intent | Cancel in a dialog (Dialog does it) |
| Inline navigation | `link` / `LinkButton` | `brand` | View, View all |

- One `fill` per area. Two `fill` buttons side by side is a finding.
- Icon side: the icon is on the LEFT (`icon`) for an action (Add, Export, Save); on the RIGHT (`iconRight`) for a direction or a toggle (Next, Submit, Show more, a dropdown chevron).
- Icon-only buttons always have `aria` (BT-04) and a Tooltip when the icon is not obvious.
- The button that applies a panel's choices says "Apply" / "Terapkan" (BT-02), never "Done" / "Selesai" / "OK". The button of a `success` dialog is the exception: it says "Done" / "Selesai" (owner decision 2026-11-05).
- Footer order (drawer, card, page form): secondary and Cancel on the left, the primary LAST (right). Dialog footer (Dialog): Cancel (soft), the third action `alt` (outlined), the primary (fill); a dialog with one action makes it full width.
- A disabled button says why (Tooltip on it or helper text near it).
- A count belongs in `count`, not in the label (CH-07).
- Size is always md for controls (BT-05); `Dialog` uses lg inside dialogs by itself.

## Rules

### BT-01
**Rule.** Button types are fill, soft, outlined, transparent and link; the cancel / reset next to a primary is transparent
**Meet.** `Button type="fill|soft|outlined|transparent|link"`; Cancel / Reset next to a primary is `type="transparent" intent="neutral"`.
**Check.** Audit; one `fill` per area.
**Guarded in Praisindo by** a unit test.

### BT-02
**Rule.** The execution button says "Apply", never "Done" (preferences, table and field panels), in English and Indonesian. The button of a `success` dialog keeps "Done" / "Selesai" (`md.success.ok`; owner decision 2026-11-05: not "OK")
**Meet.** Label of the button that applies a panel: `t('tbl.apply')` = "Apply" / "Terapkan".
**Check.** Audit (BT-02 check: no "Done" / "Selesai" label).
**Guarded in Praisindo by** a unit test.

### BT-03
**Rule.** Link buttons have no horizontal padding; menu items have a 12px gap
**Meet.** `LinkButton` or `Button type="link"`; menu items are `Button type="transparent"` in a `.pop`.
**Check.** Look at link buttons and menus.
**Guarded in Praisindo by** a unit test.

### BT-04
**Rule.** An icon-only button always has an aria-label (Button requires `aria` when there is no label)
**Meet.** `<Button icon="more_vert" aria={t('tbl.more')} />`; `Button` without `label` needs `aria`.
**Check.** Audit (BT-04 check).
**Guarded in Praisindo by** a unit test.

### BT-05
**Rule.** Controls are always size M: the default size token is md and there is no density option
**Meet.** Leave `size` at its default (md) for controls; only `Button size="lg"` inside dialogs, as `Dialog` does.
**Check.** Audit (no `size="sm"` on controls outside a table row and chip).
**Guarded in Praisindo by** a unit test.

### BT-06
**Rule.** Buttons have the 8px control radius (`var(--r-ctl)` / `.btn{border-radius:8px}`); only the count `.cnt`, the chips (CH-01) and the segmented toggle (a pill like the language toggle, TG-01, keputusan owner 2026-10-29, revisi UI) are pills; a badge is an 8px rectangle (`--r-badge`, BD-01)
**Meet.** Use `Button`; never set a button radius.
**Check.** Audit (radius literal check).
**Guarded in Praisindo by** a unit test.

### TG-01
**Rule.** The SegmentedControl (`.sgc`) looks like the language toggle (`.lgt`): a pill track with 4px padding, the secondary surface and a 1px subtle border; options 28px high, at least 36px wide, padding 0 8px, text `--fs-xs`, weight 600, letter-spacing .04em, the subtle-4 text colour (neutral default on hover); the selected option is the primary surface thumb with the neutral default 1px border and the brand strong text colour; the keyboard focus ring is 2px brand strong with 1px offset. The base selector and the sliding thumb stay (PR-02)
**Meet.** `<SegmentedControl opts val onChange />` for 2 to 4 exclusive options.
**Check.** Look at the toggle in light and dark.
**Guarded in Praisindo by** a unit test.

### CH-07
**Rule.** A button that shows a count has the label WITHOUT "(n)" and the count as a static Chip inside the button (`Button` props `count`, and `zero` to show a 0): one shared path, no nested interactive element, the button height is unchanged and the accessible name stays "label (n)". The Chip is the solid brand look (`selected`) on a soft, outlined or transparent button, and the soft brand look on a fill button (CH-08: by CSS, `.btn.b-fill .chp-s`). A Badge in a button stays forbidden except BD-10. Sites: Reports (configurations, files), Recommendations (excluded options, combined plan), the Design page What's new (keputusan owner 2026-10-26)
**Meet.** `<Button label="Advanced filter" count={n} />`; never write "(n)" in the label.
**Check.** Audit; screen reader name reads "label (n)".
**Guarded in Praisindo by** a unit test.

### BN-01
**Rule.** Button names follow the writing rule of the Design System: sentence case (a capital only on the first word and on the names of the product: Take Action, Data & Integration) and a verb first, in English and in Indonesian; one action has one name everywhere: the button that opens the editor of a rejected or proposed rule is Revise (on the Proposal tab and in the lifecycle panel; Resubmit is only the send button of the editor); View opportunity, View activity, View activities, View all reminders, View my opportunities, Open marketing workspace and Advanced filter were Title Case
**Meet.** Write every label as a verb in sentence case: "Add customer", "Save changes", "Tambah pelanggan"; keep one name per action across the app.
**Check.** Read all button labels in `en.json` and `id.json`.
**Guarded in Praisindo by** a unit test.

### BT-08
**Rule.** Every button type has a disabled look of its own that keeps the shape of the type and ignores the hover: fill is a solid grey block (`--color-surface-neutral-tertiary`), soft a light grey block (`neutral-secondary`), outlined a faint outline (`--color-border-neutral-subtle`), transparent and link only grey text (`--color-text-tertiary`); the cursor is `not-allowed`; the same for the buttons with an icon and the icon-only ones.
**Meet.** Use `Button` with `dis`; never colour a disabled button by hand. The Design page shows every type disabled.
**Check.** Look at every type disabled on the Design page; no hover effect appears.
**Guarded in Praisindo by** a unit test.

### MO-08
**Rule.** Hover of the buttons (the option Fluid): fill gets a light sweep and grows to 1.02; soft fills from below with the strong colour (the fill covers the border: `background-origin:border-box`); outlined fills from below with the soft tint `--int-sub` on hover (the border and the text stay as they are); transparent wipes its tint in from the left and keeps the whole radius of the button (the tint covers the border box: `background-origin:border-box`); link shows nothing extra on hover (no chevron, no underline, only the colour change); every icon of a button grows to 1.2 with `--ease-spring`; a disabled button has no effect; the press stays scale .98 (MO-05); every rule is under the `data-motion` guard (MO-03). The effects use the background only: no change of the layout.
**Meet.** Use the DS CSS (`67-motion.css`) as it is and `Button`; do not write another hover.
**Check.** Hover each type on the Design page with motion on; with `data-motion="off"` nothing moves.
**Guarded in Praisindo by** a unit test.

### BT-09
**Rule.** The exact disabled colours of BT-08 are: fill `--color-surface-neutral-tertiary`, soft `--color-surface-neutral-secondary`, outlined `--color-border-neutral-subtle` (background primary), transparent and link without background; the Select with `suf` has a divider (1px subtle) and 8px of space before its suffix, like the text field.
**Meet.** Use the DS CSS (`02-button.css`, `45-form-kit.css`) as it is.
**Check.** Compare the disabled buttons and a Select with a suffix with the Design page.
**Guarded in Praisindo by** a unit test.

### MO-09
**Rule.** The exact values of the button hover (MO-08): the sweep of the fill uses `color-mix` of `--color-text-white` (30%) over `--dur-slow` (.32 s) and the press stays scale .98.
**Meet.** Use the DS CSS (`67-motion.css`) as it is.
**Check.** Hover and press a fill button with motion on.
**Guarded in Praisindo by** a unit test.

### MO-10
**Rule.** A drawer slides in from the right edge of the screen to its place (right to left, `--dur-base` .2 s, `--ease-out`, keyframes `dw-in`) and leaves the same way to the right (left to right, `--dur-base`, `ease-in`, `dw-out`): a plain slide and nothing else: the `Drawer` keeps a copy of itself and of its scrim, class `dw-out`, for the length of the slide-out because the framework removes the node at once; the scrim fades. It stands still, and the drawer is gone at once, under `data-motion="off"` (reduced motion, automated browsers, MO-03). A drawer that is replaced by another in the same moment (a second drawer, Back) is a swap, not a leave: the first goes at once with its scrim and the second stands in place, so two drawers and two scrims never slide over each other (the `Drawer` and `drawer()` count the drawers mounted in the same commit).
**Meet.** Use the `Drawer` of the system (HTML: `drawer()` in `js/ui.js`) and the CSS of `67-motion.css`; do not set your own animation on `.drawer`.
**Check.** Open a drawer: it comes in from the right; close it: it goes out to the right; with reduced motion it appears and disappears at once.
**Guarded in Praisindo by** a unit test.
