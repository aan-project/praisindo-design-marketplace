// The one function every create, update, delete, approve, reject, publish, export and sign-in calls (rule GN-01): logActivity({ category, action, targetType, targetId, note }).
// The history is kept per account in the browser and holds business values only (NT-07): never a password, token or personal identifier. Replace the storage with the product's API when it has one: the signature stays.
import { readJSON, writeJSON } from './reactStorage.js';
import { session } from './session.js';
import { activityCategory } from './activity.config.js';

const KEY = 'activity', MAX = 500;
const load = () => { const v = readJSON(KEY, []); return Array.isArray(v) ? v : []; };
const pad = (n) => String(n).padStart(2, '0');
const now = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
export const accountOf = () => String(session.email || '').toLowerCase() || 'anonymous';

/** Records one event for the signed-in account. Returns it, or null when the category is not in activity.config.js. */
export function logActivity({ category, action, targetType = '', targetId = '', note = '' }) {
  if (!activityCategory(category)) return null;
  const L = load(), ts = now(), e = { id: 'ACT-' + ts.replace(/\D/g, '') + '-' + String(L.length + 1).padStart(4, '0'), ts, account: accountOf(), category, action, targetType, targetId, note };
  writeJSON(KEY, [...L, e].slice(-MAX));   // false when the browser refuses: the event is not kept
  return e;
}
/** The events of the signed-in account, newest first (rule OR-01). */
export const myEvents = () => load().filter((e) => e.account === accountOf()).reverse();
