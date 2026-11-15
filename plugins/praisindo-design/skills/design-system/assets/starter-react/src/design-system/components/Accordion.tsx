// Port of Accordion(). The prototype keeps the open state in ui.cc[id]; here the card owns it (initial = `open`). A forced card stays open and ignores clicks.
import { useState, type ReactNode } from 'react';
import { Icon } from './Icon';

export interface CollapseCardProps { id: string; title: string; sum?: string; badge?: ReactNode; open?: boolean; force?: boolean; onToggle?: (open: boolean) => void; children?: ReactNode }

export function Accordion({ id, title, sum = '', badge, open = false, force = false, onToggle, children }: CollapseCardProps) {
  const [o, setO] = useState(open);
  const on = force || o;
  return (
    <section className={`card acc${on ? ' open' : ''}`} id={id}>
      <h2 className="acc-h">
        <button type="button" className="acc-b" aria-expanded={on} aria-controls={`${id}-b`} aria-disabled={force ? 'true' : undefined}
          onClick={() => { if (force) return; setO(!on); onToggle?.(!on); }}>
          <span className="acc-t">{title}</span>{badge}<span className="acc-s mut">{sum}</span>{force ? null : <Icon name="expand_more" />}
        </button>
      </h2>
      <div className="acc-body" id={`${id}-b`} hidden={!on}>{children}</div>
    </section>
  );
}
