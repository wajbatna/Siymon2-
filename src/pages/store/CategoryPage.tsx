import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, PackageSearch } from 'lucide-react';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input, Select } from '@/components/ui/Field';
import { Pagination } from '@/components/ui/Pagination';
import { ProductCard } from '@/components/store/ProductCard';
import { useDataStore } from '@/store/useDataStore';
import { assetUrl } from '@/utils/assets';

type SortKey = 'recommended' | 'rating' | 'price-asc' | 'price-desc';

export function CategoryPage() {
  const { slug } = useParams();
  const { categories, products, restaurants, hydrated } = useDataStore();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('recommended');
  const [page, setPage] = useState(1);

  const category = categories.find((c) => c.slug === slug);
  const restaurant = restaurants.find((r) => r.id === products.find((p) => p.categoryId === category?.id)?.restaurantId);

  const list = useMemo(() => {
    if (!category) return [];
    const q = query.trim().toLowerCase();
    let items = products.filter((p) => p.categoryId === category.id && p.available);
    if (q) items = items.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    const sorted = [...items];
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    if (sort === 'recommended') sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.ratingCount - a.ratingCount);
    return sorted;
  }, [category, products, query, sort]);

  if (!category) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <EmptyState
          title="Category not found"
          description="This category may have been renamed or removed in the demo data."
          action={<Link to="/home" className="text-sm font-bold text-brand-purple hover:underline">Back to home</Link>}
        />
      </div>
    );
  }

  const pageSize = 8;
  const pages = Math.max(1, Math.ceil(list.length / pageSize));
  const safePage = Math.min(page, pages);
  const pageItems = list.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div>
      <section className="relative h-52 sm:h-64 overflow-hidden bg-brand-navy">
        <img src={assetUrl(category.image)} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-brand-navy/50 to-brand-navy/20" />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 h-full flex flex-col justify-end pb-6">
          <Link to="/home" className="inline-flex items-center gap-1 text-xs font-bold text-white/70 hover:text-white mb-3 w-fit">
            <ChevronLeft className="w-3.5 h-3.5" aria-hidden /> Back to home
          </Link>
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 rounded-2xl bg-white/12 backdrop-blur flex items-center justify-center text-white border border-white/20">
              <CategoryIcon name={category.icon} className="w-6 h-6" />
            </span>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">{category.name}</h1>
              <p className="text-sm text-white/65 mt-0.5">{list.length} dishes{restaurant ? ` · from ${restaurant.name} & friends` : ''}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder={`Search in ${category.name}…`}
            aria-label={`Search in ${category.name}`}
            className="sm:max-w-xs"
          />
          <div className="flex-1" />
          <Select aria-label="Sort dishes" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="sm:w-52">
            <option value="recommended">Recommended</option>
            <option value="rating">Top rated</option>
            <option value="price-asc">Price: low → high</option>
            <option value="price-desc">Price: high → low</option>
          </Select>
        </div>

        {hydrated && pageItems.length === 0 ? (
          <EmptyState icon={PackageSearch} title="No dishes found" description="Nothing matches your search inside this category yet." />
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
      </section>
    </div>
  );
}
