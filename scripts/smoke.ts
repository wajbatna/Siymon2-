/* Runtime smoke test of the demo service layer (no browser needed). */
import { analyticsService } from '@/services/analyticsService';
import { orderService } from '@/services/orderService';
import { promotionService } from '@/services/promotionService';
import { getDb } from '@/services/db';
import { cartSubtotal, unitPriceFor } from '@/store/useCartStore';
import type { CartItem } from '@/types';

function assert(cond: boolean, label: string): void {
  if (!cond) {
    console.error(`FAIL: ${label}`);
    process.exitCode = 1;
  } else {
    console.log(`ok  : ${label}`);
  }
}

async function main() {
  const db = getDb();
  assert(db.products.length >= 50, `seed products (${db.products.length})`);
  assert(db.categories.length === 8, 'eight categories');
  assert(db.orders.length >= 40, `seed orders (${db.orders.length})`);
  assert(db.restaurants.length === 8, 'eight restaurants');

  const kpis = analyticsService.kpis('30d');
  assert(kpis.totalOrders > 0, `kpis 30d orders (${kpis.totalOrders})`);
  assert(kpis.revenue > 0, `kpis 30d revenue (${kpis.revenue})`);
  assert(analyticsService.revenueSeries('30d').length > 0, 'revenue series');
  assert(analyticsService.topProducts('30d', 5).length > 0, 'top products');
  assert(analyticsService.categoryRevenue('90d').length > 0, 'category revenue');

  const check = promotionService.validate('SIYMON10', 150);
  assert(check.ok && check.coupon?.value === 10, 'coupon SIYMON10 valid at 150');
  assert(promotionService.discountFor(check.coupon!, 150) === 15, 'percent discount math');
  assert(!promotionService.validate('SIYMON10', 50).ok, 'coupon min-order enforced');
  assert(!promotionService.validate('SUMMER25', 500).ok, 'inactive coupon rejected');
  assert(!promotionService.validate('NOPE', 500).ok, 'unknown coupon rejected');

  const product = db.products[0];
  const unit = unitPriceFor(product, product.sizes[1], [product.extras[0]]);
  assert(unit === product.price + product.sizes[1].delta + product.extras[0].price, 'unit price with size+extra');

  const items: CartItem[] = [
    { key: 'a', productId: product.id, name: product.name, image: product.image, unitPrice: 55, basePrice: 55, qty: 2, extras: [] },
    { key: 'b', productId: product.id, name: product.name, image: product.image, unitPrice: 30, basePrice: 30, qty: 1, extras: [] },
  ];
  assert(cartSubtotal(items) === 140, 'cart subtotal math');

  const order = await orderService.create(
    {
      customerId: null,
      customerName: 'Smoke Test',
      phone: '+212 600 000 000',
      address: '1 Test Street, Casablanca',
      items,
      couponCode: 'SIYMON10',
      paymentMethod: 'card',
    },
    db.settings,
  );
  assert(order.id.startsWith('SYM-'), `order number generated (${order.id})`);
  assert(order.discount === 14, `coupon discount applied (${order.discount})`);
  assert(order.total === 140 - 14 + 15, `total with delivery fee (${order.total})`);
  assert(order.status === 'pending' && order.timeline.length === 1, 'order starts pending');

  const ordersAfter = await orderService.updateStatus(order.id, 'confirmed');
  const updated = ordersAfter.find((o) => o.id === order.id);
  assert(updated?.status === 'confirmed' && updated.timeline.length === 2, 'status transition + timeline');

  const cancelled = await orderService.cancel(order.id);
  assert(cancelled.find((o) => o.id === order.id)?.paymentStatus === 'refunded', 'cancel refunds simulated payment');
  assert(orderService.canCancel({ ...order, status: 'preparing' }) === false, 'cannot cancel after confirmed');

  console.log(process.exitCode ? 'SMOKE TEST FAILED' : 'ALL SMOKE TESTS PASSED');
}

void main();
