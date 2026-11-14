// Design System page: Activity log (rule GN-01). The History list item (`LogList`, `.tl .alog`): newest first (OR-01), grouped by day, one row per event with the time, the icon tile of the category, the action and its target, the note and the category.
import { LogList } from '../log/LogList';
import { ACTIVITY_CATEGORIES } from '../../domain/log/activity.config';
import type { ActivityEvent } from '../../domain/log/activityLog';
import { DsApi, DsDemo, DsH, DsSec, useB } from './ds';

const Rules = ({ items }: { items: readonly (readonly [string, string])[] }) => { const B = useB(); return <ul className="dsrules">{items.map((x) => <li key={x[0]}>{B(x[0], x[1])}</li>)}</ul>; };

const ev = (n: number, ts: string, category: string, action: string, targetType: string, targetId: string, note = ''): ActivityEvent => ({ id: 'ACT-DS-' + n, ts, account: 'demo', category, action, targetType, targetId, note });
/** Sample events of the page (invented, no product data), newest first. */
const SAMPLE: readonly ActivityEvent[] = [
  ev(1, '2026-11-14T09:42:00', 'create', 'Created', 'Supplier', 'SUP-1043', 'Arta Supply'),
  ev(2, '2026-11-14T08:15:00', 'update', 'Updated', 'Supplier', 'SUP-1012', 'Payment terms 60 days'),
  ev(3, '2026-11-13T16:30:00', 'delete', 'Deleted', 'Supplier', 'SUP-1007'),
  ev(4, '2026-11-13T08:02:00', 'auth', 'Signed in', '', ''),
];

export function ActivityLogSection() {
  const B = useB();
  return (
    <DsSec id="alog" title={B('Activity log', 'Log aktivitas')} lead={B('The compact timeline of what a person did: newest first, grouped by day, one row per event. It is the page Activity history of every application (GN-01) and the History tab of a record.', 'Timeline ringkas dari yang dilakukan seseorang: terbaru dulu, dikelompokkan per hari, satu baris per event. Ini halaman Activity history di setiap aplikasi (GN-01) dan tab History dari sebuah record.')}>
      <DsDemo label={B('Compact timeline grouped by day', 'Timeline ringkas per hari') + ' · LogList'}><div className="dsframe" style={{ flex: '1 1 100%' }}><LogList events={SAMPLE} /></div></DsDemo>
      <DsApi rows={[
        ['LogList({events, who})', 'ActivityEvent[] · (e) => node', '—', B('Static rows (no detail drawer): the time, the icon tile of the category from activity.config, the action, "target type · id", the note and the category label. `who` puts a name in front of the action (a team or audit view): use UserName (GN-04).', 'Baris statis (tanpa drawer detail): jam, ikon kategori dari activity.config, aksi, "jenis target · id", catatan dan label kategori. `who` menaruh nama di depan aksi (tampilan tim atau audit): pakai UserName (GN-04).')],
        ['logActivity({category, action, targetType, targetId, note})', 'category: ' + ACTIVITY_CATEGORIES.map((c) => c.key).join(' | '), '—', B('The one function every create, update, delete, approve, publish, export and sign-in calls; the event is kept per account and holds business values only.', 'Satu fungsi yang dipanggil setiap create, update, delete, approve, publish, export dan sign-in; event disimpan per akun dan hanya berisi nilai bisnis.')],
      ]} />
      <DsH>{B('Rules', 'Aturan')}</DsH>
      <Rules items={[['Newest first, grouped by day (OR-01); the page has a category filter and a search field when there are more than ten events.', 'Terbaru dulu, per hari (OR-01); halaman punya filter kategori dan kolom pencarian bila event lebih dari sepuluh.'], ['Every mutating handler of the product calls logActivity; the empty state says nothing was done yet and is not an Alert.', 'Setiap handler yang mengubah data memanggil logActivity; status kosong menyatakan belum ada aktivitas dan bukan Alert.']]} />
    </DsSec>
  );
}
