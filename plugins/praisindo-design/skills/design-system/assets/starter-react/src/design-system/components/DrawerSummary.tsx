// The summary of the record at the top of a drawer (rule DR-14, owner decision 2026-11-26): a soft brand gradient card, the icon tile of the record, three lines that get softer (the name, what it is, the code and the details, CD-04)
// and one badge at the right. Presentational: the host passes the nodes, so the name can be a name trigger (CustomerName) and the badge a StBadge or a channel Badge.
import type { ReactNode } from 'react';
import { IconTile } from './Hints';

export interface DrawerSummaryProps {
  /** the icon of the record: the channel of an activity, a lightbulb for an opportunity */ icon: string; intent?: string;
  /** line 1, the name (semibold) */ title: ReactNode; /** line 2, what it is */ sub?: ReactNode; /** line 3, the code and the details (the softest) */ meta?: ReactNode;
  /** at the right: a Badge */ badge?: ReactNode;
}

export function DrawerSummary({ icon, intent = 'brand', title, sub, meta, badge }: DrawerSummaryProps) {
  return (
    <div className="dsum">
      <IconTile icon={icon} intent={intent} />
      <span className="m"><span className="t">{title}</span>{sub ? <span className="s">{sub}</span> : null}{meta ? <span className="x">{meta}</span> : null}</span>
      {badge}
    </div>
  );
}
