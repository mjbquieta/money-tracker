import { defineStore } from 'pinia';
import type {
  User,
  LoginPayload,
  RegisterPayload,
  Settings,
  UpdateSettingsPayload,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from '~/types';

interface LoginResponse {
  user?: User;
  accessToken: string;
  requiresTwoFactor?: boolean;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isAuthenticated = computed(() => !!user.value);
  const isHydrated = ref(false);
  const api = useApi();
  const { setAccessToken, clearAccessToken } = useAuthInterceptor();

  // Hydrate user from localStorage (token is now in memory / http-only cookie)
  function hydrateFromStorage() {
    if (!import.meta.client) return;

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser);
      } catch {
        // Invalid JSON, ignore
      }
    }
    isHydrated.value = true;
  }

  // Run hydration immediately on client to handle initial page loads
  if (import.meta.client) {
    hydrateFromStorage();
  }

  function setAuth(userData: User, accessToken: string) {
    user.value = userData;
    setAccessToken(accessToken);
    if (import.meta.client) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  }

  function clearAuth() {
    user.value = null;
    clearAccessToken();
    if (import.meta.client) {
      localStorage.removeItem('user');
    }
  }

  async function login(payload: LoginPayload) {
    const { data, error } = await api.post<LoginResponse>('/api/v1/auth/login', payload);

    if (error) {
      return { success: false, error, requiresTwoFactor: false };
    }

    if (data) {
      // 2FA required — store partial token and signal caller
      if (data.requiresTwoFactor) {
        setAccessToken(data.accessToken);
        return { success: true, error: null, requiresTwoFactor: true };
      }

      if (data.user) {
        setAuth(data.user, data.accessToken);
      }
    }
    return { success: true, error: null, requiresTwoFactor: false };
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

  async function logout() {
    await api.post('/api/v1/auth/logout', {});
    clearAuth();
    navigateTo('/');
  }

  async function logoutAll() {
    await api.post('/api/v1/auth/logout-all', {});
    clearAuth();
    navigateTo('/');
  }

  async function updateSettings(payload: UpdateSettingsPayload) {
    const { data, error } = await api.patch<Settings>('/api/v1/settings', payload);

    if (error) {
      return { success: false, error };
    }

    // Update the user's settings in local state
    if (data && user.value) {
      user.value = {
        ...user.value,
        settings: data,
      };
      if (import.meta.client) {
        localStorage.setItem('user', JSON.stringify(user.value));
      }
    }

    return { success: true, error: null };
  }

  async function updateProfile(payload: UpdateProfilePayload) {
    const { data, error } = await api.patch<User>('/api/v1/users/profile', payload);

    if (error) {
      return { success: false, error };
    }

    // Update the user in local state
    if (data) {
      user.value = data;
      if (import.meta.client) {
        localStorage.setItem('user', JSON.stringify(data));
      }
    }

    return { success: true, error: null };
  }

  async function changePassword(payload: ChangePasswordPayload) {
    const { error } = await api.patch<{ message: string }>('/api/v1/users/password', payload);

    if (error) {
      return { success: false, error };
    }

    return { success: true, error: null };
  }

  return {
    user,
    isAuthenticated,
    isHydrated,
    hydrateFromStorage,
    login,
    register,
    logout,
    logoutAll,
    updateSettings,
    updateProfile,
    changePassword,
  };
});
