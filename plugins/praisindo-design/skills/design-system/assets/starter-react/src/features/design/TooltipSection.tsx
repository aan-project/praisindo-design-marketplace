// Design System page: Tooltip (DS 1.63). Texts come from i18n (tt.*); the table lists every variant at every placement.
import { usePrefs } from '../../app/providers/PrefsProvider';
import { ArticleBody } from '../../design-system/components/ArticleBody';
import { Tooltip, type TooltipPlacement, type TooltipVariant } from '../../design-system/components/Tooltip';
import { DsApi, DsDemo, DsDo, DsH, DsSec, useB } from './ds';

const PLACEMENTS: readonly TooltipPlacement[] = ['top', 'bottom', 'left', 'right'];
const VARIANTS: readonly TooltipVariant[] = ['text', 'title', 'action'];

export function TooltipSection() {
  const B = useB(), { t } = usePrefs();
  const body = (v: TooltipVariant) => (v === 'title' ? t('tt.ex.titleD') : v === 'action' ? t('tt.ex.action') : t('tt.ex.text'));
  const one = (v: TooltipVariant, p: TooltipPlacement, pin = false) => (
    <Tooltip variant={v} placement={p} label={t('tt.help')} title={v === 'title' ? t('tt.ex.title') : undefined} action={v === 'action' ? { label: t('tt.ex.link'), href: 'https://example.com/docs' } : undefined} forceOpen={pin}>{body(v)}</Tooltip>
  );
  return (
    <DsSec id="tooltip" title="Tooltip" lead={B('A dark bubble with a tail that points at its trigger. Left-aligned text, an optional title and an optional link button with the open_in_new icon. It opens on hover and on keyboard focus, stays open while the pointer is inside it, closes with Escape, and opens with a tap on a touch screen. It flips to the opposite side when it does not fit.', 'Gelembung gelap dengan ekor yang menunjuk pemicunya. Teks rata kiri, judul opsional, dan tombol tautan opsional dengan ikon open_in_new. Terbuka saat hover dan fokus keyboard, tetap terbuka selama kursor di dalamnya, tertutup dengan Escape, dan terbuka dengan ketukan di layar sentuh. Berpindah ke sisi berlawanan bila tidak muat.')}>
      <DsH>{B('Variants and placements (hover or focus the icons)', 'Varian dan penempatan (hover atau fokus ikonnya)')}</DsH>
      <div className="tw t-sm dsapi">
        <table style={{ minWidth: 520 }}>
          <thead><tr><th>{B('Variant', 'Varian')}</th>{PLACEMENTS.map((p) => <th key={p}>{p}</th>)}</tr></thead>
          <tbody>{VARIANTS.map((v) => <tr key={v}><td><code className="dsc">tt-{v}</code></td>{PLACEMENTS.map((p) => <td key={p}>{one(v, p)}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <DsDemo label={B('Preview of each variant (always open)', 'Pratinjau tiap varian (selalu terbuka)') + ' · Tooltip'}>
        <div className="dsttp">{VARIANTS.map((v) => <div key={v}>{one(v, 'bottom', true)}</div>)}</div>
      </DsDemo>
      <DsApi rows={[
        ['Tooltip({variant, placement, title, action, label, trigger, children})', 'variant: text · title · action · placement: top · bottom · left · right', 'text · top', B('children is the description. action: {label, href | onClick}; with href it is a link that opens in a new tab (rel noopener), otherwise a button. trigger: your own focusable element; the default is the help icon button, named by label (tt.help).', 'children adalah deskripsi. action: {label, href | onClick}; dengan href berupa tautan yang dibuka di tab baru (rel noopener), selain itu berupa tombol. trigger: elemen fokusabel Anda sendiri; bawaannya tombol ikon help, bernama label (tt.help).')],
        ['role="tooltip"', 'aria-describedby on the trigger', '—', B('The bubble is always in the DOM (hidden while closed), so the reference is always valid; its link is in the Tab order only while it is open.', 'Gelembung selalu ada di DOM (tersembunyi saat tertutup), jadi referensinya selalu valid; tautannya masuk urutan Tab hanya saat terbuka.')],
      ]} />
      <DsDemo label={B('The text of a help article (rule HC-07)', 'Teks artikel bantuan (aturan HC-07)') + ' · ArticleBody'}>
        <ArticleBody>
          <h3>{B('Where to begin', 'Dari mana mulai')}</h3>
          <p>{B('Open Opportunities and take the ones with the highest priority first. A ', 'Buka Opportunities dan ambil yang prioritasnya paling tinggi lebih dulu. Sebuah ')}<a href="#/design">{B('link', 'tautan')}</a>{B(', a list and a table use the same reading column.', ', daftar, dan tabel memakai kolom baca yang sama.')}</p>
          <ul><li>{B('One reading column, at most 720px wide.', 'Satu kolom baca, selebar paling banyak 720px.')}</li><li>{B('Headings, paragraphs, lists, tables and code only.', 'Hanya judul, paragraf, daftar, tabel, dan kode.')}</li></ul>
        </ArticleBody>
      </DsDemo>
      <DsApi rows={[
        ['ArticleBody({children})', '—', '—', B('Styles the Markdown output of a Help Center article (h2, h3, p, ul, ol, table, code, a) in one reading column of at most 720px with tokens only. Presentational: no state, no handlers.', 'Menata keluaran Markdown artikel Pusat Bantuan (h2, h3, p, ul, ol, table, code, a) dalam satu kolom baca selebar paling banyak 720px, hanya dengan token. Tampilan saja: tanpa state dan handler.')],
      ]} />
      <p className="mut">{t('tt.note')}</p>
      <DsDo
        dos={[B('Use it for help that needs a title, more than one line, or a link to the documentation.', 'Pakai untuk bantuan yang butuh judul, lebih dari satu baris, atau tautan ke dokumentasi.'), B('Keep the text left-aligned and short.', 'Jaga teks tetap rata kiri dan singkat.')]}
        donts={[B('Do not put essential information only in a tooltip; it is not shown on a screen without hover or focus.', 'Jangan menaruh informasi penting hanya di tooltip; tidak tampil tanpa hover atau fokus.'), B('Do not use it for errors or warnings: use an Alert.', 'Jangan dipakai untuk error atau peringatan: pakai Alert.')]} />
    </DsSec>
  );
}
