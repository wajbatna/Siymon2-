import { getDb } from '@/services/db';
import type { Order } from '@/types';

export type RangeKey = '7d' | '30d' | '90d' | 'all';

export const RANGE_DAYS: Record<RangeKey, number> = { '7d': 7, '30d': 30, '90d': 90, all: 3650 };

function inRange(order: Order, days: number): boolean {
  if (days >= 3650) return true;
  const cut = Date.now() - days * 86400000;
  return new Date(order.createdAt).getTime() >= cut;
}

function revenueOrders(orders: Order[], days: number): Order[] {
  return orders.filter((o) => o.status !== 'cancelled' && inRange(o, days));
}

export interface Kpis {
  totalOrders: number;
  revenue: number;
  customers: number;
  products: number;
  pending: number;
  completed: number;
  avgOrder: number;
  revenueDelta: number;
  ordersDelta: number;
}

function seriesFor(orders: Order[], days: number): { label: string; revenue: number; orders: number }[] {
  const buckets = new Map<string, { label: string; revenue: number; orders: number }>();
  const byDay = days <= 31;
  for (const o of orders) {
    const d = new Date(o.createdAt);
    const key = byDay
      ? d.toISOString().slice(0, 10)
      : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = byDay
      ? d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
      : d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
    const bucket = buckets.get(key) ?? { label, revenue: 0, orders: 0 };
    bucket.orders += 1;
    bucket.revenue += o.total;
    buckets.set(key, bucket);
  }
  return [...buckets.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([, v]) => ({
    ...v,
    revenue: Math.round(v.revenue),
  }));
}

export const analyticsService = {
  kpis(range: RangeKey): Kpis {
    const db = getDb();
    const days = RANGE_DAYS[range];
    const prevDays = days;
    const current = revenueOrders(db.orders, days);
    const prevCut = Date.now() - days * 86400000;
    const prev = revenueOrders(db.orders, prevDays * 2).filter(
      (o) => new Date(o.createdAt).getTime() < prevCut,
    );
    const revenue = current.reduce((s, o) => s + o.total, 0);
    const prevRevenue = prev.reduce((s, o) => s + o.total, 0);
    const delta = (a: number, b: number): number => (b === 0 ? (a > 0 ? 100 : 0) : Math.round(((a - b) / b) * 100));
    const activeStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery'];
    return {
      totalOrders: current.length,
      revenue: Math.round(revenue),
      customers: new Set(db.customers.map((c) => c.id)).size,
      products: db.products.length,
      pending: db.orders.filter((o) => activeStatuses.includes(o.status)).length,
      completed: db.orders.filter((o) => o.status === 'delivered').length,
      avgOrder: current.length ? Math.round(revenue / current.length) : 0,
      revenueDelta: delta(revenue, prevRevenue),
      ordersDelta: delta(current.length, prev.length),
    };
  },

  revenueSeries(range: RangeKey) {
    const db = getDb();
    return seriesFor(revenueOrders(db.orders, RANGE_DAYS[range]), RANGE_DAYS[range]);
  },

  statusDistribution(range: RangeKey): { name: string; value: number }[] {
    const db = getDb();
    const orders = db.orders.filter((o) => inRange(o, RANGE_DAYS[range]));
    const counts = new Map<string, number>();
    for (const o of orders) counts.set(o.status, (counts.get(o.status) ?? 0) + 1);
    return [...counts.entries()].map(([name, value]) => ({ name, value }));
  },

  topProducts(range: RangeKey, limit = 5): { name: string; qty: number; revenue: number; image: string }[] {
    const db = getDb();
    const orders = revenueOrders(db.orders, RANGE_DAYS[range]);
    const agg = new Map<string, { name: string; qty: number; revenue: number; image: string }>();
    for (const o of orders) {
      for (const it of o.items) {
        const entry = agg.get(it.productId) ?? { name: it.name, qty: 0, revenue: 0, image: it.image };
        entry.qty += it.qty;
        entry.revenue += it.qty * it.unitPrice;
        agg.set(it.productId, entry);
      }
    }
    return [...agg.values()].sort((a, b) => b.qty - a.qty).slice(0, limit);
  },

  categoryRevenue(range: RangeKey): { name: string; revenue: number }[] {
    const db = getDb();
    const orders = revenueOrders(db.orders, RANGE_DAYS[range]);
    const agg = new Map<string, number>();
    for (const o of orders) {
      for (const it of o.items) {
        const product = db.products.find((p) => p.id === it.productId);
        const category = db.categories.find((c) => c.id === product?.categoryId);
        const name = category?.name ?? 'Other';
        agg.set(name, (agg.get(name) ?? 0) + it.qty * it.unitPrice);
      }
    }
    return [...agg.entries()].map(([name, revenue]) => ({ name, revenue: Math.round(revenue) })).sort((a, b) => b.revenue - a.revenue);
  },

  ordersByWeekday(range: RangeKey): { day: string; orders: number }[] {
    const db = getDb();
    const orders = revenueOrders(db.orders, RANGE_DAYS[range]);
    const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = new Array(7).fill(0) as number[];
    for (const o of orders) counts[new Date(o.createdAt).getDay()] += 1;
    return names.map((day, i) => ({ day, orders: counts[i] }));
  },
};
