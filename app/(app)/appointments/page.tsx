import { getServerT } from '@/lib/i18n/server';
import { PlaceholderSection } from '@/components/molecules/placeholder-section';
import { PageLayout } from '@/components/templates/PageLayout';
import { PageHeader } from '@/components/molecules/PageHeader';

export default async function AppointmentsPage() {
  const { t } = await getServerT();
  return (
    <PageLayout>
      <PageHeader title={t('appointments.title')} description={t('appointments.subtitle')} />
      <PlaceholderSection icon="stethoscope" />
    </PageLayout>
  );
}
