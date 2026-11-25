# UI text rules (Praisindo DS v2.183.0, skill v2.183.0)

Ids are those of the Praisindo owner rules register. Lines marked **[guidance]** are this skill's reading of the principles of the DS (`principles.md` "Writing") for cases the register does not name; follow them unless the product has its own writing guide.

### DS-03
**Rule.** Every user-facing text exists in English and Indonesian: the two i18n files have the same keys.
**Meet.** Every text is an i18n key present in `en.json` AND `id.json` (`t('key')`); Design page text uses `B('English', 'Indonesia')`; parameters with `fill(t('k'), {n})`.
**Check.** Audit (i18n key set check); switch EN / ID on every page.

### BN-01
**Rule.** Button names follow the writing rule: sentence case and a verb first, in English and in Indonesian; one action has one name everywhere. Full text in `rules-tombol.md`.
**Meet / Check.** See `rules-tombol.md`.

## Capitalisation
- Sentence case for titles, labels, buttons, menu items, tabs, column headers and badges: a capital only on the first word and on proper names (the product name, a module name that is a name: "Design System", "Data & Integration").
- Indonesian follows the same rule: "Tambah pelanggan", "Simpan perubahan", not "Tambah Pelanggan".
- No ALL CAPS in the text; the caption style (`GroupTitle`, `.ngt`) makes capitals by CSS.

## Buttons and actions
- A verb first: "Add customer", "Export", "Apply", "Clear selection"; Indonesian "Tambah pelanggan", "Ekspor", "Terapkan", "Hapus pilihan".
- "Apply" / "Terapkan" for applying a panel, never "Done" / "Selesai" (BT-02).
- One action, one name everywhere (Save is always Save, not Save / Submit / Store).

## Messages
- An error says what happened and what to do: "Could not save the customer. Check the connection and try again."
- An empty state says what is missing and what the user can do: "No customers yet" + "Add customer".
- Helper text is one short sentence; no full stop after a label; a full stop after a sentence.

## Abbreviations and terms [guidance]
- A label uses the full term when it fits ("Relationship manager"); a well-known short form may stay ("ID", "Email", "PDF").
- A product abbreviation or a business term a new user may not know gets an info icon (`hint` / `InfoTooltip`) that spells it out and says what it means (criterion 6 of the info icon pattern in `rules-form.md`).
- Write an abbreviation the same way everywhere and in both languages when it is a name.

## English and Indonesian
- Same keys in both files (DS-03); no English text left in the Indonesian file except names and accepted loanwords.
- Numbers, money and dates follow the language (`src/lib/dateFormat.ts`, `formatters.ts`): "1,500,000" / "1.500.000".
- Do not translate word for word; keep the Indonesian natural and as short as the English.

### PR-06
**Rule.** No hint, tip or note says that the product is a prototype or a demo (a provenance badge Demo data, a line Prototype:, a note about demo data or simulated sources); the scenario feature (QA panel, scenarios) is the exception. The notes that explain a real behaviour of the page (for example what Run today creates) stay but are written without the words prototype and demo
**Meet.** Write no hint, tip or note that says the product is a prototype or a demo. A note explains behaviour in plain words without those words.
**Check.** Search the i18n files and pages for "prototype" and "demo".
**Guarded in Praisindo by** a unit test.
