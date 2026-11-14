// Design System page: Drawer, menu & toast (overlays). Text is the prototype's own. Demo buttons that open real overlays call the page's handlers.
import { useState, type ReactNode } from 'react';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { Button } from '../../design-system/components/Button';
import { DialogCard } from '../../design-system/components/Modal';
import { Icon } from '../../design-system/components/Icon';
import { NotificationBell, NotificationItem, NotificationPanel, NotificationPopover, type NotificationRow } from '../../design-system/components/Notification';
import { fill } from '../../i18n/fill';
import { MD_INT, MD_KINDS } from '../../domain/nav';
import { DsApi, DsDemo, DsH, DsSec, sty, useB, DsTo } from './ds';

export interface OverlayDemoHandlers {
  onDrawer?: (d: string, size: string) => void;
  onToast?: () => void;
  onModal?: (kind: string) => void;
}

export function OverlaysSection({ onDrawer, onToast, onModal }: OverlayDemoHandlers) {
  const B = useB();
  const { t } = usePrefs();
  const [ntOpen, setNtOpen] = useState<'ready' | 'empty' | 'loading' | 'error' | null>(null), [ntTab, setNtTab] = useState('all');
  const ntTabs = [['all', t('nt.cat.all')], ['rules', t('nt.cat.rules')], ['data', t('nt.cat.data')], ['work', t('nt.cat.work')]] as [string, string][];
  const ntRows: NotificationRow[] = [
    { id: 'ds-1', icon: 'rule', intent: 'brand', title: t('nt.proposal.t'), desc: fill(t('nt.proposal.d'), { name: 'Idle cash', by: 'Yohanes Setiawan' }), time: t('nt.ago.0'), cat: 'rules', catLabel: t('nt.cat.rules'), unread: true },
    { id: 'ds-2', icon: 'alarm', intent: 'danger', title: t('nt.overdue.t'), desc: fill(t('nt.overdue.d'), { n: 2 }), time: t('nt.ago.1'), cat: 'work', catLabel: t('nt.cat.work'), unread: true },
    { id: 'ds-3', icon: 'check_circle', intent: 'success', title: t('nt.published.t'), desc: 'Idle cash', time: fill(t('nt.ago.n'), { n: 4 }), cat: 'rules', catLabel: t('nt.cat.rules'), unread: false },
    { id: 'ds-4', icon: 'sync', intent: 'brand', title: t('nt.run.t'), desc: fill(t('nt.run.d'), { r: 10, n: 4, h: 0 }), time: fill(t('nt.ago.n'), { n: 6 }), cat: 'data', catLabel: t('nt.cat.data'), unread: false },
  ];
  const ntShown = ntRows.filter((r) => ntTab === 'all' || r.cat === ntTab);
  const P = (children: ReactNode) => <p className="mut">{children}</p>;
  const sizes: [string, number][] = [['sm', 400], ['md', 560], ['lg', 760]];
  const twoBtn = (k: string) => ['warning', 'danger', 'confirm'].includes(k);
  return (
    <DsSec id="overlays" title={B('Drawer, menu & toast', 'Drawer, menu & toast')} lead={B("Drawers hold large interactions and close with Escape or the scrim. Toasts confirm a completed action for 2.4 s; no border. A failed action uses the danger variant (toast(msg, 'danger')).", "Drawer menampung interaksi besar dan ditutup dengan Escape atau scrim. Toast mengonfirmasi aksi yang selesai selama 2,4 detik; tanpa border. Aksi yang gagal memakai varian danger (toast(pesan, 'danger')).")}>
      <DsDemo label={B('Sizes sm · md · lg', 'Ukuran sm · md · lg') + ' · Drawer'}>{sizes.map(([s, w]) => <Button key={s} label={t('size.' + s) + ' · ' + w + 'px'} type="outlined" intent="neutral" onClick={() => onDrawer?.('demo', s)} />)}</DsDemo>
      <DsDemo label={B('Confirmation', 'Konfirmasi') + ' · Toast'}><Button label={B('Show toast', 'Tampilkan toast')} type="outlined" intent="neutral" onClick={() => onToast?.()} /></DsDemo>
      <DsTo p="menu" />
      <DsH>{B('Action menu', 'Menu aksi')}</DsH>
      {P(B("The ⋮ menu of a table row (ActionMenu, shared by every table) and the node menu of the condition builder. A column as wide as its widest item (176 to 320px, never wider than the viewport), one 36px row per item, it scrolls inside when it is tall and flips above the trigger near the bottom of the screen. It sits above the sticky decision bar and the bottom navigation. A press outside, Escape or Tab closes it and the focus returns to the trigger; the arrow keys, Home and End move between the enabled items. A destructive item uses the danger intent.", "Menu ⋮ pada baris tabel (ActionMenu, dipakai semua tabel) dan menu node pada pembuat kondisi. Satu kolom selebar item terlebar (176 sampai 320px, tidak pernah lebih lebar dari viewport), satu baris 36px per item, bergulir di dalam bila tinggi dan membuka ke atas pemicu di dekat dasar layar. Tampil di atas bar keputusan yang melekat dan navigasi bawah. Tekan di luar, Escape atau Tab menutupnya dan fokus kembali ke pemicu; tombol panah, Home dan End berpindah antar item yang aktif. Item yang merusak memakai intent danger."))}
      <DsDemo label={B('Action menu (static)', 'Menu aksi (statis)') + ' · ActionMenu .pop'}>
        <div className="pop" style={{ position: 'static' }}>
          <Button label={t('tbl.srEdit')} icon="edit" type="transparent" intent="neutral" />
          <Button label={t('tbl.srDup')} icon="content_copy" type="transparent" intent="neutral" />
          <Button label={t('tbl.srPublish')} icon="publish" type="transparent" intent="neutral" disabled />
          <Button label={t('tbl.srDelete')} icon="delete" type="transparent" intent="danger" />
        </div>
      </DsDemo>
      <DsApi rows={[
        ['ActionMenu({pos,items,perm,onPick,onClose,danger})', 'items: [action, icon][]', '—', B('The row menu of a table; opens at the trigger and fits the viewport.', 'Menu baris tabel; terbuka di pemicu dan muat di viewport.')],
        ['useActionMenu(ref,onClose,trigger)', 'Hook', '—', B('Outside press, Escape, Tab, arrow keys, focus in and back, fit to the viewport.', 'Tekan di luar, Escape, Tab, tombol panah, fokus masuk dan kembali, muat di viewport.')],
      ]} />
      <DsTo p="notifications" />
      <DsH>{B('Notifications', 'Notifikasi')}</DsH>
      {P(B("The bell sits in the sidebar footer, right of the theme button: an icon-only button with the number of unread notifications on it (none at 0, 9+ above 9; a polite live region announces the change). It opens a dropdown to the right of the sidebar with Mark all as read, the category tabs (All, Rules, Data, Work), the five newest unread notifications (all read: the five newest stay; Mark all as read is gone) and View all notifications in the footer, which opens a drawer with every notification of the last 3 months (Mark all as read is an icon left of Close, gone when all is read; the tabs stay fixed while the list scrolls; the end of the list says that only 3 months are shown). View all is a transparent brand button with an arrow. A row shows the icon of its kind, a title, one line, the time and the category, and a dot while unread. Opening a row marks it read and goes to what it is about. Empty, loading and error have their own states.", "Lonceng ada di footer sidebar, di kanan tombol tema: tombol ikon dengan jumlah notifikasi belum dibaca di atasnya (kosong bila 0, 9+ di atas 9; live region sopan mengumumkan perubahan). Membuka dropdown di kanan sidebar berisi Tandai semua dibaca, tab kategori (Semua, Rule, Data, Pekerjaan), lima notifikasi belum dibaca terbaru (semua terbaca: lima terbaru tetap tampil; Tandai semua dibaca hilang), dan Lihat semua notifikasi di footer yang membuka drawer berisi semua notifikasi 3 bulan terakhir (Tandai semua dibaca berupa ikon di kiri Close, hilang bila semua terbaca; tab tetap saat daftar digulir; ujung daftar menyatakan hanya 3 bulan yang ditampilkan). Lihat semua adalah tombol transparan brand dengan panah. Baris menampilkan ikon jenisnya, judul, satu baris, waktu dan kategori, serta titik selama belum dibaca. Membuka baris menandainya dibaca dan menuju tujuannya. Kosong, loading, dan galat punya keadaan sendiri."))}
      <DsDemo label={B('Bell (0, 3, 9+)', 'Lonceng (0, 3, 9+)') + ' · NotificationBell'}>{['', '3', '9+'].map((b) => <NotificationBell key={b || '0'} badge={b} label={b ? t('nt.bell') + ', ' + b : t('nt.bell')} live="" onOpen={() => undefined} />)}</DsDemo>
      <DsDemo label={B('Rows (unread, read)', 'Baris (belum dibaca, sudah dibaca)') + ' · NotificationItem'}>
        <ul className="ntl">{ntRows.map((r) => <NotificationItem key={r.id} row={r} unreadLabel={t('nt.unread')} onOpen={() => undefined} />)}</ul>
      </DsDemo>
      <DsDemo label={B('Dropdown of the bell (static: the unread, newest first, at most five)', 'Dropdown lonceng (statis: yang belum dibaca, terbaru dahulu, maksimal lima)') + ' · NotificationPopover'}>
        <NotificationPopover demo title={t('nt.t')} markAllLabel={t('nt.markAll')} unreadLabel={t('nt.unread')} emptyTitle={t('nt.empty.t')} emptyDesc={t('nt.empty.d')} state="ready" tabs={ntTabs} tab={ntTab} onTab={setNtTab}
          rows={ntShown.filter((r) => r.unread)} canMarkAll viewAllLabel={t('nt.viewAll')} onViewAll={() => setNtOpen('ready')} onClose={() => undefined} onMarkAll={() => undefined} onOpenRow={() => undefined} />
      </DsDemo>
      <DsDemo label={B('Open the drawer with every notification', 'Buka drawer dengan semua notifikasi') + ' · NotificationPanel'}>{(['ready', 'empty', 'loading', 'error'] as const).map((k) => <Button key={k} label={k} type="outlined" intent="neutral" testid={'ds-nt-' + k} onClick={() => setNtOpen(k)} />)}</DsDemo>
      {ntOpen ? <NotificationPanel title={t('nt.t')} closeLabel={t('lg.close')} markAllLabel={t('nt.markAll')} unreadLabel={t('nt.unread')} emptyTitle={t('nt.empty.t')} emptyDesc={t('nt.empty.d')} tabs={ntTabs} tab={ntTab} onTab={setNtTab} canMarkAll windowLabel={t('nt.window')}
        state={ntOpen === 'empty' ? 'ready' : ntOpen} rows={ntOpen === 'empty' ? [] : ntShown} onClose={() => setNtOpen(null)} onMarkAll={() => setNtOpen(null)} onOpenRow={() => setNtOpen(null)} onRetry={() => setNtOpen('ready')} /> : null}
      <DsApi rows={[
        ['NotificationBell({badge,label,live,onOpen})', 'badge: "" | "1".."9" | "9+"', '—', B('Icon-only Button with a count Chip on it (like the scenario button); `live` is announced politely when it changes.', 'Button ikon dengan Chip jumlah di atasnya (seperti tombol skenario); `live` diumumkan sopan saat berubah.')],
        ['NotificationItem({row,unreadLabel,onOpen})', 'row: {id, icon, intent, title, desc, time, unread}', '—', B('One row of the list: icon tile, title, summary, time, unread dot. Tokens only.', 'Satu baris daftar: ubin ikon, judul, ringkasan, waktu, titik belum dibaca. Hanya token.')],
        ['NotificationPopover({title,rows,tabs,tab,state,viewAllLabel,onViewAll,onMarkAll,onOpenRow,left})', 'rows: the unread to show (the host passes the five newest)', '—', B('The dropdown of the bell, to the right of the sidebar like the user menu (a phone: across the screen above the bottom bar): title and Mark all as read, the category Tabs, the rows, View all notifications in the footer.', 'Dropdown lonceng, di kanan sidebar seperti menu pengguna (phone: selebar layar di atas bottom bar): judul dan Tandai semua dibaca, Tabs kategori, baris, Lihat semua notifikasi di footer.')],
        ['NotificationPanel({title,rows,tabs,tab,state,onMarkAll,onOpenRow,onRetry,...})', 'state: ready | loading | error', 'ready', B('A Drawer (sm) with every notification, Mark all as read, the category tabs and the empty, loading and error states.', 'Drawer (sm) berisi semua notifikasi, Tandai semua dibaca, tab kategori, serta keadaan kosong, loading, dan galat.')],
      ]} />
      <DsTo p="modal" />
      <DsH>{B('Dialog templates', 'Template dialog')}</DsH>
      {P(B("A centred dialog for one short decision or a result message. The card has a soft glow in the tone colour, a round white icon badge, a bold title, an optional second line, a short text and one or two pill buttons (soft secondary on the left, solid primary on the right; a single action is full width). Escape or the scrim closes it. A form, a list or anything long uses a drawer, not a dialog.", "Dialog di tengah untuk satu keputusan singkat atau pesan hasil. Kartu punya glow lembut warna tone, lencana ikon putih bulat, judul tebal, baris kedua opsional, teks singkat, dan satu atau dua tombol pill (sekunder soft di kiri, utama solid di kanan; satu aksi selebar kartu). Escape atau scrim menutupnya. Form, daftar, atau konten panjang memakai drawer, bukan dialog."))}
      <DsDemo label={B('Templates (static)', 'Template (statis)') + ' · DialogCard kind'}>
        <div className="mdlg">{MD_KINDS.map((k) => (
          <DialogCard key={k} kind={k} id={'dsd-' + k} cls="static" title={t('md.' + k + '.t')} body={<p className="mut">{t('md.' + k + '.d')}</p>}
            footer={<>{twoBtn(k) ? <Button label={t('md.cancel')} type="soft" intent={k === 'progress' ? 'info' : 'neutral'} size="lg" /> : null}<Button label={t('md.' + k + '.ok')} type={k === 'progress' ? 'soft' : 'fill'} intent={MD_INT[k]} size="lg" full={!twoBtn(k)} /></>} />
        ))}</div>
      </DsDemo>
      <DsDemo label={B('Open as modal', 'Buka sebagai modal') + ' · Modal'}>{MD_KINDS.map((k) => <Button key={k} label={k} type="outlined" intent="neutral" onClick={() => onModal?.(k)} />)}</DsDemo>
      <DsApi rows={[
        ['Modal({kind,title,sub,body,footer,icon,id,cancel})', 'kind: success | info | progress | warning | danger | confirm', 'confirm', B('Fixed, centred, above drawers (z-index 92 / 93). Width 400 px; phones: full width minus 32 px.', 'Tetap di tengah, di atas drawer (z-index 92 / 93). Lebar 400 px; ponsel: selebar layar dikurangi 32 px.')],
        ['Dialog(kind,{title,sub,text,body,ok,cancel,icon,id})', 'ok / cancel: {label, act, data, icon}; null hides', '—', B('Ready-made texts per kind (md.<kind>.t / .d / .ok) that any screen can override.', 'Teks siap pakai per jenis (md.<kind>.t / .d / .ok) yang dapat diganti per layar.')],
        ['DialogCard(opts)', 'same as Modal, no scrim', '—', B('The card alone, used for the static gallery and inline previews.', 'Kartu saja, dipakai untuk galeri statis dan pratinjau inline.')],
      ]} />
      <DsTo p="menu" />
      <DsH>{B('Floating menu', 'Menu mengambang')}</DsH>
      {P(B("Row and node menus open as a fixed layer (.pop) on top of the page, so a card or a scroll area never clips them. When there is no room below the trigger the menu opens above it. It closes on outside click, on scroll and when an item is chosen. Items are transparent Buttons; destructive items use the danger intent.", "Menu baris dan node terbuka sebagai layer fixed (.pop) di atas halaman, sehingga card atau area scroll tidak memotongnya. Bila tidak ada ruang di bawah pemicu, menu terbuka ke atas. Menu menutup saat klik di luar, saat scroll, dan saat item dipilih. Item berupa Button transparan; item destruktif memakai intent danger."))}
      <DsTo p="modal" />
      <DsH>{B('Dialog with three choices', 'Dialog dengan tiga pilihan')}</DsH>
      {P(B("Pass alt next to ok and cancel when the user must choose how far a change goes. The three buttons stack: primary on top, the alternative in the middle (outlined), cancel at the bottom.", "Berikan alt di samping ok dan cancel bila user harus memilih seberapa jauh perubahan berlaku. Tiga tombol bertumpuk: utama di atas, alternatif di tengah (outlined), batal di bawah."))}
      <DsTo p="drawer" />
      <DsH>{B('Status drawer', 'Drawer status')}</DsH>
      {P(B("For readiness or health information in a drawer: a summary header with the overall status first, then a list of items that need attention, then one bordered card per source. Fields inside a card are rows with an icon, a name and a small value (bar, badge). Colour is only on icons and the summary, not on every row.", "Untuk informasi kesiapan atau kesehatan di drawer: header ringkasan dengan status keseluruhan lebih dulu, lalu daftar hal yang perlu perhatian, lalu satu kartu bergaris untuk tiap sumber. Field dalam kartu berupa baris dengan ikon, nama, dan nilai kecil (bar, badge). Warna hanya pada ikon dan ringkasan, bukan di setiap baris."))}
      <DsTo p="drawer" />
      <DsH>{B('Calm drawers', 'Drawer yang tenang')}</DsH>
      {P(B("A drawer should not stack alerts. Put the context in one muted line, group the cautions in a Worth knowing list (colour only on the icon) and write impact as a plain sentence with a small icon. Keep an Alert for one blocking message.", "Drawer tidak boleh menumpuk alert. Taruh konteks dalam satu baris redup, kelompokkan peringatan dalam daftar Perlu diketahui (warna hanya di ikon), dan tulis dampak sebagai kalimat polos dengan ikon kecil. Sisakan Alert untuk satu pesan yang memblokir."))}
      <DsTo p="menu" />
      <DsTo p="drawer" />
      <DsH>{B('Drawer with Back', 'Drawer dengan Kembali')}</DsH>
      {P(B("A drawer opened from another drawer shows an arrow Back button before its title and in the footer. Back returns to the previous drawer; Close closes everything. Example: Data readiness > Open data sources.", "Drawer yang dibuka dari drawer lain menampilkan tombol panah Kembali sebelum judul dan di footer. Kembali ke drawer sebelumnya; Tutup menutup semuanya. Contoh: Kesiapan data > Buka sumber data."))}
      <DsApi rows={[['Drawer({title,body,footer,back,actions})', 'back: label of the Back button · actions: buttons of the header, left of Close', '—', B('Action dback returns to ui.drawer.back. The body gap is 16px (.db).', 'Aksi dback kembali ke ui.drawer.back. Jarak isi 16px (.db).')]]} />
      <DsTo p="page-layouts" />
      <DsH>{B('Decision bar', 'Decision bar')}</DsH>
      {P(B("A layer for a pending choice or the state of the current page, in two variations. Pick by the page: a choice made from a list uses the bottom bar; a long form uses the aside.", "Lapisan untuk pilihan yang belum selesai atau status halaman saat ini, dalam dua variasi. Pilih menurut halaman: pilihan dari daftar memakai bar bawah; form panjang memakai aside."))}
      <DsDemo label={B('1 · Sticky bottom bar (opportunity detail)', '1 · Bar bawah sticky (detail opportunity)') + ' · .odbar'}>
        <div className="odbar" role="region" aria-label={B('Decision bar example', 'Contoh decision bar')} style={sty('position:static;width:100%')}><div className="odbar-r"><span className="odbar-ic"><Icon name="task_alt" /></span>
          <div className="m"><span className="odbar-l"><span className="fw6">{B('Your decision', 'Keputusan Anda')}</span><span className="mut">Rp 1,500,000,000</span></span><span className="odbar-t">{B('Time Deposit, 3 months', 'Deposito 3 bulan')}</span></div>
          <div className="odbar-a"><Button label={B('Clear', 'Hapus pilihan')} type="transparent" intent="neutral" /><Button label={B('Continue', 'Lanjut')} iconRight="arrow_forward" /></div></div></div>
      </DsDemo>
      {P(B("A sticky bottom layer for a pending choice on the current page. It appears only after the user selects an option, shows status + the selection + amount, expands for details, and offers Clear and the next step. Phone: sits above the bottom navigation; buttons are full width.", "Lapisan sticky di bawah untuk pilihan yang belum selesai di halaman ini. Muncul hanya setelah user memilih opsi, menampilkan status + pilihan + nominal, bisa dibuka untuk detail, dan menyediakan Hapus pilihan serta langkah berikutnya. Ponsel: berada di atas bottom navigation; tombol selebar layar."))}
      <DsDemo label={B('2 · Aside card (Add / edit rule)', '2 · Kartu aside (Tambah / ubah rule)') + ' · .sbaside .odbar.st'}>
        <div className="sbaside" style={sty('display:flex;max-width:360px')}><div className="odbar st" role="region" aria-label={B('Decision bar example', 'Contoh decision bar')} style={sty('width:100%')}><div className="odbar-r"><span className="odbar-ic"><Icon name="edit_note" /></span>
          <div className="m"><div className="odbar-l"><span className="fw6">{B('Idle balance rule', 'Rule saldo menganggur')}</span><span className="mut">SRL-014</span></div><div className="odbar-t mut" role="status">{B('Unsaved changes', 'Perubahan belum disimpan')}</div></div></div>
          <div className="odbar-a"><Button label={B('View result', 'Lihat hasil')} icon="play_arrow" type="outlined" intent="neutral" /><Button label={B('Save as draft', 'Simpan draf')} type="transparent" intent="neutral" /></div></div></div>
      </DsDemo>
      {P(B("On a long page the decision bar can sit in a right-hand aside (class sbaside) next to the content: a card with the status on top and, below a divider, a secondary action (outlined) and Save as a text button, both full width. Under the card, a row with Back and Next; on the last step Next becomes the primary submit button. The aside is sticky on desktop; on a phone the card becomes the bottom bar and the Back / Next row follows the form.", "Pada halaman panjang, decision bar bisa berada di aside kanan (class sbaside) di samping konten: kartu dengan status di atas dan, di bawah garis pemisah, aksi sekunder (outlined) dan Simpan sebagai tombol teks, keduanya selebar kartu. Di bawah kartu ada baris Kembali dan Lanjut; di langkah terakhir Lanjut menjadi tombol utama untuk kirim. Aside bersifat sticky di desktop; di ponsel kartu menjadi bar bawah dan baris Kembali / Lanjut mengikuti form."))}
      <DsApi rows={[['odDecisionBar(o)', 'opportunity', '—', B('Rendered at the end of the main column; position: sticky; bottom: 16px (phone: above the bottom nav).', 'Dirender di akhir kolom utama; position: sticky; bottom: 16px (ponsel: di atas bottom nav).')]]} />
    </DsSec>
  );
}
