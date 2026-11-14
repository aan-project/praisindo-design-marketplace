# Forms and fields (Praisindo DS v2.88, skill v2.88)

The ids are those of the Praisindo owner rules register (general rules only; product-domain rules are not in the skill). Every rule is permanent: do not change, loosen or re-interpret it; a need for something else goes to "Rule proposals" in `docs/design-system/new-components.md`. Examples in brackets name pages of the Praisindo reference application; apply the rule to the equivalent page of your product.

Example page: `features/examples/FormPage.tsx` (React) and `pages/examples/form.html` (HTML). Read it before you write a form.

## Pattern: required and optional

Every field of a form declares ONE of the two: `req` or `opt`. A field with neither is a finding of the audit (FM-01). A search box, a filter of a toolbar and a field of the Design page are not form fields.

| | Required (`req`) | Optional (`opt`) |
|---|---|---|
| What the user sees | the label followed by a red `*` | the label followed by "(optional)" / "(opsional)" in the xs size |
| Markup (drawn by `FieldLabel`) | `<span class="req" aria-hidden="true">*</span><span class="sr-only"> (required)</span>` | `<span class="opt">(optional)</span>` |
| Token | `.req{color:var(--color-foreground-danger-default);font-weight:500}` | `.opt{font-weight:400;font-size:var(--fs-xs);color:var(--color-text-secondary)}` |
| Input | `aria-required="true"` on the control | nothing |
| i18n | `fld.req` "required" / "wajib" (screen reader) | `fld.opt` "(optional)" / "(opsional)" |

Rules of use:
- Never write the `*` or "(optional)" in the label text yourself; pass the prop. Never colour a label red by hand.
- When most fields of a form are required, still mark each one with `req` (the `*` is the only visual sign); mark the few others `opt`.
- A field that becomes required because of another value (for example "Follow-up date" when the outcome is "Follow-up required") switches to `req` at that moment and says why in its `hint`.
- A HTML form uses the same markup by hand: `<label class="fl" for="x">Name<span class="req" aria-hidden="true">*</span><span class="sr-only"> (required)</span></label>` and `<input id="x" aria-required="true">`.

## Pattern: which components can be a form field (2.31)

Every component below takes the same field props, so that FM-01 can be met without hand-made markup: `req` | `opt`, `hint`, `err`, `onChange`. `req` sets `aria-required="true"` on the control and `err` sets `aria-invalid="true"`, the `.err` border and `aria-describedby` to the error text.

| Component | `label`, `req` / `opt`, `hint` | `err` | `aria-required` | `onChange` |
|---|---|---|---|---|
| `Input`, `Textarea`, `GroupedNumberInput`, `Input format="money"` | yes | yes (`Textarea`: i18n key) | yes | `(value)` |
| `PhoneInput` | yes | yes | yes | `(formattedValue)` (new in 2.31) |
| `DateField` | yes | yes (new in 2.31) | yes (new) | `(from, to)` |
| `MultiSelect` | yes | yes (new) | yes (new) | `(values)` |
| `Select` | only when given `label` (new): then a `.fld`; without `label` it is the bare control of a toolbar / pagination | yes (new) | yes (new) | `(value)` |
| `SegmentedControl` | only when given `label` (new): then a `.fld`; without it the bare toggle (views, tabs-like) | yes (new) | yes, on the radiogroup (new) | `(value)` |

A hand-made label next to a `Select` or `SegmentedControl` of a form (`<div class="fld"><label>..</label>`) is no longer needed: pass `label` and `req`.

## Pattern: the info icon (`hint`, `InfoTooltip`)

`hint="..."` on a field draws `InfoTooltip` (a 16px info icon) right after the label; the text shows in the Tooltip bubble on hover, focus and tap. `help="..."` draws helper text under the field (always visible). `err="..."` replaces the helper text with the error.

Give a field an info icon (`hint`) when at least one of these is true:
1. The value has a format the user cannot guess (letters allowed, length, pattern).
2. The value changes other data or other people's work (it moves, sends, notifies).
3. The field is required only in some cases, or must respect another field (date after another date).
4. The value has a unit or scale that is not in the label (billions, days, percent).
5. There is a default value the user should know.
6. The label is a business or technical term that a new user may not know, or an abbreviation.
7. Somebody else reads the text (the author, a customer, an auditor), so the user must know who.

Do NOT use an info icon when the label says it all ("Name", "Email"), for an error (use `err`), for a warning that must be seen (use helper text `help` or an Alert after the user acted), or for text longer than three lines (use helper text).

Ten correct examples (from the Praisindo reference application, label → hint):
1. Assigned to → "The person who will carry out this action. Choosing another person transfers the item to them." (criterion 2)
2. Event code → "Capital letters, digits and underscores, 2 to 40 characters." (1)
3. Primary colour → "Hex value, for example #007bff. Needs enough contrast with white text." (1)
4. Tags → "Separate with commas." (1)
5. Reason for rejecting → "Required to reject. The author will see it." (3, 7)
6. Conversion status → "Pending means the purchase is not complete yet. Choose Converted only when a product was bought." (6)
7. File name → "Optional. Leave empty to use the standard name with period and date." (5)
8. Amount → "Enter the amount in billions, for example 1.5 for 1.5B." (4)
9. Due date → "Required when you submit. Must be on or after the planned start." (3)
10. Threshold → "A whole number from 1 to 10. The default is 2." (1, 5)

Five wrong uses (counter-examples; the reference application does not do these):
1. Name → hint "Enter the name." (repeats the label; no info icon).
2. An info icon inside the input box as a suffix icon (breaks FM-02; the icon sits after the label).
3. Email → hint "This email is already used." (an error; use `err`).
4. Amount → hint "Amounts above the limit need approval and will be rejected otherwise." when the limit decides whether the action works (essential, must be visible: `help` text or an Alert after submit).
5. A `title="..."` attribute on the label as the help text (the browser tooltip is not the DS Tooltip; breaks CD-07).

## Pattern: behaviour of a form

- Label above the field (FM-01). Group related fields under `GroupTitle` (caption) inside one `Card`; never a card inside a card.
- Validate a field when it loses focus and the whole form on submit. Do not show errors on first open. The error says what happened and what to do ("Enter a phone number of 9 to 13 digits.").
- On submit with errors: move the focus to the first field in error; keep the values.
- Phone: `PhoneInput`; money: `Input format="money" cur`; date: `DateField`; on/off: `Switch`; one of 2 to 4: `SegmentedControl`; one of more: `Select` or `RadioGroup`; tick: `<label class="chk"><input type="checkbox">`; shortcuts: `sugg`.
- Footer (page form, drawer form): left to right `Cancel` (`type="transparent" intent="neutral"`) then the primary `Save` (`fill`). In a page form the footer is the `footer` of the `Card`; in a drawer it is the `footer` of `Drawer`.
- Leaving with unsaved changes (Cancel, Back, closing the drawer) asks in a centred `Dialog kind="warning"` (DR-06): "Leave without saving?" with Stay (cancel) and Leave (ok).
- A disabled Save says why (helper text or Tooltip).
- Controls that always hold a value (`Select` with a preselected option, `SegmentedControl`, `Switch`, `RadioGroup` with a default, a checkbox) need neither `req` nor `opt`. When such a control still needs a label with a hint, wrap it as `<div className="fld"><label><FieldLabel label={...} hint={...} /></label><SegmentedControl aria={...} ... /></div>`. A `Select` with an empty first option that must be chosen is required: give its label `FieldLabel req`.
- Values of `PhoneInput` (no `onChange`) are read from its input by id when you validate or save (`document.getElementById(id).value`), as in the example form.
- Page or drawer? ALWAYS a page (DK-01, `decisions.md`): adding or editing data, short or long, is a form page with a breadcrumb back to the list; a full editor of an existing entity is `layout: 'detail'` with Back (SB-30, NV-01). A drawer is never the place to add or edit a record; the only exceptions are in `decisions.md` (one value in place, a contextual action with 1 to 5 inputs). [guidance]
- A route for a form under a menu entry (`#/customers/new`) keeps the menu entry highlighted when its route key is the entry's key with an argument (route `customers`, arg `new`), or when `nav.config.ts` lists it as a kid. [guidance]
- The unsaved-changes dialog covers Cancel, Back and closing a drawer; a click on a sidebar link is not intercepted by the shell.
- Long forms: `Wizard` with Back / Next and `Accordion` for optional sections.

## Rules

### FM-01
**Rule.** Label above the field; required shows a red `*`, optional shows "(optional)" / "(opsional)" with brackets (owner decision 2026-11-05: keep the brackets)
**Meet.** Every field of a form passes `req` (mark `*`) or `opt` (text "(optional)" / "(opsional)"); see "Required and optional" above.
**Check.** Audit (FM-01 check: a form field with neither `req` nor `opt`; `req` without `aria-required`; a `Select` / `SegmentedControl` with `label` and neither).
**Guarded in Praisindo by** a unit test.

### FM-02
**Rule.** The info icon sits on the label only (hint), inline, never in the input
**Meet.** `hint="..."` on the field: `FieldLabel` draws `InfoTooltip` after the label. Never an icon inside the input for help.
**Check.** Audit (hand-made info icon in a field).
**Guarded in Praisindo by** a unit test.

### FM-03
**Rule.** Phone: flag + country code button and the number input side by side; digits are grouped per 4 and a leading 0 is removed
**Meet.** `<PhoneInput id label cc val req|opt />`.
**Check.** Type "081234567890": leading 0 removed, groups of 4.
**Guarded in Praisindo by** a unit test.

### FM-04
**Rule.** Money: currency prefix (no money icon) and thousands separators while typing
**Meet.** `<Input format="money" cur="Rp" />` (currency code from the product); no money icon.
**Check.** Type 1500000: "1.500.000" (ID) or "1,500,000" (EN).
**Guarded in Praisindo by** a unit test.

### FM-05
**Rule.** Shortcut chips (Tenor, amount) sit 4px below the field and fill it when clicked
**Meet.** `<Input sugg={[['30', 30], ['90', 90]]} />`: the chips sit under the field and fill it.
**Check.** Click a chip: the field takes its value.
**Guarded in Praisindo by** a unit test.

### FM-06
**Rule.** Placeholders are soft (subtle-3) and dashed outlines use 6px dash / 6px gap
**Meet.** Use DS fields (placeholder colour) and the dashed classes (`.fdz`, `.dash`).
**Check.** Look at placeholders in light and dark.
**Guarded in Praisindo by** a unit test.

### FM-07
**Rule.** The checkbox is soft: a soft border, brand fill only when checked
**Meet.** `<label className="chk"><input type="checkbox" />{text}</label>`; never a custom checkbox.
**Check.** Tick and untick; look in dark mode.
**Guarded in Praisindo by** a unit test.

### FM-08
**Rule.** The Tenor shortcut chips fill the field (30, 90, 180, 365)
**Meet.** Same as FM-05, values of the product (for example days 30, 90, 180, 365).
**Check.** Click each chip.
**Guarded in Praisindo by** a browser test.

### FM-09
**Rule.** The phone field shows the country selector and a usable number input; the money field shows Rp and thousands: ${vp.width}
**Meet.** `PhoneInput` and `Input format="money"` at their default size.
**Check.** Open the form at 390px.
**Guarded in Praisindo by** a browser test.

### FM-10
**Rule.** The toggle switch (`Switch`, `.swi` / `.swt`) is a 40x24 track with a 16px knob inset 4px on every side; on moves the knob 16px; it is a native checkbox with role=switch, checked by click on the track or the label, Space and Enter; focus-visible shows the 2px brand outline; disabled is half opacity and not clickable; colours follow the tokens in light and dark (off = neutral strong, on = brand)
**Meet.** `<Switch id label on onChange />`.
**Check.** Toggle with click, Space and Enter; Tab shows the ring.
**Guarded in Praisindo by** a unit test.

### FM-12
**Rule.** A control that is a form field takes the field props: `Select` and `SegmentedControl` with a `label` are a `.fld` (label above, `req` / `opt`, `hint`, `err`); `Select`, `SegmentedControl`, `DateField` and `MultiSelect` set `aria-required` when `req` and `aria-invalid` + the `.err` border + `aria-describedby` when `err`; `PhoneInput` has `onChange`. Without `label` a Select / SegmentedControl stays the bare control of a toolbar, pagination or combo
**Meet.** Pass `label`, `req` | `opt`, `hint`, `err` and `onChange` to the control; see the table "which components can be a form field" above.
**Check.** Audit (FM-01 check: a `Select` / `SegmentedControl` with `label` and neither `req` nor `opt`); submit an empty required field and read `aria-invalid`.
**Guarded in Praisindo by** a unit test.

### SN-01
**Rule.** `Wizard` variant `status` shows no support caption ("Step 1", "Langkah 2"): the step has its title and its written status (Completed, In progress, Pending, Needs attention) only. A step with an error has a WHITE mark on a danger fill that holds 4.5:1: `--color-surface-danger-strong-2` in light and `--color-surface-danger-default` in dark, in the variant `status` (the dot) and in the variant `chevron` (the whole step, white text); the other variants draw the error as a red mark on white, which is not white text
**Meet.** `<Wizard variant="status" />` with titles and written status only.
**Check.** Look at a step in error: white mark on danger fill.
**Guarded in Praisindo by** a unit test.

### FM-13
**Rule.** `RichSelect` is the select whose options have an icon tile and a short description (the Outcome of an activity): a combobox with a listbox in the form popover, the icon tile takes the colour of its intent, the field shows the chosen icon and label; Enter, Space or the down arrow open it, the arrows, Home and End move, Enter or Space choose, Escape closes and returns the focus. `Select` stays for plain options
**Meet.** `<RichSelect id label opts val req err onChange />` with `opts: [{v, label, desc, icon, intent}]` when each option needs an icon and a short description; otherwise `Select`.
**Check.** Keyboard: Enter, Space or Down open it, arrows, Home and End move, Escape closes.
**Guarded in Praisindo by** a unit test.

### FM-14
**Rule.** A `DateField` at the edge of a card that clips (the card is `overflow:hidden`, so a popover that runs past it is cut and the card scrolls to reach it) takes `end` (the popover opens to the left of the field, right edges aligned) and/or `up` (it opens above the field); the default is unchanged (below, from the left edge); the price chart range of the product detail, at the bottom right of its card, uses both
**Meet.** On a `DateField` at the edge of a card that clips, pass `end` and/or `up`.
**Check.** Open the calendar at the bottom right of a card: it is not cut and the card does not scroll to reach it.
**Guarded in Praisindo by** a browser test.

### FM-15
**Rule.** The days of the calendar of `DateField` are equal: the seven columns have the same width and a chosen day, the start and the end of a range keep their cell (a day has no padding of its own, so the class `sel` of the chosen day does not take the padding of the Select, and the class `rs` of the range start does not take the rules of the sections of the Home rail, which are written `div.rs`)
**Meet.** Use `DateField`; do not restyle the calendar days.
**Check.** Open a calendar: seven equal columns; a chosen day or a range keeps its cell.
**Guarded in Praisindo by** a browser test.
