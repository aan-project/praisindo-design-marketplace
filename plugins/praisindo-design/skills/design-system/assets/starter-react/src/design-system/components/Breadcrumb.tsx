// Port of Breadcrumb(): items are [href, label]; the last one is the current page.
import { Fragment } from 'react';
import { Icon } from './Icon';

export function Breadcrumb({ items }: { items: readonly (readonly [string, string])[] }) {
  return (
    <nav className="crumb" aria-label="Breadcrumb">
      {items.map((it, i) => i === items.length - 1
        ? <span key={i} aria-current="page">{it[1]}</span>
        : <Fragment key={i}><a href={it[0]}>{it[1]}</a><Icon name="chevron_right" /></Fragment>)}
    </nav>
  );
}
