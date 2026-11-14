/** Prototype dfmt()/loc(): dd Mon yyyy in UTC; locale en-GB for English, id-ID for Indonesian. */
export const localeOf = (lang: string): string => (lang === 'id' ? 'id-ID' : 'en-GB');
export const dfmt = (iso: string, lang: string): string =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString(localeOf(lang), { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
export const pad2 = (n: number): string => String(n).padStart(2, '0');
/** HH:MM of the device clock (24 h). */
export const nowHM = (d: Date = new Date()): string => pad2(d.getHours()) + ':' + pad2(d.getMinutes());
