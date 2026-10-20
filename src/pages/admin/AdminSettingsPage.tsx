import { useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Field';
import { ConfirmDialog } from '@/components/ui/Modal';
import { useDataStore } from '@/store/useDataStore';
import { toast } from '@/store/useToastStore';
import type { AppSettings } from '@/types';

const CURRENCIES = [
  { code: 'MAD', symbol: 'MAD' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
];

export function AdminSettingsPage() {
  const { settings, saveSettings, resetDemoData } = useDataStore();
  const [form, setForm] = useState<AppSettings>({ ...settings });
  const [busy, setBusy] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  const set = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => setForm((f) => ({ ...f, [key]: value }));

  const save = async () => {
    setBusy(true);
    const symbol = CURRENCIES.find((c) => c.code === form.currency)?.symbol ?? form.currency;
    await saveSettings({ ...form, currencySymbol: symbol });
    setBusy(false);
    toast.success('Settings saved (demo, stored locally).');
  };

  return (
    <div className="max-w-3xl space-y-6">
      <section className="bg-white rounded-3xl p-6 shadow-soft">
        <h2 className="font-display text-lg font-bold text-brand-ink mb-5">Brand</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Brand name" htmlFor="s-brand"><Input id="s-brand" value={form.brandName} onChange={(e) => set('brandName', e.target.value)} /></Field>
          <Field label="Tagline" htmlFor="s-tag"><Input id="s-tag" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} /></Field>
        </div>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <Field label="Theme accent" htmlFor="s-theme" hint="Visual presets for future expansion">
            <Select id="s-theme" value={form.theme} onChange={(e) => set('theme', e.target.value as AppSettings['theme'])}>
              <option value="purple">Purple (default)</option>
              <option value="sunset">Sunset</option>
              <option value="ocean">Ocean</option>
            </Select>
          </Field>
          <Field label="Currency" htmlFor="s-currency">
            <Select id="s-currency" value={form.currency} onChange={(e) => set('currency', e.target.value)}>
              {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
            </Select>
          </Field>
        </div>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-soft">
        <h2 className="font-display text-lg font-bold text-brand-ink mb-5">Delivery & fees</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Delivery fee" htmlFor="s-fee"><Input id="s-fee" type="number" min="0" value={String(form.deliveryFee)} onChange={(e) => set('deliveryFee', Number(e.target.value))} /></Field>
          <Field label="Free delivery over" htmlFor="s-free"><Input id="s-free" type="number" min="0" value={String(form.freeDeliveryThreshold)} onChange={(e) => set('freeDeliveryThreshold', Number(e.target.value))} /></Field>
        </div>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-soft">
        <h2 className="font-display text-lg font-bold text-brand-ink mb-5">Contact & website</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Support email" htmlFor="s-email"><Input id="s-email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></Field>
          <Field label="Support phone" htmlFor="s-phone"><Input id="s-phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
          <div className="sm:col-span-2">
            <Field label="Head office address" htmlFor="s-address"><Input id="s-address" value={form.address} onChange={(e) => set('address', e.target.value)} /></Field>
          </div>
          <Field label="Facebook URL" htmlFor="s-fb"><Input id="s-fb" value={form.facebook} onChange={(e) => set('facebook', e.target.value)} /></Field>
          <Field label="Instagram URL" htmlFor="s-ig"><Input id="s-ig" value={form.instagram} onChange={(e) => set('instagram', e.target.value)} /></Field>
        </div>
      </section>

      <div className="flex justify-end">
        <Button size="lg" onClick={save} loading={busy}><Save className="w-4 h-4" aria-hidden /> Save settings</Button>
      </div>

      <section className="bg-danger/5 border border-danger/20 rounded-3xl p-6">
        <h2 className="font-display text-lg font-bold text-danger mb-2">Danger zone</h2>
        <p className="text-sm text-brand-muted">Resetting restores the original seed data: products, categories, restaurants, orders, coupons and settings. Your cart and demo account session are kept.</p>
        <Button variant="danger" className="mt-4" onClick={() => setResetOpen(true)}>
          <RotateCcw className="w-4 h-4" aria-hidden /> Reset demo data
        </Button>
      </section>

      <ConfirmDialog
        open={resetOpen}
        title="Reset all demo data?"
        message="Every local change (products, orders, coupons, settings) will be replaced by the original seed data."
        confirmLabel="Reset everything"
        danger
        onConfirm={async () => {
          await resetDemoData();
          setForm({ ...useDataStore.getState().settings });
          setResetOpen(false);
          toast.success('Demo data restored to factory seed.');
        }}
        onClose={() => setResetOpen(false)}
      />
    </div>
  );
}
