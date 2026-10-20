import { Link } from 'react-router-dom';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { SmartImage } from '@/components/ui/SmartImage';
import type { Category } from '@/types';
import { cn } from '@/utils/cn';

export function CategoryCard({ category, compact = false }: { category: Category; compact?: boolean }) {
  if (compact) {
    return (
      <Link
        to={`/category/${category.slug}`}
        className="group flex flex-col items-center gap-2.5 min-w-[5.5rem] focus-visible:outline-none"
      >
        <span
          className="w-[5.5rem] h-[5.5rem] rounded-3xl overflow-hidden relative shadow-soft group-hover:shadow-lift group-hover:-translate-y-1 transition-all duration-300"
          style={{ backgroundColor: `${category.color}22` }}
        >
          <SmartImage src={category.image} alt={category.name} className="absolute inset-0" imgClassName="group-hover:scale-110" />
          <span className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 to-transparent" />
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-xl bg-white/95 flex items-center justify-center shadow-soft" style={{ color: category.color }}>
            <CategoryIcon name={category.icon} className="w-5 h-5" />
          </span>
        </span>
        <span className="text-xs font-bold text-brand-ink text-center group-hover:text-brand-purple transition-colors">{category.name}</span>
      </Link>
    );
  }
  return (
    <Link
      to={`/category/${category.slug}`}
      className={cn('group relative rounded-3xl overflow-hidden shadow-soft hover:shadow-lift transition-all h-40')}
    >
      <SmartImage src={category.image} alt={category.name} className="absolute inset-0" imgClassName="group-hover:scale-105" />
      <span className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-navy/25 to-transparent" />
      <span className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <span className="font-display font-bold text-white">{category.name}</span>
        <span className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center text-white">
          <CategoryIcon name={category.icon} className="w-4 h-4" />
        </span>
      </span>
    </Link>
  );
}
