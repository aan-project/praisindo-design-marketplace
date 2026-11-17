// Design System page: forms, selection controls, tabs, cards. Text is the prototype's own.
import { useState } from 'react';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { Badge } from '../../design-system/components/Badge';
import { Button } from '../../design-system/components/Button';
import type { CSSProperties, ReactNode } from 'react';
import { Card, Disclaimers, DetailRow, GroupTitle, PlainSection } from '../../design-system/components/Card';
import { DetailItem, DetailList } from '../../design-system/components/DetailList';
import { Accordion } from '../../design-system/components/Accordion';
import { RadioCard } from '../../design-system/components/RadioCard';
import { SegmentedControl } from '../../design-system/components/SegmentedControl';
import { GlobalSearch } from '../../design-system/components/GlobalSearch';
import { FileUpload, OtpInput, PasswordInput, RadioGroup, SearchBar, Select, NumberInput, Switch, TagInput, type TagSuggestion } from '../../design-system/components/Controls';
import { GroupedNumberInput, Input, Textarea } from '../../design-system/components/Field';
import { Avatar } from '../../design-system/components/Hints';
import { Icon } from '../../design-system/components/Icon';
import { DateField, MultiSelect, RichSelect, type RichOpt } from '../../design-system/components/Pickers';
import { PhoneInput } from '../../design-system/components/Phone';
import { Tabs } from '../../design-system/components/Tabs';
import { TODAY } from '../../domain/time';
import { addDays } from '../../lib/text';
import { DsApi, DsDemo, DsH, DsSec, DsTo, sty, useB } from './ds';
import { CustomerName } from './names';
import { badgeProps } from '../../domain/badgeIcons';

const DEMO_PEOPLE: TagSuggestion[] = [
  { id: 'rp', label: 'Sam Rivera', sub: 'sam.rivera@example.com · ID •••• 0002', tag: 'Internal', group: 'Colleagues' },
  { id: 'rk', label: 'Riley Kim', sub: 'riley.kim@example.com · ID •••• 0118', tag: 'Internal', group: 'Colleagues' },
  { id: 'rpc', label: 'Riley Park', sub: 'riley.park@example.com · ID •••• 4410', tag: 'Customer', group: 'Customers' },
];
/** A live example of the suggest mode of TagInput (rule EX-06): nothing shows before 3 typed characters. */
function SuggestDemo() {
  const B = useB(), [sel, setSel] = useState<TagSuggestion[]>([DEMO_PEOPLE[0]!]);
  return <TagInput id="ds-tag-s" label={B('Recipients', 'Penerima')} req sel={sel} onSel={setSel} min={3} ph={B('Type at least 3 letters of a name, email or ID', 'Ketik minimal 3 huruf nama, email, atau NIK')}
    suggest={(q) => (q.trim().length < 3 ? [] : DEMO_PEOPLE.filter((p) => !sel.some((x) => x.id === p.id) && p.label.toLowerCase().includes(q.trim().toLowerCase())))}
    hint={B('Colleagues and customers are suggested as you type.', 'Rekan dan nasabah disarankan saat Anda mengetik.')} keep={B('Type at least 3 characters to see suggestions.', 'Ketik minimal 3 karakter untuk melihat saran.')} none={B('No match.', 'Tidak ada yang cocok.')} />;
}

const RS_DEMO: readonly RichOpt[] = [
  { v: 'interested', label: 'Interested', desc: 'The customer wants to know more or to go ahead', icon: 'sentiment_very_satisfied', intent: 'success' },
  { v: 'not_interested', label: 'Not Interested', desc: 'The customer declines this offer', icon: 'sentiment_dissatisfied', intent: 'danger' },
  { v: 'need_info', label: 'Need More Information', desc: 'The customer asks for details before deciding', icon: 'psychology_alt', intent: 'info' },
  { v: 'no_response', label: 'No Response', desc: 'The customer could not be reached', icon: 'sentiment_neutral', intent: 'neutral' },
  { v: 'follow_up', label: 'Follow-up Required', desc: 'A next step is needed on a set date', icon: 'update', intent: 'warning' },
];
export function FormsSection() {
  const B = useB();
  const { t } = usePrefs();
  const rules = [
    B('Amounts show the currency as a text label in front; never a money icon.', 'Nominal menampilkan mata uang sebagai label teks di depan; tidak pernah ikon uang.'),
    B('Long numbers (phone, KTP, NPWP, card) are grouped per 4 digits while typing; the stored value is digits only.', 'Angka panjang (telepon, KTP, NPWP, kartu) dikelompokkan per 4 digit saat mengetik; nilai yang disimpan hanya angka.'),
    B('Shortcuts under a field are optional; use them only when a few values cover most entries.', 'Shortcut di bawah field bersifat opsional; pakai hanya bila beberapa nilai mencakup sebagian besar isian.'),
    B('Popovers (country, date, multi-select) close with Escape or a click outside and return focus to the field.', 'Popover (negara, tanggal, multi-select) tertutup dengan Escape atau klik di luar dan mengembalikan fokus ke field.'),
    B('Disabled = cannot be changed now (grey); read-only = shown for reference (dashed outline, 6 px dash · 6 px gap, drawn with DashBox()).', 'Nonaktif = tidak bisa diubah saat ini (abu-abu); hanya baca = ditampilkan sebagai referensi (garis putus-putus 6 px · jarak 6 px, digambar dengan DashBox()).'),
    B('Placeholders are text-tertiary so an empty field never looks filled; an info icon belongs on the label, not inside the input.', 'Placeholder memakai text-tertiary agar field kosong tidak tampak terisi; ikon info ditempatkan di label, bukan di dalam input.'),
  ];
  /** A row of the form section: the variant name and the component on the left, the field on the right (rule DS-17). */
  const F = (n: string, c: string, el: ReactNode) => <DsDemo label={n + ' · ' + c}><div style={sty('flex:1 1 100%;max-width:480px')}>{el}</div></DsDemo>;
  const money: [string, string][] = [[B('1M', '1 jt'), '1000000'], [B('5M', '5 jt'), '5000000'], [B('10M', '10 jt'), '10000000'], [B('50M', '50 jt'), '50000000'], [B('100M', '100 jt'), '100000000']];
  return (
    <DsSec id="forms" title={B('Form fields', 'Field formulir')} lead={B('Label above the field, required marker or "(optional)", hint in a tooltip, soft helper text below, error below in red. Inputs keep their value after a failed save. Every field works by keyboard and has a visible label.', 'Label di atas field, penanda wajib atau "(opsional)", petunjuk di tooltip, teks bantuan berwarna lembut di bawah, error di bawah dengan warna merah. Input tetap terisi setelah penyimpanan gagal. Setiap field bisa dipakai dengan keyboard dan punya label yang terlihat.')}>
      <DsTo p="text-field" />
      <DsH>{B('Basics', 'Dasar')}</DsH>
      {F(B('Required, with helper text', 'Wajib, dengan teks bantuan'), 'Input req help', <Input id="ds-i1" label={B('Customer name', 'Nama customer')} req ph="Budi Santoso" help={B('As written on the ID card.', 'Sesuai yang tertulis di KTP.')} />)}
      {F(B('Error', 'Error'), 'Input err', <Input id="ds-i3" label={B('Email', 'Email')} val="budi@" err={t('fnd.errEmail')} />)}
      {F(B('Select, required', 'Select, wajib'), 'Select label req', <Select id="ds-sel" label={B('Segment', 'Segmen')} req opts={[['a', 'Priority'], ['b', 'Affluent'], ['c', 'Mass']]} val="a" />)}
      {F(B('Select, error', 'Select, error'), 'Select err', <Select id="ds-sel-e" label={B('Branch', 'Cabang')} req opts={[['', B('Choose a branch', 'Pilih cabang')], ['jk', 'Jakarta'], ['sb', 'Surabaya']]} val="" err={B('Choose a branch.', 'Pilih cabang.')} />)}
      {F(B('Select with more than five options: a search field in the list', 'Select dengan lebih dari lima opsi: kolom cari di dalam daftar'), 'Select search', <Select id="ds-sel-s" label={B('Branch', 'Cabang')} opts={[['jk', 'Jakarta'], ['sb', 'Surabaya'], ['bd', 'Bandung'], ['md', 'Medan'], ['sm', 'Semarang'], ['mk', 'Makassar'], ['dp', 'Denpasar'], ['pl', 'Palembang']]} val="jk" />)}
      {F(B('Select, small (in a table cell)', 'Select, kecil (di sel tabel)'), 'Select size=sm', <Select id="ds-sel-sm" size="sm" aria={B('Risk level', 'Level risiko')} opts={[['1', B('Conservative', 'Konservatif')], ['2', B('Moderate', 'Moderat')], ['3', B('Growth', 'Growth')]]} val="2" />)}
      {F(B('Select with a prefix and a suffix', 'Select dengan awalan dan akhiran'), 'Select pre suf', <Select id="ds-sel-ps" aria={B('Show', 'Tampilkan')} pre={B('Show', 'Tampilkan')} suf={B('rows', 'baris')} opts={[[10, '10'], [20, '20'], [50, '50']]} val={20} />)}
      {F(B('Segmented choice as a field, only when the design asks for it (FM-17)', 'Pilihan segmen sebagai field, hanya bila desain memintanya (FM-17)'), 'SegmentedControl label req', <SegmentedControl id="ds-sg-f" label={B('Customer type', 'Jenis customer')} req items={[['p', B('Personal', 'Perorangan')], ['c', B('Company', 'Perusahaan')]]} val="p" />)}
      {F(B('Segmented choice, error', 'Pilihan segmen, error'), 'SegmentedControl err', <SegmentedControl id="ds-sg-e" label={B('Contact channel', 'Kanal kontak')} req items={[['w', 'WhatsApp'], ['e', 'Email'], ['c', B('Call', 'Telepon')]]} err={B('Choose a channel.', 'Pilih kanal.')} />)}
      {F(B('Text area, optional, with a counter', 'Text area, opsional, dengan penghitung'), 'Textarea opt max', <Textarea id="ds-ta" label={B('Notes', 'Catatan')} val="" max={300} opt />)}
      {F(B('Search combo', 'Search combo'), 'SearchBar', <div className="fld"><label>{B('Search combo', 'Search combo')}</label><SearchBar fields={[['c', t('f.customer')], ['i', t('f.id')], ['r', t('f.rm')]]} /></div>)}
      {F(B('Info hint on the label', 'Petunjuk info di label'), 'Input hint', <Input id="ds-hint" label={B('Account officer', 'Account officer')} hint={B('The RM who owns the relationship in the core system.', 'RM pemilik relasi di core system.')} ph="Andi Wijaya" help={B('Leave empty to assign automatically.', 'Kosongkan untuk penugasan otomatis.')} />)}
      <DsTo p="text-field" />
      <DsH>{B('Amount & shortcuts', 'Nominal & shortcut')}</DsH>
      {F(B('Amount with shortcuts', 'Nominal dengan shortcut'), 'Input format=money sugg', <Input format="money" id="ds-amt" label={B('Placement amount', 'Nominal penempatan')} req cur="Rp" sugg={money} />)}
      {F(B('Amount in another currency', 'Nominal mata uang lain'), 'Input format=money cur', <Input format="money" id="ds-amt2" label={B('Amount in USD', 'Nominal dalam USD')} cur="USD" opt />)}
      {F(B('Unit after the value', 'Satuan setelah nilai'), 'Input suf', <Input id="ds-rate" label={B('Interest rate', 'Suku bunga')} suf="% p.a." ph="4.25" inputProps={{ inputMode: 'decimal' }} />)}
      {F(B('Unit with shortcuts', 'Satuan dengan shortcut'), 'Input suf sugg', <Input id="ds-ten" label={B('Tenor', 'Tenor')} suf={B('days', 'hari')} ph="90" inputProps={{ inputMode: 'numeric' }} sugg={[['30', '30'], ['90', '90'], ['180', '180'], ['365', '365']]} />)}
      <DsTo p="text-field" />
      <DsH>{B('Phone & ID numbers', 'Telepon & nomor identitas')}</DsH>
      {F(B('Phone number', 'Nomor telepon'), 'PhoneInput', <PhoneInput id="ds-ph" label={B('Mobile number', 'Nomor HP')} req />)}
      {F(B('ID card number', 'Nomor KTP'), 'GroupedNumberInput kind=ktp', <GroupedNumberInput id="ds-ktp" label={B('ID card number (KTP / NIK)', 'Nomor KTP / NIK')} kind="ktp" req />)}
      {F(B('Tax number', 'NPWP'), 'GroupedNumberInput kind=npwp', <GroupedNumberInput id="ds-npwp" label={B('Tax number (NPWP)', 'NPWP')} kind="npwp" opt />)}
      {F(B('Card number', 'Nomor kartu'), 'GroupedNumberInput kind=card', <GroupedNumberInput id="ds-ccn" label={B('Card number', 'Nomor kartu')} kind="card" hint={B('Checked with the Luhn rule when complete.', 'Dicek dengan aturan Luhn saat lengkap.')} />)}
      <DsTo p="date-field" />
      <DsH>{B('Date', 'Tanggal')}</DsH>
      {F(B('Single date', 'Satu tanggal'), 'DateField', <DateField id="ds-d1" label={B('Follow-up date', 'Tanggal tindak lanjut')} from={TODAY} />)}
      {F(B('Date, error', 'Tanggal, error'), 'DateField req err', <DateField id="ds-d3" label={B('Due date', 'Tanggal jatuh tempo')} req err={B('Choose a date.', 'Pilih tanggal.')} />)}
      {F(B('Date range', 'Rentang tanggal'), 'DateField mode=range', <DateField id="ds-d2" label={B('Report period', 'Periode laporan')} mode="range" from={addDays(TODAY, -6)} to={TODAY} />)}
      {F(B('Date range, popover to the left', 'Rentang tanggal, popover ke kiri'), 'DateField mode=range end', <div style={sty('display:flex;justify-content:flex-end;width:100%')}><DateField id="ds-d4" mode="range" end ph={B('Select a date range', 'Pilih rentang tanggal')} /></div>)}
      <DsTo p="select" />
      <DsH>{B('Multi-select with search', 'Multi-select dengan pencarian')}</DsH>
      {F(B('Multi-select', 'Multi-select'), 'MultiSelect', <MultiSelect id="ds-ms" label={B('Products', 'Produk')} opts={[['td', 'Time Deposit'], ['mf', 'Mutual Fund'], ['fi', 'Fixed Income'], ['ins', B('Insurance', 'Asuransi')], ['bnc', 'Bancassurance'], ['gold', B('Gold savings', 'Tabungan emas')], ['fx', B('Foreign currency', 'Valuta asing')], ['sbn', 'SBN Ritel']]} val={['td', 'mf']} />)}
      {F(B('Multi-select, error', 'Multi-select, error'), 'MultiSelect req err', <MultiSelect id="ds-ms-e" label={B('Channels', 'Kanal')} req opts={[['w', 'WhatsApp'], ['e', 'Email'], ['s', 'SMS']]} err={B('Choose at least one channel.', 'Pilih minimal satu kanal.')} />)}
      <DsTo p="select" />
      <DsH>{B('Select with icons and descriptions', 'Select dengan ikon dan deskripsi')}</DsH>
      {F(B('Rich select', 'Rich select'), 'RichSelect', <RichSelect id="ds-rs" label={B('Outcome', 'Hasil')} val="interested" ph={B('Select an outcome', 'Pilih hasil')} opts={RS_DEMO} />)}
      {F(B('Rich select, empty, error', 'Rich select, kosong, error'), 'RichSelect req err', <RichSelect id="ds-rs-e" label={B('Outcome', 'Hasil')} req ph={B('Select an outcome', 'Pilih hasil')} opts={RS_DEMO} err={B('Choose an outcome.', 'Pilih hasil.')} />)}
      {F(B('Free tags', 'Tag bebas'), 'TagInput', <TagInput id="ds-tag" label={B('Tags', 'Tag')} val={[B('VIP', 'VIP'), B('Referral', 'Referral')]} />)}
      {F(B('Tags with suggestions (people, from 3 characters)', 'Tag dengan saran (orang, mulai 3 karakter)'), 'TagInput', <SuggestDemo />)}
      <DsTo p="otp" />
      <DsH>{B('Verification code (OTP)', 'Kode verifikasi (OTP)')}</DsH>
      {F(B('4 digits', '4 digit'), 'OtpInput len=4', <OtpInput id="ds-otp4" label={B('4-digit code', 'Kode 4 digit')} len={4} />)}
      {F(B('6 digits', '6 digit'), 'OtpInput len=6', <OtpInput id="ds-otp6" label={B('6-digit code', 'Kode 6 digit')} len={6} />)}
      <DsTo p="text-field" />
      <DsH>{B('More inputs', 'Input lainnya')}</DsH>
      {F(B('Password with strength', 'Kata sandi dengan kekuatan'), 'PasswordInput', <PasswordInput id="ds-pw" label={B('New password', 'Kata sandi baru')} req />)}
      {F(B('Number input', 'Input angka'), 'NumberInput', <NumberInput id="ds-stp" label={B('Number of follow-ups', 'Jumlah tindak lanjut')} val={2} min={1} max={10} />)}
      {F(B('File drop', 'Unggah file'), 'FileUpload', <FileUpload id="ds-fd" label={B('Supporting documents', 'Dokumen pendukung')} accept=".pdf,.jpg,.jpeg,.png" />)}
      {F(B('Color, with or without the pound sign', 'Warna, dengan atau tanpa tanda pagar'), 'Input format=color', <Input id="ds-color" format="color" label={B('Primary color', 'Warna primer')} req val="#007bff" hint={B('A hex color', 'Warna hex')} help={B('Type 007bff or #007bff: the pound sign is added by itself. Press the swatch to open the color picker.', 'Ketik 007bff atau #007bff: tanda pagar ditambahkan sendiri. Tekan swatch untuk membuka pemilih warna.')} />)}
      {F(B('File states · waiting, uploading, done, warning, failed, refused', 'Status file · menunggu, mengunggah, selesai, peringatan, gagal, ditolak'), 'FileUpload states', <ul className="fdl" style={sty('width:100%')}>{([
        ['', 0, 'picture_as_pdf', 'annual-report.pdf', B('Waiting · 2.4 MB', 'Menunggu · 2.4 MB'), '0%', ''], ['', 60, 'table_chart', 'customer-list.xlsx', '860 KB', '60%', ''], ['ok', 100, 'description', 'brief.docx', '120 KB', '', 'check_circle_outline'],
        ['warn', 100, 'picture_as_pdf', 'statement.pdf', B('Uploaded, scan pending', 'Terunggah, pemindaian tertunda'), '', 'warning_amber'], ['err', 100, 'image', 'photo-id.png', B('Upload failed', 'Gagal mengunggah'), '', 'error_outline'],
        ['err', 100, 'picture_as_pdf', 'scan-all-pages.pdf', B('Larger than 5 MB', 'Lebih dari 5 MB'), '', 'error_outline'], ['err', 100, 'description', 'notes.exe', B('Type not accepted', 'Tipe tidak diterima'), '', 'error_outline'],
      ] as const).map(([k, p, ic, nm, small, pc, st], i) => <li key={i} className={k || undefined} style={{ '--fdl-p': p } as CSSProperties}><Icon name={ic} /><span>{nm}</span><small>{small}</small>{st ? <span className="fds"><Icon name={st} /></span> : <span className="fdp">{pc}</span>}<button type="button" aria-label={B('Remove', 'Hapus')}><Icon name="close" /></button></li>)}</ul>)}
      {F(B('Disabled', 'Nonaktif'), 'Input dis', <Input id="ds-dis" label={B('Customer ID (disabled)', 'ID customer (nonaktif)')} val="CUS-0005" dis />)}
      {F(B('Read-only', 'Hanya baca'), 'Input ro', <Input id="ds-ro" label={B('Branch (read-only)', 'Cabang (hanya baca)')} val="Jakarta Sudirman" ro />)}
      <DsApi rows={[
        ['Input({id, label, req, opt, hint, help, err, pre, suf, sugg, trail, dis, ro, size, attrs})', '—', 'size=md', B('Base field. pre/suf = text addon (currency, unit); help = helper text (text-tertiary); err replaces help and sets aria-invalid; trail = trailing element such as InfoTooltip; sugg = optional shortcuts.', 'Field dasar. pre/suf = teks tambahan (mata uang, satuan); help = teks bantuan (text-tertiary); err menggantikan help dan mengatur aria-invalid; trail = elemen di kanan seperti InfoTooltip; sugg = shortcut opsional.')],
        ['Input({…, format="money", cur, suf, sugg})', 'format money · cur Rp · USD …', 'cur Rp', B('Amount with the currency label in front (no money icon), thousands separators while typing and the caret kept after the same digit. MoneyInput is a deprecated alias of this.', 'Nominal dengan label mata uang di depan (tanpa ikon uang), pemisah ribuan saat mengetik dan caret tetap setelah digit yang sama. MoneyInput adalah alias usang dari ini.')],
        ['ShortcutChips(id, [[label, value]])', '—', '—', B('Optional shortcut chips under any field; a click writes the value and fires input + change; the chosen chip is pressed.', 'Chip shortcut opsional di bawah field mana pun; klik menulis nilai dan memicu input + change; chip yang dipilih ditandai.')],
        ['SearchBar({fields, fv, q, id, label, onField, onQuery, onClear})', 'fields: [[value, label]]', 'label: Search…', B('The search of a table toolbar: a field Select on the left and the search box. label (2.32) is the name and placeholder of the box when the default is too vague, for example the Audit log: Search user, action, object or ID.', 'Pencarian toolbar tabel: Select field di kiri dan kotak pencarian. label (2.32) adalah nama dan placeholder kotak bila bawaan terlalu umum, misalnya Audit log: Cari pengguna, aksi, objek, atau ID.')],
        ['PhoneInput({id, label, cc, req, err, onChange})', 'cc ID · MY · SG …', 'cc ID (+62)', B('Flag + country code button (searchable list) on the left; digits only, a leading 0 or repeated country code is removed, grouped per 4 digits.', 'Tombol bendera + kode negara (daftar dengan pencarian) di kiri; hanya angka, 0 di depan atau kode negara berulang dihapus, dikelompokkan per 4 digit.')],
        ['Input format="color" ({id, label, req, val, onChange, err})', 'hex colour', '—', B('The color field (FM-18): the colour is typed with or without the pound sign and the pound is added by itself (007bff becomes #007bff); anything that is not a hex digit is dropped, at most six digits; the swatch at the end shows a valid colour and is a button that opens the colour picker (FM-19: a square of saturation and brightness, a hue slider, the eyedropper where the browser has one, the hex field and the saved colours); onChange gets the value with the pound; the page decides if the colour is valid and passes err.', 'Field warna (FM-18): warna diketik dengan atau tanpa tanda pagar dan tanda pagar ditambahkan sendiri (007bff menjadi #007bff); yang bukan digit hex dibuang, paling banyak enam digit; swatch di ujung menampilkan warna yang valid dan menjadi tombol yang membuka pemilih warna (FM-19: kotak saturasi dan kecerahan, slider hue, eyedropper bila browser punya, field hex dan warna tersimpan); onChange menerima nilai dengan tanda pagar; halaman yang menilai warna itu valid dan memberi err.')],
        ['GroupedNumberInput({id, label, kind, max})', 'ktp · npwp · card · acct', '16 digits', B('Digits grouped per 4 with a live n/16 counter; on leaving the field an incomplete number shows an error; card numbers are also checked with Luhn.', 'Angka dikelompokkan per 4 dengan penghitung n/16; saat keluar field, nomor yang belum lengkap menampilkan error; nomor kartu juga dicek dengan Luhn.')],
        ['DateField({id, label, mode, from, to, req, err, end, up})', 'single · range · end: the popover opens to the left · up: above the field', 'single', B('Calendar popover. Range: first click start, second click end (swapped if earlier), quick presets, Apply/Cancel. Keeps ISO dates in data-from / data-to.', 'Popover kalender. Rentang: klik pertama awal, klik kedua akhir (ditukar bila lebih awal), preset cepat, Terapkan/Batal. Menyimpan tanggal ISO di data-from / data-to.')],
        ['MultiSelect({id, label, opts, val, ph, req, err})', '[[value, label]]', '—', B('Chips in the field (each removable); panel with search, n selected, Select all (visible results) and Clear.', 'Chip di dalam field (masing-masing bisa dihapus); panel dengan pencarian, n dipilih, Pilih semua (hasil yang terlihat), dan Hapus.')],
        ['RichSelect({id, label, opts, val, ph, req, err, onChange})', 'opts: [{v, label, desc?, icon?, intent?}]', '—', B('A select whose options have an icon tile (coloured by intent) and a short description; the field shows the chosen icon and label. Combobox + listbox in the form popover: Enter, Space or the down arrow open it, the arrows, Home and End move, Enter or Space choose, Escape closes. Use it only when options need an icon and a description; otherwise use Select.', 'Select yang opsinya punya ikon (berwarna menurut intent) dan deskripsi singkat; field menampilkan ikon dan label yang dipilih. Combobox + listbox di popover form: Enter, Spasi atau panah bawah membuka, panah, Home dan End bergerak, Enter atau Spasi memilih, Escape menutup. Pakai hanya bila opsi butuh ikon dan deskripsi; selain itu pakai Select.')],
        ['Select({opts, val, onChange, id, label, req, opt, hint, help, err, pre, suf})', '[[value, label]]', 'bare control', B('With label it is a form field: label above, aria-required when req, error text with the red border and aria-invalid when err. Without label it is the bare control of a toolbar, a pagination or a combo. pre / suf (2.93, FM-16): a short text inside the field before and after the value, like the text field (10 | /page); the list reads each option with them (10 /page).', 'Dengan label menjadi field formulir: label di atas, aria-required bila req, teks error dengan border merah dan aria-invalid bila err. Tanpa label menjadi kontrol polos di toolbar, paginasi atau combo. pre / suf (2.93, FM-16): teks pendek di dalam field sebelum dan sesudah nilai, seperti field teks (10 | /halaman); daftar membaca tiap opsi bersama keduanya (10 /halaman).')],
        ['SegmentedControl({id, items, val, onChange, label, req, opt, hint, err})', '[[value, label, icon?, aria?]]', 'bare toggle', B('With label it is a form field (radiogroup labelled by the label, aria-required when req, error text and red border when err). Without label it is a setting toggle. A field that picks one value is a Select by default (FM-17); use the labelled form of this control only when the design of the page asks for it.', 'Dengan label menjadi field formulir (radiogroup berlabel, aria-required bila req, teks error dan border merah bila err). Tanpa label menjadi saklar pengaturan. Field yang memilih satu nilai adalah Select secara bawaan (FM-17); pakai bentuk berlabel ini hanya bila desain halaman memintanya.')],
        ['OtpInput({id, label, len})', '4 · 6', '6', B('One box per digit: digits only, auto-advance, Backspace goes back, paste fills all boxes; announces when complete.', 'Satu kotak per digit: hanya angka, otomatis pindah, Backspace kembali, tempel mengisi semua kotak; mengumumkan saat lengkap.')],
        ['PasswordInput · NumberInput · FileUpload · TagInput · Switch · RadioGroup', '—', '—', B('Show/hide + strength meter; − value + with limits; drag-and-drop or choose files with size check; free tags (Enter or comma), or with `suggest` a list of people under the field after the typed characters you allow (name, second line, label; arrows, Enter, Escape); on/off switch (give it `checked` and `onChange` for a setting that is saved, it then follows the value); radio group with legend.', 'Tampil/sembunyi + meter kekuatan; − nilai + dengan batas; seret-lepas atau pilih file dengan cek ukuran; tag bebas (Enter atau koma); sakelar on/off (beri `checked` dan `onChange` untuk pengaturan yang disimpan, sakelar lalu mengikuti nilainya); grup radio dengan legend.')],
      ]} />
      <ul className="dsrules">{rules.map((x) => <li key={x}>{x}</li>)}</ul>
    </DsSec>
  );
}

export function SelectionSection() {
  const B = useB();
  const P = (children: ReactNode) => <p className="mut">{children}</p>;
  const [seg, setSeg] = useState('and');
  const [segI, setSegI] = useState('bar'), [sq, setSq] = useState('');
  const [opt, setOpt] = useState('idle'), [swOn, setSwOn] = useState(false);
  const { t, prefs } = usePrefs();
  return (
    <DsSec id="selection" title={B('Selection controls', 'Kontrol pilihan')} lead={B('Several options to switch on or off are a list of Switches (FM-22); the checkbox is only for an agreement (I agree to the terms) and for the rows of a table. One choice from a few options is a row of chips with a check on the selected one (FM-21, RadioGroup). The segmented control is only for a small space: a card header, a toolbar, a drawer (FM-23).', 'Beberapa pilihan hidup atau mati adalah daftar Switch (FM-22); checkbox hanya untuk persetujuan (I agree to the terms) dan baris tabel. Satu pilihan dari beberapa opsi adalah deretan chip dengan centang pada yang terpilih (FM-21, RadioGroup). Segmented control hanya untuk ruang kecil: header card, toolbar, drawer (FM-23).')}>
      <DsDemo label={B('Unchecked, checked, disabled', 'Tidak dicentang, dicentang, nonaktif') + ' · .chk checkbox (agreement, table rows)'}>
        <label className="chk"><input type="checkbox" />{B('Unchecked', 'Tidak dicentang')}</label>
        <label className="chk"><input type="checkbox" defaultChecked />{B('Checked', 'Dicentang')}</label>
        <label className="chk"><input type="checkbox" disabled />{B('Disabled', 'Nonaktif')}</label>
      </DsDemo>
      <DsDemo label={B('Single choice as chips', 'Pilihan tunggal sebagai chip') + ' · RadioGroup'}><RadioGroup name="ds-rg" label={B('Preferred channel', 'Kanal pilihan')} opts={[['phone', t('ch.phone')], ['whatsapp', t('ch.whatsapp')], ['email', t('ch.email')]]} val="whatsapp" /></DsDemo>
      <DsDemo label={B('On, off, disabled', 'Aktif, nonaktif, disabled') + ' · Switch'}>
        <Switch id="ds-sw1" label={B('Email reminders', 'Pengingat email')} on /><Switch id="ds-sw2" label={B('SMS reminders', 'Pengingat SMS')} /><Switch id="ds-sw3" label={B('Disabled', 'Nonaktif')} dis />
      </DsDemo>
      <DsDemo label={B('Without a visible text, in a table cell', 'Tanpa teks yang terlihat, di sel tabel') + ' · Switch hideLabel'}>
        <Switch id="ds-sw5" label={B('Available', 'Tersedia')} hideLabel on />
      </DsDemo>
      <DsDemo label={B('A saved setting', 'Pengaturan tersimpan') + ' · Switch checked onChange'}>
        <Switch id="ds-sw4" label={B('Daily summary email', 'Email ringkasan harian')} checked={swOn} onChange={setSwOn} /><span className="mut" role="status">{swOn ? B('On', 'Aktif') : B('Off', 'Nonaktif')}</span>
      </DsDemo>
      <DsDemo label={B('Language toggle', 'Toggle bahasa') + ' · .lgt'}>
        <div className="lgt" role="group" aria-label={t('hdr.lang')}><button type="button" aria-pressed={prefs.lang === 'en'}>EN</button><button type="button" aria-pressed={prefs.lang === 'id'}>ID</button></div>
      </DsDemo>
      <DsTo p="segmented" />
      {P(B("A pill-shaped switch for 2–4 mutually exclusive options that change how the content below is read, such as Match all / any. The thumb slides to the new option. Use Tabs for navigation between views and SegmentedControl for a setting. It is a radio group: each option is a button with role radio and aria-checked.", "Saklar berbentuk pil untuk 2–4 pilihan eksklusif yang mengubah cara isi di bawahnya dibaca, misalnya Match semua / salah satu. Thumb bergeser ke pilihan baru. Gunakan Tabs untuk pindah tampilan dan SegmentedControl untuk pengaturan. Ini radio group: tiap opsi adalah tombol dengan role radio dan aria-checked."))}
      <DsDemo label={B('Segmented toggle', 'Segmented toggle') + ' · SegmentedControl'}>
        <SegmentedControl id="dsg" items={[['and', B('All (AND)', 'Semua (AND)')], ['or', B('Any (OR)', 'Salah satu (OR)')]]} val={seg} aria={B('Match', 'Cocokkan')} onChange={setSeg} />
      </DsDemo>
      <DsDemo label={B('Segmented toggle, icon only', 'Segmented toggle, hanya ikon') + ' · SegmentedControl'}>
        <SegmentedControl id="dsgi" items={[['bar', '', 'bar_chart', B('Bar chart', 'Grafik batang')], ['area', '', 'area_chart', B('Spline area chart', 'Grafik area spline')]]} val={segI} aria={B('Chart type', 'Jenis grafik')} onChange={setSegI} />
      </DsDemo>
      {P(B('An option with an icon and no text gives its accessible name as the fourth value; it is also its tooltip. Used to switch the variant of a chart (the product detail).', 'Opsi dengan ikon tanpa teks memberi nama aksesibelnya sebagai nilai keempat; itu juga tooltip-nya. Dipakai untuk mengganti varian grafik (detail produk).'))}
      <DsTo p="search" />
      <DsH>{B('Search of the sidebar', 'Pencarian sidebar')}</DsH>
      {P(B('A field under the logo; while the person types, the results open in a popover to the right of the sidebar, in groups (Pages, Content). Up and Down choose, Enter opens, Esc closes, "/" focuses the field. The list scrolls inside the popover with the group titles on top. Rule SQ-01 to SQ-04.', 'Field di bawah logo; saat mengetik, hasil terbuka di popover di kanan sidebar, dalam grup (Halaman, Konten). Atas dan Bawah memilih, Enter membuka, Esc menutup, "/" memfokuskan field. Daftar menggulir di dalam popover dengan judul grup tetap di atas. Aturan SQ-01 sampai SQ-04.'))}
      <DsDemo label={B('Type "brand" to see the results', 'Ketik "brand" untuk melihat hasil') + ' · GlobalSearch'}>
        <div style={sty('width:232px')}><GlobalSearch id="dssq" q={sq} label={B('Search pages and content', 'Cari halaman dan konten')} placeholder={B('Search…', 'Cari…')} noneTitle={B('No results', 'Tidak ada hasil')} noneDesc={B('Try another word.', 'Coba kata lain.')} clearLabel={B('Clear search', 'Hapus pencarian')} onQuery={setSq} onGo={() => setSq('')}
          groups={[{ key: 'p', title: B('Pages', 'Halaman'), hits: [{ id: 'p1', icon: 'inventory_2', title: B('Branding', 'Branding'), sub: B('Admin', 'Admin'), href: '#/design' }].filter((h) => h.title.toLowerCase().includes(sq.trim().toLowerCase())) },
            { key: 'c', title: B('Content', 'Konten'), hits: [{ id: 'c1', icon: 'article', title: B('Colour tokens', 'Token warna'), sub: B('Every colour, the brand colour included, is a token.', 'Setiap warna, termasuk warna brand, adalah token.'), href: '#/design' }, { id: 'c2', icon: 'article', title: B('Why is a button off?', 'Kenapa tombol nonaktif?'), sub: B('The daily limit was reached.', 'Batas harian tercapai.'), href: '#/design' }].filter((h) => (h.title + ' ' + (h.sub ?? '')).toLowerCase().includes(sq.trim().toLowerCase())) }]} /></div>
      </DsDemo>
      <DsTo p="checkbox-radio" />
      <DsH>{B('Option card', 'Kartu pilihan')}</DsH>
      {P(B("A selectable card for choosing one template or plan. Selected: soft brand fill and a filled circle with a check. Not selected: neutral border and an empty circle. Tags are static Chips. Use aria-pressed on the button. Do not add a badge for the selected state.", "Kartu yang dapat dipilih untuk memilih satu template atau paket. Terpilih: isi brand lembut dan lingkaran terisi dengan centang. Tidak terpilih: border netral dan lingkaran kosong. Tag berupa Chip statis. Gunakan aria-pressed pada tombol. Jangan menambah badge untuk status terpilih."))}
      <DsDemo label={B('Choose one: selected, not selected, disabled', 'Pilih satu: terpilih, tidak terpilih, nonaktif') + ' · RadioCard'}>
        <div className="sbtg" style={sty('width:100%')}>
          {([['blank', B('Blank rule', 'Rule kosong'), B('Start with no condition.', 'Mulai tanpa kondisi.'), []], ['idle', B('Idle balance', 'Saldo menganggur'), B('Customers whose balance did not move for 30 days.', 'Nasabah yang saldonya tidak bergerak 30 hari.'), [B('Retention', 'Retensi'), B('Deposit', 'Deposito')]], ['limit', B('Limit nearly used', 'Limit hampir habis'), B('Not available for your role.', 'Tidak tersedia untuk role Anda.'), [B('Credit', 'Kredit')]]] as const).map(([k, n, d, tg]) =>
            <RadioCard key={k} title={n} desc={d} tags={tg} selected={opt === k} selLabel={B('Selected', 'Terpilih')} disabled={k === 'limit'} onSelect={() => setOpt(k)} />)}
        </div>
      </DsDemo>
      <DsApi rows={[['RadioCard({title, desc, tags, selected, selLabel, disabled, onSelect})', 'selected: boolean · tags: string[]', '—', B('One button per card with aria-pressed; the selected card has the soft brand fill and a check circle, a disabled card is muted and cannot be clicked. Used for the Add rule templates.', 'Satu tombol per kartu dengan aria-pressed; kartu terpilih berisi brand lembut dan lingkaran centang, kartu nonaktif redup dan tidak bisa diklik. Dipakai untuk template Tambah rule.')]]} />
    </DsSec>
  );
}

export function TabsSection() {
  const B = useB();
  const { t } = usePrefs();
  const [a, setA] = useState('1'), [b, setB] = useState('1');
  const rules = [
    B('Tabs inside a drawer always use the segmented variant (DrawerTabs). Any .tabs placed in a drawer is styled segmented automatically.', 'Tab di dalam drawer selalu memakai varian segmented (DrawerTabs). Setiap .tabs di dalam drawer otomatis bergaya segmented.'),
    B('A drawer counts as a card (TB-29): tabs outside a card are underline, except the tab bar of a detail page, which is segmented; tabs inside a card are segmented. Any .tabs placed inside a .card (other than this documentation) is styled segmented automatically.', 'Drawer dihitung sebagai card (TB-29): tab di luar card underline, kecuali bar tab halaman detail yang segmented; tab di dalam card segmented. Setiap .tabs di dalam .card (selain dokumentasi ini) otomatis bergaya segmented.'),
    B('A sticky bar inside a scrolling area must cover the area padding: offset it by the padding (top: -padding) and extend its background to both edges, so no content leaks through a gap.', 'Bar sticky di dalam area scroll harus menutup padding area itu: geser sebesar padding (top: -padding) dan lebarkan latarnya ke kedua sisi, agar tidak ada konten yang bocor lewat celah.'),
  ];
  return (
    <DsSec id="tabs" title={B('Tabs', 'Tab')} lead={B('Tabs switch views of the same object; counts sit in a small pill. Tabs outside a card use the underline variant, except the tab bar of a detail page, which uses the segmented variant; tabs inside a card and in a drawer use the segmented variant (rule TB-29).', 'Tab mengganti tampilan objek yang sama; jumlah ada di pill kecil. Tab di luar card memakai varian underline, kecuali bar tab halaman detail yang memakai varian segmented; tab di dalam card dan di drawer memakai varian segmented (aturan TB-29).')}>
      <DsDemo label={B('Underline', 'Garis bawah') + ' · Tabs'}><Tabs items={[['1', t('fnd.t1'), 4], ['2', t('fnd.t2')], ['3', t('fnd.t3'), 12]]} active={a} onChange={setA} /></DsDemo>
      <DsDemo label={B('Segmented', 'Segmented') + ' · Tabs variant=seg'}><div style={sty('width:100%')}><Tabs items={[['1', t('fnd.t1')], ['2', t('fnd.t2'), 2], ['3', t('fnd.t3')]]} active={b} variant="seg" onChange={setB} /></div></DsDemo>
      <DsApi rows={[
        ['items', '[value, label, count?][]', '—', ''], ['active', 'value', '—', ''], ['g', 'group key', '—', B('Stored in ui.tabs[g].', 'Disimpan di ui.tabs[g].')], ['size', 'sm · md · lg', 'md', ''],
        ['variant', "'' · 'seg'", "''", B('seg: segmented (grey track, selected tab raised).', 'seg: segmented (track abu-abu, tab terpilih menonjol).')],
        ['DrawerTabs({items, active, g, size})', '—', '—', B('The tab bar inside a drawer: always segmented and sticky, flush with the drawer top; its background spans the full drawer width so content never shows above or beside it while scrolling.', 'Bar tab di dalam drawer: selalu segmented dan sticky, rata dengan tepi atas drawer; latarnya selebar drawer sehingga konten tidak pernah terlihat di atas atau di sampingnya saat di-scroll.')],
      ]} />
      <ul className="dsrules">{rules.map((x) => <li key={x}>{x}</li>)}</ul>
    </DsSec>
  );
}

export function CardsSection() {
  const B = useB();
  const P = (children: ReactNode) => <p className="mut">{children}</p>;
  const { t } = usePrefs();
  const rules = [
    B('No card inside a card: use list rows, hairlines, leading icons and spacing.', 'Tidak ada card di dalam card: gunakan baris daftar, garis tipis, ikon di depan, dan jarak.'),
    B('A table inside a card has no outer border.', 'Tabel di dalam card tidak punya border luar.'),
    B('Reuse before you build: buttons, badges, counts, errors and field rows always come from the components listed here — no hand-written class strings.', 'Pakai ulang sebelum membuat: tombol, badge, angka, error, dan baris field selalu dari komponen di halaman ini — tanpa menulis string class manual.'),
    B('Exceptions: draggable items, items with several actions and their own state, and comparable choices such as recommendation options.', 'Pengecualian: item yang bisa di-drag, item dengan beberapa aksi dan state sendiri, serta pilihan yang dibandingkan seperti opsi rekomendasi.'),
  ];
  return (
    <DsSec id="cards" title={B('Card & section', 'Card & section')} lead={B('A card is a titled section: header (title + up to 2 actions) and body separated by a divider. Content inside a card never uses another card. Section is the plain variant: the same header without a frame.', 'Card adalah section berjudul: header (judul + maks. 2 aksi) dan body dipisah garis. Isi di dalam card tidak memakai card lagi. Section adalah varian polos: header yang sama tanpa bingkai.')}>
      <DsDemo label={B('Card without a header', 'Card tanpa header') + ' · Card'}><Card body={<p className="mut">{B('A card with only a body, for a short block that needs no title.', 'Card hanya berisi body, untuk blok singkat yang tidak butuh judul.')}</p>} /></DsDemo>
      <DsDemo label={B('Standing notes at the bottom of a page (rule DC-01)', 'Catatan tetap di paling bawah halaman (aturan DC-01)') + ' · Disclaimers'}><Disclaimers items={[B('Prototype: roles come from the demo role configuration. Creating, inviting or deactivating accounts is simulated.', 'Prototipe: peran berasal dari konfigurasi peran demo. Membuat, mengundang, atau menonaktifkan akun hanya simulasi.'), B('A second note of the same page is another paragraph in the same card.', 'Catatan kedua pada halaman yang sama adalah paragraf lain di card yang sama.')]} /></DsDemo>
      <DsDemo label={B('With a title and an action', 'Dengan judul dan aksi') + ' · Card actions'}><div style={sty('flex:1 1 100%;max-width:480px')}>
        <Card title={B('Card title', 'Judul card')} actions={<Button label={t('home.viewAll')} type="link" size="sm" />}
          body={<><p className="mut">{B('Body content sits directly in the card.', 'Isi body langsung berada di dalam card.')}</p><DetailRow label={B('Label', 'Label')}>{B('Value', 'Nilai')}</DetailRow><DetailRow label={B('Label', 'Label')}>{B('Value', 'Nilai')}</DetailRow></>} />
      </div></DsDemo>
      <DsDemo label={B('With a list, no body padding', 'Dengan daftar, tanpa padding body') + ' · Card flush'}><div style={sty('flex:1 1 100%;max-width:480px')}>
        <Card title={B('Card with list', 'Card dengan daftar')} flush body={['Budi Santoso', 'Siti Rahma', 'Agus Hartono'].map((n) => <div key={n} className="li"><Avatar name={n} /><div className="m"><span className="t"><CustomerName name={n} /></span><span className="mut">Priority</span></div><Icon name="chevron_right" /></div>)} />
      </div></DsDemo>
      <DsDemo label={B('Plain variant', 'Varian polos') + ' · Section'}>
        <PlainSection title={B('Section title', 'Judul section')} n={3} actions={<Button label={B('Compare', 'Bandingkan')} icon="compare_arrows" type="outlined" intent="neutral" size="sm" />} desc={B('One-line description under the title.', 'Deskripsi satu baris di bawah judul.')}
          body={<div className="rxi-k" style={sty('grid-template-columns:repeat(3,minmax(0,1fr))')}>{['A', 'B', 'C'].map((x) => <div key={x}><dt>{B('Label', 'Label')} {x}</dt><dd>{B('Value', 'Nilai')}</dd></div>)}</div>} />
      </DsDemo>
      <DsApi rows={[
        ['Card({title, actions, body, flush, footer})', 'string · html · html · bool · html', 'flush=false', B('Framed section with divider under the header. footer: an action bar under the body (top divider, buttons right-aligned, primary last; phone: full-width, primary on top). Use it for form cards such as Branding. title="" is the framed card without a header (the actions of a vertical form, rule DK-24).', 'Section berbingkai dengan garis di bawah header. footer: bar aksi di bawah isi (garis atas, tombol rata kanan, tombol utama paling akhir; ponsel: selebar layar, tombol utama di atas). Dipakai untuk card form seperti Branding. title="" adalah card berbingkai tanpa header (aksi form vertikal, aturan DK-24).')],
        ['LogoOnBrand(h)', 'px', '40', B('Logo on brand-colour surfaces (sign-in panel, page transition): dark-mode logo, no background tile. Elsewhere use Logo(h), which follows the current theme.', 'Logo di permukaan berwarna brand (panel masuk, transisi halaman): logo mode gelap, tanpa latar kotak. Di tempat lain pakai Logo(h) yang mengikuti tema aktif.')],
        ['Disclaimers({items})', 'ReactNode[]', '—', B('The card titled Disclaimers at the very bottom of a page. Put in it what used to be a p.mut between the page head and the content (the standing notes of the page). Nothing is drawn when the list is empty. Alerts stay on top: they are real conditions.', 'Card berjudul Disclaimers di paling bawah halaman. Isi dengan yang dulu berupa p.mut di antara kepala halaman dan konten (catatan tetap halaman). Tidak digambar bila daftar kosong. Alert tetap di atas: itu kondisi nyata.')],
        ['GroupTitle(text)', 'string', '—', B('Group title inside a card, drawer or form: caption style — --fs-xs, 500, uppercase, letter-spacing .08em, text-secondary. Separates groups (Branding, Typography…); field labels stay as labels.', 'Judul grup di dalam card, drawer, atau form: gaya caption — --fs-xs, 500, huruf kapital, letter-spacing .08em, text-secondary. Memisahkan grup (Branding, Tipografi…); label kolom tetap sebagai label.')],
        ['Section({title, n, actions, desc, body, cls})', 'string · number · html · string · html', '—', B('Plain section: no frame, no divider. Use when the body holds framed items (e.g. recommendation options) or sits directly in a tab.', 'Section polos: tanpa bingkai dan garis. Dipakai saat isinya berupa item berbingkai (mis. opsi rekomendasi) atau langsung berada di tab.')],
      ]} />
      <DsTo p="detail-list" />
      <DsDemo label={B('Wide space: the label above the value, the pairs side by side', 'Ruang lebar: label di atas nilai, pasangan berdampingan') + ' · DetailList grid'}><div style={sty('flex:1 1 100%;max-width:720px')}>
        <Card title={B('Product', 'Produk')} body={<DetailList layout="grid">{[[B('Signal', 'Sinyal'), B('Campaign eligibility', 'Kelayakan kampanye')], [B('Asset class', 'Kelas aset'), B('Mutual fund', 'Reksa dana')], [B('Sub class', 'Sub kelas'), B('Money market', 'Pasar uang')], [B('Issuer', 'Penerbit'), 'BNI AM'], [B('Risk', 'Risiko'), B('Low', 'Rendah')], [B('Currency', 'Mata uang'), 'IDR']].map(([k, v]) => <DetailItem key={k} label={k}>{v}</DetailItem>)}</DetailList>} />
      </div></DsDemo>
      <DsDemo label={B('Narrow space: the label left, the value right, a line under each row', 'Ruang sempit: label di kiri, nilai di kanan, garis di bawah tiap baris') + ' · DetailList rows'}><div style={sty('flex:1 1 100%;max-width:360px')}>
        <Card title={B('Key information', 'Informasi utama')}
          body={<><DetailList layout="rows"><GroupTitle text={B('Product', 'Produk')} /><DetailItem label={B('Category', 'Kategori')}>{B('Mutual fund · Fixed income', 'Reksa dana · Pendapatan tetap')}</DetailItem><DetailItem label={B('Issuer', 'Penerbit')}>Manulife AM</DetailItem></DetailList>
            <DetailList layout="rows"><GroupTitle text={B('Size', 'Ukuran')} /><DetailItem label="AUM">Rp 1.24 T</DetailItem><DetailItem label={B('Available for recommendation', 'Tersedia untuk rekomendasi')}><Switch id="ds-dr-sw" label={B('Available', 'Tersedia')} on /></DetailItem></DetailList></>} />
      </div></DsDemo>
      <DsDemo label={B('Auto: the list follows its own width (480px)', 'Auto: daftar mengikuti lebarnya sendiri (480px)') + ' · DetailList auto'}>
        {[720, 320].map((w) => <div key={w} style={sty(`flex:0 1 ${w}px;min-width:0`)}><Card title={w + 'px'} body={<DetailList layout="auto">{[[B('Asset class', 'Kelas aset'), B('Mutual fund', 'Reksa dana')], [B('Sub class', 'Sub kelas'), B('Money market', 'Pasar uang')], [B('Issuer', 'Penerbit'), 'BNI AM']].map(([k, v]) => <DetailItem key={k} label={k}>{v}</DetailItem>)}</DetailList>} /></div>)}
      </DsDemo>
      <DsApi rows={[
        ['DetailList({layout, className, style, aria, children})', "layout: 'grid' | 'rows' | 'auto'", 'grid', B("The list of label / value pairs. grid: the label above the value, the pairs side by side (one column in a narrow panel); for a wide card or panel (was .c3fl). rows: the label left, the value right, a line under each row except the last; for a narrow card or panel (was .dr-g; a GroupTitle may open it). auto: rows below 480px of the list itself, grid from 480px. Never give a narrow space the grid or a wide one the rows.", "Daftar pasangan label / nilai. grid: label di atas nilai, pasangan berdampingan (satu kolom di panel sempit); untuk card atau panel lebar (dulu .c3fl). rows: label kiri, nilai kanan, garis di bawah tiap baris kecuali yang terakhir; untuk card atau panel sempit (dulu .dr-g; GroupTitle boleh membukanya). auto: rows di bawah 480px lebar daftar itu sendiri, grid dari 480px. Jangan memberi grid pada ruang sempit atau rows pada ruang lebar.")],
        ['DetailItem({label, children})', 'string · html', '—', B('One pair; it takes the look of the DetailList it is in (grid: .dl-item, was .c3f; rows: .dl-row, was .dr.dr-s). The plain DetailRow (label in a 140px column) is a third, older form for drawers.', 'Satu pasangan; mengikuti tampilan DetailList tempatnya berada (grid: .dl-item, dulu .c3f; rows: .dl-row, dulu .dr.dr-s). DetailRow biasa (label di kolom 140px) adalah bentuk ketiga yang lebih lama untuk drawer.')],
      ]} />
      <DsTo p="accordion" />
      <DsH>{B('Collapsible card', 'Kartu yang bisa dilipat')}</DsH>
      {P(B("Use it for advanced or optional sections so the main task stays in view. The header always shows the title, a one-line summary built from the current values (never a fixed text) and a badge when the section needs attention. A section with a validation error stays open. Folding never clears a value.", "Pakai untuk bagian lanjutan atau opsional agar tugas utama tetap terlihat. Header selalu menampilkan judul, ringkasan satu baris dari nilai saat ini (bukan teks tetap), dan badge bila bagian perlu perhatian. Bagian dengan error validasi tetap terbuka. Melipat tidak pernah menghapus nilai."))}
      <DsDemo label={B('Closed and open', 'Tertutup dan terbuka') + ' · Accordion'}>
        <Accordion id="dscc1" title={B('Safeguards', 'Pengaman')} sum={B('Cooldown 7 d · Stale 2 d · Cap 50', 'Cooldown 7 h · Basi 2 h · Batas 50')}>{P(B("Body content stays in the page when folded.", "Isi tetap ada di halaman saat dilipat."))}</Accordion>
        <Accordion id="dscc2" title={B('Scoring', 'Scoring')} sum={B('Custom weights, total 90%', 'Bobot khusus, total 90%')} badge={<Badge label={t('sr.cs.attn')} {...badgeProps('fixed', 'sr.cs.attn')} />} force>{P(t('sr.cs.fixed'))}</Accordion>
      </DsDemo>
      <DsApi rows={[['Accordion({id,title,sum,badge,open,force,body})', 'id, title, sum (one-line summary), badge (Badge html), open (default), force (keep open)', 'open: false', B('Action cctog toggles ui.cc[id]. Use force when the section has errors.', 'Aksi cctog mengubah ui.cc[id]. Pakai force saat bagian punya error.')]]} />
      <DsTo p="card" />
      <DsH>{B('Rules', 'Aturan')}</DsH>
      <ul className="dsrules">{rules.map((x) => <li key={x}>{x}</li>)}</ul>
    </DsSec>
  );
}
