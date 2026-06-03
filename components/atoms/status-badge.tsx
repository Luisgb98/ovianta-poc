'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n/context';
import type { PatientStatus } from '@/src/modules/patients/domain/patient';
import type { TranslationKey } from '@/lib/i18n/translations';

const statusStyles: Record<PatientStatus, string> = {
  activo: 'bg-success/15 text-success border-success/20 hover:bg-success/15',
  pendiente: 'bg-warning/15 text-warning-foreground border-warning/20 hover:bg-warning/15',
  completada: 'bg-secondary text-secondary-foreground border-transparent hover:bg-secondary',
  cancelada: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10',
};

interface StatusBadgeProps {
  status: PatientStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useI18n();
  return (
    <Badge variant="outline" className={cn('gap-1.5', statusStyles[status])}>
      {status !== 'cancelada' && <span className="size-1.5 flex-none rounded-full bg-current" />}
      {t(`status.${status}` as TranslationKey)}
    </Badge>
  );
}
