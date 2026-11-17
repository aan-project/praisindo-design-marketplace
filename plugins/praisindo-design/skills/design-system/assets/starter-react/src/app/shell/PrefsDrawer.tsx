// My Preferences (rules PP-04, PP-01): an info note, Font size, Table size and, last, the link to the panel items (a second drawer, with Back). No Language (the switch is in the sidebar) and no Sidebar
// setting (the sidebar is automatic, SB-04..SB-07, SB-30). Stored locally per user; they never change the brand (BR-07).
import { useState } from 'react';
import { Alert } from '../../design-system/components/Alert';
import { Button } from '../../design-system/components/Button';
import { Drawer } from '../../design-system/components/Drawer';
import { Icon } from '../../design-system/components/Icon';
import { IconTile } from '../../design-system/components/Hints';
import { SegmentedControl } from '../../design-system/components/SegmentedControl';
import { UTIL } from '../nav.config';
import { usePrefs } from '../providers/PrefsProvider';
import { CARD_GROUPS, CARD_SLOTS, type PanelItem, type PanelPos } from '../providers/prefsModel';
import { GroupTitle } from '../../design-system/components/Card';
import { Select } from '../../design-system/components/Controls';

/** The second drawer of My Preferences: where each item of the panel sits, the sidebar or the toolbar (rule PP-01). Opened from a link of the Preferences drawer, with Back (DR-03). */
export function PanelItemsDrawer({ onBack, onClose }: { onBack: () => void; onClose: () => void }) {
  const { t, prefs, setPref } = usePrefs();
  const items: PanelItem[] = ['search', 'lang', 'theme', ...UTIL.map((u) => u.k), 'profile'];
  return (
    <Drawer title={t('prefs.panel')} size="sm" id="pf-panel" layer="l2" back={t('hdr.back')} onBack={onBack} onClose={onClose}
      footer={<Button label={t('prefs.done')} testid="prefs-panel-done" onClick={onBack} />}>
      <p className="mut">{t('prefs.panelH')}</p>
      {items.map((k) => <div className="rw" key={k} style={{ justifyContent: 'space-between' }}><span>{t('prefs.pi.' + k)}</span>
        <SegmentedControl id={'pf-pi-' + k} aria={t('prefs.pi.' + k)} val={prefs.items[k]} onChange={(v) => setPref('items', { ...prefs.items, [k]: v as PanelPos })} items={[['sidebar', t('prefs.piSb')], ['toolbar', t('prefs.piTb')]]} /></div>)}
    </Drawer>
  );
}

/** The third drawer of My Preferences: the look of the number cards in each place (rule PP-05): one choice for the stat cards of a list page, of a detail page and elsewhere, one for the KPI cards of a page and of a card. */
export function CardLooksDrawer({ onBack, onClose }: { onBack: () => void; onClose: () => void }) {
  const { t, prefs, setPref } = usePrefs();
  return (
    <Drawer title={t('prefs.cd.t')} size="sm" id="pf-cards" layer="l2" back={t('hdr.back')} onBack={onBack} onClose={onClose}
      footer={<Button label={t('prefs.done')} testid="prefs-cards-done" onClick={onBack} />}>
      <p className="mut">{t('prefs.cd.h')}</p>
      {CARD_GROUPS.map(([g, ids]) => (
        <div className="sec" key={g}><GroupTitle text={t('prefs.cd.g.' + g)} />
          {ids.map((k) => <Select key={k} id={'pf-cd-' + k} label={t('prefs.cd.' + k)} hint={t('prefs.cd.h.' + k)} size="md" val={prefs.cards[k]} opts={CARD_SLOTS[k].map((v) => [v, t('prefs.cd.v.' + v)] as [string, string])}
            onChange={(v) => setPref('cards', { ...prefs.cards, [k]: String(v) })} />)}
        </div>))}
    </Drawer>
  );
}

export function PrefsDrawer({ onClose }: { onClose: () => void }) {
  const { t, prefs, setPref, resetPrefs } = usePrefs(), [panel, setPanel] = useState(false), [cards, setCards] = useState(false);
  if (panel) return <PanelItemsDrawer onBack={() => setPanel(false)} onClose={onClose} />;
  if (cards) return <CardLooksDrawer onBack={() => setCards(false)} onClose={onClose} />;
  return (
    <Drawer title={t('prefs.title')} size="sm" closeLabel={t('lg.close')} onClose={onClose}
      footer={<>
        <button type="button" className="btn b-transparent i-neutral s-md" data-testid="prefs-reset" onClick={resetPrefs}>{t('prefs.reset2')}</button>
        <button type="button" className="btn b-fill i-brand s-md" data-testid="prefs-done" onClick={onClose}>{t('prefs.done')}</button>
      </>}>
      <Alert intent="info" text={t('prefs.noteG')} />
      <SegmentedControl id="pf-fs" label={t('prefs.fs')} val={prefs.fs} onChange={(v) => setPref('fs', v as 'small' | 'regular' | 'large')} items={(['small', 'regular', 'large'] as const).map((v) => [v, t('prefs.' + v)] as const)} full />
      <SegmentedControl id="pf-tbl" label={t('prefs.table')} val={prefs.table} onChange={(v) => setPref('table', v as 'sm' | 'md' | 'lg')} items={(['sm', 'md', 'lg'] as const).map((v) => [v, t('size.' + v)] as const)} full />
      {/* the only row of the drawer that is a link: it opens the second drawer; it sits last, under the choices */}
      <div className="prefs-links">
      <a className="li prefs-link" href="#" role="button" data-testid="prefs-panel-open" onClick={(e) => { e.preventDefault(); setPanel(true); }}>
        <IconTile icon="dashboard_customize" /><div className="m"><span className="t">{t('prefs.panel')}</span><span className="mut">{t('prefs.panelL')}</span></div><Icon name="chevron_right" />
      </a>
      <a className="li prefs-link" href="#" role="button" data-testid="prefs-cards-open" onClick={(e) => { e.preventDefault(); setCards(true); }}>
        <IconTile icon="space_dashboard" /><div className="m"><span className="t">{t('prefs.cd.t')}</span><span className="mut">{t('prefs.cd.l')}</span></div><Icon name="chevron_right" />
      </a>
      </div>
    </Drawer>
  );
}
