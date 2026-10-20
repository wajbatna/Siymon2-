import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Banknote, CreditCard, Info, ShoppingBag, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Field, Input, Textarea } from '@/components/ui/Field';
import { SmartImage } from '@/components/ui/SmartImage';
import { orderService } from '@/services/orderService';
import { useAuthStore } from '@/store/useAuthStore';
import { cartSubtotal, useCartStore } from '@/store/useCartStore';
import { useDataStore } from '@/store/useDataStore';
import { toast } from '@/store/useToastStore';
import type { PaymentMethod } from '@/types';
import { cn } from '@/utils/cn';
import { formatMoney } from '@/utils/format';
import { isPhone, required, type FieldErrors } from '@/utils/validation';

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; hint: string; icon: typeof Banknote }[] = [
  { id: 'cash', label: 'Cash on delivery', hint: 'Pay the driver at your door', icon: Banknote },
  { id: 'card', label: 'Card (simulated)', hint: 'Demo only — no real charge', icon: CreditCard },
  { id: 'wallet', label: 'SIYMON Wallet (simulated)', hint: 'Demo balance, always sufficient', icon: Wallet },
];

export function CheckoutPage() {
  const { items, coupon, couponCode, clear } = useCartStore();
  const { settings, refreshOrders } = useDataStore();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    address: user?.address ?? '',
    notes: '',
  });
  const [payment, setPayment] = useState<PaymentMethod>('cash');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cartSubtotal(items);
  const discount = coupon ? Math.min(coupon.type === 'percent' ? (subtotal * coupon.value) / 100 : coupon.value, subtotal) : 0;
  const delivery = subtotal - discount >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;
  const total = subtotal - discount + delivery;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState icon={ShoppingBag} title="Nothing to check out" description="Your cart is empty — add a few dishes first." action={<Button onClick={() => navigate('/home')}>Browse the menu</Button>} />
      </div>
    );
  }

  const validate = (): boolean => {
    const next: FieldErrors = {
      name: required(form.name, 'Full name'),
      phone: isPhone(form.phone) ? undefined : 'Enter a valid phone number (9–15 digits)',
      address: form.address.trim().length >= 8 ? undefined : 'Enter a complete delivery address',
    };
    setErrors(next);
    return !Object.values(next).some(Boolean);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the highlighted fields.');
      return;
    }
    setSubmitting(true);
    try {
      const order = await orderService.create(
        {
          customerId: user?.id ?? null,
          customerName: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          notes: form.notes.trim() || undefined,
          items,
          couponCode: couponCode ?? undefined,
          paymentMethod: payment,
        },
        settings,
      );
      clear();
      await refreshOrders();
      toast.success(`Order ${order.id} placed (demo)`);
      navigate(`/order/${order.id}/success`, { replace: true });
    } catch {
      toast.error('Could not place the order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-extrabold text-brand-ink">Checkout</h1>
      <p className="mt-1 text-sm text-brand-muted flex items-center gap-1.5">
        <Info className="w-4 h-4 text-info" aria-hidden /> Demonstration checkout — no real payment is processed and no order leaves this browser.
      </p>

      <form onSubmit={submit} noValidate className="mt-8 grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-3xl p-6 shadow-soft">
            <h2 className="font-display text-lg font-bold text-brand-ink mb-5">1 · Delivery details</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Full name" required error={errors.name} htmlFor="co-name">
                <Input id="co-name" value={form.name} invalid={!!errors.name} onChange={(e) => set('name')(e.target.value)} placeholder="Youssef El Amrani" autoComplete="name" />
              </Field>
              <Field label="Phone number" required error={errors.phone} htmlFor="co-phone">
                <Input id="co-phone" value={form.phone} invalid={!!errors.phone} onChange={(e) => set('phone')(e.target.value)} placeholder="+212 6XX XXX XXX" autoComplete="tel" inputMode="tel" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Delivery address" required error={errors.address} htmlFor="co-address">
                  <Input id="co-address" value={form.address} invalid={!!errors.address} onChange={(e) => set('address')(e.target.value)} placeholder="Street, building, apartment, city" autoComplete="street-address" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Order notes (optional)" htmlFor="co-notes" hint="Ring the bell twice, no cilantro, leave at reception…">
                  <Textarea id="co-notes" value={form.notes} onChange={(e) => set('notes')(e.target.value)} maxLength={240} />
                </Field>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl p-6 shadow-soft">
            <h2 className="font-display text-lg font-bold text-brand-ink mb-5">2 · Payment method</h2>
            <div className="grid sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Payment method">
              {PAYMENT_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  role="radio"
                  aria-checked={payment === opt.id}
                  onClick={() => setPayment(opt.id)}
                  className={cn(
                    'rounded-2xl border-2 p-4 text-left transition-all',
                    payment === opt.id ? 'border-brand-purple bg-brand-purple/6 shadow-soft' : 'border-brand-ink/10 hover:border-brand-purple/40',
                  )}
                >
                  <opt.icon className={cn('w-5 h-5 mb-2', payment === opt.id ? 'text-brand-purple' : 'text-brand-muted')} aria-hidden />
                  <p className="text-sm font-bold text-brand-ink">{opt.label}</p>
                  <p className="text-[11px] text-brand-muted mt-0.5">{opt.hint}</p>
                </button>
              ))}
            </div>
            {payment !== 'cash' && (
              <p className="mt-4 text-xs text-warning bg-warning/10 rounded-xl px-3 py-2.5">
                Simulated payment: card and wallet flows are visual only. Connect a payment provider (Stripe, CMI…) via a backend to accept real payments.
              </p>
            )}
          </section>
        </div>

        <aside className="bg-white rounded-3xl p-6 shadow-soft lg:sticky lg:top-40">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-4">3 · Order summary</h2>
          <ul className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {items.map((it) => (
              <li key={it.key} className="flex items-center gap-3">
                <SmartImage src={it.image} alt={it.name} className="w-12 h-12 rounded-xl shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-ink line-clamp-1">{it.name}</p>
                  <p className="text-xs text-brand-muted">×{it.qty} · {it.size?.label}</p>
                </div>
                <span className="text-sm font-bold text-brand-ink">{formatMoney(it.unitPrice * it.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 pt-4 border-t border-brand-ink/8 space-y-2.5 text-sm">
            <div className="flex justify-between"><dt className="text-brand-muted">Subtotal</dt><dd className="font-semibold">{formatMoney(subtotal)}</dd></div>
            {discount > 0 && <div className="flex justify-between text-success"><dt>Coupon {couponCode}</dt><dd className="font-semibold">−{formatMoney(discount)}</dd></div>}
            <div className="flex justify-between"><dt className="text-brand-muted">Delivery fee</dt><dd className="font-semibold">{delivery === 0 ? 'Free' : formatMoney(delivery)}</dd></div>
            <div className="pt-3 border-t border-brand-ink/8 flex justify-between text-base">
              <dt className="font-display font-bold">Total</dt>
              <dd className="font-display font-extrabold">{formatMoney(total)}</dd>
            </div>
          </dl>
          <Button type="submit" block size="lg" loading={submitting} className="mt-5">
            {submitting ? 'Placing order…' : `Place order · ${formatMoney(total)}`}
          </Button>
          <p className="mt-3 text-[11px] text-center text-brand-muted">By ordering you agree this is a demonstration.</p>
        </aside>
      </form>
    </div>
  );
}
