// Port of DialogCard(), Modal() and Dialog() (golden: baseline/golden/ui-kit.nav.json). Actions become onClick handlers; Escape and the scrim call onClose.
// The prototype shows modals above drawers (Escape closes the modal first): priority 2 against the drawer's 1. Like the prototype, a modal does not take focus.
import type { ReactNode } from 'react';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { MD_ICON, MD_INT, modalKind } from '../../domain/nav';
import { Button } from './Button';
import { useEscapeClose } from './escapeStack';
import { Icon } from './Icon';
import { toOverlay } from './overlayHost';

export interface ModalCardProps { kind?: string; title: string; sub?: string; body?: ReactNode; footer?: ReactNode; icon?: string; id?: string; cls?: string; ariaModal?: boolean }

export function DialogCard({ kind = 'confirm', title, sub = '', body, footer, icon, id = 'modal', cls = '', ariaModal }: ModalCardProps) {
  return (
    <section aria-modal={ariaModal ? 'true' : undefined} className={`mdl i-${MD_INT[kind] || 'brand'}${cls ? ' ' + cls : ''}`} role="alertdialog" aria-labelledby={`${id}-t`} aria-describedby={`${id}-d`} tabIndex={-1} id={id}>
      <span className="mdl-g" aria-hidden="true" />
      <span className="mdl-ic"><Icon name={icon || MD_ICON[kind] || 'help_outline'} /></span>
      <h2 id={`${id}-t`}>{title}</h2>
      {sub ? <p className="mdl-s2">{sub}</p> : null}
      <div className="mdl-b" id={`${id}-d`}>{body}</div>
      {footer ? <div className="mdl-f">{footer}</div> : null}
    </section>
  );
}

export interface ModalProps extends Omit<ModalCardProps, 'cls' | 'ariaModal'> { tone?: string; onClose?: () => void }
export function Modal({ tone, kind, onClose, ...o }: ModalProps) {
  useEscapeClose(() => onClose?.(), 2);
  return toOverlay(
    <>
      <div className="scrim mdl-s" data-testid="scrim" onClick={onClose} />
      <DialogCard {...o} kind={modalKind({ kind, tone })} cls="fx" ariaModal />
    </>,
  );
}

export interface DialogAct { label: string; icon?: string; onClick?: () => void }
export interface DialogTplProps {
  kind: string; title?: string; sub?: string; text?: string; body?: ReactNode; icon?: string; id?: string;
  ok?: Partial<DialogAct> | null; cancel?: DialogAct | null; alt?: DialogAct; onClose?: () => void;
}
/** Ready-made dialog per kind; every text can be overridden. `ok` / `cancel` = null hides that button (as in the prototype). */
export function Dialog({ kind, title, sub, text, body, icon, id = 'dlg', ok: okIn, cancel: cancelIn, alt, onClose }: DialogTplProps) {
  const { t } = usePrefs();
  const i = MD_INT[kind] || 'brand';
  const ok = okIn === null ? null : { label: t(`md.${kind}.ok`), ...(okIn || {}) };
  const cn = cancelIn === null ? null : cancelIn || (['warning', 'danger', 'confirm'].includes(kind) ? { label: t('md.cancel') } : null);
  const two = !!(ok && cn);
  const footer = (
    <>
      {cn ? <Button label={cn.label} type="soft" intent={kind === 'confirm' || kind === 'danger' || kind === 'warning' ? 'neutral' : i} onClick={cn.onClick} /> : null}
      {alt ? <Button label={alt.label} type="outlined" intent={i} onClick={alt.onClick} /> : null}
      {ok ? <Button label={ok.label} icon={ok.icon} type={two || kind !== 'progress' ? 'fill' : 'soft'} intent={i} full={!two} onClick={ok.onClick} /> : null}
    </>
  );
  return (
    <Modal kind={kind} id={id} title={title || t(`md.${kind}.t`)} sub={sub || ''} icon={icon} footer={footer} onClose={onClose}
      body={body ?? <p className="mut">{text || t(`md.${kind}.d`)}</p>} />
  );
}
