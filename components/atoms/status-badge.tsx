import type { PatientStatus } from '@/src/modules/patients/domain/patient';
import type { TranslationKey } from '@/lib/i18n/translations';

interface StatusBadgeProps {
  status: PatientStatus;
  t: (key: TranslationKey) => string;
}

export function StatusBadge({ status, t }: StatusBadgeProps) {
  const showDot = status !== 'cancelada';
  return (
    <span className={`badge badge-${status}`}>
      {showDot && <span className="dot" />}
      {t(`status.${status}` as TranslationKey)}
    </span>
  );
}
