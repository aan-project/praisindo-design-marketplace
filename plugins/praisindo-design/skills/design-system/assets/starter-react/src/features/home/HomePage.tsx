// PLACEHOLDER home page. Replace it with the product's home; keep the page head (breadcrumb, title, one-line description) and build with the DS components.
import { usePrefs } from '../../app/providers/PrefsProvider';
import { PageHeader } from '../../app/shell/PageHead';
import { Card } from '../../design-system/components/Card';
import { EmptyState } from '../../design-system/components/States';

export function HomePage() {
  const { t } = usePrefs();
  return (
    <>
      <PageHeader crumbs={[['#/home', t('nav.home')]]} title={t('nav.home')} sub={t('shell.homeSub')} />
      <Card title={t('shell.homeCard')} body={<EmptyState size="md" title={t('shell.homeEmptyT')} desc={t('shell.homeEmptyD')} />} />
    </>
  );
}
