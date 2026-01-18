import { defineStore } from 'pinia';
import type { User, LoginPayload, RegisterPayload } from '~/types';

interface LoginResponse {
  user: User;
  accessToken: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isAuthenticated = computed(() => !!user.value && !!token.value);
  const api = useApi();

  // Initialize from localStorage on client
  if (import.meta.client) {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken) token.value = savedToken;
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser);
      } catch {
        // Invalid JSON, ignore
      }
    }
  }

  function setAuth(userData: User, accessToken: string) {
    user.value = userData;
    token.value = accessToken;
    if (import.meta.client) {
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  }

  function clearAuth() {
    user.value = null;
    token.value = null;
    if (import.meta.client) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  async function login(payload: LoginPayload) {
    const { data, error } = await api.post<LoginResponse>('/api/v1/auth/login', payload);

    if (error) {
      return { success: false, error };
    }

    if (data) {
      setAuth(data.user, data.accessToken);
    }
    return { success: true, error: null };
  }

  async function register(payload: RegisterPayload) {
    const { data, error } = await api.post<User>(
      '/api/v1/users/register',
      payload
    );

    if (error) {
      return { success: false, error };
    }

    // After registration, login to get the token
    if (data) {
      return login({ email: payload.email, password: payload.password });
    }

    return { success: true, error: null };
  }

  function logout() {
    clearAuth();
    navigateTo('/');
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
  };
});
