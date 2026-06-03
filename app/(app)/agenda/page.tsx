'use client';

import { PlaceholderSection } from '@/components/molecules/placeholder-section';
import { useI18n } from '@/lib/i18n/context';

export default function AgendaPage() {
  const { t } = useI18n();
  return (
    <div className="content-inner">
      <div className="page-head">
        <h1>{t('agenda.title')}</h1>
        <p className="pdesc">{t('agenda.subtitle')}</p>
      </div>
      <PlaceholderSection icon="calendar" />
    </div>
  );
}
