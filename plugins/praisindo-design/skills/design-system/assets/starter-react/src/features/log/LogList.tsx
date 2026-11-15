// The Activity history list (rule GN-01): the History list item of the DS (`.tl .alog`, OR-01 newest first, grouped by day). Rows are static (no detail drawer): a name in a row can be a profile-card trigger (GN-04).
// Time, the icon tile of the category, the action and its target, the note, and the category label.
import { Fragment, type ReactNode } from 'react';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { GroupTitle } from '../../design-system/components/Card';
import { IconTile } from '../../design-system/components/Hints';
import { activityCategory } from '../../domain/log/activity.config';
import type { ActivityEvent } from '../../domain/log/activityLog';
import { dfmt } from '../../lib/dateFormat';

export function LogList({ events, who }: { events: readonly ActivityEvent[]; /** show who did it (a team or audit view): a node, usually `<UserName name />` */ who?: (e: ActivityEvent) => ReactNode }) {
  const { prefs } = usePrefs(), lang = prefs.lang as 'en' | 'id';
  let day = '';
  return (
    <div className="tl alog" data-testid="activity-list">
      {events.map((e) => {
        const d = e.ts.slice(0, 10), head = d !== day ? ((day = d), <div className="alog-d"><GroupTitle text={dfmt(d, lang)} /></div>) : null, c = activityCategory(e.category);
        return (
          <Fragment key={e.id}>
            {head}
            <div className="ti alog-i alog-st">
              <span className="alog-tm">{e.ts.slice(11, 16)}</span><IconTile icon={c?.icon ?? 'history'} intent={c?.intent ?? 'neutral'} />
              <span className="tc">
                <span className="alog-t">{who ? <><span className="fw6">{who(e)}</span> </> : null}{e.action}</span>
                {e.targetType || e.targetId ? <span className="mut">{[e.targetType, e.targetId].filter(Boolean).join(' · ')}</span> : null}
                <span className="alog-m"><span>{c ? c[lang] : e.category}</span>{e.note ? <span>{e.note}</span> : null}</span>
              </span>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
