// The notifications of THIS product (rule GN-02, NT-01..NT-12): derive the categories and the kinds from its own workflows. List the events people must act on or know about (something waiting for my decision, assigned to me,
// overdue or expiring, failed, a result that finished), group them into three to five categories named in the language of the work, and give each kind its category, who receives it, its title and summary in English and Indonesian
// and where it leads. The starter ships three removable examples (Work, Data and System) built on the supplier example pages; replace them. A product with nothing to notify about keeps the bell and the empty state ("You are all caught up").
export interface NtCategory { key: string; en: string; id: string }
export interface NtKind {
  kind: string; cat: string; /** who receives it: `all` or `admin` */ audience: 'all' | 'admin'; icon: string; intent: string; to: string;
  en: { title: string; summary: string }; id: { title: string; summary: string };
}
export const NT_CATEGORIES: readonly NtCategory[] = [
  { key: 'work', en: 'Work', id: 'Pekerjaan' },
  { key: 'data', en: 'Data', id: 'Data' },
  { key: 'system', en: 'System', id: 'Sistem' },
];
export const NT_KINDS: readonly NtKind[] = [
  { kind: 'pending', cat: 'work', audience: 'admin', icon: 'pending_actions', intent: 'warning', to: '#/ex-list',
    en: { title: 'Suppliers waiting for approval', summary: '{n} suppliers are waiting for a decision.' }, id: { title: 'Supplier menunggu persetujuan', summary: '{n} supplier menunggu keputusan.' } },
  { kind: 'new', cat: 'work', audience: 'all', icon: 'person_add', intent: 'brand', to: '#/ex-list',
    en: { title: 'New suppliers', summary: '{n} new suppliers were added.' }, id: { title: 'Supplier baru', summary: '{n} supplier baru ditambahkan.' } },
  { kind: 'synced', cat: 'data', audience: 'all', icon: 'sync', intent: 'success', to: '#/ex-list',
    en: { title: 'Supplier list is up to date', summary: 'The list was synchronised with the source.' }, id: { title: 'Daftar supplier sudah terbaru', summary: 'Daftar sudah disinkronkan dengan sumbernya.' } },
  { kind: 'maintenance', cat: 'system', audience: 'all', icon: 'build', intent: 'info', to: '#/home',
    en: { title: 'Scheduled maintenance', summary: 'The application is read-only on Sunday from 01:00 to 02:00.' }, id: { title: 'Pemeliharaan terjadwal', summary: 'Aplikasi hanya bisa dibaca pada hari Minggu pukul 01.00 sampai 02.00.' } },
];
