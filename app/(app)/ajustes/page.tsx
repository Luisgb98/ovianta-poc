'use client';

import { PlaceholderSection } from '@/components/molecules/placeholder-section';
import { useI18n } from '@/lib/i18n/context';

export default function AjustesPage() {
  const { t } = useI18n();
  return (
    <div className="content-inner">
      <div className="page-head">
        <h1>{t('ajustes.title')}</h1>
        <p className="pdesc">{t('ajustes.subtitle')}</p>
      </div>
      <PlaceholderSection icon="settings" />
    </div>
  );
}
