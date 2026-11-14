// Design System page: Patterns & layout (feedback, page header, layouts, navigation, mobile) and Content. Text is the prototype's own.
import { useState } from 'react';
import type { ReactNode } from 'react';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { Alert } from '../../design-system/components/Alert';
import { Breadcrumb } from '../../design-system/components/Breadcrumb';
import { Button } from '../../design-system/components/Button';
import { DetailItem } from '../../design-system/components/DetailList';
import { Icon } from '../../design-system/components/Icon';
import { SidebarToggle } from '../../design-system/components/SidebarToggle';
import { StatCards, KPI } from '../../design-system/components/Widgets';
import { Wizard } from '../../design-system/components/Wizard';
import { Tooltip } from '../../design-system/components/Tooltip';
import { Badge } from '../../design-system/components/Badge';
import { Chip } from '../../design-system/components/Chip';
import { midText } from '../shared/midText';
import { ProductLogo } from '../../design-system/components/ProductLogo';
import { DetailLayout, DetailPanel, DetailSummary } from '../../design-system/components/DetailLayout';
import { Tabs } from '../../design-system/components/Tabs';
import { KanbanBoard } from '../../design-system/components/KanbanBoard';
import { Card, DetailRow } from '../../design-system/components/Card';
import { RichSelect } from '../../design-system/components/Pickers';
import { KanbanCard } from '../../design-system/components/KanbanCard';
import { InfoTooltip } from '../../design-system/components/Hints';
import { AlertAction, EmptyState, ErrorState, LoadingState, RetryButton } from '../../design-system/components/States';
import { Table } from './ListSections';
import { CustomerName, UserName } from './names';
import { DsApi, DsDemo, DsDo, DsH, DsSec, DsTo, sty, useB } from './ds';
import { badgeFor, badgeProps } from '../../domain/badgeIcons';

const Rules = ({ items }: { items: readonly string[] }) => <ul className="dsrules">{items.map((x) => <li key={x}>{x}</li>)}</ul>;


export function FeedbackSection() {
  const B = useB();
  return (
    <DsSec id="feedback" title={B('States & feedback', 'State & umpan balik')} lead={B('Every data area has loading, empty and error states. Empty states say what will appear and how; errors offer a recovery action.', 'Setiap area data punya state loading, kosong, dan error. State kosong menjelaskan apa yang akan muncul dan bagaimana; error menawarkan aksi pemulihan.')}>
      <DsDemo label={B('The four states of a data area', 'Empat state sebuah area data') + ' · LoadingState EmptyState ErrorState'}>
        <div className="dsstates">
          <div className="dsst"><span className="grpt">{B('Loading', 'Memuat') + ' · LoadingState'}</span><div className="card" ><div className="cb"><LoadingState size="sm" /></div></div></div>
          <div className="dsst"><span className="grpt">{B('Empty', 'Kosong') + ' · EmptyState'}</span><div className="card" ><div className="cb"><EmptyState size="sm" icon="inbox" title={B('No opportunities yet', 'Belum ada peluang')} desc={B('New opportunities appear when Praisindo detects a customer signal.', 'Peluang baru muncul saat Praisindo mendeteksi sinyal customer.')} /></div></div></div>
          <div className="dsst"><span className="grpt">{B('Error with a retry', 'Error dengan coba lagi') + ' · ErrorState RetryButton'}</span><div className="card" ><div className="cb"><ErrorState size="sm" icon="sync_problem" title={B('Service unavailable', 'Layanan tidak tersedia')} desc={B('The data could not be loaded.', 'Data tidak dapat dimuat.')} cta={<RetryButton />} /></div></div></div>
          <div className="dsst"><span className="grpt">{B('Empty with a button (rule ES-01: 16px between the description and the button)', 'Kosong dengan tombol (aturan ES-01: 16px antara deskripsi dan tombol)') + ' · EmptyState cta'}</span><div className="card" ><div className="cb"><EmptyState size="lg" icon="summarize" title={B('No report preview yet', 'Belum ada pratinjau laporan')} desc={B('Configure a report to see its preview here.', 'Atur laporan untuk melihat pratinjaunya di sini.')} cta={<Button label={B('Configure report', 'Atur laporan')} icon="tune" />} /></div></div></div>
        </div>
      </DsDemo>
      <DsDemo label={B('Small error and an info icon', 'Error kecil dan ikon info') + ' · ErrorState · InfoTooltip'}><ErrorState size="sm" /><span className="rw">{B('Hover or focus the icon', 'Arahkan atau fokuskan ikon')} <InfoTooltip text={B('A short explanation of the field.', 'Penjelasan singkat tentang field.')} /></span></DsDemo>
      <DsDemo label={B('Stale data with an action', 'Data usang dengan aksi') + ' · Alert AlertAction'}><div className="dsal"><Alert intent="warning" text={B('Data may be out of date.', 'Data mungkin belum terbaru.')} extra={<AlertAction k="det.refresh" />} /></div></DsDemo>
      <DsApi rows={[
        ['EmptyState({icon, title, desc, size, cta})', 'cta: a button', 'size=md', B('Nothing to show yet; say what will appear. A button (cta) sits 16px under the description whatever the size; a button written right after the state in older markup gets the same gap from CSS.', 'Belum ada isi; jelaskan apa yang akan muncul. Tombol (cta) berjarak 16px di bawah deskripsi untuk semua ukuran; tombol di elemen tepat sesudah state (markup lama) mendapat jarak yang sama dari CSS.')],
        ['LoadingState({size})', '—', '—', B('Skeleton lines while loading.', 'Garis skeleton saat memuat.')],
        ['ErrorState({icon, title, desc, cta, size})', '—', 'icon=error_outline', B('Every error box. StateErr(code, act) is the preset for standard errors (timeout, forbidden, session…).', 'Semua kotak error. StateErr(code, act) adalah preset untuk error standar (timeout, forbidden, session…).')],
        ['InfoTooltip(text, icon)', 'string · icon', 'info', B('Hover/focus tooltip for extra explanation; in a card header use the lightbulb icon.', 'Tooltip saat hover/fokus untuk penjelasan tambahan; di header card pakai ikon lampu.')],
        ['RetryButton(act, data, size)', '—', '—', B('The recovery button inside an error state.', 'Tombol pemulihan di dalam error state.')],
        ['AlertAction(key, act, data)', 'state.retry · det.refresh', '—', B('The single small action at the end of an Alert.', 'Satu aksi kecil di ujung Alert.')],
      ]} />
      <DsTo p="alert" />
      <DsH>{B('Which message component to use', 'Pakai komponen pesan yang mana')}</DsH>
      <Table minW={720}
        head={<><th>{B('Component', 'Komponen')}</th><th>{B('Use when', 'Pakai bila')}</th><th>{B('Where', 'Lokasi')}</th><th>{B('Dismissible', 'Bisa ditutup')}</th><th>{B('Needs an action', 'Perlu aksi')}</th></>}
        rows={[
          ['Alert', B('A real condition: error, stale or partial data, denied permission, a blocking status, validation after the user acted. Never because a page opened.', 'Kondisi nyata: error, data usang atau sebagian, izin ditolak, status yang memblokir, validasi setelah user bertindak. Bukan karena halaman dibuka.'), B('Inline, above the content it is about', 'Inline, di atas isi yang dimaksud'), B('No', 'Tidak'), B('Optional: one small action at the end', 'Opsional: satu aksi kecil di ujung')],
          ['ChangeNotice', B('A change the user made alters logic and should be checked (before / after rows).', 'Perubahan yang dibuat user mengubah logika dan perlu dicek (baris sebelum / sesudah).'), B('Inline, next to the changed item', 'Inline, di dekat item yang berubah'), B('Yes, by Undo or Keep', 'Ya, lewat Urungkan atau Pertahankan'), B('Yes: Undo / Keep', 'Ya: Urungkan / Pertahankan')],
          ['Rule tip (.sbtip)', B('Contextual advice while building a rule; advice, not a problem.', 'Saran kontekstual saat menyusun rule; saran, bukan masalah.'), B('Tips drawer and the rule editor', 'Drawer tips dan editor rule'), B('Yes (close button)', 'Ya (tombol tutup)'), B('No', 'Tidak')],
          ['Tooltip / InfoTooltip', B('A short explanation of one control or term; never the only place for important information.', 'Penjelasan singkat satu kontrol atau istilah; bukan satu-satunya tempat informasi penting.'), B('On hover or focus of its trigger', 'Saat hover atau fokus pemicunya'), B('Closes by itself (Esc, blur)', 'Menutup sendiri (Esc, blur)'), B('No (an action variant is a link)', 'Tidak (varian aksi berupa link)')],
        ].map((r) => <tr key={r[0]}><td className="fw6">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td>{r[4]}</td></tr>)} />
    </DsSec>
  );
}

export function PageheadSection() {
  const B = useB();
  const { t } = usePrefs();
  return (
    <DsSec id="pagehead" title={B('Page header', 'Header halaman')} lead={B('Every page starts with a small breadcrumb, one title (h1) and a short description of what the page is for. Page actions sit on the right and wrap below on small screens.', 'Setiap halaman diawali breadcrumb kecil, satu judul (h1), dan deskripsi singkat tentang fungsi halaman. Aksi halaman berada di kanan dan turun ke bawah di layar kecil.')}>
      <DsDemo label={B('Breadcrumb, title, description and an action', 'Breadcrumb, judul, deskripsi, dan aksi') + ' · PageHeader (.ph Breadcrumb)'}><div className="dsframe" style={sty('padding:16px 0;flex:1 1 100%')}>
        <div className="ph">
          <div>
            <Breadcrumb items={[['#/home', t('nav.home')], ['#/design', t('nav.design')]]} />
            <div className="ttl"><h1>{B('Opportunities', 'Peluang')}</h1></div>
            <p className="mut">{B('Your assigned opportunities, sorted by priority and score.', 'Peluang yang ditugaskan kepada Anda, diurutkan berdasarkan prioritas dan skor.')}</p>
          </div>
          <div className="rw"><Button label={t('tbl.export')} icon="file_download" type="outlined" intent="neutral" /></div>
        </div>
      </div></DsDemo>
      <DsDo
        dos={[B('Write the description as one sentence (max ~120 characters).', 'Tulis deskripsi dalam satu kalimat (maks. ~120 karakter).'), B('Detail pages use the back icon next to the title.', 'Halaman detail memakai ikon kembali di samping judul.'), B('Restricted or not-found pages still show a description.', 'Halaman yang dibatasi atau tidak ditemukan tetap menampilkan deskripsi.')]}
        donts={[B('Put the breadcrumb in the top header.', 'Menaruh breadcrumb di header atas.'), B('Leave a page title without a description.', 'Membiarkan judul halaman tanpa deskripsi.')]} />
    </DsSec>
  );
}

const SK = (cells: [number, string][]): ReactNode => cells.map(([i, s]) => <i key={i} style={sty(s)} />);

export function LayoutsSection() {
  const B = useB();
  const items: [string, string, ReactNode][] = [
    [B('List', 'Daftar'), B('Header · stat cards · table card. Used by Opportunities, Customers, Activities, Marketing.', 'Header · kartu statistik · card tabel. Dipakai Peluang, Customer, Aktivitas, Marketing.'), SK([[0, 'grid-column:1/-1;height:12px'], [1, 'grid-column:1/-1;height:16px'], [2, 'grid-column:1/-1;height:40px']])],
    [B('Home with rail', 'Home dengan rail'), B('Main column (hero, KPIs, work list, evidence) + sticky right rail (calendar, schedule, reminders) with its own scroll.', 'Kolom utama (hero, KPI, daftar kerja, bukti) + rail kanan menempel (kalender, jadwal, pengingat) dengan scroll sendiri.'), SK([[0, 'grid-column:1/3;height:64px'], [1, 'grid-column:3;grid-row:1/3;height:100%'], [2, 'grid-column:1/3;height:24px']])],
    [B('Detail, three panels (Customer 360)', 'Detail, tiga panel (Customer 360)'), B('Profile panel (left) · tabs (centre) · summary panel (right). Side panels scroll with the page (not sticky); the right panel moves below under 1360 px; everything stacks on phones. Used by Customer 360 and the Problem report (without the right panel when the report was exported: two columns).', 'Panel profil (kiri) · tab (tengah) · panel ringkasan (kanan). Panel samping ikut bergulir dengan halaman (tidak menempel); panel kanan pindah ke bawah di bawah 1360 px; semua bertumpuk di ponsel. Dipakai Customer 360 dan Problem report (tanpa panel kanan bila laporan sudah diekspor: dua kolom).'), SK([[0, 'height:64px'], [1, 'height:64px'], [2, 'height:64px']])],
    [B('Detail, two columns (Opportunity, Signal rule)', 'Detail, dua kolom (Peluang, Signal rule)'), B('Entity panel (left, scrolls with the page: the customer, or the rule) · main column: summary card above the content tabs · Decision bar sticks to the bottom after a selection (Opportunity). Same components for both (DetailLayout). Under 1100 px: summary, panel, tabs.', 'Panel entitas (kiri, ikut bergulir dengan halaman: customer, atau rule) · kolom utama: card ringkasan di atas tab konten · Decision bar menempel di bawah setelah ada pilihan (Peluang). Komponen sama untuk keduanya (DetailLayout). Di bawah 1100 px: ringkasan, panel, tab.'), SK([[0, 'grid-row:1/3;height:100%'], [1, 'grid-column:2/4;height:28px'], [2, 'grid-column:2/4;height:32px']])],
    [B('Long page with jump rail', 'Halaman panjang dengan jump rail'), B('Sticky numbered rail (left) · grouped sections, each with a heading and description. Used by Analytics.', 'Rail bernomor menempel (kiri) · bagian berkelompok, masing-masing dengan judul dan deskripsi. Dipakai Analitik.'), SK([[0, 'grid-row:1/3;height:100%;max-width:20px'], [1, 'grid-column:2/4;height:32px'], [2, 'grid-column:2/4;height:32px']])],
    [B('Form page (add / edit)', 'Halaman form (tambah / ubah)'), B('Breadcrumb back · title and description · steps when the flow has several (Wizard) · one card per group of fields (a card title is never the page title, rule DK-17; the footer on the last card), or two columns when the fields feed a live result (the criteria next to the preview), and a jump rail beside a long form of five groups or more (rule DK-21; the engagement brief) · footer Cancel then Save (the primary last). Layout detail: the sidebar collapses. Adding or editing data is always a page, never a drawer (rule DK-01). Used by the Marketing brief and segment forms, the forms of Data & Integration and Configure a report. The record of a problem report, an engagement request or a read-only brief is a detail page (rule DK-18: two columns; the problem report has three panels as Customer 360, the right one for the hold).', 'Breadcrumb kembali · judul dan deskripsi · langkah bila alurnya bertahap (Wizard) · satu card per grup field (judul card tidak pernah sama dengan judul halaman, aturan DK-17; footer di card terakhir), atau dua kolom bila field menghasilkan hasil langsung (kriteria di samping pratinjau), dan jump rail di samping form panjang dengan lima grup atau lebih (aturan DK-21; brief engagement) · footer Cancel lalu Save (primary terakhir). Layout detail: sidebar menciut. Menambah atau mengubah data selalu berupa halaman, bukan drawer (aturan DK-01). Dipakai form brief dan segmen Marketing, form Data & Integration, dan Konfigurasi laporan. Rekaman laporan masalah, permintaan engagement, atau brief baca-saja adalah halaman detail (aturan DK-18: dua kolom; laporan masalah tiga panel seperti Customer 360, yang kanan untuk hold).'), SK([[0, 'grid-column:1/-1;height:12px'], [1, 'grid-column:1/-1;height:12px'], [2, 'grid-column:1/-1;height:44px'], [3, 'grid-column:1/-1;height:12px']])],
    [B('Sign in', 'Masuk'), B('Full screen, two halves: glass story panel with a slow aura (left) · form (right). Under 960 px the story panel sits on top; phones show it compact.', 'Layar penuh, dua bagian: panel cerita kaca dengan aura perlahan (kiri) · form (kanan). Di bawah 960 px panel cerita di atas; ponsel menampilkannya ringkas.'), SK([[0, 'height:64px'], [1, 'grid-column:2/4;height:64px;background:var(--color-surface-neutral-primary)']])],
    [B('Summary column + workspace', 'Kolom ringkasan + area kerja'), B('Narrow left column of summary cards (description, count, one action that opens a drawer) · wide working area on the right. Used by Reports.', 'Kolom kiri sempit berisi kartu ringkasan (deskripsi, jumlah, satu aksi yang membuka drawer) · area kerja lebar di kanan. Dipakai Laporan.'), SK([[0, 'height:20px'], [1, 'grid-column:2/4;grid-row:1/4;height:100%'], [2, 'height:20px'], [3, 'height:20px']])],
    [B('Documentation', 'Dokumentasi'), B('Sticky contents with search (left, no card frame) + section cards. Used by Design System.', 'Daftar isi menempel dengan pencarian (kiri, tanpa bingkai card) + card section. Dipakai Design System.'), SK([[0, 'height:64px'], [1, 'grid-column:2/4;height:64px']])],
  ];
  return (
    <DsSec id="layouts" title={B('Page layouts', 'Tata letak halaman')} lead={B('Every page uses one of these layouts (rule DK-15).', 'Setiap halaman memakai salah satu tata letak ini (aturan DK-15).')}>
      <div className="dslay">{items.map(([a, b, sk]) => <div className="dsl2" key={a}><div className="dssk">{sk}</div><span className="fw6">{a}</span><span className="mut">{b}</span></div>)}</div>
      <DsTo p="detail-layout" />
      <DsDemo label={B('Detail layout: DetailLayout, DetailPanel, DetailSummary (Opportunity detail and Signal rule detail, rule DT-05)', 'Tata letak detail: DetailLayout, DetailPanel, DetailSummary (detail Peluang dan detail Signal rule, aturan DT-05)')}>
        <DetailLayout panel={<DetailPanel label={B('Entity panel', 'Panel entitas')}
          head={<div className="c3id"><div className="c3av"><Icon name="rule" /></div><h2>{B('Idle cash > 30 days', 'Dana menganggur > 30 hari')}</h2><span className="c3sub">SRL-001 · {B('Investment Opportunity', 'Peluang Investasi')}</span></div>}
          body={<><DetailItem label={B('Business objective', 'Tujuan bisnis')}>{B('Reach customers whose cash is idle.', 'Jangkau customer dengan dana menganggur.')}</DetailItem><DetailItem label={B('Validity', 'Masa berlaku')}>{B('Always', 'Selalu')}</DetailItem></>}
          note={B('Published versions are never overwritten.', 'Versi terbit tidak pernah ditimpa.')} />}>
          <DetailSummary label={B('Summary', 'Ringkasan')} icon="check_circle" intent="success" kicker={B('Lifecycle', 'Siklus')} title={B('Active', 'Aktif')}
            badges={<Badge label={B('Ready', 'Siap')} {...badgeProps('status', 'active')} />}
            facts={<><DetailItem label={B('Version', 'Versi')}>v2</DetailItem><DetailItem label={B('Owner', 'Pemilik')}><UserName name="Sam Rivera" /></DetailItem></>}
            next={<div className="odnx none"><Icon name="info" /><span className="mut">{B('Live. Evaluated in the daily run.', 'Aktif. Dievaluasi dalam daily run.')}</span></div>} />
          <div className="c3tabs"><Tabs items={[['ov', B('Overview', 'Ikhtisar')], ['lg', B('Logic', 'Logika')]]} active="ov" size="md" /></div>
        </DetailLayout>
      </DsDemo>
      <DsDemo label={B('Detail layout with the narrow column on the right: side="right" and a stack of cards (Signal rule detail, rule DT-06)', 'Tata letak detail dengan kolom sempit di kanan: side="right" dan tumpukan kartu (detail Signal rule, aturan DT-06)')}>
        <DetailLayout side="right" panel={<div className="odside">
          <DetailPanel label={B('Entity panel', 'Panel entitas')} head={<div className="c3id"><div className="c3av"><Icon name="rule" /></div><h2>{B('Idle cash > 30 days', 'Dana menganggur > 30 hari')}</h2><span className="c3sub">SRL-001</span></div>} body={<DetailItem label={B('Business objective', 'Tujuan bisnis')}>{B('Reach customers whose cash is idle.', 'Jangkau customer dengan dana menganggur.')}</DetailItem>} />
          <Card title={B('Validity', 'Masa berlaku')} body={<p className="srv">{B('Always', 'Selalu')}</p>} />
        </div>}>
          <DetailSummary label={B('Summary', 'Ringkasan')} icon="check_circle" intent="success" kicker={B('Lifecycle', 'Siklus')} title={B('Active', 'Aktif')}
            facts={<><DetailItem label={B('Version', 'Versi')}>v2</DetailItem><DetailItem label={B('Owner', 'Pemilik')}><UserName name="Sam Rivera" /></DetailItem></>} />
          <div className="c3tabs"><Tabs items={[['ov', B('Overview', 'Ikhtisar')], ['lg', B('Logic', 'Logika')]]} active="ov" size="md" /></div>
        </DetailLayout>
      </DsDemo>
      <DsDemo label={B('Three panels: third (the panel on the left, the content in the centre, a card on the right), as Customer 360 and the Problem report (rule DK-18)', 'Tiga panel: third (panel di kiri, konten di tengah, card di kanan), seperti Customer 360 dan Problem report (aturan DK-18)') + ' · DetailLayout'}>
        <DetailLayout third={<Card title={B('Hold this report', 'Tahan laporan ini')} body={<p className="mut">{B('A held report is not exported until the hold is lifted.', 'Laporan yang ditahan tidak diekspor sampai hold dilepas.')}</p>} />}
          panel={<DetailPanel label={B('Entity panel', 'Panel entitas')} head={<div className="c3id"><div className="c3av"><Icon name="bug_report" /></div><h2>{B('Held', 'Ditahan')}</h2><span className="c3sub">RPT-0001</span></div>} body={<DetailItem label={B('Type', 'Jenis')}>{B('Something is wrong', 'Ada yang salah')}</DetailItem>} />}>
          <Card title={B('The report', 'Laporan')} body={<p className="mut">{B('The content in the centre column.', 'Konten di kolom tengah.')}</p>} />
        </DetailLayout>
      </DsDemo>
      <DsApi rows={[['DetailLayout({panel,children,side,third})', "side: 'left' | 'right'; third: node", 'left', B('right puts the wide column first and the panel (a DetailPanel or an .odside stack of cards) on the right.', 'right menaruh kolom lebar di depan dan panel (DetailPanel atau tumpukan kartu .odside) di kanan.')]]} />
    </DsSec>
  );
}

type DemoItem = { k: string; icon: string; label: string; kids?: DemoItem[]; cnt?: string };
const navHas = (it: DemoItem, cur: string): boolean => !!it.kids && it.kids.some((c) => c.k === cur || navHas(c, cur));

/** Prototype dsNavDemo(): two SideNav renderings (expanded and collapsed) over the same groups; clicking a leaf marks it as current. */
function NavDemo() {
  const B = useB();
  const { t } = usePrefs();
  const [cur, setCur] = useState('d-aff');
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const L = (k: string, icon: string, kids?: DemoItem[], cnt?: string): DemoItem => ({ k: 'd-' + k, icon, label: t('dsn.' + k), kids, cnt });
  const G: { label: string; items: DemoItem[] }[] = [
    { label: '', items: [L('home', 'home')] },
    { label: t('dsn.work'), items: [L('opps', 'lightbulb', [L('all', ''), L('mine', ''), L('dis', '')], '12'), L('cust', 'groups', [L('list', ''), L('long', ''), L('seg', '', [L('pri', ''), L('aff', ''), L('mass', '')])])] },
    { label: t('dsn.ins'), items: [L('an', 'insights'), L('rep', 'summarize')] },
  ];
  const nav = (label: string, ns: string, cls?: string) => {
    const item = (it: DemoItem, lv: number): ReactNode => {
      const on = it.k === cur, has = !on && navHas(it, cur);
      const body = (<>{lv === 1 ? <Icon name={it.icon || 'circle'} /> : null}<span className="lbl">{midText(it.label)}</span>{it.cnt ? <Chip label={it.cnt} selected hidden title={it.cnt} /> : null}</>);   // as the real sidebar (SB-34 label cut in the middle, SB-23 count chip)
      if (it.kids && it.kids.length && lv < 3) {
        const id = ns + ':' + it.k, ex = id in open ? open[id]! : has;
        return (
          <div className={`nvp l${lv}`} key={it.k}>
            <button type="button" className={`nvi nvt l${lv}${has ? ' has-on' : ''}`} aria-expanded={ex} title={it.label} onClick={() => setOpen((o) => ({ ...o, [id]: !ex }))}>{body}<span className="nvc"><Icon name="expand_more" /></span></button>
            <div className="nvk" role="group" aria-label={it.label} hidden={!ex}>{it.kids.map((c) => item(c, lv + 1))}</div>
          </div>
        );
      }
      return <a key={it.k} href="#/design" className={`nvi l${lv}${on ? ' on' : ''}`} aria-current={on ? 'true' : undefined} title={it.label} onClick={(e) => { e.preventDefault(); setCur(it.k); }}>{body}</a>;
    };
    return (
      <nav className={`nav${cls ? ' ' + cls : ''}`} aria-label={label}>
        {G.map((g, i) => (
          <div key={i} className={`ng${g.label ? '' : ' ng0'}`} role={g.label ? 'group' : undefined} aria-label={g.label || undefined}>
            {g.label ? <div className="ngt" aria-hidden="true">{g.label}</div> : null}
            {g.items.map((it) => item(it, 1))}
          </div>
        ))}
      </nav>
    );
  };
  return <div className="dsnavw" id="dsnav-demo">{nav(B('Sidebar example', 'Contoh sidebar'), 'demo')}<div className="coll">{nav(B('Collapsed sidebar example', 'Contoh sidebar menyempit'), 'democ', 'ncoll')}</div></div>;
}

const STEP_VARIANTS: { v: 'chevron' | 'segment' | 'numbered' | 'icon' | 'status'; en: string; id: string; steps: string[] }[] = [
  { v: 'chevron', en: 'Chevron', id: 'Chevron', steps: ['Business type', 'Business detail', 'Your details', 'Verification'] },
  { v: 'segment', en: 'Segment', id: 'Segmen', steps: ['Business type', 'Business detail', 'Your details', 'Bank details', 'Statement', 'Verification'] },
  { v: 'numbered', en: 'Numbered', id: 'Bernomor', steps: ['Business type', 'Business details', 'Your details', 'Bank details', 'Statement'] },
  { v: 'icon', en: 'Icon', id: 'Ikon', steps: ['Personal info', 'Social accounts', 'Integrations', 'Payment info'] },
  { v: 'status', en: 'Status', id: 'Status', steps: ['Personal info', 'Social accounts', 'Payment info', 'Payment info'] },
];

export function NavSection() {
  const B = useB();
  const { t } = usePrefs();
  const [coll, setColl] = useState(false);
  const [stepAt, setStepAt] = useState<Record<string, number>>({});
  const icons = ['badge', 'share', 'apps', 'payments', 'receipt', 'verified'];
  const stepNote: Record<string, [string, string]> = {
    chevron: ['Arrow tabs. Best for 3 to 4 short steps in a wizard header.', 'Tab berbentuk panah. Cocok untuk 3 sampai 4 langkah pendek di header wizard.'],
    segment: ['A thin bar per step with a radio mark. Compact, fits 5 or 6 steps.', 'Bar tipis per langkah dengan tanda radio. Ringkas, muat 5 atau 6 langkah.'],
    numbered: ['Numbered circles joined by a line, with a label and a support text. The default for long forms such as Add rule.', 'Lingkaran bernomor yang dihubungkan garis, dengan label dan teks pendukung. Default untuk form panjang seperti Tambah rule.'],
    icon: ['An icon per step above one progress bar. Use when each step has a clear symbol.', 'Ikon per langkah di atas satu progress bar. Pakai bila tiap langkah punya simbol yang jelas.'],
    status: ['Step number, title and a written status (Completed, In progress, Pending). Use when status words matter.', 'Nomor langkah, judul, dan status tertulis (Selesai, Sedang diisi, Menunggu). Pakai bila kata status penting.'],
  };

  const P = (children: ReactNode) => <p className="mut">{children}</p>;
  const jn = [B('Performance summary', 'Ringkasan kinerja'), B('What happened?', 'Apa yang terjadi?'), B('What was done?', 'Apa yang dilakukan?')];
  return (
    <DsSec id="nav" title={B('Navigation & shell', 'Navigasi & shell')} lead={B('Sidebar is expanded on list and overview pages and collapses on detail pages (opportunity, customer); hovering a collapsed sidebar expands it over the content. On phones it is replaced by the bottom navigation. There is no header: the language toggle, theme and quick access are in the util row of the sidebar footer, and the user button below it opens the user menu with the demo role switcher.', 'Sidebar terbuka di halaman daftar dan ringkasan, dan menyempit di halaman detail (peluang, customer); mengarahkan kursor ke sidebar yang menyempit akan membukanya di atas konten. Di ponsel digantikan bottom navigation. Tidak ada header: toggle bahasa, tema, dan akses cepat ada di baris util footer sidebar, dan tombol user di bawahnya membuka menu pengguna dengan pengalih role demo.')}>
      <p className="mut">{B('On a desktop (1100px and wider) there is no topbar. The sidebar is one screen high (232px, or 68px collapsed): brand, menu, then the footer with the global actions: language, theme and quick access (the scenario button, last, at the far right), and the user button that opens the user menu (Profile, My preferences, Activity history, demo role switcher, Sign out). Below 1100px a topbar (56px, sticky) shows the menu button, the page title and the avatar of the user; the page actions stay in the page head.', 'Di desktop (1100px ke atas) tidak ada topbar. Sidebar setinggi satu layar (232px, atau 68px saat diciutkan): brand, menu, lalu footer berisi aksi global: bahasa, tema, dan akses cepat (tombol scenario, paling akhir, di paling kanan), serta tombol user yang membuka menu user (Profil, Preferensi, Riwayat aktivitas, pengalih role demo, Keluar). Di bawah 1100px ada topbar (56px, sticky) berisi tombol menu, judul halaman, dan avatar user; aksi halaman tetap di page head.')}</p>
      <Rules items={[B('Breadcrumb is small and sits above the page title, never in the header.', 'Breadcrumb kecil dan berada di atas judul halaman, tidak di header.'), B('Back icon appears only on detail pages.', 'Ikon kembali hanya muncul di halaman detail.'), B('Phone: drawers become full screen; touch targets are at least 44 px.', 'Ponsel: drawer menjadi layar penuh; target sentuh minimal 44 px.'), B('Every new page opens at the top; Back (in-app or browser) returns to where the user left the previous page.', 'Setiap halaman baru dibuka dari paling atas; Kembali (di aplikasi atau browser) kembali ke posisi terakhir di halaman sebelumnya.')]} />
      <DsTo p="anchor-nav" />
      <DsH>{B('Jump rail', 'Jump rail')}</DsH>
      <DsDemo label={B('Hover a number to see the group name', 'Arahkan kursor ke angka untuk melihat nama grup') + ' · AnchorNav'}>
        <div className="anv" style={sty('grid-template-columns:64px')}><nav className="anv-nav" style={sty('position:static')}><div className="anv-list">
          {jn.map((n, i) => <Tooltip key={n} placement="right" trigger={<button type="button" className={`anv-b${i ? '' : ' on'}`} aria-label={(i + 1) + '. ' + n}><span className="anv-n">{i + 1}</span><span className="anv-t">{n}</span></button>}>{n}</Tooltip>)}
        </div></nav></div>
      </DsDemo>
      <DsApi rows={[
        ['AnchorNav(key, [[name, html], …])', 'string · groups', '—', B('Renders the sticky numbered rail and the grouped sections (id = key-gN). Clicking scrolls to the group; scroll-spy keeps the current number active. Use for long pages or pages that combine several different tables, with 3–7 groups. Start each group with JumpHead(title, description).', 'Merender rail bernomor menempel dan bagian berkelompok (id = key-gN). Klik menggulir ke grup; scroll-spy menjaga nomor aktif. Pakai untuk halaman panjang atau halaman yang menggabungkan beberapa tabel berbeda, dengan 3–7 grup. Awali tiap grup dengan JumpHead(judul, deskripsi).')],
        ['JumpHead(title, description)', 'string · string', '—', B('Group heading (h2 + one-line description) used at the top of every jump-rail group.', 'Judul grup (h2 + deskripsi satu baris) di awal setiap grup jump rail.')],
      ]} />
      <DsH>{B('Jump rail tools', 'Tools jump rail')}</DsH>
      {P(B("Under the numbered section rail, a second group holds icon buttons for side information that supports the form (data readiness, tips, recent activity). Each opens a drawer; a status dot or a count shows what needs attention. On phones the tools sit at the right end of the rail.", "Di bawah rail bernomor, grup kedua berisi tombol ikon untuk informasi pendukung form (kesiapan data, tips, aktivitas terbaru). Masing-masing membuka drawer; titik status atau angka menunjukkan yang perlu perhatian. Di ponsel, tools berada di ujung kanan rail."))}
      <DsApi rows={[['AnchorNav(key,groups,tools)', 'tools: HTML of the .anv-tools group', '—', B('Optional third argument; renders inside the sticky nav.', 'Argumen ketiga opsional; dirender di dalam nav sticky.')]]} />
      <DsTo p="wizard" />
      <DsH>{B('Step form (Wizard)', 'Form bertahap (Wizard)')}</DsH>
      {P(B("Use a stepper to split a long form into steps. Pick one variant per product and keep it. Each step is a button, so the user can go back and forth freely; the current step has aria-current, finished steps show a check, and a step with an error turns red. Phone: the row scrolls sideways.", "Pakai stepper untuk memecah form panjang menjadi beberapa langkah. Pilih satu varian per produk dan konsisten. Tiap langkah adalah tombol, sehingga user bebas maju mundur; langkah aktif memakai aria-current, langkah selesai menampilkan centang, dan langkah yang punya error menjadi merah. Ponsel: baris bisa digeser ke samping."))}
      {STEP_VARIANTS.map((s) => {
        const id = 'dsst-' + s.v;
        return (
          <DsDemo key={s.v} label={B(s.en, s.id) + ' · Wizard variant=' + s.v}>
            <Wizard id={id} variant={s.v} cur={Math.min(stepAt[id] ?? 1, s.steps.length - 1)} onStep={(i) => setStepAt((o) => ({ ...o, [id]: i }))}
              steps={s.steps.map((label, i) => ({ label, sub: s.v === 'segment' ? '' : B('Support text', 'Teks pendukung'), icon: icons[i] }))} />
            {P(B(stepNote[s.v]![0], stepNote[s.v]![1]))}
          </DsDemo>
        );
      })}
      {STEP_VARIANTS.map((s) => (
        <DsDemo key={'err-' + s.v} label={B('Step with an error', 'Langkah dengan error') + ' · Wizard variant=' + s.v + ' err'}>
          <Wizard id={'dsst-err-' + s.v} variant={s.v} cur={2} steps={s.steps.map((label, i) => ({ label, sub: s.v === 'segment' ? '' : B('Support text', 'Teks pendukung'), icon: icons[i], err: i === 1 }))} />
        </DsDemo>
      ))}
      <DsDemo label={B('Read-only status (the proposal card of a Signal rule, rule DT-07)', 'Status baca-saja (kartu usulan Signal rule, aturan DT-07)') + ' · Wizard variant=status readOnly'}>
        <Wizard id="dsst-ro" variant="status" cur={1} readOnly steps={[{ label: B('Draft', 'Draft') }, { label: B('Proposed', 'Diusulkan') }, { label: B('Active', 'Terbit') }]} />
        {P(B('The steps are not buttons: use it where the stepper only shows where something is.', 'Langkahnya bukan tombol: pakai bila stepper hanya menunjukkan posisi.'))}
      </DsDemo>
      <DsDemo label={B('Steps as a column, read only', 'Langkah sebagai kolom, hanya baca') + ' · Wizard variant=vertical readOnly'}>
        <Wizard id="dsst-vert" variant="vertical" cur={2} readOnly steps={[{ label: B('Request received', 'Permintaan diterima'), sub: '10 Nov 2026 · Sam Rivera' }, { label: B('Under review', 'Sedang ditinjau'), sub: B('Waiting for the reviewer', 'Menunggu peninjau') }, { label: B('Approved', 'Disetujui'), sub: B('Not yet', 'Belum') }]} />
        {P(B('A column of steps with a note under each label; the finished steps have the brand line.', 'Kolom langkah dengan catatan di bawah label; langkah selesai memakai garis brand.'))}
      </DsDemo>
      <DsApi rows={[['Wizard({id,variant,steps,cur,act,readOnly})', 'variant: chevron | segment | numbered | icon | status | vertical', 'numbered', B('steps: [{label, sub, icon, err}]. act receives data-i (index) and data-k (id). readOnly: the steps are not buttons (no click, no tab stop).', 'steps: [{label, sub, icon, err}]. act menerima data-i (indeks) dan data-k (id). readOnly: langkah bukan tombol (tanpa klik, tanpa tab stop).')]]} />
      <DsTo p="sidebar" />
      <DsH>{B('Sidebar navigation', 'Navigasi sidebar')}</DsH>
      <DsDemo label={B('Groups, level 2 and level 3 — expanded and collapsed. Click an item or a chevron.', 'Grup, level 2 dan level 3 — terbuka dan menyempit. Klik item atau chevron.') + ' · .nav'}><NavDemo /></DsDemo>
      <DsApi rows={[
        ['SideNav({groups, cur, label, ns, aria, cls})', 'groups: [{label, items}] · item: {k, icon, label, href, badge, act, kids}', 'label Main · ns app · aria page', B('Renders the sidebar. A group with an empty label has no caption (Home). Items with kids become a toggle (button, aria-expanded) with a chevron; kids are level 2, their kids level 3 (deepest). The parent of the current page opens by itself and shows brand text; the user can still close it. Icons only on level 1.', 'Merender sidebar. Grup dengan label kosong tanpa caption (Beranda). Item dengan kids menjadi toggle (button, aria-expanded) dengan chevron; kids adalah level 2, kids-nya level 3 (terdalam). Induk halaman aktif terbuka sendiri dan berteks brand; pengguna tetap bisa menutupnya. Ikon hanya di level 1.')],
        ['navGroups()', '—', '—', B('Builds the app groups from the role menu (ROLES[role].nav) and NAVGRP; consecutive items of the same group share one caption.', 'Membentuk grup aplikasi dari menu role (ROLES[role].nav) dan NAVGRP; item berurutan dalam grup yang sama berbagi satu caption.')],
      ]} />
      <DsH>{B('Collapse button (SidebarToggle)', 'Tombol ciut (SidebarToggle)')}</DsH>
      <DsDemo label={B('Collapse button', 'Tombol ciut') + ' · SidebarToggle'}>
        <div className="dsedge"><SidebarToggle collapsed={coll} label={t('hdr.sidebar')} onToggle={() => setColl((v) => !v)} /><span className="mut">{coll ? B('Collapsed: icons only', 'Diciutkan: hanya ikon') : B('Expanded', 'Diperluas')}</span></div>
      </DsDemo>
      <DsApi rows={[
        ['SidebarToggle({collapsed, label, onToggle})', 'collapsed: boolean', '—', B('Round 24px button on the right edge of a positioned container. The icon points to the action (chevron_left to collapse, chevron_right to expand). aria-label = label (hdr.sidebar), aria-expanded = !collapsed. Hidden on mobile, where the sidebar is off-canvas.', 'Tombol bulat 24px di tepi kanan container berposisi. Ikon menunjuk aksinya (chevron_left untuk menciutkan, chevron_right untuk memperluas). aria-label = label (hdr.sidebar), aria-expanded = !collapsed. Disembunyikan di mobile, tempat sidebar off-canvas.')],
      ]} />
      <DsDo
        dos={[B('Item height 32px (level 2: 30px, padding-left 40px); group titles uppercase, text-tertiary.', 'Tinggi item 32px (level 2: 30px, padding-left 40px); judul grup huruf kapital, text-tertiary.'), B('Keep global actions in the sidebar footer: util row, a divider, then the user button.', 'Taruh aksi global di footer sidebar: baris util, garis pemisah, lalu tombol user.'), B('No divider between groups when expanded; collapsed shows the divider.', 'Tanpa garis pemisah antar grup saat diperluas; saat diciutkan garis tampil.')]}
        donts={[B('Do not add a topbar or put global actions back in the page.', 'Jangan menambah topbar atau menaruh aksi global di halaman.'), B('Do not scroll the page because of the sidebar; only the menu list scrolls.', 'Jangan membuat halaman scroll karena sidebar; hanya daftar menu yang scroll.')]} />
      <Rules items={[B('Order: Home first, then the daily work of the role, then administration or appearance, then insights (Analytics, Reports).', 'Urutan: Beranda dulu, lalu pekerjaan harian role, lalu administrasi atau tampilan, lalu wawasan (Analitik, Laporan).'), B('Group captions use the caption style (small, uppercase, wide letter spacing, neutral soft) and are not links.', 'Caption grup memakai gaya caption (kecil, huruf besar, spasi huruf lebar, netral lembut) dan bukan tautan.'), B('Use level 2 only when a menu has 2–6 sub-pages of equal weight; use level 3 only inside a level 2 parent. Never deeper; for more, use tabs or the jump rail inside the page.', 'Pakai level 2 hanya bila menu punya 2–6 sub-halaman setara; level 3 hanya di dalam induk level 2. Tidak lebih dalam; selebihnya pakai tab atau jump rail di dalam halaman.'), B('Collapsed: captions become a thin divider and sub-items are hidden; hovering the sidebar expands it with captions and open sub-items. Phone: the More menu shows the full grouped sidebar; the bottom navigation keeps the first four level-1 items.', 'Menyempit: caption menjadi garis pemisah tipis dan sub-item disembunyikan; mengarahkan kursor membuka sidebar lengkap dengan caption dan sub-item. Ponsel: menu Lainnya menampilkan sidebar lengkap berkelompok; bottom navigation tetap empat item level 1 pertama.')]} />
    </DsSec>
  );
}

export function MobileSection() {
  const B = useB();
  return (
    <DsSec id="mobile" title={B('Mobile', 'Mobile')} lead={B('Under 640 px the app switches to a phone layout. Every feature stays reachable.', 'Di bawah 640 px aplikasi beralih ke tata letak ponsel. Semua fitur tetap bisa dijangkau.')}>
      <Rules items={[B('Bottom navigation shows the first four menu items of the role and a More button that opens the full grouped menu as an off-canvas panel.', 'Bottom navigation menampilkan empat menu pertama role dan tombol Lainnya yang membuka menu lengkap berkelompok sebagai panel geser.'), B('Drawers become full screen; footer buttons wrap.', 'Drawer menjadi layar penuh; tombol footer turun ke baris berikut.'), B('Label/value pairs stack (label above value).', 'Pasangan label/nilai bertumpuk (label di atas nilai).'), B('Tables keep their columns and scroll horizontally inside their card; the page itself never scrolls sideways.', 'Tabel mempertahankan kolom dan scroll horizontal di dalam card; halaman tidak pernah bergeser ke samping.'), B('Touch targets are at least 44 px; hover-only behaviour (sidebar expand) is disabled on touch screens.', 'Target sentuh minimal 44 px; perilaku khusus hover (sidebar melebar) dinonaktifkan di layar sentuh.'), B('Page padding is 16 px; page titles are 22 px; the Home mascot is hidden.', 'Padding halaman 16 px; judul halaman 22 px; maskot Home disembunyikan.')]} />
    </DsSec>
  );
}

export function ContentSection() {
  const B = useB();
  return (
    <DsSec id="content" title={B('Content & language', 'Konten & bahasa')} lead={B('English is the default; every string exists in Bahasa Indonesia, which runs 15–30% longer, so labels never have fixed widths.', 'Bahasa Inggris adalah bawaan; setiap teks tersedia dalam Bahasa Indonesia yang 15–30% lebih panjang, sehingga label tidak boleh berlebar tetap.')}>
      <DsDo
        dos={[B('Verb first: "Take action", "Assign to Rizky Pratama".', 'Diawali kata kerja: "Ambil tindakan", "Tugaskan ke Rizky Pratama".'), B('State the result with the same verb: "3 opportunities assigned".', 'Sebutkan hasil dengan kata kerja yang sama: "3 peluang ditugaskan".'), B('Phrase inference as a suggestion and keep the disclaimer near recommendations.', 'Tulis inferensi sebagai saran dan sertakan disclaimer di dekat rekomendasi.')]}
        donts={[B('Use exclamation marks or emoji.', 'Memakai tanda seru atau emoji.'), B('Claim success before the action really completed.', 'Menyatakan berhasil sebelum aksi benar-benar selesai.')]} />
    </DsSec>
  );
}

export function KanbanSection() {
  const B = useB();
  const { t } = usePrefs();
  const cols = ['pending', 'in_progress', 'completed', 'expired'].map((k) => ({ key: k, label: k.replace('_', ' ').replace(/^./, (c) => c.toUpperCase()), ...badgeFor('status', k) }));
  const items = [
    { id: 'k1', st: 'pending', pri: 'high', name: 'Northwind Ltd', desc: B('Review the quarterly figures', 'Tinjau angka kuartalan'), due: B('Due today', 'Jatuh tempo hari ini'), rm: 'Sam Rivera' },
    { id: 'k2', st: 'in_progress', pri: 'medium', name: 'Contoso', desc: B('Prepare the renewal offer', 'Siapkan penawaran perpanjangan'), due: B('In 3 days', '3 hari lagi'), rm: '' },
    { id: 'k3', st: 'completed', pri: 'low', name: 'Alex Morgan', desc: B('Send the final report', 'Kirim laporan akhir'), due: B('2 days ago', '2 hari lalu'), rm: 'Sam Rivera' },
  ];
  const many = Array.from({ length: 8 }, (_, i) => ({ ...items[i % 3]!, id: 'm' + i, st: i < 6 ? 'pending' : 'in_progress' }));
  const card = (x: (typeof items)[number]) => (
    <KanbanCard id={x.id} title={x.name} desc={x.desc} priority={<Badge label={x.pri.replace(/^./, (c) => c.toUpperCase())} {...badgeProps('priority', x.pri)} />} due={x.due} owner={x.rm ? <UserName name={x.rm} /> : <Badge label={t('kb.noOwner')} intent="warning" icon="person_off" />}
      onOpen={() => { window.location.hash = '#/design'; }} openLabel={t('tbl.view')}
      actions={x.st !== 'completed' ? <Button label={t('tbl.take')} type="link" /> : null}
      menu={<Button icon="more_vert" type="transparent" intent="neutral" size="sm" aria={t('tbl.more')} />} />);
  return (
    <DsSec id="kanban" title={B('Kanban board', 'Papan Kanban')} lead={B('Shows records grouped by stage. Stages are advanced by the system, so cards cannot be dragged or moved by hand. Used for the Opportunity list next to the table.', 'Menampilkan data per tahap. Tahap dimajukan oleh sistem, jadi kartu tidak bisa di-drag atau dipindah manual. Dipakai di daftar Opportunity berdampingan dengan tabel.')}>
      <DsH>{B('KanbanBoard and KanbanCard', 'KanbanBoard dan KanbanCard')}</DsH>
      <DsDemo label={B('Board', 'Papan') + ' · KanbanBoard · KanbanCard'}>
        <KanbanBoard columns={cols} items={items} columnOf={(x) => x.st} keyOf={(x) => x.id} emptyText={t('kb.empty')} aria={t('kb.board')} renderCard={card} />
      </DsDemo>
      <DsDemo label={B('Many cards: the board scrolls inside itself and the lane headers stay at its top (rule KB-13)', 'Banyak kartu: papan di-scroll di dalamnya dan header lane tetap di atas (aturan KB-13)') + ' · KanbanBoard --kb-h'}>
        <div style={sty('--kb-h:480px;flex:1 1 100%;min-width:0')}><KanbanBoard columns={cols} items={many} columnOf={(x) => x.st} keyOf={(x) => x.id} emptyText={t('kb.empty')} aria={t('kb.board')} renderCard={card} /></div>
      </DsDemo>
      <DsApi rows={[
        ['KanbanBoard({columns, items, columnOf, keyOf, renderCard, emptyText, aria, fit})', 'columns: {key, label, intent, icon}[] · fit: boolean', '—', B('One lane per column, equal width (min 288px), horizontal scroll. Each lane header is the status Badge (icon from the central map) plus a count pill. An empty lane shows a dashed box with emptyText.', 'Satu lane per kolom, lebar sama (min 288px), scroll horizontal. Header lane berisi Badge status (ikon dari peta pusat) dan jumlah. Lane kosong menampilkan kotak putus-putus berisi emptyText.')],
                ['KanbanBoard · fit and --kb-h', 'fit: boolean · --kb-h: a CSS length', 'fit = false', B('The board scrolls inside itself, both ways, and each lane header (the status Badge and the count) is sticky at its top, so with many cards you always see the stage you are in (rule KB-13). With fit the board takes the room under it in the window (--kb-top is measured, --kb-bot is 16px, or 96px above the bottom bar of a phone) and is never shorter than 420px; --kb-h set on an ancestor gives a fixed limit instead. Without either the board is as tall as its lanes.', 'Papan di-scroll di dalamnya, ke dua arah, dan header tiap lane (Badge status dan jumlah) menempel di atasnya, jadi dengan banyak kartu Anda selalu melihat tahap yang sedang dibaca (aturan KB-13). Dengan fit papan mengambil ruang di bawahnya di jendela (--kb-top diukur, --kb-bot 16px, atau 96px di atas bar bawah ponsel) dan tidak pernah lebih pendek dari 420px; --kb-h di ancestor memberi batas tetap. Tanpa keduanya papan setinggi lane-nya.')],
        ['.tb.tb-stk', 'class on the toolbar', '—', B('The toolbar of a list in Kanban view stays under the top of the window (under the top bar below 1100px) while the page scrolls (rule KB-14). It keeps the page background, so cards never show through it.', 'Toolbar daftar di tampilan Kanban tetap di bawah tepi atas jendela (di bawah top bar di bawah 1100px) saat halaman di-scroll (aturan KB-14). Latarnya sama dengan halaman, jadi kartu tidak terlihat menembusnya.')],
['KanbanCard({id, title, desc, priority, due, owner, actions, menu, onOpen, openLabel})', 'priority, owner, actions, menu: node · onOpen: () => void', '—', B('Title (large, bold), description, priority + due date, owner, then actions on the left and the More menu on the right. With onOpen the whole card is the View action: the title is a real button whose cover fills the card (Enter/Space, hover/active/focus-visible states); Take Action and the More menu sit above the cover and do not trigger it. No shadow, no drag cursor.', 'Judul (besar, tebal), deskripsi, prioritas + jatuh tempo, pemilik, lalu aksi di kiri dan menu More di kanan. Dengan onOpen seluruh kartu adalah aksi View: judul adalah tombol asli yang menutupi kartu (Enter/Space, state hover/active/focus-visible); Take Action dan menu More berada di atas penutup dan tidak memicunya. Tanpa shadow, tanpa kursor drag.')],
      ]} />
      <DsDo
        dos={[B('Show only what is needed to decide: who, what, how urgent, when, who owns it.', 'Tampilkan hanya yang perlu untuk memutuskan: siapa, apa, seberapa mendesak, kapan, siapa pemiliknya.'), B('Use the status Badge with its icon in the lane header; nothing pulses.', 'Pakai Badge status berikon di header lane; tidak ada yang berdenyut.'), B('Make the whole card the View action; keep Take Action and More as real buttons.', 'Jadikan seluruh kartu sebagai aksi View; jaga Take Action dan More sebagai tombol asli.')]}
        donts={[B('Do not make cards draggable or add a "move to stage" action.', 'Jangan buat kartu bisa di-drag atau menambah aksi "pindah tahap".'), B('Do not show the score, checkboxes or bulk actions on cards.', 'Jangan tampilkan skor, checkbox, atau aksi massal di kartu.'), B('Do not put a Card inside a lane.', 'Jangan letakkan Card di dalam lane.')]} />
    </DsSec>
  );
}


export function MotionSection({ onVeil }: { onVeil?: () => void }) {
  const B = useB(), [run, setRun] = useState(0), [mrows, setMrows] = useState(5), [mfresh, setMfresh] = useState(0), [mrun, setMrun] = useState(0);
  const P = (children: ReactNode) => <p className="mut">{children}</p>;
  const addRow = () => { setMrows((n) => n + 1); setMfresh(mrows + 1); window.setTimeout(() => setMfresh(0), 1800); };
  return (
    <DsSec id="motion" title={B('Motion', 'Gerak')} lead={B('How the interface moves: between steps, to a target on the page and across the sign-in boundary. All motion is switched off when the system asks for reduced motion.', 'Cara antarmuka bergerak: antar langkah, ke target di halaman, dan melewati batas masuk. Semua gerak dimatikan bila sistem meminta gerak dikurangi.')}>
      <DsH>{B('Motion for steps and jumps', 'Gerak untuk step dan lompatan')}</DsH>
      {P(B("Moving to another step: the content slides 14px in the direction of travel and fades in, one block after another. Go to: the page scrolls smoothly to the target, which gets a short outline highlight. Both are switched off when the system asks for reduced motion.", "Pindah step: isi bergeser 14px sesuai arah dan memudar masuk, blok demi blok. Go to: halaman menggulir halus ke target, yang mendapat sorotan outline singkat. Keduanya dimatikan bila sistem meminta gerak dikurangi."))}
      <DsH>{B('Page transition', 'Transisi halaman')}</DsH>
      {P(B("A brand-colour veil covers the screen when the user crosses the sign-in boundary: it wipes up from the bottom (0.42 s), the page changes underneath while the logo and a short status show, then it wipes away to the top (0.46 s). Used only after a successful sign-in and on sign-out, not between ordinary pages (they fade, see below). Clicks are blocked while it runs; with reduced motion the page changes at once without the veil, and the status is announced to screen readers.", "Tirai berwarna brand menutup layar saat pengguna melewati batas masuk/keluar: menyapu naik dari bawah (0,42 dtk), halaman berganti di baliknya sambil menampilkan logo dan status singkat, lalu menyapu hilang ke atas (0,46 dtk). Hanya dipakai setelah berhasil masuk dan saat keluar, bukan antar halaman biasa (halaman biasa memudar, lihat di bawah). Klik diblokir selama berjalan; dengan reduced motion halaman langsung berganti tanpa tirai, dan status dibacakan ke pembaca layar."))}
      <DsDemo label={B('Page transition', 'Transisi halaman') + ' · pageVeil'}><Button label={B('Play transition', 'Putar transisi')} icon="play_arrow" type="outlined" intent="neutral" onClick={() => onVeil?.()} /></DsDemo>
      <DsApi rows={[['pageVeil(key, swap)', 'key: i18n string · swap: function', '—', B('Covers, runs swap() under the veil, then reveals. Ignored while a transition is running. Tokens: --color-surface-brand-default, --r-card.', 'Menutup, menjalankan swap() di balik tirai, lalu membuka. Diabaikan saat transisi masih berjalan. Token: --color-surface-brand-default, --r-card.')]]} />
      <DsH>{B('Page fade', 'Pudar halaman')}</DsH>
      {P(B("Between ordinary pages the content of the new page fades in over 0.2 s (token --dur-page); the sidebar and the top bar stay. Nothing slides and nothing is shown while the page loads. It stands still when the system asks for reduced motion and in automated browsers (tests and screenshots), so the screen is always final when it is looked at.", "Antar halaman biasa, isi halaman baru memudar masuk dalam 0,2 dtk (token --dur-page); sidebar dan top bar tetap. Tidak ada yang bergeser dan tidak ada yang ditampilkan saat halaman dimuat. Gerak ini diam saat sistem meminta gerak dikurangi dan di browser otomatis (tes dan screenshot), sehingga layar selalu dalam keadaan akhir saat dilihat."))}
      <DsH>{B('Count-up numbers', 'Angka menghitung')}</DsH>
      {P(B("The numbers of the stat cards, the KPI and the widgets count up from 0 to their value in 0.6 s, once, when they appear (prop animate, on by default; animate={false} shows them at once). The decimals, the grouping and the currency of the text are kept and the last frame is exactly the text it was given; a later change of the value shows at once. Reduced motion and automated browsers show the final value at once.", "Angka pada kartu stat, KPI, dan widget menghitung dari 0 sampai nilainya dalam 0,6 dtk, satu kali, saat tampil (prop animate, aktif secara bawaan; animate={false} menampilkannya langsung). Desimal, pemisah ribuan, dan mata uang pada teks dipertahankan dan frame terakhir persis teks yang diberikan; perubahan nilai sesudahnya tampil langsung. Gerak dikurangi dan browser otomatis menampilkan nilai akhir langsung."))}
      <DsDemo label={B('Count-up', 'Angka menghitung') + ' · animate'}>
        <div key={run} className="rw" style={sty('width:100%;flex-direction:column;align-items:stretch;gap:16px')}>
          <StatCards items={[{ intent: 'brand', n: 1284, label: B('Events', 'Peristiwa'), pct: 100 }, { intent: 'success', n: 912, label: B('Done', 'Selesai'), pct: 71 }, { intent: 'danger', n: 36, label: B('Failed', 'Gagal'), pct: 3 }]} />
          <div className="kpis k4"><KPI label={B('Hit rate', 'Tingkat hit')} n="12.5%" note={B('Decimals are kept', 'Desimal dipertahankan')} /><KPI label={B('Value', 'Nilai')} n="Rp 1,250,000" note={B('Grouping is kept', 'Pemisah ribuan dipertahankan')} intent="success" /></div>
        </div>
        <Button label={B('Replay count-up', 'Putar ulang angka')} icon="play_arrow" type="outlined" intent="neutral" onClick={() => setRun((n) => n + 1)} />
      </DsDemo>
      <DsApi rows={[
        ['StatCards({items, animate}) · KPI({n, animate}) · W*({value, animate})', 'animate: boolean', 'animate=true', B('Counts the first number of a string or number from 0 to its value once, on appearing (0.6 s, ease-out). Other content is drawn as it is. Off for reduced motion and automated browsers.', 'Menghitung angka pertama dari string atau angka dari 0 sampai nilainya satu kali, saat tampil (0,6 dtk, ease-out). Konten lain digambar apa adanya. Mati untuk gerak dikurangi dan browser otomatis.')],
      ]} />
      <DsH>{B('Quick feedback and entrances', 'Umpan balik cepat dan kemunculan')}</DsH>
      {P(B("Small things answer the hand: a button presses in a little (scale 0.98) and its colours ease in 0.12 s; table cells and chips ease their colour. Things that open arrive softly in 0.2 s: a popover rises 4px while it fades in, a toast comes up 8px, the scrim and a centred dialog fade. Three durations (--dur-fast 0.12 s, --dur-base 0.2 s, --dur-slow 0.32 s) and one easing (--ease-out) are the only ones to use; only opacity and transform move.", "Hal kecil menjawab tangan: tombol sedikit menekan (skala 0,98) dan warnanya berubah halus 0,12 dtk; sel tabel dan chip mengubah warna dengan halus. Yang terbuka datang lembut 0,2 dtk: popover naik 4px sambil memudar masuk, toast naik 8px, scrim dan dialog di tengah memudar. Tiga durasi (--dur-fast 0,12 dtk, --dur-base 0,2 dtk, --dur-slow 0,32 dtk) dan satu easing (--ease-out) adalah satu-satunya yang dipakai; hanya opacity dan transform yang bergerak."))}
      <DsDemo label={B('Press, hover and a popover that rises', 'Tekan, hover dan popover yang naik') + ' · .btn · .fpop'}>
        <div className="rw"><Button label={B('Press me', 'Tekan saya')} /><Button label={B('Outlined', 'Outlined')} type="outlined" intent="neutral" /><Chip label={B('Chip', 'Chip')} onClick={() => undefined} /></div>
        <RichSelect id="ds-mo-rs" label={B('Open to see the popover rise', 'Buka untuk melihat popover naik')} ph={B('Select an outcome', 'Pilih hasil')} opts={[{ v: 'a', label: B('Interested', 'Tertarik'), desc: B('The customer wants to go ahead', 'Nasabah ingin melanjutkan'), icon: 'sentiment_very_satisfied', intent: 'success' }, { v: 'b', label: B('Not interested', 'Tidak tertarik'), desc: B('The customer declines', 'Nasabah menolak'), icon: 'sentiment_dissatisfied', intent: 'danger' }]} />
      </DsDemo>
      <DsH>{B('Rows: they appear in turn and a new row glows', 'Baris: muncul bergantian dan baris baru menyala')}</DsH>
      {P(B("The first eight rows of a table fade in one after another (20 ms apart), so a list is not a sudden wall. A row that a save has just changed or made glows in the soft brand colour and fades back in 1.2 s (class mo-new on the row, for about 2 seconds): the Activities list uses it for the activity that was completed and its follow-up.", "Delapan baris pertama tabel memudar masuk bergantian (selang 20 ms), jadi daftar tidak muncul sekaligus. Baris yang baru diubah atau dibuat oleh simpan menyala dengan warna brand lembut dan memudar kembali dalam 1,2 dtk (kelas mo-new pada baris, sekitar 2 detik): list Activities memakainya untuk aktivitas yang selesai dan tindak lanjutnya."))}
      <DsDemo label={B('Rows in turn and a new row', 'Baris bergantian dan baris baru') + ' · .tw tr.mo-new'}>
        <div key={mrun} style={sty('width:100%')}>
          <Table minW={0} head={<><th>{B('Activity', 'Aktivitas')}</th><th>{B('Customer', 'Nasabah')}</th></>} rows={<>{Array.from({ length: mrows }, (_, i) => <tr key={i} className={mfresh === i + 1 ? 'mo-new' : undefined}><td>{B('Call customer', 'Telepon nasabah')} · ACT-{String(i + 1).padStart(4, '0')}</td><td><CustomerName name="Budi Santoso" /></td></tr>)}</>} />
        </div>
        <div className="rw"><Button label={B('Add a row', 'Tambah baris')} icon="add" type="outlined" intent="neutral" onClick={addRow} /><Button label={B('Replay', 'Putar ulang')} icon="play_arrow" type="outlined" intent="neutral" onClick={() => { setMrows(5); setMfresh(0); setMrun((n) => n + 1); }} /></div>
      </DsDemo>
      <DsH>{B('Status: a line that draws, a step that breathes, a check that pops', 'Status: garis yang tergambar, langkah yang bernapas, centang yang muncul')}</DsH>
      {P(B("In the vertical Wizard the brand line under a finished step draws downward (0.32 s) and the step that is waiting has a soft ring that pulses every 2 seconds, the only decorative loop besides the skeleton. The tick of a done screen (state ok) pops in with a small overshoot. No confetti and no sound.", "Pada Wizard vertikal garis brand di bawah langkah yang selesai tergambar ke bawah (0,32 dtk) dan langkah yang menunggu punya cincin lembut yang berdenyut tiap 2 detik, satu-satunya loop dekoratif selain skeleton. Centang layar selesai (state ok) muncul dengan sedikit membal. Tanpa confetti dan tanpa suara."))}
      <DsDemo label={B('A waiting step and a done screen', 'Langkah menunggu dan layar selesai') + ' · Wizard vertical · .state.ok'}>
        <div key={'st' + mrun} className="rw" style={sty('width:100%;align-items:flex-start;gap:32px')}>
          <Wizard id="dsmo-st" variant="vertical" cur={2} readOnly steps={[{ label: B('Customer agreed', 'Nasabah setuju'), sub: '03 Oct 2026' }, { label: B('Email sent', 'Email terkirim'), sub: '03 Oct 2026' }, { label: B('Waiting for confirmation', 'Menunggu konfirmasi'), sub: B('Due 06 Oct 2026', 'Tenggat 06 Okt 2026') }, { label: B('Confirmed', 'Terkonfirmasi'), sub: B('Automatic', 'Otomatis') }]} />
          <div className="state ok s-md" role="status"><Icon name="check_circle" /><h3>{B('Saved', 'Tersimpan')}</h3></div>
        </div>
        <Button label={B('Replay', 'Putar ulang')} icon="play_arrow" type="outlined" intent="neutral" onClick={() => setMrun((n) => n + 1)} />
      </DsDemo>
      <DsH>{B('Charts draw in', 'Grafik tergambar masuk')}</DsH>
      {P(B("A chart draws its series in 0.6 s (ease-out) when it appears; a change of data redraws it the same way. Off with the rest when motion is off.", "Grafik menggambar serinya dalam 0,6 dtk (ease-out) saat muncul; perubahan data menggambarnya ulang dengan cara yang sama. Mati bersama yang lain bila gerak dimatikan."))}
      <DsApi rows={[
        ['--dur-fast · --dur-base · --dur-slow · --ease-out', '0.12 s · 0.2 s · 0.32 s · cubic-bezier(.2,.8,.2,1)', '—', B('The only durations and easing of the interface (the page fade keeps --dur-page 0.2 s). Use them in new CSS; never write a duration by hand.', 'Satu-satunya durasi dan easing antarmuka (fade halaman tetap --dur-page 0,2 dtk). Pakai di CSS baru; jangan tulis durasi manual.')],
        ['.mo-new', 'class on a <tr>', '—', B('The row glows brand-subtle and fades back in 1.2 s. Set it for about 2 seconds after a save that changed or made the row.', 'Baris menyala brand-subtle dan memudar kembali dalam 1,2 dtk. Pasang sekitar 2 detik setelah simpan yang mengubah atau membuat baris.')],
      ]} />
    </DsSec>
  );
}
