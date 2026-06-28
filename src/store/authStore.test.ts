import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/store/authStore';

// Zustand persist uses localStorage
beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState({ user: null, isAuthenticated: false });
});

describe('useAuthStore', () => {
  it('starts unauthenticated', () => {
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('setAuth sets user and marks authenticated', () => {
    const user = { name: 'João', email: 'joao@test.com', role: 'RECRUITER' as const };
    useAuthStore.getState().setAuth(user);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user).toEqual(user);
  });

  it('clearAuth clears user and marks unauthenticated', () => {
    useAuthStore.getState().setAuth({ name: 'Maria', email: 'maria@test.com', role: 'RECRUITER' as const });
    useAuthStore.getState().clearAuth();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });
});
