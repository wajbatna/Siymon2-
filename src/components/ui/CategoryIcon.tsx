import {
  CakeSlice,
  CookingPot,
  CupSoda,
  Drumstick,
  Fish,
  Pizza,
  Salad,
  Sandwich,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Sandwich,
  Pizza,
  Fish,
  Drumstick,
  CookingPot,
  CakeSlice,
  CupSoda,
  Salad,
};

/** Resolves a category icon name (stored in data) to a Lucide component. */
export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? UtensilsCrossed;
  return <Icon className={className} aria-hidden />;
}
