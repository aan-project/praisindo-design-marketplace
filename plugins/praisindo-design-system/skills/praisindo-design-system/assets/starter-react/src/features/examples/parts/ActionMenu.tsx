// The ⋮ action menu of a table row or a card (rules MN-01, MN-02, TB-09): a `.pop role=menu` at the trigger (above it when there is no room below), one transparent
// Button per item, dangerous items last with the danger intent. useActionMenu gives the focus, arrows, Home / End, Escape and the outside click.
import { useRef } from 'react';
import { usePrefs } from '../../../app/providers/PrefsProvider';
import { Button } from '../../../design-system/components/Button';
import { toOverlay } from '../../../design-system/components/overlayHost';
import { useActionMenu } from '../../../design-system/components/popoverHost';

export interface MenuPos { id: string; top: number; right: number }
export interface MenuItem { k: string; icon: string; labelKey: string; danger?: boolean; disabled?: boolean }
/** Where the menu opens for a trigger rectangle: below it, or above it when n rows of 36px do not fit under it. */
export function menuPos(id: string, el: HTMLElement, n: number): MenuPos {
  const r = el.getBoundingClientRect(), h = n * 36 + 16;
  return { id, top: r.bottom + 4 + h > innerHeight ? Math.max(8, r.top - h - 4) : r.bottom + 4, right: innerWidth - r.right };
}
export function ActionMenu(p: { pos: MenuPos; items: readonly MenuItem[]; onPick: (k: string, id: string) => void; onClose: () => void }) { return <RowMenuBox key={p.pos.id} {...p} />; }
function RowMenuBox({ pos, items, onPick, onClose }: { pos: MenuPos; items: readonly MenuItem[]; onPick: (k: string, id: string) => void; onClose: () => void }) {
  const { t } = usePrefs(), ref = useRef<HTMLDivElement>(null);
  useActionMenu(ref, onClose);
  return toOverlay(
    <div className="pop" role="menu" ref={ref} style={{ position: 'fixed', top: pos.top, right: pos.right }}>
      {items.map((it) => <Button key={it.k} label={t(it.labelKey)} icon={it.icon} type="transparent" intent={it.danger ? 'danger' : 'neutral'} disabled={it.disabled} onClick={() => onPick(it.k, pos.id)} />)}
    </div>);
}
