/** Prototype fill(): replaces {key} placeholders; unknown keys become ''. */
export const fill = (s: string, v: Record<string, string | number>): string => s.replace(/\{(\w+)\}/g, (_, k: string) => String(v[k] ?? ''));
