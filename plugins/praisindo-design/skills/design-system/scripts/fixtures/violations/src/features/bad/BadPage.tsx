// FIXTURE for scripts/audit-selftest.mjs: every pattern check of the audit must find its violation here. Never copy this file.
import { Alert } from '../../design-system/components/Alert';
import { Button, LinkButton } from '../../design-system/components/Button';
import { Badge } from '../../design-system/components/Badge';
import { Card } from '../../design-system/components/Card';
import { Input } from '../../design-system/components/Field';
import { Drawer } from '../../design-system/components/Drawer';

export function BadPage() {
  return (
    <>
      <Alert intent="warning" text="This page lists the orders." />
      <Card title="New order" body={<>
        <Input id="a" label="Order name" />
        <div className="fld"><label htmlFor="b">Amount<span className="req" aria-hidden="true">*</span></label><input id="b" /></div>
      </>} />
      <div className="tw t-md"><table><tbody><tr>
        <td className="fr"><div className="acts">
          <LinkButton label="View" href="#/x" type="transparent" />
          <Button label="Edit" type="transparent" />
          <Button label="Copy" type="transparent" />
          <Button icon="more_vert" type="transparent" intent="neutral" />
        </div></td>
      </tr></tbody></table></div>
      <Select id="bad-sel" label="Type" opts={[]} />
      <SegmentedControl id="bad-seg" label="Category" req items={[['a', 'A'], ['b', 'B']]} />
      <Drawer title="Add customer" onClose={() => {}} footer={<Button label="Save" />}><Input id="bad-n" label="Name" req /><Input id="bad-e" label="Email" opt /></Drawer>
      <Drawer title="Columns" onClose={() => {}} footer={<Button label="Done" />}>x</Drawer>
    </>);
}

// RN-01 fixture: names from before DS 2.76 / 2.79
export function OldNames() { return <div className="sgt" style={{ color: 'var(--color-foreground-neutral-subtle-4)' }}><SegToggle id="old" items={[]} /></div>; }

// GN-03 and GN-05 fixtures
export const BadBadge = () => <Badge label="Active" intent="success" />;
export const badMotion = { transition: 'opacity 300ms ease' };
