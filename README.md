# DS Praisindo marketplace

Skill `praisindo-design-system` untuk Claude Code, dengan pembaruan otomatis.

## Pengguna: pasang sekali
```
/plugin marketplace add <OWNER>/ds-praisindo-marketplace
/plugin install praisindo-design-system@ds-praisindo-marketplace
```
Nyalakan pembaruan otomatis: `/plugin` → tab Marketplaces → ds-praisindo-marketplace → Enable auto-update.
Pembaruan manual: `/plugin marketplace update ds-praisindo-marketplace`.

## Pemilik: rilis versi baru
1. Ganti isi `plugins/praisindo-design-system/skills/praisindo-design-system/` dengan hasil sinkron terbaru.
2. Naikkan `version` di `plugins/praisindo-design-system/.claude-plugin/plugin.json` dan `.claude-plugin/marketplace.json` (nomor skill = nomor DS). Tanpa kenaikan versi, pengguna tidak menerima pembaruan.
3. Commit dan push ke branch `main`.
