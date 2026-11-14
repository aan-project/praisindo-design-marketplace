// The pages of the Design System (DS 2.75, owner decision 2026-11-12, rules DS-18 to DS-21): one page per item at `#/design/<id>`, grouped in the menu.
// A page is made of the old sections (`ds*Section` files); a section that holds several items is split by the markers `<DsTo p="id" />` and by the tokens below, so each example lives on one page only.
// Pure data and functions: no React, no DOM.

export type DsGroup = 'guide' | 'found' | 'comp' | 'pat' | 'qual';
export type DsSub = 'actions' | 'labels' | 'inputs' | 'navigation' | 'containers' | 'data' | 'feedback';

export interface DsPageDef {
  id: string; grp: DsGroup; sub?: DsSub;
  /** names in English and Indonesian */ en: string; idn: string;
  /** other words that find the page (English and Indonesian) */ alias: readonly string[];
  /** the old section ids that give their content to the page, in the order they are shown */ secs: readonly string[];
}

const P = (id: string, grp: DsGroup, en: string, idn: string, secs: readonly string[], alias: readonly string[] = [], sub?: DsSub): DsPageDef => ({ id, grp, sub, en, idn, alias, secs });

const RAW: readonly DsPageDef[] = [
  P('start', 'guide', 'Getting started', 'Mulai', ['start'], ['intro', 'pengantar', 'overview']),
  P('changes', 'guide', "What's new", 'Yang baru', ['changes'], ['changelog', 'release', 'versi', 'riwayat']),
  P('principles', 'guide', 'Principles', 'Prinsip', ['principles'], ['rules', 'aturan']),
  P('project', 'guide', 'This project', 'Proyek ini', ['project'], ['proyek', 'product', 'produk', 'custom', 'milik proyek']),
  P('colors', 'found', 'Color', 'Warna', ['colors'], ['colour', 'token', 'intent', 'tema', 'dark mode']),
  P('type', 'found', 'Typography', 'Tipografi', ['type'], ['font', 'text', 'teks', 'huruf', 'weight']),
  P('space', 'found', 'Spacing, radius, elevation', 'Jarak, radius, elevasi', ['space'], ['spacing', 'radius', 'shadow', 'bayangan', 'padding', 'margin']),
  P('grid4', 'found', 'Grid 4px', 'Grid 4px', ['grid4'], ['grid', '4px', 'layout']),
  P('icons', 'found', 'Icons', 'Ikon', ['icons'], ['icon', 'material', 'symbol']),
  P('motion', 'found', 'Motion', 'Gerak', ['motion'], ['animation', 'animasi', 'transition', 'transisi']),

  P('button', 'comp', 'Button', 'Tombol', ['buttons', 'selection'], ['tombol', 'link button', 'btn', 'button group'], 'actions'),

  P('badge', 'comp', 'Badge', 'Badge', ['badges'], ['status', 'label', 'dot'], 'labels'),
  P('chip', 'comp', 'Chip', 'Chip', ['chips', 'badges'], ['tag', 'pill', 'filter cepat', 'count', 'hitungan'], 'labels'),
  P('tooltip', 'comp', 'Tooltip', 'Tooltip', ['tooltip'], ['hint', 'bantuan', 'petunjuk', 'tipicon'], 'labels'),

  P('text-field', 'comp', 'Text field', 'Field teks', ['forms'], ['input', 'form field', 'textarea', 'password', 'kata sandi', 'nominal', 'money', 'ktp', 'npwp'], 'inputs'),
  P('select', 'comp', 'Select', 'Select', ['forms'], ['dropdown', 'combo', 'combobox', 'pilihan', 'multiselect', 'rich select', 'daftar pilihan'], 'inputs'),
  P('date-field', 'comp', 'Date field', 'Field tanggal', ['forms'], ['date', 'kalender', 'calendar', 'tanggal', 'datepicker', 'rentang'], 'inputs'),
  P('phone', 'comp', 'Phone', 'Telepon', ['forms'], ['telepon', 'kode negara', 'country code', 'hp', 'nomor'], 'inputs'),
  P('checkbox-radio', 'comp', 'Checkbox and radio', 'Checkbox dan radio', ['selection'], ['checkbox', 'radio', 'centang', 'radio card', 'kartu pilihan', 'pilihan', 'choice'], 'inputs'),
  P('switch', 'comp', 'Switch', 'Switch', ['selection'], ['toggle', 'sakelar', 'on off'], 'inputs'),
  P('segmented', 'comp', 'Segmented control', 'Kontrol segmen', ['forms', 'selection'], ['segtoggle', 'toggle group', 'tab pilihan', 'toggle bahasa'], 'inputs'),
  P('tag-input', 'comp', 'Tag input', 'Input tag', ['forms'], ['taginput', 'tags', 'chips input', 'input chip', 'tag input'], 'inputs'),
  P('otp', 'comp', 'OTP input', 'Input OTP', ['forms'], ['otp', 'kode', 'verifikasi', 'verification code', 'pin'], 'inputs'),
  P('number-input', 'comp', 'Number input', 'Input angka', ['forms'], ['stepper angka', 'number stepper', 'plus minus', 'spinner', 'angka', 'jumlah'], 'inputs'),
  P('file-drop', 'comp', 'File drop', 'Unggah file', ['forms'], ['upload', 'unggah', 'file', 'dokumen', 'drag'], 'inputs'),

  P('avatar', 'comp', 'Logo', 'Logo', ['tables'], ['logo', 'avatar', 'productlogo', 'penerbit', 'issuer', 'merek'], 'labels'),
  P('tabs', 'comp', 'Tabs', 'Tab', ['tabs'], ['tab', 'drawertabs'], 'navigation'),
  P('activity-log', 'pat', 'Activity log', 'Log aktivitas', ['alog'], ['log', 'timeline', 'history', 'riwayat aktivitas', 'logactivity', 'loglist']),
  P('wizard', 'comp', 'Wizard', 'Wizard', ['nav'], ['stepper', 'steps', 'langkah', 'step form', 'progress', 'form bertahap'], 'navigation'),
  P('anchor-nav', 'comp', 'Anchor navigation', 'Navigasi anchor', ['nav'], ['jump rail', 'daftar isi', 'anchor', 'toc', 'scrollspy', 'table of contents'], 'navigation'),
  P('sidebar', 'comp', 'Sidebar', 'Sidebar', ['nav'], ['menu', 'navigasi', 'navigation', 'edgetoggle', 'nav'], 'navigation'),
  P('search', 'comp', 'Search', 'Pencarian', ['forms', 'selection'], ['cari', 'search bar', 'global search', 'pencarian sidebar'], 'navigation'),
  P('pagination', 'comp', 'Pagination', 'Paginasi', ['tables'], ['paging', 'halaman', 'page size', 'rows per page'], 'navigation'),

  P('card', 'comp', 'Card', 'Card', ['cards'], ['kartu', 'section', 'wocard', 'disclaimers'], 'containers'),
  P('detail-list', 'comp', 'Detail list', 'Daftar detail', ['cards'], ['label value', 'pasangan', 'detailitem', 'detailrow', 'key value', 'list item', 'item daftar', 'grid', 'rows'], 'data'),
  P('accordion', 'comp', 'Accordion', 'Accordion', ['cards'], ['collapse card', 'card lipat', 'lipat', 'collapse', 'collapsible', 'expand'], 'containers'),
  P('drawer', 'comp', 'Drawer', 'Drawer', ['overlays'], ['panel samping', 'side panel', 'sheet'], 'containers'),
  P('modal', 'comp', 'Modal and dialog', 'Modal dan dialog', ['overlays'], ['dialog', 'konfirmasi', 'confirm', 'popup', 'modal'], 'containers'),
  P('menu', 'comp', 'Menu and popover', 'Menu dan popover', ['overlays'], ['dropdown menu', 'aksi baris', 'row menu', 'popover', 'more'], 'containers'),

  P('table', 'comp', 'Table', 'Tabel', ['tables'], ['tabel', 'daftar', 'list', 'grid', 'listtable'], 'data'),
  P('widgets', 'comp', 'Widgets', 'Widget', ['widgets'], ['kpi', 'statistik', 'stat', 'grafik', 'chart', 'sparkline', 'ring', 'donut', 'gauge'], 'data'),
  P('detail-layout', 'comp', 'Detail layout', 'Tata letak detail', ['layouts'], ['detail', 'detailpanel', 'detailsummary', 'panel'], 'data'),

  P('alert', 'comp', 'Alert', 'Alert', ['alerts', 'feedback'], ['banner', 'peringatan', 'notice', 'changenotice', 'pesan'], 'feedback'),
  P('toast', 'comp', 'Toast', 'Toast', ['overlays'], ['snackbar', 'notifikasi singkat', 'pesan singkat'], 'feedback'),
  P('states', 'comp', 'Empty and error states', 'State kosong dan error', ['feedback'], ['kosong', 'empty', 'error', 'loading', 'memuat', 'skeleton'], 'feedback'),
  P('notifications', 'comp', 'Notifications', 'Notifikasi', ['overlays'], ['lonceng', 'bell', 'notifikasi'], 'feedback'),

  P('page-header', 'pat', 'Page header', 'Header halaman', ['pagehead'], ['stdhead', 'judul', 'title', 'header', 'breadcrumb', 'remah roti']),
  P('page-layouts', 'pat', 'Page layouts', 'Tata letak halaman', ['layouts', 'overlays'], ['layout', 'home', 'sign in', 'decision bar', 'halaman', 'form page', 'halaman form', 'formshell']),
  P('mobile', 'pat', 'Mobile', 'Mobile', ['mobile'], ['phone', 'ponsel', 'responsive', 'bottom nav', 'off-canvas']),
  P('kanban', 'pat', 'Kanban', 'Kanban', ['kanban'], ['board', 'papan', 'lane', 'stage']),

  P('content', 'qual', 'Content and language', 'Konten dan bahasa', ['content'], ['bahasa', 'language', 'copy', 'tulisan', 'writing', 'translation']),
];

export type DsLang = 'en' | 'id';
/** The kinds of component: the second level of the menu (names in English and Indonesian). */
export const DS_SUBS: Readonly<Record<DsSub, readonly [string, string]>> = { actions: ['Actions', 'Aksi'], labels: ['Labels', 'Label'], inputs: ['Inputs', 'Input'], navigation: ['Navigation', 'Navigasi'], containers: ['Containers', 'Wadah'], data: ['Data display', 'Tampilan data'], feedback: ['Feedback', 'Umpan balik'] };
const GROUP_ORDER: readonly DsGroup[] = ['guide', 'found', 'comp', 'pat', 'qual'];
const cmp = (a: string, b: string, lang: DsLang) => a.localeCompare(b, lang, { sensitivity: 'base' });
const nameIn = (p: DsPageDef, lang: DsLang) => (lang === 'id' ? p.idn : p.en);
/** The pages in menu order (rule DS-25, owner decision 2026-11-13): the groups in their fixed order; inside a group the pages A to Z by name; inside Components the kinds A to Z, then the pages of a kind A to Z. Sorted by the name of the language shown. */
export const orderedSubs = (lang: DsLang): DsSub[] => (Object.keys(DS_SUBS) as DsSub[]).sort((a, b) => cmp(DS_SUBS[a][lang === 'id' ? 1 : 0], DS_SUBS[b][lang === 'id' ? 1 : 0], lang));
export function orderedPages(lang: DsLang): DsPageDef[] {
  const subs = orderedSubs(lang);
  return [...RAW].sort((a, b) => GROUP_ORDER.indexOf(a.grp) - GROUP_ORDER.indexOf(b.grp) || (subs.indexOf(a.sub ?? 'actions') - subs.indexOf(b.sub ?? 'actions')) || cmp(nameIn(a, lang), nameIn(b, lang), lang));
}
/** The pages in the order of the English menu (the data order: docs, tests). */
export const DS_PAGES: readonly DsPageDef[] = orderedPages('en');

export const DS_PAGE_IDS: readonly string[] = DS_PAGES.map((p) => p.id);
const BY_ID = new Map(RAW.map((p) => [p.id, p] as const));
export const dsPage = (id: string): DsPageDef | undefined => BY_ID.get(id);

/** The first page of a section that is not split (or the page where a split section starts); used for the old links `#/design/<section id>`. */
const SEC_LANDING: Record<string, string> = {
  start: 'start', changes: 'changes', principles: 'principles', project: 'project', colors: 'colors', type: 'type', space: 'space', grid4: 'grid4', icons: 'icons', motion: 'motion',
  buttons: 'button', badges: 'badge', chips: 'chip', alerts: 'alert', forms: 'text-field', selection: 'checkbox-radio', tabs: 'tabs', cards: 'card',
  tables: 'table', alog: 'activity-log', widgets: 'widgets', kanban: 'kanban', tooltip: 'tooltip', feedback: 'states', overlays: 'drawer', pagehead: 'page-header',
  layouts: 'page-layouts', nav: 'wizard', mobile: 'mobile', content: 'content',
};
/** Resolves the id in `#/design/<id>` to a page: a page id, an old section id (kept as an alias), or the first page for nothing/unknown. */
export function resolveDsPage(id: string): string {
  if (BY_ID.has(id)) return id;
  return SEC_LANDING[id] ?? 'start';
}
export const DS_OLD_SECTIONS: readonly string[] = Object.keys(SEC_LANDING);

/** The description under the title of a page whose section holds several items (so the lead of the section cannot be the lead of the page), and of the pages that had none (DS 2.77, rule DS-24): [English, Indonesian]. */
export const DS_LEADS: Readonly<Record<string, readonly [string, string]>> = {
  avatar: ['ProductLogo shows the logo of an issuer or a product in a soft square, with the initials of the name when there is no image; Logo shows the brand of the application.', 'ProductLogo menampilkan logo penerbit atau produk dalam kotak lembut, dengan inisial nama bila tidak ada gambar; Logo menampilkan merek aplikasi.'],
  project: ['Components this project added because the design system had none. Each one is shown here with its states and logged in docs/design-system/new-components.md for the design-system owner.', 'Komponen yang ditambahkan proyek ini karena design system belum punya. Tiap komponen tampil di sini dengan state-nya dan dicatat di docs/design-system/new-components.md untuk pemilik design system.'],
  principles: ['The principles behind every decision of the system. Read them before the components: they say why a screen looks and behaves as it does.', 'Prinsip di balik setiap keputusan sistem. Baca sebelum komponen: prinsip menjelaskan mengapa sebuah layar tampil dan berperilaku seperti itu.'],
  'text-field': ['Single-line and multi-line text: Input (with a currency or a unit, shortcuts and a hint), Textarea with a counter, grouped numbers (ID card, tax number, card) and the password with a strength meter. Label above the field, a required marker or "(optional)", helper text below, the error below in red; a field keeps its value after a failed save.', 'Teks satu baris dan banyak baris: Input (dengan mata uang atau satuan, shortcut, dan petunjuk), Textarea dengan penghitung, nomor berkelompok (KTP, NPWP, kartu) dan kata sandi dengan meter kekuatan. Label di atas field, tanda wajib atau "(opsional)", teks bantuan di bawah, error di bawah berwarna merah; field menyimpan nilainya setelah simpan gagal.'],
  select: ['A field to choose one option from a list. The list opens as a popover of rows (40px, 32px when small) with the chosen row in the brand colour and a check, a search field above five options, keys, and the native picker on a touch device. RichSelect gives each option an icon and a description; MultiSelect chooses several.', 'Field untuk memilih satu opsi dari daftar. Daftar terbuka sebagai popover berisi baris (40px, 32px bila kecil) dengan baris terpilih berwarna brand dan centang, kolom cari bila opsi lebih dari lima, keyboard, dan pemilih bawaan di layar sentuh. RichSelect memberi tiap opsi ikon dan deskripsi; MultiSelect memilih beberapa.'],
  'date-field': ['A calendar popover for one date or a date range: in a range the first click starts it and the second ends it. The popover can open to the left or above the field when it needs room; Escape or a click outside closes it and returns focus to the field.', 'Popover kalender untuk satu tanggal atau rentang tanggal: pada rentang, klik pertama memulai dan klik kedua mengakhiri. Popover dapat terbuka ke kiri atau di atas field bila perlu ruang; Escape atau klik di luar menutupnya dan mengembalikan fokus ke field.'],
  phone: ['The phone number field: a flag and country-code button on the left (a searchable list), then the digits only. A leading 0 or a repeated country code is removed and the digits are grouped per 4 while typing.', 'Field nomor telepon: tombol bendera dan kode negara di kiri (daftar yang bisa dicari), lalu hanya digit. Angka 0 di depan atau kode negara yang berulang dihapus dan digit dikelompokkan per 4 saat mengetik.'],
  'checkbox-radio': ['Checkbox for multi-select and for table rows (a soft border, brand when checked), a radio group for one choice among a few, and RadioCard for choosing one template or plan with a description.', 'Checkbox untuk multi-select dan baris tabel (border lembut, brand bila dicentang), grup radio untuk satu pilihan di antara beberapa, dan RadioCard untuk memilih satu template atau rencana beserta deskripsinya.'],
  switch: ['A switch turns one setting on or off at once, without a Save. Use it for a saved setting; use a checkbox to choose among items. Without a visible text (in a table cell) it still needs an accessible label.', 'Switch menyalakan atau mematikan satu pengaturan seketika, tanpa Simpan. Pakai untuk pengaturan yang tersimpan; pakai checkbox untuk memilih di antara item. Tanpa teks yang terlihat (di sel tabel) tetap perlu label yang dapat dibaca pembaca layar.'],
  segmented: ['A pill-shaped toggle for 2 to 4 exclusive options that change how the content below is read, such as Match all / any or the variant of a chart; the thumb slides to the new option. It is a setting, not navigation: use Tabs to move between views. The language toggle and the button group are the same idea.', 'Toggle berbentuk pil untuk 2 sampai 4 opsi eksklusif yang mengubah cara konten di bawahnya dibaca, seperti Match all / any atau varian grafik; thumb bergeser ke opsi baru. Ini pengaturan, bukan navigasi: pakai Tabs untuk berpindah tampilan. Toggle bahasa dan grup tombol adalah gagasan yang sama.'],
  'tag-input': ['Tags typed freely (Enter adds one) or chosen from suggestions, such as people from 3 typed characters. Each tag is a Chip with a remove button; the field has a helper line and an error.', 'Tag yang diketik bebas (Enter menambah satu) atau dipilih dari saran, misalnya orang setelah 3 karakter diketik. Tiap tag adalah Chip dengan tombol hapus; field punya baris bantuan dan error.'],
  otp: ['One box per digit for a verification code (4 or 6 digits): digits only, the focus moves on by itself, Backspace goes back, a paste fills every box, and it announces when the code is complete.', 'Satu kotak per digit untuk kode verifikasi (4 atau 6 digit): hanya angka, fokus pindah sendiri, Backspace mundur, tempel mengisi semua kotak, dan memberi tahu saat kode lengkap.'],
  'number-input': ['A control with a minus, the value and a plus for a small whole number with limits and an optional unit, such as the number of follow-ups. Typing and the buttons both work. For long numbers and amounts use Input with a format.', 'Kontrol dengan tombol kurang, nilai, dan tombol tambah untuk bilangan bulat kecil dengan batas dan satuan opsional, seperti jumlah tindak lanjut. Mengetik dan tombol sama-sama bisa. Untuk angka panjang dan nominal pakai Input dengan format.'],
  'file-drop': ['Drag and drop files or choose them, with a check of the size; each file is listed with a remove button. Use it for supporting documents.', 'Seret dan lepas file atau pilih file, dengan pengecekan ukuran; tiap file tampil dengan tombol hapus. Pakai untuk dokumen pendukung.'],
  search: ['SearchBar is the search of a table toolbar: a Select for the field on the left and the search box. GlobalSearch is the field under the logo of the sidebar: the results open in a popover in groups (Pages, Content).', 'SearchBar adalah pencarian di toolbar tabel: Select untuk field di kiri dan kotak cari. GlobalSearch adalah field di bawah logo sidebar: hasil terbuka di popover berkelompok (Halaman, Konten).'],
  wizard: ['A stepper that splits a long form into steps. Pick one variant per product and keep it: chevron, segment, numbered, icon, status, or the vertical read-only column. Each step is a button, the current one has aria-current, finished steps show a check and a step with an error turns red.', 'Stepper yang membagi form panjang menjadi langkah. Pilih satu varian per produk dan pertahankan: chevron, segment, numbered, icon, status, atau kolom vertikal baca-saja. Tiap langkah adalah tombol, langkah saat ini memakai aria-current, langkah selesai menampilkan centang, dan langkah dengan error berwarna merah.'],
  'anchor-nav': ['The sticky numbered rail of a long page: it scrolls to a group of sections and marks the group in view. A second group of icon buttons (tools) can hold side information that supports the form, such as data readiness or tips.', 'Rail bernomor yang menempel di halaman panjang: menggulir ke grup section dan menandai grup yang sedang terlihat. Grup kedua berisi tombol ikon (tools) dapat memuat informasi samping yang mendukung form, seperti kesiapan data atau tips.'],
  pagination: ['The standard pager under every table: the range shown, the rows-per-page Select and the page buttons. On a phone the parts stack and the Select keeps room for its value.', 'Pager standar di bawah setiap tabel: rentang yang tampil, Select baris per halaman, dan tombol halaman. Di HP bagian-bagiannya bertumpuk dan Select tetap punya ruang untuk nilainya.'],
  'detail-list': ['A list of label and value pairs. In a wide card or panel use the grid: the label above the value, the pairs side by side. In a narrow one use the rows: the label on the left, the value on the right, a line under each row. Auto picks by the width of the list itself (480px).', 'Daftar pasangan label dan nilai. Di card atau panel lebar pakai grid: label di atas nilai, pasangan berdampingan. Di yang sempit pakai rows: label di kiri, nilai di kanan, garis di bawah tiap baris. Auto memilih dari lebar daftar itu sendiri (480px).'],
  accordion: ['A card that folds, for advanced or optional sections so the main task stays in view. The header always shows the title, a one-line summary of the current values and an optional badge; a forced card stays open.', 'Card yang dapat dilipat, untuk bagian lanjutan atau opsional agar tugas utama tetap terlihat. Header selalu menampilkan judul, ringkasan satu baris nilai saat ini, dan badge opsional; card yang dipaksa tetap terbuka.'],
  drawer: ['Drawers hold large interactions and close with Escape or the scrim. Three sizes (sm 400px, md 560px, lg 760px); a drawer opened from another drawer has a Back button; keep a drawer calm (the context in one muted line, the cautions in one group) and open a status drawer with the overall status.', 'Drawer memuat interaksi besar dan menutup dengan Escape atau scrim. Tiga ukuran (sm 400px, md 560px, lg 760px); drawer yang dibuka dari drawer lain punya tombol Back; jaga drawer tetap tenang (konteks dalam satu baris redup, peringatan dalam satu grup) dan buka drawer status dengan status keseluruhan.'],
  modal: ['A centred dialog for one short decision or a result message: a card with a soft glow in the tone colour. The templates are info, success, warning, danger and confirm; a third choice (alt) stacks the buttons; Modal opens one over a scrim and Escape closes it.', 'Dialog di tengah layar untuk satu keputusan singkat atau pesan hasil: card dengan pendar lembut berwarna nada. Template-nya info, success, warning, danger, dan confirm; pilihan ketiga (alt) menumpuk tombol; Modal membukanya di atas scrim dan Escape menutupnya.'],
  menu: ['The floating menu: the ⋮ menu of a table row (ActionMenu, shared by every table) and the node menu of the condition builder. It opens as a fixed layer so a card or a scroll area never clips it; arrows move, Escape and a click outside close it and return the focus.', 'Menu mengambang: menu ⋮ di baris tabel (ActionMenu, dipakai semua tabel) dan menu node di condition builder. Menu terbuka sebagai layer tetap sehingga card atau area gulir tidak memotongnya; panah memindahkan, Escape dan klik di luar menutup dan mengembalikan fokus.'],
  toast: ['A short confirmation that goes away by itself, for a result that needs no decision. A problem that needs an action is an Alert, not a Toast.', 'Konfirmasi singkat yang hilang sendiri, untuk hasil yang tidak butuh keputusan. Masalah yang butuh tindakan adalah Alert, bukan Toast.'],
  notifications: ['The bell in the sidebar footer with the number of unread notifications (none at 0, 9+ above 9). It opens a popover with the unread ones, newest first, and a panel with all of them, in categories and in the states ready, empty, loading and error.', 'Lonceng di footer sidebar dengan jumlah notifikasi belum dibaca (tidak tampil di 0, 9+ di atas 9). Lonceng membuka popover berisi yang belum dibaca, terbaru dahulu, dan panel berisi semuanya, per kategori dan dalam state siap, kosong, memuat, dan error.'],
  'detail-layout': ['The layout of a detail page: an entity panel on the left that scrolls with the page and the content in the centre. `side` puts the narrow column on the right; `third` adds a card on the right, as in Customer 360.', 'Tata letak halaman detail: panel entitas di kiri yang ikut menggulir dan konten di tengah. `side` menaruh kolom sempit di kanan; `third` menambah card di kanan, seperti di Customer 360.'],
};

/** How a section that holds several items is divided. `rest`: the page of everything before the first marker and of what no rule claims.
 *  `rules`: [token, page]; a demo whose label (and an API row whose first cell) holds the token as a whole word goes to the page. */
export interface DsRoute { rest: string; rules?: readonly (readonly [string, string])[] }
export const DS_ROUTE: Readonly<Record<string, DsRoute>> = {
  forms: { rest: 'text-field', rules: [['Select', 'select'], ['RichSelect', 'select'], ['MultiSelect', 'select'], ['SegmentedControl', 'segmented'], ['SearchBar', 'search'], ['PhoneInput', 'phone'], ['DateField', 'date-field'], ['TagInput', 'tag-input'], ['OtpInput', 'otp'], ['NumberInput', 'number-input'], ['FileUpload', 'file-drop']] },
  selection: { rest: 'checkbox-radio', rules: [['.chk checkbox', 'checkbox-radio'], ['RadioGroup', 'checkbox-radio'], ['RadioCard', 'checkbox-radio'], ['.seg Button', 'button'], ['Switch', 'switch'], ['.lgt', 'segmented'], ['SegmentedControl', 'segmented'], ['GlobalSearch', 'search']] },
  badges: { rest: 'badge', rules: [['Chip', 'chip']] },
  cards: { rest: 'card', rules: [['DetailList', 'detail-list'], ['DetailItem', 'detail-list']] },
  tables: { rest: 'table', rules: [['ProductLogo', 'avatar']] },
  feedback: { rest: 'states', rules: [['AlertAction', 'alert']] },
  overlays: { rest: 'drawer', rules: [['Toast', 'toast'], ['ActionMenu', 'menu'], ['NotificationBell', 'notifications'], ['NotificationItem', 'notifications'], ['NotificationPopover', 'notifications'], ['NotificationPanel', 'notifications'], ['DialogCard', 'modal'], ['Modal', 'modal'], ['.odbar', 'page-layouts']] },
  layouts: { rest: 'page-layouts', rules: [['DetailLayout', 'detail-layout'], ['DetailSummary', 'detail-layout'], ['DetailPanel', 'detail-layout']] },
  nav: { rest: 'sidebar', rules: [['AnchorNav', 'anchor-nav'], ['Wizard', 'wizard'], ['.nav', 'sidebar'], ['SidebarToggle', 'sidebar']] },
};

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const hasToken = (text: string, tok: string): boolean => new RegExp(`(?<![A-Za-z0-9])${esc(tok)}(?![A-Za-z0-9])`).test(text);

/** The page of an example: the longest token of the section found in its label, else `null` (it follows the marker before it). */
export function routeDemo(sec: string, label: string): string | null {
  const r = DS_ROUTE[sec]; if (!r?.rules) return null;
  const tail = label.includes(' · ') ? label.slice(label.lastIndexOf(' · ') + 3) : label;
  let best: readonly [string, string] | null = null;
  for (const x of r.rules) if (hasToken(tail, x[0]) && (!best || x[0].length > best[0].length)) best = x;
  return best ? best[1] : null;
}
/** The pages an API row belongs to: every page whose token the first cell holds; empty = the row follows the marker before it. */
export function routeRow(sec: string, cell: string): string[] {
  const r = DS_ROUTE[sec]; if (!r?.rules) return [];
  const out: string[] = [];
  for (const x of r.rules) if (hasToken(cell, x[0]) && !out.includes(x[1])) out.push(x[1]);
  return out;
}
/** Is the section split over several pages? */
export const isSplit = (sec: string): boolean => sec in DS_ROUTE;

// ---- search by name (owner decision 2026-11-12): the name, then the aliases, in both languages ----
export interface DsPageHit { page: DsPageDef; via: 'name' | 'alias'; alias?: string }
const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
export function searchPages(q: string, pages: readonly DsPageDef[] = DS_PAGES): DsPageHit[] {
  const n = norm(q); if (!n) return [];
  const out: { h: DsPageHit; s: number }[] = [];
  for (const p of pages) {
    const names = [norm(p.en), norm(p.idn)];
    let s = -1; let alias: string | undefined;
    for (const nm of names) { if (nm === n) s = Math.max(s, 100); else if (nm.startsWith(n)) s = Math.max(s, 80); else if (nm.split(' ').some((w) => w.startsWith(n))) s = Math.max(s, 60); else if (nm.includes(n)) s = Math.max(s, 40); }
    if (s < 0) for (const a of p.alias) { const na = norm(a); if (na === n) { s = 30; alias = a; break; } if (na.startsWith(n) || na.split(' ').some((w) => w.startsWith(n))) { s = Math.max(s, 20); alias = a; } else if (na.includes(n)) { s = Math.max(s, 10); alias = a; } }
    if (s >= 0) out.push({ h: { page: p, via: alias ? 'alias' : 'name', alias }, s });
  }
  return out.sort((a, b) => b.s - a.s).map((x) => x.h);
}
