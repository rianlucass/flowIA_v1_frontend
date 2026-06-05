import { api } from './api';
import type {
  AuthResponseDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
  UserResponseDTO,
} from '@/types/auth';

export async function login(data: LoginRequestDTO): Promise<AuthResponseDTO> {
  const response = await api.post<AuthResponseDTO>('/auth/login', data);
  return response.data;
}

export async function register(data: RegisterRequestDTO): Promise<UserResponseDTO> {
  const response = await api.post<UserResponseDTO>('/auth/register', data);
  return response.data;
}

export async function getMe(): Promise<UserResponseDTO> {
  const response = await api.get<UserResponseDTO>('/users/me');
  return response.data;
}
