# Praisindo design

Membuat setiap tampilan web yang Anda minta ke Claude mengikuti Praisindo Design System, sehingga semua proyek konsisten dan Anda tidak perlu memikirkan detail UI/UX.

Versi terbaru: **<!-- version -->2.184.2<!-- /version -->** (<!-- date -->2026-11-26<!-- /date -->)

## Pasang (sekali)
Yang dibutuhkan: aplikasi **Claude desktop** (Mac atau Windows). Tidak ada berkas yang perlu diunduh.

1. Buka **Settings** → **Customize** → **Plugins**.
2. Klik tombol **Add** (hitam, di kanan atas), lalu pilih menambah marketplace.
3. Isi alamat repo berikut, lalu konfirmasi:
   ```
   aan-project/praisindo-design-marketplace
   ```
4. Di daftar plugin akan muncul **Praisindo design**. Klik panah kecil di samping tombol **Add to this computer**, lalu pilih **Install for me** (aktif di semua proyek di komputer Anda).
5. Pastikan plugin sudah ada di tab **Yours**.
6. Buka **sesi baru**. Sesi yang sudah berjalan tidak mengenali plugin yang baru dipasang.

## Pakai
Minta pekerjaan tampilan seperti biasa, misalnya "buatkan halaman daftar pelanggan". Bila perlu, tulis "pakai skill design-system" di awal permintaan.

## Perbarui
**Settings** → **Capabilities** → **Your plugins** → **Praisindo design**. Bila tombol **Update** aktif, klik, lalu buka sesi baru.

## Proyek yang sudah dibuat
Update hanya mengubah plugin, **tidak mengubah proyek yang sudah ada**. Tampilan lama tetap seperti saat dibuat, jadi aman. Untuk membawa proyek lama ke desain terbaru:
1. Simpan pekerjaan Anda dulu (commit), supaya mudah dibatalkan.
2. Buka proyek itu di sesi baru, lalu minta:
   > Perbarui proyek ini ke versi terbaru skill design-system. Cek dulu apa yang berbeda, lalu sesuaikan.
3. Lihat hasilnya di browser sebelum dipakai.

Proyek baru selalu memakai versi terbaru, jadi tidak perlu langkah ini.

## Kendala
- Skill tidak muncul: buka sesi baru.
- Marketplace tidak ditemukan: cek alamat di atas dan koneksi internet.
- Masih ada plugin lama bernama `praisindo-design-system`: hapus, lalu pasang ulang.
