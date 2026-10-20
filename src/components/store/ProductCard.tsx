import { Link, useNavigate } from 'react-router-dom';
import { Clock, Heart, Plus } from 'lucide-react';
import { Rating } from '@/components/ui/Rating';
import { SmartImage } from '@/components/ui/SmartImage';
import { useCartStore } from '@/store/useCartStore';
import { useDataStore } from '@/store/useDataStore';
import { toast } from '@/store/useToastStore';
import type { Product } from '@/types';
import { cn } from '@/utils/cn';
import { formatMoney } from '@/utils/format';

const TAG_LABELS: Record<string, { label: string; className: string }> = {
  popular: { label: 'Popular', className: 'bg-brand-purple text-white' },
  new: { label: 'New', className: 'bg-info text-white' },
  bestseller: { label: 'Best seller', className: 'bg-brand-yellow text-brand-ink' },
  offer: { label: 'Offer', className: 'bg-danger text-white' },
};

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const addItem = useCartStore((s) => s.addItem);
  const restaurants = useDataStore((s) => s.restaurants);
  const navigate = useNavigate();
  const restaurant = restaurants.find((r) => r.id === product.restaurantId);
  const tag = product.tags[0];
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  const quickAdd = () => {
    addItem(product, { size: product.sizes[0], qty: 1 });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <article
      className={cn(
        'group relative rounded-3xl bg-white p-3 shadow-soft hover:shadow-lift hover:-translate-y-1 transition-all duration-300 flex flex-col',
        !product.available && 'opacity-60',
        className,
      )}
    >
      <Link to={`/product/${product.id}`} className="block relative" aria-label={product.name}>
        <SmartImage
          src={product.image}
          alt={product.name}
          className="w-full aspect-square rounded-2xl"
          imgClassName="group-hover:scale-105"
        />
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {tag && (
            <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide', TAG_LABELS[tag].className)}>
              {TAG_LABELS[tag].label}
            </span>
          )}
          {discount > 0 && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/95 text-danger">-{discount}%</span>
          )}
        </div>
        {!product.available && (
          <span className="absolute inset-0 rounded-2xl bg-brand-navy/60 flex items-center justify-center text-white font-bold text-sm">
            Sold out
          </span>
        )}
      </Link>
      <button
        aria-label="Save to favorites"
        onClick={() => toast.info('Favorites are a demo — saved for this session only.')}
        className="absolute top-6 right-6 z-20 w-8 h-8 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center text-brand-muted hover:text-danger transition-colors shadow-soft"
      >
        <Heart className="w-4 h-4" aria-hidden />
      </button>
      <div className="pt-3 px-1 pb-1 flex flex-col flex-1">
        <p className="text-[11px] font-semibold text-brand-muted uppercase tracking-wide truncate">{restaurant?.name ?? 'SIYMON Kitchen'}</p>
        <Link to={`/product/${product.id}`} className="mt-1 font-display font-bold text-brand-ink leading-snug line-clamp-1 hover:text-brand-purple transition-colors">
          {product.name}
        </Link>
        <div className="mt-1.5 flex items-center gap-3 text-xs text-brand-muted">
          <Rating value={product.rating} count={product.ratingCount} />
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" aria-hidden /> {product.prepTime} min
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-brand-ink/6 flex items-center justify-between gap-2">
          <p className="font-display font-extrabold text-brand-ink">
            {formatMoney(product.price)}
            {product.oldPrice && <span className="ml-1.5 text-xs font-semibold text-brand-muted line-through">{formatMoney(product.oldPrice)}</span>}
          </p>
          <button
            onClick={product.available ? quickAdd : () => toast.warning('This product is currently unavailable.')}
            aria-label={`Add ${product.name} to cart`}
            className="relative z-20 w-9 h-9 rounded-xl bg-brand-gradient text-white shadow-glow hover:brightness-110 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          >
            <Plus className="w-5 h-5" aria-hidden />
          </button>
        </div>
      </div>
      <button onClick={() => navigate(`/product/${product.id}`)} className="absolute inset-0 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/60" aria-label={`View ${product.name} details`} tabIndex={-1} />
    </article>
  );
}
