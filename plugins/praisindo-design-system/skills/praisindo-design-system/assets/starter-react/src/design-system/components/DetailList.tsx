// DetailList and DetailItem (DS 2.88, rules DL-01..DL-03): a list of label / value pairs in two layouts. `grid` (was `.c3fl` / `.c3f`): the label above the value, the pairs side by side; for a wide card or panel.
// `rows` (was `.dr-g` / `.dr.dr-s`): the label on the left, the value on the right, a line under each row; for a narrow card or panel. `auto` picks one by the width of the list itself.
import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

export type DetailListLayout = 'grid' | 'rows';
/** Below this width of the list itself `auto` shows rows, from this width on it shows the grid (rule DL-02). */
const DETAIL_LIST_BREAK = 480;
const Ctx = createContext<DetailListLayout>('grid');

export function DetailList({ layout = 'grid', className, style, aria, children }: { layout?: DetailListLayout | 'auto'; /** a class that places the list (for example the two columns of the execution request) */ className?: string; style?: CSSProperties; aria?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState<number | null>(null);
  useEffect(() => {
    if (layout !== 'auto' || !ref.current || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((e) => setW(Math.round(e[0]!.contentRect.width)));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [layout]);
  const L: DetailListLayout = layout === 'auto' ? (w !== null && w < DETAIL_LIST_BREAK ? 'rows' : 'grid') : layout;
  return <Ctx.Provider value={L}><div ref={ref} className={(L === 'rows' ? 'dl-rows' : 'dl-grid') + (className ? ' ' + className : '')} style={style} aria-label={aria}>{children}</div></Ctx.Provider>;
}

/** One label / value pair; it takes the look of the DetailList it is in (grid when it is in none). */
export function DetailItem({ label, children }: { label: string; children?: ReactNode }) {
  return useContext(Ctx) === 'rows'
    ? <div className="dl-row"><span className="mut">{label}</span><div>{children}</div></div>
    : <div className="dl-item"><span>{label}</span><span className="fw6">{children}</span></div>;
}
