// REFERENCE EXAMPLE (not a product page): the dialog, drawer and menu patterns of references/rules-dialog.md.
// Rules met: DR-02 (the six Dialog kinds and the third action `alt`), DR-05, DR-06 (confirmations are centred dialogs, never a drawer or window.confirm), DR-01, DR-03
// (drawer sizes, a drawer opened from a drawer has Back), DR-04 (DrawerTabs), MB-04 (full screen on a phone), MN-01, MN-02 (action menu), BT-01, BT-04, BN-01, CD-02, DS-03.
import { useState, type MouseEvent } from 'react';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { useToast } from '../../app/providers/ToastProvider';
import { PageHeader } from '../../app/shell/PageHead';
import { Button } from '../../design-system/components/Button';
import { Card, DetailRow } from '../../design-system/components/Card';
import { Drawer } from '../../design-system/components/Drawer';
import { Dialog } from '../../design-system/components/Modal';
import { DrawerTabs } from '../../design-system/components/Tabs';
import { fill } from '../../i18n/fill';
import { menuPos, ActionMenu, type MenuPos } from './parts/ActionMenu';

const KINDS = ['success', 'info', 'progress', 'warning', 'danger', 'confirm'] as const;
const MENU = [{ k: 'edit', icon: 'edit', labelKey: 'ex.edit' }, { k: 'dup', icon: 'content_copy', labelKey: 'ex.dup' }, { k: 'del', icon: 'delete_outline', labelKey: 'ex.del', danger: true }] as const;

export function DialogsPage() {
  const { t } = usePrefs(), { toast } = useToast();
  const [dlg, setDlg] = useState<string | null>(null), [drw, setDrw] = useState<'' | 'one' | 'two'>(''), [dtab, setDtab] = useState('a'), [menu, setMenu] = useState<MenuPos | null>(null);
  const close = () => setDlg(null);
  const done = (k: string) => { close(); toast(fill(t('ex.dlg.done'), { k: t('ex.dlg.' + k) })); };
  const dialog = (k: string) => {
    if (k === 'leave') return <Dialog kind="warning" title={t('ex.leave.t')} text={t('ex.leave.d')} ok={{ label: t('ex.leave.ok'), onClick: () => done('leave') }}
      alt={{ label: t('ex.leave.draft'), onClick: () => done('leave') }} cancel={{ label: t('ex.leave.stay'), onClick: close }} onClose={close} />;
    return <Dialog kind={k} title={t('ex.dlg.t.' + k)} text={t('ex.dlg.d.' + k)} ok={{ onClick: () => done(k) }} cancel={['warning', 'danger', 'confirm'].includes(k) ? { label: t('md.cancel'), onClick: close } : undefined} onClose={close} />;
  };

  return (
    <>
      <PageHeader crumbs={[['#/home', t('nav.home')], ['#/ex-dialogs', t('ex.dlg.title')]]} title={t('ex.dlg.title')} sub={t('ex.dlg.sub')} />
      <Card title={t('ex.dlg.kinds')} body={<><p className="mut">{t('ex.dlg.kindsD')}</p>
        <div className="rw">{KINDS.map((k) => <Button key={k} label={t('ex.dlg.' + k)} type="outlined" intent="neutral" onClick={() => setDlg(k)} />)}</div></>} />
      <Card title={t('ex.dlg.third')} body={<><p className="mut">{t('ex.dlg.thirdD')}</p><div className="rw"><Button label={t('ex.dlg.leave')} icon="logout" type="outlined" intent="neutral" onClick={() => setDlg('leave')} /></div></>} />
      <Card title={t('ex.dlg.drawer')} body={<><p className="mut">{t('ex.dlg.drawerD')}</p><div className="rw"><Button label={t('ex.dlg.open')} icon="open_in_new" type="outlined" intent="neutral" onClick={() => setDrw('one')} /></div></>} />
      <Card title={t('ex.dlg.menu')} body={<><p className="mut">{t('ex.dlg.menuD')}</p>
        <div className="rw"><Button icon="more_vert" type="outlined" intent="neutral" aria={t('tbl.more')} onClick={(e: MouseEvent<HTMLButtonElement>) => setMenu(menuPos('demo', e.currentTarget, MENU.length))} /></div></>} />
      {dlg ? dialog(dlg) : null}
      {drw === 'one' ? (
        <Drawer title={t('ex.dlg.d1')} size="sm" closeLabel={t('ex.close')} onClose={() => setDrw('')}
          footer={<><Button label={t('md.cancel')} type="transparent" intent="neutral" onClick={() => setDrw('')} /><Button label={t('tbl.apply')} onClick={() => setDrw('')} /></>}>
          <DrawerTabs items={[['a', t('ex.tab.ov')], ['b', t('ex.tab.log')]]} active={dtab} onChange={setDtab} />
          {dtab === 'a' ? <DetailRow label={t('ex.f.status')}>{t('ex.s.active')}</DetailRow> : <p className="mut">{t('ex.dlg.d1log')}</p>}
          <Button label={t('ex.dlg.next')} iconRight="chevron_right" type="link" onClick={() => setDrw('two')} />
        </Drawer>) : null}
      {drw === 'two' ? (
        <Drawer title={t('ex.dlg.d2')} size="sm" back={t('ex.back')} closeLabel={t('ex.close')} onBack={() => setDrw('one')} onClose={() => setDrw('')}>
          <p className="mut">{t('ex.dlg.d2d')}</p>
        </Drawer>) : null}
      {menu ? <ActionMenu pos={menu} items={MENU} onPick={(k) => { setMenu(null); if (k === 'del') setDlg('danger'); else toast(fill(t('ex.done.' + k), { id: 'demo' })); }} onClose={() => setMenu(null)} /> : null}
    </>);
}
