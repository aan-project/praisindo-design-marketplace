// Activity history (rule GN-01): what the SIGNED-IN user did in the application, newest first, grouped by day. A List pattern page: a category filter and a search field appear when there are more than ten events (TB-17).
// The empty state says that nothing was done yet; it is not an Alert (CD-08).
import { useMemo, useState } from 'react';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { PageHeader } from '../../app/shell/PageHead';
import { Card } from '../../design-system/components/Card';
import { SearchBar, Select } from '../../design-system/components/Controls';
import { EmptyState } from '../../design-system/components/States';
import { ACTIVITY_CATEGORIES } from '../../domain/log/activity.config';
import { useActivity } from '../../domain/log/activityLog';
import { LogList } from './LogList';

const MANY = 10;
export function MyLogPage() {
  const { t, prefs } = usePrefs(), lang = prefs.lang as 'en' | 'id', all = useActivity();
  const [cat, setCat] = useState(''), [q, setQ] = useState('');
  const events = useMemo(() => {
    const n = q.trim().toLowerCase();
    return all.filter((e) => (!cat || e.category === cat) && (!n || [e.action, e.targetType, e.targetId, e.note].join(' ').toLowerCase().includes(n)));
  }, [all, cat, q]);
  const filters = all.length > MANY;
  return (
    <>
      <PageHeader crumbs={[['#/home', t('nav.home')], ['#/mylog', t('nav.mylog')]]} title={t('nav.mylog')} sub={t('sub.mylog')} />
      <Card title={t('mylog.card')} flush
        actions={filters ? <Select opts={[['', t('mylog.allCats')], ...ACTIVITY_CATEGORIES.map((c) => [c.key, c[lang]] as const)]} val={cat} aria={t('mylog.cat')} onChange={setCat} /> : undefined}
        body={all.length === 0 ? <EmptyState size="lg" icon="history" title={t('mylog.noneT')} desc={t('mylog.noneD')} />
          : <>{filters ? <div className="cb"><SearchBar fields={[['all', t('mylog.all')]]} fv="all" q={q} id="mylogq" onQuery={setQ} onClear={() => setQ('')} /></div> : null}
            {events.length ? <LogList events={events} /> : <EmptyState size="lg" icon="search_off" title={t('mylog.noResT')} desc={t('mylog.noResD')} />}</>} />
    </>);
}
