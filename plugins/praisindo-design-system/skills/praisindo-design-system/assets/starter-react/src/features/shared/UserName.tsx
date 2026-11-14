// UserName (rules GN-04, UN-01, PC-01): wherever the name of a USER of the application is shown, this is the name. It is the trigger of the profile card: it can be hovered, focused with the keyboard and tapped, and it has no
// text decoration; it inherits the font of the text around it. A name that is not in the directory (a dash, "unassigned") stays plain text. Never print a bare user name from a record (`row.owner`, `createdBy`).
import { usePrefs } from '../../app/providers/PrefsProvider';
import { ProfileCard, type ProfileCardData } from '../../design-system/components/ProfileCard';
import { profileRows, profileUser } from '../../domain/profile.config';

export function UserName({ name, trigger = 'name' }: { name: string; trigger?: 'name' | 'avatar' }) {
  const { t } = usePrefs(), u = profileUser(name);
  if (!u) return <>{name}</>;
  const data: ProfileCardData = { name: u.name, subtitle: u.position, rows: profileRows(u, t) };
  return <ProfileCard data={data} trigger={trigger} />;
}
