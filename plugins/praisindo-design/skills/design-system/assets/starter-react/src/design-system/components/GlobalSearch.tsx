// The search field of the sidebar and the results it opens (DS 2.70, owner request 2026-11-12, rule SQ-01..SQ-04): a field under the logo and, while the person types, a popover to the right of the sidebar (like the menu of the user)
// with the results in groups (Pages, Content). Up / Down choose, Enter opens, Esc closes, "/" puts the cursor in the field. The list scrolls inside the popover, its group titles stay on top. Presentational: the hits come in as props.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { Input } from './Field';
import { IconTile } from './Hints';
import { EmptyState } from './States';

export interface SiteHit { id: string; icon: string; title: string; sub?: string; href: string }
export interface SiteGroup { key: string; title: string; hits: readonly SiteHit[] }
export interface SiteSearchProps {
  id: string; q: string; groups: readonly SiteGroup[]; label: string; placeholder: string; noneTitle: string; noneDesc: string; clearLabel: string;
  onQuery(v: string): void; onGo(hit: SiteHit): void;
  /** `side` (default): the popover opens to the right of the sidebar; `below`: under the field, for the field in the toolbar (rule PP-03) */ placement?: 'side' | 'below';
}

/** The text with every match of the query in a <mark> (plain substring, never a pattern). */
export function marked(text: string, q: string) {
  const n = q.trim().toLowerCase();
  if (!n) return text;
  const out: (string | JSX.Element)[] = [];
  let i = 0, k = 0;
  for (let j = text.toLowerCase().indexOf(n); j >= 0; j = text.toLowerCase().indexOf(n, i)) {
    if (j > i) out.push(text.slice(i, j));
    out.push(<mark key={k++}>{text.slice(j, j + n.length)}</mark>); i = j + n.length;
  }
  if (i < text.length) out.push(text.slice(i));
  return <>{out}</>;
}

export function GlobalSearch({ id, q, groups, label, placeholder, noneTitle, noneDesc, clearLabel, onQuery, onGo, placement = 'side' }: SiteSearchProps) {
  const [open, setOpen] = useState(false), [cur, setCur] = useState(0), [pos, setPos] = useState({ left: 240, top: 80 });
  const box = useRef<HTMLDivElement>(null), list = useRef<HTMLDivElement>(null);
  const flat = groups.flatMap((g) => g.hits), shown = open && q.trim() !== '';
  const place = () => {
    const el = box.current, sb = el?.closest('.sb') as HTMLElement | null;
    if (!el) return;
    const r = el.getBoundingClientRect(), below = placement === 'below';
    const left = below ? Math.round(r.left) : Math.round((sb ? sb.getBoundingClientRect().right : r.right) + 8), top = below ? Math.round(r.bottom + 4) : Math.round(Math.max(8, r.top - 4));
    setPos((p) => (p.left === left && p.top === top ? p : { left, top }));
  };
  useLayoutEffect(() => { if (shown) place(); });
  useEffect(() => { setCur(0); }, [q]);
  useEffect(() => { list.current?.querySelector('.gs-i.on')?.scrollIntoView?.({ block: 'nearest' }); }, [cur, shown]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null, typing = !!t && (/^(input|textarea|select)$/i.test(t.tagName) || t.isContentEditable);
      if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); document.getElementById(id)?.focus(); }
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [id]);
  const go = (h: SiteHit) => { onGo(h); setOpen(false); (document.getElementById(id) as HTMLInputElement | null)?.blur(); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { if (open) { e.preventDefault(); setOpen(false); } else if (q) onQuery(''); return; }
    if (!shown || !flat.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setCur((c) => (c + 1) % flat.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCur((c) => (c - 1 + flat.length) % flat.length); }
    else if (e.key === 'Enter') { e.preventDefault(); const h = flat[cur]; if (h) go(h); }
  };
  let n = -1;
  return (
    <div className="gs" ref={box}>
      <Input id={id} type="text" icon="search" size="md" auto="off" ph={placeholder} val={q} onChange={(v) => { onQuery(v); setOpen(true); }}
        trail={q ? <button type="button" className="btn b-transparent i-neutral s-sm io" aria-label={clearLabel} title={clearLabel} onClick={() => { onQuery(''); document.getElementById(id)?.focus(); }}><Icon name="close" /></button> : undefined}
        inputProps={{ 'aria-label': label, role: 'combobox', 'aria-expanded': shown, 'aria-controls': id + '-list', onFocus: () => setOpen(true), onKeyDown: onKey }} />
      {shown ? (
        <>
          <div className="upop-scrim" onClick={() => setOpen(false)} />
          <div className="pop upop gs-p" role="dialog" aria-label={label} style={{ left: pos.left, top: pos.top, maxHeight: `calc(100vh - ${pos.top + 16}px)` }}>
            <div className="gs-l" id={id + '-list'} role="listbox" ref={list}>
              {flat.length ? groups.filter((g) => g.hits.length).map((g) => (
                <div key={g.key} role="group" aria-label={g.title}>
                  <p className="grpt gs-g">{g.title} · {g.hits.length}</p>
                  {g.hits.map((h) => { n += 1; const on = n === cur, i = n; return (
                    <a key={h.id} href={h.href} role="option" aria-selected={on} className={`li gs-i${on ? ' on' : ''}`} onMouseEnter={() => setCur(i)} onClick={() => go(h)}>
                      <IconTile icon={h.icon} /><div className="m"><span className="t">{marked(h.title, q)}</span>{h.sub ? <span className="mut">{marked(h.sub, q)}</span> : null}</div>
                    </a>); })}
                </div>)) : <EmptyState size="sm" icon="search_off" title={noneTitle} desc={noneDesc} />}
            </div>
          </div>
        </>) : null}
    </div>
  );
}
