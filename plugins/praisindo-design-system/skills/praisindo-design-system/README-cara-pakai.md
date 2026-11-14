# Skill praisindo-design-system v2.88: cara pakai

Berkas: `praisindo-design-system-v2.88.zip`. Zip ini menggantikan semua versi lama (v2.62, v2.31, v2.30.1 dan sebelumnya). Nomor skill sama dengan nomor Praisindo DS: v2.88 berarti skill disinkronkan dengan DS 2.86 (13 Nov 2026).

## Memasang
- **Claude Code:** ekstrak zip, lalu taruh folder `praisindo-design-system` di `~/.claude/skills/` (untuk semua proyek) atau di `.claude/skills/` di root proyek (untuk satu proyek). Hapus dulu folder versi lama supaya tidak ada dua versi.
- **Claude.ai:** unggah zip di pengaturan Skills, lalu nonaktifkan atau hapus versi lama.

Skill aktif sendiri setiap kali ada pekerjaan UI. Cek versinya di README atau komentar pertama proyek: harus tertulis v2.88.

## Memasang di aplikasi yang sudah berjalan (migrasi ke Praisindo DS)
Panduan migrasi sudah ada di dalam skill (`references/migrate.md`). Anda tidak perlu menempel prompt terpisah.
1. Pasang skill seperti di atas.
2. Buka Claude Code di root project yang akan dimigrasi, lalu ketik:

   > Migrasikan aplikasi ini ke Praisindo DS memakai skill praisindo-design-system

3. Claude bekerja di cabang `chore/praisindo-ds` dan membuatnya bila belum ada.
   - **Tahap 0 dan 1:** baseline, inventaris, audit, dan rencana `docs/design-system/migration-plan.md`. Claude lalu berhenti dan menunggu Anda.
4. Baca rencana dan jawab pertanyaannya. Tulis "lanjutkan tahap 2" untuk melanjutkan.
   - **Tahap 2 sampai 5:** fondasi, shell, Branding, halaman Design System, migrasi halaman satu per satu, lalu penutup.
   - **Selama migrasi:** setiap 3 halaman Claude berhenti dan bertanya apakah lanjut.

Aturan yang selalu berlaku:
- Hanya tampilan yang berubah.
- Satu commit per langkah di cabang `chore/praisindo-ds`.
- Tidak ada push dan tidak ada PR sebelum Anda minta.

### Cadangan: prompt lengkap
Pakai prompt ini bila skill tidak memicu mode migrasi sendiri, misalnya di alat lain atau versi skill lama. Buat cabang `chore/praisindo-ds`, lalu tempel semua isi di bawah garis.

---

Gunakan skill `praisindo-design-system` (mode audit dan perbaikan) untuk memigrasi aplikasi ini ke Praisindo Design System. Baca dulu `SKILL.md`, `references/rules-wajib.md`, `references/tokens-komponen.md`, `references/audit.md`, `references/shell.md`, `references/branding.md`, `references/design-page.md`, dan `references/new-components-log.md` dari skill. Bila skill tidak terpasang, hentikan dan beri tahu saya; jangan mengarang aturan.

Prinsip yang berlaku di semua tahap:
- Yang diubah hanya tampilan. Jangan mengubah logika bisnis, panggilan API, bentuk data, routing, perizinan, atau teks isi produk. Bila tampilan tidak bisa diubah tanpa menyentuh logika, berhenti dan tanya.
- Kerja per langkah kecil, satu jenis perubahan per langkah, satu commit per langkah di cabang ini (`chore/praisindo-ds`). Jangan push, jangan buka PR sebelum saya minta. Jangan menyentuh `main`.
- Setelah setiap langkah: build dan tes yang ada harus tetap lulus (bandingkan dengan baseline), jalankan `node <skill>/scripts/audit.mjs .` dan laporkan sisa temuan. Jangan melonggarkan tes, aturan, atau audit agar lulus.
- Komponen dan aturan DS tidak diedit. Bila kebutuhan tidak terpenuhi oleh komponen DS, buat komponen baru HANYA dari token, tampilkan di halaman Design System bagian "This project", dan catat di `docs/design-system/new-components.md`. Usulan perubahan aturan hanya dicatat di bagian Proposals, tidak diterapkan.
- Edit CSS dengan edit eksak atau parser, tidak dengan regex/sed pada CSS mentah.
- Kamus: setiap teks pengguna ada dalam Inggris dan Indonesia dengan kunci yang sama.
- Bila ada yang tidak jelas atau berisiko, tulis sebagai pertanyaan di laporan; jangan menebak.

## Tahap 0: pengaman (tanpa mengubah kode)
1. Catat baseline: `git status`, versi Node, perintah build/test/lint dan hasilnya (jumlah tes lulus/gagal).
2. Bila ada Playwright atau browser headless: ambil tangkapan layar halaman utama (maksimal 8 halaman terpenting, ambil dari rute/menu) pada 1440px dan 390px, terang dan gelap bila aplikasi punya mode gelap. Simpan di `docs/design-system/migration/before/`. Bila tidak bisa, katakan dan lanjut tanpa itu.

## Tahap 1: inventaris, audit, rencana (BERHENTI di akhir tahap ini)
1. Inventaris: stack (React/Vue/HTML polos/lain; bila bukan React+TS+Vite atau HTML polos, katakan dan berhenti untuk meminta keputusan), cara styling (Tailwind, MUI, Bootstrap, CSS modules, CSS global, styled-components), tempat token/warna/font sekarang, daftar rute dan halaman, komponen bersama, komponen yang dipakai ulang paling sering, pustaka UI pihak ketiga, tabel/grafik (DataTables, ApexCharts, lainnya), i18n (ada/tidak, bahasa apa), mode gelap, shell/menu/layout sekarang, auth dan peran, apakah ada halaman Design System dan Branding.
2. Jalankan `node <skill>/scripts/audit.mjs . --json` dan sajikan ringkasan temuan menurut kelas (Blocker, Fix, Cleanup) dan aturan.
3. Buat `docs/design-system/migration-plan.md` berisi:
   - Hasil inventaris dan hasil audit (ringkas, dengan angka).
   - Tabel pemetaan komponen: komponen/elemen sekarang -> komponen Praisindo DS; tandai yang tidak punya padanan (calon komponen baru) dan alasan komponen DS yang ada tidak cukup.
   - Pemetaan token: warna, ukuran huruf, radius, jarak sekarang -> token DS. Daftar nilai yang tidak punya padanan.
   - Pemetaan menu: struktur menu sekarang -> `nav.config` (grup, ikon, label, mana yang halaman detail dengan `layout: 'detail'`, mana yang khusus admin).
   - Strategi migrasi. Rekomendasi: PER HALAMAN. Shell baru membungkus semua halaman dahulu; stylesheet DS dimuat global bersama gaya lama; halaman dipindah satu per satu (bagian isi halaman diganti ke komponen DS, gaya lama halaman itu dihapus setelah selesai); framework styling lama dilepas setelah halaman terakhir pindah. Jelaskan risiko benturan CSS global dengan pustaka yang dipakai dan cara mengatasinya.
   - Urutan halaman (mulai dari yang paling sederhana/sering dipakai) dan perkiraan jumlah langkah.
   - Daftar pertanyaan untuk saya (keputusan yang menentukan), masing-masing dengan rekomendasi Anda.
4. BERHENTI. Tampilkan ringkasan rencana dan pertanyaan, lalu tunggu saya menulis "lanjutkan tahap 2". Jangan mengubah file selain dokumen rencana dan tangkapan layar.

## Tahap 2: fondasi (setelah saya setuju)
1. Salin ke project dari `assets/starter-<stack>/` skill: folder `design-system` (token, 63 stylesheet berurutan, komponen), `lib`, kamus yang dibutuhkan, `branding`, `docs/design-system/` (changelog, new-components), `scripts/audit.mjs` dan `contrast.mjs`. Jangan menimpa berkas milik aplikasi; bila ada nama bentrok, tanya. Tambahkan font (Figtree, Material Icons Outlined) dan impor `index.css`.
2. Atur token: isi `BDEF` di `palette` dengan nama aplikasi dan warna merek yang SEKARANG dipakai aplikasi (ambil dari kode, bukan menebak), sehingga tampilan lama tidak berubah drastis.
3. Pasang penyimpanan brand lewat adapter: bila aplikasi punya backend, implementasikan kontrak di `references/branding.md` (atau tulis di rencana bahwa backend perlu dibuat dan pakai adapter sementara dengan penanda jelas).
4. Commit. Verifikasi: build, tes, audit, dan aplikasi lama tetap tampil (periksa halaman utama di browser; katakan bila ada benturan CSS dan perbaiki).

## Tahap 3: shell, Branding, Design System, log
1. Ganti layout/shell dengan shell Praisindo (sidebar 232/68px, tanpa topbar desktop, aksi global di footer sidebar, tombol tepi, navigasi bawah di ponsel). Isi `nav.config` dari menu sekarang sesuai rencana; hubungkan sesi/auth/peran yang ada ke `session` (admin = yang berhak mengubah Branding). Halaman detail dan editor: `layout: 'detail'`.
2. Tambah rute `branding` (penyimpanan nyata) dan `design` (halaman Design System lengkap), keduanya di MENU PENGGUNA (NV-13, di bawah My preferences, sebelum Sign out), bukan di sidebar.
3. Pastikan `docs/design-system/new-components.md` dan `changelog.md` ada.
4. Commit per bagian. Verifikasi: seluruh rute lama masih terbuka di dalam shell baru, auth tetap bekerja, Branding menyimpan lalu bertahan setelah reload, audit tanpa Blocker.

## Tahap 4: migrasi halaman, satu per satu
Untuk setiap halaman sesuai urutan di rencana (satu halaman = satu atau beberapa commit):
1. Ganti markup/gaya ke komponen dan token DS: page head (breadcrumb, judul, satu baris deskripsi), Card (tanpa card dalam card), Button (satu fill per area, batal transparent, kalimat diawali kata kerja, ikon-saja berlabel aria), Badge untuk status/kategori lewat peta pusat `badgeIcons`, Chip untuk hitungan/tag/nama/versi/izin, field formulir DS, tabel standar, Tooltip hanya komponen Tooltip, Alert hanya untuk kondisi nyata.
2. Tambahkan state yang kurang: kosong, memuat, galat dengan Retry. Teks lewat kamus EN dan ID.
3. Ganti nilai literal ke token; kelipatan 4px; tanpa line-height tanpa satuan, tanpa `<b>`, fokus tidak dihapus.
4. Hapus gaya lama halaman itu setelah halamannya selesai dan tidak dipakai halaman lain (periksa dengan pencarian sebelum menghapus).
5. Setelah halaman: build, tes, audit (temuan berkurang dan tidak ada temuan baru), tangkapan layar sesudah di `docs/design-system/migration/after/` (1440 dan 390, terang dan gelap), buka tangkapan layar dan periksa dengan mata. Sebelum halaman berikutnya, laporkan satu paragraf: halaman, apa yang diubah, hasil audit, apa yang belum bisa dan alasannya. Setiap 3 halaman, berhenti dan tanya apakah lanjut.
6. Komponen yang tidak punya padanan: lihat prinsip di atas (token saja, tampil di Design System "This project", catat di log).
7. Lakukan "Pemeriksaan kepatuhan per halaman" (bandingkan dengan halaman contoh skill, catat id / status / bukti di `docs/design-system/migration-log.md`) dan, setelah halaman terakhir, "Tahap 4b: sapuan akhir" seperti di `references/migrate.md` skill.

## Tahap 5: penutup
1. Lepas sisa gaya dan pustaka UI lama yang sudah tidak dipakai (periksa pemakaian dulu; bila ragu, jangan hapus, laporkan).
2. Jalankan audit penuh: Blockers 0 dan Fixes 0 adalah target; sisa Cleanup dan alasannya dilaporkan.
3. Daftar periksa akhir dari `SKILL.md`: tanpa literal warna/ukuran/radius/jarak, tanpa px di luar kelipatan 4, shell + Design System + Branding bekerja, log komponen baru terisi, terang/gelap dan EN/ID dicek, ponsel 390px tanpa scroll samping, state kosong/memuat/galat ada, fokus terlihat, tanpa Alert awal.
4. Tulis versi skill (v2.88) di README project atau komentar pertama.
5. Laporan akhir: ringkasan per tahap, daftar halaman dan statusnya, hasil build/tes/audit dibanding baseline, daftar komponen baru yang diusulkan, daftar hal yang tidak dimigrasi dan alasannya, pertanyaan tersisa, nama tangkapan layar yang Anda buka. Jangan push dan jangan buka PR; tunggu perintah saya.

## Larangan
Jangan mengubah logika bisnis, API, data, atau perizinan. Jangan menghapus tes atau melonggarkannya. Jangan menyalin pengecualian kontras Praisindo (CL-04, LG-04c, RB-01). Jangan mengubah aturan atau komponen DS. Jangan menghapus gaya lama sebelum halaman penggantinya selesai. Jangan melanjutkan melewati Tahap 1 tanpa persetujuan saya.

---

## Isi
- `SKILL.md`: alur kerja, mode (proyek baru, perluasan, audit, migrasi), output wajib (shell, halaman Design System, halaman Branding, log komponen baru), aturan yang tidak boleh dilanggar, dan checklist akhir.
- `references/`: indeks aturan (`rules-wajib.md`) dan berkas aturan per area (`rules-fondasi`, `rules-shell`, `rules-tabel`, `rules-tombol`, `rules-form`, `rules-badge-chip`, `rules-kartu`, `rules-dialog`, `rules-export`, `rules-design-page`, `rules-teks`): setiap aturan umum lengkap dengan cara memenuhi dan cara memeriksa; token dan komponen, shell, Branding, halaman Design, audit, log komponen baru, dan `references/migrate.md` (mode migrasi aplikasi berjalan).
- `assets/starter-react/`: Vite + React 18 + TypeScript. Perintah: `npm install`, `npm run dev`, `npm run build`, `npm run audit`.
- `assets/starter-html/`: HTML + ES modules tanpa build. Sajikan foldernya dengan server statis.
- Halaman contoh (referensi) di kedua starter, menu Admin > "Pattern examples (reference)": daftar, formulir, detail, dialog dan menu. Bangun halaman produk dengan cara yang sama, lalu hapus contohnya.
- Aturan RG-01 sampai RG-04: setiap aturan (dari owner maupun buatan agen) dicatat di `docs/design-system/rules-register.md` project pada pekerjaan yang sama; aturan yang bertentangan dengan yang ada segera dilaporkan ke owner (`scripts/rules-conflicts.mjs`); keputusan agen sendiri menunggu konfirmasi owner.
- Aturan GN-01 sampai GN-06 (`references/rules-otomatis.md`): skill otomatis membuat menu Activity history, Notifications dengan kategori sesuai project, tooltip pada setiap badge, profile card pada setiap nama user, motion dari DS saja, dan menghapus elemen lama yang tidak dipakai lagi.
- `scripts/audit.mjs` dan `scripts/contrast.mjs`: audit aturan dan cek kontras, tanpa dependensi. `scripts/audit-selftest.mjs`: uji audit pada `scripts/fixtures/violations/`. `scripts/rules-coverage.mjs`: memastikan setiap aturan umum ada di `references/`. `scripts/compare-ds.mjs`: membandingkan starter dengan app DS yang berjalan (CSS persis sama, kerangka DOM sidebar, Branding, drawer Preferences, halaman Design); `scripts/serve-nocache.mjs`: server statis tanpa cache untuk starter HTML.

## Yang baru
- **2.88** (sinkronisasi dengan DS 2.88, melewati 2.87):
  - **Aturan baru di skill:** SB-35 (contoh sidebar di halaman Design dibuat seperti sidebar asli), DL-01 sampai DL-03 (komponen `DetailList`: layout `grid`, `rows`, `auto`; `.c3fl`, `.c3f`, `.dr-g`, `.dr.dr-s` menjadi `.dl-grid`, `.dl-item`, `.dl-rows`, `.dl-row`); DR-08 dan CD-22 memakai nama baru. DS-04, DS-13, DS-14 sudah digantikan DS-19 dan DS-22 (di triage menjadi X). `references/renames.json` memuat nama lama dan baru (alat migrasi mengubah kelas, dua kasus lain masuk daftar review).
  - **Starter:** CSS dan komponen `DetailList` identik dengan DS; halaman "Detail list" di kedua halaman Design; contoh sidebar dengan `midText` dan chip hitungan; helper `detailItem`, `detailList`, `watchDetailLists` di `js/ui.js` (starter HTML).
  - **GN-01 sampai GN-05 dibangun di kedua starter:** Activity history (item `mylog` di menu user, halaman `#/mylog`, fungsi `logActivity`, `activity.config`), Notifications (lonceng, dropdown, drawer, `notifications.config`), peta badge pusat (`badgeProps`, `badge()` di HTML), kartu profil (`UserName` / `userName()`, `profile.config`), motion bawaan. Audit: GN-06 mencatat sisa `ex-*` sebagai Cleanup bila halaman nyata sudah ada; checklist akhir SKILL.md memuat GN-01..06 dan RG-01..04.
- **2.86** (sinkronisasi dengan DS 2.86, melewati 2.84 sampai 2.85):
  - **Aturan baru:** DR-09 (aksi form di drawer ada di footer drawer, bukan di body), DR-10 (kotak pratinjau berisi baris daftar tetap rapi di drawer sempit: di bawah 480px barisnya menjadi grid, tanggal di bawah teks; dikerjakan stylesheet), DR-11 (teks ketiga sebuah card atau baris lebih lembut, `--color-text-tertiary`). Total 286 aturan umum.
  - **Starter:** `07-layout.css` dan `68-article-body.css` DS 2.86; changelog starter memuat riwayat DS sampai 2.86 (tombol "View all" di starter HTML sekarang membuka drawer riwayat); ikon solid dan Outlined dimuat dan teks ikon disembunyikan sampai font siap; scroll-spy starter HTML dibatasi satu kali per frame; index.html starter HTML memberi pesan bila dibuka lewat file://.
  - **Halaman Design System di kedua starter dibawa ke struktur 2.86** (sebelumnya masih kerangka 2.30): satu halaman per item (49 halaman) di satu halaman panjang, menu kiri tiga level (grup, jenis komponen, halaman) berurutan A sampai Z, deskripsi di tiap halaman (DS-19, DS-24, DS-25), pencarian yang menemukan halaman lewat nama atau alias dalam dua bahasa lalu nama komponen, class, dan token yang dibaca dari halaman dan stylesheet (DS-22, DS-27), alamat `#/design/<halaman>` membuka halaman itu. Halaman milik produk (Activity log, Signal rules, Kanban rekomendasi, Scenarios, dan lain-lain) tidak ikut; "This project" tetap ada. Contoh baru: Select (berdaftar, dengan kolom cari, kecil, error), tanggal rentang, NumberInput, toggle ikon, GlobalSearch, empat state data, kolom Wizard, Page fade dan animasi baris. Starter React: `src/features/design/dsPages.ts` (daftar halaman) dan `dsCodeIndex.ts`. Starter HTML: snapshot `pages/design.en.html` dan `design.id.html` dibuat ulang dari starter React dan `js/pages/design.js` menjalankan menu, spy, hero kecil, dan pencarian.
  - **Select berdaftar sendiri di starter HTML** (SL-01 sampai SL-05): `js/select.js` memuat `select({ id, label, opts, val, ... })` untuk markup dan `initSelects()` (dipanggil sekali di `js/app.js`); di perangkat dengan mouse field berupa tombol dengan popover daftar (baris 40px, centang di pilihan, kolom cari di atas lima opsi, tombol keyboard, satu daftar terbuka), di layar sentuh tetap select bawaan. Nilainya ada di `<select class="sl-n">` yang membawa `id`; setelah skrip mengubah `select.value` panggil `syncSelects(root)`. Menu Preferensi dan halaman Branding sudah memakainya.
  - **Branding dan My Preferences disamakan dengan DS (koreksi, kedua starter):** sebelumnya masih tampilan lama. Branding: Default font weight (FW-01, RichSelect), Default mode berupa Select (CP-06), petunjuk warna sebagai tooltip info, catatan drawer logo sebagai Alert info, Disclaimers berupa `p.mut`; pilihan weight sekarang tersimpan dan berlaku di seluruh app (`normalizeBrand` dulu membuangnya). My Preferences menjadi User Control Panel (PP-04) dengan drawer kedua Panel items (PP-01). Shell: pencarian sidebar (SQ), baris aksi maksimal tiga item dengan menu more (PP-02), toolbar (PP-03). Aturan PP-01, PP-03, PP-04 baru ditulis ke `references/rules-komponen.md`. Perbaikan lain: teks tombol Fill tidak putih karena `--int-on` memakai nama token lama; pesan "akses dibatasi" menampilkan `{r}` mentah.
  - **Perilaku starter HTML dari migrasi nyata (DM001):** `js/datefield.js` (DateField dengan popover kalender, rentang, preset; tanpa input tanggal bawaan, FP-02), `js/tooltip.js` (Tooltip hover, fokus, Escape), dan di `js/ui.js` `dialog`, `popover`, `menu`, `closeOverlays` (drawer dan dialog tertutup saat halaman berganti); teksnya di `js/ui-texts.js` (kunci `ui.*`, EN dan ID); `initDateFields()` dan `initTooltips()` dipanggil sekali di `js/app.js`.
  - **Tidak masuk skill:** pencarian Help Center (DS 2.84, HC-09 dan HC-11) karena khusus aplikasi yang punya Help Center. Tidak ada perubahan nama baru.
- **2.83** (sinkronisasi dengan DS 2.83, melewati 2.74 sampai 2.82):
  - **Penamaan baru (DS 2.76 dan 2.79).** Komponen memakai nama universal (`SegmentedControl`, `Wizard`, `LinkButton`, `Accordion`, `AnchorNav`, `GlobalSearch`, dan seterusnya), keluarga class berganti (`.sgt` jadi `.sgc`, `.sn-` jadi `.wz-`, `.cc` jadi `.acc`, dan seterusnya) dan custom property terbaca (`--color-text-secondary` menggantikan `--color-foreground-neutral-subtle-4`, `--int-*` menggantikan `--x-*`). Nama lama tidak ada lagi di stylesheet (tanpa alias).
  - **Peta dan alat konversi.** `references/renames.json` memuat semua nama lama dan baru. `scripts/migrate-names.mjs <proyek>` menampilkan nama lama yang ditemukan (tanpa menulis); dengan `--apply` ia menggantinya. Audit punya pemeriksaan RN-01 untuk nama lama. Proyek yang dibuat dengan skill lama tidak berubah sendiri saat skill dipasang: jalankan alat ini (langkah di akhir `references/migrate.md`).
  - **Aturan baru:** SL-01..SL-05 (Select dengan daftar sendiri), FP-01 (popover field tidak terpotong), FP-02 (tanpa field tanggal bawaan; menggantikan FM-11), TB-25 (tabel bisa diurutkan), TB-26 (tabel di tab memakai pola List), TX-01 (kunci teks ada di dua kamus), DS-19, DS-22 sampai DS-27 (Design System satu halaman panjang, deskripsi, urutan A-Z, nama variabel, pencarian nama kode; menggantikan DS-04, DS-13, DS-14). Total 283 aturan umum.
  - **Starter:** seluruh komponen dan stylesheet DS 2.83 menggantikan yang lama; kode starter dan contoh sudah dikonversi dengan alat di atas.
  - **Belum ada di starter:** halaman Design System bentuk halaman panjang (DS-19..DS-27) masih bentuk lama; di starter HTML, Select dengan daftar sendiri belum dipasang (Select tetap bawaan browser); pencarian sidebar, panel items, kolom Default font weight di Branding, `ListTable` dan `useTableSort` belum ada.
- **2.73** (sinkronisasi dengan DS 2.73, melewati 2.68 sampai 2.72):
  - **20 aturan umum baru** di `references/rules-komponen.md`: CD-21 (tidak ada kotak `.note`, catatan tetap = Alert info), CD-22 (padding card 16px), CD-23 (nama class umum tidak boleh dobel), DK-21 (jump rail untuk form panjang), DK-22 (semua halaman list memakai pola List), SB-34 (label sidebar satu baris), SQ-01 sampai SQ-04 (pencarian sidebar), PP-02 (baris aksi sidebar maksimal tiga, sisanya di menu more), FW-01 dan FW-02 (default font weight menggeser semua weight), CP-01 sampai CP-07 (perbaikan komponen). DK-18, SB-28 dan CD-08 diperbarui. Total 270 aturan umum.
  - **Komponen:** `GlobalSearch` baru; `SegmentedControl size`, `DetailLayout third`, `RichOpt.soft`, `Wizard`, `NotificationPanel top`, `ApexChart` menyesuaikan lebar, `Brand.fontWeight` dan `--fw-shift` di `buildTokens` (kedua starter).
  - **Stylesheet:** seluruh perubahan 2.68 sampai 2.73 disalin ke kedua starter (termasuk `69-site-search.css`, `.note` dihapus, padding card 16px, semua `font-weight` jadi `calc(N + var(--fw-shift,0))`).
  - **Belum ada di starter:** pencarian sidebar, Preferences "panel items", kolom Default font weight di halaman Branding dan `ListTable` belum dipasang di shell starter (komponen dan aturannya sudah ada).
- **2.67** (sinkronisasi dengan DS 2.67):
  - **Aturan baru DK-17 sampai DK-20** (`references/rules-keputusan.md`, `decisions.md`): judul card form tidak pernah sama dengan judul halaman, satu card per grup field, dua kolom bila field menghasilkan hasil langsung (DK-17); rekaman request, laporan atau brief baca-saja adalah halaman detail dua kolom, bukan drawer (DK-18); toast di kanan bawah (DK-19); popover field muat viewport (DK-20). Total 250 aturan umum.
  - **Starter:** `08-drawer.css` (toast kanan bawah) dan `21-sign-in...css` (sign-in muat 660px) di kedua starter, `popoverHost.ts` (muat viewport) di starter React; contoh `FormPage` menyebut DK-17.
- **2.66** (sinkronisasi dengan DS 2.66):
  - **Aturan keputusan DK-01 sampai DK-20** kini aturan register (bukan lagi id milik skill): teks, Meet dan Check di `references/rules-keputusan.md`, tabel keputusan di `references/decisions.md`. Tambah dan ubah data = halaman form, bukan drawer; satu pengecualian sah: satu nilai di tempat dan aksi kontekstual (dialog 1 sampai 2 input, drawer sm 3 sampai 5).
  - **Aturan umum baru:** TB-23 (baris `.mut` di bawah teks utama sel tabel) dan HC-10 (teks artikel tanpa `max-width`). Total 250 aturan umum.
  - **Stylesheet:** tiga berkas diperbarui (`06-table-foundation`, `53-opportunity-kanban`, `68-article-body`) di kedua starter.
  - **Halaman contoh form:** rute `ex-form` berlayout `detail` (sidebar menciut, NV-01 dan SB-05), dengan tombol Back di judul dan dialog keluar; sebelumnya berlayout daftar.
  - **Audit:** pemeriksaan DK-01 (Drawer berisi form dengan tombol Save) sudah ada sejak 2.62 dan tetap.
- **2.62** (sinkronisasi dengan DS 2.62; sebelumnya skill tertinggal di 2.31):
  - **Aturan:** 228 aturan umum (tambahan 32 dibanding 196), semua lengkap dengan Rule, Meet, Check; teks 8 aturan yang berubah diperbarui. Yang baru termasuk pola List (TB-17, TB-21), padding dan tautan tabel (TB-18, TB-19, TB-20), bobot font (TH-13: teks tebal 500, TH-14: h2 minimal 600), padding header kartu (WG-02), arah delta (WG-01), motion (MO-01 sampai MO-07), RichSelect dan DateField (FM-13 sampai FM-15), baris DR split (DR-08), warna Chip (CH-10), Branding dan Design System di menu pengguna (NV-13), ArticleBody (HC-07), tidak ada catatan "prototype" atau "demo" (PR-06), dan pelengkap ekspor (EX-03, EX-04, EX-06, EX-08).
  - **Stylesheet:** 68 berkas (sebelumnya 63) di kedua starter.
  - **Komponen:** `RichSelect`, `ProductLogo`, `ArticleBody`, prop baru (`DR split`, `DetailLayout wide`, `DetailSummary avatar`, `Wizard vertical`, `SearchBar label`, `Switch hideLabel`, `animate` pada widget); lihat bagian "Changes up to DS 2.62" di `references/tokens-komponen.md`.
  - **Shell:** Branding dan Design System pindah ke menu pengguna (`PROFILE_NAV`), bukan sidebar; root membawa `data-motion`.
  - **Id bentrok diperbaiki:** pemeriksaan proyek skill `MO-01..06` diganti `PJ-01..06` karena `MO-` kini dipakai register untuk motion.
  - **Audit:** pemeriksaan baru NV-13 dan MO-03.
  - **Tabel keputusan baku** (`references/decisions.md`, id DK-01 sampai DK-20): satu permukaan untuk setiap maksud, jadi pembuat tidak perlu memilih. Tambah dan ubah data = halaman form (bukan drawer), dengan pengecualian satu nilai di tempat dan aksi kontekstual 1 sampai 5 input; daftar = pola List; detail = layout katalog; konfirmasi = dialog menurut akibat; sukses = toast. Audit memeriksa DK-01 (drawer berisi formulir dengan tombol Save). Pada migrasi, kasus seperti ini dicatat sebagai "perlu keputusan", tidak diubah sendiri. Tiga butir masih memakai nilai bawaan sampai Aan memastikan (batas dialog dan drawer sm, bentuk ekspor, katalog layout).
  - **Belum:** aturan domain (eksekusi, katalog produk, laporan masalah, Help Center, risk scale) tidak dibawa (domain); tabel keputusan baku dan katalog template halaman menyusul.
- **2.31, bagian kedua** (lima perbaikan dari rekomendasi uji lapangan 5 Nov):
  - **FM-01:** keputusan Aan: field opsional tetap memakai kurung, "(optional)" / "(opsional)"; wajib tetap `*` merah. Tidak ada perubahan teks.
  - **BT-02:** keputusan Aan: tombol dialog sukses tetap "Done" / "Selesai"; tombol penerap panel tetap "Apply" / "Terapkan".
  - **DR-05:** konfirmasi selalu dialog di tengah, jenisnya mengikuti akibat: `confirm`, `warning` (bisa dibatalkan dengan usaha), `danger` (tidak bisa dibatalkan). Teks register hanya menyebut `confirm`; skill kini mengikuti kode.
  - **Komponen field:** `Select` dan `SegmentedControl` dengan `label` menjadi field formulir (`req` / `opt`, `hint`, `err`, `aria-required`, `aria-invalid`); `DateField` dan `MultiSelect` mendapat `err` dan `aria-required`; `PhoneInput` mendapat `onChange`. Tabel prop ada di `references/rules-form.md`. Audit FM-01 kini juga memeriksa `Select` / `SegmentedControl` ber-`label`.
  - **Pagination:** dari lebar 1024px (1280px termasuk) tiga kelompoknya satu baris, tidak turun baris.
  - **Audit kelengkapan terhadap aplikasi sumber:** id FM-12 ditambahkan ke skill; kunci i18n `ff.pw0` sampai `ff.pw4` (teks kekuatan kata sandi) yang hilang ditambahkan di kedua starter; `rules-coverage.mjs --triage --register` lulus (setiap id register ditriase, setiap aturan umum punya bagian).
  - Catatan: perubahan komponen dan CSS ini ada di starter skill; master DS belum memuatnya dan harus disamakan.
- **2.31, bagian pertama** (perbaikan kepatuhan aturan pada skill, design system tetap 2.30):
  - **Aturan lengkap:** 196 aturan umum register (triage: umum 196 termasuk FM-12, domain 224, digantikan 26) ditulis lengkap di berkas per area, masing-masing dengan cara memenuhi (komponen dan prop) dan cara memeriksa.
  - **Pola eksplisit:** tanda wajib `*` merah dan "(opsional)", kriteria ikon info dengan 10 contoh benar dan 5 contoh salah, urutan halaman daftar dan toolbar (Show / hide columns paling kanan), hierarki tombol dan urutan footer, enam jenis dialog, menu aksi, Alert / helper text / Tooltip / Disclaimers, aturan teks.
  - **Halaman contoh** di kedua starter (daftar, formulir, detail, dialog), dengan daftar id aturan di kepala setiap berkas.
  - **Audit:** field formulir tanpa `req` / `opt`, `req` tanpa `aria-required`, halaman tabel tanpa toolbar standar / Pagination / StatCards (pengecualian `/* ds-allow: <alasan> */`), tombol ikon tanpa nama, label "Done", lebih dari 3 aksi baris, Alert tanpa kondisi. Id pemeriksaan lama disamakan dengan id register.
  - **Migrasi:** pemeriksaan kepatuhan per halaman (Tahap 4) dan sapuan akhir (Tahap 4b) dengan matriks halaman × aturan.
- **2.30.1:** mode migrasi aplikasi berjalan (`references/migrate.md`, bagian "Migrating a running application" di `SKILL.md`). Tidak ada perubahan design system.
- **2.30** (dari DS 2.29 dan 2.30):
  - **Letter-spacing per font (TH-12):** letter-spacing body 2% hanya untuk Figtree; font brand lain tanpa letter-spacing, di halaman maupun di pratinjau Branding. Diatur oleh `buildTokens`.
  - **Font Plus Jakarta Sans** di Branding, dimuat dari Google Fonts.
  - **Chip versi tidak terpotong (DS-18):** chip di "What's new" tidak lagi menciut.
  - **Stylesheet:** class yang tidak dipakai dihapus.
  - **Audit:** `audit.mjs` kini menandai letter-spacing yang ditulis manual (TH-12).

## Sudah diverifikasi (2.66)
- **Zip:** diekstrak ke folder kosong; semua pemeriksaan di bawah dijalankan pada hasil ekstrak.
- **starter-react:** `npx tsc -p .` tanpa error dan `npx vite build` berhasil.
- **Audit:** kedua starter (termasuk halaman contoh) Blockers 0, Fixes 0, Cleanups 0. `scripts/audit-selftest.mjs`: 8 pemeriksaan pola menemukan pelanggarannya di fixture TSX dan HTML.
- **Cakupan aturan:** `scripts/rules-coverage.mjs`: 283 aturan umum, masing-masing dengan Rule, Meet, Check.
- **Teks:** nama aplikasi sumber tidak muncul di skill (grep tanpa huruf besar-kecil kosong); semua jalur relatif di `SKILL.md` mengarah ke berkas yang ada.
- **Playwright:** halaman contoh kedua starter (daftar dengan pilihan, kolom, menu, kosong, galat, tanpa hasil; formulir, formulir tidak valid, dialog keluar; detail dan drawer bertingkat; enam dialog, aksi ketiga) pada 1280px dan 390px, terang dan gelap: tanpa error console, tanpa scroll samping, tanpa Alert saat halaman dibuka.
