// Pure port of the prototype's form behaviour (ffDig, ffG4, formatInput/fmtNum, ffLuhn, pwScore, stepper, OTP, tags, files).
// No DOM, no React. Parity evidence: baseline/golden/form-behaviour.json (captured from the frozen oracle by driving real DOM events).

export const ffDig = (v: unknown): string => String(v || '').replace(/\D/g, '');

export function fmtNum(v: unknown): string {
  const s0 = String(v == null ? '' : v);
  const neg = /^\s*-/.test(s0);
  const s = s0.replace(/[^\d.]/g, '');
  const i = s.indexOf('.');
  let ip = i < 0 ? s : s.slice(0, i);
  const fp = i < 0 ? '' : s.slice(i + 1).replace(/\./g, '');
  ip = ip.replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (neg ? '-' : '') + (i < 0 ? ip : ip + '.' + fp);
}

/** Caret position in `out` after `before` meaningful characters (isD marks the meaningful ones). */
export function caretAfter(out: string, before: number, isD: (c: string) => boolean): number {
  let n = 0, p = 0;
  while (p < out.length && n < before) { if (isD(out[p]!)) n++; p++; }
  return p;
}

export interface Formatted { value: string; caret: number; digits: string }

/** data-fmt="g4" / "phone". `pos` = selectionStart (null → end). `dial` = country dial code, only for phone. */
export function formatGrouped(raw: string, pos: number | null, o: { max: number; dial?: string }): Formatted {
  const max = o.max || 16;
  const p = pos == null ? raw.length : pos;
  const before = ffDig(raw.slice(0, p)).length;
  let d = ffDig(raw);
  if (o.dial !== undefined) {
    if (d.startsWith(o.dial) && d.length > o.dial.length + 6) d = d.slice(o.dial.length);
    d = d.replace(/^0+/, '');
  }
  d = d.slice(0, max);
  const value = d.replace(/(\d{4})(?=\d)/g, '$1 ');
  return { value, caret: caretAfter(value, Math.min(before, d.length), (c) => /\d/.test(c)), digits: d };
}

/** The colour field (rule FM-18): a hex colour typed with or without the pound sign; the pound is added by itself, anything that is not a hex digit is dropped, at most six digits. `007bff`, `#007bff`, ` 007BFF ` all give a value that starts with `#`. */
export function colorInput(raw: string): string {
  const d = raw.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
  return d ? '#' + d : '';
}

/** data-fmt="num" (MoneyInput). */
export function formatMoney(raw: string, pos: number | null): { value: string; caret: number } {
  const p = pos == null ? raw.length : pos;
  const before = raw.slice(0, p).replace(/[^\d.]/g, '').length;
  const value = fmtNum(raw);
  return { value, caret: caretAfter(value, before, (c) => /[\d.]/.test(c)) };
}

export const luhn = (d: string): boolean => {
  let s = 0, a = false;
  for (let i = d.length - 1; i >= 0; i--) { let n = +d[i]!; if (a) { n *= 2; if (n > 9) n -= 9; } s += n; a = !a; }
  return s % 10 === 0;
};

export type GroupedError = { key: 'ff.digErr'; n: number } | { key: 'ff.cardErr' } | null;
/** focusout validation of a g4 field. */
export function validateGrouped(raw: string, o: { max: number; kind?: string }): GroupedError {
  const d = ffDig(raw), n = o.max || 16;
  if (d && d.length < n) return { key: 'ff.digErr', n };
  if (d && o.kind === 'card' && !luhn(d)) return { key: 'ff.cardErr' };
  return null;
}
/** While typing: an existing error is cleared once the field is complete or empty. */
export const clearsGroupedError = (digits: string, max: number): boolean => digits.length === (max || 16) || !digits.length;

export function pwScore(v: string): number {
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
  if (/\d/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v) || v.length >= 12) s++;
  return v ? Math.max(1, s) : 0;
}

export const intField = (v: string): string => ffDig(v).slice(0, 6);

export function stepperStep(o: { value: string; min: number; max: number; step: number; dir: 1 | -1 }): { value: number; decDisabled: boolean; incDisabled: boolean } {
  const st = +o.step || 1;
  const v = Math.max(o.min, Math.min(o.max, (Number(ffDig(o.value)) || 0) + st * o.dir));
  return { value: v, decDisabled: v <= o.min, incDisabled: v >= o.max };
}

// ---------- OTP ----------
export interface OtpResult { values: string[]; focus: number | null }
export function otpFill(values: readonly string[], digits: string, from = 0): OtpResult {
  const v = [...values];
  digits.split('').slice(0, v.length - from).forEach((c, i) => { v[from + i] = c; });
  return { values: v, focus: Math.min(v.length - 1, from + digits.length) };
}
/** input event on cell i with the cell's new raw value. */
export function otpInput(values: readonly string[], i: number, raw: string): OtpResult {
  const d = ffDig(raw);
  if (d.length > 1) return otpFill(values, d, i);
  const v = [...values];
  v[i] = d;
  return { values: v, focus: d && i + 1 < v.length ? i + 1 : null };
}
export interface OtpKey { prevented: boolean; values: string[]; focus: number | null }
export function otpKey(values: readonly string[], i: number, e: { key: string; ctrlKey?: boolean; metaKey?: boolean }): OtpKey {
  const v = [...values];
  if (e.key === 'Backspace' && !v[i] && i > 0) { v[i - 1] = ''; return { prevented: true, values: v, focus: i - 1 }; }
  if (e.key === 'ArrowLeft' && i > 0) return { prevented: true, values: v, focus: i - 1 };
  if (e.key === 'ArrowRight' && i < v.length - 1) return { prevented: true, values: v, focus: i + 1 };
  if (e.key.length === 1 && !/\d/.test(e.key) && !e.ctrlKey && !e.metaKey) return { prevented: true, values: v, focus: null };
  return { prevented: false, values: v, focus: null };
}
export const otpPaste = (values: readonly string[], i: number, text: string): OtpResult => otpFill(values, ffDig(text), i);
export function otpState(values: readonly string[]): { done: boolean; code: string; n: number } {
  const code = values.join('');
  const done = code.length === values.length;
  return { done, code: done ? code : '', n: values.length };
}

// ---------- tags ----------
/** Enter / comma. Empty input after trim → nothing happens and the input text is left as is. */
export function tagAdd(list: readonly string[], raw: string): { list: string[]; input: string } {
  const v = raw.replace(/,/g, '').trim();
  if (!v) return { list: [...list], input: raw };
  return { list: list.includes(v) ? [...list] : [...list, v], input: '' };
}
export const tagRemove = (list: readonly string[], v: string): string[] => list.filter((x) => x !== v);
export const isTagCommitKey = (key: string): boolean => key === 'Enter' || key === ',';

// ---------- files ----------
/** Does a file match an `accept` list (`.pdf,.jpg,image/*,application/pdf`)? An empty list accepts everything (rule UP-04). */
export function fileTypeOk(f: { name: string; type?: string }, accept: string | undefined): boolean {
  const list = (accept ?? '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
  if (!list.length) return true;
  const n = f.name.toLowerCase(), t = (f.type ?? '').toLowerCase();
  return list.some((a) => (a.startsWith('.') ? n.endsWith(a) : a.endsWith('/*') ? t.startsWith(a.slice(0, -1)) : t === a));
}
/** The check of the files of an upload: `bad` are the ones over the size (as the prototype), `wrongType` the ones whose type is not in `accept` (a file over the size is listed once, under `bad`). */
export function fileCheck(files: readonly { name: string; size: number; type?: string }[], maxMb: number | undefined, accept?: string): { accepted: { name: string; kb: string }[]; bad: string[]; wrongType: string[] } {
  const max = (+(maxMb ?? 0) || 5) * 1048576;
  const accepted: { name: string; kb: string }[] = [];
  const bad: string[] = [], wrongType: string[] = [];
  for (const f of files) {
    if (f.size > max) { bad.push(f.name); continue; }
    if (!fileTypeOk(f, accept)) { wrongType.push(f.name); continue; }
    accepted.push({ name: f.name, kb: (f.size / 1024).toFixed(0) });
  }
  return { accepted, bad, wrongType };
}
