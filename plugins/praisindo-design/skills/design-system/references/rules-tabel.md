# List pages: table, toolbar, pagination, board (Praisindo DS v2.117.0, skill v2.117.0)

The ids are those of the Praisindo owner rules register (general rules only; product-domain rules are not in the skill). Every rule is permanent: do not change, loosen or re-interpret it; a need for something else goes to "Rule proposals" in `docs/design-system/new-components.md`. Examples in brackets name pages of the Praisindo reference application; apply the rule to the equivalent page of your product.

Example page: `features/examples/ListPage.tsx` (React) and `pages/examples/list.html` (HTML). Copy its structure; change only the data, the columns and the texts.

## Pattern: a list page, top to bottom

1. **Page head** `PageHeader`: breadcrumb, title, one-line description (`sub`), and the page's ONE primary action on the right (`actions={<Button label="Add customer" icon="add" />}`, `fill`, verb first). No Back (NV-01).
2. **Stat cards** `StatCards` (3 to 5 cards: total and the counts that matter; `onStat` may filter the table) (TB-10, TB-12).
3. **One card** (`Card` or `Card flush`) that holds the toolbar, the table and the pagination. No card inside it.
4. **Toolbar** `.tb`, left to right:
   1. `SearchBar` (field select + search input) (TB-06);
   2. `Advanced filter` `Button type="outlined" intent="neutral" icon="filter_list" count={active filters}` (TB-06, CH-07);
   3. `<span class="sp" />` (pushes the rest right);
   4. secondary actions such as `Export` (`outlined`, neutral);
   5. LAST: `Show / hide columns` icon button (`icon="view_column"`, `aria`), opens the columns drawer (TB-07, TB-11).
5. **Bulk layer** `.bulk role=region` replaces nothing and appears only when rows are ticked: "{n} selected", the bulk actions (`transparent`), and a close icon "Clear selection" (TB-08).
6. **Table** `.tw t-${size}`: `th.ck` select-all checkbox, the first data column frozen (`th.fl f2` after the checkbox column), the action column frozen on the right (`th.fr`, label sr-only), no vertical scroll of its own, sideways scroll inside `.tw` (TB-01, TB-02, TB-04, TB-05).
7. **Row actions** `.acts`, at most three: `LinkButton` View, one text action (`Button type="transparent"`), and the `more_vert` icon button (`aria` "More actions") that opens the action menu (`.pop role=menu`, MN-01) with the rest (TB-09).
8. **Pagination** `Pagination` under the table: rows per page left, "Showing a–b of n" middle, pages right (TB-03, DS-11).
9. **States** inside the card instead of the table: `LoadingState` (lg) while loading; `ErrorState` + `RetryButton` on failure; `EmptyState` with the primary action when there is no record; `EmptyState` "No results" with a "Clear filters" button when the search or filters give nothing.
10. **Disclaimers** (only if the page has a standing note): `Disclaimers` card at the very bottom (DC-01).

Controls are size M (BT-05). The table row size is the user's table size (S / M / L). At 390px the toolbar wraps, the table scrolls sideways inside its card, the page never scrolls sideways (MB-03).

Stat cards: the `.stats` grid has five columns on a desktop; five cards fill it, fewer leave empty columns (that is the DS look, do not restyle the grid).
The View action: `LinkButton` to the detail page when the entity has one (`#/<entity>/<id>`, a `layout: 'detail'` route); when there is no detail page, `Button type="link"` that opens a details `Drawer`.

## Pattern: the table markup

```tsx
<div className="tb">
  <SearchBar fields={[['name', t('f.name')], ['id', t('f.id')]]} fv={field} q={q} id="q-orders" onField={setField} onQuery={setQ} onClear={() => setQ('')} />
  <Button label={t('tbl.adv')} count={nFilters} icon="filter_list" type="outlined" intent="neutral" onClick={openFilter} />
  <span className="sp"></span>
  <Button label={t('tbl.export')} icon="file_download" type="outlined" intent="neutral" onClick={exportRows} />
  <Button icon="view_column" type="outlined" intent="neutral" aria={t('tbl.colsT')} onClick={openCols} />
  {n ? <div className="bulk" role="region" aria-label={t('...')}><span>{fill(t('tbl.selected'), { n })}</span><span className="sp"></span>
    {/* bulk actions: Button type="transparent" */}
    <Button icon="close" type="transparent" intent="neutral" aria={t('tbl.clearSel')} onClick={clear} /></div> : null}
</div>
<div className={`tw t-${prefs.table}`}><table>
  <thead><tr><th className="ck"><input type="checkbox" aria-label={t('...')} /></th><th className="fl f2">{t('f.name')}</th>{/* columns */}<th className="fr"><span className="sr-only">{t('...')}</span></th></tr></thead>
  <tbody><tr><td className="ck"><input type="checkbox" aria-label={row.name} /></td><td className="fl f2"><div>{row.name}</div><div className="mut">{row.id}</div></td>{/* cells; numbers td.num */}
    <td className="fr"><div className="acts"><LinkButton label={t('tbl.view')} href={'#/orders/' + row.id} type="transparent" /><Button label={t('...')} type="transparent" /><Button icon="more_vert" type="transparent" intent="neutral" aria={t('tbl.more')} onClick={openMenu} /></div></td></tr></tbody>
</table></div>
<Pagination total start shown pages page rpp size="md" onPage={(v) => setPage(pgTarget(v, page, pages))} onRpp={setRpp} />
```

The bulk layer sits INSIDE `.tb` (it covers the toolbar while rows are selected). The checkbox column `.ck` is frozen at the left (48px) and the first data column is `.fl f2` (frozen at 48px, `.tw .fl.f2{left:48px}`); without a checkbox column use `.fl` alone.

## Pattern: the columns drawer

`Drawer size="sm"` titled "Show / hide columns": one checkbox per column (`label.chk`), the first and the action column ticked and disabled (they cannot be hidden), footer `Reset` (`transparent neutral`) then `Apply` (`fill`; never "Done", BT-02). The choice is stored per table with `loadCols` / `saveCols` (`src/lib/colPrefs.ts`, key `app.cols.<table>`).

## Rules

### TB-01
**Rule.** The right (action) column is right-aligned and frozen, the first column is frozen, and neither has a border
**Meet.** `<table>` inside `<div className={`tw t-${tsz}`}>`; checkbox column `th.ck`, first data column `th.fl f2` (`.fl` alone without a checkbox column), last `th.fr` with an sr-only label; body cells the same classes.
**Check.** Scroll the table sideways: first and action columns stay.
**Guarded in Praisindo by** a browser test.

### TB-02
**Rule.** The table has no vertical scroll of its own
**Meet.** Never give `.tw` a max-height or `overflow-y`.
**Check.** Audit; look at a long table.
**Guarded in Praisindo by** a browser test.

### TB-03
**Rule.** Pagination: rows per page on the left, the total label in the middle, navigation on the right
**Meet.** `<Pagination total start shown pages page rpp onPage onRpp />` under the table.
**Check.** Look at the pagination at 1440 and 390.
**Guarded in Praisindo by** a browser test.

### TB-04
**Rule.** Table cells have padding and clamp to two lines
**Meet.** Use the DS table classes; do not set cell padding or white-space by hand.
**Check.** Put a long text in a cell: two lines and an ellipsis.
**Guarded in Praisindo by** a unit test.

### TB-05
**Rule.** The table size (S / M / L) is a user preference that reaches the table classes (t-sm / t-md / t-lg)
**Meet.** Read the table size from `usePrefs().prefs.table` and put `t-${size}` on `.tw`.
**Check.** Change table size in My preferences.
**Guarded in Praisindo by** a unit test.

### TB-06
**Rule.** The table toolbar has the search combo and Advanced Filter
**Meet.** Toolbar `.tb` starts with `<SearchBar fields ... />` then `<Button label={t('tbl.adv')} type="outlined" intent="neutral" icon="filter_list" count={n} />`.
**Check.** Audit (TB-06 check).
**Guarded in Praisindo by** a browser test.

### TB-07
**Rule.** The Customers toolbar has Show / hide columns as its right-most control
**Meet.** The last control of `.tb` is `<Button icon="view_column" type="outlined" intent="neutral" aria={t('tbl.colsT')} />` opening the columns drawer.
**Check.** Look at the toolbar.
**Guarded in Praisindo by** a browser test.

### TB-08
**Rule.** Selecting a row shows the bulk-action bar on its own row above the toolbar (the search and the buttons stay visible under it; since 2026-11-09 it no longer covers the toolbar)
**Meet.** Selecting rows replaces nothing: render `.bulk role=region` with "{n} selected", the bulk actions (transparent) and a close icon "Clear selection".
**Check.** Tick a row.
**Guarded in Praisindo by** a browser test.

### TB-09
**Rule.** The action column holds at most three buttons (View, a second text action, the more icon)
**Meet.** `.acts`: `LinkButton` View, at most one text `Button` (transparent), the `more_vert` icon button opening a `.pop` menu for the rest.
**Check.** Audit (TB-09 check).
**Guarded in Praisindo by** a browser test.

### TB-10
**Rule.** A list page has summary stat cards above the table
**Meet.** `<StatCards items={...} />` between the page head and the table card.
**Check.** Audit (TB-10 check).
**Guarded in Praisindo by** a browser test.

### TB-11
**Rule.** Every main list table has Show / hide columns as its right-most toolbar control, reusing the same column drawer, and remembers the choice per table (`app.cols.<table>`): Customers, Opportunity Table, Activities, Signal rules (library and queue), Users, Audit log. Exceptions (no column control, reason): Customer 360 transaction mini-tables and the Design page demo tables are small embedded tables, not list pages; the Opportunity Kanban is a board
**Meet.** `loadCols('<table>', defaults)` / `saveCols(...)` from `src/lib/colPrefs.ts`; the columns drawer of the example page.
**Check.** Hide a column, reload, it stays hidden.
**Guarded in Praisindo by** a browser test.

### TB-12
**Rule.** Summary stat cards sit above every list table (same StatCard component). Exceptions: Opportunity (Kanban is the default view, spec 2026-10-21). Users and Audit log show cards from existing data only (users and roles; events, today and failed); no other list page is exempt
**Meet.** Same as TB-10; a page whose default view is a board may skip the cards (write `/* ds-allow: board view */`).
**Check.** Audit (TB-10 check).
**Guarded in Praisindo by** a browser test.

### TB-14
**Rule.** The columns given to the table library match the table: a table without an action column passes `hasA: false` (Customer 360 Transactions has 8 columns, and the default made column index 8 unsortable: "Requested unknown parameter '8'"); the library's error mode is `throw` so a mismatch never opens a browser dialog (the table renders without the library and the error goes to the console)
**Meet.** Pass the real column list to the table library; a table without action column says so (`hasA: false` in the DS adapter).
**Check.** Console has no table library warning.
**Guarded in Praisindo by** a unit test.

### TB-15
**Rule.** The header of a kit table is aligned: every title of a header cell has the same vertical centre (±1px) in its row and the sort icon is on the row of its title, never wrapped below it. Cause of the bug: the Signal rules table (`#ktbl-sr`) lets the header text wrap (`white-space:normal`, so that "Hits today" is not hidden under the frozen action column) while the sort icon is a separate 20px box after the title; in a narrow column (Version, 80px) the icon wrapped to a second line and lifted the title by 10px. The icon of a wrapping header takes no width in the line (it lies in the 20px right padding of its cell, next to the last word): `#ktbl-sr th{padding-right:20px}`, `#ktbl-sr th .dt-column-order{margin:0 -20px 0 0}`; every other kit table has `white-space:nowrap` headers and was not affected
**Meet.** Keep the DS header classes; do not let a header wrap under its sort icon (give the column a min width).
**Check.** Look at every header at 1440 and 390.
**Guarded in Praisindo by** a browser test.

### KB-02
**Rule.** Cards cannot be dragged (no draggable, no drag handlers, no move-to-stage action)
**Meet.** Use `KanbanBoard` / `KanbanCard`; no `draggable`.
**Check.** Try to drag a card.
**Guarded in Praisindo by** a unit test.

### KB-03
**Rule.** The whole card is the View action: no View button; the title is a real button covering the card; Take Action and More do not trigger it
**Meet.** `KanbanCard` with a `<button>` title (the card cover); other actions are separate buttons.
**Check.** Click the card, then the more button.
**Guarded in Praisindo by** a unit test.

### KB-06
**Rule.** Cards have no shadow and no drag cursor
**Meet.** Use `KanbanCard`; no shadow.
**Check.** Look at the board.
**Guarded in Praisindo by** a unit test.

### KB-13
**Rule.** In the Kanban view the board scrolls inside itself, both ways, and the header of every lane (the status Badge and the count) is sticky at the top of the board, so with many cards the stage is always visible; the Opportunity Kanban takes the room under it in the window (`fit`: `--kb-top` measured, `--kb-bot` 16px, 96px above the bottom bar of a phone; never shorter than 420px; `--kb-h` on an ancestor gives a fixed limit); the lanes are as tall as the tallest lane (grid, `grid-auto-rows:max-content`), the header carries its 12px so a card scrolling by never shows in a gap, and the board still scrolls sideways (owner decision 2026-11-03: "ux kanban pada opportunity kurang baik ketika isi card terlalu banyak")
**Meet.** `KanbanBoard fit`: the board scrolls inside, lane headers are sticky.
**Check.** Put 30 cards in a lane and scroll.
**Guarded in Praisindo by** a browser test.

### KB-14
**Rule.** The toolbar of the Kanban view (`.tb.tb-stk`: search, Advanced filter, Export) is sticky under the top of the window, under the top bar below 1100px, with the page background and no change of layout (8px padding, opposite margin); the toolbar of the table view is not sticky (owner decision 2026-11-03: "class tb ... dibuat sticky ketika scroll")
**Meet.** Toolbar of a board view: `.tb.tb-stk`.
**Check.** Scroll the page with the board.
**Guarded in Praisindo by** a browser test.

### DS-11
**Rule.** The "Rows per page" select of the pagination keeps room for its value on a phone: at least 80px wide (`.pgn .selw{flex:none;min-width:80px}`; it was 46px, 44px of padding). From 1024px (1280px included) the three groups of the pagination stay on ONE row and never wrap (`@media(min-width:1024px){.pgn,.pgn .rt{flex-wrap:nowrap}}`, 2.31)
**Meet.** Use `Pagination`; never resize its select.
**Check.** At 390px the rows-per-page value is whole; at 1280px the pagination is one row.
**Guarded in Praisindo by** a browser test.

### TB-17
**Rule.** A list page uses the List pattern: stat cards, ONE card with the toolbar (`SearchBar`, Advanced filter with the count of active filters, Show / hide columns as the right-most control; Export stays in the toolbar when the page exports), the table from the table kit with a frozen first and action column (at most three buttons), the standard `Pagination` (no private pager) and the standing notes in `Disclaimers` (DC-01). The filters are in the Advanced filter drawer and the search combo searches all fields or one of them; several views of one subject are `Tabs` in the card, not a jump rail (the jump rail is for long pages). Examples in the reference application: the Audit log and Users & Roles
**Meet.** A list page = stat cards, ONE card with the toolbar (`SearchBar`, Advanced filter with the count, Show / hide columns last), the kit table (frozen first and action column, at most three buttons), the standard `Pagination`, standing notes in `Disclaimers`. Filters go in the Advanced filter drawer. Several views of one subject are `Tabs` in the card (no jump rail). Copy `features/examples/ListPage.tsx`.
**Check.** Audit (TB-06, TB-03, TB-10); open the page: no private pager, no row of loose selects.
**Guarded in Praisindo by** a unit test and a browser test.

### TB-18
**Rule.** Tables of the table kit: a cell of `.tw th` and `.tw td` has 12px padding above and below whatever the table size (the table size still sets the font size); the frozen cells (`.fl`, `.fr`, `.ck`) have `z-index:1`, so nothing that scrolls sideways (a chip, a switch, a badge) paints over a frozen column; the tables of Products & rates sort by a click on a header (ascending, descending, back to the order of the source; `aria-sort`, keyboard Enter and Space) with the icons of the sortable tables of the kit
**Meet.** Use the table kit classes; never set table cell padding by hand. Frozen cells keep `z-index:1`.
**Check.** Measure a cell: 12px above and below at every table size.
**Guarded in Praisindo by** a browser test.

### TB-19
**Rule.** A link in a table (`a` and the link button `a.btn.b-link` inside `.tw`) has the neutral text colour, no underline and the weight of its cell; the title of an event in the Audit log is an `a` (`data-act="logd"`), not a button
**Meet.** A link in a table is `a` or `LinkButton` / `a.btn.b-link`; do not colour or underline it.
**Check.** Look at a table link: neutral colour, no underline.
**Guarded in Praisindo by** a browser test.

### TB-20
**Rule.** A long name in a table cell: the product cell of the product list is at most 320px wide (`.tcl`); a longer name is cut in the middle with an ellipsis and its last word stays visible (`.mid`, `.mid-s`, `.mid-e`), the full name is the title of the link. Written as classes of the table kit for the owner to confirm as a component (PR-04); the browser check is the test [TB-20] of tests/e2e/rules/products.spec.ts
**Meet.** A cell with a long name: wrap it in `.tcl` and the middle-cut classes (`.mid`, `.mid-s`, `.mid-e`) of the table kit; the full name is the title of the link.
**Check.** Give a row a very long name: it is cut in the middle, the last word stays visible.
**Guarded in Praisindo by** a browser test.

### TB-21
**Rule.** The tabs of a list page sit in a `.srtabs` wrapper inside the card body (Users & Roles, Signal rules, Marketing and the product tabs; Activities has no tabs since 2026-11-10: one list with every status, the status cards narrow it), 8px under them (owner decision 2026-11-10: the HTML of every list page has the same structure); the tabs of Key information in the product detail are segmented (`variant="seg"`)
**Meet.** Put the tabs of a list page in a `.srtabs` wrapper inside the card body, 8px above the toolbar; the same HTML structure on every list page.
**Check.** Compare the tab wrapper of two list pages: same structure and spacing.
**Guarded in Praisindo by** a browser test.

### TB-23
**Rule.** The line under the main text of a table cell (a code, an id, a date: `.mut`) is `--fs-xs` with 4px above it, as the direct `.mut` of a cell (TB rule of the other tables); a cell that holds a logo next to the text (`.tcl`, the Products & rates table) follows the same
**Meet.** The line under the main text of a cell (a code, an id, a date) is the direct `.mut` of the cell; do not set its size or spacing.
**Check.** Measure a cell: the `.mut` line is `--fs-xs` with 4px above it.
**Guarded in Praisindo by** a browser test.

### TB-27
**Rule.** The page buttons of the Pagination: only the arrows `chevron_left` and `chevron_right` (icons, no Previous or Next text and no first or last page icon buttons), the FIRST and the LAST page number are always shown, the current page with its two neighbours between them, an ellipsis where numbers are left out (a gap of one number shows that number, up to seven pages are all shown).
**Meet.** Use `Pagination`; its window comes from `pgItems`.
**Check.** With 20 pages: 1 … 9 10 11 … 20.
**Guarded in Praisindo by** a unit test.

### TB-28
**Rule.** The rows per page options of the Pagination are 5, 10 and 25: the field reads `10 /page` (the `suf` of FM-16) but the list that opens under it shows only the numbers `5`, `10`, `25`; the current page keeps the DS soft brand style.
**Meet.** Use `Pagination`; do not add text to the options of its list.
**Check.** Open the rows per page list: only numbers.
**Guarded in Praisindo by** a unit test.
