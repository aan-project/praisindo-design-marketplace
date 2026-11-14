// Alert (v1.70 look): a card with a soft intent tint fading from the left, an icon in a rounded tile, an optional bold title above the description, an optional action on the
// right (`extra`, e.g. AlertAction) and an optional close button. Plain `<Alert intent text />` keeps the markup of the prototype (icon, text span, extra).
import type { ReactNode } from 'react';
import { usePrefsOptional } from '../../app/providers/PrefsProvider';
import { Button } from './Button';
import { Icon } from './Icon';

const alertIcons: Readonly<Record<string, string>> = { info: 'info', success: 'check_circle_outline', warning: 'warning_amber', danger: 'error_outline' };

export interface AlertProps {
  intent?: string; text: string; extra?: ReactNode;
  /** bold first line: the alert then has the title above the description */ title?: string;
  /** shows a close button on the right that calls this */ onClose?: () => void;
  /** dense variant for tight places (drawers, table toolbars): smaller padding, icon without tile */ compact?: boolean;
}

export function Alert({ intent = 'info', text, extra, title, onClose, compact }: AlertProps) {
  const p = usePrefsOptional();
  return (
    <div className={`al i-${intent}${title ? ' has-t' : ''}${compact ? ' al-sm' : ''}`} role="alert">
      <Icon name={alertIcons[intent] ?? 'info'} />
      {title ? <div className="alb"><span className="alt">{title}</span><span className="ald">{text}</span></div> : <span>{text}</span>}
      {extra}
      {onClose ? <Button icon="close" type="transparent" intent="neutral" size="sm" aria={p ? p.t('lg.close') : 'Close'} onClick={onClose} /> : null}
    </div>
  );
}
