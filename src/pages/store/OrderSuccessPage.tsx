import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Package, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { useDataStore } from '@/store/useDataStore';
import { formatDateTime, formatMoney } from '@/utils/format';

export function OrderSuccessPage() {
  const { id } = useParams();
  const order = useDataStore((s) => s.orders.find((o) => o.id === id));

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="relative inline-flex">
        <span className="w-24 h-24 rounded-[2rem] bg-success/12 flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-success" aria-hidden />
        </span>
        <PartyPopper className="w-8 h-8 text-brand-yellow absolute -top-3 -right-4 rotate-12" aria-hidden />
      </div>
      <h1 className="mt-6 font-display text-3xl sm:text-4xl font-extrabold text-brand-ink">Order placed!</h1>
      <p className="mt-3 text-brand-muted leading-relaxed">
        Thank you{order ? `, ${order.customerName.split(' ')[0]}` : ''}. Your demo order
        <span className="font-mono font-bold text-brand-purple mx-1.5">{id}</span>
        is now in the queue. Track its status any time from “My orders”.
      </p>

      {order && (
        <div className="mt-8 bg-white rounded-3xl p-6 shadow-soft text-left">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-xs text-brand-muted">Placed at</p>
              <p className="text-sm font-bold text-brand-ink">{formatDateTime(order.createdAt)}</p>
            </div>
            <StatusBadge status={order.status} />
            <div className="text-right">
              <p className="text-xs text-brand-muted">Total (demo)</p>
              <p className="font-display font-extrabold text-brand-ink">{formatMoney(order.total)}</p>
            </div>
          </div>
          <ul className="mt-5 space-y-2.5 border-t border-brand-ink/8 pt-4">
            {order.items.map((it) => (
              <li key={it.key} className="flex justify-between text-sm">
                <span className="text-brand-muted">{it.qty} × {it.name}</span>
                <span className="font-semibold text-brand-ink">{formatMoney(it.unitPrice * it.qty)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to={`/orders/${id}`}><Button variant="outline"><Package className="w-4 h-4" aria-hidden /> Track this order</Button></Link>
        <Link to="/orders"><Button variant="soft">My orders</Button></Link>
        <Link to="/home"><Button>Back to home</Button></Link>
      </div>
      <p className="mt-6 text-xs text-brand-muted">This confirmation is generated locally for demonstration purposes only.</p>
    </div>
  );
}
