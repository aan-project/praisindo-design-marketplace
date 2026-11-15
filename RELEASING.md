# Merilis versi baru (untuk pemilik repo)

1. Ganti isi `plugins/praisindo-design/skills/design-system/` dengan skill hasil sinkron terbaru (tanpa `.DS_Store` dan `node_modules`). `SKILL.md` harus menyebut nomor versi yang akan dirilis.
2. Jalankan:
   ```
   node scripts/release.mjs <MAJOR.MINOR.PATCH> "<satu baris untuk CHANGELOG>"
   ```
   Skrip menaikkan versi di `plugin.json` dan `marketplace.json` (entri plugin dan `metadata`), menambah satu baris di `CHANGELOG.md`, dan memperbarui versi, tanggal dan alamat repo di `README.md`. Tanpa kenaikan versi, pengguna tidak menerima pembaruan.
3. Periksa kapan saja: `node scripts/release.mjs --check` (versi di semua berkas sama, README mengikuti, alamat repo sama dengan `git remote`).
4. Komit, beri tag dan push:
   ```
   git add -A && git commit -m "Praisindo design <versi>" && git tag v<versi> && git push && git push --tags
   ```
5. Umumkan rilis ke pengguna (aplikasi desktop belum memperbarui otomatis): "buka Settings → Capabilities → Your plugins → Praisindo design → Update".

Aturan versi: `MAJOR.MINOR` = nomor Design System yang disinkronkan; `PATCH` = perbaikan skill saja; `MAJOR` naik hanya atas keputusan pemilik (VN-01).

Zip untuk pengguna claude.ai (`praisindo-design-v<versi>.zip`) dibuat dari folder skill yang sama.
