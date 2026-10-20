import { clone, delay, mutate } from '@/services/db';
import type { Product } from '@/types';
import { uid } from '@/utils/id';

export type ProductInput = Omit<Product, 'id' | 'createdAt'>;

export const productService = {
  async list(): Promise<Product[]> {
    return mutate((db) => clone(db.products));
  },

  async get(id: string): Promise<Product | undefined> {
    return mutate((db) => clone(db.products.find((p) => p.id === id)));
  },

  async create(input: ProductInput): Promise<Product[]> {
    await delay();
    return mutate((db) => {
      const product: Product = { ...input, id: uid('p'), createdAt: new Date().toISOString() };
      db.products = [product, ...db.products];
      return clone(db.products);
    });
  },

  async update(id: string, patch: Partial<ProductInput>): Promise<Product[]> {
    await delay();
    return mutate((db) => {
      db.products = db.products.map((p) => (p.id === id ? { ...p, ...patch } : p));
      return clone(db.products);
    });
  },

  async remove(id: string): Promise<Product[]> {
    await delay();
    return mutate((db) => {
      db.products = db.products.filter((p) => p.id !== id);
      return clone(db.products);
    });
  },
};
