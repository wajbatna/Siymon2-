import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, ChevronLeft, Circle, MapPin, Phone, RefreshCw } from 'lucide-react';
import { PaymentBadge, StatusBadge, ORDER_STATUS_META } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { SmartImage } from '@/components/ui/SmartImage';
import { orderService } from '@/services/orderService';
import { useCartStore } from '@/store/useCartStore';
import { useDataStore } from '@/store/useDataStore';
import { toast } from '@/store/useToastStore';
import { cn } from '@/utils/cn';
import { formatDateTime, formatMoney, formatTime } from '@/utils/format';

const FLOW = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'] as const;

export function OrderDetailPage() {
  const { id } = useParams();
  const order = useDataStore((s) => s.orders.find((o) => o.id === id));
  const products = useDataStore((s) => s.products);
  const refreshOrders = useDataStore((s) => s.refreshOrders);
  const addItem = useCartStore((s) => s.addItem);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <EmptyState title="Order not found" description="This order does not exist in the local demo data." action={<Link to="/orders" className="text-sm font-bold text-brand-purple hover:underline">Back to my orders</Link>} />
      </div>
    );
  }

  const cancelled = order.status === 'cancelled';
  const reachedIndex = cancelled ? -1 : FLOW.indexOf(order.status as (typeof FLOW)[number]);

  const cancel = async () => {
    setBusy(true);
    await orderService.cancel(order.id);
    await refreshOrders();
    setBusy(false);
    setCancelOpen(false);
    toast.info(`Order ${order.id} cancelled (demo).`);
  };

  const reorder = () => {
    let added = 0;
    for (const item of order.items) {
      const product = products.find((p) => p.id === item.productId);
      if (product?.available) {
        addItem(product, { size: product.sizes[0], qty: item.qty });
        added += 1;
      }
    }
    toast[added ? 'success' : 'warning'](added ? `${added} item${added > 1 ? 's' : ''} added to cart` : 'These products are no longer available.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link to="/orders" className="inline-flex items-center gap-1 text-sm font-bold text-brand-muted hover:text-brand-purple mb-6">
        <ChevronLeft className="w-4 h-4" aria-hidden /> My orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-ink font-mono">{order.id}</h1>
          <p className="text-sm text-brand-muted mt-1">Placed {formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={order.status} />
          <PaymentBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* timeline */}
          <section className="bg-white rounded-3xl p-6 shadow-soft">
            <h2 className="font-display text-lg font-bold text-brand-ink mb-6">Status timeline</h2>
            {cancelled ? (
              <p className="text-sm text-danger font-semibold bg-danger/8 rounded-2xl px-4 py-3">
                This order was cancelled at {formatTime(order.timeline[order.timeline.length - 1]?.at ?? order.updatedAt)}. Demo refunds are instant and imaginary.
              </p>
            ) : (
              <ol className="space-y-0">
                {FLOW.map((step, idx) => {
                  const entry = order.timeline.find((t) => t.status === step);
                  const done = idx <= reachedIndex;
                  const current = idx === reachedIndex;
                  return (
                    <li key={step} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span
                          className={cn(
                            'w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors',
                            done ? 'bg-brand-purple border-brand-purple text-white' : 'bg-white border-brand-ink/15 text-brand-muted',
                            current && 'ring-4 ring-brand-purple/20',
                          )}
                        >
                          {done ? <Check className="w-4 h-4" aria-hidden /> : <Circle className="w-3 h-3" aria-hidden />}
                        </span>
                        {idx < FLOW.length - 1 && <span className={cn('w-0.5 flex-1 min-h-8', idx < reachedIndex ? 'bg-brand-purple' : 'bg-brand-ink/10')} />}
                      </div>
                      <div className="pb-7">
                        <p className={cn('text-sm font-bold', done ? 'text-brand-ink' : 'text-brand-muted')}>{ORDER_STATUS_META[step].label}</p>
                        <p className="text-xs text-brand-muted mt-0.5">{entry ? formatTime(entry.at) : 'Waiting…'}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>

          {/* items */}
          <section className="bg-white rounded-3xl p-6 shadow-soft">
            <h2 className="font-display text-lg font-bold text-brand-ink mb-4">Items</h2>
            <ul className="divide-y divide-brand-ink/6">
              {order.items.map((it) => (
                <li key={it.key} className="flex items-center gap-4 py-3.5">
                  <SmartImage src={it.image} alt={it.name} className="w-16 h-16 rounded-2xl shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-brand-ink line-clamp-1">{it.name}</p>
                    <p className="text-xs text-brand-muted mt-0.5">{it.qty} × {formatMoney(it.unitPrice)} · {it.size?.label}{it.extras.length > 0 && ` · ${it.extras.map((e) => e.label).join(', ')}`}</p>
                    {it.notes && <p className="text-xs text-brand-purple italic mt-0.5">“{it.notes}”</p>}
                  </div>
                  <span className="font-bold text-sm text-brand-ink">{formatMoney(it.unitPrice * it.qty)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="bg-white rounded-3xl p-6 shadow-soft">
            <h2 className="font-display text-lg font-bold text-brand-ink mb-4">Delivery</h2>
            <ul className="space-y-3 text-sm text-brand-muted">
              <li className="flex gap-2.5"><MapPin className="w-4 h-4 mt-0.5 shrink-0 text-brand-purple" aria-hidden />{order.address}</li>
              <li className="flex gap-2.5"><Phone className="w-4 h-4 mt-0.5 shrink-0 text-brand-purple" aria-hidden />{order.phone}</li>
              {order.notes && <li className="bg-brand-cream rounded-xl px-3 py-2 text-xs italic">“{order.notes}”</li>}
            </ul>
            <dl className="mt-5 pt-4 border-t border-brand-ink/8 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-brand-muted">Subtotal</dt><dd className="font-semibold">{formatMoney(order.subtotal)}</dd></div>
              {order.discount > 0 && <div className="flex justify-between text-success"><dt>Coupon {order.couponCode}</dt><dd className="font-semibold">−{formatMoney(order.discount)}</dd></div>}
              <div className="flex justify-between"><dt className="text-brand-muted">Delivery</dt><dd className="font-semibold">{order.deliveryFee === 0 ? 'Free' : formatMoney(order.deliveryFee)}</dd></div>
              <div className="pt-2.5 border-t border-brand-ink/8 flex justify-between text-base"><dt className="font-display font-bold">Total</dt><dd className="font-display font-extrabold">{formatMoney(order.total)}</dd></div>
            </dl>
          </section>
          <div className="grid gap-2.5">
            <Button variant="soft" onClick={reorder}><RefreshCw className="w-4 h-4" aria-hidden /> Reorder these items</Button>
            {orderService.canCancel(order) && (
              <Button variant="danger" onClick={() => setCancelOpen(true)}>Cancel order</Button>
            )}
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={cancelOpen}
        title="Cancel this order?"
        message="The order will move to “Cancelled” and any simulated payment will be marked refunded."
        confirmLabel="Cancel order"
        danger
        loading={busy}
        onConfirm={cancel}
        onClose={() => setCancelOpen(false)}
      />
    </div>
  );
}
