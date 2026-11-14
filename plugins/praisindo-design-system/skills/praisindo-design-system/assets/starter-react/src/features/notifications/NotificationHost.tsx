// The bell of the sidebar footer, its dropdown (the five newest unread, with the category tabs) and the drawer with every notification (rule GN-02, NT-01..NT-12). Opening one marks it read and goes to what it is about.
import { useCallback, useMemo, useState } from 'react';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { useSession } from '../../app/session';
import { NotificationBell, NotificationPanel, NotificationPopover, type NotificationRow } from '../../design-system/components/Notification';
import { NT_CATEGORIES, NT_KINDS } from '../../domain/notifications/notifications.config';
import { NT_POP_MAX, ntBadge, ntBuild, ntLoadRead, ntSaveRead } from '../../domain/notifications/notify';
import { fill } from '../../i18n/fill';

export function NotificationHost() {
  const { t, prefs } = usePrefs(), lang = prefs.lang as 'en' | 'id', { sess } = useSession(), account = sess.email.toLowerCase();
  const [read, setRead] = useState<string[]>(() => ntLoadRead(account)), [view, setView] = useState<null | 'pop' | 'all'>(null), [tab, setTab] = useState('all'), [left, setLeft] = useState(0), [top, setTop] = useState(false);
  const list = useMemo(() => ntBuild(sess.admin), [sess.admin]), seen = useMemo(() => new Set(read), [read]);
  const rows: NotificationRow[] = list.map((n) => {
    const k = NT_KINDS.find((x) => x.kind === n.kind)!, c = NT_CATEGORIES.find((x) => x.key === n.cat);
    return { id: n.id, icon: k.icon, intent: k.intent, title: k[lang].title, desc: fill(k[lang].summary, n.args), time: n.age === 0 ? t('nt.ago.0') : n.age === 1 ? t('nt.ago.1') : fill(t('nt.ago.n'), { n: n.age }), cat: n.cat, catLabel: c ? c[lang] : n.cat, unread: !seen.has(n.id) };
  });
  const unread = rows.filter((r) => r.unread).length, label = unread ? fill(t('nt.bell.n'), { n: unread }) : t('nt.bell');
  const tabs = [['all', t('nt.cat.all')], ...NT_CATEGORIES.map((c) => [c.key, c[lang]] as const)] as [string, string][];
  const inTab = rows.filter((r) => tab === 'all' || r.cat === tab), unreadIn = inTab.filter((r) => r.unread), popRows = (unreadIn.length ? unreadIn : inTab).slice(0, NT_POP_MAX);
  const save = useCallback((ids: string[]) => { setRead(ids); ntSaveRead(account, ids, list.map((n) => n.id)); }, [account, list]);
  const open = () => {
    if (view) { setView(null); return; }
    const sb = document.querySelector('[data-testid="notif-open"]')?.closest('.sb') as HTMLElement | null;
    setTop(!sb); setLeft((sb ? sb.getBoundingClientRect().right : 0) + 8); setTab('all'); setView('pop');
  };
  const common = { title: t('nt.t'), markAllLabel: t('nt.markAll'), unreadLabel: t('nt.unread'), emptyTitle: t('nt.empty.t'), emptyDesc: t('nt.empty.d'), state: 'ready' as const, tabs, tab, onTab: setTab, canMarkAll: unread > 0, onClose: () => setView(null),
    onMarkAll: () => save([...new Set([...read, ...list.map((n) => n.id)])]),
    onOpenRow: (id: string) => { save([...new Set([...read, id])]); setView(null); const k = NT_KINDS.find((x) => x.kind === list.find((n) => n.id === id)?.kind); if (k) window.location.hash = k.to; } };
  return (
    <>
      <NotificationBell badge={ntBadge(unread)} label={label} live={unread ? fill(t('nt.live'), { n: unread }) : t('nt.live0')} onOpen={open} />
      {view === 'pop' ? <NotificationPopover {...common} rows={popRows} left={left} top={top} viewAllLabel={t('nt.viewAll')} onViewAll={() => { setTab('all'); setView('all'); }} /> : null}
      {view === 'all' ? <NotificationPanel {...common} rows={inTab} closeLabel={t('lg.close')} windowLabel={t('nt.window')} /> : null}
    </>);
}
