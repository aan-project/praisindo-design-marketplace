// The real table library: jQuery 3.7.1 + DataTables 2.1.8 from npm. jQuery is imported only here and is never put on `window`.
// Options are exactly the prototype's initDT(): paging on; searching, info, length menu and every layout slot off.
import jQuery from 'jquery';
import DataTable from 'datatables.net';
import type { DtHandle, DtInit, DtLib, SortDir } from './dtTypes.ts';

/* eslint-disable @typescript-eslint/no-explicit-any */
const $ = jQuery as unknown as any;

function ready(): boolean {
  if ($.fn && $.fn.DataTable) return true;
  try { (DataTable as unknown as (w: Window, j: unknown) => unknown)(window, $); } catch { /* factory form not applicable */ }
  return !!($.fn && $.fn.DataTable);
}

function make(table: HTMLTableElement, init: DtInit): DtHandle {
  // The library's default error mode is alert(): a column mismatch would pop a browser dialog in front of the user. 'throw' sends the error to the caller (useDataTable: onFail, the table renders without the library, console) (rule TB-14).
  $.fn.dataTable.ext.errMode = 'throw';
  const $t = $(table);
  const api = $t.DataTable({
    paging: true, pageLength: init.pageLength, displayStart: init.displayStart, searching: false, info: false, lengthChange: false, autoWidth: false,
    order: [[init.orderIdx, init.orderDir]],
    columnDefs: [{ orderable: false, targets: init.unsortable }],
    layout: { topStart: null, topEnd: null, bottomStart: null, bottomEnd: null },
  });
  return {
    order() { const x = api.order()[0]; return x ? [x[0] as number, x[1] as SortDir] : null; },
    onOrder(cb) { $t.on('order.dt', cb); return () => { $t.off('order.dt', cb); }; },
    appliedRows() { return Array.from(api.rows({ search: 'applied', order: 'applied' }).nodes() as ArrayLike<Element>); },
    destroy() { api.destroy(false); },
  };
}

/** null when the library could not be initialised: the prototype's `hasDT()` is false and tables render without it. */
export const defaultDtLib: DtLib | null = ready() ? { create: make } : null;
