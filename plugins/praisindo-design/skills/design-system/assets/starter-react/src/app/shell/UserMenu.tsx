// The user button of the sidebar footer and the menu it opens (rules SB-14, AV-01..AV-05): a static header (avatar, name, email), My preferences, the pages of NV-13 (Branding, Design System), Sign out (danger, only when the product has a sign-in).
import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../design-system/components/Icon';
import { usePrefs } from '../providers/PrefsProvider';
import { useSession } from '../session';
import { PROFILE_NAV } from '../nav.config';

export function UserMenu({ onProfile, onPrefs, variant = 'side' }: { onProfile: () => void; onPrefs: () => void; variant?: 'side' | 'top' }) {
  const { t } = usePrefs(), { sess, signOut } = useSession();
  const [open, setOpen] = useState(false), [left, setLeft] = useState(0);
  const btn = useRef<HTMLButtonElement>(null), pop = useRef<HTMLDivElement>(null);
  const top = variant === 'top', ini = sess.name.split(' ').map((w) => w[0]).join('').slice(0, 2);
  const close = () => setOpen(false);
  const toggle = () => {
    if (open) { close(); return; }
    const sb = btn.current?.closest('.sb') as HTMLElement | null;
    setLeft((sb ? sb.getBoundingClientRect().right : 0) + 8);   // the menu sits to the right of the sidebar, whatever its width is right now
    setOpen(true);
  };
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { close(); btn.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    setTimeout(() => pop.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus(), 0);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  const item = 'btn b-transparent i-neutral s-md';
  return (
    <div className="rel">
      <button ref={btn} className={`user${top ? ' user-top' : ''}${open ? ' open' : ''}`} type="button" aria-haspopup="menu" aria-expanded={open} aria-label={t('hdr.user')} title={sess.name} onClick={toggle}>
        <span className="av">{ini}</span>
        <span className="uname"><span className="fw6">{sess.name}</span></span>
        <Icon name="chevron_right" />
      </button>
      {open && (
        <>
          <div className="upop-scrim" aria-hidden="true" onClick={close} />
          <div ref={pop} className={`pop upop${top ? ' upop-top' : ''}`} role="menu" aria-label={t('hdr.user')} style={top ? undefined : { left }}>
            <div className="uhb"><span className="uh"><span className="av">{ini}</span><span className="uname"><span className="fw6">{sess.name}</span><span className="sub">{sess.email}</span></span></span></div>
            <button type="button" className={item} role="menuitem" data-testid="profile-open" onClick={() => { close(); onProfile(); }}><Icon name="badge" />{t('hdr.profile')}</button>   {/* My profile (AV-06): above My preferences */}
            <button type="button" className={item} role="menuitem" onClick={() => { close(); onPrefs(); }}><Icon name="tune" />{t('hdr.prefs')}</button>
            <a className={item} role="menuitem" href="#/mylog" data-testid="mylog" onClick={close}><Icon name="history" />{t('nav.mylog')}</a>   {/* Activity history: under My preferences, above the divider (rule GN-01) */}
            {PROFILE_NAV.length ? <hr /> : null}
            {PROFILE_NAV.map(([k, ic, label, href]) => <a key={k} className={item} role="menuitem" href={href} data-testid={'user-' + k} onClick={close}><Icon name={ic} />{t(label)}</a>)}
            {signOut ? <><hr /><button type="button" className={`${item} danger`} role="menuitem" onClick={() => { close(); signOut(); }}><Icon name="logout" />{t('hdr.logout')}</button></> : null}
          </div>
        </>
      )}
    </div>
  );
}
