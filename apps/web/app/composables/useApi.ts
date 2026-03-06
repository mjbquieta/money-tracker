import type { ApiError, ApiEnvelope, ApiErrorEnvelope, ApiResponseMeta } from '~/types';

export function useApi() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl;
  const { getAccessToken, refreshAccessToken, clearAccessToken, isTokenExpired, sessionExpired } = useAuthInterceptor();

  function parseResponse<T>(
    json: any,
    ok: boolean,
  ): { data: T | null; error: ApiError | null; meta: ApiResponseMeta | null } {
    if (!ok) {
      if (json.error && json.meta) {
        const envelope = json as ApiErrorEnvelope;
        return { data: null, error: envelope.error, meta: envelope.meta };
      }
      return { data: null, error: json as ApiError, meta: null };
    }

    if (json.data !== undefined && json.meta) {
      const envelope = json as ApiEnvelope<T>;
      return { data: envelope.data, error: null, meta: envelope.meta };
    }

    return { data: json as T, error: null, meta: null };
  }

  // Endpoints that don't require authentication — skip token refresh for these
  const publicEndpoints = [
    '/api/v1/auth/login',
    '/api/v1/auth/refresh',
    '/api/v1/auth/2fa/authenticate',
    '/api/v1/users/register',
  ];

  async function request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<{ data: T | null; error: ApiError | null; meta: ApiResponseMeta | null }> {
    try {
      let token = getAccessToken();
      const isPublic = publicEndpoints.some((p) => endpoint.startsWith(p));

      // If token is missing or expired, try to refresh before making the request
      // Skip for public endpoints that don't need authentication
      if (!isPublic && (!token || isTokenExpired())) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          token = refreshed;
        } else if (!sessionExpired.value) {
          // Refresh failed on fresh page load (no modal shown) — redirect to login
          if (import.meta.client && localStorage.getItem('user')) {
            localStorage.removeItem('user');
            navigateTo('/auth/login', { replace: true });
          }
          return { data: null, error: { statusCode: 401, message: 'Please log in.' }, meta: null };
        }
      }

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
        credentials: 'include',
      });

      // On 401, attempt token refresh and retry once
      if (response.status === 401) {
        const newToken = await refreshAccessToken();

        if (newToken) {
          headers['Authorization'] = `Bearer ${newToken}`;

          const retryResponse = await fetch(`${baseUrl}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include',
          });

          const retryJson = await retryResponse.json();
          return parseResponse<T>(retryJson, retryResponse.ok);
        }

        // Refresh failed — modal shows if user had active session,
        // otherwise redirect to login for fresh page load
        if (!sessionExpired.value && import.meta.client) {
          localStorage.removeItem('user');
          navigateTo('/auth/login', { replace: true });
        }
        return {
          data: null,
          error: { statusCode: 401, message: 'Session expired. Please log in again.' },
          meta: null,
        };
      }

      const json = await response.json();
      return parseResponse<T>(json, response.ok);
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

  function post<T>(endpoint: string, body?: unknown) {
    return request<T>(endpoint, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
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
