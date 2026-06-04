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
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div className="flex max-w-form flex-col items-center gap-2">
        <div className="mb-2 grid size-16 place-items-center rounded-[18px] bg-accent text-accent-foreground">
          <Icon name={icon} size={30} />
        </div>
        <h2 className="text-xl font-[650] tracking-snug">{t('placeholder.soon')}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{t('placeholder.desc')}</p>
      </div>
    </div>
  );
}
