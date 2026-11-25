// Design System page: Table. The activity-log, list-row and rule-table sections of the Praisindo page are product specific and are not part of the starter.
import { Fragment, type ReactNode } from 'react';
import { Badge } from '../../design-system/components/Badge';
import { Button } from '../../design-system/components/Button';
import { DetailRow } from '../../design-system/components/Card';
import { Pagination } from '../../design-system/components/Pagination';
import { ProductLogo } from '../../design-system/components/ProductLogo';
import { Icon } from '../../design-system/components/Icon';
import { IconTile } from '../../design-system/components/Hints';
import { badgeProps } from '../../domain/badgeIcons';
import { DsDemo, DsH, DsSec, DsTo, sty, useB } from './ds';
import { TBL_LEAD, TBL_RULES } from './dsListData';

/** A plain table in the `tw` wrapper (size by the t-* class of the wrapper: t-sm / t-md / t-lg). */
export function Table({ head, rows, minW = 480 }: { head: ReactNode; rows: ReactNode; minW?: number }) {
  return <div className="tw t-md"><table style={{ minWidth: minW }}><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table></div>;
}
const Rules = ({ items }: { items: readonly (readonly [string, string])[] }) => { const B = useB(); return <ul className="dsrules">{items.map((x) => <li key={x[0]}>{B(x[0], x[1])}</li>)}</ul>; };

const SAMPLE = [['Alex Morgan', 'Review', 'pending', 82], ['Sam Rivera', 'Renewal', 'active', 67], ['Jo Tanaka', 'Onboarding', 'in_progress', 91]] as const;
export function ListsSection() {
  const B = useB();
  return (
    <DsSec id="lists" title={B('List rows', 'Baris daftar')} lead={B('Rows replace small cards inside a section: a leading icon, a bold first line, one muted line and a chevron at the end. A logo in a row is the ProductLogo; a long name in a table cell is cut in the middle.', 'Baris menggantikan kartu kecil di dalam sebuah seksi: ikon di depan, baris pertama tebal, satu baris redup, dan chevron di ujung. Logo di sebuah baris memakai ProductLogo; nama panjang di sel tabel dipotong di tengah.')}>
      <DsDemo label={B('Row with a trailing chevron (rules IC-01 and CD-15)', 'Baris dengan chevron di ujung (aturan IC-01 dan CD-15)') + ' · .li IconTile'}>
        <div className="card" style={sty('max-width:420px')}><div className="cb flush"><div className="li"><IconTile icon="group" /><div className="m"><span className="t">Alex Morgan</span><span className="mut">{B('Review the quarterly figures', 'Tinjau angka kuartalan')}</span></div><Icon name="chevron_right" /></div></div></div>
      </DsDemo>
      <DsDemo label={B('Logo of an issuer or a product (rule PD-07)', 'Logo penerbit atau produk (aturan PD-07)') + ' · ProductLogo'}>
        <div className="rw" style={sty('gap:16px;align-items:center')}>{(['sm', 'md', 'lg'] as const).map((z) => <ProductLogo key={z} size={z} name="Acme Fund" />)}</div>
      </DsDemo>
      <DsDemo label={B('A long name in a table cell: at most 320px, the middle cut with an ellipsis, the last word stays (rule TB-20)', 'Nama panjang di sel tabel: maksimal 320px, bagian tengah dipotong dengan elipsis, kata terakhir tetap tampil (aturan TB-20)') + ' · .tcl .mid'}>
        <div className="tcl"><ProductLogo size="sm" name="Acme Fund" /><span><a href="#/design" className="btn b-link i-neutral s-md" title="Acme International Growth and Income Fund Class B"><span className="mid"><span className="mid-s">Acme International Growth and Income Fund Class</span><span className="mid-e"> B</span></span></a><div className="mut">AF-D02</div></span></div>
      </DsDemo>
    </DsSec>
  );
}

export function TablesSection() {
  const B = useB();
  return (
    <DsSec id="tables" title={B('Table', 'Tabel')} lead={B(TBL_LEAD[0], TBL_LEAD[1])}>
      <DsDemo label={B('Basic table', 'Tabel dasar') + ' · .tw > table'}><div style={sty('flex:1 1 100%;min-width:0')}><Table minW={480}
        head={<><th>{B('Name', 'Nama')}</th><th>{B('Type', 'Jenis')}</th><th>{B('Status', 'Status')}</th><th className="num">{B('Score', 'Skor')}</th></>}
        rows={SAMPLE.map(([n, ty, st, sc]) => <tr key={n}><td>{n}</td><td>{ty}</td><td><Badge label={st.replace('_', ' ')} {...badgeProps('status', st)} /></td><td className="num">{sc}</td></tr>)} /></div></DsDemo>
      <DsH>{B('Table with rows that open', 'Tabel dengan baris yang bisa dibuka')}</DsH>
      <DsDemo label={B('Rows that open: a button in the first column opens the row under it', 'Baris yang bisa dibuka: tombol di kolom pertama membuka baris di bawahnya') + ' · Table Button expanded'}>
        <Table minW={480}
          head={<><th className="srx-c"><span className="sr-only">{B('Actions', 'Aksi')}</span></th><th>{B('Name', 'Nama')}</th><th>{B('Status', 'Status')}</th></>}
          rows={<>{[false, true].map((o) => <Fragment key={String(o)}>
            <tr><td className="srx-c"><Button icon={o ? 'expand_less' : 'expand_more'} type="transparent" intent="neutral" size="sm" aria={o ? B('Hide details', 'Sembunyikan rincian') : B('Show details', 'Tampilkan rincian')} expanded={o} controls={'dsx-' + o} /></td><td><span className="fw6">{o ? 'Sam Rivera' : 'Alex Morgan'}</span></td><td><Badge label={B('New', 'Baru')} {...badgeProps('status', 'new')} /></td></tr>
            {o ? <tr id="dsx-true" className="srx-d"><td colSpan={3}><div className="srbm"><DetailRow label={B('Reason', 'Alasan')}>{B('The reason of this row.', 'Alasan baris ini.')}</DetailRow></div></td></tr> : null}</Fragment>)}</>} />
      </DsDemo>
      <DsTo p="pagination" />
      <DsDemo label={B('Pagination', 'Paginasi') + ' · Pagination'}><div style={{ width: '100%' }}><Pagination total={200} start={90} shown={10} pages={20} page={10} rpp={10} size="md" /></div></DsDemo>
      <DsTo p="table" />
      <DsH>{B('Rules', 'Aturan')}</DsH>
      <Rules items={TBL_RULES} />
    </DsSec>
  );
}
