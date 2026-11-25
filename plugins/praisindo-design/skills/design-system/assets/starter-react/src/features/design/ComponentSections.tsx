// Design System page: Components, first group (buttons, badges, alerts). Text is the prototype's own.
import { KPI, StatCards, StatIcon, StatRing, StatSolid, StatSoft, KpiCompact, KpiTrend, WArea, WLine, WBars, WDonut, WSegments, WGauge, WProgressList, WRingList, Delta, Spark, Ring } from '../../design-system/components/Widgets';
import { Meter } from '../../design-system/components/States';
import { HighlightText } from '../../design-system/components/HighlightText';
import { localeOf } from '../../lib/dateFormat';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { useState, type ReactNode } from 'react';
import { Alert } from '../../design-system/components/Alert';
import { ChangeNotice } from '../../design-system/components/ChangeNotice';
import { Icon } from '../../design-system/components/Icon';
import { Badge } from '../../design-system/components/Badge';
import { Button, LinkButton } from '../../design-system/components/Button';
import { Chip } from '../../design-system/components/Chip';
import { CopyButton } from '../../design-system/components/CopyButton';
import { DsApi, DsDemo, DsDo, DsH, DsSec, DsTo, sty, useB } from './ds';

const SIZES = ['sm', 'md', 'lg'] as const;
const INTENTS = ['brand', 'success', 'warning', 'danger', 'info', 'neutral', 'purple', 'cyan'] as const;

export function ButtonsSection() {
  const B = useB();
  const P = (children: ReactNode) => <p className="mut">{children}</p>;
  const { t } = usePrefs();
  return (
    <DsSec id="buttons" title={B('Button', 'Tombol')} lead={B('Buttons start an action. One fill button per area; neighbours of the primary action (Cancel, Reset) use transparent. Execution buttons say Apply, not Done.', 'Tombol memulai aksi. Satu tombol fill per area; tombol di sebelah aksi utama (Batal, Reset) memakai transparent. Tombol eksekusi memakai Terapkan, bukan Selesai.')}>
      <DsDemo label={B('Types', 'Tipe') + ' · Button type'}><Button label={B('Fill', 'Fill')} /><Button label="Soft" type="soft" /><Button label="Outlined" type="outlined" intent="neutral" /><Button label="Transparent" type="transparent" intent="neutral" /><Button label="Link" type="link" /></DsDemo>
      <DsDemo label={B('Sizes', 'Ukuran') + ' · Button size'}>{SIZES.map((s) => <Button key={s} label={t('size.' + s)} size={s} icon="bolt" />)}</DsDemo>
      <DsDemo label={B('Intents', 'Intent') + ' · Button intent'}>{['brand', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'].map((i) => <Button key={i} label={i} intent={i} type={i === 'neutral' ? 'outlined' : 'fill'} />)}</DsDemo>
      <DsDemo label={B('Intents · soft', 'Intent · soft') + ' · Button intent type=soft'}>{['brand', 'secondary', 'success', 'warning', 'danger', 'info'].map((i) => <Button key={i} label={i} intent={i} type="soft" />)}</DsDemo>
      <DsDemo label={B('Link button & chevron', 'Tombol link & chevron') + ' · LinkButton'}>
        <LinkButton label={t('home.viewAll')} href="#/design" type="link" size="sm" iconRight="chevron_right" />
        <Button label={t('nba.cta')} type="outlined" intent="neutral" iconRight="chevron_right" />
        <LinkButton icon="chevron_right" href="#/design" type="transparent" intent="neutral" size="sm" aria={t('tbl.view')} title={t('tbl.view')} />
      </DsDemo>
      <DsDemo label={B('Icon only', 'Hanya ikon') + ' · Button icon'}>
        <Button icon="more_vert" type="transparent" intent="neutral" aria="More" /><Button icon="file_download" type="outlined" intent="neutral" aria="Export" />
      </DsDemo>
      <DsDemo label={B('Disabled (rule BT-08)', 'Nonaktif (aturan BT-08)') + ' · Button disabled'}>
        {(['fill', 'soft', 'outlined', 'transparent', 'link'] as const).map((ty) => <Button key={ty} label={ty} type={ty} intent={ty === 'outlined' ? 'neutral' : 'brand'} disabled />)}
        {(['fill', 'soft', 'outlined', 'transparent'] as const).map((ty) => <Button key={'i' + ty} label={ty} icon="download" type={ty} intent={ty === 'outlined' ? 'neutral' : 'brand'} disabled />)}
        {(['fill', 'soft', 'outlined', 'transparent'] as const).map((ty) => <Button key={'o' + ty} icon="more_vert" type={ty} intent={ty === 'outlined' ? 'neutral' : 'brand'} aria={ty} disabled />)}
      </DsDemo>
      <DsApi rows={[
        ['label', 'string', '—', B('Verb first: "Take action", "Assign".', 'Diawali kata kerja: "Ambil tindakan", "Tugaskan".')],
        ['type', 'fill · soft · outlined · transparent · link', 'fill', B('Link has no horizontal padding.', 'Link tanpa padding kiri-kanan.')],
        ['intent', 'brand · secondary · success · warning · danger · info · neutral', 'brand', B('warning: proceed with a risky but allowed action (e.g. "Continue without verification") — dark text on amber. info: a neutral, informative action that is not the primary one (e.g. "View guide"). danger: destructive. success: confirm a positive result.', 'warning: melanjutkan aksi berisiko yang tetap diizinkan (mis. "Lanjutkan tanpa verifikasi") — teks gelap di atas kuning. info: aksi informatif yang bukan aksi utama (mis. "Lihat panduan"). danger: destruktif. success: mengonfirmasi hasil positif.')],
        ['size', 'sm · md · lg', 'md', ''],
        ['icon / iconRight', 'Material icon name', '—', B('iconRight for chevrons after the label.', 'iconRight untuk chevron setelah label.')],
        ['cls / title / aria', 'string', '—', B('Extra class hook, tooltip, accessible name (required for icon-only).', 'Hook class tambahan, tooltip, nama aksesibel (wajib untuk hanya ikon).')],
        ['act / data', 'data-act handler + data-*', '—', B('The handler checks permission.', 'Handler memeriksa izin.')],
        ['expanded / controls', 'boolean · id', '—', B('A button that opens and closes a part of the page (aria-expanded, aria-controls), for example the row of a table that shows its details.', 'Tombol yang membuka dan menutup bagian halaman (aria-expanded, aria-controls), misalnya baris tabel yang menampilkan rinciannya.')],
        ['disabled', 'boolean', 'false', B('Explain why in a tooltip.', 'Jelaskan alasannya di tooltip.')],
        ['aria', 'string', '—', B('Required for icon-only.', 'Wajib untuk tombol hanya ikon.')],
      ]} />
      {P(B("Put the icon after the label when the button moves forward or opens something: Next, Submit, Show more. Use iconRight, not icon. Back and actions that start something keep the icon on the left.", "Taruh ikon setelah label bila tombol bergerak maju atau membuka sesuatu: Next, Submit, Show more. Pakai iconRight, bukan icon. Back dan aksi yang memulai sesuatu tetap berikon di kiri."))}
      <DsDemo label={B('Icon on the right', 'Ikon di kanan') + ' · Button iconRight'}>
        <div className="rw"><Button label={B('Back', 'Kembali')} icon="arrow_back" type="outlined" intent="neutral" /><Button label={B('Next', 'Lanjut')} iconRight="arrow_forward" /><Button label={B('Submit for review', 'Kirim untuk review')} iconRight="send" /></div>
      </DsDemo>
      <DsDo dos={[B('Keep one primary (fill) button per area.', 'Satu tombol utama (fill) per area.'), B('Max 3 actions per table row: 2 transparent labels + 1 more icon.', 'Maksimal 3 aksi per baris tabel: 2 label transparent + 1 ikon lainnya.')]}
        donts={[B('Put two fill buttons side by side.', 'Menaruh dua tombol fill berdampingan.'), B('Use a link button for destructive actions.', 'Memakai tombol link untuk aksi destruktif.')]} />
    </DsSec>
  );
}

export function BadgesSection() {
  const B = useB();
  const { t } = usePrefs();
  const rules1 = [
    B('There is one badge look: a soft rectangle (radius 8px, token --r-badge) with the text in the colour of the intent and no icon (rule BD-02). A status and a category are the same badge; the icon, the dot, the fill, the outline and any animation are gone.', 'Hanya ada satu tampilan badge: persegi soft (radius 8px, token --r-badge) dengan teks berwarna intent dan tanpa ikon (aturan BD-02). Status dan kategori adalah badge yang sama; ikon, titik, fill, outline, dan animasi tidak ada lagi.'),
    B('The colour comes from the central map (domain/badgeIcons.ts): the same value has the same colour everywhere. A page never picks an intent of its own.', 'Warna berasal dari peta pusat (domain/badgeIcons.ts): nilai yang sama berwarna sama di mana pun. Halaman tidak pernah memilih intent sendiri.'),
    B('Data of a TYPE with up to five options (the type of a user: company or individual; a payment method: cash, in stages or instalments) is a Badge (rule BD-16). Names, numbers, versions and tags are Chips.', 'Data bersifat TIPE dengan paling banyak lima pilihan (tipe user: company atau individual; metode pembayaran: cash, bertahap, atau cicil) adalah Badge (aturan BD-16). Nama, angka, versi, dan tag adalah Chip.'),
    B('The badge is one line. A text that does not fit is cut with an ellipsis and the full label is the title.', 'Badge satu baris. Teks yang tidak muat dipotong dengan elipsis dan label penuh menjadi title.'),
    B('Contrast: in light mode success, danger and info use the darker surface-*-strong-2 token (7.00, 5.75 and 7.56:1), the others their strong foreground. Warning in light is 1.92:1, a known and accepted exception of the owner (CL-04): the icon and the label carry the meaning.', 'Kontras: di mode terang success, danger, dan info memakai token surface-*-strong-2 yang lebih gelap (7,00; 5,75; 7,56:1), yang lain foreground strong-nya. Warning di terang 1,92:1, pengecualian yang diketahui dan diterima owner (CL-04): ikon dan label membawa makna.'),
  ];
  const rules2 = [
    B('One colour map per concept, in one place: domain/badgeMaps.ts (intents) and domain/badgeIcons.ts (the intent of every value). Use the badge component (Badge with badgeProps(domain, value)) — never a literal intent or a per-screen variant.', 'Satu peta warna per konsep, di satu tempat: domain/badgeMaps.ts (intent) dan domain/badgeIcons.ts (intent dan ikon tiap nilai). Pakai komponen badge (Badge with badgeProps(domain, value)) — jangan intent literal atau varian per layar.'),
    B('The same label always has the same colour: e.g. "Completed" is green and "Follow-up" is amber everywhere.', 'Label yang sama selalu berwarna sama: mis. "Selesai" hijau dan "Tindak lanjut" kuning di mana pun.'),
    B('Hover (mouse) or tap (touch) on a badge shows a tooltip that says what it is for: "Status is Active", "Risk profile is Moderate". A domain badge builds it from its domain and label; a fixed badge has its own sentence; a badge outside the map passes what or tip. A badge is still never focusable.', 'Arahkan kursor (mouse) atau ketuk (sentuh) sebuah badge untuk melihat tooltip tentang fungsinya: "Status adalah Aktif", "Profil risiko adalah Moderate". Badge domain menyusunnya dari domain dan labelnya; badge tunggal punya kalimat sendiri; badge di luar peta memakai what atau tip. Badge tetap tidak pernah bisa difokus.'),
  ];
  return (
    <DsSec id="badges" title={B('Badge', 'Badge')} lead={B('One soft badge for categories and statuses: a rectangle with text in the colour of the intent, no icon. Never an icon, a dot, a fill or an outline.', 'Satu badge soft untuk kategori dan status: persegi dengan teks berwarna intent, tanpa ikon. Tidak pernah ikon, titik, fill, atau outline.')}>
      <DsDemo label={B('Intents', 'Intent') + ' · Badge'}>{INTENTS.map((i) => <Badge key={i} label={t('intent.' + i)} intent={i} />)}</DsDemo>
      <DsTo p="badge" />
      <ul className="dsrules">{rules1.map((x) => <li key={x}>{x}</li>)}</ul>
      <ul className="dsrules">{rules2.map((x) => <li key={x}>{x}</li>)}</ul>
      <DsApi rows={[
        ['Badge({label, intent, title, domain, value, what, tip})', 'string · intent · string', B('intent = brand', 'intent = brand'), B('The one badge, without an icon (BD-02: there is no icon and no noIcon prop). title is the native title; when the text is cut and no title is given, the label is the title. domain and value (from badgeProps) or what or tip give the hover tooltip (BD-13). The badge has one size (20px high).', 'Satu-satunya badge, tanpa ikon (BD-02: tidak ada ikon dan tidak ada prop noIcon). title adalah title bawaan; bila teks terpotong dan title kosong, label menjadi title. domain dan value (dari badgeProps) atau what atau tip memberi tooltip hover (BD-13). Badge satu ukuran (tinggi 20px).')],
        ['badgeFor(domain, value)', 'domain · value', '—', B('Returns { intent } of a value from domain/badgeIcons.ts; badgeProps adds the domain and value for the hover tooltip. A domain wrapper of your product uses it.', 'Mengembalikan { intent } sebuah nilai dari domain/badgeIcons.ts; badgeProps menambah domain dan value untuk tooltip hover. Pembungkus domain produk Anda memakainya.')],
      ]} />
    </DsSec>
  );
}

export function ChipsSection() {
  const B = useB();
  const { t } = usePrefs();
  const [sel, setSel] = useState<readonly string[]>(['new']), [tags, setTags] = useState<readonly string[]>(['Priority', 'Mass']);
  const toggle = (k: string) => setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  const rules = [
    B('A Badge is a status or a category and is never interactive. A Chip is a compact non-status label: a number, a tag, a name, a version, a user\'s choice. A static Chip only shows (20px, solid neutral); an interactive Chip is selected (aria-pressed), clicked or removed (a separate close button, 28px). If the label itself answers "what is its status?" it is a Badge; if it is only a number, a name, a value or a choice it is a Chip.', 'Badge adalah status atau kategori dan tidak pernah interaktif. Chip adalah label ringkas non-status: angka, tag, nama, versi, pilihan pengguna. Chip statis hanya tampil (20px, neutral solid); Chip interaktif dipilih (aria-pressed), diklik, atau dihapus (tombol tutup terpisah, 28px). Bila isi labelnya menjawab "statusnya apa?" itu Badge; bila hanya angka, nama, nilai, atau pilihan itu Chip.'),
    B('Both modes are full pills (token --r-pill). The interactive Chip is 28px high with a neutral outline at rest, soft brand when selected, hover, a visible focus ring and a disabled state; on a phone the touch target is 42px (40px or more) and the look does not grow. A static Chip has no hover, no focus and no pointer, and never carries a status colour or a status icon.', 'Kedua mode berbentuk pil penuh (token --r-pill). Chip interaktif tinggi 28px dengan outline netral saat diam, brand soft saat dipilih, hover, cincin fokus yang terlihat, dan state disabled; di phone target sentuh 42px (40px atau lebih) dan tampilan tidak membesar. Chip statis tanpa hover, fokus, dan pointer, dan tidak pernah memakai warna atau ikon status.'),
    B('A removable Chip is a container with the label and ONE close button: nothing interactive is nested in anything interactive. Every Chip needs a label; the close button needs an aria-label.', 'Chip yang bisa dihapus adalah wadah berisi label dan SATU tombol tutup: tidak ada elemen interaktif bersarang. Setiap Chip butuh label; tombol tutup butuh aria-label.'),
  ];
  return (
    <DsSec id="chips" title={B('Chip', 'Chip')} lead={B('The compact label for a number, a tag, a name or a version: static, or interactive (select it, click it, remove it). A status or a category is a Badge.', 'Label ringkas untuk angka, tag, nama, atau versi: statis, atau interaktif (pilih, klik, hapus). Status atau kategori adalah Badge.')}>
      <DsH>{B('Static: a number, a tag, a name, a version', 'Statis: angka, tag, nama, versi')}</DsH>
      <DsDemo label={B('Counts', 'Jumlah') + ' · Chip'}><Chip label="3" /><Chip label="99+" /><Chip label="3" selected /><Chip label={B('3 improved', '3 membaik')} /></DsDemo>
      <DsDemo label={B('Tags, names, versions', 'Tag, nama, versi') + ' · Chip'}><Chip label="Mutual Fund" /><Chip label="VIP" /><Chip label="v1.91" /><Chip label={t('pl.sig.publish')} /></DsDemo>
      <DsH>{B('Interactive: select, click, remove', 'Interaktif: pilih, klik, hapus')}</DsH>
      <DsDemo label={B('Default and selected', 'Default dan terpilih') + ' · Chip onClick selected'}><Chip label={B('Default', 'Default')} onClick={() => undefined} /><Chip label={B('Selected', 'Terpilih')} selected onClick={() => undefined} /><Chip label={B('Not selected', 'Tidak dipilih')} selected={false} onClick={() => undefined} /></DsDemo>
      <DsDemo label={B('With an icon', 'Dengan ikon') + ' · Chip icon'}><Chip label={t('os.new')} icon="local_fire_department" selected={sel.includes('new')} onClick={() => toggle('new')} /><Chip label={t('os.completed')} icon="task_alt" onClick={() => undefined} /></DsDemo>
      <DsDemo label={B('Disabled', 'Disabled') + ' · Chip disabled'}><Chip label={B('Disabled', 'Disabled')} disabled onClick={() => undefined} /><Chip label={B('Disabled and selected', 'Disabled dan terpilih')} selected disabled onClick={() => undefined} /></DsDemo>
      <DsDemo label={B('Removable', 'Bisa dihapus') + ' · Chip onRemove'}>{tags.map((x) => <Chip key={x} label={x} removeLabel={B('Remove ', 'Hapus ') + x} onRemove={() => setTags(tags.filter((y) => y !== x))} />)}{tags.length ? null : <span className="mut">{B('All removed. Reload the page to see them again.', 'Semua dihapus. Muat ulang halaman untuk melihatnya lagi.')}</span>}</DsDemo>
      <ul className="dsrules">{rules.map((x) => <li key={x}>{x}</li>)}</ul>
      <DsApi rows={[
        ['Chip({label, icon, selected, onClick, onRemove, removeLabel, disabled, title})', 'string · icon name · boolean · handlers', '—', B('No onClick and no onRemove: STATIC, a <span> 20px high, SOLID neutral (selected = solid brand, no shadow). With onClick: one <button> 28px high; selected = true or false makes it a toggle (aria-pressed). With onRemove: a container with the label and one close button (removeLabel is its aria-label), always drawn selected. Full pill, touch target of 40px or more on a phone (42px) for the interactive modes.', 'Tanpa onClick dan onRemove: STATIS, <span> tinggi 20px, neutral SOLID (selected = brand solid, tanpa bayangan). Dengan onClick: satu <button> tinggi 28px; selected = true atau false menjadikannya toggle (aria-pressed). Dengan onRemove: wadah berisi label dan satu tombol tutup (removeLabel adalah aria-label-nya), selalu tampil terpilih. Pil penuh, target sentuh 42px (40px atau lebih) di phone untuk mode interaktif.')],
        ['tone="soft"', 'soft', B('solid', 'solid'), B('Static counts only: the SOFT look (neutral soft fill; soft brand when selected) for a chip on a component with a solid fill. A fill Button does it by itself (CSS). `tone="default"` is the old name of the solid look and means the same.', 'Hanya hitungan statis: tampilan SOFT (isi neutral soft; brand soft saat terpilih) untuk chip di komponen berlatar solid. Tombol fill melakukannya sendiri (CSS). `tone="default"` adalah nama lama tampilan solid dan berarti sama.')],
        ['.chp · .chp-s · .chp-sf · .chp.on · .chp-r · .chp-x', 'classes', '—', B('Base, static, soft tone, selected, removable container, close button.', 'Dasar, statis, nada soft, terpilih, wadah yang bisa dihapus, tombol tutup.')],
      ]} />
    </DsSec>
  );
}

export function AlertsSection() {
  const B = useB();
  const P = (children: ReactNode) => <p className="mut">{children}</p>;
  const { t } = usePrefs();
  const txt: Record<string, string> = {
    info: B('Data as of 3 Oct 2026. Some values are demo estimates.', 'Data per 3 Okt 2026. Sebagian nilai adalah estimasi demo.'),
    success: B('3 opportunities assigned to Rizky Pratama.', '3 peluang ditugaskan ke Rizky Pratama.'),
    warning: B('Some data sources did not respond. Affected values show "—".', 'Sebagian sumber data tidak merespons. Nilai terdampak tampil "—".'),
    danger: B('The action could not be saved. Your input is kept.', 'Aksi gagal disimpan. Input Anda tetap tersimpan.'),
  };
  const ttl: Record<string, string> = { info: B('Information', 'Informasi'), success: B('Success', 'Berhasil'), warning: B('Warning', 'Peringatan'), danger: B('Error', 'Error') };
  const [shown, setShown] = useState(true);
  return (
    <DsSec id="alerts" title={B('Alert', 'Alert')} lead={B('Inline messages about the page or a section: a card with a soft tint fading from the left, an icon tile, an optional title, an optional action and close button; no shadow. Errors say what went wrong and what is kept.', 'Pesan inline tentang halaman atau section: kartu dengan tint lembut yang memudar dari kiri, tile ikon, judul opsional, aksi dan tombol tutup opsional; tanpa shadow. Error menjelaskan apa yang salah dan apa yang tetap tersimpan.')}>
      <DsDemo label={B('Description only', 'Hanya deskripsi') + ' · Alert'}><div className="dsal">{['info', 'success', 'warning', 'danger'].map((i) => <Alert key={i} intent={i} text={txt[i]!} />)}</div></DsDemo>
      <DsH>{B('With a title', 'Dengan judul')}</DsH>
      <DsDemo label={B('Title + description', 'Judul + deskripsi') + ' · Alert title'}><div className="dsal">{['info', 'success', 'warning', 'danger'].map((i) => <Alert key={i} intent={i} title={ttl[i]!} text={txt[i]!} />)}</div></DsDemo>
      <DsH>{B('With an action on the right', 'Dengan aksi di kanan')}</DsH>
      <DsDemo label={B('Recovery action', 'Aksi pemulihan') + ' · Alert extra'}><div className="dsal">
        <Alert intent="danger" title={ttl.danger} text={txt.danger!} extra={<Button label={t('state.retry')} type="transparent" intent="neutral" size="sm" />} />
        <Alert intent="warning" text={txt.warning!} extra={<Button label={B('Refresh', 'Muat ulang')} type="transparent" intent="neutral" size="sm" />} />
        <Alert intent="info" title={ttl.info} text={txt.info!} extra={<Button label={B('View details', 'Lihat detail')} type="outlined" intent="neutral" size="sm" />} />
      </div></DsDemo>
      <DsH>{B('Dismissible', 'Dapat ditutup')}</DsH>
      <DsDemo label={B('Close button', 'Tombol tutup') + ' · Alert onClose'}><div className="dsal">
        {shown ? <Alert intent="success" title={ttl.success} text={txt.success!} onClose={() => setShown(false)} /> : <Button label={B('Show the alert again', 'Tampilkan alert lagi')} type="outlined" intent="neutral" size="sm" onClick={() => setShown(true)} />}
      </div></DsDemo>
      <DsH>{B('Compact', 'Ringkas')}</DsH>
      <DsDemo label={B('For drawers and toolbars', 'Untuk drawer dan toolbar') + ' · Alert compact'}><div className="dsal">{['info', 'warning'].map((i) => <Alert key={i} intent={i} compact text={txt[i]!} />)}</div></DsDemo>
      <DsApi rows={[['intent', 'info · success · warning · danger', 'info', B('Sets the tint, the icon and its colour.', 'Menentukan tint, ikon, dan warnanya.')], ['text', 'string', '—', B('One or two sentences. Description when a title is given.', 'Satu atau dua kalimat. Deskripsi bila ada judul.')], ['title', 'string', '—', B('Bold first line; use it when the message needs a name (Error, Saved).', 'Baris pertama tebal; pakai bila pesan perlu nama (Error, Tersimpan).')], ['extra', 'HTML (button)', '—', B('Action on the right: Retry, Refresh, View details.', 'Aksi di kanan: Coba lagi, Muat ulang, Lihat detail.')], ['onClose', '() => void', '—', B('Shows a close button; only for messages the user may dismiss.', 'Menampilkan tombol tutup; hanya untuk pesan yang boleh ditutup user.')], ['compact', 'boolean', 'false', B('Dense variant without the icon tile.', 'Varian padat tanpa tile ikon.')]]} />
      {P(B("Use it when an action changed something the user should check, such as moving a condition that changes the logic. A neutral card with an icon, a title and short text, optional before / after rows where only the changed words are marked, a footer line for the effect, and actions (Undo, Dismiss). Do not use a yellow alert for this: alerts are for blocking or urgent messages, and a card keeps the page calm.", "Pakai saat suatu aksi mengubah sesuatu yang perlu dicek user, misalnya memindah kondisi yang mengubah logika. Card netral dengan ikon, judul, teks singkat, baris sebelum / sesudah opsional di mana hanya kata yang berubah ditandai, baris footer untuk dampaknya, dan aksi (Undo, Dismiss). Jangan memakai alert kuning untuk ini: alert untuk pesan yang memblokir atau mendesak, sedangkan card menjaga halaman tetap tenang."))}
      <DsDemo label={B('Change notice', 'Pemberitahuan perubahan') + ' · ChangeNotice'}>
        <ChangeNotice role="note" title={B('This move changes the logic', 'Perpindahan ini mengubah logika')} text={B('The rule now selects different customers.', 'Rule kini memilih nasabah yang berbeda.')}
          rows={[[B('Before', 'Sebelum'), <>Days to maturity 1 – 14 days <mark className="sbdf">OR</mark> AUM &gt; …</>], [B('After', 'Sesudah'), <>Days to maturity 1 – 14 days <mark className="sbdf">AND</mark> AUM &gt; …</>]]}
          foot={<><Icon name="groups" /><span className="mut">{B('Customers matched', 'Nasabah yang cocok')}</span><span className="fw6">42</span><Icon name="arrow_forward" /><span className="fw6">97</span></>}
          actions={<><Button label={B('Undo', 'Urungkan')} icon="undo" type="outlined" intent="neutral" size="sm" /><Button label={B('Dismiss', 'Tutup')} type="transparent" intent="neutral" size="sm" /></>} />
      </DsDemo>
    </DsSec>
  );
}

/** A row of the Widget section: the variant name on the left and the widget on the right, like the Badge section (DsDemo). */
const WVar = ({ n, children }: { n: string; children: ReactNode }) => <DsDemo label={n}><div className="wgrid" style={sty('flex:1 1 100%')}>{children}</div></DsDemo>;

export function WidgetsSection() {
  const B = useB();
  const { t, prefs } = usePrefs();
  const loc = localeOf(prefs.lang);
  const days = B('Mon Tue Wed Thu Fri Sat Sun', 'Sen Sel Rab Kam Jum Sab Min').split(' ');
  const vs = B('vs last month', 'vs bulan lalu'), fromWeek = B('from last week', 'dari minggu lalu');
  return (
    <DsSec id="widgets" title={B('Widget', 'Widget')} lead={B('Widgets are small self-contained cards that show data as a chart or a share: a line, an area, bars, a donut, a gauge, a list of progress. The cards that show one number are components of their own, on the pages Stat cards and KPI cards. Charts are inline SVG coloured only through intents, so they follow light and dark tokens. Every line or area chart is drawn like the Opportunity trend, with smooth lines: a soft fill, no markers and a tooltip that lists every series when the pointer is over a point (rule CT-01); the legend of every chart is under the chart (rule CT-02).', 'Widget adalah card kecil mandiri yang menampilkan data sebagai grafik atau porsi: garis, area, batang, donut, gauge, daftar progres. Card yang menampilkan satu angka adalah komponen tersendiri, di halaman Kartu stat dan Kartu KPI. Grafik berupa SVG inline yang diwarnai hanya lewat intent, sehingga mengikuti token terang dan gelap. Setiap grafik garis atau area digambar seperti Opportunity trend dengan garis halus (tidak kaku): isi lembut, tanpa penanda, dan tooltip yang menampilkan semua seri saat pointer di atas satu titik (aturan CT-01); legenda setiap grafik berada di bawah grafik (aturan CT-02).')}>
      <DsTo p="kpi" />
      <>
        <WVar n={B('KPI with a change · icon card', 'KPI dengan perubahan · kartu ikon') + ' · KPI delta'}><KPI variant="card" label={B('Total revenue', 'Total pendapatan')} n="Rp 128,4 M" delta={16.8} note={vs} intent="brand" icon="payments" /></WVar>
        <WVar n={B('KPI with a change · icon card', 'KPI dengan perubahan · kartu ikon') + ' · KPI delta'}><KPI variant="card" label={B('Total orders', 'Total order')} n="1.245" delta={12.5} note={vs} intent="success" icon="shopping_bag" /></WVar>
        <WVar n={B('KPI with a change · icon card', 'KPI dengan perubahan · kartu ikon') + ' · KPI delta'}><KPI variant="card" label={B('Customers', 'Nasabah')} n="3.892" delta={-8.7} note={vs} intent="purple" icon="groups" /></WVar>
        <WVar n={B('KPI with a change · icon card', 'KPI dengan perubahan · kartu ikon') + ' · KPI delta'}><KPI variant="card" label={B('Average order value', 'Rata-rata nilai order')} n="Rp 103,3 jt" delta={6.3} note={vs} intent="warning" icon="person" /></WVar>
        <WVar n={B('KPI with a sparkline', 'KPI dengan sparkline') + ' · KPI spark'}><KPI variant="card" label={B('Customers contacted', 'Customer dihubungi')} n={48} delta={-6} note={vs} spark={[12, 15, 11, 18, 16, 21, 19]} intent="info" /></WVar>
        <WVar n={B('Compact sparkline', 'Ringkas + sparkline') + ' · KpiCompact'}><KpiCompact title={B('Daily engagement', 'Engagement harian')} value="1.389" label={B('Interactions', 'Interaksi')} spark={[8, 12, 9, 14, 11, 16, 15, 18]} intent="info" /></WVar>
        <WVar n={B('Trend with footer band', 'Tren dengan pita bawah') + ' · KpiTrend'}><KpiTrend title={B('Total engagements', 'Total engagement')} value="1.870" spark={[18, 22, 17, 25, 21, 19, 24, 20, 18]} delta={-6} note={vs} /></WVar>
        <WVar n={B('Trend with footer band', 'Tren dengan pita bawah') + ' · KpiTrend'}><KpiTrend title={B('Converted value', 'Nilai konversi')} value="Rp 8,4 M" spark={[10, 12, 11, 15, 14, 18, 17, 21]} delta={12} note={vs} /></WVar>
      </>
      <DsTo p="stat" />
      <>
        <DsDemo label={B('Stat cards with a ring', 'Kartu statistik dengan ring') + ' · StatCards'}><div style={sty('flex:1 1 100%')}><StatCards variant="ring" items={[{ icon: 'list_alt', intent: 'brand', n: 19, label: t('stat.total'), pct: 100 }, { icon: 'bolt', intent: 'success', n: 16, label: t('stat.active'), pct: 84 }, { icon: 'priority_high', intent: 'danger', n: 6, label: B('High priority', 'Prioritas tinggi'), pct: 32 }]} /></div></DsDemo>
        <WVar n={B('Icon stat', 'Ikon + angka') + ' · StatIcon'}><StatIcon icon="lightbulb" value="384" label={B('New opportunities', 'Peluang baru')} delta={25} /></WVar>
        <WVar n={B('Ring stat', 'Ring persentase') + ' · StatRing'}><StatRing pct={47} label={B('Conversion rate', 'Tingkat konversi')} intent="warning" /></WVar>
        <WVar n={B('Solid highlight', 'Sorotan penuh') + ' · StatSolid'}><StatSolid icon="groups" value="1.253" label={B('Customers managed', 'Customer dikelola')} delta={25} /></WVar>
        <WVar n={B('Soft highlight', 'Sorotan lembut') + ' · StatSoft'}><StatSoft icon="groups" value="1.253" label={B('Customers managed', 'Customer dikelola')} delta={25} /></WVar>
      </>
      <DsTo p="widgets" />
      <DsH>{B('Line, area and bar charts', 'Grafik garis, area dan batang')}</DsH>
      <>
        <WVar n={B('Area chart', 'Grafik area') + ' · WArea'}><WArea icon="savings" label={B('Assets under management', 'Dana kelolaan')} value="Rp 23,4 M" delta={3} spark={[14, 16, 15, 13, 17, 19, 18, 22, 20, 24]} /></WVar>
        <WVar n={B('Line chart', 'Grafik garis') + ' · WLine'}><WLine title={B('On-time follow-up', 'Tindak lanjut tepat waktu')} value="95%" delta={5} note={fromWeek} spark={[62, 70, 66, 78, 74, 88, 84, 95]} labels={days} intent="purple" /></WVar>
        <WVar n={B('Bar chart', 'Grafik batang') + ' · WBars'}><WBars title={B('Activities completed', 'Aktivitas selesai')} value="98" delta={25} note={fromWeek} vals={[9, 12, 16, 11, 7, 15, 10]} labels={days} hi={3} /></WVar>
      </>
      <DsH>{B('Share & progress', 'Porsi & progres')}</DsH>
      <>
        <WVar n={B('Donut', 'Donut') + ' · WDonut'}><WDonut pct={72} center="72%" value={B('54 min', '54 mnt')} label={B('Average response time', 'Rata-rata waktu respons')} intent="success" /></WVar>
        <WVar n={B('Segments donut', 'Donut segmen') + ' · WSegments'}><WSegments title={B('Portfolio mix', 'Komposisi portofolio')} segs={[{ label: 'Time Deposit', v: 35, intent: 'brand' }, { label: 'Mutual Fund', v: 23, intent: 'success' }, { label: 'Fixed Income', v: 23, intent: 'warning' }, { label: B('Insurance', 'Asuransi'), v: 19, intent: 'info' }]} /></WVar>
        <WVar n={B('Half gauge', 'Gauge setengah') + ' · WGauge'}><WGauge title={B('Monthly conversion target', 'Target konversi bulanan')} value={6.8} target={10} fmt={(v) => 'Rp ' + v.toLocaleString(loc, { maximumFractionDigits: 1 }) + ' ' + B('B', 'M')} note={B('12 days left this month', 'Sisa 12 hari bulan ini')} /></WVar>
        <WVar n={B('Progress list', 'Daftar progres') + ' · WProgressList'}><WProgressList title={B('Pipeline by product', 'Pipeline per produk')} items={[{ label: 'Time Deposit', value: 'Rp 1,4 M', target: 'Rp 4,5 M', v: 1.4, of: 4.5, intent: 'brand' }, { label: 'Mutual Fund', value: 'Rp 2,4 M', target: 'Rp 4,0 M', v: 2.4, of: 4, intent: 'success' }, { label: 'Fixed Income', value: 'Rp 1,9 M', target: 'Rp 3,3 M', v: 1.9, of: 3.3, intent: 'danger' }, { label: B('Insurance', 'Asuransi'), value: 'Rp 1,2 M', target: 'Rp 3,0 M', v: 1.2, of: 3, intent: 'warning' }]} /></WVar>
        <WVar n={B('Ring list', 'Daftar ring') + ' · WRingList'}><WRingList title={B('Opportunity stages', 'Tahap peluang')} items={[{ icon: 'person_add', label: t('os.assigned'), value: '10.023', pct: 72, delta: 22, intent: 'brand' }, { icon: 'call', label: t('os.in_progress'), value: '3.993', pct: 48, delta: -3, intent: 'success' }, { icon: 'task_alt', label: t('os.completed'), value: '21.319', pct: 64, delta: 11, intent: 'warning' }]} /></WVar>
      </>
      <DsH>{B('Building blocks', 'Elemen dasar')}</DsH>
      <DsDemo label={B('Delta chip · sparkline · ring · meter', 'Chip delta · sparkline · ring · meter') + ' · Delta · Spark · Ring · Meter'}>
        <span className="rw" style={sty('gap:16px;align-items:center')}><Delta v={25} /><Delta v={-6} /><Delta v={0} /><span style={sty('width:120px')}><Spark vals={[4, 7, 5, 9, 8, 12]} label="demo" /></span><Ring pct={64} intent="success" /><span style={sty('width:160px')}><Meter v={64} /></span></span>
      </DsDemo>
      <DsApi rows={[
        ['KPI({label, n, note, delta, good, spark, intent, icon, size, slot, variant})', 'string · number · string · % · 1|-1 · number[]', 'size=md', B('Page-top number. Label (text-secondary) · value · note (text-tertiary); optional delta chip beside the value and a sparkline below.', 'Angka di atas halaman. Label (text-secondary) · nilai · catatan (text-tertiary); opsional chip delta di samping nilai dan sparkline di bawah.')],
        ['StatCards([{intent, n, label, pct, k, on}], size, slot, variant)', 'intent · number · string · 0–100', 'size=md', B('Stat cards above lists; with k the card is a filter toggle (aria-pressed). Every stat card above a table is a filter of that table (rule TB-31).', 'Kartu statistik di atas daftar; dengan k card menjadi toggle filter (aria-pressed). Setiap kartu statistik di atas tabel adalah filter tabel itu (aturan TB-31).')],
        ['StatIcon({icon, intent, value, label, delta, good})', '—', 'intent brand', B('Icon tile · value · label · delta chip.', 'Ikon · nilai · label · chip delta.')],
        ['StatRing({pct, label, intent, note})', '0–100', '—', B('Small ring with the percentage as the value.', 'Ring kecil dengan persentase sebagai nilai.')],
        ['StatSolid({icon, value, label, delta, intent})', '—', 'intent brand', B('Filled highlight; at most one per group.', 'Sorotan berwarna penuh; maksimal satu per grup.')],
        ['StatSoft({icon, value, label, delta, intent})', '—', 'intent brand', B('The soft look: the soft colour of the intent, no fill; the look of the stat card when it is chosen in My Preferences.', 'Tampilan lembut: warna lembut dari intent, tanpa isi penuh; tampilan kartu stat bila dipilih di My Preferences.')],
        ['KpiCompact({title, value, label, spark, intent})', 'number[]', '—', B('Value with a small sparkline.', 'Nilai dengan sparkline kecil.')],
        ['KpiTrend({title, value, spark, delta, good, note})', '—', '—', B('Value + sparkline; the footer band is green when the number goes up and red when it goes down.', 'Nilai + sparkline; pita bawah hijau bila angka naik dan merah bila turun.')],
        ['WArea({icon, label, value, delta, spark, intent})', 'number[]', '—', B('Area chart with the last point marked.', 'Grafik area dengan titik terakhir ditandai.')],
        ['WLine({title, value, delta, note, spark, labels, intent, actions})', 'number[] · string[]', '—', B('Line chart with period labels.', 'Grafik garis dengan label periode.')],
        ['WBars({title, value, delta, note, vals, labels, hi, intent, actions})', 'number[] · string[] · index', 'hi = last', B('Bars; the highlighted bar is the current period.', 'Batang; batang yang disorot adalah periode berjalan.')],
        ['WDonut({pct, center, value, label, intent})', '0–100', '—', B('Large ring with the value in the centre.', 'Ring besar dengan nilai di tengah.')],
        ['WSegments({title, segs:[{label, v, intent}], center})', '—', '—', B('Composition donut with a legend that repeats every share as text.', 'Donut komposisi dengan legenda yang mengulang setiap porsi sebagai teks.')],
        ['WGauge({title, value, target, fmt, note, intent})', 'number · number · v→text', '—', B('Half gauge toward a target. The percentage is computed from value ÷ target, the sentence under the gauge says "value of target", and the two figures below are Achieved (gauge colour) and Remaining (track colour) — they always add up to the target.', 'Gauge setengah menuju target. Persentase dihitung dari nilai ÷ target, kalimat di bawah gauge menyebut "nilai dari target", dan dua angka di bawah adalah Tercapai (warna gauge) dan Sisa (warna track) — jumlahnya selalu sama dengan target.')],
        ['WProgressList({title, items:[{label, value, target, v, of, intent}]})', '—', '—', B('Progress bars toward a target, value / target on the right.', 'Bar progres menuju target, nilai / target di kanan.')],
        ['WRingList({title, items:[{icon, label, value, pct, delta, intent}]})', '—', '—', B('Stages or channels, each with a ring.', 'Tahap atau kanal, masing-masing dengan ring.')],
        ['Delta(v, {unit})', 'number', 'unit %', B('Chip: icon + sign + value. Green when the number goes up, red when it goes down, neutral at 0 (the same for every metric).', 'Chip: ikon + tanda + nilai. Hijau bila angka naik, merah bila turun, netral bila 0 (sama untuk semua metrik).')],
        ['Spark(vals, {intent, w, h, area, dot, label}) · Ring(pct, {intent, size, stroke, inner}) · DonutSegs(segs) · Meter(v)', '—', '—', B('Building blocks used by the widgets; every chart has an aria-label text summary.', 'Elemen dasar yang dipakai widget; setiap grafik punya ringkasan teks aria-label.')],
      ]} />
      <ul className="dsrules">{[
        B('One widget answers one question; give it a title that says what is measured.', 'Satu widget menjawab satu pertanyaan; beri judul yang menyebut apa yang diukur.'),
        B('Colours come only from intents (brand, success, warning, danger, info, purple, cyan); never hard-coded hex.', 'Warna hanya dari intent (brand, success, warning, danger, info, purple, cyan); tidak pernah hex langsung.'),
        B('A change is always icon + sign + number; green when it goes up, red when it goes down.', 'Perubahan selalu ikon + tanda + angka; hijau bila naik, merah bila turun.'),
        B('Every chart repeats its numbers as text (value, legend or aria-label); colour never carries meaning alone.', 'Setiap grafik mengulang angkanya sebagai teks (nilai, legenda, atau aria-label); warna tidak pernah menjadi satu-satunya penanda.'),
        B('Widgets sit in a .wgrid (auto-fit, min 240 px; one column on phones) or a .kpis row; never inside another card.', 'Widget berada di .wgrid (auto-fit, min 240 px; satu kolom di ponsel) atau baris .kpis; tidak pernah di dalam card lain.'),
      ].map((x) => <li key={x}>{x}</li>)}</ul>
      <DsTo p="kpi" />
      <ul className="dsrules">{[
        B('A KPI card answers one question; its label says what is counted.', 'Kartu KPI menjawab satu pertanyaan; labelnya menyebut apa yang dihitung.'),
        B('Every KPI card is the icon card: icon tile, label, number, and under them the change (coloured text, no badge) with the period it is compared with, or the note, and the sparkline (WG-16).', 'Setiap kartu KPI adalah kartu ikon: ikon, label, angka, dan di bawahnya perubahan (teks berwarna, tanpa badge) beserta periode pembandingnya atau catatan, lalu sparkline (WG-16).'),
        B('A change is always icon + sign + number; green when it goes up, red when it goes down (WG-01, WG-08).', 'Perubahan selalu ikon + tanda + angka; hijau bila naik, merah bila turun (WG-01, WG-08).'),
        B('The chart of a number that goes up is brand and that of a number that goes down is red; KpiTrend follows its band, green and red (WG-09).', 'Chart angka yang naik berwarna brand dan angka yang turun merah; KpiTrend mengikuti band-nya, hijau dan merah (WG-09).'),
        B('The looks are Card (KPI), Compact (KpiCompact) and Trend (KpiTrend); a Trend with neither a sparkline nor a change is the Card. A place (the slot prop) reads its look from My preferences, KPI view; the variant prop sets a look of its own (WG-07).', 'Tampilannya Card (KPI), Compact (KpiCompact) dan Trend (KpiTrend); Trend tanpa sparkline dan tanpa perubahan adalah Card. Sebuah tempat (prop slot) membaca tampilannya dari My preferences, Tampilan KPI; prop variant menetapkan tampilan sendiri (WG-07).'),
        B('A new look is added once, in the registry KPI_LOOKS (name, component) and drawn in KPI: it is then an option of My preferences by itself (WG-14).', 'Tampilan baru ditambahkan sekali, di registry KPI_LOOKS (nama, komponen) dan digambar di KPI: ia lalu menjadi opsi My preferences dengan sendirinya (WG-14).'),
        B('KPI cards sit in a .kpis row or a .wgrid; never inside another card.', 'Kartu KPI berada di baris .kpis atau .wgrid; tidak di dalam card lain.'),
      ].map((x) => <li key={x}>{x}</li>)}</ul>
      <DsTo p="stat" />
      <ul className="dsrules">{[
        B('A stat card answers one question; its label says what is counted.', 'Kartu stat menjawab satu pertanyaan; labelnya menyebut apa yang dihitung.'),
        B('A stat card above a table or a list is a filter of it (TB-31); the Total card is never shown active (WG-13).', 'Kartu stat di atas tabel atau daftar adalah filter-nya (TB-31); kartu Total tidak pernah tampil aktif (WG-13).'),
        B('The stat cards of one row never share a colour: a repeated colour is replaced by the next free one of the palette (WG-06); the active border is soft and follows the colour (WG-12).', 'Kartu stat dalam satu baris tidak memakai warna yang sama: warna yang berulang diganti warna bebas berikutnya dari palet (WG-06); border aktif lembut dan mengikuti warna (WG-12).'),
        B('The looks are Ring (StatCards), Icon (StatIcon), Percent (StatRing), Solid (StatSolid) and Soft (StatSoft). A place (the slot prop) reads its look from My preferences, Stat view; the variant prop sets a look of its own (WG-07).', 'Tampilannya Ring (StatCards), Icon (StatIcon), Percent (StatRing), Solid (StatSolid) dan Soft (StatSoft). Sebuah tempat (prop slot) membaca tampilannya dari My preferences, Tampilan stat; prop variant menetapkan tampilan sendiri (WG-07).'),
        B('A new look is added once, in the registry STAT_LOOKS (name, component) and drawn in StatCards: it is then an option of My preferences by itself (WG-14).', 'Tampilan baru ditambahkan sekali, di registry STAT_LOOKS (nama, komponen) dan digambar di StatCards: ia lalu menjadi opsi My preferences dengan sendirinya (WG-14).'),
        B('Stat cards sit in a .stats row or a .wgrid; never inside another card; at most one solid card per group.', 'Kartu stat berada di baris .stats atau .wgrid; tidak di dalam card lain; maksimal satu kartu solid per grup.'),
      ].map((x) => <li key={x}>{x}</li>)}</ul>
      <DsTo p="highlight-text" />
      <DsH>{B('Highlight text', 'Teks sorotan')}</DsH>
      <DsDemo label={B('Size · small · medium · large', 'Ukuran · kecil · sedang · besar') + ' · HighlightText size'}>
        <HighlightText size="sm" label={B('Amount', 'Nominal')} value="Rp 10,000,000" /><HighlightText size="md" label={B('Amount', 'Nominal')} value="Rp 10,000,000" /><HighlightText size="lg" label={B('Amount', 'Nominal')} value="Rp 10,000,000" />
      </DsDemo>
      <DsDemo label={B('Align and order · left or right, small text above or below', 'Rata dan urutan · kiri atau kanan, teks kecil di atas atau di bawah') + ' · HighlightText align valueFirst'}>
        <div style={sty('display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;width:100%')}>
          <HighlightText label={B('Left, label above', 'Kiri, label di atas')} value="42" /><HighlightText align="right" label={B('Right, label above', 'Kanan, label di atas')} value="42" />
          <HighlightText valueFirst label={B('Left, value above', 'Kiri, nilai di atas')} value="42" /><HighlightText valueFirst align="right" label={B('Right, value above', 'Kanan, nilai di atas')} value="42" />
        </div>
      </DsDemo>
      <DsApi rows={[
        ['HighlightText({label, value, align, valueFirst, size, cls})', 'align: left · right · size: sm · md · lg', 'left · md · label above', B('A small text and a highlighted value, the look of the content of a widget. Use it for a figure to highlight in a header, a summary or a card. valueFirst puts the value above the label (the DOM order stays label, value).', 'Teks kecil dan nilai yang disorot, tampilan isi widget. Dipakai untuk angka yang perlu disorot di header, ringkasan, atau kartu. valueFirst menaruh nilai di atas label (urutan DOM tetap label, nilai).')],
      ]} />
    </DsSec>
  );
}

/** The copy button (rule CP-01): a live example with the real component. */
export function CopySection() {
  const B = useB(), { t } = usePrefs();
  const rules = [
    B('Put a CopyButton right after every value the user has to carry to another place: a password, a one-time code (OTP), a phone or WhatsApp number, an email, an account or virtual-account number, an amount to pay, a reference or an ID. The value stays readable text.', 'Pasang CopyButton tepat setelah setiap nilai yang harus dibawa pengguna ke tempat lain: kata sandi, kode sekali pakai (OTP), nomor telepon atau WhatsApp, email, nomor rekening atau virtual account, nominal yang harus dibayar, referensi atau ID. Nilainya tetap berupa teks yang terbaca.'),
    B('One click copies the value (not the label), the icon turns into a check for two seconds and a toast says it was copied; if the browser refuses, the toast says so. The accessible label names the value ("Copy password").', 'Satu klik menyalin nilainya (bukan labelnya), ikon menjadi centang selama dua detik dan toast menyatakan sudah disalin; bila browser menolak, toast mengatakannya. Label aksesibilitasnya menyebut nilainya ("Salin kata sandi").'),
    B('Copy the value as the user will use it: a phone number as it is dialled, an amount as digits for the field of the payment app, a password as it is. Never a copy button on a value that is secret and not meant to be moved (a stored credential of someone else).', 'Salin nilai sebagaimana akan dipakai pengguna: nomor telepon seperti yang ditekan, nominal sebagai angka untuk kolom aplikasi pembayaran, kata sandi apa adanya. Jangan beri tombol salin pada nilai rahasia yang tidak untuk dipindahkan (kredensial milik orang lain).'),
  ];
  const Line = ({ k, v }: { k: string; v: string }) => <span className="rw" style={{ gap: '4px', alignItems: 'center' }}><span className="mut">{k}</span><span className="fw6">{v}</span><CopyButton value={v} label={k} /></span>;
  return (
    <DsSec id="copy" title={B('Copy button', 'Tombol salin')} lead={B('The icon button that copies a value to the clipboard: a password, a code, a number, an email, an amount.', 'Tombol ikon yang menyalin sebuah nilai ke clipboard: kata sandi, kode, nomor, email, nominal.')}>
      <DsDemo label={B('After a value', 'Setelah sebuah nilai') + ' · CopyButton'}>
        <Line k={t('cp.pw')} v="4EVET8YV" /><Line k={t('cp.email')} v="sam.rivera@example.com" /><Line k={t('cp.phone')} v="+62 812-3456-7890" /><Line k="OTP" v="482913" />
      </DsDemo>
      <DsDemo label={B('Payment details', 'Rincian pembayaran') + ' · CopyButton'}>
        <Line k={B('Virtual account', 'Virtual account')} v="8808 1234 5678 9012" /><Line k={B('Amount', 'Nominal')} v="1500000" />
      </DsDemo>
      <ul className="dsrules">{rules.map((x) => <li key={x}>{x}</li>)}</ul>
      <DsApi rows={[
        ['CopyButton({value, label, size, onCopied})', 'string · string · sm | md · handler', 'size sm', B('An icon-only link Button (type link, intent neutral: soft text colour) with the icon content_copy; a click copies `value`, the icon is a check for 2 s, a toast confirms (cp.done) or reports a refusal (cp.fail). `label` names the value for the aria-label and the tooltip (cp.aria). `onCopied` lets a page record the copy.', 'Button link ikon saja (type link, intent neutral: warna teks lembut) berikon content_copy; klik menyalin `value`, ikon menjadi centang 2 dtk, toast mengonfirmasi (cp.done) atau melaporkan penolakan (cp.fail). `label` menamai nilai untuk aria-label dan tooltip (cp.aria). `onCopied` agar halaman dapat mencatat penyalinan.')],
      ]} />
    </DsSec>);
}
