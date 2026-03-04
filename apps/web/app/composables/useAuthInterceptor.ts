// Module-scoped state — shared across all composable instances
let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function useAuthInterceptor() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl;

  function getAccessToken(): string | null {
    return accessToken;
  }

  function setAccessToken(token: string | null) {
    accessToken = token;
  }

  function clearAccessToken() {
    accessToken = null;
  }

  async function refreshAccessToken(): Promise<string | null> {
    // If a refresh is already in progress, wait for it
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = (async () => {
      try {
        const response = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          clearAccessToken();
          return null;
        }

        const json = await response.json();
        // Handle envelope: { data: { accessToken }, meta }
        const data = json.data || json;
        const newToken = data.accessToken;

        if (newToken) {
          setAccessToken(newToken);
          return newToken;
        }

        clearAccessToken();
        return null;
      } catch {
        clearAccessToken();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  }

  return {
    getAccessToken,
    setAccessToken,
    clearAccessToken,
    refreshAccessToken,
  };
}
