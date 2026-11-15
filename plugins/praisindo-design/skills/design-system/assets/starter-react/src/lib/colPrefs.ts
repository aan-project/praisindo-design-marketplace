// Show / hide columns: the choice is remembered per table under app.cols.<table> (rule TB-11). Unknown or non-boolean stored values are ignored, so a stale
// entry can never hide a column that did not exist when it was saved.
import { readJSON, writeJSON } from './reactStorage';

export type ColState = Record<string, boolean>;
export function loadCols<T extends ColState>(table: string, defaults: T): T {
  const raw = readJSON<unknown>('cols.' + table, null);
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return defaults;
  const out: ColState = { ...defaults };
  for (const k of Object.keys(defaults)) { const v = (raw as Record<string, unknown>)[k]; if (typeof v === 'boolean') out[k] = v; }
  return out as T;
}
export function saveCols(table: string, cols: ColState): void { writeJSON('cols.' + table, cols); }
