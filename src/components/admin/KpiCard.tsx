import type { LucideIcon } from 'lucide-react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/utils/cn';

export function KpiCard({
  icon: Icon,
  label,
  value,
  delta,
  hint,
  tone = 'purple',
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  tone?: 'purple' | 'yellow' | 'green' | 'blue' | 'red';
}) {
  const tones = {
    purple: 'bg-brand-purple/10 text-brand-purple',
    yellow: 'bg-brand-yellow/25 text-[#B26A00]',
    green: 'bg-success/10 text-success',
    blue: 'bg-info/10 text-info',
    red: 'bg-danger/10 text-danger',
  };
  return (
    <div className="bg-white rounded-3xl p-5 shadow-soft hover:shadow-card transition-shadow">
      <div className="flex items-start justify-between">
        <span className={cn('w-11 h-11 rounded-2xl flex items-center justify-center', tones[tone])}>
          <Icon className="w-5 h-5" aria-hidden />
        </span>
        {delta !== undefined && (
          <span className={cn('inline-flex items-center gap-1 text-xs font-extrabold', delta >= 0 ? 'text-success' : 'text-danger')}>
            {delta >= 0 ? <TrendingUp className="w-3.5 h-3.5" aria-hidden /> : <TrendingDown className="w-3.5 h-3.5" aria-hidden />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-2xl font-extrabold text-brand-ink tabular-nums">{value}</p>
      <p className="text-xs font-semibold text-brand-muted mt-0.5">{label}</p>
      {hint && <p className="text-[11px] text-brand-muted/70 mt-1">{hint}</p>}
    </div>
  );
}
