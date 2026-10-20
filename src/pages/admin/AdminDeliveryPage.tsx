import { Bike, Phone, Star } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Field';
import { useDataStore } from '@/store/useDataStore';
import { formatMoney } from '@/utils/format';

export function AdminDeliveryPage() {
  const { drivers, orders, toggleDriver } = useDataStore();
  const active = orders.filter((o) => o.status === 'out_for_delivery');

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">Available drivers</p>
          <p className="font-display text-2xl font-extrabold text-brand-ink mt-1">{drivers.filter((d) => d.available).length} / {drivers.length}</p>
        </div>
        <div className="bg-white rounded-3xl p-5 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">Active deliveries</p>
          <p className="font-display text-2xl font-extrabold text-brand-ink mt-1">{active.length}</p>
        </div>
        <div className="bg-white rounded-3xl p-5 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">Avg driver rating</p>
          <p className="font-display text-2xl font-extrabold text-brand-ink mt-1">{(drivers.reduce((s, d) => s + d.rating, 0) / Math.max(1, drivers.length)).toFixed(2)}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {drivers.map((d) => {
          const assigned = orders.filter((o) => o.driverId === d.id && o.status !== 'delivered' && o.status !== 'cancelled');
          return (
            <article key={d.id} className="bg-white rounded-3xl p-5 shadow-soft">
              <div className="flex items-start gap-3">
                <span className="w-12 h-12 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
                  <Bike className="w-5 h-5" aria-hidden />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-brand-ink">{d.name}</p>
                  <p className="text-[11px] text-brand-muted line-clamp-1">{d.vehicle} · {d.plate}</p>
                </div>
                <Toggle checked={d.available} label={`Toggle availability for ${d.name}`} onChange={() => toggleDriver(d.id)} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-brand-cream/80 py-2">
                  <p className="font-display font-extrabold text-brand-ink text-sm">{d.activeDeliveries}</p>
                  <p className="text-[10px] text-brand-muted font-bold uppercase">Active</p>
                </div>
                <div className="rounded-xl bg-brand-cream/80 py-2">
                  <p className="font-display font-extrabold text-brand-ink text-sm">{d.completedDeliveries}</p>
                  <p className="text-[10px] text-brand-muted font-bold uppercase">Done</p>
                </div>
                <div className="rounded-xl bg-brand-cream/80 py-2">
                  <p className="font-display font-extrabold text-brand-ink text-sm inline-flex items-center gap-1"><Star className="w-3 h-3 fill-brand-yellow text-brand-yellow" aria-hidden />{d.rating.toFixed(1)}</p>
                  <p className="text-[10px] text-brand-muted font-bold uppercase">Rating</p>
                </div>
              </div>
              <ul className="mt-4 space-y-1.5 text-xs text-brand-muted">
                <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" aria-hidden />{d.phone}</li>
                <li>Zone: <span className="font-semibold text-brand-ink">{d.zone}</span></li>
              </ul>
              <div className="mt-4 pt-3 border-t border-brand-ink/6">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-2">Assigned demo orders</p>
                {assigned.length === 0 ? (
                  <p className="text-xs text-brand-muted">No live assignments.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {assigned.map((o) => (
                      <li key={o.id} className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-brand-purple">{o.id}</span>
                        <Badge tone="info">{o.status.replace('_', ' ')}</Badge>
                        <span className="font-bold">{formatMoney(o.total)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <p className="text-[11px] text-brand-muted">Driver GPS, live tracking and dispatching require a backend with real-time channels (WebSocket / Firebase). This page demonstrates the management UI only.</p>
    </div>
  );
}
