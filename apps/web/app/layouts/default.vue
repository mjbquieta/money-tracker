<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <NuxtLink to="/" class="text-xl font-bold text-blue-600">
            Money Tracker
          </NuxtLink>
          <div class="flex items-center gap-4">
            <template v-if="authStore.isAuthenticated">
              <span class="text-gray-600">{{ authStore.user?.name }}</span>
              <UiBaseButton variant="outline" @click="authStore.logout">
                Logout
              </UiBaseButton>
            </template>
            <template v-else>
              <NuxtLink to="/auth/login">
                <UiBaseButton variant="outline">Login</UiBaseButton>
              </NuxtLink>
              <NuxtLink to="/auth/register">
                <UiBaseButton>Register</UiBaseButton>
              </NuxtLink>
            </template>
          </div>
        </div>
      </nav>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>
