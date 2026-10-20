import { clone, delay, mutate } from '@/services/db';
import type { Driver } from '@/types';

export const driverService = {
  async list(): Promise<Driver[]> {
    return mutate((db) => clone(db.drivers));
  },

  async toggleAvailable(id: string): Promise<Driver[]> {
    await delay();
    return mutate((db) => {
      db.drivers = db.drivers.map((d) => (d.id === id ? { ...d, available: !d.available } : d));
      return clone(db.drivers);
    });
  },

  async update(id: string, patch: Partial<Driver>): Promise<Driver[]> {
    await delay();
    return mutate((db) => {
      db.drivers = db.drivers.map((d) => (d.id === id ? { ...d, ...patch } : d));
      return clone(db.drivers);
    });
  },
};
