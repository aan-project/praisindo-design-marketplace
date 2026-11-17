// Port of Card() (and Card (no title)(), now Card without a title), GroupTitle() (GroupTitle), Section() (PlainSection).
import type { ReactNode } from 'react';

import { usePrefs } from '../../app/providers/PrefsProvider';
import { Chip } from './Chip';

/** The framed section. Without `title` it is the bare card (no frame and no header, for a short block that needs none; it was `Card (no title)` until DS 2.76). With `title=""` it is the framed card WITHOUT a header (for the actions of a vertical form, DK-24). */
export function Card({ title, body, actions, flush, footer }: { title?: string; body: ReactNode; actions?: ReactNode; flush?: boolean; footer?: ReactNode }) {
  if (title === undefined) return <section className="card-bare"><div className="cb">{body}</div></section>;
  return (
    <section className="card">
      {title === '' && !actions ? null : <div className="ch"><h2>{title}</h2>{actions ? <div className="rw">{actions}</div> : null}</div>}
      <div className={`cb${flush ? ' flush' : ''}`}>{body}</div>
      {footer ? <div className="cf">{footer}</div> : null}
    </section>
  );
}
/** Disclaimers (owner decision 2026-11-02, rule DC-01): the card at the very bottom of a page that holds the standing notes of that page, what used to be a `p.mut` between the page head and the content. Nothing is drawn without a note. */
export function Disclaimers({ items }: { items: readonly ReactNode[] }) {
  const { t } = usePrefs(), list = items.filter((x) => x !== null && x !== undefined && x !== false && x !== '');
  if (!list.length) return null;
  return <Card title={t('dsc.title')} body={<>{list.map((x, i) => <p className="mut" key={i}>{x}</p>)}</>} />;
}
export function GroupTitle({ text, id }: { text: string; id?: string }) {
  return <h3 className="grpt" id={id || undefined}>{text}</h3>;
}
export function PlainSection({ title, n, actions, desc, body, cls = '' }: { title: string; n?: number | null; actions?: ReactNode; desc?: string; body: ReactNode; cls?: string }) {
  return (
    <section className={`sect${cls ? ' ' + cls : ''}`}>
      <div className="secth"><h2>{title}</h2>{n != null ? <Chip label={String(n)} /> : null}<span className="sp" />{actions}</div>
      {desc ? <p className="mut sect-d">{desc}</p> : null}
      <div className="sectb">{body}</div>
    </section>
  );
}

/** Port of DR(): label / value detail row (the label in a 140px column). The pairs of a list with the label above the value or in rows are DetailList and DetailItem. */
export function DetailRow({ label, children }: { label: string; children?: ReactNode }) {
  return <div className="dr"><span className="mut">{label}</span><div>{children}</div></div>;
}
