/** Prototype initials(): first letters of the first two words, upper case; '?' when empty. */
export const initials = (n: string | null | undefined): string => String(n || '?').split(' ').filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
/** Prototype pAddD(): ISO date plus n days (UTC). */
export const addDays = (d: string, n: number): string => { const x = new Date(d + 'T00:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
