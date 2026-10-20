import { useMemo, useState } from 'react';
import { Eye, Mail, Phone, Search } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Input, Select } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { useDataStore } from '@/store/useDataStore';
import { toast } from '@/store/useToastStore';
import type { Customer } from '@/types';
import { formatDate, formatMoney } from '@/utils/format';

export function AdminCustomersPage() {
  const { customers, orders, setCustomerStatus } = useDataStore();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'blocked'>('all');
  const [selected, setSelected] = useState<Customer | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => {
      if (q && !(c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))) return false;
      if (status !== 'all' && c.status !== status) return false;
      return true;
    });
  }, [customers, query, status]);

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Customer',
      sortable: true,
      sortValue: (c) => c.name,
      render: (c) => (
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-brand-gradient text-white flex items-center justify-center font-bold text-sm shrink-0">{c.name.charAt(0)}</span>
          <div className="min-w-0">
            <p className="font-semibold text-sm line-clamp-1">{c.name}</p>
            <p className="text-[11px] text-brand-muted line-clamp-1">{c.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'joined', header: 'Joined', sortable: true, sortValue: (c) => c.joinedAt, hideOnMobile: true, render: (c) => <span className="text-xs text-brand-muted">{formatDate(c.joinedAt)}</span> },
    { key: 'orders', header: 'Orders', sortable: true, sortValue: (c) => c.ordersCount, render: (c) => <span className="font-bold text-sm">{c.ordersCount}</span> },
    { key: 'spent', header: 'Total spent', sortable: true, sortValue: (c) => c.totalSpent, render: (c) => <span className="font-bold text-sm">{formatMoney(c.totalSpent)}</span> },
    { key: 'status', header: 'Status', render: (c) => <Badge tone={c.status === 'active' ? 'success' : 'danger'}>{c.status}</Badge> },
    {
      key: 'actions',
      header: 'Actions',
      render: (c) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" variant="soft" onClick={() => setSelected(c)}><Eye className="w-3.5 h-3.5" aria-hidden /> Details</Button>
          <Button size="sm" variant={c.status === 'active' ? 'danger' : 'outline'} onClick={async () => {
            await setCustomerStatus(c.id, c.status === 'active' ? 'blocked' : 'active');
            toast.success(`${c.name} is now ${c.status === 'active' ? 'blocked' : 'active'}.`);
          }}>
            {c.status === 'active' ? 'Block' : 'Unblock'}
          </Button>
        </div>
      ),
    },
  ];

  const selectedOrders = selected ? orders.filter((o) => o.customerId === selected.id) : [];

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl p-4 shadow-soft flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" aria-hidden />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or email…" className="pl-10" aria-label="Search customers" />
        </div>
        <Select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="sm:w-44">
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </Select>
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-soft">
        <DataTable columns={columns} rows={filtered} rowKey={(c) => c.id} pageSize={8} onRowClick={setSelected} emptyTitle="No customers" emptyDescription="Customers appear here when they register or place demo orders." />
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''} size="lg">
        {selected && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl bg-brand-cream/70 p-4 space-y-2">
                <p className="flex items-center gap-2 text-brand-muted"><Mail className="w-4 h-4" aria-hidden /> {selected.email}</p>
                <p className="flex items-center gap-2 text-brand-muted"><Phone className="w-4 h-4" aria-hidden /> {selected.phone}</p>
                <p className="text-brand-muted">{selected.address}</p>
              </div>
              <div className="rounded-2xl bg-brand-cream/70 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">Lifetime value</p>
                <p className="font-display text-2xl font-extrabold text-brand-ink mt-1">{formatMoney(selected.totalSpent)}</p>
                <p className="text-xs text-brand-muted mt-0.5">{selected.ordersCount} orders · joined {formatDate(selected.joinedAt)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2.5">Order history</p>
              {selectedOrders.length === 0 ? (
                <p className="text-sm text-brand-muted">No orders recorded for this customer.</p>
              ) : (
                <ul className="divide-y divide-brand-ink/6 rounded-2xl border border-brand-ink/8">
                  {selectedOrders.slice(0, 8).map((o) => (
                    <li key={o.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                      <span className="font-mono text-xs font-bold text-brand-purple">{o.id}</span>
                      <span className="text-xs text-brand-muted">{formatDate(o.createdAt)}</span>
                      <Badge tone={o.status === 'delivered' ? 'success' : o.status === 'cancelled' ? 'danger' : 'info'}>{o.status.replace('_', ' ')}</Badge>
                      <span className="font-bold">{formatMoney(o.total)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className="text-[11px] text-brand-muted">Only non-sensitive demo fields are shown. Production systems must follow data-protection rules (minimize PII, add consent & deletion flows).</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
