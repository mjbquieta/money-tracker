export default defineNuxtRouteMiddleware(async (to) => {
  // Skip during SSR - will be checked again on client
  if (import.meta.server) {
    return;
  }

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  // No token or user data - redirect to login
  if (!token || !user) {
    // Clear any partial auth state
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return navigateTo('/auth/login', { replace: true });
  }
});
