import type { ApiError, ApiEnvelope, ApiErrorEnvelope, ApiResponseMeta } from '~/types';

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
  ): Promise<{ data: T | null; error: ApiError | null; meta: ApiResponseMeta | null }> {
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

      const json = await response.json();

      if (!response.ok) {
        // Handle envelope error format: { error: { statusCode, message }, meta }
        if (json.error && json.meta) {
          const envelope = json as ApiErrorEnvelope;
          return { data: null, error: envelope.error, meta: envelope.meta };
        }
        // Fallback for non-envelope errors (e.g., validation pipe before interceptor)
        return { data: null, error: json as ApiError, meta: null };
      }

      // Unwrap envelope: { data, meta } → extract data
      if (json.data !== undefined && json.meta) {
        const envelope = json as ApiEnvelope<T>;
        return { data: envelope.data, error: null, meta: envelope.meta };
      }

      // Fallback for non-envelope responses
      return { data: json as T, error: null, meta: null };
    } catch (err) {
      return {
        data: null,
        error: {
          statusCode: 500,
          message: 'Network error. Please try again.',
        },
        meta: null,
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
