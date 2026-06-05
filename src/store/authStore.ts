import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '@/types/auth';

interface AuthState {
  user: {
    name: string;
    email: string;
    role: UserRole;
  } | null;
  isAuthenticated: boolean;
  setAuth: (user: { name: string; email: string; role: UserRole }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (user) => set({ user, isAuthenticated: true }),
      clearAuth: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'flowia-auth',
      partialize: (state) => ({
        user: state.user ? { name: state.user.name } : null,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
