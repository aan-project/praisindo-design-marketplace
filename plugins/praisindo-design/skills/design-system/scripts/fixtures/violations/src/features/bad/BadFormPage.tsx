// FIXTURE for scripts/audit-selftest.mjs (DK-27): a form page with ONE Card, GroupTitle captions for the groups and Cancel / Save as the footer of that Card. Never copy this file.
import { PageHeader } from '../../app/shell/PageHead';
import { Button } from '../../design-system/components/Button';
import { Card, GroupTitle } from '../../design-system/components/Card';
import { Input } from '../../design-system/components/Field';
import { FormShell } from '../shared/FormShell';

export function BadFormPage({ cancel, save }: { cancel: () => void; save: () => void }) {
  const body = (<>
    <GroupTitle text="Company" />
    <Input id="bf-n" label="Name" req />
    <GroupTitle text="Contact" />
    <Input id="bf-e" label="Email" opt />
  </>);
  return (
    <>
      <PageHeader crumbs={[]} title="Add supplier" sub="Register a company." onBack={cancel} backLabel="Back" />
      <Card title="Supplier details" body={body} footer={<><Button label="Cancel" type="transparent" intent="neutral" onClick={cancel} /><Button label="Save supplier" onClick={save} /></>} />
    </>);
}

// DK-29 fixture: a Cancel button in the footer of a FormShell
export const BadShell = ({ leave, save }: { leave: () => void; save: () => void }) => <FormShell title="Add" sub="x" parents={[]} crumb="Add" dirty onLeave={leave} tips={['x']} footer={() => <><Button label="Cancel" type="transparent" intent="neutral" onClick={leave} /><Button label="Save" onClick={save} /></>} />;
