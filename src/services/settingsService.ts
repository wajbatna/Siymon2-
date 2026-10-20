import { clone, delay, mutate } from '@/services/db';
import type { AppSettings } from '@/types';

export const settingsService = {
  async get(): Promise<AppSettings> {
    return mutate((db) => clone(db.settings));
  },

  async update(patch: Partial<AppSettings>): Promise<AppSettings> {
    await delay();
    return mutate((db) => {
      db.settings = { ...db.settings, ...patch };
      return clone(db.settings);
    });
  },
};
