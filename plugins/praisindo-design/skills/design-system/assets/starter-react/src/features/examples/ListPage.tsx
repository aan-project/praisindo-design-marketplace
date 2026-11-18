// REFERENCE EXAMPLE (not a product page): the list page pattern of references/rules-tabel.md. Copy the structure, replace the data, columns and texts.
// Rules met: LS-01 (the list remembers its search, filters and page), NV-02, NV-03 (page head), BT-01, BN-01 (one primary action), TB-10, TB-12 (stat cards), TB-06 (search combo + Advanced filter), TB-07, TB-11 (Show / hide columns
// right-most, stored per table), TB-08 (bulk layer), TB-01, TB-02, TB-04, TB-05 (frozen first and action columns, table size), TB-09 (View + one text action + more),
// MN-01, MN-02 (action menu), TB-03, DS-11 (pagination), BT-04 (icon buttons named), BT-05 (size md), CH-07 (count in the button), BD-01..BD-03, BD-13 (status Badge
// from the central map), ES-01 + states (loading, error with Retry, empty, no result), DR-05 (danger dialog), DC-01 (Disclaimers), CD-08 (no Alert on open), MB-03, DS-03.
// States can be previewed with #/ex-list/loading, #/ex-list/error and #/ex-list/empty.
import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { useRememberedValue } from '../../lib/listMemory';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { useToast } from '../../app/providers/ToastProvider';
import { PageHeader } from '../../app/shell/PageHead';
import { Badge } from '../../design-system/components/Badge';
import { Button, LinkButton } from '../../design-system/components/Button';
import { Disclaimers, Card } from '../../design-system/components/Card';
import { SearchBar, Select } from '../../design-system/components/Controls';
import { Drawer } from '../../design-system/components/Drawer';
import { Dialog } from '../../design-system/components/Modal';
import { Pagination } from '../../design-system/components/Pagination';
import { EmptyState, ErrorState, LoadingState, RetryButton } from '../../design-system/components/States';
import { StatCards } from '../../design-system/components/Widgets';
import { badgeProps } from '../../domain/badgeIcons';
import { pgTarget } from '../../domain/nav';
import { logActivity } from '../../domain/log/activityLog';
import { fill } from '../../i18n/fill';
import { localeOf } from '../../lib/dateFormat';
import { loadCols, saveCols } from '../../lib/colPrefs';
import { ColumnsDrawer } from './parts/ColumnsDrawer';
import { menuPos, ActionMenu, type MenuPos } from './parts/ActionMenu';
import { SUPPLIERS, type Supplier } from './exampleData';

type Status = 'loading' | 'error' | 'ok';
const COLS = { city: true, cat: true, limit: true, terms: false, status: true };
type ColKey = keyof typeof COLS;
const COL_LABEL: Record<ColKey, string> = { city: 'ex.f.city', cat: 'ex.f.cat', limit: 'ex.f.limit', terms: 'ex.f.terms', status: 'ex.f.status' };
const MENU = [{ k: 'edit', icon: 'edit', labelKey: 'ex.edit' }, { k: 'dup', icon: 'content_copy', labelKey: 'ex.dup' }, { k: 'del', icon: 'delete_outline', labelKey: 'ex.del', danger: true }] as const;

export function ListPage({ preview }: { preview?: string }) {
  const { t, prefs } = usePrefs(), { toast } = useToast();
  const tsz = (['sm', 'md', 'lg'] as string[]).includes(prefs.table) ? prefs.table : 'md';
  const [status, setStatus] = useState<Status>('loading');
  const rowsAll: readonly Supplier[] = preview === 'empty' ? [] : SUPPLIERS;
  const load = (fail: boolean) => { setStatus('loading'); const id = setTimeout(() => setStatus(fail ? 'error' : 'ok'), 400); return () => clearTimeout(id); };
  useEffect(() => { if (preview !== 'loading') return load(preview === 'error'); setStatus('loading'); return undefined; }, [preview]);

  // LS-01: the list remembers the field, the search, the stat card (the tab of the list), the status filter, the page and the rows per page: Back from a supplier returns to the same list
  const [field, setField] = useRememberedValue('exl-field', 'name'), [q, setQ] = useRememberedValue('exl-q', ''), [stat, setStat] = useRememberedValue('exl-stat', 'all'), [fStatus, setFStatus] = useRememberedValue('exl-fstatus', '');
  const [page, setPage] = useRememberedValue('exl-page', 1), [rpp, setRpp] = useRememberedValue('exl-rpp', 10), [sel, setSel] = useState<ReadonlySet<string>>(new Set());
  const [cols, setCols] = useState(() => loadCols('ex-suppliers', COLS));
  const [panel, setPanel] = useState<'' | 'filter' | 'cols'>(''), [menu, setMenu] = useState<MenuPos | null>(null), [del, setDel] = useState<string | null>(null);
  const allRef = useRef<HTMLInputElement>(null);

  const money = useMemo(() => new Intl.NumberFormat(localeOf(prefs.lang), { maximumFractionDigits: 0 }), [prefs.lang]);
  const ql = q.trim().toLowerCase();
  const rows = rowsAll.filter((s) => (stat === 'all' || s.status === stat) && (!fStatus || s.status === fStatus)
    && (!ql || String(field === 'id' ? s.id : field === 'city' ? s.city : s.name).toLowerCase().includes(ql)));
  const pages = Math.max(1, Math.ceil(rows.length / rpp)), pg = Math.min(page, pages), start = (pg - 1) * rpp, shown = rows.slice(start, start + rpp);
  const fc = fStatus ? 1 : 0, ns = sel.size, allOn = rows.length > 0 && rows.every((s) => sel.has(s.id));
  useEffect(() => { if (allRef.current) allRef.current.indeterminate = ns > 0 && !allOn; });
  const setCol = (k: string, on: boolean) => { const n = { ...cols, [k]: on }; setCols(n); saveCols('ex-suppliers', n); };
  const count = (st: string) => rowsAll.filter((s) => s.status === st).length, pct = (n: number) => (rowsAll.length ? Math.round((n / rowsAll.length) * 100) : 0);
  const stats = [
    { k: 'all', on: stat === 'all', icon: 'storefront', intent: 'brand', label: t('ex.st.all'), n: rowsAll.length, pct: 100 },
    { k: 'active', on: stat === 'active', icon: 'check_circle', intent: 'success', label: t('ex.s.active'), n: count('active'), pct: pct(count('active')) },
    { k: 'pending', on: stat === 'pending', icon: 'schedule', intent: 'warning', label: t('ex.s.pending'), n: count('pending'), pct: pct(count('pending')) },
    { k: 'inactive', on: stat === 'inactive', icon: 'block', intent: 'neutral', label: t('ex.s.inactive'), n: count('inactive'), pct: pct(count('inactive')) },
  ];
  const fields = [['name', t('ex.f.name')], ['id', t('ex.f.code')], ['city', t('ex.f.city')]] as const;
  const clearAll = () => { setQ(''); setStat('all'); setFStatus(''); setPage(1); };
  const pick = (k: string, id: string) => { setMenu(null); if (k === 'del') setDel(id); else { logActivity({ category: 'update', action: t('act.' + k), targetType: t('act.supplier'), targetId: id }); toast(fill(t('ex.done.' + k), { id })); } };

  const bulk = ns ? (
    <div className="bulk" role="region" aria-label={t('ex.bulk')}><span>{fill(t('tbl.selected'), { n: ns })}</span><span className="sp"></span>
      <Button label={t('tbl.export')} icon="file_download" type="transparent" onClick={() => toast(fill(t('ex.exported'), { n: ns }))} />
      <Button label={t('ex.deactivate')} icon="block" type="transparent" intent="danger" onClick={() => setDel('*')} />
      <Button icon="close" type="transparent" intent="neutral" aria={t('tbl.clearSel')} onClick={() => setSel(new Set())} />
    </div>) : null;
  const toolbar = (
    <div className="tb">
      <SearchBar fields={fields} fv={field} q={q} id="exq" onField={setField} onQuery={(v) => { setQ(v); setPage(1); }} onClear={() => setQ('')} />
      <Button label={t('tbl.adv')} count={fc} icon="filter_list" type="outlined" intent="neutral" onClick={() => setPanel('filter')} />
      <span className="sp"></span>
      <Button label={t('tbl.export')} icon="file_download" type="outlined" intent="neutral" onClick={() => toast(fill(t('ex.exported'), { n: rows.length }))} />
      <Button icon="view_column" type="outlined" intent="neutral" aria={t('tbl.colsT')} onClick={() => setPanel('cols')} />
      {bulk}
    </div>);
  const visible = (Object.keys(COLS) as ColKey[]).filter((k) => cols[k]);
  const cell = (s: Supplier, k: ColKey) => {
    if (k === 'status') return <td key={k}><Badge label={t('ex.s.' + s.status)} {...badgeProps('status', s.status)} /></td>;
    if (k === 'limit') return <td key={k} className="num">{money.format(s.limit)}</td>;
    if (k === 'terms') return <td key={k} className="num">{fill(t('ex.days'), { n: s.terms })}</td>;
    if (k === 'cat') return <td key={k}>{t('ex.cat.' + s.cat)}</td>;
    return <td key={k}>{s.city}</td>;
  };

  let body;
  if (status === 'loading') body = <LoadingState size="lg" />;
  else if (status === 'error') body = <ErrorState title={t('ex.errT')} desc={t('ex.errD')} cta={<RetryButton onClick={() => load(false)} />} />;
  else if (!rowsAll.length) body = <EmptyState size="lg" icon="storefront" title={t('ex.emptyT')} desc={t('ex.emptyD')} cta={<LinkButton label={t('ex.add')} icon="add" href="#/ex-form" />} />;
  else if (!rows.length) body = <>{toolbar}<EmptyState size="lg" icon="search_off" title={t('ex.noResT')} desc={t('ex.noResD')} cta={<Button label={t('ex.clearF')} type="outlined" intent="neutral" onClick={clearAll} />} /></>;
  else body = (
    <>
      {toolbar}
      <div className={`tw t-${tsz}`}>
        <table>
          <thead><tr>
            <th className="ck"><input ref={allRef} type="checkbox" checked={allOn} aria-label={t('ex.selAll')} onChange={(e) => setSel(new Set(e.target.checked ? rows.map((s) => s.id) : []))} /></th>
            <th className="fl f2">{t('ex.f.name')}</th>
            {visible.map((k) => <th key={k} className={k === 'limit' || k === 'terms' ? 'num' : ''}>{t(COL_LABEL[k])}</th>)}
            <th className="fr"><span className="sr-only">{t('ex.actions')}</span></th>
          </tr></thead>
          <tbody>
            {shown.map((s) => (
              <tr key={s.id}>
                <td className="ck"><input type="checkbox" checked={sel.has(s.id)} aria-label={s.name} onChange={(e) => { const n = new Set(sel); if (e.target.checked) n.add(s.id); else n.delete(s.id); setSel(n); }} /></td>
                <td className="fl f2"><div>{s.name}</div><div className="mut">{s.id}</div></td>
                {visible.map((k) => cell(s, k))}
                <td className="fr"><div className="acts">
                  <LinkButton label={t('tbl.view')} href={'#/ex-detail/' + s.id} type="transparent" size={tsz} />
                  <Button label={t('ex.order')} type="transparent" size={tsz} onClick={() => toast(fill(t('ex.done.order'), { id: s.id }))} />
                  <Button icon="more_vert" type="transparent" intent="neutral" size={tsz} aria={t('tbl.more')} onClick={(e: MouseEvent<HTMLButtonElement>) => setMenu(menuPos(s.id, e.currentTarget, MENU.length))} />
                </div></td>
              </tr>))}
          </tbody>
        </table>
      </div>
      <Pagination total={rows.length} start={start} shown={shown.length} pages={pages} page={pg} rpp={rpp} size="md"
        onPage={(v) => setPage(pgTarget(v, pg, pages))} onRpp={(n) => { setRpp(n); setPage(1); }} />
    </>);

  return (
    <>
      <PageHeader crumbs={[['#/home', t('nav.home')], ['#/ex-list', t('ex.list.t')]]} title={t('ex.list.t')} sub={t('ex.list.sub')}
        actions={<LinkButton label={t('ex.add')} icon="add" href="#/ex-form" />} />
      {status === 'ok' && rowsAll.length ? <StatCards items={stats} onStat={(k) => { setStat(k); setPage(1); }} /> : null}
      <Card body={body} />
      <Disclaimers items={[t('ex.list.note')]} />
      {panel === 'cols' ? <ColumnsDrawer first={t('ex.f.name')} last={t('ex.actions')} cols={(Object.keys(COLS) as ColKey[]).map((k) => ({ k, label: t(COL_LABEL[k]) }))}
        state={cols} onToggle={setCol} onReset={() => { setCols(COLS); saveCols('ex-suppliers', COLS); }} onClose={() => setPanel('')} /> : null}
      {panel === 'filter' ? (
        <Drawer title={t('tbl.adv')} size="sm" closeLabel={t('ex.close')} onClose={() => setPanel('')}
          footer={<><Button label={t('tbl.reset')} type="transparent" intent="neutral" onClick={() => setFStatus('')} /><Button label={t('tbl.apply')} onClick={() => { setPage(1); setPanel(''); }} /></>}>
          <div className="fld"><label>{t('ex.f.status')}</label>
            <Select opts={[['', t('ex.any')], ['active', t('ex.s.active')], ['pending', t('ex.s.pending')], ['inactive', t('ex.s.inactive')], ['new', t('ex.s.new')]]} val={fStatus} aria={t('ex.f.status')} onChange={setFStatus} /></div>
        </Drawer>) : null}
      {menu ? <ActionMenu pos={menu} items={MENU} onPick={pick} onClose={() => setMenu(null)} /> : null}
      {del ? <Dialog kind="danger" title={t(del === '*' ? 'ex.deact.t' : 'ex.del.t')} text={t(del === '*' ? 'ex.deact.d' : 'ex.del.d')}
        ok={{ label: t(del === '*' ? 'ex.deactivate' : 'ex.del'), onClick: () => { logActivity({ category: 'delete', action: t('act.delete'), targetType: t('act.supplier'), targetId: del === '*' ? String(sel.size) + ' ×' : String(del) }); setDel(null); setSel(new Set()); toast(t('ex.done.del')); } }}
        cancel={{ label: t('md.cancel'), onClick: () => setDel(null) }} onClose={() => setDel(null)} /> : null}
    </>);
}
