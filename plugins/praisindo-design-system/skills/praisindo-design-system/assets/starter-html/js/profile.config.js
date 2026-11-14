// The profile card of a user of THIS product (rule GN-04, PC-01..PC-05): the fields come from its own user directory. Show the avatar with initials, the name, a subtitle (the position or the role) and three to five rows the
// product really keeps for a user (unit or branch, email, phone, status, last active, number of open items). Replace PROFILE_USERS with the product's directory (an API call, a store) and keep profileRows().
export const PROFILE_USERS = [
  { name: 'Demo Admin', position: 'Administrator', unit: 'Head office', email: 'admin@example.com', phone: '+62 812 0000 0001', status: 'active' },
  { name: 'Sam Rivera', position: 'Procurement lead', unit: 'Procurement', email: 'sam.rivera@example.com', phone: '+62 812 0000 0002', status: 'active' },
  { name: 'Maya Putri', position: 'Finance officer', unit: 'Finance', email: 'maya.putri@example.com', phone: '+62 812 0000 0003', status: 'away' },
];
export const profileUser = (name) => PROFILE_USERS.find((u) => u.name === name);
/** The rows of the card: [label, value] with the labels translated by the caller. */
export const profileRows = (u, t) => [[t('pc.unit'), u.unit], [t('pc.email'), u.email], [t('pc.phone'), u.phone], [t('pc.status'), t('pc.s.' + u.status)]];
