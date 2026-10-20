import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Download, Receipt, TrendingUp, Wallet } from 'lucide-react';
import { KpiCard } from '@/components/admin/KpiCard';
import { RangePicker } from '@/components/admin/RangePicker';
import { Button } from '@/components/ui/Button';
import { SmartImage } from '@/components/ui/SmartImage';
import { analyticsService, type RangeKey } from '@/services/analyticsService';
import { useDataStore } from '@/store/useDataStore';
import { toast } from '@/store/useToastStore';
import { exportCsv } from '@/utils/csv';
import { formatMoney } from '@/utils/format';

const COLORS = ['#7650E8', '#FFD889', '#28A745', '#3B82F6', '#F5A623', '#EC4899', '#14B8A6', '#DC3545'];

export function AdminReportsPage() {
  const [range, setRange] = useState<RangeKey>('30d');
  const { orders, products } = useDataStore();

  const kpis = useMemo(() => analyticsService.kpis(range), [range, orders]);
  const categoryRevenue = useMemo(() => analyticsService.categoryRevenue(range), [range, orders]);
  const weekday = useMemo(() => analyticsService.ordersByWeekday(range), [range, orders]);
  const top = useMemo(() => analyticsService.topProducts(range, 8), [range, orders]);
  const cancelled = useMemo(() => orders.filter((o) => o.status === 'cancelled').length, [orders]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-brand-ink">Reports</h2>
          <p className="text-sm text-brand-muted mt-0.5">All figures are computed from demo data stored in this browser.</p>
        </div>
        <div className="flex gap-2">
          <RangePicker value={range} onChange={setRange} />
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={Wallet} label="Revenue (range)" value={formatMoney(kpis.revenue)} tone="green" />
        <KpiCard icon={Receipt} label="Orders (range)" value={String(kpis.totalOrders)} tone="purple" />
        <KpiCard icon={TrendingUp} label="Average order" value={formatMoney(kpis.avgOrder)} tone="blue" />
        <KpiCard icon={Receipt} label="Cancellation rate" value={`${orders.length ? Math.round((cancelled / orders.length) * 100) : 0}%`} tone="red" hint={`${cancelled} cancelled all-time`} />
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <section className="bg-white rounded-3xl p-5 shadow-soft">
          <h3 className="font-display font-bold text-brand-ink mb-4">Revenue by category</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryRevenue} dataKey="revenue" nameKey="name" outerRadius={95} innerRadius={48} paddingAngle={2} strokeWidth={0}>
                  {categoryRevenue.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatMoney(Number(value))} contentStyle={{ borderRadius: 16, border: '1px solid #ECEAF6', fontSize: 12 }} />
                <Legend formatter={(value) => <span className="text-xs text-brand-muted">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white rounded-3xl p-5 shadow-soft">
          <h3 className="font-display font-bold text-brand-ink mb-4">Orders by weekday</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekday} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECEAF6" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#777389' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#777389' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#F4F2FC' }} contentStyle={{ borderRadius: 16, border: '1px solid #ECEAF6', fontSize: 12 }} />
                <Bar dataKey="orders" fill="#7650E8" radius={[6, 6, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="bg-white rounded-3xl p-5 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-brand-ink">Top products (range)</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                exportCsv('siymon-report-top-products', ['Product', 'Units sold', 'Revenue'], top.map((t) => [t.name, t.qty, t.revenue]));
                toast.success('Top products exported.');
              }}
            >
              <Download className="w-4 h-4" aria-hidden /> Export
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-brand-muted">
                <th className="pb-3 font-bold">#</th>
                <th className="pb-3 font-bold">Product</th>
                <th className="pb-3 font-bold text-right">Units</th>
                <th className="pb-3 font-bold text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-ink/6">
              {top.map((t, i) => (
                <tr key={t.name}>
                  <td className="py-3 font-display font-extrabold text-brand-muted/60">{i + 1}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <SmartImage src={t.image} alt={t.name} className="w-9 h-9 rounded-lg" />
                      <span className="font-semibold">{t.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right font-bold">{t.qty}</td>
                  <td className="py-3 text-right font-bold">{formatMoney(t.revenue)}</td>
                </tr>
              ))}
              {top.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-brand-muted">No sales in the selected range.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="dark"
          onClick={() => {
            exportCsv('siymon-orders-full-demo', ['Order ID', 'Customer', 'Status', 'Total', 'Created'], orders.map((o) => [o.id, o.customerName, o.status, o.total, o.createdAt]));
            toast.success(`Exported ${orders.length} orders.`);
          }}
        >
          <Download className="w-4 h-4" aria-hidden /> Export all orders (CSV)
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            exportCsv('siymon-products-full-demo', ['Name', 'Price', 'Rating', 'Available'], products.map((p) => [p.name, p.price, p.rating, p.available ? 'yes' : 'no']));
            toast.success(`Exported ${products.length} products.`);
          }}
        >
          <Download className="w-4 h-4" aria-hidden /> Export products (CSV)
        </Button>
      </div>
    </div>
  );
}
