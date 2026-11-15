// Port of AnchorNav(key, groups) with its scroll-spy (prototype jumpMark / the scroll listener / the `jump` action): a sticky numbered rail and grouped sections (id = key-gN).
// Clicking a number scrolls to the group and holds the marker for 900 ms; scrolling marks the last group whose top has passed the offset.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { usePrefsOptional } from '../../app/providers/PrefsProvider.tsx';
import { Tooltip } from './Tooltip';

export type JumpGroup = readonly [name: string, body: ReactNode];
export function AnchorNav({ k, groups, tools }: { k: string; groups: readonly JumpGroup[]; tools?: ReactNode }) {
  const t = usePrefsOptional()?.t ?? ((s: string) => s);
  const [cur, setCur] = useState(1), lock = useRef(0), list = useRef<HTMLDivElement>(null), root = useRef<HTMLDivElement>(null);
  const n = groups.length, on = Math.min(cur, n);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (lock.current && Date.now() < lock.current) return;
        const gs: HTMLElement[] = root.current ? Array.from(root.current.querySelectorAll<HTMLElement>('.anv-g')) : [];
        if (!gs.length) return;
        const off = window.innerWidth <= 640 ? 140 : 120;
        let c = 1;
        gs.forEach((g) => { if (g.getBoundingClientRect().top - off <= 0) c = +(g.dataset.g ?? 1); });
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) c = gs.length;
        setCur(c);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);
  useEffect(() => {
    const b = list.current?.querySelector<HTMLElement>('.anv-b.on'), L = list.current;
    if (b && L && L.scrollWidth > L.clientWidth) L.scrollLeft = b.getBoundingClientRect().left - L.getBoundingClientRect().left + L.scrollLeft - L.clientWidth / 2 + b.offsetWidth / 2;   // the button sits inside a Tooltip wrapper, so offsetLeft is not relative to the list
  }, [on]);
  const go = (i: number) => {
    const g = document.getElementById(`${k}-g${i}`);
    if (!g) return;
    setCur(i); lock.current = Date.now() + 900;
    const y = g.getBoundingClientRect().top + window.scrollY - (window.innerWidth <= 640 ? 120 : 80);
    window.scrollTo({ top: Math.max(0, y), behavior: typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  return (
    <div className="anv" data-jump={k} ref={root}>
      <nav className="anv-nav" aria-label={t('jump.nav')}>
        <div className="anv-list" ref={list}>{groups.map(([name], i) => (
          <Tooltip key={i} placement="right" trigger={
            <button type="button" className={`anv-b${i + 1 === on ? ' on' : ''}`} aria-label={i + 1 + '. ' + name} aria-current={i + 1 === on ? 'true' : undefined} onClick={() => go(i + 1)}>
              <span className="anv-n">{i + 1}</span><span className="anv-t">{name}</span></button>}>{name}</Tooltip>))}</div>
        {tools}
      </nav>
      <div className="anv-m">{groups.map(([name, body], i) => <section className="anv-g" id={`${k}-g${i + 1}`} data-g={i + 1} aria-label={name} key={i}>{body}</section>)}</div>
    </div>);
}

/** Group heading used at the top of every jump-rail group (prototype JumpHead). */
export const JumpHead = ({ h, d }: { h: string; d: string }) => <div className="sech"><h2>{h}</h2><p className="mut">{d}</p></div>;
