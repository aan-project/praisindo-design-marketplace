// Port of Drawer() (golden: baseline/golden/ui-kit.nav.json): scrim + right-hand dialog with header (optional back, title, close), body and optional footer.
// Behaviour taken from the prototype: Escape and scrim click close, the drawer takes focus once when it opens. The prototype has no focus trap, so none is added.
// Deviation (documented in docs/M3_Plan.md): focus returns to the opener on close, which the prototype does not do.
import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { Button } from './Button';
import { useEscapeClose } from './escapeStack';
import { toOverlay } from './overlayHost';

export interface DrawerProps { title: string; size?: 'sm' | 'md' | 'lg' | 'xl'; id?: string; layer?: string; cls?: string; back?: string; closeLabel?: string;
  onClose: () => void; onBack?: () => void; footer?: ReactNode; /** buttons of the header, left of Close (an icon button) */ actions?: ReactNode; children?: ReactNode }

/** MO-10: a drawer leaves the way it came, to the right. React removes the node at once, so a copy of the drawer and of its scrim stays for the length of the slide-out (`.dw-out`, motion layer) and is removed after it.
 *  Only when motion is on (`data-motion`, MO-03): tests, screenshots and reduced motion see the drawer gone at once. */
function slideOut(aside: HTMLElement | null): void {
  if (!aside || document.documentElement.dataset.motion !== 'on' || !aside.parentElement) return;
  const host = aside.parentElement, scrim = aside.previousElementSibling?.classList.contains('scrim') ? aside.previousElementSibling : null;
  const copies = [scrim, aside].filter((n): n is Element => !!n).map((n) => {
    const c = n.cloneNode(true) as HTMLElement; c.removeAttribute('id'); c.querySelectorAll('[id]').forEach((e) => e.removeAttribute('id')); c.setAttribute('aria-hidden', 'true'); c.setAttribute('inert', ''); c.classList.add('dw-out'); host.appendChild(c); return c;
  });
  const done = () => copies.forEach((c) => c.remove());
  copies[copies.length - 1]!.addEventListener('animationend', done, { once: true }); setTimeout(done, 600);
}

export function Drawer({ title, size = 'md', id = 'drawer', layer = '', cls = '', back = '', closeLabel = 'Close', onClose, onBack, footer, actions, children }: DrawerProps) {
  const ref = useRef<HTMLElement>(null);
  useEscapeClose(onClose, 1);
  useLayoutEffect(() => () => slideOut(ref.current), []);   // layout cleanup: the node is still in the document
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    return () => { if (opener && typeof opener.focus === 'function') opener.focus(); };
  }, []);
  return toOverlay(
    <>
      <div className={`scrim ${layer}`} data-testid="scrim" onClick={onClose} />
      <aside ref={ref} className={`drawer ${layer} dw-${size}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} id={id}>
        <div className={`dh ${cls}`}>
          {back ? <Button icon="arrow_back" type="transparent" intent="neutral" aria={back} testid="dback" onClick={onBack} /> : null}
          <h2>{title}</h2>
          {actions ? <span className="dhr">{actions}<Button icon="close" type="transparent" intent="neutral" aria={closeLabel} testid="dclose" onClick={onClose} /></span> : <Button icon="close" type="transparent" intent="neutral" aria={closeLabel} testid="dclose" onClick={onClose} />}
        </div>
        <div className="db">{children}</div>
        {footer ? <div className="df">{footer}</div> : null}
      </aside>
    </>,
  );
}
