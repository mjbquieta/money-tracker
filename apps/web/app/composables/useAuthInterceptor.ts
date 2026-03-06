// Module-scoped state — shared across all composable instances
let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;
let tokenExpiresAt: number | null = null;

// Tracks whether we ever had a valid token in this page session.
// Used to distinguish "page refresh with expired session" (redirect to login)
// from "active user whose session expired mid-use" (show modal).
let everHadToken = false;

// Session expiry state — reactive so components can watch it
const sessionExpired = ref(false);

function decodeJwtExpiry(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null; // Convert to ms
  } catch {
    return null;
  }
}

export function useAuthInterceptor() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl;

  function getAccessToken(): string | null {
    return accessToken;
  }

  function setAccessToken(token: string | null) {
    accessToken = token;

    // Clear any existing refresh timer
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }

    if (token) {
      everHadToken = true;
      sessionExpired.value = false;
      tokenExpiresAt = decodeJwtExpiry(token);

      // Schedule proactive refresh 1 minute before expiry
      if (tokenExpiresAt) {
        const msUntilRefresh = tokenExpiresAt - Date.now() - 60_000; // 1 min before
        if (msUntilRefresh > 0) {
          refreshTimer = setTimeout(() => {
            refreshAccessToken();
          }, msUntilRefresh);
        }
      }
    } else {
      tokenExpiresAt = null;
    }
  }

  function clearAccessToken() {
    accessToken = null;
    tokenExpiresAt = null;
    everHadToken = false;
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }
  }

  function isTokenExpired(): boolean {
    if (!accessToken || !tokenExpiresAt) return true;
    return Date.now() >= tokenExpiresAt;
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
          // Only show modal if user had an active session (not a fresh page load)
          if (everHadToken) {
            sessionExpired.value = true;
          }
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
        if (everHadToken) {
          sessionExpired.value = true;
        }
        return null;
      } catch {
        clearAccessToken();
        if (everHadToken) {
          sessionExpired.value = true;
        }
        return null;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  }

  function clearSessionExpired() {
    sessionExpired.value = false;
  }

  return {
    getAccessToken,
    setAccessToken,
    clearAccessToken,
    refreshAccessToken,
    isTokenExpired,
    sessionExpired: readonly(sessionExpired),
    clearSessionExpired,
  };
}
