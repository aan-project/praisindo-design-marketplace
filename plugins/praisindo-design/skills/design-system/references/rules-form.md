# Forms and fields (Praisindo DS v2.125.0, skill v2.125.0)

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

- Label above the field (FM-01). On a form page every group of related fields is its own `Card` with a title that says what the group holds (DK-17, DK-27); never one `Card` with `GroupTitle` captions for the groups of a form page, and never a card inside a card. `GroupTitle` is for the sub-groups inside one card of a drawer or a detail block.
- Validate a field when it loses focus and the whole form on submit. Do not show errors on first open. The error says what happened and what to do ("Enter a phone number of 9 to 13 digits.").
- On submit with errors: move the focus to the first field in error; keep the values.
- Phone: `PhoneInput`; money: `Input format="money" cur`; date: `DateField`; on/off: `Switch`; one of 2 to 4: `SegmentedControl`; one of more: `Select` or `RadioGroup`; tick: `<label class="chk"><input type="checkbox">`; shortcuts: `sugg`.
- Buttons (page form, drawer form): left to right `Cancel` (`type="transparent" intent="neutral"`) then the primary `Save` (`fill`, last). In a page form they are the card of actions without a header in the right column (`Card title=""`, DK-17, DK-24, DK-27), never the `footer` of a `Card`; in a drawer they are the `footer` of `Drawer`.
- Leaving with unsaved changes (Cancel, Back, closing the drawer) asks in a centred `Dialog kind="warning"` (DR-06): "Leave without saving?" with Stay (cancel) and Leave (ok).
- A disabled Save says why (helper text or Tooltip).
- Controls that always hold a value (`Select` with a preselected option, `SegmentedControl`, `Switch`, `RadioGroup` with a default, a checkbox) need neither `req` nor `opt`. When such a control still needs a label with a hint, wrap it as `<div className="fld"><label><FieldLabel label={...} hint={...} /></label><SegmentedControl aria={...} ... /></div>`. A `Select` with an empty first option that must be chosen is required: give its label `FieldLabel req`.
- Values of `PhoneInput` (no `onChange`) are read from its input by id when you validate or save (`document.getElementById(id).value`), as in the example form.
- Page or drawer? ALWAYS a page (DK-01, `decisions.md`): adding or editing data, short or long, is a form page with a breadcrumb back to the list; a full editor of an existing entity is `layout: 'detail'` with Back (SB-30, NV-01). A drawer is never the place to add or edit a record; the only exceptions are in `decisions.md` (one value in place, a contextual action with 1 to 5 inputs). [guidance]
- A route for a form under a menu entry (`#/customers/new`) keeps the menu entry highlighted when its route key is the entry's key with an argument (route `customers`, arg `new`), or when `nav.config.ts` lists it as a kid. [guidance]
- The unsaved-changes dialog covers Cancel, Back and closing a drawer; a click on a sidebar link is not intercepted by the shell.
- A form of several groups is a stepper form (DK-02, DK-24): `Wizard`, one step per group, horizontal with Back / Next in the card of actions or vertical as the rail; `Accordion` for optional sections. The frame is `FormShell` (the example `FormPage`).

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

### FM-16
**Rule.** The `Select` has the variant with `pre` and `suf` (strings): a short text inside the field before and after the value, drawn like the `pre` and `suf` of the text field (`.sl-t .pre` and `.sl-t .suf`, a divider on the inner side, text-secondary, weight 500, aria-hidden); the hidden select and the touch select read each option with them (`10 /page`), but the list that opens under the field shows only the value (`5`, `10`, `25`). The rows per page of the Pagination is this Select with the suffix `/page`.
**Meet.** Pass `suf` or `pre` to `Select`; never put the unit in the option text.
**Check.** Open the list: each option reads with the suffix; the screen reader reads it whole.
**Guarded in Praisindo by** a unit test.

### UP-01
**Rule.** When a file is added to the file upload, a ring fills around its icon (`--fdl-p`, 0 to 100, about 0.8 s; at once when motion is off) and turns green with a small pop when the file is done; the ring and its inside are two backgrounds of the icon itself (a conic ring outside, the card surface or the scenario tint inside; never a mask, a radial gradient or a pseudo-element, because the icon clips what is outside it); the drop box (`.fdz`) keeps its look.
**Meet.** Use `FileUpload` and the DS CSS (`45-form-kit.css`); do not draw another progress ring.
**Check.** Add a file: the ring fills, then turns green; the inside of the ring never takes the ring colour.
**Guarded in Praisindo by** a unit test.

### UP-02
**Rule.** The states of a file row of the upload are shown by the ring, the tile and its icon (all three take the colour of the scenario: the soft tint and the icon of success, warning or danger; brand while it waits or uploads) and the small text: waiting (ring empty), uploading (ring filling, the percentage), done (`ok`, green), warning (`warn`, amber) and failed (`err`, red); the Design page shows the five rows.
**Meet.** Set the class `ok`, `warn` or `err` on the row (`--fdl-c`, `--fdl-bg`, `--fdl-fg` come from it).
**Check.** The five rows on the Design page show the five scenarios in light and dark.
**Guarded in Praisindo by** a unit test.

### UP-03
**Rule.** A file row of the upload is the round tile with the icon of the file type (pdf, table, image, document) inside the ring on the left, the name above the size in the middle, and at the right the percentage while it uploads, then a status icon (check, warning, error) and the remove button; the order of the children stays icon, name, size, status, button.
**Meet.** Use `FileUpload`; its markup is the row.
**Check.** Compare a row with the Design page example.
**Guarded in Praisindo by** a unit test.

### UP-04
**Rule.** The file upload checks every file against its rules and refuses the ones that do not fit: over the size (`maxMb`), a type that is not in `accept` (extension, MIME type or family such as `image/*`; an empty `accept` takes all) and, when `multiple` is off, every file after the first; a refused file is a red row (the reason as the small text: Larger than N MB, Type not accepted, Only one file can be added, an error icon) that the person can remove, and a new choice clears the old refusals; no message is repeated under the field.
**Meet.** Use `FileUpload` with `accept`, `maxMb` and `multiple`; use `fileCheck` for the same check elsewhere.
**Check.** Add a file of a wrong type and one over the size: two red rows with their reasons, no message under the field.
**Guarded in Praisindo by** a unit test.

### FM-17
**Rule.** A form field that asks for ONE value from a list of options (a category, a type, a status, a channel) is a `Select` by default, also when there are only two to four options; the `SegmentedControl` is not the default control of a form field: it is for switching how the content below is read (a view, a period, Match all / any) and for a setting that applies at once (My Preferences); the labelled form of the SegmentedControl (FM-12) is used only when the design of the page asks for it.
**Meet.** Use `<Select label req opts>` for such a field; use `SegmentedControl` for a view, a period, Match all / any or a Preferences setting.
**Check.** The audit flags a `SegmentedControl` with a `label` (and a `.fld` with a `.sgc`) as FM-17; an exception needs `/* ds-allow: <reason> */` and the design of the page asking for it.
**Guarded in Praisindo by** a unit test and the audit.

### FM-18
**Rule.** The colour field is the variant `<Input format="color">` of the text field (not a component of its own): it accepts a hex colour with or without the pound sign and adds the pound by itself (`007bff` and `#007bff` both give `#007bff`), drops everything that is not a hex digit and keeps at most six digits; the swatch of the colour (`.csw`) sits at the end of the field and shows a valid colour only; `onChange` gets the value with the pound; a value from outside is shown as it comes; validity and the error text belong to the page.
**Meet.** Use `<Input format="color" label req val onChange err>` for every colour of a form (the starter HTML: `.inp > input` followed by `.csw` and `initColorFields()`); never draw a swatch by hand.
**Check.** Type `007bff` in the field: it shows `#007bff` and the swatch is blue.
**Guarded in Praisindo by** a unit test.

### FM-19
**Rule.** The swatch of the color field (FM-18) is a button that opens the color picker under the field as a form popover (closes with Escape and a press outside, focus returns to the swatch): a square of saturation (left to right) and brightness (bottom to top) in the hue of the color with its handle, a hue slider, the eyedropper button only where the browser has one (`EyeDropper`), and the hex field (the same color field without a picker, `picker={false}`); nothing else: no alpha, no tabs Gradient or Image, no format select, no saved colors and no Add (owner 2026-11-15). The handles move by the pointer and by the arrow keys (1% or 1 degree, Shift 10) and are sliders for assistive technology; the popover is 320px wide and the full width on a phone. The Design page shows the color field under More inputs on the page of the text field, not under Phone and ID numbers.
**Meet.** React: `<Input format="color">` already does it (`Field.tsx`, `domain/forms/color.ts`, the classes `.cpk*` in `45-form-kit.css`); the starter HTML: `.inp > input` followed by `button.csw` and `initColorFields()` (`js/colorfield.js`), the picker sets the input and fires `input`; never build a picker by hand.
**Check.** Press the swatch: the picker opens with the square, the hue slider and the hex field; drag or use the arrows and the field and the swatch follow; Escape closes it.
**Guarded in Praisindo by** a unit test.

### FM-20
**Rule.** The color picker (FM-19) leaves out, by the owner's decision (2026-11-15), the alpha slider and field (the field holds an opaque `#rrggbb`), the tabs Gradient and Image, the format select (only Hex), and the saved colors with Add. If tabs are ever added to the picker they follow TB-29: a popover counts as inside a card, so the tabs are segmented.
**Meet.** Use the picker of `<Input format="color">` as it is (starter HTML: `initColorFields()`); do not add alpha, tabs, a format select or saved colors to it.
**Check.** Open the picker: two sliders (the square and the hue), the hex field and, only where the browser has it, the eyedropper; no tabs, no select, no Add.
**Guarded in Praisindo by** a unit test.

### FM-21
**Rule.** A single choice from a few options (what was a group of radio buttons) is a row of Chips: the selected chip is soft brand with a leading check icon, the others are neutral outline; every chip has `role="radio"` and `aria-checked` inside a `role="radiogroup"` fieldset. The round radio button is not drawn.
**Meet.** React: `<RadioGroup name label opts val onChange>` of the starter (`Chip` with `check` and `radio`); the starter HTML: `fieldset.rg` with `button.chp[role=radio]`, the selected one `.chp.on` with a `check` icon. Never build a round radio.
**Check.** Open a single choice field: chips in a row, the selected one has the check icon and the soft brand fill; arrow keys and a press change the choice.
**Guarded in Praisindo by** a unit test.

### FM-22
**Rule.** A field with several options to switch on or off (the columns of Show / hide columns, the sections of an export or a report, a list of candidates, a yes / no setting of a form) is a list of Switches, never a list of checkboxes. A checkbox is only for a checklist of agreement (I agree to the terms), for the rows of a table with its select-all, for Remember me on the sign-in page and for an Include choice in a comparison table (the exceptions of the owner, FM-24).
**Meet.** One `Switch` per option (`<Switch id label checked onChange />`; a locked option is `dis` with the reason next to it); use a checkbox only for an agreement or a table row.
**Check.** Open Show / hide columns and an export: every option is a switch; no list of checkboxes exists outside a table and an agreement.
**Guarded in Praisindo by** a unit test.

### FM-23
**Rule.** The `SegmentedControl` is only for a small space: the header of a card, a toolbar, a drawer, a table cell or the page head. It is not the control of a field of a form page: that is a `Select` (FM-17) or the chips of FM-21.
**Meet.** Use `Select` or `RadioGroup` for a field of a form; keep the segmented control to a view switch or a setting in a small space.
**Check.** Open a form page: no segmented control among the fields; the segmented controls of the app sit in card headers, toolbars, drawers or the page head.
**Guarded in Praisindo by** a unit test.
