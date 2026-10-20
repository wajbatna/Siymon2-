import type { LucideIcon } from 'lucide-react';
import { PackageSearch } from 'lucide-react';
import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export function EmptyState({
  icon: Icon = PackageSearch,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-14 px-6 rounded-3xl bg-brand-cream/60 border border-dashed border-brand-ink/15', className)}>
      <div className="w-16 h-16 rounded-3xl bg-brand-purple/10 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-brand-purple" aria-hidden />
      </div>
      <h3 className="font-display text-lg font-bold text-brand-ink">{title}</h3>
      {description && <p className="mt-1.5 text-sm text-brand-muted max-w-sm leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = 'Loading…', className }: { label?: string; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 gap-3', className)} role="status">
      <Loader2 className="w-8 h-8 text-brand-purple animate-spin" aria-hidden />
      <p className="text-sm font-medium text-brand-muted">{label}</p>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('rounded-2xl bg-gradient-to-r from-brand-ink/8 via-brand-ink/14 to-brand-ink/8 bg-[length:400px_100%] animate-shimmer', className)}
      aria-hidden
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-3xl bg-white p-3 shadow-soft">
      <Skeleton className="w-full aspect-square rounded-2xl" />
      <Skeleton className="h-4 w-3/4 mt-3" />
      <Skeleton className="h-3 w-1/2 mt-2" />
      <Skeleton className="h-8 w-full mt-3" />
    </div>
  );
}
