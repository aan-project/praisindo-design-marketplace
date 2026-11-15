// Building blocks of the Design System page (prototype dsSec / dsH / dsCode / dsApi / dsDo / dsDemo / dsLogList / dsSwatch).
import { Children, cloneElement, createContext, isValidElement, useContext, type CSSProperties, type ReactElement, type ReactNode } from 'react';
import { usePrefs } from '../../app/providers/PrefsProvider';

import { Icon } from '../../design-system/components/Icon';
import { cv } from '../../lib/cssVar';
import { DS_LIVE } from './dsLog';
import { Chip } from '../../design-system/components/Chip';
import { DS_LEADS, DS_ROUTE, routeDemo, routeRow } from './dsPages';

/** Prototype B(en, id): the text for the current language. */
export function useB(): (en: string, id: string) => string {
  const { prefs } = usePrefs();
  return (en, id) => (prefs.lang === 'id' ? id : en);
}

/** "a:b;c:d" → style object, so the page keeps the prototype's inline styles verbatim. */
export function sty(s: string): CSSProperties {
  const o: Record<string, string> = {};
  for (const part of s.split(';')) {
    const i = part.indexOf(':');
    if (i < 0) continue;
    const k = part.slice(0, i).trim(), v = part.slice(i + 1).trim();
    o[k.startsWith('--') ? k : k.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())] = v;
  }
  return o as CSSProperties;
}

export const DS_GRP: Record<string, string> = { start: 'guide', changes: 'guide', principles: 'guide', colors: 'found', type: 'found', space: 'found', grid4: 'found', icons: 'found', motion: 'found', buttons: 'comp', badges: 'comp', chips: 'comp', alerts: 'comp', forms: 'comp', selection: 'comp', tabs: 'comp', cards: 'comp', lists: 'comp', alog: 'comp', sigrules: 'comp', tables: 'comp', widgets: 'comp', kanban: 'comp', tooltip: 'comp', feedback: 'pat', overlays: 'pat', pagehead: 'pat', layouts: 'pat', nav: 'pat', mobile: 'pat', content: 'qual', scenarios: 'qual' };

export function useGrpName(): (id: string) => string {
  const B = useB();
  return (id) => ({ guide: B('Guide', 'Panduan'), found: B('Foundations', 'Fondasi'), comp: B('Components', 'Komponen'), pat: B('Patterns & layout', 'Pola & tata letak'), qual: B('Content & quality', 'Konten & kualitas') } as Record<string, string>)[DS_GRP[id] ?? ''] ?? '';
}

/** The page being shown (DS 2.75). Without it the sections render whole, as the golden tests and the unit tests read them. */
export const DsViewCtx = createContext<{ page: string } | null>(null);
/** A marker inside a section that holds several items: what follows it belongs to the page `p` (it renders nothing). */
export function DsTo(_: { p: string }) { return null; }

export function DsSec({ id, title, lead, children }: { id: string; title: string; lead?: string; children?: ReactNode }) {
  const grp = useGrpName();
  const view = useContext(DsViewCtx);
  if (view) return <>{viewOf(id, view.page, lead, children)}</>;
  return (
    <section className="card dss" id={`ds-${id}`} data-ds={id}>
      <div className="ch"><div className="dshh"><span className="grpt">{grp(id)}</span><h2>{title}</h2></div></div>
      <div className="cb">{lead ? <p className="dslead">{lead}</p> : null}{children}</div>
    </section>
  );
}

/** What of section `id` belongs to `page`: all of it, or the parts the markers and the tokens give to the page. */
function viewOf(id: string, page: string, lead: string | undefined, children: ReactNode): ReactNode {
  const route = DS_ROUTE[id];
  const head = lead && !DS_LEADS[page] && (!route || route.rest === page) ? <p className="dslead">{lead}</p> : null;   // a page with a lead of its own (dsPages.ts) does not show the lead of the section
  if (!route) return <>{head}{children}</>;
  let cur = route.rest;
  const kept: ReactNode[] = [];
  for (const c of Children.toArray(children)) {
    if (isValidElement(c) && c.type === DsTo) { cur = (c.props as { p: string }).p; continue; }
    if (isValidElement(c) && c.type === DsDemo) { if ((routeDemo(id, (c.props as { label: string }).label) ?? cur) === page) kept.push(c); continue; }
    if (isValidElement(c) && c.type === DsApi) {
      const rows = (c.props as { rows: readonly (readonly [string, string, string, string?])[] }).rows.filter((r) => { const to = routeRow(id, r[0]); return to.length ? to.includes(page) : cur === page; });
      if (rows.length) kept.push(cloneElement(c as ReactElement<{ rows: unknown }>, { rows }));
      continue;
    }
    if (cur === page) kept.push(c);
  }
  return <>{head}{kept}</>;
}
export const DsH = ({ children }: { children: string }) => <h3 className="dsh">{children}</h3>;
export const DsCode = ({ children }: { children: string }) => <code className="dsc">{children}</code>;

export function DsApi({ rows }: { rows: readonly (readonly [string, string, string, string?])[] }) {
  const B = useB();
  return (
    <div className="tw t-sm dsapi">
      <table style={sty('min-width:520px')}>
        <thead><tr><th>{B('Prop', 'Prop')}</th><th>{B('Values', 'Nilai')}</th><th>{B('Default', 'Bawaan')}</th><th>{B('Notes', 'Catatan')}</th></tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}><td><DsCode>{r[0]}</DsCode></td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3] || ''}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
export function DsDo({ dos, donts }: { dos: readonly string[]; donts: readonly string[] }) {
  const B = useB();
  return (
    <div className="dsdd">
      <div className="dsy"><span className="fw6"><Icon name="check_circle" />{B('Do', 'Lakukan')}</span><ul>{dos.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
      <div className="dsn"><span className="fw6"><Icon name="do_not_disturb_on" />{B("Don't", 'Hindari')}</span><ul>{donts.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
    </div>
  );
}
export const DsDemo = ({ label, children }: { label: string; children?: ReactNode }) => <div className="dsx"><span className="dsl">{label}</span><div className="dsv">{children}</div></div>;

export function DsLogList({ rows }: { rows: readonly (readonly [string, string, string])[] }) {
  const B = useB();
  return (
    <div className="dslog">
      {rows.map(([v, en, id]) => <div key={v + "\u0001" + en}><Chip label={'v' + v} selected={v === DS_LIVE.version} /><span>{B(en, id)}</span></div>)}
    </div>
  );
}

export const dsHex = (name: string): string => cv('--' + name).toLowerCase();
/** Colour swatch button: shows the token name and hex; copying is wired by the page through `onCopy` (the data-hex of the prototype). */
export function DsCopy({ name, cls, onCopy, children }: { name: string; cls: string; onCopy?: (hex: string) => void; children: ReactNode }) {
  const B = useB();
  const h = dsHex(name), short = name.replace(/^color-/, '');
  return (
    <button type="button" className={cls} title={B('Copy {h}', 'Salin {h}').replace('{h}', h)} aria-label={B('Copy {t} {h}', 'Salin {t} {h}').replace('{t}', short).replace('{h}', h)} onClick={() => onCopy?.(h)}>
      {children}
    </button>
  );
}
