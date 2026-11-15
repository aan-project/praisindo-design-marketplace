// The one function every create, update, delete, approve, reject, publish, export and sign-in calls (rule GN-01): `logActivity`. The history is kept per account in the browser (reactStorage) and holds business values only (NT-07):
// never a password, token or personal identifier. Replace the storage with the product's API when it has one: the signature stays.
import { useSyncExternalStore } from 'react';
import { readJSON, writeJSON } from '../../lib/reactStorage';
import { useSession } from '../../app/session';
import { activityCategory } from './activity.config';

export interface ActivityEvent { id: string; ts: string; account: string; category: string; action: string; targetType: string; targetId: string; note: string }
export type ActivityInput = { category: string; action: string; targetType?: string; targetId?: string; note?: string };
const KEY = 'activity', MAX = 500;
let cache: readonly ActivityEvent[] | null = null;
const subs = new Set<() => void>();
const load = (): readonly ActivityEvent[] => (cache ??= (() => { const v = readJSON<unknown>(KEY, []); return Array.isArray(v) ? v.filter((e): e is ActivityEvent => !!e && typeof e === 'object' && typeof (e as ActivityEvent).id === 'string') : []; })());
const pad = (n: number) => String(n).padStart(2, '0');
const now = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
/** The account of the signed-in user (the email of the session). */
export const accountOf = (email: string): string => email.toLowerCase();

/** Records one event for `account` (default: the signed-in user). Returns it, or null when the category is not in `activity.config`. */
export function logActivity(x: ActivityInput, account: string = currentAccount()): ActivityEvent | null {
  if (!activityCategory(x.category)) return null;
  const L = load(), ts = now();
  const e: ActivityEvent = { id: 'ACT-' + ts.replace(/\D/g, '') + '-' + String(L.length + 1).padStart(4, '0'), ts, account, category: x.category, action: x.action, targetType: x.targetType ?? '', targetId: x.targetId ?? '', note: x.note ?? '' };
  cache = [...L, e].slice(-MAX); writeJSON(KEY, cache); subs.forEach((f) => f());
  return e;
}
let account = '';
/** The shell tells the module who is signed in (AppShell calls it when the session changes); the pages just call `logActivity`. */
export function setActivityAccount(email: string): void { account = accountOf(email); }
const currentAccount = (): string => account || 'anonymous';

/** The events of an account, newest first. */
export const eventsOf = (acc: string): ActivityEvent[] => load().filter((e) => e.account === acc).slice().reverse();
/** A React hook: the events of the signed-in account, newest first; it re-renders when one is added. */
export function useActivity(): ActivityEvent[] {
  const { sess } = useSession(), acc = accountOf(sess.email);
  const snap = useSyncExternalStore((f) => { subs.add(f); return () => { subs.delete(f); }; }, load);
  return snap.filter((e) => e.account === acc).slice().reverse();
}
