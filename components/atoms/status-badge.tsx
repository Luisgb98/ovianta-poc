'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n/context';
import type { PatientStatus } from '@/src/modules/patients/domain/patient';
import type { TranslationKey } from '@/lib/i18n/translations';

/** Distinct hues: blue = active, green = done, amber = pending, red = cancelled */
const statusStyles: Record<PatientStatus, string> = {
  active: [
    'border-[color-mix(in_oklch,var(--info)_32%,transparent)]',
    'bg-[color-mix(in_oklch,var(--info)_16%,transparent)]',
    'text-info',
    'dark:border-[color-mix(in_oklch,var(--info)_42%,transparent)]',
    'dark:bg-[color-mix(in_oklch,var(--info)_24%,transparent)]',
  ].join(' '),
  pending: [
    'border-[color-mix(in_oklch,var(--warning)_40%,transparent)]',
    'bg-[color-mix(in_oklch,var(--warning)_28%,transparent)]',
    'text-[color-mix(in_oklch,var(--warning)_62%,var(--foreground))]',
    'dark:border-[color-mix(in_oklch,var(--warning)_48%,transparent)]',
    'dark:bg-[color-mix(in_oklch,var(--warning)_22%,transparent)]',
    'dark:text-warning',
  ].join(' '),
  completed: [
    'border-[color-mix(in_oklch,var(--success)_38%,transparent)]',
    'bg-[color-mix(in_oklch,var(--success)_20%,transparent)]',
    'text-[color-mix(in_oklch,var(--success)_78%,black)]',
    'dark:border-[color-mix(in_oklch,var(--success)_42%,transparent)]',
    'dark:bg-[color-mix(in_oklch,var(--success)_24%,transparent)]',
    'dark:text-success',
  ].join(' '),
  cancelled: [
    'border-[color-mix(in_oklch,var(--destructive)_28%,transparent)]',
    'bg-[color-mix(in_oklch,var(--destructive)_12%,transparent)]',
    'text-destructive',
    'dark:border-[color-mix(in_oklch,var(--destructive)_34%,transparent)]',
    'dark:bg-[color-mix(in_oklch,var(--destructive)_18%,transparent)]',
  ].join(' '),
};

function StatusDot({ pulse }: { pulse?: boolean }) {
  if (pulse) {
    return (
      <span className="relative flex size-1.5 shrink-0" aria-hidden>
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-40" />
        <span className="relative size-1.5 rounded-full bg-current" />
      </span>
    );
  }
  return <span className="size-1.5 shrink-0 rounded-full bg-current" aria-hidden />;
}

interface StatusBadgeProps {
  status: PatientStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useI18n();
  const showDot = status !== 'cancelled';

  return (
    <Badge
      variant="outline"
      className={cn(
        'h-6 gap-1.5 rounded-full px-2.5 text-[11px] leading-none font-semibold',
        statusStyles[status],
        className
      )}
    >
      {showDot && <StatusDot pulse={status === 'active'} />}
      {t(`status.${status}` as TranslationKey)}
    </Badge>
  );
}
