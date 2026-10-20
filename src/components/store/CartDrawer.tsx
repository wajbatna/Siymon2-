import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { SmartImage } from '@/components/ui/SmartImage';
import { cartSubtotal, useCartStore } from '@/store/useCartStore';
import { useDataStore } from '@/store/useDataStore';
import { useUiStore } from '@/store/useUiStore';
import { formatMoney } from '@/utils/format';

export function CartDrawer() {
  const { items, setQty, removeItem } = useCartStore();
  const open = useUiStore((s) => s.cartOpen);
  const setOpen = useUiStore((s) => s.setCartOpen);
  const settings = useDataStore((s) => s.settings);
  const navigate = useNavigate();
  const subtotal = cartSubtotal(items);
  const delivery = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      title={`Your cart (${items.length})`}
      footer={
        items.length > 0 ? (
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-brand-muted">Subtotal</span>
              <span className="font-bold text-brand-ink">{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-brand-muted">Delivery</span>
              <span className="font-bold text-brand-ink">{delivery === 0 ? 'Free' : formatMoney(delivery)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => { setOpen(false); navigate('/cart'); }}>
                View cart
              </Button>
              <Button onClick={() => { setOpen(false); navigate('/checkout'); }}>Checkout</Button>
            </div>
          </div>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Browse the menu and add something delicious — your selection is saved on this device."
            action={<Button onClick={() => { setOpen(false); navigate('/home'); }}>Browse food</Button>}
          />
        </div>
      ) : (
        <ul className="divide-y divide-brand-ink/6">
          {items.map((item) => (
            <li key={item.key} className="flex gap-3 p-4">
              <SmartImage src={item.image} alt={item.name} className="w-20 h-20 rounded-2xl shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-sm text-brand-ink line-clamp-1">{item.name}</p>
                  <button
                    onClick={() => removeItem(item.key)}
                    aria-label={`Remove ${item.name}`}
                    className="p-1.5 rounded-lg text-brand-muted hover:text-danger hover:bg-danger/8 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden />
                  </button>
                </div>
                <p className="text-xs text-brand-muted mt-0.5 line-clamp-1">
                  {item.size?.label}
                  {item.extras.length > 0 && ` · +${item.extras.length} extra${item.extras.length > 1 ? 's' : ''}`}
                </p>
                <div className="mt-2.5 flex items-center justify-between">
                  <QuantityStepper size="sm" value={item.qty} min={1} onChange={(q) => setQty(item.key, q)} />
                  <span className="font-display font-bold text-sm text-brand-ink">{formatMoney(item.unitPrice * item.qty)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
