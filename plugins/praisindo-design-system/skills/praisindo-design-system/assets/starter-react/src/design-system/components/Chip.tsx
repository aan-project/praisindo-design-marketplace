// Chip (rules CH-01 to CH-05, owner decisions of 2026-10-26): the compact NON-STATUS label, in two modes. The Badge is the status or category; whatever is only a number, a name, a value or a choice is a Chip.
//  - STATIC (no `onClick`, no `onRemove`): a `span`, no hover, no focus, no pointer. 20px high, SOLID neutral (rule CH-08); `selected` makes it solid brand (a count that asks for attention, the count of the active tab); `tone="soft"` is the soft look for a chip on a solid fill (a fill Button does it by CSS). No shadow.
//  - INTERACTIVE: `onClick` makes one `<button>` (`selected` true or false makes it a toggle, `aria-pressed`); `onRemove` makes a container with the label and ONE close button (`removeLabel` is its aria-label).
//    28px high, neutral outline at rest, soft brand when selected, hover, focus ring, disabled, touch target of 40px or more on a phone (42px). Nothing interactive is nested in anything interactive (CH-02).
// Both are full pills (`--r-pill`). A static Chip has no intent and no status icon.
import type { MouseEventHandler } from 'react';
import { Icon } from './Icon';

export interface ChipProps {
  label: string; icon?: string; title?: string; disabled?: boolean;
  /** toggle state of a clickable chip; on a static chip it only changes the colour (soft brand); a removable chip is always drawn selected */ selected?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** shows the close button */ onRemove?: MouseEventHandler<HTMLButtonElement>; removeLabel?: string;
  /** extra data-* attributes for the hooks of existing screens (testing, scripts) */ data?: Readonly<Record<string, string>>; removeData?: Readonly<Record<string, string>>;
  testid?: string;
  /** a static chip is SOLID by default (neutral default fill; brand default fill when `selected`, rule CH-08); `soft` is the soft look (neutral soft fill; soft brand when `selected`) for a chip that sits on a component with a solid fill. `default` is the old name of the solid look and means the same */ tone?: 'default' | 'soft';
  /** a static chip whose text is repeated for assistive technology elsewhere (a count next to a visually hidden sentence): aria-hidden */ hidden?: boolean;
}
const dat = (d?: Readonly<Record<string, string>>) => Object.fromEntries(Object.entries(d ?? {}).map(([k, v]) => ['data-' + k, v]));

export function Chip({ label, icon, title, disabled, selected, onClick, onRemove, removeLabel, data, removeData, testid, hidden, tone }: ChipProps) {
  const body = <>{icon ? <Icon name={icon} /> : null}{label}</>;
  if (onRemove) {
    return (
      <span className="chp chp-r on" title={title} data-testid={testid} {...dat(data)}>{body}
        <button type="button" className="chp-x" aria-label={removeLabel ?? label} disabled={disabled || undefined} onClick={onRemove} {...dat(removeData)}><Icon name="close" /></button>
      </span>);
  }
  if (!onClick) return <span className={`chp chp-s${tone === 'default' ? ' chp-d' : tone === 'soft' ? ' chp-sf' : ''}${selected ? ' on' : ''}`} title={title} data-testid={testid} aria-hidden={hidden || undefined} {...dat(data)}>{body}</span>;
  return (
    <button type="button" className={`chp${selected ? ' on' : ''}`} aria-pressed={selected} title={title} disabled={disabled || undefined} onClick={onClick} data-testid={testid} {...dat(data)}>{body}</button>);
}
