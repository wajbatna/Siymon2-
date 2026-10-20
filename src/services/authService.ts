import { clone, delay, mutate } from '@/services/db';
import type { User } from '@/types';
import { uid } from '@/utils/id';

/**
 * DEMO-ONLY authentication.
 * Credentials live in plain text inside localStorage — this is intentionally
 * insecure and must NEVER ship as a real auth system. Production requires a
 * trusted backend or an auth provider (Firebase Auth, Auth0, Supabase...).
 */
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    await delay(400);
    const user = mutate((db) =>
      clone(
        db.users.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
        ),
      ),
    );
    if (!user) throw new Error('Invalid email or password.');
    return user;
  },

  async register(input: RegisterInput): Promise<User> {
    await delay(400);
    const existing = mutate((db) =>
      db.users.some((u) => u.email.toLowerCase() === input.email.trim().toLowerCase()),
    );
    if (existing) throw new Error('An account with this email already exists.');
    return mutate((db) => {
      const user: User = {
        id: uid('cu'),
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        password: input.password,
        role: 'customer',
        phone: input.phone,
        address: input.address,
      };
      db.users = [...db.users, user];
      db.customers = [
        ...db.customers,
        {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone ?? '—',
          address: user.address ?? '—',
          joinedAt: new Date().toISOString(),
          status: 'active',
          ordersCount: 0,
          totalSpent: 0,
        },
      ];
      return clone(user);
    });
  },

  /** One-click demo session (documented on the login page). */
  async demoLogin(): Promise<User> {
    return this.login('demo@siymon.ma', 'demo1234');
  },

  async demoAdminLogin(): Promise<User> {
    return this.login('admin@siymon.ma', 'admin1234');
  },
};
