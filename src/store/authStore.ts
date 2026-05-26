import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '@/types/auth';

interface AuthState {
  token: string | null;
  user: {
    name: string;
    email: string;
    role: UserRole;
  } | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: { name: string; email: string; role: UserRole }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) =>
        set({ token, user, isAuthenticated: true }),
      clearAuth: () =>
        set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'flowia-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
