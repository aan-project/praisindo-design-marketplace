// Design System page (route `design`): the 53 pages one under the other (DS 2.77, owner choice B of 2026-11-12), the menu on the left always open in three levels, the spy marks the page in view, `#/design/<id>` scrolls to a page, the search by name in the hero.
// `DesignSections` renders every section whole (the long page of before) for the golden tests; the product only shows `DesignPage`.
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { useToast } from '../../app/providers/ToastProvider';
import { Dialog } from '../../design-system/components/Modal';
import { Drawer } from '../../design-system/components/Drawer';
import { fill } from '../../i18n/fill';
import { dfmt } from '../../lib/dateFormat';

import { Button } from '../../design-system/components/Button';
import { EmptyState } from '../../design-system/components/States';
import { Input } from '../../design-system/components/Field';
import { ChangesSection, ColorsSection, IconsSection, PrinciplesSection, SpaceSection, StartSection, TypeSection } from './GuideSections';
import { AlertsSection, BadgesSection, ButtonsSection, ChipsSection, CopySection, WidgetsSection } from './ComponentSections';
import { OverlaysSection } from './OverlaySections';
import { TooltipSection } from './TooltipSection';
import { TablesSection } from './ListSections';
import { ActivityLogSection } from './ActivitySection';
import { ProjectSection } from './ProjectSection';
import { ContentSection, FeedbackSection, KanbanSection, MotionSection, LayoutsSection, MobileSection, NavSection, PageheadSection } from './PatternSections';
import { CardsSection, FormsSection, SelectionSection, TabsSection } from './FormSections';
import { DsLogList, DsViewCtx, useB } from './ds';
import { DS_LIVE, latestEntry } from './dsLog';
import { Grid4Section } from './Grid4Section';
import { dsPage, orderedPages, orderedSubs, resolveDsPage, searchPages, DS_LEADS, DS_PAGE_IDS, DS_SUBS, type DsGroup, type DsPageDef, type DsSub } from './dsPages';
import { buildCodeIndex, findCodeTarget, searchCode, type CodeHit, type CodeIndex } from './dsCodeIndex';
import { Icon } from '../../design-system/components/Icon';
import { DS_HERO_DOWN, DS_HERO_ROOM, DS_HERO_UP, DS_LOCK_MS, DS_SHOW_TOP_AT, dsLogHit, dsSpyPick } from './dsModel';
import { Chip } from '../../design-system/components/Chip';


/** Section ids (the old long page, shown whole at `#/design/all`). A project adds its own components in ProjectSection, never in the standard sections. */
export const DS_ORDER = ['start', 'changes', 'principles', 'project', 'colors', 'type', 'space', 'grid4', 'icons', 'motion', 'buttons', 'badges', 'chips', 'copy', 'alerts', 'forms', 'selection', 'tabs', 'cards', 'tables', 'alog', 'widgets', 'kanban', 'tooltip', 'feedback', 'overlays', 'pagehead', 'layouts', 'nav', 'mobile', 'content'] as const;
/** Sections added after the migration (not in the frozen prototype, so not in the golden files). */
export const DS_ADDED: ReadonlySet<string> = new Set(['kanban', 'motion', 'tooltip', 'grid4', 'chips', 'copy', 'alog']);
const reduced = (): boolean => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Clipboard copy with the prototype's fallback (hidden textarea + execCommand). Resolves to whether it worked. */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; }
  } catch { /* fall through to the textarea route */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(ta); ta.select();
    const r = document.execCommand('copy');
    ta.remove();
    return r;
  } catch { return false; }
}

/** Full change history drawer with its own search (prototype dsLogDrawer). */
function LogDrawer({ onClose }: { onClose: () => void }) {
  const B = useB();
  const { t, prefs } = usePrefs();
  const [q, setQ] = useState('');
  const rows = DS_LIVE.log.filter((r) => dsLogHit(r, q));
  const searching = !!q.trim();
  const count = searching
    ? fill(B('{n} of {t} changes match', '{n} dari {t} perubahan cocok'), { n: rows.length, t: DS_LIVE.log.length })
    : fill(B('{n} changes · version {v} · updated {d}', '{n} perubahan · versi {v} · diperbarui {d}'), { n: DS_LIVE.log.length, v: DS_LIVE.version, d: dfmt(DS_LIVE.updated, prefs.lang) });
  return (
    <Drawer title={B("What's new — full history", 'Yang baru — riwayat lengkap')} size="md" onClose={onClose} footer={<Button label={t('take.close')} type="transparent" intent="neutral" onClick={onClose} />}>
      <div className="dslogq">
        <Input id="dslogq" type="search" icon="search" size="md" auto="off" ph={B('Search changes or a version, e.g. "toast" or "1.2"', 'Cari perubahan atau versi, mis. "toast" atau "1.2"')} val={q} onChange={setQ}
          inputProps={{ 'aria-label': B('Search the change history', 'Cari di riwayat perubahan'), 'aria-controls': 'dsloglist' }}
          trail={q ? <Button icon="close" type="transparent" intent="neutral" size="sm" aria={B('Clear search', 'Hapus pencarian')} testid="dslogclear" onClick={() => { setQ(''); document.getElementById('dslogq')?.focus(); }} /> : undefined} />
        <p className="mut" id="dslogcount" aria-live="polite">{count}</p>
      </div>
      <div id="dsloglist"><DsLogList rows={rows} /></div>
      <div id="dslognone" style={{ display: searching && !rows.length ? '' : 'none' }}>
        <EmptyState size="sm" icon="search_off" title={B('No changes match', 'Tidak ada perubahan yang cocok')} desc={B('Try another word or a version number.', 'Coba kata lain atau nomor versi.')} />
      </div>
    </Drawer>
  );
}

/** A row of the result list: a page (with the alias that matched), or a name of the code (DS-27). */
export type SearchRow = { kind: 'page'; page: DsPageDef; alias?: string } | CodeHit;
/** The text of a name with the part that matches `q` cut out: [before, match, after]. */
const markParts = (name: string, q: string): [string, string, string] => { const t = q.trim().toLowerCase(), i = t ? name.toLowerCase().indexOf(t) : -1; return i < 0 ? [name, '', ''] : [name.slice(0, i), name.slice(i, i + t.length), name.slice(i + t.length)]; };

export interface DesignPageProps {
  /** The page to scroll to (an id of `DS_PAGES`) when the page opens; the long page starts at the top when absent. */
  page?: string;
  /** Shows a toast (copy result, sample toast). The route supplies the shell's toast. */
  onToast?: (msg: string, intent?: string) => void;
  /** Plays the page-transition demo. The route supplies the shell's veil. */
  onVeil?: () => void;
}

/** The sections of the page with the drawer / dialog / change-history layers their demos open. Shared by the page and by the whole-sections view. */
function useDsSections({ onToast, onVeil }: Pick<DesignPageProps, 'onToast' | 'onVeil'>) {
  const { t, prefs } = usePrefs();
  const [log, setLog] = useState(false);
  const [demo, setDemo] = useState<string | null>(null);
  const [modal, setModal] = useState<string | null>(null);
  const copy = (hex: string) => {
    void copyText(hex).then((ok) => (ok ? onToast?.(fill(t('ds.copied'), { h: hex })) : onToast?.(fill(t('ds.copyFail'), { h: hex }), 'danger')));
  };
  const sample = prefs.lang === 'id' ? 'Contoh toast: 3 data berhasil disimpan.' : 'Sample toast: 3 records saved.';
  const sections: Record<string, ReactNode> = {
    start: <StartSection />, changes: <ChangesSection onOpenLog={() => setLog(true)} />, principles: <PrinciplesSection />, colors: <ColorsSection onCopy={copy} />,
    type: <TypeSection />, space: <SpaceSection />, grid4: <Grid4Section />, icons: <IconsSection />,
    buttons: <ButtonsSection />, badges: <BadgesSection />, chips: <ChipsSection />, copy: <CopySection />, alerts: <AlertsSection />,
    forms: <FormsSection />, selection: <SelectionSection />, tabs: <TabsSection />, cards: <CardsSection />, widgets: <WidgetsSection />, tables: <TablesSection />, alog: <ActivityLogSection />, kanban: <KanbanSection />, motion: <MotionSection onVeil={onVeil} />, tooltip: <TooltipSection />,
    overlays: <OverlaysSection onDrawer={(_d, size) => setDemo(size)} onToast={() => onToast?.(sample)} onModal={setModal} />,
    feedback: <FeedbackSection />, pagehead: <PageheadSection />, layouts: <LayoutsSection />, nav: <NavSection />, mobile: <MobileSection />, content: <ContentSection />, project: <ProjectSection />,
  };
  const layers = (
    <>
      {log ? <LogDrawer onClose={() => setLog(false)} /> : null}
      {demo ? (
        <Drawer title={t('fnd.drawer') + ' · ' + t('size.' + demo)} size={demo as 'sm' | 'md' | 'lg' | 'xl'} onClose={() => setDemo(null)}
          footer={<><Button label={t('fnd.cancel')} type="transparent" intent="neutral" onClick={() => setDemo(null)} /><Button label={t('fnd.save')} onClick={() => setDemo(null)} /></>}>
          <p>{t('fnd.drawerBody')}</p>
          <Input id="dd" label={t('fnd.name')} ph={t('fnd.search')} size="md" />
        </Drawer>
      ) : null}
      {modal ? <Dialog kind={modal} id="dsmodal" ok={{ onClick: () => setModal(null) }} cancel={['warning', 'danger', 'confirm'].includes(modal) ? { label: t('md.cancel'), onClick: () => setModal(null) } : null} onClose={() => setModal(null)} /> : null}
    </>
  );
  return { sections, layers, searchOff: false };
}

/** Every section whole, one card each, in the order of `DS_ORDER` (no menu, no search): what the golden tests of the sections read. */
export function DesignSections(props: Pick<DesignPageProps, 'onToast' | 'onVeil'>) {
  const { sections, layers } = useDsSections(props);
  return <div className="ds ds-all"><div className="dsmain" id="dsmain">{DS_ORDER.map((id) => <Fragment key={id}>{sections[id]}</Fragment>)}</div>{layers}</div>;
}

const GROUPS: readonly DsGroup[] = ['guide', 'found', 'comp', 'asm', 'pat', 'qual'];

export function DesignPage({ page: pageId, onToast, onVeil }: DesignPageProps) {
  const B = useB();
  const { prefs } = usePrefs();
  const { sections, layers, searchOff } = useDsSections({ onToast, onVeil });
  const target = pageId ? dsPage(pageId)?.id ?? '' : '';
  const root = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState('');
  const [showTop, setShowTop] = useState(false);
  const heroWrap = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);
  const acc = useRef(0);
  const [hero, setHero] = useState<'top' | 'hide' | 'mini'>('top');   // large hero in the flow, or the small hero fixed at the top: shown when scrolling up, hidden when scrolling down (rule DS-15)
  const [open, setOpen] = useState(false);
  const [act, setAct] = useState(0);
  const [on, setOn] = useState<string>(target || 'start');   // the page in view: the entry of the menu that is marked
  const lock = useRef(0), firstScroll = useRef(true);
  const codeIdx = useRef<CodeIndex | null>(null);   // the code names of the examples, read from the page on the first search (rule DS-27)
  const found = open && q.trim() && !searchOff ? (() => {
    if (!codeIdx.current && root.current) codeIdx.current = buildCodeIndex(root.current, DS_PAGE_IDS);
    const code = codeIdx.current ? searchCode(codeIdx.current, q) : { comps: [], classes: [], tokens: [] }, pg = searchPages(q);
    const all = <T,>(a: T[]) => ({ rows: a });   // every result is listed (owner decision 2026-11-13): the list scrolls
    return { page: all(pg), comp: all(code.comps), class: all(code.classes), token: all(code.tokens) };
  })() : null;
  /** The rows the person can choose, in the order they are shown: the pages, then the components, the classes and the tokens. */
  const hits: SearchRow[] = found ? [...found.page.rows.map((h): SearchRow => ({ kind: 'page', page: h.page, alias: h.alias })), ...found.comp.rows, ...found.class.rows, ...found.token.rows] : [];
  const grpName = (g: DsGroup) => ({ guide: B('Guide', 'Panduan'), found: B('Foundations', 'Fondasi'), comp: B('Components', 'Komponen'), asm: B('Assembled components', 'Komponen rakitan'), pat: B('Patterns & layout', 'Pola & tata letak'), qual: B('Content & quality', 'Konten & kualitas') } as Record<DsGroup, string>)[g];
  const subName = (s: DsSub) => B(DS_SUBS[s][0], DS_SUBS[s][1]);
  const pages = orderedPages(prefs.lang), subs = orderedSubs(prefs.lang);   // A to Z by the names of the language shown (rule DS-25)
  const nameOf = (p: { en: string; idn: string }) => B(p.en, p.idn);

  // The hero and the back-to-top button follow the scroll like before (rule DS-15).
  useEffect(() => {
    let raf = 0;
    const place = () => {
      const w = heroWrap.current, el = root.current; if (!w || !el) return;
      const r = w.getBoundingClientRect(), y = window.scrollY, dy = y - lastY.current;
      el.style.setProperty('--hero-l', `${Math.round(r.left)}px`); el.style.setProperty('--hero-w', `${Math.round(r.width)}px`);   // the small hero is fixed: it follows the content area
      acc.current = Math.sign(dy) === Math.sign(acc.current) ? acc.current + dy : dy;   // distance scrolled in the current direction: a small correction of the browser (scroll into view) must not flip the hero
      if (r.bottom > 0) { setHero('top'); acc.current = 0; } else if (acc.current <= -DS_HERO_UP) setHero('mini'); else if (acc.current >= DS_HERO_DOWN) setHero('hide'); else setHero((h) => (h === 'top' ? 'hide' : h));
      lastY.current = y;
    };
    const spy = () => {   // the page in view: the last one whose top passed the small hero (silent while a click scroll runs)
      const el = root.current; if (!el || Date.now() < lock.current) return;
      const S = [...el.querySelectorAll<HTMLElement>('.dss')];
      const i = dsSpyPick(S.map((e) => e.getBoundingClientRect().top), window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4);
      const id = S[i]?.dataset.ds; if (id) setOn(id);
    };
    const onScroll = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; spy(); place(); setShowTop(window.scrollY > DS_SHOW_TOP_AT); }); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', place);
    const ro = typeof ResizeObserver === 'function' && heroWrap.current ? new ResizeObserver(place) : null; if (ro && heroWrap.current) ro.observe(heroWrap.current);
    lastY.current = window.scrollY; spy(); place();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', place); ro?.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, []);

  // Keep the current entry visible when the menu itself scrolls (sticky menu on wide screens).
  useEffect(() => {
    const L = root.current?.querySelector<HTMLElement>('.dstoc'); const b = L?.querySelector<HTMLElement>('button.on');
    if (!L || !b || L.scrollHeight <= L.clientHeight + 2 || getComputedStyle(L).position !== 'sticky') return;
    const bt = b.offsetTop, bb = bt + b.offsetHeight;
    if (bt < L.scrollTop + 8 || bb > L.scrollTop + L.clientHeight - 8) L.scrollTop = bt - L.clientHeight / 2;
  }, [on]);

  /** Scrolls to the page `id` (a click on the menu, a result of the search, the address). The spy is silent while the scroll runs. */
  const scrollTo = (id: string, smooth: boolean) => {
    lock.current = Date.now() + DS_LOCK_MS; setOn(id);
    setTimeout(() => window.dispatchEvent(new Event('scroll')), DS_LOCK_MS + 50);   // run the spy once when the lock ends so a scroll made inside it is not lost
    const el = document.getElementById('ds-' + id);   // 76px of room: the small hero (60px) can be on screen when the click scrolls up
    if (el && window.scrollTo) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - DS_HERO_ROOM - (document.querySelector<HTMLElement>('.topbar')?.offsetHeight ?? 0), behavior: smooth && !reduced() ? 'smooth' : 'auto' });
  };
  const go = (id: string) => { if (window.location.hash === '#/design/' + id) scrollTo(id, true); else window.location.hash = '#/design/' + id; };   // the address names the page (a link, the back button); a change of it scrolls
  useEffect(() => { if (target) scrollTo(target, !firstScroll.current); firstScroll.current = false; }, [target]);   // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (open) document.getElementById('dsr-' + act)?.scrollIntoView?.({ block: 'nearest' }); }, [act, open]);   // the chosen row stays in view while the keys move through a long list
  const clear = () => { const i = document.getElementById('dsq') as HTMLInputElement | null; if (i) { i.value = ''; i.focus(); } setQ(''); setOpen(false); };
  const pick = (h: SearchRow) => {
    setOpen(false); setQ(''); const i = document.getElementById('dsq') as HTMLInputElement | null; if (i) i.value = '';
    const id = h.kind === 'page' ? h.page.id : h.page; go(id);
    if (h.kind === 'page' || h.kind === 'token') return;
    setTimeout(() => {   // the example that uses the class or names the component is shown (after the scroll to its page)
      const card = document.getElementById('ds-' + id), t = card ? findCodeTarget(card, h) : null; if (!t) return;
      t.scrollIntoView?.({ behavior: reduced() ? 'auto' : 'smooth', block: 'center' }); t.classList.add('ds-hit'); setTimeout(() => t.classList.remove('ds-hit'), 2400);
    }, DS_LOCK_MS);
  };
  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { if (!hits.length) return; e.preventDefault(); setAct((a) => (a + (e.key === 'ArrowDown' ? 1 : hits.length - 1)) % hits.length); }
    else if (e.key === 'Enter') { const h = hits[act] ?? hits[0]; if (h) { e.preventDefault(); pick(h); } }
    else if (e.key === 'Escape') { e.preventDefault(); if (open && hits.length) setOpen(false); else if (q) clear(); }
  };
  const top = () => { window.scrollTo?.({ top: 0, behavior: reduced() ? 'auto' : 'smooth' }); (document.getElementById('dsq') as HTMLInputElement | null)?.focus({ preventScroll: true }); };
  const none = !!q.trim() && !searchOff && searchPages(q).length === 0 && !(codeIdx.current && (q.trim().length >= 2) && (() => { const c = searchCode(codeIdx.current!, q); return c.comps.length + c.classes.length + c.tokens.length > 0; })());

  return (
    <div className="ds" ref={root}>
      <div className="dshero-wrap" ref={heroWrap}>
      <div className={`dshero ${hero}`}>
        <div className="dshero-th"><h1 className="dshero-t">{B('Design System', 'Design System')}</h1><Chip label={'v' + (latestEntry(DS_LIVE.log)?.[0] ?? DS_LIVE.version)} /></div>
        <div className={`dsq${searchOff ? ' off' : ''}`}>
          <Input id="dsq" type="search" icon="search" size="md" auto="off" ph={B('Search pages, classes, tokens', 'Cari halaman, class, token')} val=""
            inputProps={{ 'aria-label': B('Search the design system', 'Cari di design system'), role: 'combobox', 'aria-expanded': hits.length > 0, 'aria-autocomplete': 'list', 'aria-controls': hits.length ? 'dsres' : 'dsmain', 'aria-activedescendant': hits.length ? `dsr-${act}` : undefined, onKeyDown: onKey, onFocus: () => setOpen(true), onBlur: () => setOpen(false), onChange: (e: React.ChangeEvent<HTMLInputElement>) => { setQ(e.target.value); setAct(0); setOpen(true); }, ...(searchOff ? { disabled: true } : {}) }}
            trail={q && !searchOff ? <Button icon="close" type="transparent" intent="neutral" size="sm" aria={B('Clear search', 'Hapus pencarian')} testid="dsclear" onClick={clear} /> : undefined} />
          {found && hits.length ? (
            <ul className="dsres" id="dsres" role="listbox" aria-label={B('Search results', 'Hasil pencarian')}>
              {(() => {
                let n = 0;
                const G = (key: 'page' | 'comp' | 'class' | 'token', title: string, g: { rows: unknown[] }, row: (i: number) => ReactNode) => (g.rows.length ? (
                  <Fragment key={key}>
                    <li role="presentation" className="dsrg"><span>{title}</span><span className="n">{g.rows.length}</span></li>
                    {g.rows.map((_, i) => row(i))}
                  </Fragment>) : null);
                const opt = (i: number, kind: SearchRow['kind'], icon: string, id: string | undefined, body: ReactNode, h: SearchRow) => (
                  <li key={kind + i + (id ?? '')} id={`dsr-${i}`} role="option" aria-selected={i === act} data-id={id} data-kind={kind} className={`dsro k-${kind}`} onMouseDown={(e) => { e.preventDefault(); pick(h); }}>
                    <span className="dsri"><Icon name={icon} /></span><span className="dsrb">{body}</span>
                  </li>);
                const code = (h: CodeHit, label: string) => { const m = markParts(h.name, q.replace(/^(\.|--)/, '')); return <><code className="nm">{m[0]}{m[1] ? <mark>{m[1]}</mark> : null}{m[2]}</code><span className="pr">{label}</span></>; };
                const where = (h: CodeHit) => { const p = dsPage(h.page); return fill(h.pages > 1 ? B('on the page {p}, and {n} more', 'di halaman {p}, dan {n} lainnya') : B('on the page {p}', 'di halaman {p}'), { p: p ? nameOf(p) : h.page, n: h.pages - 1 }); };
                return <>
                  {G('page', B('Pages', 'Halaman'), found.page, (i) => { const h = found.page.rows[i]!; const o = n++; const m = markParts(nameOf(h.page), q); return opt(o, 'page', 'description', h.page.id, <><span className="nm">{m[0]}{m[1] ? <mark>{m[1]}</mark> : null}{m[2]}</span><span className="pr">{(h.page.sub ? subName(h.page.sub) : grpName(h.page.grp)) + (h.alias ? ' · ' + B('alias', 'alias') + ': ' + h.alias : '')}</span></>, { kind: 'page', page: h.page, alias: h.alias }); })}
                  {G('comp', B('Components in the code', 'Komponen di kode'), found.comp, (i) => { const h = found.comp.rows[i]!; return opt(n++, 'comp', 'widgets', undefined, code(h, where(h)), h); })}
                  {G('class', B('Classes', 'Class'), found.class, (i) => { const h = found.class.rows[i]!; return opt(n++, 'class', 'code', undefined, code({ ...h, name: '.' + h.name }, where(h)), h); })}
                  {G('token', B('Tokens', 'Token'), found.token, (i) => { const h = found.token.rows[i]!; return opt(n++, 'token', 'palette', undefined, code(h, B('on the page ', 'di halaman ') + nameOf(dsPage(h.page) ?? { en: h.page, idn: h.page })), h); })}
                </>;
              })()}
            </ul>
          ) : null}
        </div>
        {searchOff
          ? <p className="dsnote" role="status">{B('Search is unavailable right now. Use the contents list below.', 'Pencarian sedang tidak tersedia. Gunakan daftar isi di bawah.')}</p>
          : null}
      </div>
      </div>
      <nav className="dstoc" aria-label={B('Contents', 'Daftar isi')}>
        {GROUPS.map((g) => {
          const item = (p: (typeof pages)[number]) => <button key={p.id} type="button" className={`dsn-i${on === p.id ? ' on' : ''}`} data-id={p.id} data-g={g} data-act="dsgo" aria-current={on === p.id ? 'location' : undefined} onClick={() => go(p.id)}>{nameOf(p)}</button>;
          const items = pages.filter((p) => p.grp === g);
          return (
            <div className="dsn" key={g} data-g={g}>
              <p className="dsn-t">{grpName(g)}</p>
              <div className="dsn-l">
                {g === 'comp'
                  ? subs.map((sb) => (
                    <Fragment key={sb}>
                      <p className="dsn-s" data-s={sb}>{subName(sb)}</p>
                      <div className="dsn-l">{items.filter((p) => p.sub === sb).map(item)}</div>
                    </Fragment>))
                  : items.map(item)}
              </div>
            </div>);
        })}
      </nav>
      <div className="dsmain" id="dsmain">
        {none ? (
          <div className="card dsnone" id="dsnone" style={{ display: 'flex' }}>
            <EmptyState size="md" icon="search_off" title={B('No matching page', 'Tidak ada halaman yang cocok')} desc={B('Try another name, for example button, badge, table or color.', 'Coba nama lain, misalnya tombol, badge, tabel, atau warna.')} />
            <div style={{ display: 'flex', justifyContent: 'center', padding: '0 0 20px' }}><Button label={B('Clear search', 'Hapus pencarian')} type="outlined" intent="neutral" onClick={clear} /></div>
          </div>) : null}
        {pages.map((pg) => (
          <section className="card dss" id={`ds-${pg.id}`} data-ds={pg.id} key={pg.id}>
            <div className="ch"><div className="dshh"><span className="grpt">{grpName(pg.grp)}{pg.sub ? ' · ' + subName(pg.sub) : ''}</span><h2>{nameOf(pg)}</h2></div></div>
            <div className="cb">{DS_LEADS[pg.id] ? <p className="dslead">{B(DS_LEADS[pg.id]![0], DS_LEADS[pg.id]![1])}</p> : null}<DsViewCtx.Provider value={{ page: pg.id }}>{pg.secs.map((sec) => <Fragment key={sec}>{sections[sec]}</Fragment>)}</DsViewCtx.Provider></div>
          </section>))}
      </div>
      <Button icon="arrow_upward" type="outlined" intent="neutral" cls={showTop ? 'dstop on' : 'dstop'} aria={B('Back to top', 'Kembali ke atas')} title={B('Back to top', 'Kembali ke atas')} onClick={top} />
      {layers}
    </div>
  );
}

/** Route element: the page of `#/design/<id>` with the shell's toast and veil connected. An old section id or an unknown one opens the page that took its place. */
export function DesignRoute({ id = '' }: { id?: string }) {
  const { toast } = useToast();
  const onVeil = () => toast('Page transition demo');
  const page = id === 'all' ? 'all' : resolveDsPage(id);   // `#/design/all`: every section whole on one long page; not in the menu, it is for the browser tests and for printing (rule DS-19)
  useEffect(() => { if (id && id !== page) window.location.replace('#/design/' + page); }, [id, page]);   // no id: the first page, the address stays `#/design`
  return page === 'all' ? <DesignSections onToast={toast} onVeil={onVeil} /> : <DesignPage page={id ? page : undefined} onToast={toast} onVeil={onVeil} />;
}
