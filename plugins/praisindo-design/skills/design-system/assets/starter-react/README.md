# starter-react (skill design-system v2.172.0)

A complete, building Vite + React 18 + TypeScript app with the Praisindo shell, the full Design System page and the Branding page. Typechecks with `npm run typecheck`, builds with `npm run build`.

## Start
1. Copy this folder into the new project (or merge `src/`, `docs/`, `index.html`, `vite.config.ts`, `tsconfig.json` into an existing Vite app), run `npm install`, `npm run dev`.
2. Put the product's name and brand colours in `BDEF` of `src/design-system/tokens/palette.ts` (nothing else in that file) and in the Branding page after first run.
3. Add menu entries in `src/app/nav.config.ts` (labels are dictionary keys), pages in `src/app/routes.tsx` (declare `layout: 'list' | 'detail'`), text in `src/i18n/en.json` and `id.json` (same keys in both).
4. Replace `src/app/session.ts` with the product's sign-in. Mark admin routes `admin: true`.
5. Replace `localAdapter` by `optional/adapters/brandHttp.ts` when the server exists.

## Layout
- `src/design-system/` tokens (`palette`, `colorEngine`, `buildTokens`), 63 stylesheets in cascade order (`styles/index.css`, never reorder or delete), components. Do not edit: a change belongs to the design-system owner. A missing component goes to `docs/design-system/new-components.md` and the "This project" section.
- `src/app/shell/` the shell (AppShell, Topbar, UserMenu, PrefsDrawer, PageHead): the same in every application, do not restyle.
- `src/branding/` brand model, validation, adapter interface, temporary local adapter, `applyBrand`.
- `src/features/branding/` Branding page (Admin, real saving through the adapter). `src/features/design/` Design System page: standard sections plus `ProjectSection` for the project's own components.
- `src/domain/badgeIcons.ts` the ONE badge map: add the product's domains here.
- `src/lib/reactStorage.ts` the only file that touches Web Storage; change `NS` to the app's namespace.
- `docs/design-system/` `changelog.md` (read by "What's new") and `new-components.md` (the log for the DS owner).
- `optional/` adapters that need extra libraries.
- `src/features/examples/` **pattern examples, a REFERENCE, not product pages**: `ListPage` (list page), `FormPage` (form, built with `src/features/shared/FormShell.tsx` and `src/lib/formLayout.ts`: one card per group, the buttons in the card of actions on the right, DK-27; use `FormShell` for every add / edit page), `DetailPage` (detail, `layout: 'detail'`), `DialogsPage` (the six dialogs, drawer with Back, action menu), and `parts/` (columns drawer, row menu). Menu Admin > "Pattern examples (reference)", routes `ex-list`, `ex-form`, `ex-detail`, `ex-dialogs`. Each file lists in its header the rule ids it meets (`references/rules-*.md` of the skill). Build product pages the same way, then delete the folder, the four routes, the menu entry and the `ex.*` keys.

## Replace before shipping
`src/features/home/HomePage.tsx` (placeholder), `src/app/session.ts` (placeholder), `src/features/examples/` with its routes and menu entry (reference), the Kanban/Table demo data is design-system sample data and stays.

**Built by default (GN-01 to GN-06).** Five features exist without being asked; adapt their content to the product (see `references/rules-otomatis.md` of the skill):
- Activity history (GN-01): the item `data-testid="mylog"` in the user menu, the page `#/mylog` and the one function `logActivity({ category, action, targetType, targetId, note })`; categories in `src/domain/log/activity.config.ts`. Call `logActivity` from every create, update, delete, approve, publish, export and sign-in.
- Notifications (GN-02): the bell in the action row, its dropdown and the drawer "View all"; categories, kinds, audiences and texts in `src/domain/notifications/notifications.config.ts`; the list is derived from the product's data in `ntBuild()` in `src/domain/notifications/notify.ts`.
- Badge tooltips (GN-03): one central map and ``badgeProps(domain, value)` (`src/domain/badgeIcons.ts`)`; a badge never gets a hand-written tooltip.
- Profile card (GN-04): `UserName` (`src/features/shared/UserName.tsx`) for every user name, fields in `src/domain/profile.config.ts`.
- Motion (GN-05) is on by default (`data-motion` on the root, the design-system layer only). Delete the pattern examples (`ex-*`) when the real pages exist (GN-06).

**Rules register.** `docs/design-system/rules-register.md` holds the rules of this project (RG-01 to RG-04): record every rule you are given or create, and report a contradiction to the owner at once (`node scripts/rules-conflicts.mjs --new <ids>` from the skill).
