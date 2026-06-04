'use client';

import { PlaceholderSection } from '@/components/molecules/placeholder-section';
import { PageLayout } from '@/components/templates/PageLayout';
import { PageHeader } from '@/components/molecules/PageHeader';
import { useI18n } from '@/lib/i18n/context';

export default function SchedulePage() {
  const { t } = useI18n();
  return (
    <PageLayout>
      <PageHeader title={t('schedule.title')} description={t('schedule.subtitle')} />
      <PlaceholderSection icon="calendar" />
    </PageLayout>
  );
}
