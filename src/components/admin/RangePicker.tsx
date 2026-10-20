import type { RangeKey } from '@/services/analyticsService';
import { cn } from '@/utils/cn';

const OPTIONS: { key: RangeKey; label: string }[] = [
  { key: '7d', label: '7 days' },
  { key: '30d', label: '30 days' },
  { key: '90d', label: '90 days' },
  { key: 'all', label: 'All time' },
];

export function RangePicker({ value, onChange }: { value: RangeKey; onChange: (r: RangeKey) => void }) {
  return (
    <div className="inline-flex p-1 rounded-2xl bg-white shadow-soft" role="tablist" aria-label="Date range">
      {OPTIONS.map((o) => (
        <button
          key={o.key}
          role="tab"
          aria-selected={value === o.key}
          onClick={() => onChange(o.key)}
          className={cn(
            'px-3.5 h-9 rounded-xl text-xs font-bold transition-colors',
            value === o.key ? 'bg-brand-purple text-white shadow-glow' : 'text-brand-muted hover:text-brand-purple',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
