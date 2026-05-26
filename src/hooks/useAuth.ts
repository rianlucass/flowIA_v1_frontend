import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { login, register, getMe } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import type { LoginRequestDTO, RegisterRequestDTO } from '@/types/auth';

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequestDTO) => login(data),
    onSuccess: (data) => {
      setAuth(data.token, { name: data.name, email: data.email, role: data.role });
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
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: isAuthenticated,
    retry: false,
  });
}

export function useLogout() {
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  return () => {
    clearAuth();
    router.push('/login');
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
