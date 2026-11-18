// The frame of an add / edit form PAGE (rules DK-01, DK-17, DK-24, DK-26, DK-27): page head with the breadcrumb back to the list page, the content on the left and the side column on the RIGHT with the buttons of the form in a card without a header.
// A form of several groups of fields is a stepper form (DK-02, DK-24): every group is a step AND its own card in the content (DK-17: the title of a card says what the group holds, it is never the title of the page, and a form page never has one card with GroupTitle captions),
// and the person chooses the layout with the icon toggle at the right end of the page title:
//   horizontal: the numbered Wizard along the top of the content, one group at a time, Back and Next in the card of actions (a step with an error turns red);
//   vertical: the whole form as one page, the vertical Wizard is the rail in the right column above the card of actions, no Back and Next.
// A step holds one or more cards (`cards`, DK-28: group the fields first). A form of one group has no Wizard and no toggle (`cardTitle`). The buttons are NEVER the footer of a card (DK-27), stacked Back, the action, Cancel LAST (DK-29). The tools row (DK-26) is above the card of actions: Tips always, Recent activity only for a record that already exists, Data readiness only for data that needs an integration.
// Warns when the person leaves with unsaved changes (DR-06). Made of existing parts only (PageHeader, Wizard, Card, DetailLayout, Dialog, Drawer, SegmentedControl).
import { useState, type ReactNode } from 'react';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { PageHeader } from '../../app/shell/PageHead';
import { Button } from '../../design-system/components/Button';
import { Card } from '../../design-system/components/Card';
import { Chip } from '../../design-system/components/Chip';
import { DetailLayout } from '../../design-system/components/DetailLayout';
import { Drawer } from '../../design-system/components/Drawer';
import { Icon } from '../../design-system/components/Icon';
import { Dialog } from '../../design-system/components/Modal';
import { SegmentedControl } from '../../design-system/components/SegmentedControl';
import { Tooltip } from '../../design-system/components/Tooltip';
import { Wizard } from '../../design-system/components/Wizard';
import { useFormLayout, type FormLayout } from '../../lib/formLayout';

/** One card of a step: its title says what its fields are (DK-17). */
export interface FormCard { title: string; body: ReactNode }
/** A group of fields = a step of the Wizard. It holds one card (`body`, titled like the step) or several (`cards`, DK-28: group the fields first, a step is not forced to be one card). `err` turns its step red (a field of the group has an error). */
export interface FormGroup { title: string; body?: ReactNode; cards?: readonly FormCard[]; err?: boolean }
const cardsOf = (g: FormGroup): readonly FormCard[] => g.cards ?? [{ title: g.title, body: g.body }];
export interface FormShellProps {
  title: string; sub: string;
  /** the pages above this one, as [href, label]: Home is added in front, `crumb` is the leaf */ parents: readonly (readonly [string, string])[]; crumb: string;
  /** the page under which the layout choice is remembered (DK-24) */ layoutKey?: string;
  /** the layout the form starts with: 'v' (the default) shows every group on one page, 'h' one group at a time */ defaultLayout?: FormLayout;
  /** `leave` asks for confirmation when the form is dirty, else leaves at once */ dirty: boolean; onLeave(): void;
  /** the buttons of the ACTION of the form (Save, Publish, Generate; Back and Next are added in the horizontal layout), shown in the card of actions on the right and never the footer of a card (DK-27); never Cancel: FormShell draws Cancel itself as the last button at the bottom of the card (DK-29) */ footer: (leave: () => void) => ReactNode;
  /** a form of several groups: one step per group, each step with one or more cards (DK-28) */ groups?: readonly FormGroup[];
  /** the title of the one card of a form of one group; it is never the page title (DK-17) */ cardTitle?: string; children?: ReactNode;
  /** the tips of the form (DK-26): at least one; the button Tips with their count */ tips: readonly string[];
  /** the content of the drawer Recent activity (DK-26), given only when the record exists: an add form has no activity yet and shows no button */ activity?: ReactNode;
  /** only a form whose data needs an integration (DK-26): the button Data readiness with its state (a dot) opens a drawer with `body`, one row per source system, for every role */ readiness?: { dot: 'success' | 'warning' | 'danger'; body: ReactNode };
  /** more cards in the right column under the card of actions */ aside?: ReactNode;
}

/** The keys `ft.<page>.1..n` of the tips of a form page (DK-26). */
export const ftTips = (t: (k: string) => string, page: string, n: number): string[] => Array.from({ length: n }, (_, i) => t(`ft.${page}.${i + 1}`));

export function FormShell({ title, sub, parents, crumb, layoutKey = 'form', defaultLayout = 'v', dirty, onLeave, footer, groups, cardTitle, children, tips, activity, readiness, aside }: FormShellProps) {
  const { t } = usePrefs(), multi = !!groups && groups.length >= 2;
  const [tool, setTool] = useState<'tips' | 'act' | 'rd' | null>(null), [layout, setLayout] = useFormLayout(layoutKey, defaultLayout), [ask, setAsk] = useState(false), [sec, setSec] = useState(0), [step, setStep] = useState(0);
  const vert = multi && layout === 'v', leave = () => { if (dirty) setAsk(true); else onLeave(); };
  const last = multi ? groups!.length - 1 : 0, at = Math.min(step, last);
  // content: the cards of the groups (vertical: all of them as sections with an id; horizontal: the current one)
  const shown = groups ? (multi && !vert ? [groups[at]!] : groups) : null;
  const content = shown ? <div className="sbstack">{shown.map((g) => <section key={g.title} id={vert ? 'fs-sec-' + groups!.indexOf(g) : undefined}>{cardsOf(g).map((c) => <Card key={c.title} title={c.title} body={c.body} />)}</section>)}</div> : <Card title={cardTitle ?? ''} body={children} />;
  const wz = (variant: 'numbered' | 'vertical') => (
    <Wizard id="mf-steps" variant={variant} aria={t('mf.aria')} steps={groups!.map((g) => ({ label: g.title, err: g.err }))} cur={variant === 'vertical' ? sec : at}
      onStep={variant === 'vertical' ? (i) => { setSec(i); document.getElementById('fs-sec-' + i)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } : setStep} />);
  // DK-29: the card of actions, top to bottom: Back (only where a step comes before), the primary action, and Cancel LAST, at the bottom (the footer of the page holds the action only)
  const nav = (
    <>{multi && !vert && at > 0 ? <Button label={t('sn.back')} icon="arrow_back" type="outlined" intent="neutral" onClick={() => setStep(at - 1)} /> : null}
      {multi && !vert && at < last ? <Button label={t('sn.next')} iconRight="arrow_forward" onClick={() => setStep(at + 1)} /> : footer(leave)}
      <Button label={t('fnd.cancel')} type="transparent" intent="neutral" onClick={leave} testid="form-cancel" /></>);
  // DK-26: the tools of the form, above the card of actions
  const tb = (d: 'tips' | 'act' | 'rd', ic: string, lab: string, dot?: string, cnt?: number) => (
    <Tooltip key={d} placement="top" trigger={
      <button type="button" className="anv-b jtl" aria-label={lab} aria-haspopup="dialog" onClick={() => setTool(d)}>
        <span className="anv-n"><Icon name={ic} /></span>{dot ? <span className={`jdot i-${dot}`} aria-hidden="true" /> : null}{cnt ? <Chip label={String(cnt)} selected hidden /> : null}<span className="anv-t">{lab}</span></button>}>{lab}</Tooltip>);
  const tools = <div className="anv-tools" role="group" aria-label={t('ft.t')}>{readiness ? tb('rd', 'fact_check', t('ft.rd'), readiness.dot) : null}{tb('tips', 'lightbulb', t('ft.tips'), undefined, tips.length)}{activity ? tb('act', 'history', t('ft.act')) : null}</div>;
  const close = () => setTool(null), doneBtn = <Button label={t('take.close')} onClick={close} />;
  return (
    <>
      <PageHeader crumbs={[['#/home', t('nav.home')], ...parents, [location.hash || '#/', crumb]]} title={title} sub={sub} onBack={leave} backLabel={t('hdr.back')}
        actions={multi ? <SegmentedControl id="formlayout" aria={t('fl.t')} val={layout} onChange={(v) => setLayout(v as FormLayout)} items={[['h', t('fl.h'), 'view_week'], ['v', t('fl.v'), 'view_agenda']]} /> : undefined} />
      <DetailLayout side="right" panel={<div className="odside odstk">{vert ? <div className="stpv">{wz('vertical')}</div> : null}{tools}<Card title="" body={<div className="stpa">{nav}</div>} />{aside}</div>}>
        {multi && !vert ? wz('numbered') : null}{content}
      </DetailLayout>
      {tool === 'tips' ? <Drawer title={t('ft.tips')} size="sm" onClose={close} footer={doneBtn}><ul className="sbtips">{tips.map((x, i) => <li key={i} className="sbtip i-info"><span className="sbtp-i"><Icon name="lightbulb" /></span><div className="sbtp-b"><span>{x}</span></div></li>)}</ul></Drawer> : null}
      {tool === 'act' && activity ? <Drawer title={t('ft.act')} size="sm" onClose={close} footer={doneBtn}>{activity}</Drawer> : null}
      {tool === 'rd' && readiness ? <Drawer title={t('ft.rd')} size="sm" onClose={close} footer={doneBtn}>{readiness.body}</Drawer> : null}
      {ask ? <Dialog kind="warning" title={t('mf.leave.t')} text={t('mf.leave.d')} ok={{ label: t('mf.leave.b'), onClick: () => { setAsk(false); onLeave(); } }} cancel={{ label: t('mf.stay'), onClick: () => setAsk(false) }} onClose={() => setAsk(false)} /> : null}
    </>);
}
