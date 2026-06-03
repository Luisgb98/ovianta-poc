'use client';

import { Icon } from '@/components/atoms/icon';
import type { IconName } from '@/components/atoms/icon';
import { useI18n } from '@/lib/i18n/context';

interface PlaceholderSectionProps {
  icon: IconName;
}

export function PlaceholderSection({ icon }: PlaceholderSectionProps) {
  const { t } = useI18n();
  return (
    <div className="placeholder-wrap">
      <div className="placeholder-inner">
        <div className="placeholder-ic">
          <Icon name={icon} size={30} />
        </div>
        <h2>{t('placeholder.soon')}</h2>
        <p>{t('placeholder.desc')}</p>
      </div>
    </div>
  );
}
