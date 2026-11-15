# Export drawer (Praisindo DS, skill v2.115.0)

The ids are those of the Praisindo owner rules register (general rules only; product-domain rules are not in the skill). Every rule is permanent: do not change, loosen or re-interpret it; a need for something else goes to "Rule proposals" in `docs/design-system/` and waits for the owner.

Use this pattern for every "export these records" action (a list, a detail, a report): one `Drawer` size `md`, opened by the `Export` button of the toolbar or of the bulk bar. It never becomes a wizard of steps and never a card per choice.

## Pattern: the screen, top to bottom

| Field | Component | Notes |
|---|---|---|
| Rows | `Select` | the scopes with their count: "The rows I ticked · 3 rows", "Everything that matches my filters · 50 rows"; disabled when there is only one scope (a detail) |
| Data to send | `Select` | "All columns (10 columns)" or "Selected columns (4 of 10 columns)"; Selected columns shows a `Choose columns` button and opens the second drawer |
| File type | one `Chip` (interactive, `selected`) per format | required; one or more; helper text under it |
| File name | `Input` with the extension as suffix | right after File type; no "More options" card |
| Export option | `.seg` of two `Button` (`pressed`) | Download file, Send via email |
| Recipients, Subject, Message | `TagInput` (suggest mode), `Input`, `Textarea` | only with Send via email |

Footer: `Close` (transparent) on the left, ONE primary button on the right: `Download` or `Send email`.

## Rules

### EX-01
**Rule.** The Export drawer (every list, detail, Analytics and Reports export) is one screen with these fields in this order: Rows (a Select of the scopes with their counts as '· 50 rows'; disabled when there is only one), Data to send (a Select: All columns (10 columns) or Selected columns (a of b columns); Selected columns shows a Choose columns button and opens Choose columns), the sections for Analytics, Reports and details, File type (required), File name, Export option and, only for Send via email, Recipients, Subject and Message. The footer has Close and one primary button: Download or Send email. The alerts of real conditions (stale data, nothing to export, no permission, unavailable format, failure) stay above the fields
**Meet.** One `<Drawer size="md" footer={...}>`; no `Wizard`, no `RadioCard`, no `Accordion` for the file name.
**Check.** Open the drawer from a list and from a detail; count the fields and the footer buttons.
**Guarded in Praisindo by** an e2e test.

### EX-02
**Rule.** Choose columns is a second drawer on top of the Export drawer (layer l2, with Back), opened from Data to send (Selected columns): a search, the columns in groups defined per kind (`EXP_GROUPS`; a kind without a grouping is one group), a Clear per group, Reset, the count 'a of b selected' and Apply; the choice is live; Data to send shows 'Selected columns (a of b)'; a column without permission is shown locked and cannot be ticked
**Meet.** `<Drawer layer="l2" back onBack={...}>` with `<Select>` for Data to send; the count text under the footer.
**Check.** Choose Selected columns; search, clear a group, go Back; the Select shows the new count.
**Guarded in Praisindo by** an e2e test.

### EX-03
**Rule.** The presets of Choose columns: Essential (a defined set; not shown for a kind without one), All (every allowed column) and My last choice (the columns of the last export of that kind, stored under the key `exp.cols.<kind>`; only columns that still exist and are allowed; shown only after a first export).
**Meet.** Three pressed buttons in a row at the top of the drawer; save the columns after a successful export.
**Check.** Pick Essential (the count changes); export; reopen: My last choice appears.
**Guarded in Praisindo by** a unit test.

### EX-04
**Rule.** After an export the drawer shows what was made (file, records, format, size), says that the file was made on the device, and offers Close, Change settings (back to the setup, settings kept) and Download again. After an email it says "Email sent" with the recipients and has no Download again.
**Meet.** A `state ok` block, a `DR` list, a note line; the footer buttons in that order.
**Check.** Export once; the three buttons are there; Change settings returns to the screen with the same choices.
**Guarded in Praisindo by** an e2e test.

### EX-05
**Rule.** File type is a row of `Chip`s (selected = soft brand, an unavailable format is disabled), one or more can be chosen, each format makes its own file, the helper text says so and at least one is required (validation after the person acted); Export option is the Segmented buttons (`.seg`, `Button` with `pressed`): Download file and Send via email, never an `RadioCard`, never an icon beside the label of a card; the switch Recommendations appears for opportunities when a format other than CSV is chosen; the file name is a field right after File type (no title field, no More options card; the title inside the file is set by the system)
**Meet.** `<Chip label="Excel (.xlsx)" selected onClick />`; `<div className="seg"><Button pressed ... /></div>`; `<Input suf=".csv" />`.
**Check.** Choose two formats: two files are made; deselect all: the error shows and the primary button stays enabled until pressed.
**Guarded in Praisindo by** an e2e test.

### EX-06
**Rule.** Recipients (only with Send via email) is a multi-select field: the chosen people are removable chips; a list of suggestions appears under the field only after 3 typed characters and matches the name, the email or the digits of the ID number of the people the user may see (colleagues first, labelled Internal; customers, labelled Customer), in groups; each suggestion shows the initials, the name, the email with the ID number masked (•••• and its last four digits) and a label. A complete typed email that is not known can be added with Enter (label External). Arrow keys, Enter and Escape work; Backspace removes the last chip. Under 3 characters a helper line says how many are needed; with no match a helper line says so. It is the suggest mode of `TagInput`, not a new component.
**Meet.** `<TagInput id label req sel onSel suggest={(q) => q.trim().length < 3 ? [] : search(q)} free={(raw) => isEmail(raw) ? {...} : null} min={3} keep none hint />` (props in `tokens-komponen.md`); classes `.ftgs`, `.tgs`.
**Check.** Type 2 characters: no list. Type 3: the list with groups. Pick one: a chip. Type a full unknown email, Enter: a chip with External. Send with no recipient: the error shows and nothing is sent.
**Guarded in Praisindo by** a unit test and an e2e test.

### EX-07
**Rule.** A new export has NO file type chosen (no chip is selected; Export asks for at least one, EX-05; owner decision 2026-11-10) and the option Download file; Send via email needs at least one recipient and a subject (a default subject is filled); the files are made on the device (email is a simulation: nothing leaves the device) and the activity log records the export (Exported data) or the email (Emailed an export)
**Meet.** State: `fmts: ['csv']`, `via: 'download'`, `to: []`, `subject`, `body`; the log call after the export.
**Check.** Open the drawer: one chip selected, Download file pressed. Switch to Send via email and press Send email with nothing filled: the errors show. Send: the log has one row.
**Guarded in Praisindo by** a unit test.

### EX-08
**Rule.** In the Export drawer of an opportunity or a customer (the kinds with a detail level) the level is a field of chips like File type, one of two (Summary or Detailed), and under it "Sections" is a field of chips like File type (several can be chosen) of the sections the level offers (the opportunity summary, recommendations, activities, outcomes ...); every offered section is chosen first and can be changed; a section the role may not see is a disabled chip; Analytics and Reports keep their section list. A guide text is kept only for a field that needs it (the level, the related-rows switch, a conflict like CSV): File type and Export option have none
**Meet.** Level and Sections are fields of `Chip`s like File type; every offered section is chosen first; a section the role may not see is a disabled chip.
**Check.** Open Export of a record with a detail level: the chips follow this rule.
**Guarded in Praisindo by** a unit test.
