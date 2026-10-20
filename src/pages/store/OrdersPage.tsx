import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, RefreshCw } from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/Modal';
import { EmptyState, LoadingState } from '@/components/ui/EmptyState';
import { SmartImage } from '@/components/ui/SmartImage';
import { orderService } from '@/services/orderService';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useDataStore } from '@/store/useDataStore';
import { toast } from '@/store/useToastStore';
import type { Order } from '@/types';
import { formatDateTime, formatMoney } from '@/utils/format';

export function OrdersPage() {
  const user = useAuthStore((s) => s.user);
  const { products, refreshOrders } = useDataStore();
  const addItem = useCartStore((s) => s.addItem);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    orderService.listMine(user?.id ?? null).then((list) => {
      if (alive) setOrders(list);
    });
    return () => {
      alive = false;
    };
  }, [user]);

  const sorted = useMemo(() => (orders ?? []).slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [orders]);

  const reorder = (order: Order) => {
    let added = 0;
    for (const item of order.items) {
      const product = products.find((p) => p.id === item.productId);
      if (product?.available) {
        addItem(product, { size: product.sizes[0], qty: item.qty });
        added += 1;
      }
    }
    if (added > 0) toast.success(`${added} item${added > 1 ? 's' : ''} added to your cart again`);
    else toast.warning('None of these products are available anymore.');
  };

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    setBusy(true);
    await orderService.cancel(cancelTarget.id);
    await refreshOrders();
    setOrders(await orderService.listMine(user?.id ?? null));
    setBusy(false);
    setCancelTarget(null);
    toast.info(`Order ${cancelTarget.id} cancelled (demo).`);
  };

  if (orders === null) return <LoadingState label="Loading your orders…" />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-brand-ink">My orders</h1>
          <p className="text-sm text-brand-muted mt-1">
            {user ? `Signed in as ${user.name}` : 'Guest session — orders placed in this browser only'}
          </p>
        </div>
        <Button
          variant="soft"
          onClick={async () => {
            setOrders(await orderService.listMine(user?.id ?? null));
            toast.info('Order list refreshed.');
          }}
        >
          <RefreshCw className="w-4 h-4" aria-hidden /> Refresh
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="When you place a demo order it will appear here with a live status timeline."
            action={<Link to="/home"><Button>Start ordering</Button></Link>}
          />
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {sorted.map((order) => (
            <li key={order.id} className="bg-white rounded-3xl p-5 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono font-bold text-brand-ink">{order.id}</p>
                  <p className="text-xs text-brand-muted mt-0.5">{formatDateTime(order.createdAt)} · {order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                </div>
                <StatusBadge status={order.status} />
                <p className="font-display font-extrabold text-brand-ink">{formatMoney(order.total)}</p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                {order.items.slice(0, 5).map((it) => (
                  <SmartImage key={it.key} src={it.image} alt={it.name} className="w-12 h-12 rounded-xl border-2 border-white shadow-soft" />
                ))}
                {order.items.length > 5 && <span className="text-xs font-bold text-brand-muted">+{order.items.length - 5}</span>}
              </div>
              <div className="mt-4 pt-4 border-t border-brand-ink/6 flex flex-wrap gap-2.5">
                <Link to={`/orders/${order.id}`}><Button size="sm" variant="outline">View details</Button></Link>
                <Button size="sm" variant="soft" onClick={() => reorder(order)}>Reorder</Button>
                {orderService.canCancel(order) && (
                  <Button size="sm" variant="danger" onClick={() => setCancelTarget(order)}>Cancel order</Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={!!cancelTarget}
        title="Cancel this order?"
        message={<>Order <span className="font-mono font-bold text-brand-ink">{cancelTarget?.id}</span> will be marked as cancelled. In a production system this would notify the restaurant and refund any payment.</>}
        confirmLabel="Cancel order"
        danger
        loading={busy}
        onConfirm={confirmCancel}
        onClose={() => setCancelTarget(null)}
      />
    </div>
  );
}
