// The Praisindo shell (rules SB-01..SB-33): sidebar 232px / 68px rail, no desktop topbar, footer with language, theme and the user menu, edge toggle, bottom navigation on a phone.
// It is the same in every application: do NOT restyle it. Only the menu (app/nav.config.ts), the brand (Branding page) and the routes change.
import { midText } from '../../features/shared/midText';
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { Button, LinkButton } from '../../design-system/components/Button';
import { Card } from '../../design-system/components/Card';
import { Chip } from '../../design-system/components/Chip';
import { SidebarToggle } from '../../design-system/components/SidebarToggle';
import { Icon } from '../../design-system/components/Icon';
import { Logo, LogoMark, useLogo } from '../../design-system/components/Logo';
import { fill } from '../../i18n/fill';
import { mobileSplit, navCount, navGroups, navHas, UTIL, type NavItem } from '../nav.config';
import { usePrefs } from '../providers/PrefsProvider';
import { isDetailPage, ROUTES, routeKeyOf } from '../routes';
import { pageRouteId, type PageInfo } from '../routing';
import { useSession } from '../session';
import { setActivityAccount } from '../../domain/log/activityLog';
import type { PanelItem } from '../providers/prefsModel';
import { PrefsDrawer } from './PrefsDrawer';
import { SidebarSearch } from './SidebarSearch';
import { Topbar, useMediaQuery } from './Topbar';
import { UtilMore } from './UtilMore';
import { UserMenu } from './UserMenu';

function NavCnt({ n }: { n: number }) {
  if (!n) return null;
  return <><Chip label={n > 99 ? '99+' : String(n)} selected hidden title={String(n)} /><span className="sr-only">{n}</span></>;
}

function SideNav({ cur }: { cur: string }) {
  const { t } = usePrefs();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const item = (it: NavItem, L: number): ReactNode => {
    const on = it.k === cur, has = !on && navHas(it, cur);
    const body = (<>{L === 1 && <Icon name={it.icon || 'circle'} />}<span className="lbl">{midText(t(it.labelKey))}</span><NavCnt n={navCount(it.k)} /></>);
    if (it.kids && it.kids.length && L < 3) {
      const id = 'app:' + it.k, ex = id in open ? open[id]! : has;
      return (
        <div className={`nvp l${L}`} key={it.k}>
          <button type="button" className={`nvi nvt l${L}${has ? ' has-on' : ''}`} aria-expanded={ex} title={t(it.labelKey)} onClick={() => setOpen((o) => ({ ...o, [id]: !ex }))}>
            {body}<span className="nvc"><Icon name="expand_more" /></span>
          </button>
          <div className="nvk" role="group" aria-label={t(it.labelKey)} hidden={!ex}>{it.kids.map((c) => item(c, L + 1))}</div>
        </div>
      );
    }
    return <a key={it.k} href={it.href || '#'} className={`nvi l${L}${on ? ' on' : ''}`} aria-current={on ? 'page' : undefined} title={t(it.labelKey)}>{body}</a>;
  };
  return (
    <nav className="nav" aria-label="Main">
      {navGroups().map((g, i) => (
        <div key={g.key + i} className={`ng${g.labelKey ? '' : ' ng0'}`} role={g.labelKey ? 'group' : undefined} aria-label={g.labelKey ? t(g.labelKey) : undefined}>
          {g.labelKey && <div className="ngt" aria-hidden="true">{t(g.labelKey)}</div>}
          {g.items.map((it) => item(it, 1))}
        </div>
      ))}
    </nav>
  );
}

function MobileNav({ cur, open, setOpen }: { cur: string; open: boolean; setOpen: (v: boolean) => void }) {
  const { t } = usePrefs();
  const { top, more } = mobileSplit();
  return (
    <>
      {open && <div className="scrim mscrim" aria-hidden="true" onClick={() => setOpen(false)} />}
      <nav className="bn" aria-label={t('nav.mobile')}>
        {top.map((it) => <a key={it.k} href={it.href} className={navHas(it, cur) ? 'on' : ''} aria-current={navHas(it, cur) ? 'page' : undefined}><Icon name={it.icon || 'circle'} /><span>{t(it.labelKey)}</span><NavCnt n={navCount(it.k)} /></a>)}
        {/* always shown: on a phone the off-canvas sidebar is the only place for the footer (language, theme, user menu) */}
        <button type="button" aria-expanded={open} className={more.some((it) => navHas(it, cur)) ? 'on' : ''} onClick={() => setOpen(!open)}>
          <Icon name={open ? 'close' : 'menu'} /><span>{t('nav.more')}</span>
        </button>
      </nav>
    </>
  );
}

function Restricted({ route }: { route: string }) {
  const { t } = usePrefs();
  const title = t(ROUTES[route]?.titleKey ?? 'nav.home');
  return (
    <>
      <div className="ph"><div>
        <nav className="crumb" aria-label="Breadcrumb"><a href="#/home">{t('nav.home')}</a><Icon name="chevron_right" /><span aria-current="page">{title}</span></nav>
        <h1>{title}</h1><p className="mut">{t('sub.restricted')}</p>
      </div></div>
      <Card title={title} body={<div className="state s-lg" role="alert" data-testid="restricted">
        <Icon name="lock" /><h3>{t('rs.t')}</h3><p className="mut">{t('rs.d')}</p>
        <LinkButton label={t('rs.home')} href="#/home" icon="arrow_back" type="outlined" intent="neutral" />
      </div>} />
    </>
  );
}

export function AppShell({ page, children }: { page: PageInfo; children: ReactNode }) {
  const { t, prefs, sidebarMode, setPref, brand } = usePrefs();
  const { sess } = useSession();
  useEffect(() => { setActivityAccount(sess.email); }, [sess.email]);   // who the Activity history belongs to (rule GN-01)
  const [mnav, setMnav] = useState(false);
  const [drawer, setDrawer] = useState<null | 'prefs'>(null);
  useEffect(() => { setDrawer(null); setMnav(false); }, [page.route, page.arg, page.sub]);
  const isDark = prefs.mode === 'dark';
  // Sidebar (rules SB-04..SB-07, SB-28, SB-30). A detail page (ROUTES[..].layout) always starts collapsed. On other pages My Preferences decides: Auto = expanded (collapsed below 1100px), Expanded, Collapsed.
  // The edge button writes the preference on those pages; on a detail page it only overrides that page, and the override ends with the route.
  const [still, setStill] = useState<'ptr' | 'kbd' | false>(false);   // right after the edge button collapsed it, hover / focus-within must not expand it again until the pointer / focus leaves
  const detail = isDetailPage(page), here = pageRouteId(page), narrow = typeof innerWidth === 'number' && innerWidth < 1100;
  const [ov, setOv] = useState<{ at: string; coll: boolean } | null>(null);
  const coll = detail ? (ov?.at === here ? ov.coll : true) : sidebarMode === 'collapsed' ? true : sidebarMode === 'expanded' ? false : narrow;
  useEffect(() => { setStill(false); setOv(null); }, [here]);
  const toggleSb = (pointer: boolean) => {
    const next = !coll;
    if (detail) setOv({ at: here, coll: next }); else setPref('sidebar', next ? 'collapsed' : 'expanded');
    setStill(next ? (pointer ? 'ptr' : 'kbd') : false);
  };
  const logo = useLogo();
  const below = useMediaQuery('(max-width: 1099px)'), phone = useMediaQuery('(max-width: 640px)');   // the topbar of a tablet or a phone (rule SB-33)
  const def = ROUTES[routeKeyOf(page)];
  const pageTitle = def ? t(def.titleKey) : brand.appName;
  const allowed = !(def?.admin && !sess.admin);
  // The items of the panel (rule PP-01): each one is in the sidebar or, on a desktop, in the toolbar at the top of the page (My Preferences); on a tablet or a phone they stay where they are (SB-33).
  const inTb = (k: PanelItem) => !below && prefs.items[k] === 'toolbar';
  const toolRef = useRef<HTMLElement>(null), hasTool = (['search', 'lang', 'theme', 'notif', 'qa', 'profile'] as const).some(inTb);
  useEffect(() => {
    const el = toolRef.current; if (!el) return undefined;
    let last = window.scrollY, acc = 0;
    const on = () => {
      const y = window.scrollY, dy = y - last; last = y;
      if (y <= el.offsetHeight) { acc = 0; delete el.dataset.pin; return; }   // at the top, the toolbar is where it always is
      acc = Math.sign(dy) === Math.sign(acc) ? acc + dy : dy;   // the distance scrolled in the current direction
      if (acc > 8 && el.dataset.pin !== 'hide') el.dataset.pin = 'hide'; else if (acc < -12 && el.dataset.pin !== 'show') el.dataset.pin = 'show';
    };
    window.addEventListener('scroll', on, { passive: true }); on();
    return () => { window.removeEventListener('scroll', on); delete el.dataset.pin; };
  }, [hasTool, page.route]);
  const langNode = <>
    <div className="lgt" role="group" aria-label={t('hdr.lang')}>
      {([['en', 'EN', 'English'], ['id', 'ID', 'Bahasa Indonesia']] as const).map(([v, a, l]) => <button key={v} type="button" aria-pressed={prefs.lang === v} title={l} lang={v} onClick={() => setPref('lang', v)}>{a}</button>)}
    </div>
    <button type="button" className="btn b-transparent i-neutral s-md io lgt1" data-testid="lang-flip" aria-label={t('hdr.lang') + ': ' + (prefs.lang === 'en' ? 'English' : 'Bahasa Indonesia')} title={t('hdr.lang')} onClick={() => setPref('lang', prefs.lang === 'en' ? 'id' : 'en')}><span className="lgt1t">{prefs.lang.toUpperCase()}</span></button>
  </>;
  const themeNode = <Button icon={isDark ? 'light_mode' : 'dark_mode'} type="transparent" intent="neutral" size="md" aria={t('hdr.theme')} title={t('hdr.theme')} testid="theme" onClick={() => setPref('mode', isDark ? 'light' : 'dark')} />;
  // the action row of the sidebar shows three items at most (rule PP-02): the first three stay, the rest are in the "more" menu (icon and name rows); an item taken to the toolbar leaves the row
  type RowItem = { k: PanelItem; node: ReactNode; label: string; ic: string; run: () => void };
  const rowItems: RowItem[] = [
    { k: 'lang' as PanelItem, node: langNode, label: t('hdr.lang'), ic: 'translate', run: () => setPref('lang', prefs.lang === 'en' ? 'id' : 'en') },
    { k: 'theme' as PanelItem, node: themeNode, label: t('hdr.theme'), ic: isDark ? 'light_mode' : 'dark_mode', run: () => setPref('mode', isDark ? 'light' : 'dark') },
    ...UTIL.map((u): RowItem => ({ k: u.k, node: u.node, label: t(u.labelKey), ic: u.icon, run: () => undefined })),
  ].filter((i) => !inTb(i.k));
  const vis = rowItems.slice(0, 3), more = rowItems.slice(3);
  const user = (variant?: 'top') => <UserMenu variant={variant} onPrefs={() => setDrawer('prefs')} />;
  return (
    <div className={`shell${coll ? ' coll' : ''}${still && coll ? ' nohov' : ''}${mnav ? ' mnav' : ''}`}>
      <aside className="sb" onMouseLeave={() => setStill((v) => (v === 'ptr' ? false : v))} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setStill((v) => (v === 'kbd' ? false : v)); }}>
        <SidebarToggle collapsed={coll} label={t('hdr.sidebar')} onToggle={toggleSb} />
        <div className={`brandrow${logo.full ? ' full' : ''}`}><span className="bm"><LogoMark h={32} /></span><span className="bl"><Logo h={32} /></span>{logo.full ? null : <span className="nm">{brand.appName}</span>}</div>
        {inTb('search') ? null : <SidebarSearch />}
        <SideNav cur={routeKeyOf(page)} />
        <div className="foot">
          <div className={`util${inTb('profile') ? ' nobd' : ''}`}>
            {vis.map((i) => <Fragment key={i.k}>{i.node}</Fragment>)}
            <span className="grow" />
            {more.length ? <UtilMore>{more.map((i) => <Fragment key={i.k}>{i.k === 'lang' || i.k === 'theme' ? <button type="button" role="menuitem" className="btn b-transparent i-neutral s-md" onClick={i.run}><Icon name={i.ic} />{i.label}</button> : i.node}</Fragment>)}</UtilMore> : null}
          </div>
          {inTb('profile') ? null : user()}
        </div>
      </aside>
      {drawer === 'prefs' && <PrefsDrawer onClose={() => setDrawer(null)} />}
      <MobileNav cur={routeKeyOf(page)} open={mnav} setOpen={setMnav} />
      <div className="mn">
        {below ? <Topbar title={pageTitle} menuLabel={t('hdr.sidebar')} expanded={phone ? mnav : !coll} onMenu={() => (phone ? setMnav(!mnav) : toggleSb(false))} user={user('top')} /> : null}
        {(['search', 'lang', 'theme', 'notif', 'qa', 'profile'] as const).some(inTb) ? (
          <header ref={toolRef} className="topbar tool" data-testid="toolbar" aria-label={t('tb.label')}>
            {inTb('search') ? <div className="tool-s"><SidebarSearch placement="below" /></div> : null}
            <span className="grow" />
            {inTb('lang') ? langNode : null}{inTb('theme') ? themeNode : null}{UTIL.filter((u) => inTb(u.k)).map((u) => <Fragment key={u.k}>{u.node}</Fragment>)}{inTb('profile') ? user('top') : null}
          </header>) : null}
        <main className="ct">{allowed ? children : <Restricted route={routeKeyOf(page)} />}</main>
      </div>
    </div>
  );
}
