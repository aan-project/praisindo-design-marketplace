// Port of Pagination() (golden: ui-kit.nav.json). Table state stays with the caller (M6): it passes the numbers and handles onPage / onRpp.
import { fill } from '../../i18n/fill';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { pgItems, type PgTarget } from '../../domain/nav';
import { Button } from './Button';
import { Select } from './Controls';

export interface PaginationProps {
  /** total rows, index of the first row on the page (0-based), rows on this page, page count, current page, rows per page */
  total: number; start: number; shown: number; pages: number; page: number; rpp: number; size: string;
  onPage?: (v: PgTarget) => void; onRpp?: (n: number) => void;
}
const RPP = [5, 10, 25] as const;

/** The pagination (rule TB-03, TB-27): on the left the rows per page, as a Select with the suffix `/page` after the value (`10 /page`, the variant `suf` of FM-16), with the count next to it; on the right the previous and next arrows (icons only) around the page numbers,
 *  the first and the last page always shown with an ellipsis between them and the pages near the current one. */
export function Pagination({ total, start, shown, pages, page, rpp, size, onPage, onRpp }: PaginationProps) {
  const { t } = usePrefs();
  const info = total ? fill(t('tbl.showing'), { a: start + 1, b: start + shown, n: total }) : t('tbl.none');
  const pg = (icon: string, v: PgTarget, dis: boolean) => <Button icon={icon} type="transparent" intent="neutral" size={size} disabled={dis} aria={String(v)} onClick={() => onPage?.(v)} />;
  return (
    <div className="pgn">
      <div className="lf">
        <Select opts={RPP.map((n) => [n, String(n)] as const)} suf={t('tbl.perPage')} val={rpp} size={size} aria={t('tbl.rpp')} onChange={onRpp ? (v) => onRpp(Number(v)) : undefined} />
        <span className="ctr mut">{info}</span>
      </div>
      <div className="rt">
        {pg('chevron_left', 'prev', page === 1)}
        {pgItems(page, pages).map((i, k) => (i === 'gap' ? <span key={'g' + k} className="pgn-gap" aria-hidden="true">…</span>
          : <Button key={i} label={String(i)} type={i === page ? 'soft' : 'transparent'} intent={i === page ? 'brand' : 'neutral'} size={size} onClick={() => onPage?.(i)} />))}
        {pg('chevron_right', 'next', page === pages)}
      </div>
    </div>
  );
}
