'use client';

import { PlaceholderSection } from '@/components/molecules/placeholder-section';
import { PageLayout } from '@/components/templates/PageLayout';
import { PageHeader } from '@/components/molecules/PageHeader';
import { useI18n } from '@/lib/i18n/context';

export default function SettingsPage() {
  const { t } = useI18n();
  return (
    <PageLayout>
      <PageHeader title={t('settings.title')} description={t('settings.subtitle')} />
      <PlaceholderSection icon="settings" />
    </PageLayout>
  );
}
