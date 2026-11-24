// Port of Tabs() and DrawerTabs() (golden: baseline/golden/ui-kit.nav.json). The click action becomes onChange.
import { useContext, useEffect, useRef } from 'react';
import { DetailPageContext } from '../detailContext';

import { SZ } from './uiSize';
import { Chip } from './Chip';

export type TabItem = readonly [string, string] | readonly [string, string, number];
export interface TabsProps { items: readonly TabItem[]; active?: string; size?: string; variant?: string; onChange?: (v: string) => void }

export function Tabs({ items, active, size = SZ, variant, onChange }: TabsProps) {
  const box = useRef<HTMLDivElement>(null), inDetail = useContext(DetailPageContext);
  if (variant === undefined && inDetail) variant = 'seg';   // rule DT-19: on a detail page the tabs are segmented by themselves
  // a strip that scrolls sideways keeps the active tab in view (it was clipped at the edge)
  // (F3, 1.79: `offsetLeft` is measured from the offset parent, not from the strip, so the strip was scrolled by the page offset and the first tab was cut at the left: use rects and move only when the tab is out of view)
  useEffect(() => {
    const t = box.current?.querySelector<HTMLElement>('[aria-selected="true"]'), b = box.current;
    if (!t || !b || b.scrollWidth <= b.clientWidth) return;
    const bl = b.getBoundingClientRect().left, tl = t.getBoundingClientRect().left - bl, tr = tl + t.offsetWidth;
    if (tl < 0) b.scrollLeft = Math.max(0, b.scrollLeft + tl - 4); else if (tr > b.clientWidth) b.scrollLeft = b.scrollLeft + tr - b.clientWidth + 4;
  }, [active]);
  // rule TB-34 (owner 2026-11-23): every tab bar that does not fit scrolls sideways with the mouse too: the wheel moves it and a drag with the mouse moves it (a scroll bar alone is hidden on many systems)
  useEffect(() => {
    const b = box.current; if (!b) return undefined;
    let down = false, moved = false, sx = 0, sl = 0;
    const wheel = (e: WheelEvent) => { if (b.scrollWidth <= b.clientWidth || Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return; b.scrollLeft += e.deltaY; e.preventDefault(); };
    const pd = (e: PointerEvent) => { if (e.pointerType !== 'mouse' || e.button !== 0 || b.scrollWidth <= b.clientWidth) return; down = true; moved = false; sx = e.clientX; sl = b.scrollLeft; };
    const pm = (e: PointerEvent) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) { moved = true; b.classList.add('drag'); } if (moved) b.scrollLeft = sl - dx; };
    const pu = () => { down = false; b.classList.remove('drag'); };
    const click = (e: MouseEvent) => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } };   // a drag is not a click on the tab under the pointer
    b.addEventListener('wheel', wheel, { passive: false }); b.addEventListener('pointerdown', pd); b.addEventListener('click', click, true); window.addEventListener('pointermove', pm); window.addEventListener('pointerup', pu);
    return () => { b.removeEventListener('wheel', wheel); b.removeEventListener('pointerdown', pd); b.removeEventListener('click', click, true); window.removeEventListener('pointermove', pm); window.removeEventListener('pointerup', pu); };
  }, []);
  return (
    <div ref={box} className={`tabs${variant === 'seg' ? ' t-seg' : ''}`} role="tablist">
      {items.map(([v, l, n]) => (
        <button key={v} role="tab" className={`tab s-${size}`} aria-selected={v === active} onClick={() => onChange?.(v)}>
          <span>{l}</span>{n !== undefined ? <Chip label={String(n)} selected={v === active} tone="default" /> : null}
        </button>
      ))}
    </div>
  );
}

/** Tab bar inside a drawer: always segmented. */
export function DrawerTabs(p: Omit<TabsProps, 'variant'>) {
  return <div className="dtabs"><Tabs {...p} variant="seg" /></div>;
}
