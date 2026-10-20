import { clone, delay, mutate } from '@/services/db';
import type { Coupon } from '@/types';
import { uid } from '@/utils/id';

export type CouponInput = Omit<Coupon, 'id' | 'usageCount'>;

export interface CouponCheck {
  ok: boolean;
  message: string;
  coupon?: Coupon;
}

export const promotionService = {
  async list(): Promise<Coupon[]> {
    return mutate((db) => clone(db.coupons));
  },

  async create(input: CouponInput): Promise<Coupon[]> {
    await delay();
    return mutate((db) => {
      const coupon: Coupon = { ...input, id: uid('cp'), usageCount: 0 };
      db.coupons = [coupon, ...db.coupons];
      return clone(db.coupons);
    });
  },

  async update(id: string, patch: Partial<CouponInput>): Promise<Coupon[]> {
    await delay();
    return mutate((db) => {
      db.coupons = db.coupons.map((c) => (c.id === id ? { ...c, ...patch } : c));
      return clone(db.coupons);
    });
  },

  async remove(id: string): Promise<Coupon[]> {
    await delay();
    return mutate((db) => {
      db.coupons = db.coupons.filter((c) => c.id !== id);
      return clone(db.coupons);
    });
  },

  /** Validate a coupon code against a cart subtotal (no state change). */
  validate(code: string, subtotal: number): CouponCheck {
    const coupon = mutate((db) => db.coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase()));
    if (!coupon) return { ok: false, message: 'Coupon code not found.' };
    if (!coupon.active) return { ok: false, message: 'This coupon is no longer active.' };
    if (new Date(coupon.expiresAt).getTime() < Date.now()) {
      return { ok: false, message: 'This coupon has expired.' };
    }
    if (subtotal < coupon.minOrder) {
      return { ok: false, message: `Requires a minimum order of ${coupon.minOrder}.` };
    }
    return { ok: true, message: `Coupon ${coupon.code} applied.`, coupon: clone(coupon) };
  },

  discountFor(coupon: Coupon, subtotal: number): number {
    const raw = coupon.type === 'percent' ? (subtotal * coupon.value) / 100 : coupon.value;
    return Math.min(Math.round(raw * 100) / 100, subtotal);
  },

  /** Register one more usage after a successful checkout. */
  registerUsage(code: string): void {
    mutate((db) => {
      db.coupons = db.coupons.map((c) =>
        c.code === code ? { ...c, usageCount: c.usageCount + 1 } : c,
      );
      return undefined;
    });
  },
};
