/**
 * SIYMON — shared domain types.
 * These models mirror what a real backend API would return, so the
 * front-end demo can later be swapped to a live API without refactors.
 */

export type ID = string;

export type CategorySlug =
  | 'burgers'
  | 'pizza'
  | 'sushi'
  | 'hotdogs'
  | 'moroccan'
  | 'desserts'
  | 'drinks'
  | 'healthy';

export interface Category {
  id: ID;
  slug: CategorySlug | string;
  name: string;
  /** Lucide icon name resolved in components/CategoryIcon.tsx */
  icon: string;
  image: string;
  color: string;
  visible: boolean;
  order: number;
}

export interface ProductOption {
  id: ID;
  label: string;
  /** Price delta added to the base price */
  delta: number;
}

export interface ProductExtra {
  id: ID;
  label: string;
  price: number;
}

export type ProductTag = 'popular' | 'new' | 'bestseller' | 'offer';

export interface Product {
  id: ID;
  name: string;
  description: string;
  categoryId: ID;
  restaurantId: ID;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  ratingCount: number;
  prepTime: number; // minutes
  calories?: number;
  tags: ProductTag[];
  featured: boolean;
  available: boolean;
  sizes: ProductOption[];
  extras: ProductExtra[];
  createdAt: string; // ISO
}

export interface Restaurant {
  id: ID;
  name: string;
  cuisine: string[];
  image: string;
  address: string;
  phone: string;
  rating: number;
  deliveryTime: string;
  openingHours: string;
  active: boolean;
  featured: boolean;
}

export interface CartItem {
  key: string; // unique per product+size+extras combo
  productId: ID;
  name: string;
  image: string;
  unitPrice: number; // computed with size + extras
  basePrice: number;
  qty: number;
  size?: ProductOption;
  extras: ProductExtra[];
  notes?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cash' | 'card' | 'wallet';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface OrderItem extends CartItem {}

export interface Order {
  id: ID; // e.g. SYM-20261020-4821
  customerId: ID | null; // null = guest
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string; // ISO
  updatedAt: string;
  driverId?: ID | null;
  timeline: { status: OrderStatus; at: string }[];
  source: 'demo' | 'seed';
}

export interface Customer {
  id: ID;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinedAt: string;
  status: 'active' | 'blocked';
  ordersCount: number;
  totalSpent: number;
}

export interface Driver {
  id: ID;
  name: string;
  phone: string;
  vehicle: string;
  plate: string;
  available: boolean;
  activeDeliveries: number;
  completedDeliveries: number;
  rating: number;
  zone: string;
}

export interface Coupon {
  id: ID;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minOrder: number;
  expiresAt: string;
  active: boolean;
  usageCount: number;
}

export interface User {
  id: ID;
  name: string;
  email: string;
  /** Demo-only: stored in plain text in localStorage. NEVER do this in production. */
  password: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: string;
}

export interface AppSettings {
  brandName: string;
  tagline: string;
  currency: string;
  currencySymbol: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  twitter: string;
  theme: 'purple' | 'sunset' | 'ocean';
}

export interface DbShape {
  version: number;
  categories: Category[];
  products: Product[];
  restaurants: Restaurant[];
  orders: Order[];
  customers: Customer[];
  drivers: Driver[];
  coupons: Coupon[];
  users: User[];
  settings: AppSettings;
}
