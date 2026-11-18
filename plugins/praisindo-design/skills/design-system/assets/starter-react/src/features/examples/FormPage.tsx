// REFERENCE EXAMPLE (not a product page): the form pattern of references/rules-form.md. Copy the structure, replace the fields and texts.
// Adding or editing data is a PAGE (DK-01) and ONE rule governs a form page (DK-27, the whole of DK-17 and DK-24): the frame is `FormShell` (features/shared/FormShell.tsx), route layout `detail` (the sidebar collapses, SB-05),
// breadcrumb and Back arrow (NV-01); the fields are GROUPED FIRST (DK-28): every card has a title that says what its fields hold (never the page title, never one Card with GroupTitle captions), the cards that belong together are one step of the Wizard (DK-02) and a step holds one or more cards (here two steps of two cards), horizontal
// or vertical with the icon toggle at the right end of the title (DK-24); Back, Next or Save and Cancel LAST at the bottom are the card of actions without a header in the right column (DK-29, FormShell draws Cancel), NEVER the footer of a Card (DK-27); the tools row above it
// holds Tips (DK-26: an add form has no Recent activity and this form needs no integration, so no Data readiness); leaving with unsaved changes asks in the warning dialog (DR-06, inside FormShell).
// Rules met: DK-01, DK-02, DK-17, DK-24, DK-26, DK-27, DK-28, DK-29, NV-02, NV-03 (page head), CD-02, CD-05, FM-01 (every field `req` or `opt`; `req` draws the red `*`
// and aria-required), FM-02 (info icon through `hint`, on the label), FM-03 (PhoneInput), FM-04 (money), FM-05, FM-08 (shortcut chips), FM-06 (placeholders),
// FM-07 (soft checkbox), FM-10 (Switch), FP-02 (DateField), FM-17 (a field that picks one value is a Select, also for 4 options), BT-01 (Cancel transparent, Save fill),
// BN-01 (verbs), CD-08 (the Alert shows only after a failed submit), DR-05, DR-06, AX-01, DS-03.
// Validation: a field is checked when it loses focus and the whole form on Save; a step with an error turns red; the first field in error takes the focus (when its group is on screen).
import { useState } from 'react';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { useToast } from '../../app/providers/ToastProvider';
import { Alert } from '../../design-system/components/Alert';
import { Button } from '../../design-system/components/Button';
import { Select, Switch } from '../../design-system/components/Controls';
import { Input, Textarea } from '../../design-system/components/Field';
import { PhoneInput } from '../../design-system/components/Phone';
import { DateField } from '../../design-system/components/Pickers';
import { logActivity } from '../../domain/log/activityLog';
import { fill } from '../../i18n/fill';
import { FormShell, ftTips, type FormGroup } from '../shared/FormShell';

type Key = 'name' | 'code' | 'phone' | 'email' | 'limit' | 'terms';
const ORDER: readonly Key[] = ['name', 'code', 'phone', 'email', 'limit', 'terms'];
const ID: Record<Key, string> = { name: 'exf-name', code: 'exf-code', phone: 'exf-phone', email: 'exf-email', limit: 'exf-limit', terms: 'exf-terms' };

export function FormPage() {
  const { t } = usePrefs(), { toast } = useToast();
  const [v, setV] = useState({ name: '', code: '', email: '', limit: '', terms: '30', notes: '' });
  const [cat, setCat] = useState('raw'), [active, setActive] = useState(true), [mail, setMail] = useState(false);
  const [touched, setTouched] = useState<ReadonlySet<Key>>(new Set()), [tried, setTried] = useState(false);
  const [dirty, setDirty] = useState(false);
  const phoneVal = () => ((document.getElementById(ID.phone) as HTMLInputElement | null)?.value ?? '').replace(/\D/g, '');

  const errOf = (k: Key): string => {
    if (k === 'name') return v.name.trim().length < 3 ? t('ex.e.name') : '';
    if (k === 'code') return /^[A-Z0-9-]{3,12}$/.test(v.code) ? '' : t('ex.e.code');
    if (k === 'phone') { const n = phoneVal().length; return n >= 9 && n <= 13 ? '' : t('ex.e.phone'); }
    if (k === 'email') return !v.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email) ? '' : t('ex.e.email');
    if (k === 'limit') return v.limit.replace(/\D/g, '') ? '' : t('ex.e.limit');
    const d = Number(v.terms); return Number.isInteger(d) && d >= 1 && d <= 180 ? '' : t('ex.e.terms');
  };
  const shown = (k: Key) => (tried || touched.has(k) ? errOf(k) : '');
  const set = (k: keyof typeof v) => (x: string) => { setV((o) => ({ ...o, [k]: x })); setDirty(true); };
  const blur = (k: Key) => ({ onBlur: () => setTouched((o) => new Set(o).add(k)) });
  const bad = tried ? ORDER.filter((k) => errOf(k)) : [];

  const save = () => {
    setTried(true);
    const first = ORDER.find((k) => errOf(k));
    if (first) { document.getElementById(ID[first])?.focus(); return; }
    setDirty(false); logActivity({ category: 'create', action: t('act.create'), targetType: t('act.supplier'), targetId: v.code, note: v.name.trim() }); toast(fill(t('ex.saved'), { name: v.name.trim() })); location.hash = '#/ex-list';
  };
  const leaveNow = () => { location.hash = '#/ex-list'; };

  const groupErr = (...ks: Key[]) => tried && ks.some((k) => errOf(k));
  // DK-28: the fields are grouped first (what is about the company, who to call, what is paid and how, the settings), the cards that belong together are one step: two steps of two cards
  const groups: FormGroup[] = [
    { title: t('ex.s.supplier'), err: groupErr('name', 'code', 'phone', 'email'), cards: [
      { title: t('ex.g.company'), body: (<>
        {bad.length ? <Alert intent="danger" title={t('ex.e.sumT')} text={fill(t('ex.e.sumD'), { n: bad.length })} /> : null}
        <div className="g2">
          <Input id={ID.name} label={t('ex.f.name')} req val={v.name} ph={t('ex.ph.name')} err={shown('name')} onChange={set('name')} inputProps={blur('name')} />
          <Input id={ID.code} label={t('ex.f.code')} req hint={t('ex.h.code')} val={v.code} ph="SUP-1043" err={shown('code')} onChange={(x) => set('code')(x.toUpperCase())} inputProps={blur('code')} /></div>
        <Select id="exf-cat" label={t('ex.f.cat')} req val={cat} onChange={(x) => { setCat(x); setDirty(true); }}
          opts={[['raw', t('ex.cat.raw')], ['pack', t('ex.cat.pack')], ['svc', t('ex.cat.svc')], ['log', t('ex.cat.log')]]} /></>) },
      { title: t('ex.g.contact'), body: (
        <div className="g2"><PhoneInput id={ID.phone} label={t('ex.f.phone')} req err={shown('phone')} />
          <Input id={ID.email} label={t('ex.f.email')} type="email" opt hint={t('ex.h.email')} val={v.email} ph="name@company.com" err={shown('email')} onChange={set('email')} inputProps={blur('email')} /></div>) }] },
    { title: t('ex.s.terms'), err: groupErr('limit', 'terms'), cards: [
      { title: t('ex.g.terms'), body: (<>
        <div className="g2"><Input id={ID.limit} label={t('ex.f.limit')} format="money" cur="Rp" req hint={t('ex.h.limit')} val={v.limit} err={shown('limit')} onChange={set('limit')} inputProps={blur('limit')} />
          <Input id={ID.terms} label={t('ex.f.terms')} req hint={t('ex.h.terms')} suf={t('ex.daysU')} val={v.terms} err={shown('terms')} onChange={set('terms')} inputProps={{ ...blur('terms'), inputMode: 'numeric' }}
            sugg={[['30', 30], ['60', 60], ['90', 90]]} onSugg={(x) => set('terms')(String(x))} /></div>
        <div className="g2"><DateField id="exf-start" label={t('ex.f.start')} opt hint={t('ex.h.start')} onChange={() => setDirty(true)} /><div /></div>
        <Textarea id="exf-notes" label={t('ex.f.notes')} opt max={300} val={v.notes} onChange={set('notes')} /></>) },
      { title: t('ex.g.settings'), body: (<>
        <Switch id="exf-active" label={t('ex.f.active')} checked={active} onChange={(x) => { setActive(x); setDirty(true); }} />
        <label className="chk"><input type="checkbox" checked={mail} onChange={(e) => { setMail(e.target.checked); setDirty(true); }} />{t('ex.f.mail')}</label></>) }] },
  ];

  return (
    <FormShell title={t('ex.form.t')} sub={t('ex.form.sub')} parents={[['#/ex-list', t('ex.list.t')]]} crumb={t('ex.form.t')} layoutKey="ex-form" dirty={dirty} onLeave={leaveNow} groups={groups} tips={ftTips(t, 'ex', 3)}
      footer={() => <Button label={t('ex.save')} icon="check" onClick={save} />} />);
}
