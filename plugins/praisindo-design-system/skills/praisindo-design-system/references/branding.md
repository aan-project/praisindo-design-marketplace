# The Branding page (mandatory, menu of the user, real saving)

Entry "Branding" in the menu of the user (rule NV-13; route `branding`). Rules BR-01..BR-08, DC-01, TH-03, TH-09. Praisindo saves the brand in `localStorage` (namespace `app.*`); every other project MUST save it for real as described under "Saving".

## The brand model

```ts
interface Brand {
  appName: string; primary: string; secondary: string;      // hex #rrggbb
  logoLight: string; logoDark: string; favicon: string;      // URL ('' = none)
  font: string;                                              // Figtree | Inter | Plus Jakarta Sans | Poppins | Roboto
  defaultMode: 'light' | 'dark'; defaultLang: 'en' | 'id';
}
// Defaults (BR-06): name = the application's own name (ask the user; Praisindo demo uses "Praisindo Demo"), primary #007bff, secondary #7e57c2, font Figtree, light, English.
```

## The page (layout and behaviour)

- Page head: breadcrumb Home > Branding, title, one-line description. Standing notes go in one **Disclaimers** card at the bottom (DC-01), not between the head and the content.
- Two cards side by side (`.admg`): **left** a form card (title "Branding & customization"; footer: Reset (outlined, neutral) and Save (fill)); **right** a live **preview** card (title, helper text, light/dark switch for the preview only).
- Form groups (each with a `GroupTitle` caption): **Brand** (application name required; primary colour required, with swatch, hex validation and a hint; secondary colour required, with swatch; three logo rows), **Typography** (font family select from `Figtree, Inter, Poppins, Roboto`), **Theme** (default mode as two buttons Light/Dark pressed state), **Language** (default language select: English, Bahasa Indonesia; helper: the user can override it).
- **Logo rows** (light logo, dark logo, favicon): a 40px thumbnail (dark background for the dark logo), the slot name, "Set"/"Not set", and a button "Replace"/"Manage" that opens a small **Drawer** (size sm): note, current logo preview, upload (hidden file input), "Use sample logo" link button, Remove (danger transparent), Apply/Cancel in the footer. Accepted files: png, svg, webp (favicon also ico), at most 1 MB; the error says what was wrong (type or size) with a Retry for upload failures. The favicon tip: if a logo exists but no favicon, suggest adding one.
- **Validation** (shown under the field, in the field's `err`): name empty -> error; colour not `#rrggbb` -> error; primary colour needs a contrast of at least 3:1 against white (`contrastW(hex) >= 3`), otherwise "contrast too low". Save is blocked while invalid; a banner Alert (danger) "fix the errors" may appear only after the user pressed Save.
- **Preview** (scoped tokens under `.bp`, built from the DRAFT with `buildTokens(draftBrand, '.bp')`): a mock app with a sidebar (logo or initial + name, three nav items, the first active), a header with a title and an avatar, buttons (brand fill, secondary fill, neutral outlined), an input, badges, a small table with badges, and a bar+line chart that uses brand and secondary. An invalid colour falls back to the saved one in the preview. The preview has its own light/dark switch that does not change the page theme.
- **Save**: disabled while saving ("Saving..."), toast on success; on failure a danger Alert with Retry (a configuration error has no Retry). If the contrast check of the engine rejects the brand, show the contrast error. **Reset** restores defaults (BR-06) after confirming via a centred dialog if the draft differs.
- **Permission**: only the Administrator role (or the project's admin permission) can edit; others see the fields disabled with the reason, or do not see the menu.
- Write an activity-log entry on save if the project has an activity log.

## Applying the brand app-wide (the engine)

Use the DS token engine (starter in `assets/`; Praisindo files `palette.ts`, `colorEngine.ts`, `buildTokens.ts`, `appearance.ts`):

- `ramp(primary)` derives the brand ramp 50..950 (the default `#007bff` uses a fixed ramp). `darkIntent(hex, onWhite)` derives the dark values (text on the dark card >= 4.5:1; white on the fill >= 4.5:1 for brand, secondary and the semantic intents). Hand-written values in the palette file win over derived ones (CL-01..CL-03).
- `buildTokens(brand, ':root', fontScale)` returns the CSS for light and dark; write it into `<style id="tok">` in `<head>`; set `html[data-theme]`, `html[lang]`, `document.title = appName`, the `<link rel="icon" id="favl">` (favicon, or a generated mark from the initial) and load the Google font link when the font is not Figtree (once, id `ff-<font>`).
- Apply in a layout effect so CSS variables exist before any child (charts) reads them.
- **BR-07 / TH-03**: a user preference (mode, language, font size, table size, sidebar) never changes a brand colour; user preferences live under their own keys. **BR-08**: the default language and mode come from the brand; the user's own choice wins.
- Brand never changes status, focus or chart colours (only the brand ramp, the secondary colour, and the font).
- **TH-12**: the 2% body letter-spacing belongs to Figtree; for any other font `buildTokens` sets it to 0 on the page and in the Branding preview. A font other than Figtree is loaded from Google Fonts (`fontHref`, `loadFont`) when the brand is applied.

## Saving (the contract)

The data is global (one brand per application). Implement exactly this contract:

```
GET  /api/branding                 -> 200 Brand JSON (defaults when nothing saved)
PUT  /api/branding        (admin)  body Brand (validated again on the server: hex, name, font in the list, logo URLs) -> 200 Brand
POST /api/branding/logo   (admin)  multipart: slot = logoLight | logoDark | favicon, file  -> 200 { url }
DELETE /api/branding/logo/:slot (admin) -> 204
```

- Full-stack projects: implement it with the project's database and file storage (store the file in object storage or a blob column and keep the URL in the brand row). Never store logos as base64 in the page state beyond the draft.
- Front-end only / plain HTML projects: implement a **brand adapter** with the SAME function signatures (`getBrand`, `saveBrand`, `uploadLogo`, `removeLogo`) on `localStorage` (the logo as a data URL, 1 MB limit) so the UI does not change when a server arrives. Mark it clearly in the Branding page's Disclaimers ("Stored in this browser only") and add a line to `docs/design-system/new-components.md` under "Temporary decisions" so it can be replaced later.
- The brand loads before the first paint of the shell to avoid a flash of default colours (read the cached brand synchronously, then refresh from the server).
