// My profile (rule AV-06): the detail of the signed-in person, opened from the avatar menu, directly above My preferences. Read only. It shows what the session has (name, email, role);
// a product with a user directory adds its facts (position, branch, team, certifications) to the rows, as the profile card does (GN-04).
import { Button } from '../../design-system/components/Button';
import { DetailItem, DetailList } from '../../design-system/components/DetailList';
import { Drawer } from '../../design-system/components/Drawer';
import { usePrefs } from '../providers/PrefsProvider';
import { useSession } from '../session';

export function MyProfileDrawer({ onClose }: { onClose: () => void }) {
  const { t } = usePrefs(), { sess } = useSession(), ini = sess.name.split(' ').map((w) => w[0]).join('').slice(0, 2);
  return (
    <Drawer title={t('mp.title')} size="sm" onClose={onClose} footer={<Button label={t('lg.close')} testid="mp-close" onClick={onClose} />}>
      <div className="c3id" data-testid="mp-head"><div className="c3av">{ini}</div><h2>{sess.name}</h2><span className="c3sub">{t(sess.admin ? 'mp.admin' : 'mp.user')}</span></div>
      <DetailList layout="rows">
        <DetailItem label={t('mp.email')}>{sess.email}</DetailItem>
        <DetailItem label={t('mp.role')}>{t(sess.admin ? 'mp.admin' : 'mp.user')}</DetailItem>
      </DetailList>
    </Drawer>
  );
}
