// Option card: a selectable card for choosing one template or plan (aria-pressed). Extracted from the rule editor's template cards (markup unchanged, v1.66).
// Selected: soft brand fill and a filled circle with a check. Disabled: not clickable, muted. Tags are soft Badges (category labels, neutral, sm, in a `.rw` row); `selLabel` is the screen-reader text of the selected state.

import { Icon } from './Icon';
import { Chip } from './Chip';

export interface OptionCardProps { title: string; desc: string; tags?: readonly string[]; selected: boolean; selLabel?: string; disabled?: boolean; onSelect?: () => void }

export function RadioCard({ title, desc, tags = [], selected, selLabel, disabled, onSelect }: OptionCardProps) {
  return (
    <button type="button" className={`rdc${selected ? ' on' : ''}`} aria-pressed={selected} disabled={disabled || undefined} onClick={onSelect}>
      <span className="rdc-h"><span className="rdc-ck" aria-hidden="true">{selected ? <Icon name="check" /> : null}</span><span className="fw6 rdc-n">{title}</span>{selected && selLabel ? <span className="sr-only">{selLabel}</span> : null}</span>
      <span className="rdc-d">{desc}</span>{tags.length ? <span className="rw">{tags.map((x) => <Chip key={x} label={x} />)}</span> : null}
    </button>
  );
}
