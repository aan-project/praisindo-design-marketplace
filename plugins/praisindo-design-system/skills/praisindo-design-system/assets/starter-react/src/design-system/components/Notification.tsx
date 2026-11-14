// Notifications (rules NT-01 to NT-12, owner decisions 2026-11-02): the bell of the sidebar footer, one row of the list, the dropdown (the five newest unread, with a link to all of them) and the
// drawer with every notification. Presentational: the notifications, the read state and the navigation come from the host. Built from Button, Chip, Tabs, Drawer, IconTile, EmptyState, LoadingState and ErrorState.
import { useEffect, useRef, type CSSProperties } from 'react';
import { Button } from './Button';
import { Chip } from './Chip';
import { Drawer } from './Drawer';
import { useEscapeClose } from './escapeStack';
import { IconTile } from './Hints';
import { EmptyState, ErrorState, LoadingState } from './States';
import { DrawerTabs, Tabs } from './Tabs';

/** The bell: an icon-only button with the number of unread notifications on it (nothing at 0, "9+" above 9). `live` is the text a screen reader hears when the number changes (polite). */
export function NotificationBell({ badge, label, live, onOpen }: { badge: string; label: string; live: string; onOpen: () => void }) {
  return (
    <div className="nbell">
      <Button icon="notifications" type="transparent" intent="neutral" size="md" aria={label} title={label} testid="notif-open" onClick={onOpen} />
      {badge ? <Chip label={badge} selected hidden testid="notif-badge" /> : null}
      <span className="sr-only" aria-live="polite" aria-atomic="true" data-testid="notif-live">{live}</span>
    </div>
  );
}

export interface NotificationRow { id: string; icon: string; intent: string; title: string; desc: string; time: string; /** the category tab it belongs to */ cat: string; catLabel: string; unread: boolean }
/** One row: the icon tile of its kind, the title, one line of summary, "time · category", and a dot while it is unread. */
export function NotificationItem({ row, unreadLabel, onOpen }: { row: NotificationRow; unreadLabel: string; onOpen: () => void }) {
  return (
    <li className="nti-li">
      <button type="button" className={`nti${row.unread ? ' unread' : ''}`} data-testid={'notif-' + row.id} data-unread={row.unread ? '1' : '0'} data-cat={row.cat} onClick={onOpen}>
        <IconTile icon={row.icon} intent={row.intent} />
        <span className="m"><span className="fw6">{row.title}</span><span className="nti-d">{row.desc}</span><span className="nti-t">{row.time} · {row.catLabel}</span></span>
        {row.unread ? <><span className="nti-dot" aria-hidden="true" /><span className="sr-only">{unreadLabel}</span></> : null}
      </button>
    </li>
  );
}

interface Shared {
  title: string; markAllLabel: string; unreadLabel: string; emptyTitle: string; emptyDesc: string;
  state: 'ready' | 'loading' | 'error'; rows: readonly NotificationRow[]; /** the category tabs: [value, label] */ tabs: readonly (readonly [string, string])[]; tab: string; onTab: (v: string) => void;
  /** something is unread: "Mark all as read" is shown (it is gone when everything is read) */ canMarkAll: boolean; onClose: () => void; onMarkAll: () => void; onOpenRow: (id: string) => void; onRetry?: () => void;
}
function Body(p: Shared) {
  return p.state === 'loading' ? <LoadingState size="sm" />
    : p.state === 'error' ? <ErrorState size="sm" onRetry={p.onRetry} />
    : !p.rows.length ? <EmptyState size="sm" icon="notifications_none" title={p.emptyTitle} desc={p.emptyDesc} />
    : <ul className="ntl" data-testid="notif-list">{p.rows.map((r) => <NotificationItem key={r.id} row={r} unreadLabel={p.unreadLabel} onOpen={() => p.onOpenRow(r.id)} />)}</ul>;
}

export interface NotificationPopoverProps extends Shared {
  viewAllLabel: string; onViewAll: () => void;
  /** left edge in px (right of the sidebar, like the user menu); `undefined` in a static example */ left?: number; /** the bell is in the toolbar at the top of the page: the popover opens under it, at the top right (the class of the user menu of a topbar, rule PP-03) */ top?: boolean; /** a static example on the Design page: no scrim, no focus handling */ demo?: boolean;
}
/** The dropdown of the bell: title and "Mark all as read", the category tabs, at most five unread rows (the host passes them), and "View all notifications" in the footer. */
export function NotificationPopover(p: NotificationPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEscapeClose(p.demo ? () => undefined : p.onClose, 1);
  useEffect(() => {
    if (p.demo) return undefined;
    const opener = document.activeElement as HTMLElement | null; ref.current?.focus();
    return () => { if (opener && typeof opener.focus === 'function') opener.focus(); };
  }, [p.demo]);
  const style: CSSProperties | undefined = p.demo ? { position: 'static' } : p.left !== undefined && !p.top ? { left: p.left } : undefined;
  return (
    <>
      {p.demo ? null : <div className="upop-scrim" aria-hidden="true" data-testid="notif-scrim" onClick={p.onClose} />}
      <div ref={ref} className={`pop upop npop${p.top ? ' upop-top' : ''}`} role={p.demo ? undefined : 'dialog'} aria-label={p.demo ? undefined : p.title} tabIndex={-1} id={p.demo ? undefined : 'notifpop'} style={style}>
        <div className="nph"><h2>{p.title}</h2>{p.canMarkAll ? <Button label={p.markAllLabel} type="link" intent="brand" size="sm" testid="notif-markall" onClick={p.onMarkAll} /> : null}</div>
        <Tabs items={p.tabs} active={p.tab} size="sm" onChange={p.onTab} />
        <div className="npl"><Body {...p} /></div>
        <div className="npf"><Button label={p.viewAllLabel} iconRight="arrow_forward" type="transparent" intent="brand" testid="notif-viewall" onClick={p.onViewAll} /></div>
      </div>
    </>
  );
}

export interface NotificationPanelProps extends Shared { closeLabel: string; /** the line at the end of the list: only the last 3 months are shown */ windowLabel: string }
/** Every notification of the last 3 months, read and unread, newest first, in a right-hand Drawer: "Mark all as read" is an icon button left of Close (gone when all is read), then the category tabs (sticky while the list scrolls), the list and a line that says only 3 months are shown. */
export function NotificationPanel(p: NotificationPanelProps) {
  return (
    <Drawer title={p.title} size="sm" id="notifpanel" closeLabel={p.closeLabel} onClose={p.onClose}
      actions={p.canMarkAll ? <Button icon="done_all" type="transparent" intent="neutral" aria={p.markAllLabel} title={p.markAllLabel} testid="notif-markall-all" onClick={p.onMarkAll} /> : undefined}>
      <DrawerTabs items={p.tabs} active={p.tab} onChange={p.onTab} />
      <Body {...p} />
      {p.state === 'ready' && p.rows.length ? <p className="nti-w" data-testid="notif-window">{p.windowLabel}</p> : null}
    </Drawer>
  );
}
