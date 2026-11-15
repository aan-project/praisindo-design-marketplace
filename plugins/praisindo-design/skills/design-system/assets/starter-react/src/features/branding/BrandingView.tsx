// Branding page view (rules BR-01..BR-08): the form, the live preview and the logo drawer. Presentational: the draft, alert and handlers come from BrandingPage.
import type { ReactNode } from 'react';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { PageHeader } from '../../app/shell/PageHead';
import { Alert } from '../../design-system/components/Alert';
import { Badge } from '../../design-system/components/Badge';
import { Button } from '../../design-system/components/Button';
import { Card, Disclaimers, GroupTitle } from '../../design-system/components/Card';
import { Select } from '../../design-system/components/Controls';
import { RichSelect } from '../../design-system/components/Pickers';
import { Drawer } from '../../design-system/components/Drawer';
import { Input } from '../../design-system/components/Field';
import { Icon } from '../../design-system/components/Icon';
import { AlertAction } from '../../design-system/components/States';
import { buildTokens } from '../../design-system/tokens/buildTokens.ts';
import { validHex } from '../../design-system/tokens/colorEngine.ts';
import type { Brand } from '../../design-system/tokens/palette.ts';
import { admDraft, admHexErr, ADMF, LSLOT, type BrandDraft, type LogoSlot } from '../../branding/brand';
import { badgeProps } from '../../domain/badgeIcons';

export function BrandingHead() {
  const { t } = usePrefs();
  return <PageHeader crumbs={[['#/home', t('nav.home')], ['#/branding', t('nav.branding')]]} title={t('nav.branding')} sub={t('adm.sub')} />;
}
export interface DraftAlert { i: string; m: string; retry?: boolean }

/** prototype bpView: a mock screen styled with the draft colours and font (scoped tokens under `.bp`). */
export function BrandPreview({ A, brand, onMode }: { A: BrandDraft; brand: Brand; onMode(v: 'light' | 'dark'): void }) {
  const { t } = usePrefs(), dk = A.pmode === 'dark', lg = (dk && A.logoD) || A.logoL, nm = A.name || '—', full = !!lg;
  const bars = [34, 52, 41, 68, 57, 80].map((h, i) => <rect key={i} x={10 + i * 34} y={96 - h} width="22" height={h} rx="3" fill="var(--color-surface-brand-default)" />);
  return <>
    <style id="bpcss" dangerouslySetInnerHTML={{ __html: buildTokens(admDraft(A, brand), '.bp') }} />
    <div className="rw">
      <Button label={t('adm.pv.light')} type={A.pmode === 'light' ? 'soft' : 'outlined'} intent={A.pmode === 'light' ? 'brand' : 'neutral'} size="sm" onClick={() => onMode('light')} />
      <Button label={t('adm.pv.dark')} type={dk ? 'soft' : 'outlined'} intent={dk ? 'brand' : 'neutral'} size="sm" onClick={() => onMode('dark')} />
    </div>
    <div className="bp" data-theme={A.pmode}><div className="bp-app">
      <aside className="bp-sb">
        <div className={`bp-brand${full ? ' full' : ''}`}>{lg ? <img src={lg} alt={full ? nm : ''} /> : <span className="mono" style={{ width: 24, height: 24 }}>{nm.charAt(0).toUpperCase()}</span>}{full ? null : <span className="bp-name">{nm}</span>}</div>
        <div className="bp-nav on">{t('adm.pv.nav1')}</div><div className="bp-nav">{t('adm.pv.nav2')}</div><div className="bp-nav">{t('adm.pv.nav3')}</div>
      </aside>
      <div><header className="bp-hd"><span className="fw6">{t('adm.pv.page')}</span><span className="av">AW</span></header>
        <div className="bp-body">
          <div className="rw"><span className="btn b-fill i-brand s-md">{t('adm.pv.btn1')}</span><span className="btn b-fill i-secondary s-md">{t('adm.pv.btn2')}</span><span className="btn b-outlined i-neutral s-md">{t('adm.pv.btn3')}</span></div>
          <div className="inp s-md"><input defaultValue="" placeholder={t('adm.pv.inp')} tabIndex={-1} aria-hidden="true" /></div>
          <div className="rw"><Badge label={t('adm.pv.st1')} {...badgeProps('status', 'active')} /><Badge label={t('adm.pv.st2')} {...badgeProps('status', 'new')} /><Badge label={t('adm.pv.hi')} {...badgeProps('priority', 'high')} /><Badge label={t('adm.pv.md')} {...badgeProps('priority', 'medium')} /></div>
          <div className="bp-card"><table><thead><tr><th>{t('adm.pv.th1')}</th><th>{t('adm.pv.th2')}</th><th>{t('adm.pv.th3')}</th></tr></thead><tbody>
            <tr><td>Alex Morgan</td><td><Badge label={t('adm.pv.hi')} {...badgeProps('priority', 'high')} /></td><td><Badge label={t('adm.pv.st1')} {...badgeProps('status', 'active')} /></td></tr>
            <tr><td>Sam Rivera</td><td><Badge label={t('adm.pv.md')} {...badgeProps('priority', 'medium')} /></td><td><Badge label={t('adm.pv.st2')} {...badgeProps('status', 'new')} /></td></tr></tbody></table></div>
          <div className="bp-card"><span className="fw6">{t('adm.pv.chart')}</span>
            <svg viewBox="0 0 220 100" width="100%" height="100" role="img" aria-label={t('adm.pv.chart')}>{bars}<polyline fill="none" stroke="var(--color-surface-secondary-default)" strokeWidth="3" points="21,70 55,56 89,62 123,36 157,44 191,18" /></svg></div>
        </div></div></div></div>
  </>;
}

function LogoRow({ A, k, lab, onLogo }: { A: BrandDraft; k: LogoSlot; lab: string; onLogo(s: LogoSlot): void }) {
  const { t } = usePrefs(), v = A[k], dk = k === 'logoD';
  return (
    <div className="lrow">
      <div className="th" data-theme={dk ? 'dark' : undefined}>{v ? <img src={v} alt="" /> : <Icon name={k === 'fav' ? 'tab' : 'image'} />}</div>
      <div style={{ flex: 1, minWidth: 0 }}><span className="fw6">{t(lab)}</span><div className="mut">{v ? t('adm.set') : t('adm.none')}</div></div>
      <Button label={v ? t('adm.replace') : t('adm.manage')} icon="upload" type="outlined" intent="neutral" size="sm" onClick={() => onLogo(k)} />
    </div>);
}
const Sec = ({ h, children }: { h: string; children: ReactNode }) => { const { t } = usePrefs(); return <div className="sec"><GroupTitle text={t(h)} /><div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div></div>; };
const Sw = ({ A, k }: { A: BrandDraft; k: 'primary' | 'secondary' }) => <span data-sw style={{ flex: 'none', width: 20, height: 20, borderRadius: 4, border: '1px solid var(--color-border-neutral-default)', background: validHex(A[k]) ? A[k] : 'transparent' }} />;

const FW = [300, 400, 500, 600] as const;   // the default weight of the text (FW-01): 300 Light, 400 Regular, 500 Medium, 600 Semibold
export interface BrandingViewProps {
  A: BrandDraft; brand: Brand; alert: DraftAlert | null; busy: boolean; canEdit: boolean;
  onText(k: 'name' | 'primary' | 'secondary', v: string): void; onFont(v: string): void; onFw(v: string): void; onDmode(v: 'light' | 'dark'): void; onDlang(v: 'en' | 'id'): void; onPmode(v: 'light' | 'dark'): void;
  onLogo(s: LogoSlot): void; onReset(): void; onSave(): void; onRetry(): void;
}
export function BrandingView(p: BrandingViewProps) {
  const { t } = usePrefs(), A = p.A, md = 'md';
  const ce = admHexErr(A, 'primary'), se = admHexErr(A, 'secondary'), ne = A.nameErr ? t('adm.errName') : '';
  const form = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {p.alert ? <Alert intent={p.alert.i as 'danger' | 'warning'} text={t(p.alert.m)} extra={p.alert.retry ? <AlertAction k="state.retry" onClick={p.onRetry as never} /> : undefined} /> : null}
      <Sec h="adm.sec.brand">
        <Input id="adm-name" req label={t('adm.name')} val={A.name} err={ne} onChange={(v) => p.onText('name', v)} />
        <Input id="adm-primary" req label={t('adm.color')} val={A.primary} err={ce ? t(ce) : ''} hint={t('adm.colorH')} inputProps={{ spellCheck: false }} trail={<Sw A={A} k="primary" />} onChange={(v) => p.onText('primary', v)} />
        <Input id="adm-secondary" req label={t('adm.secondary')} val={A.secondary} err={se ? t(se) : ''} inputProps={{ spellCheck: false }} trail={<Sw A={A} k="secondary" />} onChange={(v) => p.onText('secondary', v)} />
        <LogoRow A={A} k="logoL" lab="adm.logoL" onLogo={p.onLogo} /><LogoRow A={A} k="logoD" lab="adm.logoD" onLogo={p.onLogo} /><LogoRow A={A} k="fav" lab="adm.fav" onLogo={p.onLogo} />
        <p className="mut adm-lnote">{t('adm.logoNote') + (A.logoL && !A.fav ? ' ' + t('adm.favTip') : '')}</p>
      </Sec>
      <Sec h="adm.sec.type"><div className="fld"><label>{t('adm.fontFam')}</label><Select opts={ADMF.map((f) => [f, f] as const)} val={A.font} size={md} aria={t('adm.fontFam')} onChange={p.onFont} /></div>
        <RichSelect id="adm-fw" label={t('adm.fontW')} hint={t('adm.fontWH')} opts={FW.map((w) => ({ v: String(w), label: String(w), soft: t('adm.fw.' + w) }))} val={A.fw} size={md} onChange={p.onFw} /></Sec>
      <Sec h="adm.sec.theme"><div className="fld"><label>{t('adm.dmode')}</label>
        <Select opts={[['light', t('prefs.light')], ['dark', t('prefs.dark')]]} val={A.dmode} size={md} aria={t('adm.dmode')} onChange={(v) => p.onDmode(v as 'light' | 'dark')} />
        <span className="mut">{t('adm.dmodeH')}</span></div></Sec>
      <Sec h="adm.sec.lang"><div className="fld"><label>{t('adm.dlang')}</label><Select opts={[['en', 'English'], ['id', 'Bahasa Indonesia']]} val={A.dlang} size={md} aria={t('adm.dlang')} onChange={(v) => p.onDlang(v as 'en' | 'id')} /><span className="mut">{t('adm.dlangH')}</span></div></Sec>
    </div>);
  const foot = <>
    <Button label={t('adm.reset')} type="outlined" intent="neutral" disabled={p.busy || !p.canEdit} onClick={p.onReset} />
    <Button label={p.busy ? t('adm.saving') : t('adm.save')} disabled={p.busy || !p.canEdit} onClick={p.onSave} />
  </>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="admg">
        <Card title={t('adm.brandT')} body={form} footer={foot} />
        <Card title={t('adm.pv.t')} body={<><p className="mut">{t('adm.pv.d')}</p><div id="bpwrap" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}><BrandPreview A={A} brand={p.brand} onMode={p.onPmode} /></div></>} />
      </div>
      <Disclaimers items={[t('adm.global')]} />   {/* rule DC-01 */}
    </div>);
}

export interface LogoDrawerProps {
  slot: LogoSlot; cur: string; staged: string | undefined; name: string; err: string; up: boolean; hasPending: boolean;
  onChoose(): void; onFile(f: File): void; onSample(): void; onRemove(): void; onRetry(): void; onApply(): void; onClose(): void;
}
/** prototype logoDrawer. */
export function LogoDrawer(p: LogoDrawerProps) {
  const { t } = usePrefs(), fav = p.slot === 'fav', dk = p.slot === 'logoD', cur = p.staged !== undefined ? p.staged : p.cur;
  const st = p.up ? t('adm.uploading') : p.staged === '' ? t('lg.removed') : p.staged !== undefined ? t('lg.staged') + (p.name ? ' · ' + p.name : '') : '';
  return (
    <Drawer title={t(LSLOT[p.slot])} size="sm" onClose={p.onClose}
      footer={<><Button label={t('fnd.cancel')} type="transparent" intent="neutral" onClick={p.onClose} /><Button label={t('lg.apply')} disabled={p.up || p.staged === undefined} onClick={p.onApply} /></>}>
      <Alert intent="info" text={t('lg.note')} />
      <div className="sec"><span className="fw6">{t('lg.cur')}</span><div className="bp-prev" data-theme={dk ? 'dark' : undefined}>{cur ? <img src={cur} alt="" /> : <span>{t('lg.none')}</span>}</div>{st ? <span className="mut">{st}</span> : null}</div>
      {p.err ? <div role="alert" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><Alert intent="danger" text={t(p.err)} extra={p.err === 'adm.upfail' && p.hasPending ? <Button label={t('lg.retry')} icon="refresh" type="transparent" intent="neutral" size="sm" onClick={p.onRetry} /> : undefined} /></div> : null}
      <div className="sec"><div className="rw">
        <input type="file" id="lg-file" accept={fav ? '.png,.svg,.webp,.ico,image/x-icon' : '.png,.svg,.webp,image/png,image/svg+xml,image/webp'} hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) p.onFile(f); e.target.value = ''; }} />
        <Button label={cur ? t('lg.replace') : t('lg.choose')} icon="upload" type="outlined" intent="neutral" disabled={p.up} onClick={p.onChoose} />
        <Button label={t('adm.sample')} type="link" disabled={p.up} onClick={p.onSample} />
        <Button label={t('lg.remove')} icon="delete_outline" type="transparent" intent="danger" disabled={p.up || !cur} onClick={p.onRemove} />
      </div><span className="mut">{t(fav ? 'lg.hintF' : 'lg.hint')}</span></div>
    </Drawer>);
}
