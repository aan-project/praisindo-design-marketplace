// Port of ChangeNotice(): a calm card for a change the user should review (before / after rows, footer, actions).
import type { ReactNode } from 'react';
import { Icon } from './Icon';

export interface ChangeNoticeProps { icon?: string; tone?: string; title: string; text?: string; rows?: readonly (readonly [string, ReactNode])[]; foot?: ReactNode; actions?: ReactNode; role?: string; cls?: string }

export function ChangeNotice({ icon = 'swap_horiz', tone = 'warning', title, text = '', rows = [], foot, actions, role = 'alert', cls = '' }: ChangeNoticeProps) {
  return (
    <div className={`cn${tone === 'info' ? ' cn-info' : ''}${cls ? ' ' + cls : ''}`} role={role}>
      <div className="cn-h">
        <span className="cn-ic"><Icon name={icon} /></span>
        <div className="cn-t"><span className="fw6">{title}</span>{text ? <span className="mut">{text}</span> : null}</div>
        {actions ? <div className="cn-a">{actions}</div> : null}
      </div>
      {rows.length ? <dl className="cn-d">{rows.map(([l, h], i) => <div className="cn-r" key={i}><dt>{l}</dt><dd>{h}</dd></div>)}</dl> : null}
      {foot ? <div className="cn-f">{foot}</div> : null}
    </div>
  );
}
