import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { ProductCard } from '@/components/store/ProductCard';
import { SearchBar } from '@/components/store/SearchBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Select } from '@/components/ui/Field';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useDataStore } from '@/store/useDataStore';
import { cn } from '@/utils/cn';

type SortKey = 'relevance' | 'rating' | 'price-asc' | 'price-desc' | 'popular';

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const [sort, setSort] = useState<SortKey>((params.get('sort') as SortKey) || 'relevance');
  const [category, setCategory] = useState<string>('all');
  const [page, setPage] = useState(1);
  const { products, categories, restaurants, hydrated } = useDataStore();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => p.available);
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (restaurants.find((r) => r.id === p.restaurantId)?.name.toLowerCase().includes(q) ?? false),
      );
    }
    if (category !== 'all') list = list.filter((p) => p.categoryId === category);
    const sorted = [...list];
    switch (sort) {
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        sorted.sort((a, b) => b.ratingCount - a.ratingCount);
        break;
      default:
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return sorted;
  }, [products, restaurants, query, category, sort]);

  const pageSize = 12;
  const pages = Math.max(1, Math.ceil(results.length / pageSize));
  const safePage = Math.min(page, pages);
  const pageItems = results.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <SectionHeader
        title={query ? `Results for “${query}”` : 'Explore the full menu'}
        subtitle={`${results.length} dish${results.length === 1 ? '' : 'es'} available · search, filter and sort`}
      />
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center mb-8">
        <SearchBar className="flex-1" />
        <div className="flex gap-3">
          <Select
            aria-label="Filter by category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="w-44"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
          <Select
            aria-label="Sort results"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as SortKey);
              setParams((p) => {
                p.set('sort', e.target.value);
                return p;
              }, { replace: true });
              setPage(1);
            }}
            className="w-44"
          >
            <option value="relevance">Recommended</option>
            <option value="popular">Most ordered</option>
            <option value="rating">Top rated</option>
            <option value="price-asc">Price: low → high</option>
            <option value="price-desc">Price: high → low</option>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 -mx-4 px-4 lg:mx-0 lg:px-0">
        <button
          onClick={() => { setCategory('all'); setPage(1); }}
          className={cn('px-4 h-9 rounded-full text-xs font-bold whitespace-nowrap transition-colors', category === 'all' ? 'bg-brand-purple text-white' : 'bg-white text-brand-muted hover:text-brand-purple')}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => { setCategory(c.id); setPage(1); }}
            className={cn('px-4 h-9 rounded-full text-xs font-bold whitespace-nowrap transition-colors', category === c.id ? 'bg-brand-purple text-white' : 'bg-white text-brand-muted hover:text-brand-purple')}
          >
            {c.name}
          </button>
        ))}
      </div>

      {hydrated && results.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No dishes matched"
          description="Try a different keyword, or clear the category filter to see the whole menu."
          action={
            <button onClick={() => { setParams({}); setCategory('all'); }} className="text-sm font-bold text-brand-purple hover:underline">
              Clear all filters
            </button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {pageItems.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="mt-8 flex justify-center">
            <Pagination page={safePage} pages={pages} onChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}
