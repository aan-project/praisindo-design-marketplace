// UserName (rules GN-04, UN-01, PC-01): wherever the name of a USER of the application is shown, this is the name. It is the trigger of the profile card: it can be hovered, focused with the keyboard and tapped, and it has no
// text decoration; it inherits the font of the text around it. A name that is not in the directory (a dash, "unassigned") stays plain text. Never print a bare user name from a record (`row.owner`, `createdBy`).
import { usePrefs } from '../../app/providers/PrefsProvider';
import { ProfileCard, type ProfileCardData } from '../../design-system/components/ProfileCard';
import { productRows, profileProduct, profileRows, profileUser } from '../../domain/profile.config';

export function UserName({ name, trigger = 'name' }: { name: string; trigger?: 'name' | 'avatar' }) {
  const { t } = usePrefs(), u = profileUser(name);
  if (!u) return <>{name}</>;
  const data: ProfileCardData = { name: u.name, subtitle: u.position, rows: profileRows(u, t) };
  return <ProfileCard data={data} trigger={trigger} />;
}

/** ProductName (rule UN-03): the name or label of a product is the trigger of the product card (the profile card with the logo, the category and only the most important facts). Not in the catalogue: plain text. */
export function ProductName({ name, trigger = 'name' }: { name: string; trigger?: 'name' | 'avatar' }) {
  const { t } = usePrefs(), p = profileProduct(name);
  if (!p) return <>{name}</>;
  const data: ProfileCardData = { name: p.name, subtitle: p.category, rows: productRows(p, t), logo: { name: p.issuer, ...(p.logo ? { src: p.logo } : {}) }, ...(p.href ? { action: { label: t('pc.pview'), href: p.href } } : {}) };
  return <ProfileCard data={data} trigger={trigger} />;
}
