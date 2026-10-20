import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, type RegisterInput } from '@/services/authService';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,

      login: async (email, password) => {
        set({ loading: true });
        try {
          const user = await authService.login(email, password);
          set({ user });
          return user;
        } finally {
          set({ loading: false });
        }
      },

      register: async (input) => {
        set({ loading: true });
        try {
          const user = await authService.register(input);
          set({ user });
          return user;
        } finally {
          set({ loading: false });
        }
      },

      logout: () => set({ user: null }),
    }),
    { name: 'siymon.auth.v1' },
  ),
);
