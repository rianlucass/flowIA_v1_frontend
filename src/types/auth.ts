export type UserRole = 'USER' | 'ADMIN';

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface RegisterRequestDTO {
  username: string;
  name: string;
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  name: string;
  email: string;
  role: UserRole;
}

export interface UserResponseDTO {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface ApiFieldError {
  [field: string]: string;
}

export interface ApiError {
  error?: string;
}
