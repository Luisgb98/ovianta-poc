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
    <div
      className={cn(
        'flex justify-between gap-3 border-t border-border px-5 py-[11px] text-[13.5px]',
        noBorderTop && 'border-t-0'
      )}
    >
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('text-right font-[550] break-words', valueClassName)}>{value}</span>
    </div>
  );
}
