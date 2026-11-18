// The profile card of a user of THIS product (rule GN-04, PC-01..PC-05): the fields come from its own user directory. Show the avatar with initials, the name, a subtitle (the position or the role) and three to five rows
// the product really keeps for a user (unit or branch, email, phone, status, last active, number of open items). Replace `PROFILE_USERS` with the product's directory (an API call, a store) and keep `profileRows`.
import type { ReactNode } from 'react';
export interface ProfileUser { name: string; position: string; unit: string; email: string; phone: string; status: 'active' | 'away' }
export const PROFILE_USERS: readonly ProfileUser[] = [
  { name: 'Demo Admin', position: 'Administrator', unit: 'Head office', email: 'admin@example.com', phone: '+62 812 0000 0001', status: 'active' },
  { name: 'Sam Rivera', position: 'Procurement lead', unit: 'Procurement', email: 'sam.rivera@example.com', phone: '+62 812 0000 0002', status: 'active' },
  { name: 'Maya Putri', position: 'Finance officer', unit: 'Finance', email: 'maya.putri@example.com', phone: '+62 812 0000 0003', status: 'away' },
];
export const profileUser = (name: string): ProfileUser | undefined => PROFILE_USERS.find((u) => u.name === name);

/** The quick view of a PRODUCT (rule UN-03): hovering the name or label of a product, a catalogue item or a thing the product sells or manages, shows its card with only the most important facts: the logo (of the product or its issuer), the name, the category,
 *  the code, the issuer or owner and, when it has one, a risk or status fact, and a link to its detail. Replace `PROFILE_PRODUCTS` with the product's own catalogue and keep `productRows`. */
export interface ProfileProduct { code: string; name: string; category: string; issuer: string; fact?: [label: string, value: string]; logo?: string; href?: string }
export const PROFILE_PRODUCTS: readonly ProfileProduct[] = [
  { code: 'ITM-1042', name: 'Steel sheet 2 mm', category: 'Raw materials', issuer: 'Arta Supply', fact: ['Stock', 'In stock'], href: '#/ex-detail' },
  { code: 'ITM-2077', name: 'Packaging film', category: 'Packaging', issuer: 'Nusa Pack', fact: ['Stock', 'Low'] },
];
export const profileProduct = (name: string): ProfileProduct | undefined => PROFILE_PRODUCTS.find((p) => p.name === name || p.code === name);
/** The rows of the product card: code, issuer and one more fact, label (translated by the caller) and value. */
export const productRows = (p: ProfileProduct, t: (k: string) => string): readonly (readonly [string, ReactNode])[] => [[t('pc.pcode'), p.code], [t('pc.issuer'), p.issuer], ...(p.fact ? [p.fact as readonly [string, ReactNode]] : [])];
/** The rows of the card: label (translated by the caller) and value. */
export const profileRows = (u: ProfileUser, t: (k: string) => string): readonly (readonly [string, ReactNode])[] => [
  [t('pc.unit'), u.unit], [t('pc.email'), u.email], [t('pc.phone'), u.phone], [t('pc.status'), t('pc.s.' + u.status)],
];
