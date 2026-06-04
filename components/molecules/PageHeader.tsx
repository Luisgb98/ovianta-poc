import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  title: ReactNode;
  description?: string;
  className?: string;
};

export function PageHeader({ title, description, className }: Props) {
  return (
    <div className={cn('mb-6', className)}>
      <h1 className="text-heading font-bold tracking-heading">{title}</h1>
      {description && <p className="mt-1 text-body-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
