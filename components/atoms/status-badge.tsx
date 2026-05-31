'use client';

import { useI18n } from '@/lib/i18n/context';
import type { PatientStatus } from '@/src/modules/patients/domain/patient';
import type { TranslationKey } from '@/lib/i18n/translations';

interface StatusBadgeProps {
  status: PatientStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useI18n();
  const showDot = status !== 'cancelada';
  return (
    <span className={`badge badge-${status}`}>
      {showDot && <span className="dot" />}
      {t(`status.${status}` as TranslationKey)}
    </span>
  );
}
