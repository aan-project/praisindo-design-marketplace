// Port of Tabs() and DrawerTabs() (golden: baseline/golden/ui-kit.nav.json). The click action becomes onChange.
import { useEffect, useRef } from 'react';

import { SZ } from './uiSize';
import { Chip } from './Chip';

export type TabItem = readonly [string, string] | readonly [string, string, number];
export interface TabsProps { items: readonly TabItem[]; active?: string; size?: string; variant?: string; onChange?: (v: string) => void }

export function Tabs({ items, active, size = SZ, variant = '', onChange }: TabsProps) {
  const box = useRef<HTMLDivElement>(null);
  // a strip that scrolls sideways keeps the active tab in view (it was clipped at the edge)
  // (F3, 1.79: `offsetLeft` is measured from the offset parent, not from the strip, so the strip was scrolled by the page offset and the first tab was cut at the left: use rects and move only when the tab is out of view)
  useEffect(() => {
    const t = box.current?.querySelector<HTMLElement>('[aria-selected="true"]'), b = box.current;
    if (!t || !b || b.scrollWidth <= b.clientWidth) return;
    const bl = b.getBoundingClientRect().left, tl = t.getBoundingClientRect().left - bl, tr = tl + t.offsetWidth;
    if (tl < 0) b.scrollLeft = Math.max(0, b.scrollLeft + tl - 4); else if (tr > b.clientWidth) b.scrollLeft = b.scrollLeft + tr - b.clientWidth + 4;
  }, [active]);
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
