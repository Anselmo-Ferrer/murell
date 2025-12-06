import { api } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.success && response.data) {
      // Store token and user in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    }
    throw new Error(response.error || response.message || 'Falha ao fazer login. Verifique suas credenciais.');
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.success && response.data) {
      // Store token and user in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    }
    throw new Error(response.error || response.message || 'Falha ao criar conta. Tente novamente.');
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await api.put('/users/password', { currentPassword, newPassword });
    if (!response.success) {
      throw new Error(response.error || response.message || 'Falha ao atualizar senha.');
    }
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<AuthResponse>('/users/profile', data);

    if (response.success && response.data) {
      // The backend response structure might be { success: true, data: User } directly for this endpoint
      // based on UserController: res.json({ success: true, data: profile })
      // But let's check the type. UserController returns `profile` which is the user object.
      // So response.data is User.

      const user = response.data as unknown as User; // correcting type inference if AuthResponse doesn't match perfectly

      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
      }
      return user;
    }
    throw new Error(response.error || response.message || 'Falha ao atualizar perfil.');
  },

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

