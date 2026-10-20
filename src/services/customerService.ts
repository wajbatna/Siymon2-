import { clone, delay, mutate } from '@/services/db';
import type { Customer } from '@/types';

export const customerService = {
  async list(): Promise<Customer[]> {
    return mutate((db) => clone(db.customers));
  },

  async updateStatus(id: string, status: Customer['status']): Promise<Customer[]> {
    await delay();
    return mutate((db) => {
      db.customers = db.customers.map((c) => (c.id === id ? { ...c, status } : c));
      return clone(db.customers);
    });
  },
};
