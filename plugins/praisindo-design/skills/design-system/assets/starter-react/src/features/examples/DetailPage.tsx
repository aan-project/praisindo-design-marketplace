// REFERENCE EXAMPLE (not a product page): the detail page pattern of references/rules-kartu.md. Route with layout 'detail' (the sidebar collapses on entry, SB-05, SB-30).
// Rules met: NV-01, BK-01 (Back only on a detail page, to the previous screen), NV-02, NV-03 (page head), DT-05 (DetailLayout, DetailPanel, DetailSummary), DT-17 (a supplier is an organisation, so the page has the layout of Customer 360: the entity panel on the left, the tabs in the centre, a summary card on the right: `third`), CU-02 (the side
// panel scrolls with the page), CD-06 (DR rows), CD-02, CD-09 (cards, no card in a card), NV-11, NV-12, CH-06 (Tabs with counts), BD-01..BD-03, BD-13 (status Badge),
// DR-01, DR-03 (details drawer, a second drawer with Back), MN-01, MN-02 (action menu), OR-01 (log newest first), BT-01, BT-04, ES-01 (empty state), DS-03.
import { useState, type MouseEvent, type ReactNode } from 'react';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { useToast } from '../../app/providers/ToastProvider';
import { PageHeader } from '../../app/shell/PageHead';
import { Badge } from '../../design-system/components/Badge';
import { Button, LinkButton } from '../../design-system/components/Button';
import { Card, DetailRow } from '../../design-system/components/Card';
import { DetailLayout, DetailPanel, DetailSummary } from '../../design-system/components/DetailLayout';
import { DetailItem } from '../../design-system/components/DetailList';
import { Drawer } from '../../design-system/components/Drawer';
import { Icon } from '../../design-system/components/Icon';
import { EmptyState } from '../../design-system/components/States';
import { Tabs } from '../../design-system/components/Tabs';
import { badgeProps } from '../../domain/badgeIcons';
import { fill } from '../../i18n/fill';
import { UserName } from '../shared/UserName';
import { dfmt, localeOf } from '../../lib/dateFormat';
import { menuPos, ActionMenu, type MenuPos } from './parts/ActionMenu';
import { supplierById, supplierLog } from './exampleData';

const MENU = [{ k: 'edit', icon: 'edit', labelKey: 'ex.edit' }, { k: 'dup', icon: 'content_copy', labelKey: 'ex.dup' }, { k: 'del', icon: 'delete_outline', labelKey: 'ex.del', danger: true }] as const;

export function DetailPage({ id }: { id?: string }) {
  const { t, prefs } = usePrefs(), { toast } = useToast();
  const s = supplierById(id);
  const [tab, setTab] = useState('ov'), [drawer, setDrawer] = useState<'' | 'details' | 'contact'>(''), [menu, setMenu] = useState<MenuPos | null>(null);
  const back = () => { if (history.length > 1) history.back(); else location.hash = '#/ex-list'; };
  const crumbs = [['#/home', t('nav.home')], ['#/ex-list', t('ex.list.t')]] as [string, string][];
  if (!s) return (
    <>
      <PageHeader crumbs={crumbs} title={t('ex.det.missT')} sub={t('ex.det.missD')} onBack={back} backLabel={t('ex.back')} />
      <Card title={t('ex.det.missT')} body={<EmptyState size="md" icon="search_off" title={t('ex.det.missT')} desc={t('ex.det.missD')} cta={<LinkButton label={t('ex.toList')} type="outlined" intent="neutral" href="#/ex-list" />} />} />
    </>);
  const money = new Intl.NumberFormat(localeOf(prefs.lang), { maximumFractionDigits: 0 });
  const log = supplierLog(s);
  const st = <Badge label={t('ex.s.' + s.status)} {...badgeProps('status', s.status)} />;
  const rows = (
    <>
      <DetailRow label={t('ex.f.code')}>{s.id}</DetailRow>
      <DetailRow label={t('ex.f.cat')}>{t('ex.cat.' + s.cat)}</DetailRow>
      <DetailRow label={t('ex.f.city')}>{s.city}</DetailRow>
      <DetailRow label={t('ex.f.phone')}>+62 {s.phone}</DetailRow>
      <DetailRow label={t('ex.f.since')}>{dfmt(s.since, prefs.lang)}</DetailRow>
    </>);
  const pick = (k: string) => { setMenu(null); toast(fill(t('ex.done.' + k), { id: s.id })); };

  return (
    <>
      <PageHeader crumbs={[...crumbs, ['#/ex-detail/' + s.id, s.name]]} title={s.name} sub={t('ex.det.sub')} onBack={back} backLabel={t('ex.back')}
        actions={<><Button label={t('ex.edit')} icon="edit" type="outlined" intent="neutral" onClick={() => toast(fill(t('ex.done.edit'), { id: s.id }))} />
          <Button icon="more_vert" type="outlined" intent="neutral" aria={t('tbl.more')} onClick={(e: MouseEvent<HTMLButtonElement>) => setMenu(menuPos(s.id, e.currentTarget, MENU.length))} /></>} />
      <DetailLayout third={<Card title={t('ex.tab.log')} flush body={<>{log.slice(0, 3).map((e) => <div className="li" key={e.at}><div className="m"><span>{t(e.key)}</span><span className="mut">{e.at}</span></div></div>)}</>} />} panel={<DetailPanel label={t('ex.det.panel')}
        head={<div className="c3id"><div className="c3av"><Icon name="storefront" /></div><h2>{s.name}</h2><span className="c3sub">{s.id} · {s.city}</span></div>}
        body={<><DetailItem label={t('ex.f.cat')}>{t('ex.cat.' + s.cat)}</DetailItem><DetailItem label={t('ex.f.phone')}>+62 {s.phone}</DetailItem><DetailItem label={t('ex.f.since')}>{dfmt(s.since, prefs.lang)}</DetailItem></>} note={t('ex.det.note')} />}>
        <DetailSummary label={t('ex.det.sum')} icon="payments" intent="brand" kicker={t('ex.f.limit')} title={'Rp' + money.format(s.limit)} badges={st}
          cta={<Button label={t('ex.det.view')} icon="open_in_new" type="outlined" intent="neutral" onClick={() => setDrawer('details')} />}
          facts={<><DetailItem label={t('ex.f.terms')}>{fill(t('ex.days'), { n: s.terms })}</DetailItem><DetailItem label={t('ex.f.city')}>{s.city}</DetailItem><DetailItem label={t('ex.f.owner')}><UserName name="Sam Rivera" /></DetailItem></>} />
        <div className="c3tabs"><Tabs items={[['ov', t('ex.tab.ov')], ['orders', t('ex.tab.orders'), 0], ['log', t('ex.tab.log'), log.length]]} active={tab} onChange={setTab} /></div>
        {tab === 'ov' ? <Card title={t('ex.tab.ov')} body={<>{rows}</>} /> : null}
        {tab === 'orders' ? <Card title={t('ex.tab.orders')} body={<EmptyState size="md" icon="receipt_long" title={t('ex.det.noOrdT')} desc={t('ex.det.noOrdD')} cta={<Button label={t('ex.order')} icon="add" onClick={() => toast(fill(t('ex.done.order'), { id: s.id }))} />} />} /> : null}
        {tab === 'log' ? <Card title={t('ex.tab.log')} flush body={<>{log.map((e) => <div className="li" key={e.at}><div className="m"><span>{t(e.key)}</span><span className="mut">{e.at} · <UserName name="Maya Putri" /></span></div></div>)}</>} /> : null}
      </DetailLayout>
      {drawer === 'details' ? (
        <Drawer title={t('ex.det.view')} size="md" closeLabel={t('ex.close')} onClose={() => setDrawer('')}
          footer={<Button label={t('ex.close')} type="transparent" intent="neutral" onClick={() => setDrawer('')} />}>
          {rows}
          <DetailRow label={t('ex.f.limit')}>Rp{money.format(s.limit)}</DetailRow>
          <Button label={t('ex.det.contact')} icon="person_outline" iconRight="chevron_right" type="link" onClick={() => setDrawer('contact')} />
        </Drawer>) : null}
      {drawer === 'contact' ? (
        <Drawer title={t('ex.det.contact')} size="md" back={t('ex.back')} closeLabel={t('ex.close')} onBack={() => setDrawer('details')} onClose={() => setDrawer('')}>
          <DetailRow label={t('ex.f.phone')}>+62 {s.phone}</DetailRow>
          <DetailRow label={t('ex.f.email')}>{t('ex.det.noEmail')}</DetailRow>
        </Drawer>) : null}
      {menu ? <ActionMenu pos={menu} items={MENU} onPick={pick} onClose={() => setMenu(null)} /> : null}
    </>);
}
