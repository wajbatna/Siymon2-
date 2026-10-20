import { useState } from 'react';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select, Toggle } from '@/components/ui/Field';
import { ConfirmDialog, Modal } from '@/components/ui/Modal';
import { ImagePicker } from '@/components/admin/ImagePicker';
import { useDataStore } from '@/store/useDataStore';
import { toast } from '@/store/useToastStore';
import type { Category } from '@/types';

const ICON_CHOICES = ['Sandwich', 'Pizza', 'Fish', 'Drumstick', 'CookingPot', 'CakeSlice', 'CupSoda', 'Salad'];

interface FormState {
  id?: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  image: string;
  visible: boolean;
}

export function AdminCategoriesPage() {
  const { categories, products, addCategory, editCategory, deleteCategory, reorderCategories } = useDataStore();
  const [form, setForm] = useState<FormState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [busy, setBusy] = useState(false);

  const sorted = [...categories].sort((a, b) => a.order - b.order);

  const move = async (index: number, dir: -1 | 1) => {
    const ids = sorted.map((c) => c.id);
    const target = index + dir;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    await reorderCategories(ids);
  };

  const save = async () => {
    if (!form || !form.name.trim() || !form.slug.trim()) {
      toast.error('Name and slug are required.');
      return;
    }
    setBusy(true);
    if (form.id) {
      await editCategory(form.id, { name: form.name.trim(), slug: form.slug.trim(), icon: form.icon, color: form.color, image: form.image, visible: form.visible });
      toast.success(`Category “${form.name}” updated.`);
    } else {
      await addCategory({ name: form.name.trim(), slug: form.slug.trim(), icon: form.icon, color: form.color, image: form.image, visible: form.visible, order: sorted.length + 1 });
      toast.success(`Category “${form.name}” created.`);
    }
    setBusy(false);
    setForm(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    await deleteCategory(deleteTarget.id);
    setBusy(false);
    toast.info(`Category “${deleteTarget.name}” and its products were removed.`);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button onClick={() => setForm({ name: '', slug: '', icon: 'Sandwich', color: '#7650E8', image: 'images/burger-classic.jpg', visible: true })}>
          <Plus className="w-4 h-4" aria-hidden /> Add category
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {sorted.map((c, index) => {
          const count = products.filter((p) => p.categoryId === c.id).length;
          return (
            <div key={c.id} className="bg-white rounded-3xl p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0" style={{ backgroundColor: c.color }}>
                  <CategoryIcon name={c.icon} className="w-5 h-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-bold text-brand-ink line-clamp-1">{c.name}</p>
                  <p className="text-[11px] text-brand-muted">/{c.slug} · {count} products</p>
                </div>
                <Toggle checked={c.visible} label={`Toggle visibility for ${c.name}`} onChange={() => editCategory(c.id, { visible: !c.visible })} />
              </div>
              <div className="mt-4 pt-3 border-t border-brand-ink/6 flex items-center justify-between">
                <div className="flex gap-1">
                  <button onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move ${c.name} up`} className="p-1.5 rounded-lg text-brand-muted hover:bg-brand-ink/5 disabled:opacity-30"><ArrowUp className="w-4 h-4" aria-hidden /></button>
                  <button onClick={() => move(index, 1)} disabled={index === sorted.length - 1} aria-label={`Move ${c.name} down`} className="p-1.5 rounded-lg text-brand-muted hover:bg-brand-ink/5 disabled:opacity-30"><ArrowDown className="w-4 h-4" aria-hidden /></button>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setForm({ id: c.id, name: c.name, slug: c.slug, icon: c.icon, color: c.color, image: c.image, visible: c.visible })} aria-label={`Edit ${c.name}`} className="p-2 rounded-xl text-brand-muted hover:text-brand-purple hover:bg-brand-purple/10"><Pencil className="w-4 h-4" aria-hidden /></button>
                  <button onClick={() => setDeleteTarget(c)} aria-label={`Delete ${c.name}`} className="p-2 rounded-xl text-brand-muted hover:text-danger hover:bg-danger/10"><Trash2 className="w-4 h-4" aria-hidden /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? 'Edit category' : 'Add category'} size="lg"
        footer={<>
          <Button variant="outline" onClick={() => setForm(null)}>Cancel</Button>
          <Button onClick={save} loading={busy}>Save</Button>
        </>}
      >
        {form && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name" required htmlFor="c-name"><Input id="c-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Wraps" /></Field>
              <Field label="Slug (URL)" required htmlFor="c-slug" hint="lowercase, no spaces"><Input id="c-slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="wraps" /></Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Icon" htmlFor="c-icon">
                <Select id="c-icon" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                  {ICON_CHOICES.map((i) => <option key={i} value={i}>{i}</option>)}
                </Select>
              </Field>
              <Field label="Accent color" htmlFor="c-color"><Input id="c-color" type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="h-11 p-1.5" /></Field>
            </div>
            <Field label="Cover image"><ImagePicker value={form.image} onChange={(image) => setForm({ ...form, image })} /></Field>
            <label className="flex items-center gap-3 text-sm font-semibold text-brand-ink">
              <Toggle checked={form.visible} onChange={(v) => setForm({ ...form, visible: v })} label="Visible in store" /> Visible in store
            </label>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this category?"
        message={`“${deleteTarget?.name ?? ''}” and all of its products will be removed from the demo catalog.`}
        confirmLabel="Delete"
        danger
        loading={busy}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
