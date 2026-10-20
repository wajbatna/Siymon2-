import { clone, delay, getDb, mutate } from '@/services/db';
import { promotionService } from '@/services/promotionService';
import type { AppSettings, CartItem, Order, OrderStatus, PaymentMethod } from '@/types';
import { orderNumber } from '@/utils/id';
import { readJson, writeJson } from '@/utils/storage';

const GUEST_ORDERS_KEY = 'siymon.myOrderIds';

export interface CreateOrderInput {
  customerId: string | null;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  items: CartItem[];
  couponCode?: string;
  paymentMethod: PaymentMethod;
}

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'out_for_delivery',
  out_for_delivery: 'delivered',
};

export const orderService = {
  async list(): Promise<Order[]> {
    return mutate((db) => clone(db.orders));
  },

  async get(id: string): Promise<Order | undefined> {
    return mutate((db) => clone(db.orders.find((o) => o.id === id)));
  },

  /** Orders visible to the current visitor (their account or this browser's guest orders). */
  async listMine(customerId: string | null): Promise<Order[]> {
    const all = getDb().orders;
    if (customerId) return clone(all.filter((o) => o.customerId === customerId));
    const ids = readJson<string[]>(GUEST_ORDERS_KEY, []);
    return clone(all.filter((o) => ids.includes(o.id)));
  },

  async create(input: CreateOrderInput, settings: AppSettings): Promise<Order> {
    await delay(500);
    const subtotal = input.items.reduce((sum, it) => sum + it.unitPrice * it.qty, 0);
    let discount = 0;
    if (input.couponCode) {
      const check = promotionService.validate(input.couponCode, subtotal);
      if (check.ok && check.coupon) {
        discount = promotionService.discountFor(check.coupon, subtotal);
        promotionService.registerUsage(check.coupon.code);
      }
    }
    const deliveryFee =
      subtotal - discount >= settings.freeDeliveryThreshold || subtotal === 0
        ? 0
        : settings.deliveryFee;
    const total = Math.max(0, subtotal - discount) + deliveryFee;
    const now = new Date().toISOString();

    return mutate((db) => {
      const order: Order = {
        id: orderNumber(),
        customerId: input.customerId,
        customerName: input.customerName,
        phone: input.phone,
        address: input.address,
        notes: input.notes,
        items: clone(input.items),
        subtotal,
        deliveryFee,
        discount,
        couponCode: input.couponCode || undefined,
        total,
        status: 'pending',
        paymentMethod: input.paymentMethod,
        paymentStatus: input.paymentMethod === 'cash' ? 'pending' : 'paid',
        createdAt: now,
        updatedAt: now,
        driverId: null,
        timeline: [{ status: 'pending', at: now }],
        source: 'demo',
      };
      db.orders = [order, ...db.orders];
      if (!input.customerId) {
        const ids = readJson<string[]>(GUEST_ORDERS_KEY, []);
        writeJson(GUEST_ORDERS_KEY, [order.id, ...ids]);
      } else {
        db.customers = db.customers.map((c) =>
          c.id === input.customerId
            ? { ...c, ordersCount: c.ordersCount + 1, totalSpent: c.totalSpent + total }
            : c,
        );
      }
      return clone(order);
    });
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order[]> {
    await delay();
    return mutate((db) => {
      const now = new Date().toISOString();
      db.orders = db.orders.map((o) => {
        if (o.id !== id) return o;
        const timeline = [...o.timeline];
        if (!timeline.some((t) => t.status === status)) timeline.push({ status, at: now });
        return {
          ...o,
          status,
          updatedAt: now,
          timeline,
          paymentStatus:
            status === 'delivered'
              ? 'paid'
              : status === 'cancelled'
                ? 'refunded'
                : o.paymentStatus,
        };
      });
      return clone(db.orders);
    });
  },

  /** Advance an order to its next lifecycle step (demo convenience). */
  nextStatus(id: string): Promise<Order[]> {
    const order = getDb().orders.find((o) => o.id === id);
    const next = order ? NEXT_STATUS[order.status] : undefined;
    if (!next) return this.list();
    return this.updateStatus(id, next);
  },

  canCancel(order: Order): boolean {
    return order.status === 'pending' || order.status === 'confirmed';
  },

  cancel(id: string): Promise<Order[]> {
    return this.updateStatus(id, 'cancelled');
  },
};
