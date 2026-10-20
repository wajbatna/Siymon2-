import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CheckCircle2, Clock3, Package, ShoppingCart, Users, Wallet } from 'lucide-react';
import { KpiCard } from '@/components/admin/KpiCard';
import { RangePicker } from '@/components/admin/RangePicker';
import { StatusBadge, ORDER_STATUS_META } from '@/components/ui/Badge';
import { SmartImage } from '@/components/ui/SmartImage';
import { analyticsService, type RangeKey } from '@/services/analyticsService';
import { useDataStore } from '@/store/useDataStore';
import { formatMoney, formatTime } from '@/utils/format';

const PIE_COLORS = ['#F5A623', '#3B82F6', '#7650E8', '#0EA5E9', '#28A745', '#DC3545'];

export function DashboardPage() {
  const [range, setRange] = useState<RangeKey>('30d');
  const orders = useDataStore((s) => s.orders);

  const kpis = useMemo(() => analyticsService.kpis(range), [range, orders]);
  const revenueSeries = useMemo(() => analyticsService.revenueSeries(range), [range, orders]);
  const statusDist = useMemo(() => analyticsService.statusDistribution(range), [range, orders]);
  const topProducts = useMemo(() => analyticsService.topProducts(range, 5), [range, orders]);
  const recent = useMemo(() => orders.slice(0, 6), [orders]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-brand-ink">Overview</h2>
          <p className="text-sm text-brand-muted mt-0.5">Demo analytics computed from locally stored sample orders.</p>
        </div>
        <RangePicker value={range} onChange={setRange} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard icon={ShoppingCart} label="Total orders" value={String(kpis.totalOrders)} delta={kpis.ordersDelta} tone="purple" />
        <KpiCard icon={Wallet} label="Total revenue" value={formatMoney(kpis.revenue)} delta={kpis.revenueDelta} tone="green" />
        <KpiCard icon={Users} label="Customers" value={String(kpis.customers)} tone="blue" />
        <KpiCard icon={Package} label="Products" value={String(kpis.products)} tone="yellow" />
        <KpiCard icon={Clock3} label="Pending orders" value={String(kpis.pending)} tone="red" hint="awaiting fulfilment" />
        <KpiCard icon={CheckCircle2} label="Completed" value={String(kpis.completed)} tone="green" hint="delivered all-time" />
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 bg-white rounded-3xl p-5 shadow-soft">
          <h3 className="font-display font-bold text-brand-ink mb-4">Revenue over time</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ top: 5, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7650E8" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#7650E8" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECEAF6" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#777389' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#777389' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => [formatMoney(Number(value)), 'Revenue']} contentStyle={{ borderRadius: 16, border: '1px solid #ECEAF6', fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#7650E8" strokeWidth={2.5} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white rounded-3xl p-5 shadow-soft">
          <h3 className="font-display font-bold text-brand-ink mb-4">Order status distribution</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusDist} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80} paddingAngle={3} strokeWidth={0}>
                  {statusDist.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, ORDER_STATUS_META[String(name) as keyof typeof ORDER_STATUS_META]?.label ?? name]} contentStyle={{ borderRadius: 16, border: '1px solid #ECEAF6', fontSize: 12 }} />
                <Legend formatter={(value) => <span className="text-xs text-brand-muted">{ORDER_STATUS_META[value as keyof typeof ORDER_STATUS_META]?.label ?? value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 bg-white rounded-3xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-brand-ink">Orders over time</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-brand-purple hover:underline">Manage orders →</Link>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueSeries} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECEAF6" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#777389' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#777389' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#F4F2FC' }} contentStyle={{ borderRadius: 16, border: '1px solid #ECEAF6', fontSize: 12 }} />
                <Bar dataKey="orders" fill="#FFD889" radius={[6, 6, 0, 0]} maxBarSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white rounded-3xl p-5 shadow-soft">
          <h3 className="font-display font-bold text-brand-ink mb-4">Popular dishes</h3>
          <ul className="space-y-3.5">
            {topProducts.map((p, i) => (
              <li key={p.name} className="flex items-center gap-3">
                <span className="w-6 text-center font-display font-extrabold text-brand-muted/60">{i + 1}</span>
                <SmartImage src={p.image} alt={p.name} className="w-11 h-11 rounded-xl shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-brand-ink line-clamp-1">{p.name}</p>
                  <p className="text-[11px] text-brand-muted">{p.qty} sold · {formatMoney(p.revenue)}</p>
                </div>
              </li>
            ))}
            {topProducts.length === 0 && <li className="text-sm text-brand-muted">No sales in this range.</li>}
          </ul>
        </section>
      </div>

      <section className="bg-white rounded-3xl p-5 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-brand-ink">Recent orders</h3>
          <Link to="/admin/orders" className="text-xs font-bold text-brand-purple hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-brand-muted">
                <th className="pb-3 font-bold">Order</th>
                <th className="pb-3 font-bold">Customer</th>
                <th className="pb-3 font-bold">Time</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-ink/6">
              {recent.map((o) => (
                <tr key={o.id} className="hover:bg-brand-cream/40 transition-colors">
                  <td className="py-3 font-mono text-xs font-bold text-brand-purple">{o.id}</td>
                  <td className="py-3 font-semibold text-brand-ink">{o.customerName}</td>
                  <td className="py-3 text-brand-muted">{formatTime(o.createdAt)}</td>
                  <td className="py-3"><StatusBadge status={o.status} /></td>
                  <td className="py-3 text-right font-bold text-brand-ink">{formatMoney(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
