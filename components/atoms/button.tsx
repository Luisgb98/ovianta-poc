import { Button as UIButton, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

const customVariants = {
  tab: 'h-auto rounded-md px-4 py-[7px] text-[13px] font-medium text-muted-foreground hover:bg-transparent hover:text-foreground aria-pressed:bg-card aria-pressed:text-foreground aria-pressed:shadow-xs',
  menu: 'h-auto w-full justify-start gap-2.5 px-2.5 py-2 text-[13.5px] font-normal text-popover-foreground aria-pressed:text-primary aria-pressed:font-semibold',
} as const;

type UIProps = ComponentProps<typeof UIButton>;
type Variant = NonNullable<UIProps['variant']> | keyof typeof customVariants;

function Button({
  variant,
  className,
  ...props
}: Omit<UIProps, 'variant'> & { variant?: Variant }) {
  if (variant && variant in customVariants) {
    return (
      <UIButton
        variant="ghost"
        className={cn(customVariants[variant as keyof typeof customVariants], className)}
        {...props}
      />
    );
  }
  return <UIButton variant={variant as UIProps['variant']} className={className} {...props} />;
}

export { Button, buttonVariants };
