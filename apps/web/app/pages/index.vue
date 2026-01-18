<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
        Take Control of Your
        <span class="text-blue-600">Finances</span>
      </h1>
      <p class="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
        Track your income, manage expenses, and achieve your financial goals with our simple and intuitive money tracking tool.
      </p>
      <div class="mt-10 flex justify-center gap-4">
        <template v-if="authStore.isAuthenticated">
          <NuxtLink to="/dashboard">
            <UiBaseButton>Go to Dashboard</UiBaseButton>
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink to="/auth/register">
            <UiBaseButton>Get Started</UiBaseButton>
          </NuxtLink>
          <NuxtLink to="/auth/login">
            <UiBaseButton variant="outline">Sign In</UiBaseButton>
          </NuxtLink>
        </template>
      </div>
    </div>

    <div class="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div class="text-3xl mb-4">📊</div>
        <h3 class="text-lg font-semibold text-gray-900">Track Income</h3>
        <p class="mt-2 text-gray-500">
          Monitor all your income sources in one place and understand your earning patterns.
        </p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div class="text-3xl mb-4">💰</div>
        <h3 class="text-lg font-semibold text-gray-900">Manage Expenses</h3>
        <p class="mt-2 text-gray-500">
          Categorize and track your spending to identify areas where you can save.
        </p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div class="text-3xl mb-4">🎯</div>
        <h3 class="text-lg font-semibold text-gray-900">Set Goals</h3>
        <p class="mt-2 text-gray-500">
          Define financial goals and track your progress towards achieving them.
        </p>
      </div>
    </div>
  </div>
</template>
