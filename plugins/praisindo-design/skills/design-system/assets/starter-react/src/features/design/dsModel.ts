// Pure rules of the Design System page behaviour (prototype dsLogHit; the hero thresholds of rule DS-15). No DOM here, so they can be tested directly.

/** Search words: trimmed, lower-cased, split on whitespace. */
export const dsTerms = (q: string): string[] => String(q || '').trim().toLowerCase().split(/\s+/).filter(Boolean);

/** Change-log row = [version, en, id]. Every word must be in the version ("1.2" or "v1.2") or the English text (as in the prototype). */
export const dsLogHit = (row: readonly string[], q: string): boolean => {
  const terms = dsTerms(q);
  const tx = (row[0] + ' v' + row[0] + ' ' + row[1]).toLowerCase();
  return !terms.length || terms.every((w) => tx.includes(w));
};

/** Scroll-spy: index of the current section from the viewport tops of the sections; at the page bottom it is the last one. */
export function dsSpyPick(tops: readonly number[], atBottom: boolean): number {
  if (!tops.length) return -1;
  if (atBottom) return tops.length - 1;
  let cur = 0;
  tops.forEach((t, i) => { if (t - 140 <= 0) cur = i; });
  return cur;
}

export const DS_SHOW_TOP_AT = 600;
export const DS_LOCK_MS = 900;
export const DS_HERO_ROOM = 76;
/** Small hero: it shows after this many px scrolled up in a row and hides after this many px down (rule DS-15). */
export const DS_HERO_UP = 48;
export const DS_HERO_DOWN = 8;
