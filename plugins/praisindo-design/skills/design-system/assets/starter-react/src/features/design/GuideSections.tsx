// Design System page: Guide and Foundations sections (golden: baseline/golden/ds-page.json). Text is the prototype's own, in both languages.
import { Fragment } from 'react';
import { fill } from '../../i18n/fill';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { Button } from '../../design-system/components/Button';
import { GroupTitle } from '../../design-system/components/Card';
import { Icon } from '../../design-system/components/Icon';
import { ErrorState, RetryButton } from '../../design-system/components/States';
import { cv } from '../../lib/cssVar';
import { dfmt } from '../../lib/dateFormat';
import { DS_LIVE, latestEntry } from './dsLog';
import { DsApi, DsCode, DsCopy, DsDemo, DsDo, DsH, DsLogList, DsSec, dsHex, sty, useB } from './ds';
import { CustomerName } from './names';

export function StartSection() {
  const B = useB();
  const { brand } = usePrefs();
  const facts: [string, string][] = [[B('Font', 'Font'), brand.font], [B('Primary brand', 'Brand primer'), brand.primary], [B('Icons', 'Ikon'), 'Material Icons · Outlined, Filled when solid'], [B('Libraries', 'Library'), 'DataTables 2.1.8 · ApexCharts 3.54.1'], [B('Themes', 'Tema'), B('Light and dark', 'Terang dan gelap')], [B('Languages', 'Bahasa'), 'English · Bahasa Indonesia']];
  const read: [string, string][] = [
    [B('Group', 'Grup'), B('Every section belongs to a group (Guide, Foundations, Components, Patterns, Content). The contents list on the left follows the same groups and highlights where you are.', 'Setiap section masuk satu grup (Panduan, Fondasi, Komponen, Pola, Konten). Daftar isi di kiri mengikuti grup yang sama dan menandai posisi Anda.')],
    [B('Example', 'Contoh'), B('Live examples come first; they are real components, so they follow the current theme and language.', 'Contoh langsung ditampilkan lebih dulu; semuanya komponen asli, sehingga mengikuti tema dan bahasa yang aktif.')],
    [B('API', 'API'), B('The table lists the function, its options and defaults — copy the name in the first column.', 'Tabel berisi fungsi, opsi, dan nilai bawaannya — salin nama di kolom pertama.')],
    [B('Rules', 'Aturan'), B("Bullets and Do / Don't say when to use it and what to avoid.", 'Poin dan Lakukan / Hindari menjelaskan kapan dipakai dan apa yang dihindari.')],
  ];
  return (
    <DsSec id="start" title={B('Getting started', 'Mulai')} lead={B('This page documents the Praisindo design system: the tokens, components and rules every screen is built from. Every example below is a live component, so it follows the current theme, language, font size and branding.', 'Halaman ini mendokumentasikan design system Praisindo: token, komponen, dan aturan yang menjadi dasar setiap layar. Setiap contoh di bawah adalah komponen hidup, sehingga mengikuti tema, bahasa, ukuran font, dan branding yang aktif.')}>
      <div className="dsfacts">{facts.map(([a, b]) => <div key={a}><span className="mut">{a}</span><span className="fw6">{b}</span></div>)}</div>
      <p className="mut">{B('Component sizes follow the user preferences: table size switches rows between S, M and L; controls are always M. Brand colors come from Admin › Branding and never change status, focus or chart meaning.', 'Ukuran komponen mengikuti preferensi pengguna: ukuran tabel mengganti baris antara S, M, dan L; kontrol selalu M. Warna brand berasal dari Admin › Branding dan tidak pernah mengubah makna status, fokus, atau chart.')}</p>
      <DsH>{B('How to read this page', 'Cara membaca halaman ini')}</DsH>
      <ol className="dsread">{read.map(([a, b], i) => <li key={a}><span className="dsrn">{i + 1}</span><div><span className="fw6">{a}</span><span className="mut">{b}</span></div></li>)}</ol>
    </DsSec>
  );
}

export function ChangesSection({ onOpenLog }: { onOpenLog?: () => void }) {
  const B = useB();
  const { prefs } = usePrefs(), newest = latestEntry(DS_LIVE.log);
  return (
    <DsSec id="changes" title={B("What's new", 'Yang baru')} lead={fill(B('Version {v} · updated {d}. This documentation is updated together with every change to a component, token or rule.', 'Versi {v} · diperbarui {d}. Dokumentasi ini diperbarui bersamaan dengan setiap perubahan komponen, token, atau aturan.'), { v: DS_LIVE.version, d: dfmt(DS_LIVE.updated, prefs.lang) })}>
      <DsLogList rows={newest ? [newest] : []} />   {/* rule DS-10: only the newest entry (highest version), found in the data */}
      {DS_LIVE.log.length > 1 ? <div className="dslog-more"><Button label={B('View all', 'Lihat semua')} count={DS_LIVE.log.length} iconRight="chevron_right" type="outlined" intent="neutral" size="sm" onClick={onOpenLog} /></div> : null}
    </DsSec>
  );
}

/** Principles is the Rules log (rules RLG-01 to RLG-08, owner decision 2026-11-14): the six principles of the old page are gone; the page logs every rule of the design system and of the skill. */
export function PrinciplesSection() {
  const B = useB();
  const P: [string, string][] = [
    [B('Attention → why → action → customer → result', 'Perhatian → alasan → aksi → customer → hasil'), B('Every screen reads in this order. Lists open with what needs attention; details explain why before offering an action.', 'Setiap layar dibaca dengan urutan ini. Daftar dibuka dengan hal yang perlu diperhatikan; detail menjelaskan alasan sebelum menawarkan aksi.')],
    [B('One card is one box', 'Satu card satu kotak'), B('Content inside a card is grouped with spacing, hairlines and leading icons, never with another bordered box.', 'Isi di dalam card dikelompokkan dengan jarak, garis tipis, dan ikon di depan, bukan dengan kotak berbingkai lagi.')],
    [B('No unnecessary shadows', 'Tanpa bayangan yang tidak perlu'), B('Elevation is a border and a surface tone. Shadows are not used.', 'Elevasi dibuat dengan border dan tone surface. Bayangan tidak dipakai.')],
    [B('Large interactions open in a drawer', 'Interaksi besar dibuka di drawer'), B('Forms, filters, exports and comparisons use the right-side drawer (S 400, M 560, L 760 px), not modal dialogs.', 'Formulir, filter, export, dan perbandingan memakai drawer di kanan (S 400, M 560, L 760 px), bukan dialog modal.')],
    [B('The system suggests, people decide', 'Sistem menyarankan, manusia memutuskan'), B('Praisindo never sends messages or executes transactions automatically. Inferred values are labelled as estimates or demo data.', 'Praisindo tidak pernah mengirim pesan atau mengeksekusi transaksi otomatis. Nilai hasil inferensi diberi label estimasi atau data demo.')],
    [B('Permissions live in the handler', 'Izin ada di handler'), B('Hiding a button is not access control. Every action checks its permission when it runs.', 'Menyembunyikan tombol bukan kontrol akses. Setiap aksi memeriksa izinnya saat dijalankan.')],
  ];
  return <DsSec id="principles" title={B('Principles', 'Prinsip')}><ol className="dsp">{P.map(([a, b]) => <li key={a}><span className="fw6">{a}</span><span>{b}</span></li>)}</ol></DsSec>;
}

const NEUTRAL = ['color-background-neutral-page', 'color-surface-neutral-primary', 'color-surface-neutral-secondary', 'color-surface-neutral-tertiary', 'color-text-primary', 'color-text-secondary', 'color-text-tertiary', 'color-border-neutral-subtle', 'color-border-neutral-default', 'color-border-neutral-strong'];
const INTENTS = ['brand', 'secondary', 'success', 'warning', 'danger', 'info', 'purple', 'cyan'];

export function ColorsSection({ onCopy, down, onRetry }: { onCopy?: (hex: string) => void; down?: boolean; onRetry?: () => void }) {
  const B = useB();
  const dark: [string, string, string][] = [['page', '#0b0e13', B('Page', 'Halaman')], ['card', '#151a21', B('Card / surface', 'Card / permukaan')], ['raised', '#1e242d', B('Raised / secondary', 'Naik / sekunder')], ['field', '#10141a', B('Field fill', 'Fill field')], ['line', '#222932', B('Border', 'Border')], ['text', '#e6e9ee', B('Text · 14.4:1', 'Teks · 14,4:1')], ['s4', '#aab1bd', B('Secondary text · 8.1:1', 'Teks sekunder · 8,1:1')], ['s3', '#8a93a1', B('Tertiary text · 5.6:1', 'Teks tersier · 5,6:1')]];
  return (
    <DsSec id="colors" title={B('Color', 'Warna')} lead={B('Colors are design tokens generated from the brand colors and fixed neutral and intent ramps, in a light and a dark theme.', 'Warna adalah design token yang dibuat dari warna brand serta ramp netral dan intent yang tetap, dalam tema terang dan gelap.')}>
      {down ? (
        <ErrorState size="md" icon="palette" title={B('Color tokens unavailable', 'Token warna tidak tersedia')} cta={<RetryButton onClick={onRetry} />}
          desc={B('The token service did not respond. Components below still use the cached theme.', 'Layanan token tidak merespons. Komponen di bawah tetap memakai tema yang tersimpan.')} />
      ) : (
        <>
      <DsH>{B('Neutral', 'Netral')}</DsH>
      <div className="dsgrid">{NEUTRAL.map((n) => (
        <DsCopy key={n} name={n} cls="dssw" onCopy={onCopy}>
          <span className="dsk" style={sty(`background:var(--${n})`)} /><span className="m"><span className="fw6">{n.replace(/^color-/, '')}</span><span className="mut">{dsHex(n) || '—'}</span></span><Icon name="content_copy" />
        </DsCopy>
      ))}</div>
      <DsH>{B('Intents', 'Intent')}</DsH>
      <p className="mut">{B('Each intent has a subtle surface (backgrounds, badges), a default surface (fills, bars) and a strong foreground (text on subtle).', 'Setiap intent memiliki surface subtle (latar, badge), surface default (isi, bar), dan foreground strong (teks di atas subtle).')}</p>
      <div className="dsint">{INTENTS.map((i) => (
        <div key={i} className="dsi"><span className="fw6">{i}</span>
          <div className="dsramp">{([[`color-surface-${i}-subtle-1`, 'subtle'], [`color-surface-${i}-default`, 'default'], [`color-foreground-${i}-strong`, 'strong']] as const).map(([n, l]) => (
            <DsCopy key={n} name={n} cls="dsrs" onCopy={onCopy}><span className="dsrk" style={sty(`background:var(--${n})`)} /><span className="dsrl">{l}</span><span className="dsrh">{dsHex(n)}</span></DsCopy>
          ))}</div></div>
      ))}</div>
      <p className="mut dscopyn"><Icon name="content_copy" /> {B('Click any swatch to copy its hex code. Values follow the active theme (light / dark) and the client brand.', 'Klik kotak warna mana pun untuk menyalin kode hex-nya. Nilai mengikuti tema aktif (terang / gelap) dan brand klien.')}</p>
      <DsDo dos={[B('Use brand for the one primary action, active navigation and links.', 'Gunakan brand untuk satu aksi utama, navigasi aktif, dan link.'), B('Pair every status color with a word or icon.', 'Pasangkan setiap warna status dengan kata atau ikon.'), B('Read colors from tokens (var(--…)), never hard-code hex.', 'Ambil warna dari token (var(--…)), jangan menulis hex langsung.')]}
        donts={[B('Use brand color for status or selection meaning.', 'Memakai warna brand untuk makna status atau seleksi.'), B('Use color alone to carry meaning.', 'Mengandalkan warna saja untuk menyampaikan makna.'), B('Add new colors outside the token set.', 'Menambah warna di luar set token.')]} />
        </>
      )}
      <DsH>{B('Dark mode', 'Mode gelap')}</DsH>
      <div className="dsframe" style={sty('display:grid;grid-template-columns:repeat(auto-fill,minmax(152px,1fr));gap:8px')}>{dark.map(([k, h, l]) => (
        <div key={k} style={sty('display:flex;align-items:center;gap:8px')}>
          <span style={sty(`width:28px;height:28px;border-radius:6px;border:1px solid #222932;background:${h};flex:none`)} />
          <span><span className="fw6" style={sty('font-size:var(--fs-sm)')}>{l}</span><br /><span className="mut" style={sty('font-size:var(--fs-xs)')}>{h}</span></span>
        </div>
      ))}</div>
      <ul className="dsrules">
        <li>{B('Neutrals are blue-grey, never pure black or pure white: page #0b0e13, card #151a21, raised #1e242d, text #e6e9ee (about 14:1 — pure white on black glares).', 'Netral berwarna abu-abu kebiruan, tidak pernah hitam murni atau putih murni: halaman #0b0e13, card #151a21, naik #1e242d, teks #e6e9ee (sekitar 14:1 — putih murni di atas hitam menyilaukan).')}</li>
        <li>{B('Elevation reads through lighter surfaces, not shadows.', 'Elevasi terbaca dari permukaan yang lebih terang, bukan bayangan.')}</li>
        <li>{B('Intent colours (including the client brand and secondary colours) are generated, so any client colour works: subtle background = 18% of the hue over the card; text = the hue lightened until it reaches 4.5:1 on the card; strong text = hue + 58% white; a fill that carries white text is darkened until white reaches 4.5:1 (WCAG AA).', 'Warna intent (termasuk warna brand dan sekunder klien) dibangkitkan, sehingga warna klien apa pun tetap aman: latar subtle = 18% hue di atas card; teks = hue dicerahkan hingga 4,5:1 terhadap card; teks strong = hue + 58% putih; isian yang membawa teks putih digelapkan hingga putih mencapai 4,5:1 (WCAG AA).')}</li>
      </ul>
    </DsSec>
  );
}

export function TypeSection() {
  const B = useB();
  const fs = ['h', 'lg', 'md', 'sm', 'xs'] as const;
  const sample = (k: string) => (k === 'h' ? B('Page title', 'Judul halaman') : k === 'lg' ? B('Section heading', 'Judul section') : k === 'md' ? B('Body text and values', 'Teks isi dan nilai') : k === 'sm' ? B('Table cells, labels and buttons', 'Sel tabel, label, dan tombol') : B('Captions, meta and helper text', 'Keterangan, meta, dan teks bantuan'));
  return (
    <DsSec id="type" title={B('Typography', 'Tipografi')} lead={B('One family (set in Branding) with a short scale. Font-size preference scales every step.', 'Satu keluarga font (diatur di Branding) dengan skala pendek. Preferensi ukuran font menskalakan semua tingkat.')}>
      <div className="dstype">{fs.map((k) => (
        <div key={k} className="dst"><span className="mut"><DsCode>{'--fs-' + k}</DsCode> · {cv('--fs-' + k) || '—'}</span>
          <span style={{ fontSize: `var(--fs-${k})`, fontWeight: `calc(${k === 'h' ? 700 : k === 'lg' ? 500 : 400} + var(--fw-shift,0))` }}>{sample(k)}</span></div>
      ))}</div>
      <div className="dsframe" style={sty('display:flex;flex-direction:column;gap:8px')}>
        <GroupTitle text={B('Group title', 'Judul grup')} />
        <span className="mut">{B('GroupTitle — caption: --fs-xs · 500 · uppercase · letter-spacing .08em · text-tertiary', 'GroupTitle — caption: --fs-xs · 500 · kapital · letter-spacing .08em · text-tertiary')}</span>
      </div>
      <DsDo dos={[B('Use weight before size to create hierarchy (400 / 500; 600 only for a card title; 700 for the page title).', 'Gunakan ketebalan sebelum ukuran untuk hierarki (400 / 500; 600 hanya untuk judul kartu; 700 untuk judul halaman).'), B('Keep one page title (h1) per page with a small breadcrumb above it.', 'Satu judul halaman (h1) per halaman dengan breadcrumb kecil di atasnya.'), B('Use sentence case.', 'Gunakan sentence case.'), B('Three stacked text lines in one component get softer from top to bottom: text-primary · text-secondary · text-tertiary (e.g. priority list: name · reason · hp-meta; activity log: title · object · alog-m; KPI: label · value · .mut note). Use .t3 for any other third line.', 'Tiga baris teks bertumpuk dalam satu komponen makin lembut dari atas ke bawah: text-primary · text-secondary · text-tertiary (mis. daftar prioritas: nama · alasan · hp-meta; log aktivitas: judul · objek · alog-m; KPI: label · nilai · catatan .mut). Pakai .t3 untuk baris ketiga lainnya.')]}
        donts={[B('Use all caps for labels or headings (only exception: GroupTitle group captions).', 'Memakai huruf kapital semua untuk label atau judul (satu-satunya pengecualian: caption grup GroupTitle).'), B('Add font sizes outside the scale.', 'Menambah ukuran font di luar skala.'), B('Give the third line of a stacked group the same color as the second.', 'Memberi baris ketiga dalam grup bertumpuk warna yang sama dengan baris kedua.')]} />
      <DsDemo label={B('Text hierarchy — three stacked lines', 'Hierarki teks — tiga baris bertumpuk')}>
        <div className="li" style={sty('max-width:420px;border:1px solid var(--color-border-neutral-subtle);border-radius:8px;padding:12px 16px')}>
          <div className="m"><span className="t"><CustomerName name="Budi Santoso" /></span><span className="mut">{B('Review idle funds · text-secondary', 'Tinjau dana menganggur · text-secondary')}</span><span className="mut">{B('WhatsApp · Today · text-tertiary', 'WhatsApp · Hari ini · text-tertiary')}</span></div>
        </div>
      </DsDemo>
    </DsSec>
  );
}

export function SpaceSection() {
  const B = useB();
  const rad: [number, string][] = [[0, B('Drawers (edge to edge)', 'Drawer (menempel tepi)')], [4, B('Checkbox, toast, small chips', 'Checkbox, toast, chip kecil')], [8, B('Cards and containers (token --r-card) and controls: button, field, select, alert, menu', 'Card dan container (token --r-card) serta kontrol: tombol, field, select, alert, menu')], [999, B('Pills, badges, avatars, toggles', 'Pill, badge, avatar, toggle')]];
  return (
    <DsSec id="space" title={B('Spacing, radius, elevation', 'Jarak, radius, elevasi')} lead={B('A 4 px grid. Page padding uses --page-pad (24 px).', 'Grid 4 px. Padding halaman memakai --page-pad (24 px).')}>
      <div className="dsspace">{[4, 8, 12, 16, 20, 24, 32].map((n) => <div key={n}><span className="dsbar" style={{ width: `${n * 2}px` }} /><span className="mut">{n}px</span></div>)}</div>
      <DsH>{B('Radius', 'Radius')}</DsH>
      <div className="dsrad">{rad.map(([r, l]) => <div key={r}><span className="dsr" style={{ borderRadius: `${r}px` }} /><span className="fw6">{r === 999 ? '999' : r}px{r === 8 ? ' · --r-card' : ''}</span><span className="mut">{l}</span></div>)}</div>
      <DsH>{B('Elevation', 'Elevasi')}</DsH>
      <p className="mut">{B('Surfaces are separated by tone (page → card) and a 1 px border. Overlays (drawer, menu) add the scrim, not a shadow.', 'Surface dipisahkan oleh tone (halaman → card) dan border 1 px. Overlay (drawer, menu) memakai scrim, bukan bayangan.')}</p>
    </DsSec>
  );
}

export function IconsSection() {
  const B = useB();
  const sizes: [number, string][] = [[14, B('Small controls · table meta', 'Kontrol kecil · meta tabel')], [18, B('Buttons · navigation', 'Tombol · navigasi')], [20, B('Large controls', 'Kontrol besar')]];
  const names = ['home', 'lightbulb', 'groups', 'task_alt', 'insights', 'summarize', 'call', 'chat', 'mail_outline', 'bolt', 'person_add', 'event', 'savings', 'event_repeat', 'trending_down', 'hourglass_empty', 'campaign', 'file_download', 'filter_list', 'view_column', 'search', 'more_vert', 'check_circle', 'warning_amber', 'error_outline', 'info'];
  return (
    <DsSec id="icons" title={B('Icons', 'Ikon')} lead={B('Material Icons. Outlined is the default; use the filled (solid) variant only where the meaning or the look needs it, such as a rating star or a selected state. 14 px in small controls and table meta, 18 px in buttons and navigation, 20 px in large controls. Icons sit before the label; icon-only buttons need an aria-label and a tooltip.', 'Material Icons. Outlined adalah default; pakai varian filled (solid) hanya bila makna atau tampilan membutuhkan, misalnya bintang rating atau status terpilih. 14 px di kontrol kecil dan meta tabel, 18 px di tombol dan navigasi, 20 px di kontrol besar. Ikon berada sebelum label; tombol hanya ikon wajib punya aria-label dan tooltip.')}>
      <DsDemo label={B('Sizes', 'Ukuran')}>
        <div className="rw" style={sty('gap:24px;align-items:center')}>{sizes.map(([n, l]) => (
          <span key={n} className="rw" style={sty('gap:8px')}><span className="material-icons-outlined ic" aria-hidden="true" style={{ fontSize: `${n}px` }}>bolt</span><span className="mut">{n} px · {l}</span></span>
        ))}</div>
      </DsDemo>
      <div className="dsicons">{names.map((n) => <div key={n}><Icon name={n} /><span>{n}</span></div>)}</div>
      <DsDemo label={B('Outlined and filled', 'Outlined dan filled')}>
        <span className="rw" style={sty('gap:16px;align-items:center')}>{['star', 'check_circle', 'warning', 'info', 'flag'].map((n) => <Fragment key={n}><Icon name={n} /><Icon name={n} solid /></Fragment>)}</span>
      </DsDemo>
      <DsApi rows={[
        ['Ic(name, solid)', 'string · boolean', 'solid false', B('Returns a span with the Material Icons ligature. solid = true (strictly true) uses the filled font (class material-icons), otherwise the outlined font (material-icons-outlined). Size comes from the context (.ic); colour is currentColor. Use filled for a rating star and similar cases only.', 'Mengembalikan span dengan ligature Material Icons. solid = true (harus persis true) memakai font filled (class material-icons), selain itu font outlined (material-icons-outlined). Ukuran dari konteks (.ic); warna currentColor. Pakai filled hanya untuk bintang rating dan kasus serupa.')],
        [B('Licence', 'Lisensi'), '—', '—', B('Material Icons, Apache 2.0, loaded from Google Fonts.', 'Material Icons, Apache 2.0, dimuat dari Google Fonts.')],
      ]} />
    </DsSec>
  );
}
