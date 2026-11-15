// Pure logic of the prototype's form popovers (country list filter, calendar, multi-select). No DOM, no React.
// Parity evidence: baseline/golden/form-popovers.json (real DOM events on the frozen oracle) replayed through the components.
import { TODAY } from '../time.ts';
import { localeOf } from '../../lib/dateFormat.ts';

/** ffFilter(): case-insensitive, trimmed substring match against the item's lower-case haystack. */
export const matchesQuery = (q: string, hay: string): boolean => { const s = q.trim().toLowerCase(); return !s || hay.includes(s); };
export const ccHay = (name: string, code: string, dial: string): string => (name + ' ' + code + ' +' + dial).toLowerCase();

// ---------- calendar ----------
const isoOf = (d: Date): string => d.toISOString().slice(0, 10);
export const dpAdd = (iso: string, n: number): string => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return isoOf(d); };

/** Working state while the calendar is open: pending from/to and the visible month (YYYY-MM). */
export interface DpState { tf: string; tt: string; vm: string }
export const dpOpen = (from: string, to: string): DpState => ({ tf: from, tt: to, vm: (from || TODAY).slice(0, 7) });
export function dpNav(vm: string, dir: number): string {
  const d = new Date(vm + '-01T00:00:00Z');
  d.setUTCMonth(d.getUTCMonth() + dir);
  return isoOf(d).slice(0, 7);
}
/** Day click. Single mode commits at once; range mode: first click starts, a click before the start swaps, otherwise it ends. */
export function dpDay(mode: 'single' | 'range', st: DpState, d: string): { st: DpState; commit: { from: string; to: string } | null } {
  if (mode !== 'range') return { st, commit: { from: d, to: '' } };
  let { tf, tt } = st;
  if (!tf || tt) { tf = d; tt = ''; } else if (d < tf) { tt = tf; tf = d; } else tt = d;
  return { st: { ...st, tf, tt }, commit: null };
}
export type DpPreset = 'today' | '7' | '30' | 'month';
export const DP_PRESETS: readonly DpPreset[] = ['today', '7', '30', 'month'];
export function dpPreset(k: string): DpState {
  const fr = k === 'today' ? TODAY : k === 'month' ? TODAY.slice(0, 8) + '01' : dpAdd(TODAY, -(Number(k) - 1));
  return { tf: fr, tt: TODAY, vm: fr.slice(0, 7) };
}

export interface CalendarGrid { title: string; weekdays: string[]; lead: number; days: number }
export function calendarGrid(vm: string, lang: string): CalendarGrid {
  const loc = localeOf(lang);
  const Y = +vm.slice(0, 4), M = +vm.slice(5, 7) - 1;
  const first = new Date(Date.UTC(Y, M, 1));
  return {
    title: first.toLocaleDateString(loc, { month: 'long', year: 'numeric', timeZone: 'UTC' }),
    weekdays: [...Array(7)].map((_, i) => new Date(Date.UTC(2024, 0, 1 + i)).toLocaleDateString(loc, { weekday: 'short', timeZone: 'UTC' }).replace('.', '')),
    lead: (first.getUTCDay() + 6) % 7,
    days: new Date(Date.UTC(Y, M + 1, 0)).getUTCDate(),
  };
}
export function dayFlags(iso: string, mode: 'single' | 'range', tf: string, tt: string) {
  const sel = iso === tf || iso === tt;
  return {
    sel,
    inr: mode === 'range' && !!tf && !!tt && iso > tf && iso < tt,
    tdy: iso === TODAY,
    rs: mode === 'range' && iso === tf && !!tt,
    re: mode === 'range' && iso === tt && !!tf,
  };
}

// ---------- multi-select ----------
export const msToggle = (list: readonly string[], v: string): string[] => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
export const msAll = (list: readonly string[], visible: readonly string[]): string[] => { const out = [...list]; for (const v of visible) if (!out.includes(v)) out.push(v); return out; };
