import { useState } from 'react';
import { Pencil, Percent, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select, Toggle } from '@/components/ui/Field';
import { ConfirmDialog, Modal } from '@/components/ui/Modal';
import { useDataStore } from '@/store/useDataStore';
import { toast } from '@/store/useToastStore';
import type { Coupon } from '@/types';
import { formatDate, formatMoney } from '@/utils/format';

interface FormState {
  id?: string;
  code: string;
  type: 'percent' | 'fixed';
  value: string;
  minOrder: string;
  expiresAt: string;
  active: boolean;
}

export function AdminPromotionsPage() {
  const { coupons, addCoupon, editCoupon, deleteCoupon } = useDataStore();
  const [form, setForm] = useState<FormState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!form) return;
    const value = Number(form.value);
    if (!form.code.trim() || Number.isNaN(value) || value <= 0 || (form.type === 'percent' && value > 90)) {
      toast.error('Enter a code and a valid value (percent ≤ 90).');
      return;
    }
    setBusy(true);
    const payload = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value,
      minOrder: Number(form.minOrder) || 0,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
      active: form.active,
    };
    if (form.id) {
      await editCoupon(form.id, payload);
      toast.success(`Coupon ${payload.code} updated.`);
    } else {
      await addCoupon(payload);
      toast.success(`Coupon ${payload.code} created — try it in the cart!`);
    }
    setBusy(false);
    setForm(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    await deleteCoupon(deleteTarget.id);
    setBusy(false);
    toast.info(`Coupon ${deleteTarget.code} deleted.`);
    setDeleteTarget(null);
  };

  const isExpired = (c: Coupon) => new Date(c.expiresAt).getTime() < Date.now();

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button onClick={() => setForm({ code: '', type: 'percent', value: '10', minOrder: '100', expiresAt: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10), active: true })}>
          <Plus className="w-4 h-4" aria-hidden /> Create coupon
        </Button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {coupons.map((c) => (
          <article key={c.id} className="bg-white rounded-3xl p-5 shadow-soft relative overflow-hidden">
            <Percent className="absolute -right-4 -bottom-4 w-24 h-24 text-brand-purple/6" aria-hidden />
            <div className="flex items-start justify-between gap-2">
              <span className="font-mono font-extrabold text-brand-purple text-lg">{c.code}</span>
              <Badge tone={!c.active ? 'neutral' : isExpired(c) ? 'danger' : 'success'}>
                {!c.active ? 'Inactive' : isExpired(c) ? 'Expired' : 'Active'}
              </Badge>
            </div>
            <p className="mt-2 font-display text-2xl font-extrabold text-brand-ink">
              {c.type === 'percent' ? `${c.value}% off` : `${formatMoney(c.value)} off`}
            </p>
            <ul className="mt-3 space-y-1 text-xs text-brand-muted">
              <li>Min order: <span className="font-semibold text-brand-ink">{formatMoney(c.minOrder)}</span></li>
              <li>Expires: <span className="font-semibold text-brand-ink">{formatDate(c.expiresAt)}</span></li>
              <li>Used <span className="font-semibold text-brand-ink">{c.usageCount}</span> times</li>
            </ul>
            <div className="mt-4 pt-3 border-t border-brand-ink/6 flex items-center justify-between">
              <Toggle checked={c.active} label={`Toggle active for ${c.code}`} onChange={() => editCoupon(c.id, { active: !c.active })} />
              <div className="flex gap-1">
                <button onClick={() => setForm({ id: c.id, code: c.code, type: c.type, value: String(c.value), minOrder: String(c.minOrder), expiresAt: c.expiresAt.slice(0, 10), active: c.active })} aria-label={`Edit ${c.code}`} className="p-2 rounded-xl text-brand-muted hover:text-brand-purple hover:bg-brand-purple/10"><Pencil className="w-4 h-4" aria-hidden /></button>
                <button onClick={() => setDeleteTarget(c)} aria-label={`Delete ${c.code}`} className="p-2 rounded-xl text-brand-muted hover:text-danger hover:bg-danger/10"><Trash2 className="w-4 h-4" aria-hidden /></button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? 'Edit coupon' : 'Create coupon'} size="md"
        footer={<>
          <Button variant="outline" onClick={() => setForm(null)}>Cancel</Button>
          <Button onClick={save} loading={busy}>Save coupon</Button>
        </>}
      >
        {form && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Code" required htmlFor="cp-code"><Input id="cp-code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SIYMON25" /></Field>
              <Field label="Type" htmlFor="cp-type">
                <Select id="cp-type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'percent' | 'fixed' })}>
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed amount</option>
                </Select>
              </Field>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label={form.type === 'percent' ? 'Value (%)' : 'Value (amount)'} required htmlFor="cp-value"><Input id="cp-value" type="number" min="1" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></Field>
              <Field label="Min order" htmlFor="cp-min"><Input id="cp-min" type="number" min="0" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} /></Field>
              <Field label="Expires" htmlFor="cp-exp"><Input id="cp-exp" type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} /></Field>
            </div>
            <label className="flex items-center gap-3 text-sm font-semibold text-brand-ink">
              <Toggle checked={form.active} onChange={(v) => setForm({ ...form, active: v })} label="Active" /> Active immediately
            </label>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteTarget} title="Delete this coupon?" message={`Code ${deleteTarget?.code ?? ''} will no longer be accepted at checkout.`} confirmLabel="Delete" danger loading={busy} onConfirm={confirmDelete} onClose={() => setDeleteTarget(null)} />
    </div>
  );
}
