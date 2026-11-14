// Design System page: Grid 4px (DS 1.74, rule LY-01 to LY-04). The scale, the rounding rule, the control heights and the line-height tokens are shown with the real components and tokens.
import { Button } from '../../design-system/components/Button';
import { DsDemo, DsH, DsSec, sty, useB } from './ds';

const SCALE = [4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64];
const ROUND: [string, string, string][] = [['11px', '12px', 'nearest'], ['10px', '12px', 'tie: up'], ['14px', '16px', 'tie: up'], ['6px', '8px', 'tie: up'], ['2px', '4px', 'tie: up'], ['33px', '32px', 'nearest'], ['42px', '44px', 'nearest']];
const LH: [string, string, string][] = [['--fs-xs', '--lh-xs', '16px'], ['--fs-sm', '--lh-sm', '20px'], ['--fs-md', '--lh-md', '20px'], ['--fs-lg', '--lh-lg', '24px'], ['--fs-h-sm', '--lh-h-sm', '24px'], ['--fs-h-md', '--lh-h-md', '24px'], ['--fs-h-lg', '--lh-h-lg', '28px'], ['--fs-h-xl', '--lh-h-xl', '32px']];

export function Grid4Section() {
  const B = useB();
  return (
    <DsSec id="grid4" title={B('Grid 4px', 'Grid 4px')} lead={B('Every size, gap, padding, margin, offset and line-height is a multiple of 4px. A value off the grid rounds to the nearest multiple of 4; a tie rounds up. Borders, radius, font size, icon sizes and hairlines are not part of the grid. Checked by tests/unit/grid4.test.ts and tests/e2e/rules/grid4.spec.ts.', 'Semua ukuran, gap, padding, margin, offset, dan line-height adalah kelipatan 4px. Nilai di luar grid dibulatkan ke kelipatan 4 terdekat; bila tepat di tengah, dibulatkan ke atas. Border, radius, ukuran huruf, ukuran ikon, dan garis tipis tidak ikut grid. Dijaga tests/unit/grid4.test.ts dan tests/e2e/rules/grid4.spec.ts.')}>
      <DsH>{B('Spacing scale', 'Skala jarak')}</DsH>
      <div className="dsspace">{SCALE.map((n) => <div key={n}><span className="dsbar" style={{ width: `${n * 2}px` }} /><span className="mut">{n}px · {n / 4} × 4</span></div>)}</div>
      <DsH>{B('Rounding', 'Pembulatan')}</DsH>
      <div className="tw t-sm dsapi dsg4">
        <table style={{ minWidth: 520 }}>
          <thead><tr><th>{B('Off the grid', 'Di luar grid')}</th><th>{B('On the grid', 'Di grid')}</th><th>{B('Rule', 'Aturan')}</th></tr></thead>
          <tbody>{ROUND.map(([a, b, r]) => <tr key={a}><td><code className="dsc">{a}</code></td><td><code className="dsc">{b}</code></td><td className="mut">{r === 'nearest' ? B('nearest multiple of 4', 'kelipatan 4 terdekat') : B('exactly between two: round up', 'tepat di tengah: bulatkan ke atas')}</td></tr>)}</tbody>
        </table>
      </div>
      <DsH>{B('Control heights', 'Tinggi kontrol')}</DsH>
      <DsDemo label={B('Button sm 32 · md 36 · lg 48 (input, select and tab of the same size are as high)', 'Tombol sm 32 · md 36 · lg 48 (input, select, dan tab ukuran sama setinggi itu)')}>
        <div className="rw" style={sty('gap:12px;align-items:center')}>{(['sm', 'md', 'lg'] as const).map((z) => <Button key={z} label={z} size={z} />)}</div>
      </DsDemo>
      <DsH>{B('Line-height tokens', 'Token line-height')}</DsH>
      <p className="mut">{B('Line-height is a px value on the grid or one of these tokens. A unitless line-height is not used. The tokens do not follow the font scale, so the grid holds in every scale.', 'Line-height adalah nilai px di grid atau salah satu token ini. Line-height tanpa satuan tidak dipakai. Token tidak mengikuti skala font, sehingga grid tetap berlaku di setiap skala.')}</p>
      <div className="tw t-sm dsapi dsg4">
        <table style={{ minWidth: 520 }}>
          <thead><tr><th>{B('Font size token', 'Token ukuran huruf')}</th><th>{B('Line-height token', 'Token line-height')}</th><th>px</th><th>{B('Sample', 'Contoh')}</th></tr></thead>
          <tbody>{LH.map(([f, l, px]) => <tr key={l}><td><code className="dsc">{f}</code></td><td><code className="dsc">{l}</code></td><td>{px}</td><td><span style={{ fontSize: `var(${f})`, lineHeight: `var(${l})` }}>{B('Aa Grid sample', 'Aa Contoh grid')}</span></td></tr>)}</tbody>
        </table>
      </div>
      <DsH>{B('Not part of the grid', 'Tidak ikut grid')}</DsH>
      <p className="mut">{B('Border, outline and shadow widths (1px, 2px) · radius · font size · letter-spacing · icon sizes 14 / 18 / 20px (separate decision) · hairlines under 2px · %, vh, vw, em, rem, fr, auto, 0 · transform and animation · images, illustrations and mascot · third-party chart and table sizes · content-driven heights.', 'Lebar border, outline, dan shadow (1px, 2px) · radius · ukuran huruf · letter-spacing · ukuran ikon 14 / 18 / 20px (keputusan terpisah) · garis tipis di bawah 2px · %, vh, vw, em, rem, fr, auto, 0 · transform dan animasi · gambar, ilustrasi, dan maskot · ukuran chart dan tabel pihak ketiga · tinggi dari isi.')}</p>
    </DsSec>
  );
}
