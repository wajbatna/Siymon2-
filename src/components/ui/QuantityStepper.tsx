import { Minus, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function QuantityStepper({ value, onChange, min = 0, max = 99, size = 'md', className }: QuantityStepperProps) {
  const btn = cn(
    'flex items-center justify-center rounded-xl text-brand-ink transition-colors hover:bg-brand-purple/10 hover:text-brand-purple disabled:opacity-40 disabled:hover:bg-transparent',
    size === 'sm' ? 'w-7 h-7' : 'w-9 h-9',
  );
  return (
    <div className={cn('inline-flex items-center gap-1 rounded-2xl border-2 border-brand-ink/10 bg-white p-1', className)}>
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} aria-label="Decrease quantity" disabled={value <= min}>
        <Minus className="w-4 h-4" />
      </button>
      <span className={cn('text-center font-bold text-brand-ink tabular-nums', size === 'sm' ? 'w-7 text-sm' : 'w-9')}>{value}</span>
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} aria-label="Increase quantity" disabled={value >= max}>
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
