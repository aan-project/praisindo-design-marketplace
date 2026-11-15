import type { ReactNode } from 'react';

/** HighlightText (DS 2.102, rule HT-01; named Statistic in 2.101): a small text and a highlighted text (a number or a value) as a pair, with the look of the content of a widget. `align` left or right; `valueFirst` puts the big text above the small one (the DOM order stays label, value); `size` sm · md · lg. */
export function HighlightText({ label, value, align = 'left', valueFirst = false, size = 'md', cls = '' }: { label: string; value: ReactNode; align?: 'left' | 'right'; valueFirst?: boolean; size?: 'sm' | 'md' | 'lg'; cls?: string }) {
  return <div className={`hlt hlt-${size}${align === 'right' ? ' hlt-r' : ''}${valueFirst ? ' hlt-vf' : ''}${cls ? ' ' + cls : ''}`}><span className="hlt-l">{label}</span><span className="hlt-v">{value}</span></div>;
}
