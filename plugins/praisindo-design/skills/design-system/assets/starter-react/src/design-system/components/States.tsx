// Port of EmptyState(), ErrorState(), LoadingState(), ErrorState(), RetryButton(), AlertAction() and Meter() (golden: baseline/golden/ui-kit.state.json).
import type { MouseEventHandler, ReactNode } from 'react';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { Button } from './Button';
import { Icon } from './Icon';
import { SZ } from './uiSize';

export function EmptyState({ size = SZ, title, desc, icon = 'inbox', cta }: { size?: string; title?: string; desc?: string; icon?: string; cta?: ReactNode }) {
  const { t } = usePrefs();
  return <div className={`state s-${size}`}><Icon name={icon} /><h3>{title ?? t('state.emptyT')}</h3><p className="mut">{desc ?? t('state.emptyD')}</p>{cta ? <div className="state-cta">{cta}</div> : null}</div>;
}
export function RetryButton({ size, onClick }: { size?: string; onClick?: MouseEventHandler<HTMLButtonElement> }) {
  const { t } = usePrefs();
  return <Button label={t('state.retry')} icon="refresh" type="outlined" intent="neutral" size={size || SZ} onClick={onClick} />;
}
/** `k` is an i18n key (the prototype passes the key, not the text). */
export function AlertAction({ k, onClick }: { k: string; onClick?: MouseEventHandler<HTMLButtonElement> }) {
  const { t } = usePrefs();
  return <Button label={t(k)} type="transparent" intent="neutral" size="sm" onClick={onClick} />;
}
export function LoadingState({ size = SZ }: { size?: string }) {
  const { t } = usePrefs();
  return (
    <div className={`state s-${size}`} role="status" aria-label={t('state.loading')}>
      <div className="sk" style={{ width: '60%' }} /><div className="sk" style={{ width: '80%' }} /><div className="sk" style={{ width: '45%' }} />
      <p className="mut">{t('state.loading')}</p>
    </div>
  );
}
/** The error box of a data area. Without `title` and `desc` it is the standard one (the standard texts and a Retry button, `onRetry`); with them it is a custom error, with `cta` for its recovery action (DS 2.76: ErrorState and ErrorState are one component). */
export function ErrorState({ icon = 'error_outline', title, desc, cta, size = SZ, onRetry }: { icon?: string; title?: string; desc?: string; cta?: ReactNode; size?: string; onRetry?: MouseEventHandler<HTMLButtonElement> }) {
  const { t } = usePrefs(), std = title === undefined && desc === undefined && cta === undefined;
  return <div className={`state err s-${size}`} role="alert"><Icon name={icon} /><h3>{title ?? t('state.errT')}</h3><p className="mut">{desc ?? t('state.errD')}</p>{std ? <RetryButton size={size} onClick={onRetry} /> : cta}</div>;
}
export function Meter({ v }: { v: number }) {
  return <div className="pb" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${v}%` }} /></div>;
}
