import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { useEffect } from 'react';
import { login, register, getMe } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/services/api';
import type { LoginRequestDTO, RegisterRequestDTO } from '@/types/auth';

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequestDTO) => login(data),
    onSuccess: (data) => {
      // Token is stored as httpOnly cookie by the route handler — not accessible here
      setAuth({ name: data.name, email: data.email, role: data.role });
      router.push('/dashboard');
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequestDTO) => register(data),
    onSuccess: () => {
      router.push('/login');
    },
  });
}

export function useMe() {
  const { isAuthenticated, setAuth } = useAuthStore();

  const query = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: isAuthenticated,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data) {
      const { name, email, role } = query.data;
      setAuth({ name, email, role });
    }
  }, [query.data, setAuth]);

  return query;
}

export function useLogout() {
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  return async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      clearAuth();
      router.push('/login');
    }
  };
}

export function useAuthError(error: unknown): string | null {
  if (!error) return null;

  if (isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401) return 'E-mail ou senha incorretos.';
    if (status === 403) return data?.error ?? 'Conta bloqueada ou desativada.';
    if (status === 409) return data?.error ?? 'E-mail ou nome de usuário já cadastrado.';
    if (status === 400) {
      const fields = data as Record<string, string>;
      const firstMessage = Object.values(fields)[0];
      return firstMessage ?? 'Dados inválidos.';
    }
  }

  return 'Ocorreu um erro inesperado. Tente novamente.';
}
