# Component and layout revisions (DS 2.68 to 2.73)

General rules added after the owner revisions of 2026-11-11 and 2026-11-12: notes and Alerts, card padding, class names, long forms, list pages, sidebar label and search, action row, font weight, and the component fixes CP-01 to CP-07. Each rule has Rule, Meet and Check. The product names of the app are left out.

### CD-21
**Rule.** There is no class `.note` (a coloured box that does the job of an Alert). A note that stays on a page or in a drawer is an `Alert` of intent `info` (CD-08); a real condition is an `Alert` of its own intent; a plain sentence under a title is helper text. A record that can no longer be edited (submitted, accepted, rejected, cancelled) says so in an `Alert` (a status that blocks the action), and its link to the related record sits in the padded quick-action block of the panel, not against the edge
**Meet.** Use `Alert` with `intent`; no local box with its own background, border and icon; helper text is `<p className="mut">`.
**Check.** Search the styles for `.note`; a blocked record shows an Alert; the quick-action block has padding.
**Guarded in Praisindo by** a unit test.

### CD-22
**Rule.** The content of a card and of the panels of a detail page has 16px padding (`--sp-4`), not 20px; the large stat and KPI cards the same
**Meet.** A new card, panel or stat card pads its content 16px; use `Card` and the panel classes of the starter.
**Check.** Inspect the padding of the card body and of the panels; no `padding:20px` in a card or panel.
**Guarded in Praisindo by** a unit test.

### CD-23
**Rule.** A generic class name is never defined twice for different jobs: a bare class such as `.pct` that styles one box also hits the progress ring that uses the same word and squeezes it. A class is named for what it is (`.pdtop`, not `.pct`) and no stylesheet defines a bare class that another component uses with a parent selector
**Meet.** Before adding a class, search the styles for the name; give a component's own box a specific name.
**Check.** Search the styles for the bare name; open the pages that use the other component.
**Guarded in Praisindo by** a unit test.

### DK-21
**Rule.** A long form (five groups of fields or more) has a jump rail: a numbered rail that scrolls to each group, the group name in a tooltip; the footer stays on the last card
**Meet.** `FormShell` with `jump` renders its groups with `AnchorNav`; one group per card.
**Check.** A form of five groups or more has the rail; each rail item scrolls to its card.
**Guarded in Praisindo by** a unit test.

### DK-22
**Rule.** Every list page has the layout of the List pattern (DK-08, TB-17): the stat cards on top, then ONE card with the tabs (when there are tabs), the toolbar (search combo, Advanced filter, Show / hide columns), the table and the standard Pagination, and the standing notes in Disclaimers. A list built another way is converted, also a monitoring table that sat bare under the KPI cards and the audience preview of a builder (stat cards above a table)
**Meet.** Start from `ListPage` of the examples (or the feature piece `ListTable` when it exists); never a bare table under the stat cards.
**Check.** Each list page has stat cards, one card with toolbar, table and Pagination.
**Guarded in Praisindo by** a unit test.

### SB-34
**Rule.** A label of the sidebar (level 1, 2 and 3) is on one line: when it does not fit it is cut in the middle with an ellipsis and its last word stays visible (the `.mid` markup of TB-20)
**Meet.** Render the label with the middle-cut helper (`midText`) in the sidebar item.
**Check.** A long label shows its beginning and its last word with an ellipsis between; it never wraps.
**Guarded in Praisindo by** a unit test.

### SB-35
**Rule.** The sidebar example of the Design page is built like the real sidebar (`SideNav` in the shell): its labels go through `midText` (SB-34), a menu item can carry the count Chip (SB-23), and the example has a long label so that the cut shows. A change to the markup of one is made in the other
**Meet.** In the Design page example render each label with `midText` and a count with `<Chip selected hidden>`; keep one long label in the example (HTML: `midText` and the same chip markup from `js/ui.js`).
**Check.** The sidebar example on the Design page shows a long label cut in the middle with its last word, and a count chip on an item, like the real sidebar.
**Guarded in Praisindo by** a unit test.

### SQ-01
**Rule.** The sidebar has a search field under the logo that searches the PAGES of the menu of the role (and the entries of its user menu) and the CONTENT the role may read (the articles of the help area, title and text, in the language of the user). A page or an article the role cannot open is never a result. The query is plain text, never a pattern. Data records are not searched unless the owner decides so
**Meet.** `GlobalSearch` (presentational: the hits come in as props) in the sidebar, fed by a search over the menu and the articles that already filters by role.
**Check.** Search a word as two roles: a page or article the role cannot open does not appear; a regular-expression character is searched as text.
**Guarded in Praisindo by** a unit test.

### SQ-02
**Rule.** The results open in a popover to the right of the sidebar (the position of the user menu), in groups Pages and Content with their counts. A result shows an icon, the title and, for content, the sentence around the match; the matches are marked. Up and Down choose (the first is chosen at the start), Enter opens, Esc closes (a second Esc empties the field), `/` puts the cursor in the field. The list scrolls inside the popover (its height stops at the edge of the window) with the group titles on top; no hint line under the list. No result: an empty state with the word searched
**Meet.** Use the keys and groups of `GlobalSearch`; do not add a hint line.
**Check.** Type, press Down, Enter, Esc, `/`; scroll a long list; search a word that matches nothing.
**Guarded in Praisindo by** a unit test.

### SQ-03
**Rule.** Enter or a click on a Page opens its route; on a Content result it opens the article with the word marked in its text (the first match scrolled into view) and a chip with the word under the page head; the chip's close button takes the marks away. The field is emptied after the choice
**Meet.** `GlobalSearch` `onGo`; mark the article text with a `<mark>`; a dismissible `Chip`.
**Check.** Open a content result, see the marks and the chip, remove them with the chip.
**Guarded in Praisindo by** a unit test.

### SQ-04
**Rule.** The field is in the sidebar for every role, between the logo and the menu, also in the off-canvas menu of a phone (the popover is then as wide as the screen); in the collapsed rail it shows when the rail expands on hover or focus (SB-08). `GlobalSearch` has a live example on the Design page
**Meet.** Place the field in the sidebar header; add the example to the Design page (Selection controls).
**Check.** Desktop, collapsed rail on hover, phone menu; the Design page has the example.
**Guarded in Praisindo by** a unit test.

### PP-02
**Rule.** The action row of the sidebar (language, light and dark, notifications, scenarios) shows at most three items; with more than three the first three stay and the rest are in the dropdown of a "more" button (`more_horiz`, to the right of the sidebar like the user menu) at the far right of the row; in the dropdown an item is a row with its icon and its name. An item moved elsewhere (the toolbar) leaves the row, so with three or fewer there is no more button
**Meet.** Build the row from a list and cut it at three; the rest go to the more dropdown with icon and name rows.
**Check.** Add a fourth action: the more button appears and lists it with icon and name.
**Guarded in Praisindo by** a unit test.

### PP-01
**Rule.** My Preferences, under Font size and Table size, ends with a link "Panel items" (the only row of the drawer that is a link). It opens a SECOND drawer (with Back, DR-03) with, for each item of the shell panel (Search, Language, Light and dark, Notifications, Scenarios, Profile; an application lists only the ones it has), a segmented choice Sidebar (default) or Toolbar. The choice is stored with the other preferences (`items`); Reset to defaults brings every item back to the sidebar. With the profile in the toolbar the divider above the user button's place is gone. On a tablet or a phone the items stay where they are (SB-33)
**Meet.** `prefs.items = { search, lang, theme, notif, qa, profile }` each `'sidebar' | 'toolbar'`; a link row at the end of the drawer opens the second drawer; the shell reads `prefs.items` to place every item.
**Check.** Move Language to Toolbar: it leaves the sidebar row and shows in the toolbar; Reset to defaults puts it back; resize below 1100px: nothing moves.
**Guarded in Praisindo by** a unit test.

### PP-03
**Rule.** The toolbar (`header.topbar.tool`) holds the items put there by PP-01, on a desktop only (1100px and wider), at the top of the main column. It is NOT frozen: it scrolls with the page. The search opens its results under the field, the bell its popover and the profile its menu at the top right. With no item in the toolbar there is no toolbar
**Meet.** Render `header.topbar.tool` only when at least one item has position toolbar and the width is 1100px or more; no `position: sticky`.
**Check.** Move the profile to the toolbar: its menu opens at the top right; scroll the page: the toolbar goes with it; move it back: the toolbar is gone.
**Guarded in Praisindo by** a unit test.

### PP-04
**Rule.** My Preferences has Font size and Table size as full-width segmented choices (`SegmentedControl`, label above), under an info Alert (CD-08: "Applies only to you. Brand colors and logos are set in Branding"); no Sidebar setting (the sidebar is automatic by SB-04..SB-07 and SB-30; the round button on its edge still changes it, SB-28 amended) and no Language (the switch is in the sidebar footer); the link to the panel items (PP-01) is last. The footer has "Reset to defaults" (transparent) and "Apply" (fill brand, closes the drawer)
**Meet.** Build the drawer from the info Alert, two `SegmentedControl` fields, the link row and the footer; move language and sidebar out of it.
**Check.** Open My Preferences: Alert, Font size, Table size, Panel items link, footer with Reset to defaults and Apply; no Language or Sidebar field.
**Guarded in Praisindo by** a unit test.

### FW-01
**Rule.** Branding has, under Font family, "Default font weight" (a `RichSelect`): 300 Light, 400 Regular (default), 500 Medium, 600 Semibold. The option reads "{weight} - {name}" with the name in a softer colour (`RichOpt.soft`) and a normal weight, on the same line as the number. The choice is saved with the brand and moves every weight of the app (FW-02)
**Meet.** `Brand.fontWeight` (absent means 400); a `RichSelect` with `soft` on the options in the Branding page.
**Check.** Choose 500, reload: the choice is kept and the whole page is one step heavier.
**Guarded in Praisindo by** a unit test.

### FW-02
**Rule.** The default font weight moves every weight of the app: every `font-weight` of the style files is written `calc(N + var(--fw-shift,0))` and the inline weights of the pages the same. `--fw-shift` is the chosen weight minus 400 (300: -100, 500: +100, 600: +200) and is written only when it is not 0, so 400 changes nothing. A new `font-weight` is written in this form
**Meet.** `buildTokens` writes `--fw-shift`; in CSS and inline styles use `calc(500 + var(--fw-shift,0))`, never a bare number.
**Check.** Search the styles for a bare `font-weight:` number; set weight 300 and 600 and compare.
**Guarded in Praisindo by** a unit test.

### CP-01
**Rule.** `SegmentedControl` has a size: `md` (default) and `sm` (`size="sm"`: 4px 12px around the text in `--fs-xs`, 16px icons). A toggle in the header of a card (a chart switch) is `sm`. The thumb is exactly as wide as one option and centred on it
**Meet.** `<SegmentedControl size="sm" … />` in a card header.
**Check.** The thumb covers the active option with the same margin on both sides.
**Guarded in Praisindo by** a unit test.

### CP-02
**Rule.** `Wizard` fills its container; the label and the support text of a step are on one line cut with an ellipsis, so the steps of a row keep their baselines. In the icon variant the icon sits 8px above its progress bar, the bar has round ends, and an error step is a soft red tile, not a filled one
**Meet.** Use `Wizard`; do not wrap the labels.
**Check.** A row of steps with long labels keeps one line each; an error step is soft red.
**Guarded in Praisindo by** a unit test.

### CP-03
**Rule.** The icon of an `Alert` is centred in its tile (the line height of the icon box equals its height)
**Meet.** Use `Alert`; do not override the tile.
**Check.** Look at an Alert with one line of text and with several.
**Guarded in Praisindo by** a unit test.

### CP-04
**Rule.** The icon of a state (`EmptyState`, `ErrorState`) is in a round soft tile (56px, 40px in the small size; red soft for an error), and the state rule colours only that icon (`.state>.ic`): the icon of a button inside the state (Retry, a call to action) has the colour of the button. A badge in the header of a collapse card keeps the icon colour of its intent (the chevron rule styles only the chevron, `.ccb>.ic`)
**Meet.** `EmptyState` / `ErrorState` with their `icon`; a button inside is a normal `Button`.
**Check.** An error state with a Retry button: the button icon is not red.
**Guarded in Praisindo by** a unit test.

### CP-05
**Rule.** Charts: when the container of a chart changes width after the chart was drawn (a detail page collapses the sidebar while it arrives), the chart is redrawn to fit it
**Meet.** Use the `ApexChart` adapter (ResizeObserver, then a window resize event).
**Check.** Open a page with a chart while the sidebar collapses: the chart fills its card.
**Guarded in Praisindo by** a unit test.

### CP-06
**Rule.** Branding: Default mode is a `Select` like Default language, not two buttons
**Meet.** `Select` with Light and Dark options in the Branding form.
**Check.** The Branding form has two Selects for the defaults.
**Guarded in Praisindo by** a unit test.

### CP-07
**Rule.** The Design page shows the four states of a data area (loading, empty, error, empty with a button) side by side, each in its own card under a caption; the demo of a long name in a table cell has a neutral link
**Meet.** The states section of the Design page uses four cards in a row.
**Check.** Open the Design page, section Feedback: four cards with captions.
**Guarded in Praisindo by** a unit test.

## Select, field popovers, tables and text (DS 2.74 to 2.83)

### SL-01
**Rule.** The `Select` has a list of its own on a device with a mouse or a trackpad (`(hover: hover) and (pointer: fine)`): the field is a button (`.sl-t`, role combobox, haspopup listbox) with the same look and sizes as the native one, and a hidden native `<select>` (`.sl-n`, aria-hidden, the same label and options) keeps the value for forms and scripts. On a touch device, and where there is no `matchMedia` (a server render, unit tests), it stays the native select. The API (`opts`, `val`, `onChange`, `size`, `label`, `err`) does not change
**Meet.** Use `Select`; never style a native select by hand.
**Check.** Desktop: a list opens; phone: the native picker; a form with a Select submits its value.
**Guarded in Praisindo by** a unit test.

### SL-02
**Rule.** The list of a Select is a popover in the overlay host (a table or a drawer never clips it), under the field and above it when there is no room, at least as wide as the field, closed by a press outside, Escape (the topmost overlay) and a choice; the focus returns to the field. A row is 40px (32px in the small size), the chosen row is in the brand colour with a check at the right, the row under the pointer or the focus is highlighted; a long list scrolls inside the popover
**Meet.** Use `Select`; do not build a menu that looks like it.
**Check.** Open a Select near the bottom of a card and of a drawer.
**Guarded in Praisindo by** a unit test.

### SL-03
**Rule.** A Select with more than five options has a search field at the top of its list (the focus goes to it on opening); it filters the options by the text of the label, Down goes to the first row, Enter chooses the first match, and no match says "No results"; five options or fewer have no search field
**Meet.** Pass all options to `Select`; the search appears by itself.
**Check.** A Select of six options has the search; one of five has not.
**Guarded in Praisindo by** a unit test.

### SL-04
**Rule.** Keys of the Select: Down or Up on the field opens the list; in the list Down, Up, Home and End move, Enter or Space chooses, Tab closes, and in a list without a search field the first letter of an option jumps to it
**Meet.** Use `Select`.
**Check.** Operate a Select with the keyboard only.
**Guarded in Praisindo by** a unit test.

### SL-05
**Rule.** Only one Select list is open: a press on another field closes it (only its own field is let through, so its click toggles it) and the focus stays on what was pressed, not on the field of the list. The list follows its field while the page or any area of it scrolls and closes, without taking the focus, when the field leaves the screen; a resize closes it
**Meet.** Use `Select` (its list takes the field as `anchor`).
**Check.** Open a Select, scroll the page: the list follows; open a second Select: the first closes.
**Guarded in Praisindo by** a unit test.

### FP-01
**Rule.** The popover of a field (the calendar of DateField, the list of MultiSelect and RichSelect, the country list of PhoneInput) is never clipped by a card, a drawer or a table: `useFieldPopover(...).float(node)` draws it in the overlay host (`.fpop-fix`, `position: fixed`) under the field, above it when there is no room below, inside the left and right edges (8px), aligned to the right of the field with `end`, above with `up`, as wide as the field for RichSelect and on a phone. It follows the field while the page or any area scrolls and closes, without taking the focus, when the field leaves the screen; a press inside it does not close it, Escape does
**Meet.** Use the DS field components; a new popover uses `float()` of `useFieldPopover`.
**Check.** Open a date popover in a card at the page edge and in a drawer; scroll.
**Guarded in Praisindo by** a unit test.

### FP-02
**Rule.** No field is a native date field (replaces FM-11): a date is the `DateField` (the calendar popover; `min` and `max` disable days; a value set by the page moves the field; a hidden ISO input `name="<id>-iso"` carries the value for forms and tests), a date with a time is a DateField and a Select of the time in steps of 15 minutes; never `<input type="date">`, `datetime-local`, `time` or `month`
**Meet.** `DateField` (props `min`, `max`, `aria`, `err`, `req`); a time of day is a `Select`.
**Check.** Search the project for `type="date"`, `datetime-local`, `type="time"`.
**Guarded in Praisindo by** a browser test.

### TB-25
**Rule.** A table that lists records sorts by its headers: a click on the header of a column sorts up, a second click down, a third puts the rows back in their order; the header says `aria-sort`, shows the arrow, answers Enter and Space, and a column with `sort: false` has no sort. Numbers sort as numbers, text with the collator of the language and digits inside a text as numbers ("R2" before "R10"), rows that compare equal keep their order, the page goes back to the first and the rows sort before they page. A date or a number column that is not its text gives its own sort value. A reference table (permissions, samples) may stay without a sort
**Meet.** Use the table library, or a sort hook in the table of the List pattern.
**Check.** Click each sortable header three times; check `aria-sort` and the keyboard.
**Guarded in Praisindo by** a unit test.

### TB-26
**Rule.** A tab or a section that shows a table (role mapping, definitions, a permission matrix) is a table of the List pattern like the main list: the toolbar (search combo, Show / hide columns), the table with a frozen first column, the sortable headers (TB-25) and the standard Pagination. The explanations that were a paragraph above each table are items of the Disclaimers of the page, together with the note of the page (DC-01)
**Meet.** Build the table like `ListPage`; move the explanations to `Disclaimers`.
**Check.** Every tab with a table has toolbar, sort and Pagination; no explanatory paragraph above a table.
**Guarded in Praisindo by** a unit test.

### TX-01
**Rule.** Every text key that the code asks for with `t('key')` exists in the English and in the Indonesian dictionary, so a raw key (such as `ff.time`) is never on a screen; a key built from a prefix is not looked at
**Meet.** Add the key to both dictionaries in the same change.
**Check.** A test (or a script) collects the keys of `t('...')` and looks them up in both files.
**Guarded in Praisindo by** a unit test.

### CD-24
**Rule.** The label of the action button or link of a Tooltip (`.tt-link`) is always white (`--color-text-white`) on the dark bubble, wherever the bubble sits: a rule of the surroundings (for example `.tw a:not(.btn)` of a table) never colours it.
**Meet.** Use the DS CSS (`55-tooltip.css`); do not recolour a tooltip link.
**Check.** Open a tooltip with an action inside a table: the label is white.
**Guarded in Praisindo by** a unit test.

### CD-25
**Rule.** In dark mode the border of the Tooltip bubble is faint: the subtle neutral border (`--color-border-neutral-subtle`), not the strong one, so the dark bubble does not get a bright outline.
**Meet.** Use the Tooltip of the system; do not restyle its border.
**Check.** Open a tooltip in dark mode: no bright outline around the bubble.
**Guarded in Praisindo by** a unit test.

### CD-26
**Rule.** Only the glyph of the icon of an Alert rings like a bell, the tile behind it stands still: the glyph swings for about a second when the alert shows and again every 10 seconds (`@keyframes alring`, `.al>.ic`); the tile is the `::before` of the icon, turned back by the same angle (`alringback`); it stands still when the user asks for reduced motion; the animation is a transform only and changes nothing of the layout.
**Meet.** Use the Alert of the system; do not add a second animation to its icon.
**Check.** Show an Alert: the icon swings briefly, then again after 10 seconds; with reduced motion it never moves.
**Guarded in Praisindo by** a unit test.

### CD-27
**Rule.** Only the glyph of the icon of an Empty state and of an Error state bounces up and down, like the ring of the Alert icon (CD-26): two small bounces of 4px for about a second when the state shows and again every 10 seconds (`@keyframes stbounce`, `.state>.ic`); the round tile behind the glyph stands still (it is the `::before` of the icon, moved back by the same distance, `stbounceback`, in the colour of `--st-tile`); nothing moves for reduced motion; a transform only.
**Meet.** Use `EmptyState` and `ErrorState` of the system; do not add a second animation to their icon.
**Check.** Show an empty state: the glyph bounces briefly, the round tile does not move; with reduced motion nothing moves.
**Guarded in Praisindo by** a unit test.

### TS-01
**Rule.** The toast is a dark pill: the black surface (`--color-text-black`) with white text, the radius of the Alert (`--r-card`), and a dot of 8px in the colour of the intent (success, info, warning, danger) before the text, no border; the position stays fixed bottom right (DK-19), the text and the roles are unchanged.
**Meet.** Use the toast of the shell; never style a toast per page.
**Check.** Show a toast of each intent: a dark pill with the right dot.
**Guarded in Praisindo by** a unit test.

### WG-03
**Rule.** The `HighlightText` is the pair of a small text and a highlighted text (a figure, an object or a value to stress) with the look of the content of a widget: small text `--fs-sm` in `text-secondary`, the highlight in bold `--fs-h-md` in `text-primary`; it has an alignment (`left`, `right`), an order (`valueFirst`: the big text above the small one, otherwise below) and three sizes (`sm`, `md`, `lg`); the DOM order stays label, value.
**Meet.** Use `HighlightText` for any highlighted figure; do not write a class for it.
**Check.** The Design page shows the three sizes and the four alignments and orders.
**Guarded in Praisindo by** a unit test.

### HT-01
**Rule.** The `HighlightText` is a category of its own: its code is in `components/HighlightText.tsx` and `styles/70-highlight-text.css` (classes `.hlt`, `.hlt-l`, `.hlt-v`, `.hlt-r`, `.hlt-vf`, `.hlt-sm`, `.hlt-lg`), and the Design menu has a page of its own for it under Components, Data, because it is used in many components, not only widgets.
**Meet.** Keep the component, the file and the page of its own.
**Check.** The Design menu lists Highlight text.
**Guarded in Praisindo by** a unit test.

### SG-11
**Rule.** A validation result shown on the Design page (blocking error, warning, information) uses the Alert in its compact variant (`Alert compact`), not a list of its own.
**Meet.** Use `Alert compact` with the intent of the level.
**Check.** The Validation levels example on the Design page shows three compact Alerts.
**Guarded in Praisindo by** a unit test.

### TB-29
**Rule.** The variant of the tabs follows where they sit, on every page: tabs OUTSIDE a card use the underline variant (the tab bar of a detail page, the tabs above the cards, the tabs of a list page whose card has no border or surface); tabs INSIDE a card use the segmented variant (a tab strip in a card or an entity panel, Key information); a drawer counts as a card, so its tabs are segmented. The context makes the variant (`.card .tabs`, `.drawer .tabs` in the DS CSS), so the markup does not change; the Design page example of the underline variant sits in the documentation card (`.dss`), which is not counted.
**Meet.** Use `Tabs` with no `variant` and put it where it belongs; do not set `variant="seg"` by hand for a tab strip that sits inside a card or a drawer (it is segmented already), and do not make a detail page tab bar segmented.
**Check.** Look at the tab bar of a detail page (underline) and at a tab strip inside a card (segmented).
**Guarded in Praisindo by** a unit test.

### TB-30
**Rule.** A segmented tab is as wide as its label: it never grows to fill the tab bar (the bar may fill the width, the tabs sit at the left as on the Tabs page). This holds for the tab bar of a drawer and for the tabs of a card or panel; a tab bar that does not fit scrolls sideways instead of squeezing the tabs.
**Meet.** Use the Tabs of the system with `variant="seg"` (or the drawer tab bar); do not give a tab `flex:1`, `width:100%` or equal columns.
**Check.** Open a drawer with tabs and a card with segmented tabs: each tab is as wide as its text, with the same look as the Tabs page.
**Guarded in Praisindo by** a unit test.

### LD-01
**Rule.** While the page loads it never shows broken content, it shows a skeleton: until the application is drawn the page is a skeleton of the shell (the sidebar and the content, in `index.html`, replaced when the application mounts; it keeps its own greys because the tokens are built by the application, and it stands still for reduced motion); until the icon font is loaded every icon is a small skeleton block (`html[data-icons="wait"] .ic`, never the long word of its ligature), the attribute is set by `index.html` and becomes `ready` when the font is loaded, and `failed` (icons hidden) after 20 seconds; the font stylesheets do not block the first paint (`media="print" onload="this.media='all'"`).
**Meet.** Keep the `index.html` of the starter: the boot skeleton in `#root` or `#app`, the `data-icons` script and the non-blocking font links.
**Check.** The audit flags an `index.html` without `data-icons` or with a blocking font stylesheet; in the browser hold back the icon font: the icons are grey blocks, never words.
**Guarded in Praisindo by** a unit test and a browser test.

### LD-02
**Rule.** The skeleton that shows before the application is drawn is the skeleton of the page that will appear: the sign-in page gets the two panels of the sign-in screen (the story panel and the form, no sidebar), every other page the shell of LD-01. `index.html` chooses with a script that runs before the first paint (the sign-in skeleton when the address is `#/login`; a project with a session also picks it when nobody is signed in); on a phone only the form shows; the page margin of the skeleton is 0.
**Meet.** Keep the `boot-l` section and the small script of the starter `index.html`; add the project's own session check to the script when the project has a sign-in.
**Check.** Hold the application script back and open `#/login`: the two panels show, not the sidebar; open any other page signed in: the shell shows.
**Guarded in Praisindo by** a unit test.
