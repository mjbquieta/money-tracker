<script setup lang="ts">
import {
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';
import type { Session } from '~/types';

const api = useApi();
const authStore = useAuthStore();

const sessions = ref<Session[]>([]);
const loading = ref(false);
const revoking = ref<string | null>(null);

async function fetchSessions() {
  loading.value = true;
  const { data } = await api.get<Session[]>('/api/v1/auth/sessions');
  if (data) {
    sessions.value = data;
  }
  loading.value = false;
}

async function revokeSession(sessionId: string) {
  revoking.value = sessionId;
  const { error } = await api.del(`/api/v1/auth/sessions/${sessionId}`);
  if (!error) {
    sessions.value = sessions.value.filter((s) => s.id !== sessionId);
  }
  revoking.value = null;
}

async function revokeAllOther() {
  loading.value = true;
  await authStore.logoutAll();
}

function parseUserAgent(ua: string | null): { device: string; isDesktop: boolean } {
  if (!ua) return { device: 'Unknown device', isDesktop: true };

  const isMobile = /mobile|android|iphone|ipad/i.test(ua);

  // Extract browser name
  let browser = 'Unknown browser';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';

  // Extract OS
  let os = '';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return {
    device: `${browser}${os ? ` on ${os}` : ''}`,
    isDesktop: !isMobile,
  };
}

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

onMounted(fetchSessions);
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
        Active Sessions
      </h3>
      <button
        v-if="sessions.length > 1"
        class="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
        @click="revokeAllOther"
      >
        Revoke All Other Sessions
      </button>
    </div>

    <div v-if="loading && sessions.length === 0" class="flex items-center justify-center py-8">
      <span class="w-5 h-5 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></span>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="session in sessions"
        :key="session.id"
        class="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-xl"
      >
        <div class="flex items-center gap-3">
          <div class="p-2 bg-white dark:bg-secondary-600 rounded-lg">
            <ComputerDesktopIcon
              v-if="parseUserAgent(session.userAgent).isDesktop"
              class="w-5 h-5 text-secondary-500 dark:text-secondary-400"
            />
            <DevicePhoneMobileIcon
              v-else
              class="w-5 h-5 text-secondary-500 dark:text-secondary-400"
            />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                {{ parseUserAgent(session.userAgent).device }}
              </span>
              <span
                v-if="session.isCurrent"
                class="px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full"
              >
                Current
              </span>
            </div>
            <div class="flex items-center gap-2 text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
              <span v-if="session.ipAddress">{{ session.ipAddress }}</span>
              <span v-if="session.ipAddress && session.lastUsedAt">&middot;</span>
              <span>Last active {{ formatRelativeTime(session.lastUsedAt || session.createdAt) }}</span>
            </div>
          </div>
        </div>

        <button
          v-if="!session.isCurrent"
          class="p-2 text-secondary-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-600"
          :disabled="revoking === session.id"
          @click="revokeSession(session.id)"
        >
          <span
            v-if="revoking === session.id"
            class="w-4 h-4 border-2 border-secondary-300/30 border-t-secondary-300 rounded-full animate-spin block"
          ></span>
          <XMarkIcon v-else class="w-4 h-4" />
        </button>
      </div>
    </div>

    <p v-if="!loading && sessions.length === 0" class="text-center text-sm text-secondary-500 dark:text-secondary-400 py-4">
      No active sessions found.
    </p>
  </div>
</template>
