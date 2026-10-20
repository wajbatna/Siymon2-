import { clone, delay, mutate } from '@/services/db';
import type { Category } from '@/types';
import { uid } from '@/utils/id';

export type CategoryInput = Omit<Category, 'id'>;

export const categoryService = {
  async list(): Promise<Category[]> {
    return mutate((db) => clone(db.categories));
  },

  async create(input: CategoryInput): Promise<Category[]> {
    await delay();
    return mutate((db) => {
      const category: Category = { ...input, id: uid('c') };
      db.categories = [...db.categories, category];
      return clone(db.categories);
    });
  },

  async update(id: string, patch: Partial<CategoryInput>): Promise<Category[]> {
    await delay();
    return mutate((db) => {
      db.categories = db.categories.map((c) => (c.id === id ? { ...c, ...patch } : c));
      return clone(db.categories);
    });
  },

  async remove(id: string): Promise<Category[]> {
    await delay();
    return mutate((db) => {
      db.categories = db.categories.filter((c) => c.id !== id);
      db.products = db.products.filter((p) => p.categoryId !== id);
      return clone(db.categories);
    });
  },

  /** Persist a new display order (array of category ids). */
  async reorder(ids: string[]): Promise<Category[]> {
    await delay(80);
    return mutate((db) => {
      db.categories = ids
        .map((id, index) => {
          const found = db.categories.find((c) => c.id === id);
          return found ? { ...found, order: index + 1 } : null;
        })
        .filter((c): c is Category => c !== null)
        .concat(db.categories.filter((c) => !ids.includes(c.id)));
      return clone(db.categories);
    });
  },
};
