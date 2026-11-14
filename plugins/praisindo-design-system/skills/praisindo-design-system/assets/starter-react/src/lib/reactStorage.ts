// The ONLY module allowed to touch Web Storage: every other file reads and writes through it (one namespace, JSON, try/catch).
const NS = 'app.';   // change to your own namespace

type Area = 'local' | 'session';
const area = (a: Area): Storage | null => {
  try { return a === 'local' ? window.localStorage : window.sessionStorage; } catch { return null; }
};

/** Builds a namespaced key. `name` must be a plain suffix such as `prefs`; anything that already looks namespaced is rejected. */
export function reactKey(name: string): string {
  if (!/^[a-z][a-z0-9_.-]*$/i.test(name) || /^app\./.test(name)) throw new Error(`invalid storage key suffix: ${name}`);
  return NS + name;
}

export function readJSON<T>(name: string, fallback: T, where: Area = 'local'): T {
  const s = area(where);
  if (!s) return fallback;
  try {
    const raw = s.getItem(reactKey(name));
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch { return fallback; }
}

export function writeJSON(name: string, value: unknown, where: Area = 'local'): boolean {
  const s = area(where);
  if (!s) return false;
  try { s.setItem(reactKey(name), JSON.stringify(value)); return true; } catch { return false; }
}

export function removeKey(name: string, where: Area = 'local'): void {
  const s = area(where);
  if (!s) return;
  try { s.removeItem(reactKey(name)); } catch { /* storage unavailable: nothing to remove */ }
}

/** Raw string read (no JSON parsing) for callers that must tell "absent" from "corrupt" apart, e.g. the stored role. */
export function readRaw(name: string, where: Area = 'local'): string | null {
  const s = area(where);
  if (!s) return null;
  try { return s.getItem(reactKey(name)); } catch { return null; }
}
