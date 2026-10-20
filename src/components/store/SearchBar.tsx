import { useMemo, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';
import { useDataStore } from '@/store/useDataStore';
import { cn } from '@/utils/cn';
import { formatMoney } from '@/utils/format';

export function SearchBar({ className, autoFocus = false, onNavigate }: { className?: string; autoFocus?: boolean; onNavigate?: () => void }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const products = useDataStore((s) => s.products);
  const navigate = useNavigate();
  const boxRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return products
      .filter((p) => p.available && (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)))
      .slice(0, 6);
  }, [query, products]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
    onNavigate?.();
  };

  return (
    <div ref={boxRef} className={cn('relative', className)}>
      <form onSubmit={submit} role="search">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted pointer-events-none" aria-hidden />
        <input
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 160)}
          type="search"
          aria-label="Search food and restaurants"
          placeholder="Search burgers, tagine, sushi…"
          className="w-full h-11 rounded-2xl border-2 border-brand-ink/10 bg-brand-cream/70 pl-11 pr-10 text-sm text-brand-ink placeholder:text-brand-muted/80 focus:outline-none focus:border-brand-purple focus:bg-white transition-colors [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-brand-muted hover:text-brand-ink"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>
      {open && suggestions.length > 0 && (
        <div className="absolute z-40 mt-2 w-full rounded-2xl bg-white shadow-lift border border-brand-ink/8 overflow-hidden animate-scale-in">
          {suggestions.map((p) => (
            <button
              key={p.id}
              onMouseDown={() => {
                setOpen(false);
                navigate(`/product/${p.id}`);
                onNavigate?.();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-brand-cream/70 transition-colors text-left"
            >
              <SmartImage src={p.image} alt={p.name} className="w-10 h-10 rounded-xl shrink-0" />
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-brand-ink truncate">{p.name}</span>
                <span className="block text-xs text-brand-muted">{formatMoney(p.price)}</span>
              </span>
              <Search className="w-3.5 h-3.5 text-brand-muted/60" aria-hidden />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
