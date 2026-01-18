import type { ApiError } from '~/types';

export function useApi() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl;

  function getToken(): string | null {
    if (import.meta.client) {
      return localStorage.getItem('token');
    }
    return null;
  }

  async function request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: T | null; error: ApiError | null }> {
    try {
      const token = getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return { data: null, error: data as ApiError };
      }

      return { data: data as T, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          statusCode: 500,
          message: 'Network error. Please try again.',
        },
      };
    }
  }

  function get<T>(endpoint: string) {
    return request<T>(endpoint, { method: 'GET' });
  }

  function post<T>(endpoint: string, body: unknown) {
    return request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  function put<T>(endpoint: string, body: unknown) {
    return request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  function patch<T>(endpoint: string, body: unknown) {
    return request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  function del<T>(endpoint: string) {
    return request<T>(endpoint, { method: 'DELETE' });
  }

  return { get, post, put, patch, del };
}
