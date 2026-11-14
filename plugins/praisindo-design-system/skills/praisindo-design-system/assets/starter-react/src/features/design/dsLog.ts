// The change log shown on the Design page ("What's new"): docs/design-system/changelog.md, newest first, one line per change: `- **2.86** (2026-11-13) Text.`
// The skill seeds it with the version of the design system it was built from. When the design system is updated in this project, add a line; never edit old lines.
import changelog from '../../../docs/design-system/changelog.md?raw';

type Row = readonly [string, string, string];
const own: Row[] = changelog.split('\n').flatMap((l) => {
  const m = /^- \*\*([\d.]+)\*\* \((\d{4}-\d{2}-\d{2})\) (.+)$/.exec(l);
  return m ? [[m[1]!, m[3]!, m[3]!] as Row] : [];
});
const first = /^- \*\*([\d.]+)\*\* \((\d{4}-\d{2}-\d{2})\)/m.exec(changelog);

/** Version strings compare number by number (1.10 is newer than 1.9). */
export const cmpVersion = (a: string, b: string): number => { const x = a.split('.').map(Number), y = b.split('.').map(Number); for (let i = 0; i < Math.max(x.length, y.length); i++) { const d = (x[i] ?? 0) - (y[i] ?? 0); if (d) return d; } return 0; };
/** The one entry the "What's new" guide shows: the highest version of the whole log (not the first line of a file). */
export const latestEntry = (log: readonly Row[]): Row | undefined => log.reduce<Row | undefined>((m, r) => (!m || cmpVersion(r[0], m[0]) > 0 ? r : m), undefined);

export const DS_LIVE = {
  version: first?.[1] ?? '2.88',
  updated: first?.[2] ?? '2026-11-13',
  log: own as readonly Row[],
};
