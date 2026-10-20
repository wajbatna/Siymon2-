import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Rating({ value, count, size = 'sm', className }: { value: number; count?: number; size?: 'sm' | 'md'; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <Star className={cn('fill-brand-yellow text-brand-yellow', size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4')} aria-hidden />
      <span className={cn('font-bold text-brand-ink', size === 'sm' ? 'text-xs' : 'text-sm')}>{value.toFixed(1)}</span>
      {count !== undefined && <span className={cn('text-brand-muted', size === 'sm' ? 'text-xs' : 'text-sm')}>({count})</span>}
    </span>
  );
}
