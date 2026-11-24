// Port of the prototype's toast(): one toast at a time, a new toast replaces the old one and restarts the 2400 ms timer.
// Markup and classes match toastView(): <div class="toast t-{intent}" role="alert|status">.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

export type ToastIntent = 'success' | 'danger' | 'warning' | 'info' | (string & {});
export const TOAST_MS = 2400;
interface ToastApi { toast: (msg: string, intent?: ToastIntent) => void }
const Ctx = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [cur, setCur] = useState<{ msg: string; intent: ToastIntent } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const toast = useCallback((msg: string, intent: ToastIntent = 'success') => {
    setCur({ msg, intent });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCur(null), TOAST_MS);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  const api = useMemo(() => ({ toast }), [toast]);
  return (
    <Ctx.Provider value={api}>
      {children}
      {cur && <div className={`toast t-${cur.intent || 'success'}`} role={cur.intent === 'danger' ? 'alert' : 'status'}>{cur.msg}</div>}
    </Ctx.Provider>
  );
}

/** The toast of the page when there is one; null where the page is drawn without the provider (the static markup of the Design page in the golden tests). */
export function useToastOptional(): ToastApi | null { return useContext(Ctx); }

export function useToast(): ToastApi {
  const v = useContext(Ctx);
  if (!v) throw new Error('useToast must be used inside <ToastProvider>');
  return v;
}
