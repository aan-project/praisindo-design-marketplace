// Controlled text input whose value is reformatted on every change while the caret stays after the same meaningful character
// (the prototype's ffCaret / formatInput). The format function is pure (src/domain/forms/formatters.ts).
import { useLayoutEffect, useRef, useState, type ChangeEvent } from 'react';

export function useCaretInput<X extends { value: string; caret: number }>(initial: string, format: (raw: string, pos: number | null) => X) {
  const ref = useRef<HTMLInputElement>(null);
  const caret = useRef<number | null>(null);
  const [value, setValue] = useState(initial);
  const [, bump] = useState(0); // re-render even when the formatted value equals the old one, so the caret is placed again
  useLayoutEffect(() => {
    const el = ref.current, p = caret.current;
    if (el && p != null) {
      caret.current = null;
      try { el.setSelectionRange(p, p); } catch { /* input type without selection support */ }
    }
  });
  const apply = (raw: string, pos: number | null): X => {
    const r = format(raw, pos);
    caret.current = r.caret;
    setValue(r.value);
    bump((n) => n + 1);
    return r;
  };
  /** Apply an already formatted result (used when the formatter's own inputs changed, e.g. a new country dial code). */
  const commit = (r: X) => { caret.current = r.caret; setValue(r.value); bump((n) => n + 1); };
  const onChange = (e: ChangeEvent<HTMLInputElement>): X => apply(e.target.value, e.target.selectionStart);
  return { ref, value, apply, commit, onChange };
}
