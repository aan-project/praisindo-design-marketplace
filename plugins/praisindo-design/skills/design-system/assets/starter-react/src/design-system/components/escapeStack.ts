// Escape handling for overlays. The prototype closes the modal first (before any drawer); among equals the newest overlay wins.
import { useEffect, useRef } from 'react';

interface Entry { id: number; priority: number; close: () => void }
const stack: Entry[] = [];
let seq = 0, bound = false;

function onKey(e: KeyboardEvent) {
  if (e.key !== 'Escape' || !stack.length) return;
  let top = stack[0]!;
  for (const x of stack) if (x.priority > top.priority || (x.priority === top.priority && x.id > top.id)) top = x;
  top.close();
}

export function useEscapeClose(close: () => void, priority: number) {
  const ref = useRef(close); ref.current = close;
  useEffect(() => {
    const e: Entry = { id: ++seq, priority, close: () => ref.current() };
    stack.push(e);
    if (!bound) { document.addEventListener('keydown', onKey); bound = true; }
    return () => {
      stack.splice(stack.indexOf(e), 1);
      if (!stack.length) { document.removeEventListener('keydown', onKey); bound = false; }
    };
  }, [priority]);
}
