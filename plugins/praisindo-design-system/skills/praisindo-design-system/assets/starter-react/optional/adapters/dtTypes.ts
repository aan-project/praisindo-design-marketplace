// Structural types for the table library. The real implementation (dtLib.ts) wraps jQuery + DataTables 2.1.8; tests inject fakes.
export type SortDir = 'asc' | 'desc';

/** Options the prototype's initDT() passes to DataTables, in library-neutral form. */
export interface DtInit {
  /** Column index to sort by (already offset by the selection column) and the direction. */
  orderIdx: number;
  orderDir: SortDir;
  pageLength: number;
  /** Row offset of the first visible row: (page - 1) * pageLength. */
  displayStart: number;
  /** Column indexes whose header must not sort (select and action columns). */
  unsortable: number[];
}

export interface DtHandle {
  /** Current sort as [columnIndex, direction], or null when the table has none. */
  order(): [number, SortDir] | null;
  /** Subscribes to the library's `order.dt` event; returns an unsubscribe function. */
  onOrder(cb: () => void): () => void;
  /** Rows in the library's applied (search + sort) order. */
  appliedRows(): Element[];
  /** Restores the original table (all rows back in the DOM) and detaches the library. */
  destroy(): void;
}

export interface DtLib { create(table: HTMLTableElement, init: DtInit): DtHandle }
