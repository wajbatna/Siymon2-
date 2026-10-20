import { useMemo, useState } from 'react';
import { Clock, MapPin, Pencil, Phone, Plus, Star, Trash2 } from 'lucide-react';
import { ImagePicker } from '@/components/admin/ImagePicker';
import { Button } from '@/components/ui/Button';
import { Field, Input, Toggle } from '@/components/ui/Field';
import { ConfirmDialog, Modal } from '@/components/ui/Modal';
import { SmartImage } from '@/components/ui/SmartImage';
import { useDataStore } from '@/store/useDataStore';
import { toast } from '@/store/useToastStore';
import type { Restaurant } from '@/types';

interface FormState {
  id?: string;
  name: string;
  cuisine: string;
  address: string;
  phone: string;
  openingHours: string;
  deliveryTime: string;
  image: string;
  active: boolean;
  featured: boolean;
}

export function AdminRestaurantsPage() {
  const { restaurants, products, addRestaurant, editRestaurant, deleteRestaurant } = useDataStore();
  const [query, setQuery] = useState('');
  const [form, setForm] = useState<FormState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Restaurant | null>(null);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => restaurants.filter((r) => r.name.toLowerCase().includes(query.toLowerCase())), [restaurants, query]);

  const save = async () => {
    if (!form || !form.name.trim()) {
      toast.error('Restaurant name is required.');
      return;
    }
    setBusy(true);
    const payload = {
      name: form.name.trim(),
      cuisine: form.cuisine.split(',').map((s) => s.trim()).filter(Boolean),
      address: form.address.trim(),
      phone: form.phone.trim(),
      openingHours: form.openingHours.trim(),
      deliveryTime: form.deliveryTime.trim() || '25-40 min',
      image: form.image,
      rating: 4.5,
      active: form.active,
      featured: form.featured,
    };
    if (form.id) {
      await editRestaurant(form.id, payload);
      toast.success(`Restaurant “${payload.name}” updated.`);
    } else {
      await addRestaurant(payload);
      toast.success(`Restaurant “${payload.name}” created.`);
    }
    setBusy(false);
    setForm(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    await deleteRestaurant(deleteTarget.id);
    setBusy(false);
    toast.info(`Restaurant “${deleteTarget.name}” removed.`);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search restaurants…" aria-label="Search restaurants" className="sm:max-w-xs" />
        <Button onClick={() => setForm({ name: '', cuisine: '', address: '', phone: '', openingHours: '11:00 - 23:00', deliveryTime: '25-40 min', image: 'images/moroccan-feast.jpg', active: true, featured: false })}>
          <Plus className="w-4 h-4" aria-hidden /> Add restaurant
        </Button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((r) => {
          const catalog = products.filter((p) => p.restaurantId === r.id);
          return (
            <article key={r.id} className="bg-white rounded-3xl overflow-hidden shadow-soft">
              <div className="relative h-36">
                <SmartImage src={r.image} alt={r.name} className="absolute inset-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <h3 className="font-display font-bold text-white">{r.name}</h3>
                    <p className="text-[11px] text-white/70">{r.cuisine.join(' · ')}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-white/15 backdrop-blur rounded-full px-2.5 py-1">
                    <Star className="w-3 h-3 fill-brand-yellow text-brand-yellow" aria-hidden /> {r.rating.toFixed(1)}
                  </span>
                </div>
                <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${r.active ? 'bg-success text-white' : 'bg-white/90 text-brand-ink'}`}>
                  {r.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="p-4">
                <ul className="space-y-1.5 text-xs text-brand-muted">
                  <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden />{r.address}</li>
                  <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0" aria-hidden />{r.phone}</li>
                  <li className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 shrink-0" aria-hidden />{r.openingHours} · {r.deliveryTime}</li>
                </ul>
                <div className="mt-4 pt-3 border-t border-brand-ink/6 flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-muted">{catalog.length} products</span>
                  <div className="flex items-center gap-2">
                    <Toggle checked={r.active} label={`Toggle active for ${r.name}`} onChange={() => editRestaurant(r.id, { active: !r.active })} />
                    <button onClick={() => setForm({ id: r.id, name: r.name, cuisine: r.cuisine.join(', '), address: r.address, phone: r.phone, openingHours: r.openingHours, deliveryTime: r.deliveryTime, image: r.image, active: r.active, featured: r.featured })} aria-label={`Edit ${r.name}`} className="p-2 rounded-xl text-brand-muted hover:text-brand-purple hover:bg-brand-purple/10"><Pencil className="w-4 h-4" aria-hidden /></button>
                    <button onClick={() => setDeleteTarget(r)} aria-label={`Delete ${r.name}`} className="p-2 rounded-xl text-brand-muted hover:text-danger hover:bg-danger/10"><Trash2 className="w-4 h-4" aria-hidden /></button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? 'Edit restaurant' : 'Add restaurant'} size="lg"
        footer={<>
          <Button variant="outline" onClick={() => setForm(null)}>Cancel</Button>
          <Button onClick={save} loading={busy}>Save</Button>
        </>}
      >
        {form && (
          <div className="space-y-4">
            <Field label="Name" required htmlFor="r-name"><Input id="r-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Casa Napoli" /></Field>
            <Field label="Cuisine categories (comma separated)" htmlFor="r-cuisine"><Input id="r-cuisine" value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value })} placeholder="Italian, Pizza, Pasta" /></Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Phone" htmlFor="r-phone"><Input id="r-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+212 5XX XXX XXX" /></Field>
              <Field label="Opening hours" htmlFor="r-hours"><Input id="r-hours" value={form.openingHours} onChange={(e) => setForm({ ...form, openingHours: e.target.value })} /></Field>
            </div>
            <Field label="Address" htmlFor="r-address"><Input id="r-address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
            <Field label="Delivery time estimate" htmlFor="r-time"><Input id="r-time" value={form.deliveryTime} onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })} placeholder="25-40 min" /></Field>
            <Field label="Logo / cover image"><ImagePicker value={form.image} onChange={(image) => setForm({ ...form, image })} /></Field>
            <div className="flex gap-8">
              <label className="flex items-center gap-3 text-sm font-semibold text-brand-ink"><Toggle checked={form.active} onChange={(v) => setForm({ ...form, active: v })} label="Active" /> Active</label>
              <label className="flex items-center gap-3 text-sm font-semibold text-brand-ink"><Toggle checked={form.featured} onChange={(v) => setForm({ ...form, featured: v })} label="Featured" /> Featured</label>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteTarget} title="Delete this restaurant?" message={`“${deleteTarget?.name ?? ''}” will be removed. Its products stay in the catalog but lose their restaurant link.`} confirmLabel="Delete" danger loading={busy} onConfirm={confirmDelete} onClose={() => setDeleteTarget(null)} />
    </div>
  );
}
