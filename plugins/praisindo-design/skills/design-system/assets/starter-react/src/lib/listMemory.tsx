// A list page remembers what the person set on it (rule LS-01, owner 2026-11-18): the tab, the filters, the search, the sort and the page stay while the person opens a detail or an action from the list and comes back with Back.
// The memory lives in the application (a Map in the provider, not in the page that unmounts) and starts fresh after a reload. Give the provider `who` (the signed-in person and role) so that it also starts fresh when they change.
// Without the provider (a test that mounts one page) `useRemembered` is a plain `useState`. A seed queued by another page (a shortcut that opens a list filtered) is laid over what was remembered.
import { createContext, useContext, useEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';

const Ctx = createContext<Map<string, unknown> | null>(null);

export function ListMemoryProvider({ who = '', children }: { who?: string; children: ReactNode }) {
  const ref = useRef<{ who: string; m: Map<string, unknown> }>({ who, m: new Map() });
  if (ref.current.who !== who) ref.current = { who, m: new Map() };   // another person, or another role: the lists start fresh
  return <Ctx.Provider value={ref.current.m}>{children}</Ctx.Provider>;
}

/** Like `useState`, but the value survives the page: `key` names the list page. `init` is the state of a first visit; `seed` returns a partial state queued by another page. */
export function useRemembered<T extends object>(key: string, init: () => T, seed?: () => Partial<T> | null): [T, Dispatch<SetStateAction<T>>] {
  const m = useContext(Ctx);
  const [v, setV] = useState<T>(() => (m && m.has(key) ? { ...(m.get(key) as T), ...(seed?.() ?? {}) } : init()));
  useEffect(() => { m?.set(key, v); }, [m, key, v]);
  return [v, setV];
}

/** The same for one plain value (a tab, a search text): `useRememberedValue('ex-list-q', '')`. */
export function useRememberedValue<V>(key: string, init: V | (() => V)): [V, (v: V | ((o: V) => V)) => void] {
  const [o, set] = useRemembered<{ v: V }>(key, () => ({ v: typeof init === 'function' ? (init as () => V)() : init }));
  return [o.v, (n) => set((s) => ({ v: typeof n === 'function' ? (n as (o: V) => V)(s.v) : n }))];
}
