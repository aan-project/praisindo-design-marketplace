// Derives the notifications on every render from the records the product holds (rule NT-03) and keeps the read state per account (NT-04). Replace `ntBuild` with the product's data; the kinds are in `notifications.config.ts`.
import { readJSON, writeJSON } from '../../lib/reactStorage';
import { SUPPLIERS } from '../../features/examples/exampleData';
import { NT_KINDS } from './notifications.config';

export interface Notif { id: string; kind: string; cat: string; args: Record<string, number | string>; /** days ago (0 = today) */ age: number }
export const NT_POP_MAX = 5, NT_READ_KEY = 'notifread', NT_READ_MAX = 200;

/** The notifications of an account: only the kinds its audience receives, newest first. */
export function ntBuild(admin: boolean): Notif[] {
  const pending = SUPPLIERS.filter((s) => s.status === 'pending').length, fresh = SUPPLIERS.filter((s) => s.status === 'new').length;
  const raw: Notif[] = [];
  if (pending) raw.push({ id: 'pending:' + pending, kind: 'pending', cat: 'work', args: { n: pending }, age: 0 });
  if (fresh) raw.push({ id: 'new:' + fresh, kind: 'new', cat: 'work', args: { n: fresh }, age: 1 });
  raw.push({ id: 'synced', kind: 'synced', cat: 'data', args: {}, age: 2 }, { id: 'maintenance', kind: 'maintenance', cat: 'system', args: {}, age: 3 });
  return raw.filter((n) => { const k = NT_KINDS.find((x) => x.kind === n.kind); return !!k && (k.audience === 'all' || admin); }).sort((a, b) => a.age - b.age);
}

type Store = Record<string, string[]>;
const clean = (v: unknown): Store => { const o: Store = {}; if (!v || typeof v !== 'object' || Array.isArray(v)) return o; for (const [k, x] of Object.entries(v as Record<string, unknown>)) if (Array.isArray(x)) o[k] = x.filter((i): i is string => typeof i === 'string').slice(-NT_READ_MAX); return o; };
export const ntLoadRead = (account: string): string[] => clean(readJSON<unknown>(NT_READ_KEY, {}))[account] ?? [];
/** Saves the read ids of one account; ids no longer in `keep` are dropped. False when the browser refused. */
export function ntSaveRead(account: string, ids: readonly string[], keep?: readonly string[]): boolean {
  const all = clean(readJSON<unknown>(NT_READ_KEY, {})), k = keep ? new Set(keep) : null;
  all[account] = [...new Set(ids)].filter((i) => !k || k.has(i)).slice(-NT_READ_MAX);
  return writeJSON(NT_READ_KEY, all);
}
/** "9+" above nine, nothing at zero. */
export const ntBadge = (n: number): string => (n <= 0 ? '' : n > 9 ? '9+' : String(n));
