import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { promotionService } from '@/services/promotionService';
import type { CartItem, Coupon, Product, ProductExtra, ProductOption } from '@/types';
import { uid } from '@/utils/id';

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  coupon: Coupon | null;
  addItem: (
    product: Product,
    options: { size?: ProductOption; extras?: ProductExtra[]; qty?: number; notes?: string },
  ) => void;
  setQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  applyCoupon: (code: string, subtotal: number) => { ok: boolean; message: string };
  clearCoupon: () => void;
}

export function itemKey(productId: string, size?: ProductOption, extras: ProductExtra[] = []): string {
  const sizeId = size?.id ?? 'reg';
  const extraIds = extras.map((e) => e.id).sort().join('+');
  return `${productId}:${sizeId}:${extraIds}`;
}

export function unitPriceFor(product: Product, size?: ProductOption, extras: ProductExtra[] = []): number {
  const base = product.price + (size?.delta ?? 0);
  return base + extras.reduce((sum, e) => sum + e.price, 0);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      coupon: null,

      addItem: (product, { size, extras = [], qty = 1, notes }) => {
        const key = itemKey(product.id, size, extras);
        const unitPrice = unitPriceFor(product, size, extras);
        const items = [...get().items];
        const existing = items.find((it) => it.key === key);
        if (existing) {
          existing.qty += qty;
          if (notes) existing.notes = notes;
        } else {
          items.push({
            key: key || uid('ci'),
            productId: product.id,
            name: product.name,
            image: product.image,
            unitPrice,
            basePrice: product.price,
            qty,
            size,
            extras,
            notes,
          });
        }
        set({ items });
      },

      setQty: (key, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((it) => it.key !== key)
              : state.items.map((it) => (it.key === key ? { ...it, qty } : it)),
        })),

      removeItem: (key) => set((state) => ({ items: state.items.filter((it) => it.key !== key) })),

      clear: () => set({ items: [], couponCode: null, coupon: null }),

      applyCoupon: (code, subtotal) => {
        const check = promotionService.validate(code, subtotal);
        if (check.ok && check.coupon) {
          set({ couponCode: check.coupon.code, coupon: check.coupon });
        }
        return { ok: check.ok, message: check.message };
      },

      clearCoupon: () => set({ couponCode: null, coupon: null }),
    }),
    { name: 'siymon.cart.v1' },
  ),
);

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, it) => sum + it.unitPrice * it.qty, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, it) => sum + it.qty, 0);
}
