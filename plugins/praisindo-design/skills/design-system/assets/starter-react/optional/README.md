# optional/

Not part of `src/`, so they are not compiled until you move them in.

- `adapters/brandHttp.ts` — the real Branding adapter for a server (contract in `references/branding.md`). Swap it in `PrefsProvider.tsx`; the localStorage adapter is temporary and must be called out on the Branding page.
- `adapters/ApexChart.tsx`, `chartBase.ts`, `chartTypes.ts`, `apexLoader.ts` — chart adapter for ApexCharts 3.54 (`npm i apexcharts`), colours read from the tokens. Needed only when a page draws charts.
- `adapters/useDataTable.ts`, `dtLib.ts`, `dtTypes.ts`, `lifecycle.ts` — DataTables 2.1 adapter for list tables (`npm i datatables.net`). Needed only for sortable/paged tables; plain tables use the `.tw > table` markup.
