// The search of the sidebar (rules SQ-01..SQ-04): the pages of the menu (NAV) and of the user menu (PROFILE_NAV) behind the GlobalSearch component. A product with content to search (a Help Center) adds its own group here.
import { useMemo, useState } from 'react';
import { GlobalSearch, type SiteGroup } from '../../design-system/components/GlobalSearch';
import { NAV, PROFILE_NAV, type NavItem } from '../nav.config';
import { usePrefs } from '../providers/PrefsProvider';

export function SidebarSearch({ placement = 'side' }: { placement?: 'side' | 'below' }) {
  const { t } = usePrefs(), [q, setQ] = useState('');
  const groups = useMemo<SiteGroup[]>(() => {
    const n = q.trim().toLowerCase(), pages: { id: string; icon: string; title: string; sub?: string; href: string }[] = [];
    const walk = (items: NavItem[], trail: string[]) => items.forEach((it) => {
      const label = t(it.labelKey);
      if (!it.kids?.length) pages.push({ id: 'p:' + it.href, icon: it.icon || 'description', title: label, sub: trail.join(' › ') || undefined, href: it.href || '#' });
      if (it.kids) walk(it.kids, [...trail, label]);
    });
    NAV.forEach((g) => walk(g.items, g.labelKey ? [t(g.labelKey)] : []));
    PROFILE_NAV.forEach(([, ic, lk, href]) => pages.push({ id: 'p:' + href, icon: ic, title: t(lk), href }));
    const hits = n ? pages.filter((p) => (p.title + ' ' + (p.sub ?? '')).toLowerCase().includes(n)) : [];
    return [{ key: 'pages', title: t('sq.pages'), hits }];
  }, [q, t]);
  return <GlobalSearch id="sq" q={q} groups={groups} label={t('sq.label')} placeholder={t('sq.ph')} noneTitle={q.trim() ? t('sq.noneT').replace('{q}', q.trim()) : ''} noneDesc={t('sq.noneD')} clearLabel={t('tbl.clearSearch')} onQuery={setQ} onGo={() => setQ('')} placement={placement} />;
}
