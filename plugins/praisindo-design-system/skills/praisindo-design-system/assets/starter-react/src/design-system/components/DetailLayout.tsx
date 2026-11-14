// Detail page layout shared by Opportunity detail and Signal rule detail (rule DT-05, owner decision 2026-10-24): an entity panel on the left (288px), the summary card, alerts, tabs and the page
// body on the right; one column under 1100px (summary first, then the panel, then the tabs). Markup and classes are those of the Opportunity detail (`.c3 .od`, `.cpanel`, `.odp`).
import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { DetailList } from './DetailList';

/** Two-column frame: `panel` (a DetailPanel) on the left, `children` (alerts, DetailSummary, tabs, body) in the right column. With `side="right"` the wide column comes first and `panel` (one DetailPanel, or an `.odside` stack of cards) is the narrow column on the right (rule DT-06); one column under 1100px in both. */
export function DetailLayout({ panel, children, side = 'left', wide, third }: { panel: ReactNode; children?: ReactNode; side?: 'left' | 'right'; /** the narrow column is 360px instead of 288px (the product detail, rule PD-05); with `side="right"` only */ wide?: boolean; /** three panels as Customer 360 (rule DK-18): `panel` on the left, `children` in the centre and `third` (a card or a stack of cards) on the right; it moves below the centre under 1360px; `side` and `wide` do not apply */ third?: ReactNode }) {
  if (third) return <div className="c3">{panel}<section className="c3m">{children}</section><div className="c3r">{third}</div></div>;
  return side === 'right'
    ? <div className={`c3 od od-r${wide ? ' od-w' : ''}`}><section className="c3m">{children}</section>{panel}</div>
    : <div className="c3 od">{panel}<section className="c3m">{children}</section></div>;
}

/** Entity panel: identity block, optional quick actions, optional small tabs, the field list and a footnote. */
export function DetailPanel({ label, head, quick, tabs, body, note, testid }: { label: string; head: ReactNode; quick?: ReactNode; tabs?: ReactNode; body: ReactNode; note?: ReactNode; testid?: string }) {
  return (
    <aside className="c3l card cpanel" aria-label={label} data-testid={testid}>
      {head}
      {quick}
      {tabs ? <div className="c3lt">{tabs}</div> : null}
      <DetailList layout="grid">{body}</DetailList>
      {note ? <p className="mut c3src">{note}</p> : null}
    </aside>
  );
}

export interface DetailSummaryProps {
  label: string; icon?: string; intent?: string; iconTitle?: string; /** a logo or avatar that takes the place of the icon tile (the product detail, rule PD-12) */ avatar?: ReactNode; kicker: ReactNode; title: ReactNode; badges?: ReactNode; cta?: ReactNode; facts?: ReactNode; next?: ReactNode; testid?: string;
}
/** Summary card of the entity: icon tile (or a logo given as `avatar`), kicker, title, badges, the call-to-action block, a facts grid and the next-step band. */
export function DetailSummary({ label, icon, intent, iconTitle, avatar, kicker, title, badges, cta, facts, next, testid }: DetailSummaryProps) {
  return (
    <section className="card odp" aria-label={label} data-testid={testid}>
      <div className="odh">
        {avatar ?? <span className={`odav i-${intent}`} title={iconTitle}><Icon name={icon ?? 'info'} /></span>}
        <div className="m"><span className="c3sub">{kicker}</span><h2>{title}</h2>{badges ? <div className="odbdg">{badges}</div> : null}</div>
        {cta ? <div className="odcta">{cta}</div> : null}
      </div>
      {facts ? <div className="odf">{facts}</div> : null}
      {next}
    </section>
  );
}
