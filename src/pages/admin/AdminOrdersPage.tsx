import { useMemo, useState } from 'react';
import { Download, Eye, Search } from 'lucide-react';
import { PaymentBadge, StatusBadge, ORDER_STATUS_META } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Input, Select } from '@/components/ui/Field';
import { ConfirmDialog, Modal } from '@/components/ui/Modal';
import { SmartImage } from '@/components/ui/SmartImage';
import { orderService } from '@/services/orderService';
import { useDataStore } from '@/store/useDataStore';
import { toast } from '@/store/useToastStore';
import type { Order, OrderStatus } from '@/types';
import { exportCsv } from '@/utils/csv';
import { formatDate, formatDateTime, formatMoney } from '@/utils/format';

const STATUS_OPTIONS = Object.entries(ORDER_STATUS_META) as [OrderStatus, { label: string }][];

export function AdminOrdersPage() {
  const { orders, drivers, setOrderStatus } = useDataStore();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | OrderStatus>('all');
  const [payment, setPayment] = useState<'all' | 'cash' | 'card' | 'wallet'>('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (q && !(o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.phone.includes(q))) return false;
      if (status !== 'all' && o.status !== status) return false;
      if (payment !== 'all' && o.paymentMethod !== payment) return false;
      if (from && new Date(o.createdAt) < new Date(from)) return false;
      if (to && new Date(o.createdAt) > new Date(`${to}T23:59:59`)) return false;
      return true;
    });
  }, [orders, query, status, payment, from, to]);

  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Order ID',
      sortable: true,
      sortValue: (o) => o.id,
      render: (o) => <span className="font-mono text-xs font-bold text-brand-purple">{o.id}</span>,
    },
    {
      key: 'customer',
      header: 'Customer',
      sortable: true,
      sortValue: (o) => o.customerName,
      render: (o) => (
        <div>
          <p className="font-semibold text-sm">{o.customerName}</p>
          <p className="text-[11px] text-brand-muted">{o.phone}</p>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Items',
      hideOnMobile: true,
      render: (o) => (
        <div className="flex items-center gap-1.5">
          {o.items.slice(0, 3).map((it) => (
            <SmartImage key={it.key} src={it.image} alt={it.name} className="w-8 h-8 rounded-lg" />
          ))}
          <span className="text-xs text-brand-muted ml-1">{o.items.reduce((s, i) => s + i.qty, 0)} pcs</span>
        </div>
      ),
    },
    { key: 'total', header: 'Total', sortable: true, sortValue: (o) => o.total, render: (o) => <span className="font-bold">{formatMoney(o.total)}</span> },
    {
      key: 'payment',
      header: 'Payment',
      hideOnMobile: true,
      render: (o) => (
        <div className="space-y-1">
          <PaymentBadge status={o.paymentStatus} />
          <p className="text-[11px] text-brand-muted capitalize">{o.paymentMethod}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Delivery status',
      sortable: true,
      sortValue: (o) => o.status,
      render: (o) => <StatusBadge status={o.status} />,
    },
    { key: 'date', header: 'Date', sortable: true, sortValue: (o) => o.createdAt, hideOnMobile: true, render: (o) => <span className="text-xs text-brand-muted">{formatDate(o.createdAt)}</span> },
    {
      key: 'actions',
      header: 'Actions',
      render: (o) => (
        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" variant="soft" onClick={() => setSelected(o)}>
            <Eye className="w-3.5 h-3.5" aria-hidden /> View
          </Button>
        </div>
      ),
    },
  ];

  const exportRows = () => {
    exportCsv(
      'siymon-orders-demo',
      ['Order ID', 'Customer', 'Phone', 'Items', 'Subtotal', 'Discount', 'Delivery fee', 'Total', 'Payment method', 'Payment status', 'Status', 'Created at'],
      filtered.map((o) => [
        o.id,
        o.customerName,
        o.phone,
        o.items.map((i) => `${i.qty}x ${i.name}`).join(' | '),
        o.subtotal,
        o.discount,
        o.deliveryFee,
        o.total,
        o.paymentMethod,
        o.paymentStatus,
        o.status,
        o.createdAt,
      ]),
    );
    toast.success(`Exported ${filtered.length} orders to CSV.`);
  };

  const changeStatus = async (id: string, next: OrderStatus) => {
    setBusy(true);
    await setOrderStatus(id, next);
    setBusy(false);
    setSelected((s) => (s && s.id === id ? { ...s, status: next } : s));
    toast.success(`Order ${id} → ${ORDER_STATUS_META[next].label}`);
  };

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    setBusy(true);
    await setOrderStatus(cancelTarget.id, 'cancelled');
    setBusy(false);
    toast.info(`Order ${cancelTarget.id} cancelled.`);
    setCancelTarget(null);
    setSelected(null);
  };

  const driverName = (id?: string | null) => drivers.find((d) => d.id === id)?.name ?? 'Unassigned';

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl p-4 shadow-soft grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <div className="relative xl:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" aria-hidden />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search id, customer, phone…" className="pl-10" aria-label="Search orders" />
        </div>
        <Select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map(([key, meta]) => (
            <option key={key} value={key}>{meta.label}</option>
          ))}
        </Select>
        <Select aria-label="Filter by payment method" value={payment} onChange={(e) => setPayment(e.target.value as typeof payment)}>
          <option value="all">All payments</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="wallet">Wallet</option>
        </Select>
        <Input type="date" aria-label="From date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <Input type="date" aria-label="To date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-brand-muted"><span className="font-bold text-brand-ink">{filtered.length}</span> orders match the current filters</p>
        <Button variant="outline" size="sm" onClick={exportRows}>
          <Download className="w-4 h-4" aria-hidden /> Export CSV
        </Button>
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-soft">
        <DataTable
          columns={columns}
          rows={filtered}
          rowKey={(o) => o.id}
          pageSize={8}
          onRowClick={setSelected}
          emptyTitle="No orders match"
          emptyDescription="Adjust the filters above, or place a demo order from the store to see it here."
        />
      </div>

      {/* details modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Order ${selected?.id ?? ''}`} size="lg"
        footer={
          selected && (
            <>
              {orderService.canCancel(selected) && (
                <Button variant="danger" onClick={() => setCancelTarget(selected)} className="mr-auto">Cancel order</Button>
              )}
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={selected.status} />
              <PaymentBadge status={selected.paymentStatus} />
              <span className="text-xs text-brand-muted">· {formatDateTime(selected.createdAt)} · driver: {driverName(selected.driverId)}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl bg-brand-cream/70 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1.5">Customer</p>
                <p className="font-semibold text-brand-ink">{selected.customerName}</p>
                <p className="text-xs text-brand-muted mt-0.5">{selected.phone}</p>
                <p className="text-xs text-brand-muted mt-0.5">{selected.address}</p>
              </div>
              <div className="rounded-2xl bg-brand-cream/70 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1.5">Update status</p>
                <Select aria-label="Update order status" value={selected.status} onChange={(e) => changeStatus(selected.id, e.target.value as OrderStatus)} disabled={busy}>
                  {STATUS_OPTIONS.map(([key, meta]) => (
                    <option key={key} value={key}>{meta.label}</option>
                  ))}
                </Select>
                {orderService.canCancel(selected) && <p className="text-[11px] text-brand-muted mt-2">Orders can be cancelled while pending or confirmed.</p>}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2.5">Items</p>
              <ul className="divide-y divide-brand-ink/6 rounded-2xl border border-brand-ink/8">
                {selected.items.map((it) => (
                  <li key={it.key} className="flex items-center gap-3 p-3">
                    <SmartImage src={it.image} alt={it.name} className="w-12 h-12 rounded-xl shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-brand-ink line-clamp-1">{it.name}</p>
                      <p className="text-[11px] text-brand-muted">{it.qty} × {formatMoney(it.unitPrice)} · {it.size?.label}{it.extras.length > 0 && ` · ${it.extras.map((e) => e.label).join(', ')}`}</p>
                    </div>
                    <span className="text-sm font-bold">{formatMoney(it.unitPrice * it.qty)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div><dt className="text-xs text-brand-muted">Subtotal</dt><dd className="font-bold">{formatMoney(selected.subtotal)}</dd></div>
              <div><dt className="text-xs text-brand-muted">Discount</dt><dd className="font-bold text-success">−{formatMoney(selected.discount)}</dd></div>
              <div><dt className="text-xs text-brand-muted">Delivery</dt><dd className="font-bold">{selected.deliveryFee === 0 ? 'Free' : formatMoney(selected.deliveryFee)}</dd></div>
              <div><dt className="text-xs text-brand-muted">Total</dt><dd className="font-display font-extrabold text-brand-purple">{formatMoney(selected.total)}</dd></div>
            </dl>
            {selected.notes && <p className="text-xs italic text-brand-muted bg-brand-cream rounded-xl px-3 py-2">“{selected.notes}”</p>}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!cancelTarget}
        title="Cancel this order?"
        message={`Order ${cancelTarget?.id ?? ''} will be cancelled and marked refunded in the demo data.`}
        confirmLabel="Cancel order"
        danger
        loading={busy}
        onConfirm={confirmCancel}
        onClose={() => setCancelTarget(null)}
      />
    </div>
  );
}
