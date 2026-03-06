<script setup lang="ts">
import { ClockIcon } from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const { sessionExpired, clearSessionExpired } = useAuthInterceptor();
const countdown = ref(60);
let countdownTimer: ReturnType<typeof setInterval> | null = null;

function startCountdown() {
  countdown.value = 60;
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      handleLogout();
    }
  }, 1000);
}

function stopCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
}

function handleLogout() {
  stopCountdown();
  clearSessionExpired();
  authStore.clearAuth();
  navigateTo('/auth/login', { replace: true });
}

function handleLogin() {
  stopCountdown();
  clearSessionExpired();
  // Preserve current route so user can come back after login
  const currentPath = useRoute().fullPath;
  authStore.clearAuth();
  navigateTo(`/auth/login?redirect=${encodeURIComponent(currentPath)}`, { replace: true });
}

watch(sessionExpired, (expired) => {
  if (expired) {
    startCountdown();
  } else {
    stopCountdown();
  }
});

onUnmounted(() => {
  stopCountdown();
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="sessionExpired"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="sessionExpired"
            class="bg-white dark:bg-secondary-800 rounded-2xl shadow-elevated max-w-md w-full p-6"
          >
            <!-- Icon -->
            <div class="flex justify-center mb-4">
              <div class="w-16 h-16 bg-warning-100 dark:bg-warning-900/30 rounded-full flex items-center justify-center">
                <ClockIcon class="w-8 h-8 text-warning-600 dark:text-warning-400" />
              </div>
            </div>

            <!-- Title & Message -->
            <h2 class="text-xl font-bold text-secondary-900 dark:text-secondary-100 text-center mb-2">
              Session Expired
            </h2>
            <p class="text-secondary-600 dark:text-secondary-400 text-center mb-6">
              Your session has expired due to inactivity. Please log in again to continue where you left off.
            </p>

            <!-- Countdown -->
            <div class="text-center mb-6">
              <p class="text-sm text-secondary-500 dark:text-secondary-400">
                Redirecting to login in
                <span class="font-semibold text-warning-600 dark:text-warning-400">{{ countdown }}s</span>
              </p>
              <div class="mt-2 w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-1.5">
                <div
                  class="bg-warning-500 h-1.5 rounded-full transition-all duration-1000"
                  :style="{ width: `${(countdown / 60) * 100}%` }"
                />
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <button
                class="flex-1 px-4 py-2.5 border border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors font-medium"
                @click="handleLogout"
              >
                Go to Home
              </button>
              <button
                class="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors font-medium"
                @click="handleLogin"
              >
                Log In Again
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
