// Show / hide columns drawer of a list table (rules TB-07, TB-11, BT-01, BT-02). The first and the action column are fixed (ticked, disabled); every other column has a
// checkbox; Reset restores the defaults; Apply closes. The page stores the choice per table with lib/colPrefs (key app.cols.<table>).
import { usePrefs } from '../../../app/providers/PrefsProvider';
import { Button } from '../../../design-system/components/Button';
import { Drawer } from '../../../design-system/components/Drawer';
import type { ColState } from '../../../lib/colPrefs';

export interface ColumnsDrawerProps { first?: string; last?: string; cols: readonly { k: string; label: string }[]; state: ColState; onToggle: (k: string, on: boolean) => void; onReset: () => void; onClose: () => void }
export function ColumnsDrawer({ first, last, cols, state, onToggle, onReset, onClose }: ColumnsDrawerProps) {
  const { t } = usePrefs();
  return (
    <Drawer title={t('tbl.colsT')} size="sm" closeLabel={t('ex.close')} onClose={onClose}
      footer={<><Button label={t('tbl.reset')} type="transparent" intent="neutral" onClick={onReset} /><Button label={t('tbl.apply')} onClick={onClose} /></>}>
      {first ? <label className="chk"><input type="checkbox" checked disabled readOnly />{first}</label> : null}
      {cols.map((c) => <label className="chk" key={c.k}><input type="checkbox" checked={!!state[c.k]} onChange={(e) => onToggle(c.k, e.target.checked)} />{c.label}</label>)}
      {last ? <label className="chk"><input type="checkbox" checked disabled readOnly />{last}</label> : null}
    </Drawer>);
}
