// Port of the prototype's Button() and LinkButton(): same class names and attribute rules (golden: baseline/golden/ui-kit.primitives.json).
// Event delegation attributes (data-act/data) are replaced by React handlers.
import type { MouseEventHandler, ReactNode } from 'react';

import { Icon } from './Icon';
import { SZ } from './uiSize';
import { Chip } from './Chip';

export interface ButtonProps {
  label?: string; icon?: string; iconRight?: string; intent?: string; type?: string; size?: string; id?: string; disabled?: boolean;
  full?: boolean; aria?: string; title?: string; cls?: string; btnType?: 'button' | 'submit' | 'reset'; count?: number; /** show the count chip also when it is 0 (a button whose number is part of its meaning) */ zero?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>; testid?: string; pressed?: boolean; /** a button that opens and closes a part of the page (aria-expanded), for example the row of a table that shows its details (rule DT-12) */ expanded?: boolean; controls?: string;
}

export function Button({ label = '', icon, iconRight, intent = 'brand', type = 'fill', size = SZ, id, disabled, full, aria, title, cls = '', btnType = 'button', count = 0, zero, onClick, testid, pressed, expanded, controls }: ButtonProps) {
  const name = aria || label;
  return (
    <button type={btnType} id={id || undefined} data-testid={testid} aria-pressed={pressed} aria-expanded={expanded} aria-controls={controls} disabled={disabled || undefined} onClick={onClick} title={title || undefined}
      className={`btn b-${type} i-${intent} s-${size}${label ? '' : ' io'}${full ? ' full' : ''}${cls ? ' ' + cls : ''}`}
      aria-label={name ? name + (count || zero ? ' (' + count + ')' : '') : undefined}>
      {icon ? <Icon name={icon} /> : null}{label || null}{count || zero ? <Chip label={String(count)} selected /> : null}{iconRight ? <Icon name={iconRight} /> : null}
    </button>
  );
}

export interface LinkBtnProps { label?: ReactNode; href: string; icon?: string; iconRight?: string; intent?: string; type?: string; size?: string; aria?: string; title?: string; cls?: string; onClick?: () => void }

export function LinkButton({ label = '', href, icon, iconRight, intent = 'brand', type = 'fill', size = SZ, aria, title, cls = '', onClick }: LinkBtnProps) {
  return (
    <a href={href} className={`btn b-${type} i-${intent} s-${size}${label ? '' : ' io'}${cls ? ' ' + cls : ''}`} aria-label={aria || undefined} title={title || undefined} onClick={onClick}>
      {icon ? <Icon name={icon} /> : null}{label || null}{iconRight ? <Icon name={iconRight} /> : null}
    </a>
  );
}
