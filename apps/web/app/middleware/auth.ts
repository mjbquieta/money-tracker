export default defineNuxtRouteMiddleware(async (to) => {
  // Skip during SSR - will be checked again on client
  if (import.meta.server) {
    return;
  }

  const authStore = useAuthStore();

  // Check if user data exists (either in store or localStorage)
  // Access token is managed in memory and refreshed via HTTP-only cookie
  if (!authStore.isAuthenticated) {
    const savedUser = localStorage.getItem('user');

    // No user data at all — redirect to login
    if (!savedUser) {
      return navigateTo('/auth/login', { replace: true });
    }

    // User data exists in localStorage but store not hydrated yet
    // This can happen on page refresh — allow navigation
    // The first API call will trigger token refresh via cookie
    return;
  }
});
