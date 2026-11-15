# The mandatory shell (same in every application)

Source rules: SB-01..SB-33, AV-01..AV-05, NV-*, MB-*, TH-05, SidebarToggle. The application shell is identical in every product; only the menu content, logo and name change.

## Desktop (1100px and wider)

- **No topbar** (SB-01). Global actions live in the sidebar footer.
- **Sidebar** exactly one screen high (`height:100vh`, sticky; only the menu list scrolls by itself). Width **232px expanded, 68px collapsed** (SB-02, SB-19, SB-03, SB-20).
- **Menu items**: level-1 and level-2 are 32px high (padding 0 8px, gap 12px); level 2 differs by indent only (padding-left 40px, the sub-menu line at left 16px) (SB-11, SB-22). Group titles (`.ngt`, caption) are uppercase, letter-spacing .08em, weight 500, subtle-3 (SB-12). Home stands alone, other items are grouped under caption headings (SB-15). No divider between groups when expanded (12px gap); the divider shows when collapsed (SB-13, SB-21).
- **Menu counts** (items needing attention) are static solid brand Chips, 20px high; 16px dot-sized in the 68px rail and in the bottom bar where they sit on the icon (SB-22, SB-23).
- **Brand row** at the top: with an uploaded logo only the logo (it already contains the name), without a logo the initial and the application name (BR-01, BR-02). Collapsed: the logo mark (favicon when logo and favicon both exist, else the initial) (BR-03, SB-18). Dark mode uses the dark logo with fallback to the light one (BR-05).
- **Edge toggle**: the round `SidebarToggle` on the sidebar edge collapses/expands it, with mouse and keyboard (aria-label "Toggle sidebar", aria-expanded), on every route (SB-09).
- **Footer**, top to bottom: the util row, a divider, then the user button.
  - Util row: language toggle (EN | ID), theme (light/dark) button, optionally notifications bell; an optional quick-access/QA button is the LAST item at the far right (in the 68px rail it is the last item of the stack) (SB-01, TH-05).
  - User button opens the user menu (`.pop.upop`, to the right of the sidebar, bottom 16px): static header (avatar, name, email, role statistics: no button, no handler) then My preferences, Activity history, a divider, Sign out (danger item). A demo role switcher belongs here only in demos (SB-14, AV-01..AV-05). Stat cards use the card radius, buttons at least 36px high.
- **No tip card, no lightbulb link** in the sidebar (SB-31). Nothing decorative in the sidebar.

## Behaviour

- **List, overview and admin list pages**: expanded by default (mode Auto) or as the user's explicit preference (`Auto`, `Expanded`, `Collapsed`, set in My Preferences or with the edge button) (SB-04, SB-28).
- **Detail-layout pages** (one entity worked on full width: a detail page, an editor) collapse the sidebar on entry whatever the preference (SB-05, SB-30). Declare the layout per page key in a table (`PAGE_LAYOUT[key] = 'list' | 'detail'`) that must be exhaustive, so a new page does not compile until it declares its layout. The edge button on a detail page overrides that page only; the override ends with the route; between two detail pages it stays collapsed with no expand-then-collapse flicker. Going back to a list restores the stored preference (SB-06).
- A window narrower than 1100px collapses it automatically in mode Auto (SB-07).
- A collapsed sidebar expands on hover and keyboard focus as an OVERLAY: the content does not shift (SB-08, SB-19). Right after the edge button collapsed it, hover/focus expansion stay off until the pointer (mouse) or the focus (keyboard) leaves it.
- Class names inside the shell must not reuse component class names (`tt` is the Tooltip bubble, `tb` the table toolbar; the topbar is `topbar`).

## Tablet and phone

- **Below 1100px** a topbar (`header.topbar`, 56px, sticky, page surface, bottom hairline) shows the menu button, the page title and the avatar which opens the same user menu. On tablet (641 to 1099px) the menu button expands/collapses the 68px rail; on a phone it opens the off-canvas menu (SB-33). It is not rendered at 1100px and wider.
- **Below 640px** the sidebar is replaced by a bottom navigation (four items and "More") and an off-canvas panel (fixed, 280px wide, opened from More); the More button is always shown because the off-canvas sidebar is the only place for the footer actions (SB-24, MB-01, MB-05). Touch targets at least 44px (MB-02). No horizontal page scroll at 390px (MB-03). Drawers are full screen (MB-04).

## Page area

- Page head: small breadcrumb above the title, `h1` (28px regular scale, weight 700), one-line description (NV-02, NV-03). Back icon/breadcrumb link only on detail pages (NV-01). Page padding 24px.
- A role/permission denied page shows a "restricted" state card with a button back to Home; the application must not render protected content.
- One short slide/fade page transition; the veil is for sign-in and sign-out only (NV-09). A new page opens at the top; Back returns to the previous scroll position (NV-04).

## Menu configuration (the only thing that changes per application)

Use one pure model, so the shell has no knowledge of any product:

```ts
interface NavItem { k: string; icon?: string; labelKey: string; href?: string; kids?: NavItem[] }   // kids: level 2 (and 3)
interface NavGroup { key: string; labelKey: string; items: NavItem[] }                           // labelKey '' = no caption (Home)
```

- Labels are i18n keys, never text. A parent with `kids` is a button that expands (`aria-expanded`); the parent of the current page shows `has-on`.
- Items per role/permission are filtered by a pure function (`navGroups(role)`); the mobile bar takes the first four entries and puts the rest in More when there are more than five (`mobileSplit`).
- Mandatory entries in every application (rule NV-13): **Branding** and **Design System** in the MENU OF THE USER (`PROFILE_NAV`, under a divider after My preferences, before Sign out), not in the sidebar (see `branding.md`, `design-page.md`). Suggested order of the Admin group: the product's admin pages (SB-16).
- Counts per item come from a function `navCount(key)` returning a number; 0 draws nothing; above 99 shows "99+".

## Implementation notes (React + TypeScript + Vite)

- Structure: `AppShell` (`aside.sb` with `SidebarToggle`, brand row, `SideNav`, footer; `MobileNav`; `Topbar` below 1100px; `main.ct`), `SideNav` (renders `NavGroup[]`), `UserMenu`, `Topbar` and a `useMediaQuery` hook, `PageHead`.
- Root element class: `shell` plus `coll` (collapsed), `nohov` (hover expansion off) and `mnav` (off-canvas open). Preferences (`sidebar`, `lang`, `mode`) come from a prefs provider; brand and logos from the branding provider.
- The shell needs the CSS of: base, button, tabs-badge, drawer, sidebar (232/68, hover overlay), sidebar groups level 2-3, edge toggle, topbar, mobile bottom navigation, language toggle, chip, tooltip. If the starter in `assets/` provides them, use them unchanged.
- Plain HTML: same markup and classes; a small script toggles `coll`, stores `sidebar` / `lang` / `mode` in `localStorage`, and applies `data-theme` and `lang` on `<html>`.
