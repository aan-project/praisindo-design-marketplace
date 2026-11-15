// The "more" button of the action row of the sidebar (DS 2.71, rule PP-02): when the row has more than three items, the first three stay and the rest are in the dropdown of this button. The dropdown is a popover
// to the right of the sidebar (the position of the user menu); a click on an item closes it. Made of the Button and the shared popover only.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from '../../design-system/components/Button';
import { usePrefs } from '../providers/PrefsProvider';

export function UtilMore({ children }: { children: ReactNode }) {
  const { t } = usePrefs(), [open, setOpen] = useState(false), [pos, setPos] = useState({ left: 240, bottom: 16 });
  const box = useRef<HTMLSpanElement>(null);
  const toggle = () => {
    if (open) { setOpen(false); return; }
    const el = box.current, sb = el?.closest('.sb') as HTMLElement | null;
    if (el) setPos({ left: Math.round((sb ? sb.getBoundingClientRect().right : el.getBoundingClientRect().right) + 8), bottom: Math.max(16, Math.round(window.innerHeight - el.getBoundingClientRect().bottom)) });
    setOpen(true);
  };
  useEffect(() => {
    if (!open) return undefined;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [open]);
  return (
    <span className="umore" ref={box}>
      <Button icon="more_horiz" type="transparent" intent="neutral" size="md" aria={t('hdr.more')} title={t('hdr.more')} testid="util-more" expanded={open} onClick={toggle} />
      {open ? (
        <>
          <div className="upop-scrim" aria-hidden="true" onClick={() => setOpen(false)} />
          <div className="pop upop umpop" role="menu" aria-label={t('hdr.more')} style={{ left: pos.left, bottom: pos.bottom }} onClick={() => setTimeout(() => setOpen(false), 0)}>{children}</div>
        </>) : null}
    </span>
  );
}
