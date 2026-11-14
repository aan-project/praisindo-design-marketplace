// Port of Pagination() (golden: ui-kit.nav.json). Table state stays with the caller (M6): it passes the numbers and handles onPage / onRpp.
import { fill } from '../../i18n/fill';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { pgWindow, type PgTarget } from '../../domain/nav';
import { Button } from './Button';
import { Select } from './Controls';

export interface PaginationProps {
  /** total rows, index of the first row on the page (0-based), rows on this page, page count, current page, rows per page */
  total: number; start: number; shown: number; pages: number; page: number; rpp: number; size: string;
  onPage?: (v: PgTarget) => void; onRpp?: (n: number) => void;
}
const RPP = [[5, '5'], [10, '10'], [25, '25']] as const;

export function Pagination({ total, start, shown, pages, page, rpp, size, onPage, onRpp }: PaginationProps) {
  const { t } = usePrefs();
  const info = total ? fill(t('tbl.showing'), { a: start + 1, b: start + shown, n: total }) : t('tbl.none');
  const pg = (icon: string, v: PgTarget, dis: boolean) => <Button icon={icon} type="transparent" intent="neutral" size={size} disabled={dis} aria={String(v)} onClick={() => onPage?.(v)} />;
  return (
    <div className="pgn">
      <div className="lf"><span className="mut">{t('tbl.rpp')}</span>
        <Select opts={RPP} val={rpp} size={size} aria={t('tbl.rpp')} onChange={onRpp ? (v) => onRpp(Number(v)) : undefined} /></div>
      <div className="ctr mut">{info}</div>
      <div className="rt">
        {pg('first_page', 'first', page === 1)}{pg('chevron_left', 'prev', page === 1)}
        {pgWindow(page, pages).map((i) => <Button key={i} label={String(i)} type={i === page ? 'soft' : 'transparent'} intent={i === page ? 'brand' : 'neutral'} size={size} onClick={() => onPage?.(i)} />)}
        {pg('chevron_right', 'next', page === pages)}{pg('last_page', 'last', page === pages)}
      </div>
    </div>
  );
}
