import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Tag, Trash2, Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Field';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { SmartImage } from '@/components/ui/SmartImage';
import { cartSubtotal, useCartStore } from '@/store/useCartStore';
import { useDataStore } from '@/store/useDataStore';
import { toast } from '@/store/useToastStore';
import { formatMoney } from '@/utils/format';

export function CartPage() {
  const { items, setQty, removeItem, clear, coupon, couponCode, applyCoupon, clearCoupon } = useCartStore();
  const settings = useDataStore((s) => s.settings);
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const subtotal = cartSubtotal(items);
  const discount = coupon ? Math.min(coupon.type === 'percent' ? (subtotal * coupon.value) / 100 : coupon.value, subtotal) : 0;
  const delivery = subtotal - discount >= settings.freeDeliveryThreshold || items.length === 0 ? 0 : settings.deliveryFee;
  const total = subtotal - discount + delivery;

  const onApply = () => {
    if (!code.trim()) return;
    const res = applyCoupon(code, subtotal);
    if (res.ok) toast.success(res.message);
    else toast.error(res.message);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Your cart is saved on this device between visits."
          action={<Link to="/home"><Button>Browse the menu</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-extrabold text-brand-ink">Shopping cart</h1>
      <p className="text-sm text-brand-muted mt-1">{items.length} line item{items.length > 1 ? 's' : ''} · saved locally on this device</p>

      <div className="mt-8 grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.key} className="flex gap-4 bg-white rounded-3xl p-4 shadow-soft">
              <Link to={`/product/${item.productId}`} className="shrink-0">
                <SmartImage src={item.image} alt={item.name} className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link to={`/product/${item.productId}`} className="font-display font-bold text-brand-ink hover:text-brand-purple transition-colors line-clamp-1">
                      {item.name}
                    </Link>
                    <p className="text-xs text-brand-muted mt-1">
                      {item.size?.label ?? 'Regular'}
                      {item.extras.length > 0 && ` · ${item.extras.map((e) => e.label).join(', ')}`}
                    </p>
                    {item.notes && <p className="text-xs text-brand-purple mt-1 italic line-clamp-1">“{item.notes}”</p>}
                  </div>
                  <button
                    onClick={() => { removeItem(item.key); toast.info(`${item.name} removed from cart`); }}
                    aria-label={`Remove ${item.name}`}
                    className="p-2 rounded-xl text-brand-muted hover:text-danger hover:bg-danger/8 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <QuantityStepper size="sm" value={item.qty} min={1} onChange={(q) => setQty(item.key, q)} />
                  <p className="font-display font-extrabold text-brand-ink">{formatMoney(item.unitPrice * item.qty)}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between">
            <Link to="/home" className="text-sm font-bold text-brand-purple hover:underline">← Continue shopping</Link>
            <button onClick={() => { clear(); toast.info('Cart cleared'); }} className="text-sm font-bold text-danger hover:underline">
              Clear cart
            </button>
          </div>
        </div>

        <aside className="bg-white rounded-3xl p-6 shadow-soft lg:sticky lg:top-40">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-4">Order summary</h2>

          <div className="mb-5">
            <label htmlFor="coupon" className="text-xs font-bold uppercase tracking-wider text-brand-muted flex items-center gap-1.5 mb-2">
              <Tag className="w-3.5 h-3.5" aria-hidden /> Coupon code
            </label>
            {coupon ? (
              <div className="flex items-center justify-between rounded-2xl bg-success/10 text-success px-4 h-11 text-sm font-bold">
                <span>{coupon.code} applied</span>
                <button onClick={clearCoupon} className="text-xs underline hover:no-underline">remove</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input id="coupon" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. SIYMON10" className="h-11" />
                <Button variant="soft" onClick={onApply} className="shrink-0">Apply</Button>
              </div>
            )}
            <p className="mt-2 text-[11px] text-brand-muted">Demo codes: SIYMON10 · WELCOME20 · DELIVERY15</p>
          </div>

          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between"><dt className="text-brand-muted">Subtotal</dt><dd className="font-semibold text-brand-ink">{formatMoney(subtotal)}</dd></div>
            {discount > 0 && <div className="flex justify-between text-success"><dt>Discount ({couponCode})</dt><dd className="font-semibold">−{formatMoney(discount)}</dd></div>}
            <div className="flex justify-between">
              <dt className="text-brand-muted flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" aria-hidden /> Delivery</dt>
              <dd className="font-semibold text-brand-ink">{delivery === 0 ? 'Free' : formatMoney(delivery)}</dd>
            </div>
            <div className="pt-3 border-t border-brand-ink/8 flex justify-between text-base">
              <dt className="font-display font-bold text-brand-ink">Total</dt>
              <dd className="font-display font-extrabold text-brand-ink">{formatMoney(total)}</dd>
            </div>
          </dl>

          {delivery > 0 && (
            <p className="mt-3 text-[11px] text-brand-muted bg-brand-cream rounded-xl px-3 py-2">
              Add {formatMoney(settings.freeDeliveryThreshold - (subtotal - discount))} more to get free delivery.
            </p>
          )}

          <Button block size="lg" className="mt-5" onClick={() => navigate('/checkout')}>
            Proceed to checkout <ArrowRight className="w-4 h-4" aria-hidden />
          </Button>
          <p className="mt-3 text-[11px] text-center text-brand-muted">Payments are simulated in this demo — nothing is charged.</p>
        </aside>
      </div>
    </div>
  );
}
