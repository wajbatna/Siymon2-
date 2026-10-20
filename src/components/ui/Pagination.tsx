import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PaginationProps {
  page: number;
  pages: number;
  onChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, pages, onChange, className }: PaginationProps) {
  if (pages <= 1) return null;
  const nums: (number | '…')[] = [];
  for (let i = 1; i <= pages; i += 1) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i);
    else if (nums[nums.length - 1] !== '…') nums.push('…');
  }
  return (
    <nav className={cn('flex items-center gap-1', className)} aria-label="Pagination">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
        className="p-2 rounded-xl text-brand-muted hover:bg-brand-ink/5 disabled:opacity-40 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {nums.map((n, idx) =>
        n === '…' ? (
          <span key={`e${idx}`} className="px-1.5 text-brand-muted text-sm">
            …
          </span>
        ) : (
          <button
            key={n}
            onClick={() => onChange(n)}
            aria-current={n === page ? 'page' : undefined}
            className={cn(
              'min-w-9 h-9 px-2 rounded-xl text-sm font-semibold transition-colors',
              n === page ? 'bg-brand-purple text-white shadow-glow' : 'text-brand-muted hover:bg-brand-ink/5',
            )}
          >
            {n}
          </button>
        ),
      )}
      <button
        onClick={() => onChange(Math.min(pages, page + 1))}
        disabled={page === pages}
        aria-label="Next page"
        className="p-2 rounded-xl text-brand-muted hover:bg-brand-ink/5 disabled:opacity-40 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
