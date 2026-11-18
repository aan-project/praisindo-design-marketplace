// The layout of a stepper form, chosen on the page itself and remembered per page under app.layout.<page> (rule DK-24): 'h' the numbered Wizard along the top of the content, one step at a time, Back and Next;
// 'v' the whole form as one page with the vertical Wizard as the rail on the right and no Back and Next. The page gives the layout it starts with (`def`). A change reaches every part of the page at once.
import { useSyncExternalStore } from 'react';
import { readJSON, writeJSON } from './reactStorage';

export type FormLayout = 'h' | 'v';
const listeners = new Set<() => void>();
const subscribe = (f: () => void) => { listeners.add(f); return () => { listeners.delete(f); }; };
export const loadLayout = (page: string, def: FormLayout = 'h'): FormLayout => { const v = readJSON<unknown>('layout.' + page, null); return v === 'v' || v === 'h' ? v : def; };
export function saveLayout(page: string, v: FormLayout): void { writeJSON('layout.' + page, v); listeners.forEach((f) => f()); }
export function useFormLayout(page: string, def: FormLayout = 'h'): [FormLayout, (v: FormLayout) => void] {
  const v = useSyncExternalStore(subscribe, () => loadLayout(page, def), () => def);
  return [v, (x) => saveLayout(page, x)];
}
