// A recommendation plan to choose (rule DR-15, owner decision 2026-11-26, option R3): a radio card with a header strip (the label and the stars) and a body (title, amount and score line, a thin score meter, tags).
// Selected: 2px brand border, brand soft header and a check circle. `selLabel` is the screen-reader text of the selected state.
import { Icon } from './Icon';
import { Chip } from './Chip';

export interface PlanCardProps { /** a read-only card (the recommendation already chosen, shown in Take Action): not a button, always in the selected look */ fixed?: boolean; label: string; stars?: number | null; title: string; desc: string; score?: number | null; tags?: readonly string[]; selected: boolean; selLabel?: string; onSelect?: () => void }

export function PlanCard({ fixed, label, stars, title, desc, score, tags = [], selected, selLabel, onSelect }: PlanCardProps) {
  const n = Math.max(0, Math.min(5, Math.round(stars ?? 0)));
  const body = (<>
      <span className="plc-h">
        <span className="plc-ck" aria-hidden="true">{selected ? <Icon name="check" /> : null}</span>
        <span className="plc-l">{label}</span>{selected && selLabel ? <span className="sr-only">{selLabel}</span> : null}
        {stars != null ? <span className="plc-st" role="img" aria-label={n + '/5'}>{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name={i < n ? 'star' : 'star_border'} />)}</span> : null}
      </span>
      <span className="plc-b">
        <span className="plc-t">{title}</span>
        <span className="plc-d">{desc}</span>
        {score != null ? <span className="plc-m" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score}><i style={{ width: Math.max(0, Math.min(100, score)) + '%' }} /></span> : null}
        {tags.length ? <span className="rw">{tags.map((x) => <Chip key={x} label={x} />)}</span> : null}
      </span>
  </>);
  return fixed ? <div className="plc on fixed">{body}</div> : <button type="button" role="radio" aria-checked={selected} className={`plc${selected ? ' on' : ''}`} onClick={onSelect}>{body}</button>;
}
