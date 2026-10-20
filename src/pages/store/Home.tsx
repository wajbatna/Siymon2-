import { Link } from 'react-router-dom';
import { ArrowRight, Bike, Clock, Percent, ShieldCheck, Star } from 'lucide-react';
import { CategoryCard } from '@/components/store/CategoryCard';
import { ProductCard } from '@/components/store/ProductCard';
import { RestaurantCard } from '@/components/store/RestaurantCard';
import { SearchBar } from '@/components/store/SearchBar';
import { Button } from '@/components/ui/Button';
import { ProductCardSkeleton } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useDataStore } from '@/store/useDataStore';
import { assetUrl } from '@/utils/assets';

export function Home() {
  const { hydrated, categories, products, restaurants, coupons } = useDataStore();

  const visibleCategories = categories.filter((c) => c.visible).sort((a, b) => a.order - b.order);
  const popular = products.filter((p) => p.available && p.tags.includes('popular')).slice(0, 8);
  const bestSellers = products.filter((p) => p.available && p.tags.includes('bestseller')).slice(0, 4);
  const newArrivals = products.filter((p) => p.available && p.tags.includes('new')).slice(0, 4);
  const moroccan = products.filter((p) => p.available && p.categoryId === 'c-moroccan').slice(0, 6);
  const featuredRestaurants = restaurants.filter((r) => r.active).slice(0, 6);
  const activeCoupons = coupons.filter((c) => c.active && new Date(c.expiresAt).getTime() > Date.now()).slice(0, 3);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-navy">
        <img src={assetUrl('images/hero-banner.jpg')} alt="Moroccan feast with tagine and couscous" className="absolute inset-0 w-full h-full object-cover object-right" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/85 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="max-w-xl animate-fade-up">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-yellow text-brand-ink text-xs font-extrabold uppercase tracking-wide">
              <Star className="w-3.5 h-3.5" aria-hidden /> Rated 4.8 by 12,000+ food lovers
            </span>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-white leading-[1.06] tracking-tight">
              Delicious Food,
              <br />
              <span className="text-brand-yellow">Delivered to Your Door.</span>
            </h1>
            <p className="mt-5 text-white/70 text-base sm:text-lg leading-relaxed">
              Order burgers, pizza, sushi and authentic Moroccan dishes from Casablanca's finest kitchens — tracked live from stove to doorstep.
            </p>
            <div className="mt-8 max-w-md">
              <SearchBar />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/category/moroccan">
                <Button size="lg">Explore Moroccan food <ArrowRight className="w-4 h-4" aria-hidden /></Button>
              </Link>
              <Link to="/search">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/25 text-white hover:text-white hover:border-white/60">
                  Browse all dishes
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                { icon: Bike, label: 'Free delivery', sub: 'over 200 MAD' },
                { icon: Clock, label: '30 min avg', sub: 'delivery time' },
                { icon: ShieldCheck, label: 'Fresh', sub: 'guaranteed' },
              ].map((f) => (
                <div key={f.label} className="flex flex-col items-start gap-1.5">
                  <span className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-brand-yellow">
                    <f.icon className="w-5 h-5" aria-hidden />
                  </span>
                  <span className="text-sm font-bold text-white">{f.label}</span>
                  <span className="text-[11px] text-white/55 -mt-1">{f.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-12">
        <SectionHeader
          title="What are you craving?"
          subtitle="Browse by category — every dish, one tap away."
          action={
            <Link to="/search" className="text-sm font-bold text-brand-purple hover:underline inline-flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" aria-hidden />
            </Link>
          }
        />
        <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 lg:grid-cols-8 sm:gap-5">
          {!hydrated
            ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="w-[5.5rem] h-[6.75rem] rounded-3xl bg-brand-ink/8 animate-pulse" />)
            : visibleCategories.map((c) => <CategoryCard key={c.id} category={c} compact />)}
        </div>
      </section>

      {/* COUPONS */}
      {activeCoupons.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-10">
          <div className="grid sm:grid-cols-3 gap-4">
            {activeCoupons.map((c) => (
              <div key={c.id} className="relative rounded-3xl bg-brand-gradient p-5 text-white shadow-glow overflow-hidden">
                <Percent className="absolute -right-3 -bottom-3 w-24 h-24 text-white/10" aria-hidden />
                <p className="text-xs font-bold uppercase tracking-wider text-white/70">Demo coupon</p>
                <p className="mt-1 font-display text-2xl font-extrabold">
                  {c.type === 'percent' ? `${c.value}% OFF` : `${c.value} MAD OFF`}
                </p>
                <p className="mt-1 text-xs text-white/70">Code <span className="font-mono font-bold bg-white/15 px-2 py-0.5 rounded-lg">{c.code}</span> · min {c.minOrder} MAD</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* POPULAR */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-14">
        <SectionHeader
          title="Popular right now"
          subtitle="The dishes Casablanca keeps ordering this week."
          action={
            <Link to="/search?sort=popular" className="text-sm font-bold text-brand-purple hover:underline inline-flex items-center gap-1">
              See more <ArrowRight className="w-3.5 h-3.5" aria-hidden />
            </Link>
          }
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {!hydrated
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : popular.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* MOROCCAN FEATURE */}
      <section className="mt-16 bg-brand-navy py-14">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <SectionHeader
            dark
            title="A taste of Morocco"
            subtitle="Tagine, couscous, harira and charcoal grills — cooked the way grandmothers approve of."
            action={
              <Link to="/category/moroccan" className="text-sm font-bold text-brand-yellow hover:underline inline-flex items-center gap-1">
                Full menu <ArrowRight className="w-3.5 h-3.5" aria-hidden />
              </Link>
            }
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {moroccan.map((p) => (
              <ProductCard key={p.id} product={p} className="bg-white/[0.06] backdrop-blur border border-white/10 shadow-none hover:bg-white/10" />
            ))}
          </div>
        </div>
      </section>

      {/* BEST SELLERS + NEW */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-14 grid lg:grid-cols-2 gap-10">
        <div>
          <SectionHeader title="Best sellers" subtitle="All-time favorites, proven by thousands of orders." />
          <div className="grid grid-cols-2 gap-4">
            {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
        <div>
          <SectionHeader title="New arrivals" subtitle="Fresh on the menu this week." />
          <div className="grid grid-cols-2 gap-4">
            {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* RESTAURANTS */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-14">
        <SectionHeader title="Recommended restaurants" subtitle="Hand-picked kitchens with consistently great reviews." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredRestaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-16">
        <div className="rounded-5xl rounded-[2.5rem] bg-brand-gradient p-8 sm:p-12 text-white relative overflow-hidden shadow-glow">
          <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold">Hungry already? Good.</h2>
              <p className="mt-2 text-white/75 max-w-md">Your first delivery is on us for orders over {useDataStore.getState().settings.freeDeliveryThreshold} MAD. This is a demo — no payment is ever taken.</p>
            </div>
            <Link to="/search" className="shrink-0">
              <Button size="lg" variant="secondary">Start ordering <ArrowRight className="w-4 h-4" aria-hidden /></Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
