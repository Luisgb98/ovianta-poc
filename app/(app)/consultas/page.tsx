'use client';

import { Icon } from '@/components/atoms/icon';
import { useI18n } from '@/lib/i18n/context';

export default function ConsultasPage() {
  const { t } = useI18n();
  return (
    <div className="content-inner">
      <div className="page-head">
        <h1>{t('consultas.title')}</h1>
        <p className="pdesc">{t('consultas.subtitle')}</p>
      </div>
      <div className="placeholder-wrap">
        <div className="placeholder-inner">
          <div className="placeholder-ic">
            <Icon name="stethoscope" size={30} />
          </div>
          <h2>{t('placeholder.soon')}</h2>
          <p>{t('placeholder.desc')}</p>
        </div>
      </div>
    </div>
  );
}
