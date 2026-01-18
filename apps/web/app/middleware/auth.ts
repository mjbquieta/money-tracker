export default defineNuxtRouteMiddleware(async (to) => {
  // Skip during SSR - will be checked again on client
  if (import.meta.server) {
    return;
  }

  // Use the auth store to check authentication status
  // This ensures we wait for the store to be properly initialized
  const authStore = useAuthStore();

  // If store is not yet hydrated from localStorage, check localStorage directly
  // and give the store a chance to hydrate
  if (!authStore.isAuthenticated) {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    // No token or user data - redirect to login
    if (!token || !user) {
      // Clear any partial auth state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return navigateTo('/auth/login', { replace: true });
    }

    // Token exists in localStorage but store not hydrated yet
    // This can happen on page refresh - allow navigation and let the store hydrate
    return;
  }
});
