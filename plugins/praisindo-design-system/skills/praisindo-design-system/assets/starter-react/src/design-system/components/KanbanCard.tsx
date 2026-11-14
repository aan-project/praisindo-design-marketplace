// Card inside a KanbanBoard lane. Presentational: the page decides what the title, description, actions and menu are.
// With onOpen the whole card is the View action. The title is a real button whose ::after covers the card ("stretched button"), so a click anywhere on the card
// and Enter / Space on the title open it, while Take Action and the More menu sit above the cover and keep their own behaviour. The card itself is not a
// role=button: interactive controls inside a button are a WCAG error (axe nested-interactive).
import type { ReactNode } from 'react';

export interface KanbanCardProps { id: string; title: string; desc: string; priority: ReactNode; due: string; owner: ReactNode; actions?: ReactNode; menu?: ReactNode; onOpen?: () => void; openLabel?: string }

export function KanbanCard({ id, title, desc, priority, due, owner, actions, menu, onOpen, openLabel }: KanbanCardProps) {
  return (
    <article className={onOpen ? 'kbk kbk-o' : 'kbk'} data-id={id}>
      <h3 className="kbt">{onOpen ? <button type="button" className="kbt-b" aria-label={openLabel ? `${openLabel}: ${title}` : title} onClick={onOpen}>{title}</button> : title}</h3>
      <p className="kbd">{desc}</p>
      <div className="kbm">{priority}<span className="mut">{due}</span></div>
      <div className="kbo">{owner}</div>
      <footer className="kbf"><div className="kba">{actions}</div>{menu ? <span className="kbmn">{menu}</span> : null}</footer>
    </article>);
}
