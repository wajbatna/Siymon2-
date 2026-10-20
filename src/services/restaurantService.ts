import { clone, delay, mutate } from '@/services/db';
import type { Restaurant } from '@/types';
import { uid } from '@/utils/id';

export type RestaurantInput = Omit<Restaurant, 'id'>;

export const restaurantService = {
  async list(): Promise<Restaurant[]> {
    return mutate((db) => clone(db.restaurants));
  },

  async create(input: RestaurantInput): Promise<Restaurant[]> {
    await delay();
    return mutate((db) => {
      db.restaurants = [{ ...input, id: uid('r') }, ...db.restaurants];
      return clone(db.restaurants);
    });
  },

  async update(id: string, patch: Partial<RestaurantInput>): Promise<Restaurant[]> {
    await delay();
    return mutate((db) => {
      db.restaurants = db.restaurants.map((r) => (r.id === id ? { ...r, ...patch } : r));
      return clone(db.restaurants);
    });
  },

  async remove(id: string): Promise<Restaurant[]> {
    await delay();
    return mutate((db) => {
      db.restaurants = db.restaurants.filter((r) => r.id !== id);
      return clone(db.restaurants);
    });
  },
};
