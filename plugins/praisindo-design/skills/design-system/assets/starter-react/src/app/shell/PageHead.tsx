// Standard page head (prototype stdHead): breadcrumb, optional back button, title, one-line subtitle, optional actions on the right.
import type { ReactNode } from 'react';
import { Breadcrumb } from '../../design-system/components/Breadcrumb';
import { Button } from '../../design-system/components/Button';

export function PageHeader({ crumbs, title, sub, actions, onBack, backLabel = '' }: { crumbs: readonly (readonly [string, string])[]; title: string; sub: string; actions?: ReactNode; onBack?: () => void; backLabel?: string }) {
  return (
    <div className="ph">
      <div>
        <Breadcrumb items={crumbs} />
        <div className="ttl">{onBack ? <Button icon="arrow_back" type="transparent" intent="neutral" aria={backLabel} onClick={onBack} /> : null}<h1>{title}</h1></div>
        <p className="mut">{sub}</p>
      </div>
      {actions ? <div className="rw">{actions}</div> : null}
    </div>);
}
