import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function SectionHeader({
  title,
  subtitle,
  action,
  className,
  dark = false,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={cn('flex items-end justify-between gap-4 mb-5', className)}>
      <div>
        <h2 className={cn('font-display text-xl sm:text-2xl font-extrabold tracking-tight', dark ? 'text-white' : 'text-brand-ink')}>
          {title}
        </h2>
        {subtitle && <p className={cn('mt-1 text-sm', dark ? 'text-white/60' : 'text-brand-muted')}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
