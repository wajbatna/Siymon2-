import { useMemo, useState } from 'react';
import { Download, Pencil, Plus, Search, Star, Trash2, X } from 'lucide-react';
import { ImagePicker } from '@/components/admin/ImagePicker';
import { Button } from '@/components/ui/Button';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Field, Input, Select, Textarea, Toggle } from '@/components/ui/Field';
import { ConfirmDialog, Modal } from '@/components/ui/Modal';
import { SmartImage } from '@/components/ui/SmartImage';
import { useDataStore } from '@/store/useDataStore';
import { toast } from '@/store/useToastStore';
import type { Product, ProductTag } from '@/types';
import { cn } from '@/utils/cn';
import { exportCsv } from '@/utils/csv';
import { formatMoney } from '@/utils/format';

interface FormState {
  id?: string;
  name: string;
  description: string;
  categoryId: string;
  restaurantId: string;
  price: string;
  oldPrice: string;
  image: string;
  prepTime: string;
  calories: string;
  tags: ProductTag[];
  featured: boolean;
  available: boolean;
  sizes: { id: string; label: string; delta: string }[];
  extras: { id: string; label: string; price: string }[];
}

const EMPTY_FORM: FormState = {
  name: '',
  description: '',
  categoryId: '',
  restaurantId: '',
  price: '',
  oldPrice: '',
  image: 'images/burger-classic.jpg',
  prepTime: '20',
  calories: '',
  tags: [],
  featured: false,
  available: true,
  sizes: [{ id: 'reg', label: 'Regular', delta: '0' }],
  extras: [],
};

const ALL_TAGS: ProductTag[] = ['popular', 'new', 'bestseller', 'offer'];

export function AdminProductsPage() {
  const { products, categories, restaurants, addProduct, editProduct, deleteProduct } = useDataStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [availability, setAvailability] = useState<'all' | 'available' | 'soldout'>('all');
  const [form, setForm] = useState<FormState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (category !== 'all' && p.categoryId !== category) return false;
      if (availability === 'available' && !p.available) return false;
      if (availability === 'soldout' && p.available) return false;
      return true;
    });
  }, [products, query, category, availability]);

  const openCreate = () => {
    setError(null);
    setForm({ ...EMPTY_FORM, categoryId: categories[0]?.id ?? '', restaurantId: restaurants[0]?.id ?? '' });
  };

  const openEdit = (p: Product) => {
    setError(null);
    setForm({
      id: p.id,
      name: p.name,
      description: p.description,
      categoryId: p.categoryId,
      restaurantId: p.restaurantId,
      price: String(p.price),
      oldPrice: p.oldPrice ? String(p.oldPrice) : '',
      image: p.image,
      prepTime: String(p.prepTime),
      calories: p.calories ? String(p.calories) : '',
      tags: [...p.tags],
      featured: p.featured,
      available: p.available,
      sizes: p.sizes.map((s) => ({ id: s.id, label: s.label, delta: String(s.delta) })),
      extras: p.extras.map((e) => ({ id: e.id, label: e.label, price: String(e.price) })),
    });
  };

  const save = async () => {
    if (!form) return;
    const price = Number(form.price);
    if (!form.name.trim() || Number.isNaN(price) || price <= 0) {
      setError('A name and a positive price are required.');
      return;
    }
    setBusy(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      categoryId: form.categoryId,
      restaurantId: form.restaurantId,
      price,
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      image: form.image,
      rating: 4.5,
      ratingCount: 12,
      prepTime: Number(form.prepTime) || 20,
      calories: form.calories ? Number(form.calories) : undefined,
      tags: form.tags,
      featured: form.featured,
      available: form.available,
      sizes: form.sizes.filter((s) => s.label.trim()).map((s, i) => ({ id: s.id || `s${i}`, label: s.label.trim(), delta: Number(s.delta) || 0 })),
      extras: form.extras.filter((e) => e.label.trim()).map((e, i) => ({ id: e.id || `x${i}`, label: e.label.trim(), price: Number(e.price) || 0 })),
    };
    try {
      if (form.id) {
        await editProduct(form.id, payload);
        toast.success(`Product “${payload.name}” updated.`);
      } else {
        await addProduct(payload);
        toast.success(`Product “${payload.name}” created.`);
      }
      setForm(null);
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    await deleteProduct(deleteTarget.id);
    setBusy(false);
    toast.info(`Product “${deleteTarget.name}” deleted.`);
    setDeleteTarget(null);
  };

  const toggleFeatured = async (p: Product) => {
    await editProduct(p.id, { featured: !p.featured });
    toast.success(`“${p.name}” ${p.featured ? 'removed from' : 'added to'} featured.`);
  };

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      sortValue: (p) => p.name,
      render: (p) => (
        <div className="flex items-center gap-3">
          <SmartImage src={p.image} alt={p.name} className="w-11 h-11 rounded-xl shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-sm line-clamp-1">{p.name}</p>
            <p className="text-[11px] text-brand-muted line-clamp-1">{p.description}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', hideOnMobile: true, render: (p) => <span className="text-xs font-semibold">{categories.find((c) => c.id === p.categoryId)?.name ?? '—'}</span> },
    { key: 'restaurant', header: 'Restaurant', hideOnMobile: true, render: (p) => <span className="text-xs text-brand-muted">{restaurants.find((r) => r.id === p.restaurantId)?.name ?? '—'}</span> },
    { key: 'price', header: 'Price', sortable: true, sortValue: (p) => p.price, render: (p) => <span className="font-bold text-sm">{formatMoney(p.price)}</span> },
    {
      key: 'featured',
      header: 'Featured',
      render: (p) => (
        <button onClick={(e) => { e.stopPropagation(); toggleFeatured(p); }} aria-label={p.featured ? 'Unfeature product' : 'Feature product'} className={cn('p-1.5 rounded-lg transition-colors', p.featured ? 'text-brand-yellow' : 'text-brand-ink/20 hover:text-brand-yellow')}>
          <Star className={cn('w-4 h-4', p.featured && 'fill-brand-yellow')} aria-hidden />
        </button>
      ),
    },
    {
      key: 'available',
      header: 'Available',
      render: (p) => (
        <Toggle checked={p.available} label={`Toggle availability for ${p.name}`} onChange={() => editProduct(p.id, { available: !p.available })} />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (p) => (
        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => openEdit(p)} aria-label={`Edit ${p.name}`} className="p-2 rounded-xl text-brand-muted hover:text-brand-purple hover:bg-brand-purple/10 transition-colors">
            <Pencil className="w-4 h-4" aria-hidden />
          </button>
          <button onClick={() => setDeleteTarget(p)} aria-label={`Delete ${p.name}`} className="p-2 rounded-xl text-brand-muted hover:text-danger hover:bg-danger/10 transition-colors">
            <Trash2 className="w-4 h-4" aria-hidden />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl p-4 shadow-soft flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" aria-hidden />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products…" className="pl-10" aria-label="Search products" />
        </div>
        <Select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)} className="md:w-48">
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
        <Select aria-label="Filter by availability" value={availability} onChange={(e) => setAvailability(e.target.value as typeof availability)} className="md:w-40">
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="soldout">Sold out</option>
        </Select>
        <div className="flex gap-2">
          <Button variant="outline" size="md" onClick={() => {
            exportCsv('siymon-products-demo', ['Name', 'Category', 'Price', 'Available', 'Featured', 'Rating'], filtered.map((p) => [p.name, categories.find((c) => c.id === p.categoryId)?.name ?? '', p.price, p.available ? 'yes' : 'no', p.featured ? 'yes' : 'no', p.rating]));
            toast.success('Products exported to CSV.');
          }}>
            <Download className="w-4 h-4" aria-hidden /> CSV
          </Button>
          <Button onClick={openCreate}><Plus className="w-4 h-4" aria-hidden /> Add product</Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-soft">
        <DataTable columns={columns} rows={filtered} rowKey={(p) => p.id} pageSize={8} emptyTitle="No products" emptyDescription="Create your first product or adjust the filters." />
      </div>

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? 'Edit product' : 'Add product'} size="xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setForm(null)}>Cancel</Button>
            <Button onClick={save} loading={busy}>{form?.id ? 'Save changes' : 'Create product'}</Button>
          </>
        }
      >
        {form && (
          <div className="space-y-5">
            {error && <p className="text-sm font-semibold text-danger bg-danger/8 rounded-xl px-4 py-2.5">{error}</p>}
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name" required htmlFor="p-name">
                <Input id="p-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Siymon Classic Burger" />
              </Field>
              <Field label="Price (MAD)" required htmlFor="p-price">
                <Input id="p-price" type="number" min="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="55" />
              </Field>
            </div>
            <Field label="Description" htmlFor="p-desc">
              <Textarea id="p-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Mouth-watering description…" />
            </Field>
            <div className="grid sm:grid-cols-4 gap-4">
              <Field label="Category" htmlFor="p-cat">
                <Select id="p-cat" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </Field>
              <Field label="Restaurant" htmlFor="p-rest">
                <Select id="p-rest" value={form.restaurantId} onChange={(e) => setForm({ ...form, restaurantId: e.target.value })}>
                  {restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </Select>
              </Field>
              <Field label="Old price (offer)" htmlFor="p-old">
                <Input id="p-old" type="number" min="0" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} placeholder="optional" />
              </Field>
              <Field label="Prep time (min)" htmlFor="p-prep">
                <Input id="p-prep" type="number" min="1" value={form.prepTime} onChange={(e) => setForm({ ...form, prepTime: e.target.value })} />
              </Field>
            </div>
            <Field label="Image">
              <ImagePicker value={form.image} onChange={(image) => setForm({ ...form, image })} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <p className="text-sm font-semibold text-brand-ink mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_TAGS.map((t) => {
                    const on = form.tags.includes(t);
                    return (
                      <button key={t} type="button" aria-pressed={on} onClick={() => setForm({ ...form, tags: on ? form.tags.filter((x) => x !== t) : [...form.tags, t] })}
                        className={cn('px-3.5 h-9 rounded-xl text-xs font-bold capitalize transition-colors', on ? 'bg-brand-purple text-white' : 'bg-brand-ink/6 text-brand-muted hover:bg-brand-purple/10 hover:text-brand-purple')}>
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-8">
                <label className="flex items-center gap-3 text-sm font-semibold text-brand-ink">
                  <Toggle checked={form.featured} onChange={(v) => setForm({ ...form, featured: v })} label="Featured" /> Featured
                </label>
                <label className="flex items-center gap-3 text-sm font-semibold text-brand-ink">
                  <Toggle checked={form.available} onChange={(v) => setForm({ ...form, available: v })} label="Available" /> Available
                </label>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-ink mb-2">Sizes / variations</p>
              <div className="space-y-2">
                {form.sizes.map((s, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={s.label} aria-label={`Size ${i + 1} label`} onChange={(e) => setForm({ ...form, sizes: form.sizes.map((x, xi) => (xi === i ? { ...x, label: e.target.value } : x)) })} placeholder="Small / Medium…" />
                    <Input type="number" value={s.delta} aria-label={`Size ${i + 1} price delta`} onChange={(e) => setForm({ ...form, sizes: form.sizes.map((x, xi) => (xi === i ? { ...x, delta: e.target.value } : x)) })} className="w-28" placeholder="+0" />
                    <button type="button" aria-label="Remove size" disabled={form.sizes.length === 1} onClick={() => setForm({ ...form, sizes: form.sizes.filter((_, xi) => xi !== i) })} className="p-2 rounded-xl text-brand-muted hover:text-danger disabled:opacity-30">
                      <X className="w-4 h-4" aria-hidden />
                    </button>
                  </div>
                ))}
                <Button size="sm" variant="soft" type="button" onClick={() => setForm({ ...form, sizes: [...form.sizes, { id: `s${form.sizes.length}`, label: '', delta: '0' }] })}>
                  <Plus className="w-3.5 h-3.5" aria-hidden /> Add size
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-ink mb-2">Extras & toppings</p>
              <div className="space-y-2">
                {form.extras.map((x, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={x.label} aria-label={`Extra ${i + 1} label`} onChange={(e) => setForm({ ...form, extras: form.extras.map((y, yi) => (yi === i ? { ...y, label: e.target.value } : y)) })} placeholder="Extra cheese…" />
                    <Input type="number" value={x.price} aria-label={`Extra ${i + 1} price`} onChange={(e) => setForm({ ...form, extras: form.extras.map((y, yi) => (yi === i ? { ...y, price: e.target.value } : y)) })} className="w-28" placeholder="8" />
                    <button type="button" aria-label="Remove extra" onClick={() => setForm({ ...form, extras: form.extras.filter((_, yi) => yi !== i) })} className="p-2 rounded-xl text-brand-muted hover:text-danger">
                      <X className="w-4 h-4" aria-hidden />
                    </button>
                  </div>
                ))}
                <Button size="sm" variant="soft" type="button" onClick={() => setForm({ ...form, extras: [...form.extras, { id: `x${form.extras.length}`, label: '', price: '0' }] })}>
                  <Plus className="w-3.5 h-3.5" aria-hidden /> Add extra
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this product?"
        message={`“${deleteTarget?.name ?? ''}” will be permanently removed from the demo catalog. This cannot be undone (except by resetting demo data).`}
        confirmLabel="Delete"
        danger
        loading={busy}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
