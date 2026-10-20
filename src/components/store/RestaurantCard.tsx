import { Clock, Star } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';
import type { Restaurant } from '@/types';

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <article className="group relative rounded-3xl overflow-hidden shadow-soft hover:shadow-lift hover:-translate-y-1 transition-all duration-300 h-52">
      <SmartImage src={restaurant.image} alt={restaurant.name} className="absolute inset-0" imgClassName="group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/30 to-transparent" />
      {!restaurant.active && (
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 text-brand-ink text-[10px] font-extrabold uppercase">Closed</span>
      )}
      {restaurant.featured && restaurant.active && (
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-brand-yellow text-brand-ink text-[10px] font-extrabold uppercase">Featured</span>
      )}
      <div className="absolute bottom-0 inset-x-0 p-4">
        <h3 className="font-display text-lg font-bold text-white">{restaurant.name}</h3>
        <p className="text-xs text-white/70 mt-0.5 truncate">{restaurant.cuisine.join(' · ')}</p>
        <div className="mt-2.5 flex items-center gap-4 text-xs text-white/85">
          <span className="inline-flex items-center gap-1 font-bold">
            <Star className="w-3.5 h-3.5 fill-brand-yellow text-brand-yellow" aria-hidden /> {restaurant.rating.toFixed(1)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" aria-hidden /> {restaurant.deliveryTime}
          </span>
        </div>
      </div>
    </article>
  );
}
