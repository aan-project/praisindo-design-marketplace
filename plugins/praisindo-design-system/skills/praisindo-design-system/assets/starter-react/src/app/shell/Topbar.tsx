// The topbar of a tablet or a phone (rule SB-33): below 1100px it shows the menu button, the title of the page and the avatar of the user. It is not rendered at 1100px and wider (SB-01).
import { useEffect, useState, type ReactNode } from 'react';
import { Button } from '../../design-system/components/Button';

export function useMediaQuery(q: string): boolean {
  const get = () => typeof matchMedia === 'function' && matchMedia(q).matches;
  const [on, setOn] = useState(get);
  useEffect(() => {
    if (typeof matchMedia !== 'function') return undefined;
    const m = matchMedia(q), f = () => setOn(m.matches); f(); m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, [q]);
  return on;
}

export function Topbar({ title, menuLabel, expanded, onMenu, user }: { title: string; menuLabel: string; expanded: boolean; onMenu: () => void; user: ReactNode }) {
  return (
    <header className="topbar" data-testid="topbar">
      <Button icon="menu" type="transparent" intent="neutral" size="lg" aria={menuLabel} testid="topbar-menu" pressed={expanded} onClick={onMenu} />
      <p className="topbar-t" data-testid="topbar-title">{title}</p>
      <span className="grow" />
      {user}
    </header>
  );
}
