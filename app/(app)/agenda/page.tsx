'use client';

import { PlaceholderSection } from '@/components/molecules/placeholder-section';
import { PageLayout } from '@/components/templates/PageLayout';
import { PageHeader } from '@/components/molecules/PageHeader';
import { useI18n } from '@/lib/i18n/context';

export default function AgendaPage() {
  const { t } = useI18n();
  return (
    <PageLayout>
      <PageHeader title={t('agenda.title')} description={t('agenda.subtitle')} />
      <PlaceholderSection icon="calendar" />
    </PageLayout>
  );
}
