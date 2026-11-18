# Migration of a running application to the Praisindo Design System (mode "Migrasi aplikasi berjalan")

Gunakan berkas ini ketika pengguna meminta mengubah aplikasi yang sudah berjalan menjadi Praisindo DS. Kerjakan per tahap dan berhenti di titik persetujuan.

Kerjakan di cabang `chore/praisindo-ds` (buat bila belum ada; jangan bekerja di `main`). Tahap 1 berakhir dengan `docs/design-system/migration-plan.md` dan BERHENTI sampai pengguna menulis "lanjutkan tahap 2". Tidak ada push dan tidak ada PR sebelum pengguna memintanya.

Gunakan skill `design-system` (mode audit dan perbaikan) untuk memigrasi aplikasi ini ke Praisindo Design System. Baca dulu `SKILL.md`, `references/rules-wajib.md` (indeks) beserta berkas aturan per area `references/rules-*.md`, `references/tokens-komponen.md`, `references/audit.md`, `references/shell.md`, `references/branding.md`, `references/design-page.md`, dan `references/new-components-log.md` dari skill. Bila skill tidak terpasang, hentikan dan beri tahu saya; jangan mengarang aturan.

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

### Pemeriksaan kepatuhan per halaman (wajib, sebelum halaman dianggap selesai)
0. **Add / edit di drawer (DK-01):** migrasi hanya mengubah tampilan, jadi drawer berisi formulir tambah atau ubah TIDAK diubah menjadi halaman. Catat setiap kasus di `migration-plan.md` sebagai "perlu keputusan" (jalur halaman form yang dituju sesuai `decisions.md`) dan tanyakan ke pengguna; jangan mengubah perilaku sendiri.
1. Golongkan halaman: **daftar** (tabel atau papan entitas), **formulir** (tambah / ubah), **detail** (satu entitas), **dialog** (alur yang terutama drawer / dialog / menu), **dasbor** (KPI dan grafik), atau **lainnya**.
2. Buka halaman contoh yang sesuai dari skill dan baca berkas aturan jenisnya:

   | Jenis | Halaman contoh (React / HTML) | Aturan |
   |---|---|---|
   | daftar | `features/examples/ListPage.tsx` / `pages/examples/list.*.html` | `rules-tabel.md`, `rules-tombol.md`, `rules-badge-chip.md`, `rules-dialog.md` (menu aksi) |
   | formulir | `features/examples/FormPage.tsx` / `pages/examples/form.*.html` | `rules-form.md`, `rules-tombol.md`, `rules-dialog.md` (DR-06) |
   | detail | `features/examples/DetailPage.tsx` / `pages/examples/detail.*.html` | `rules-kartu.md`, `rules-shell.md` (NV-01, BK-01, SB-30), `rules-dialog.md` |
   | dialog | `features/examples/DialogsPage.tsx` / `pages/examples/dialogs.*.html` | `rules-dialog.md`, `rules-tombol.md` |
   | dasbor | Design System page, bagian KPI / widget | `rules-kartu.md`, `rules-fondasi.md` |
   | lainnya | contoh yang paling dekat | `rules-fondasi.md`, `rules-teks.md` |

   Semua jenis juga memakai `rules-fondasi.md`, `rules-shell.md` dan `rules-teks.md`.
3. Bandingkan halaman dengan contoh bagian per bagian (urutan, komponen, prop, state, teks) dan periksa setiap aturan umum jenisnya. Catat di `docs/design-system/migration-log.md`, satu tabel per halaman:

   ```
   ## <halaman> (<jenis>)
   | id | status (lulus / gagal / tidak berlaku) | bukti (file:baris, tangkapan layar, hasil audit) | alasan bila gagal |
   ```
4. Halaman BELUM selesai selama ada aturan umum yang gagal tanpa alasan tertulis. Alasan yang diterima: kebutuhan produk yang tidak bisa dipenuhi komponen DS (dengan usulan di `new-components.md`) atau keputusan pengguna (tulis tanggal dan kata-katanya). "Belum sempat" bukan alasan.
5. Jalan pintas yang dilarang:
   - membuat komponen baru bila padanannya ada di DS (lihat `tokens-komponen.md` dan halaman contoh);
   - mengubah gaya komponen DS (kelas tambahan, `style`, CSS yang menimpa) agar mirip tampilan lama;
   - menyimpang dari halaman contoh tanpa alasan tertulis. Bila hasil berbeda dari contoh, yang diubah adalah hasilnya, bukan contohnya, aturannya, atau auditnya.

## Tahap 4b: sapuan akhir (setelah halaman terakhir)
1. Jalankan `node <skill>/scripts/audit.mjs .` untuk seluruh project; semua temuan pola (FM-01, TB-03, TB-06, TB-09, TB-10, BT-02, BT-04, CD-08) diselesaikan atau diberi alasan tertulis.
2. Telusuri SEMUA aturan umum (`references/rules-general.json`, teks lengkap di `references/rules-*.md`) untuk setiap halaman, juga yang tidak diperiksa script: urutan halaman daftar, Show / hide columns paling kanan, kolom beku, state, ikon info pada istilah yang memerlukannya, tanda wajib dan opsional, urutan footer, jenis dialog, aturan teks.
3. Laporkan matriks halaman × aturan di `docs/design-system/migration-log.md` (baris = id aturan, kolom = halaman, isi = lulus / gagal / tidak berlaku), dengan daftar setiap "gagal" beserta alasannya. Tahap 5 baru boleh dimulai bila tidak ada "gagal" tanpa alasan.

## Tahap 5: penutup
1. Lepas sisa gaya dan pustaka UI lama yang sudah tidak dipakai (periksa pemakaian dulu; bila ragu, jangan hapus, laporkan).
2. Jalankan audit penuh: Blockers 0 dan Fixes 0 adalah target; sisa Cleanup dan alasannya dilaporkan.
3. Daftar periksa akhir dari `SKILL.md`: tanpa literal warna/ukuran/radius/jarak, tanpa px di luar kelipatan 4, shell + Design System + Branding bekerja, log komponen baru terisi, terang/gelap dan EN/ID dicek, ponsel 390px tanpa scroll samping, state kosong/memuat/galat ada, fokus terlihat, tanpa Alert awal.
4. Tulis versi skill (v2.134.0) di README project atau komentar pertama.
5. Laporan akhir: ringkasan per tahap, daftar halaman dan statusnya, hasil build/tes/audit dibanding baseline, daftar komponen baru yang diusulkan, daftar hal yang tidak dimigrasi dan alasannya, pertanyaan tersisa, nama tangkapan layar yang Anda buka. Jangan push dan jangan buka PR; tunggu perintah saya.

## Larangan
Jangan mengubah logika bisnis, API, data, atau perizinan. Jangan menghapus tes atau melonggarkannya. Jangan menyalin pengecualian kontras Praisindo (CL-04, LG-04c, RB-01). Jangan mengubah aturan atau komponen DS, dan jangan membuat komponen baru bila padanannya ada di DS. Jangan menghapus gaya lama sebelum halaman penggantinya selesai. Jangan melanjutkan melewati Tahap 1 tanpa persetujuan saya.

## Upgrading a project to a newer skill (a project that already uses the Praisindo DS)
Installing a newer skill does not change a project: its code keeps the names it was built with. When the design system renamed a component, a class family or a custom property, the old name no longer exists in the new stylesheets (no alias), so an old name is a bug that does not always show an error (a missing `var(--...)` just drops the colour).
1. Take the baseline: build, tests, `node scripts/audit.mjs <project>`, screenshots of the main pages (1440 and 390, light and dark).
2. Replace the design system folder of the project with the one of the new skill (`src/design-system/` for React, `css/` for HTML, `scripts/`), keeping the project's own `branding` values.
3. Dry run: `node scripts/migrate-names.mjs <project>`. It lists every old name (components, classes, custom properties) with the file and line and writes nothing. Read the list and the "check by hand" notes (ErrState / ErrorState, WoCard, short names).
4. Apply: `node scripts/migrate-names.mjs <project> --apply`, then fix by hand what the notes name (a merged component, an import that now repeats the same name, a file named after the old component).
5. `npx tsc --noEmit` (React) and the build, then `node scripts/audit.mjs <project>`: check RN-01 must be empty; compare the other findings with the baseline.
6. Look at the pages again at the same sizes and themes. `references/renames.json` is the list of every rename; read the new `rules-*.md` sections for behaviour that changed without a rename.
One commit per step. Never keep the old name as a local alias to make a check pass.

