import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InfoRowProps {
  label: ReactNode;
  value: ReactNode;
  valueClassName?: string;
  noBorderTop?: boolean;
}

export function InfoRow({ label, value, valueClassName, noBorderTop }: InfoRowProps) {
  return (
    <div className={cn('info-row', noBorderTop && '[border-top:0]')}>
      <span className="k">{label}</span>
      <span className={cn('v', valueClassName)}>{value}</span>
    </div>
  );
}
