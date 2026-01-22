<script setup lang="ts">
// Redirect old /metrics route to /dashboard for backwards compatibility
definePageMeta({
  middleware: [
    function () {
      return navigateTo("/dashboard", { redirectCode: 301 });
    },
  ],
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <p class="text-secondary-500 dark:text-secondary-400">Redirecting to dashboard...</p>
  </div>
</template>
