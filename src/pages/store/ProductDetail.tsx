import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, Clock, Flame, ShoppingCart, Star } from 'lucide-react';
import { ProductCard } from '@/components/store/ProductCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Textarea } from '@/components/ui/Field';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { Rating } from '@/components/ui/Rating';
import { SmartImage } from '@/components/ui/SmartImage';
import { useCartStore } from '@/store/useCartStore';
import { useDataStore } from '@/store/useDataStore';
import { toast } from '@/store/useToastStore';
import { useUiStore } from '@/store/useUiStore';
import { cn } from '@/utils/cn';
import { formatMoney } from '@/utils/format';

export function ProductDetail() {
  const { id } = useParams();
  const { products, restaurants, categories } = useDataStore();
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useUiStore((s) => s.setCartOpen);

  const product = products.find((p) => p.id === id);
  const [sizeId, setSizeId] = useState<string | null>(null);
  const [extraIds, setExtraIds] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');

  const effectiveSizeId = sizeId ?? product?.sizes[0]?.id ?? null;
  const size = product?.sizes.find((s) => s.id === effectiveSizeId);
  const extras = product?.extras.filter((e) => extraIds.includes(e.id)) ?? [];

  const unitPrice = useMemo(() => {
    if (!product) return 0;
    return product.price + (size?.delta ?? 0) + extras.reduce((s, e) => s + e.price, 0);
  }, [product, size, extras]);

  const related = useMemo(
    () => products.filter((p) => p.id !== product?.id && p.categoryId === product?.categoryId && p.available).slice(0, 4),
    [products, product],
  );

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <EmptyState title="Product not found" description="It may have been removed from the demo catalog." action={<Link to="/home" className="text-sm font-bold text-brand-purple hover:underline">Back to home</Link>} />
      </div>
    );
  }

  const restaurant = restaurants.find((r) => r.id === product.restaurantId);
  const category = categories.find((c) => c.id === product.categoryId);

  const addToCart = () => {
    addItem(product, { size, extras, qty, notes: notes.trim() || undefined });
    toast.success(`${qty} × ${product.name} added to cart`);
    setCartOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <Link to={`/category/${category?.slug ?? 'burgers'}`} className="inline-flex items-center gap-1 text-sm font-bold text-brand-muted hover:text-brand-purple mb-6">
        <ChevronLeft className="w-4 h-4" aria-hidden /> {category?.name ?? 'Menu'}
      </Link>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
        <div className="relative">
          <SmartImage src={product.image} alt={product.name} className="w-full aspect-square rounded-[2rem] shadow-card" eager />
          {product.oldPrice && (
            <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-danger text-white text-xs font-extrabold">
              SAVE {Math.round((1 - product.price / product.oldPrice) * 100)}%
            </span>
          )}
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-purple">{restaurant?.name}</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-brand-ink leading-tight">{product.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-brand-muted">
            <Rating value={product.rating} count={product.ratingCount} size="md" />
            <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4" aria-hidden /> {product.prepTime} min prep</span>
            {product.calories && <span className="inline-flex items-center gap-1.5"><Flame className="w-4 h-4" aria-hidden /> {product.calories} kcal</span>}
          </div>
          <p className="mt-5 text-brand-muted leading-relaxed">{product.description}</p>

          <div className="mt-6">
            <p className="font-display text-3xl font-extrabold text-brand-ink">
              {formatMoney(unitPrice)}
              {product.oldPrice && <span className="ml-2 text-base font-semibold text-brand-muted line-through">{formatMoney(product.oldPrice)}</span>}
            </p>
          </div>

          {product.sizes.length > 1 && (
            <fieldset className="mt-7">
              <legend className="text-sm font-bold text-brand-ink mb-2.5">Size</legend>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSizeId(s.id)}
                    aria-pressed={effectiveSizeId === s.id}
                    className={cn(
                      'px-4 h-10 rounded-2xl border-2 text-sm font-semibold transition-all',
                      effectiveSizeId === s.id ? 'border-brand-purple bg-brand-purple/8 text-brand-purple' : 'border-brand-ink/10 text-brand-muted hover:border-brand-purple/40',
                    )}
                  >
                    {s.label} {s.delta > 0 && <span className="text-xs">+{formatMoney(s.delta)}</span>}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {product.extras.length > 0 && (
            <fieldset className="mt-6">
              <legend className="text-sm font-bold text-brand-ink mb-2.5">Extras & toppings</legend>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {product.extras.map((e) => {
                  const checked = extraIds.includes(e.id);
                  return (
                    <label
                      key={e.id}
                      className={cn(
                        'flex items-center justify-between gap-3 px-4 h-11 rounded-2xl border-2 cursor-pointer transition-all text-sm font-semibold',
                        checked ? 'border-brand-purple bg-brand-purple/8 text-brand-purple' : 'border-brand-ink/10 text-brand-muted hover:border-brand-purple/40',
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => setExtraIds((ids) => (checked ? ids.filter((i) => i !== e.id) : [...ids, e.id]))}
                          className="w-4 h-4 accent-[#7650E8]"
                        />
                        {e.label}
                      </span>
                      {e.price > 0 && <span className="text-xs">+{formatMoney(e.price)}</span>}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <QuantityStepper value={qty} onChange={setQty} min={1} max={20} />
            <Button size="lg" onClick={addToCart} disabled={!product.available} className="flex-1 min-w-52">
              <ShoppingCart className="w-5 h-5" aria-hidden />
              Add to cart · {formatMoney(unitPrice * qty)}
            </Button>
          </div>

          <div className="mt-6">
            <label htmlFor="instructions" className="text-sm font-bold text-brand-ink block mb-2">Special instructions</label>
            <Textarea
              id="instructions"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="No onions, extra crispy, cut in halves…"
              maxLength={200}
            />
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-brand-muted">
            <Star className="w-3.5 h-3.5 text-brand-yellow fill-brand-yellow" aria-hidden />
            Demo product — images and prices are illustrative only.
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-brand-ink mb-5">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
