<script setup lang="ts">
import {
  BellIcon,
  CheckIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';
import { BellAlertIcon } from '@heroicons/vue/24/solid';

const notificationStore = useNotificationStore();
const open = ref(false);
const initialized = ref(false);

const notificationTypeColors: Record<string, string> = {
  BUDGET_LIMIT_EXCEEDED: 'text-danger-600 dark:text-danger-400',
  BUDGET_LIMIT_APPROACHING: 'text-warning-600 dark:text-warning-400',
  GOAL_MILESTONE: 'text-primary-600 dark:text-primary-400',
  GOAL_COMPLETED: 'text-success-600 dark:text-success-400',
  DEBT_DUE_SOON: 'text-warning-600 dark:text-warning-400',
  DEBT_OVERDUE: 'text-danger-600 dark:text-danger-400',
  SYSTEM: 'text-secondary-600 dark:text-secondary-400',
};

function toggle() {
  open.value = !open.value;
  if (open.value && !initialized.value) {
    notificationStore.fetchNotifications();
    initialized.value = true;
  }
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest('.notification-container')) {
    open.value = false;
  }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

onMounted(() => {
  notificationStore.fetchUnreadCount();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="relative notification-container">
    <button
      class="relative p-2 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
      @click.stop="toggle"
    >
      <BellAlertIcon v-if="notificationStore.unreadCount > 0" class="w-5 h-5" />
      <BellIcon v-else class="w-5 h-5" />

      <span
        v-if="notificationStore.unreadCount > 0"
        class="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-danger-500 rounded-full"
      >
        {{ notificationStore.unreadCount > 99 ? '99+' : notificationStore.unreadCount }}
      </span>
    </button>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="open"
        class="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-secondary-800 rounded-xl shadow-elevated border border-secondary-100 dark:border-secondary-700 z-50 overflow-hidden"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-secondary-100 dark:border-secondary-700">
          <h3 class="font-semibold text-secondary-900 dark:text-secondary-100">Notifications</h3>
          <div class="flex items-center gap-1">
            <button
              v-if="notificationStore.unreadCount > 0"
              class="p-1.5 text-xs text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
              title="Mark all as read"
              @click="notificationStore.markAllAsRead()"
            >
              <CheckIcon class="w-4 h-4" />
            </button>
            <button
              v-if="notificationStore.notifications.length > 0"
              class="p-1.5 text-xs text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/30 rounded-lg transition-colors"
              title="Clear all"
              @click="notificationStore.deleteAll()"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Notification List -->
        <div class="max-h-80 overflow-y-auto">
          <div v-if="notificationStore.loading" class="p-6 text-center text-secondary-500 dark:text-secondary-400">
            Loading...
          </div>
          <div v-else-if="notificationStore.notifications.length === 0" class="p-6 text-center text-secondary-500 dark:text-secondary-400">
            <BellIcon class="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p class="text-sm">No notifications</p>
          </div>
          <div v-else>
            <div
              v-for="notif in notificationStore.notifications"
              :key="notif.id"
              class="flex items-start gap-3 px-4 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors border-b border-secondary-50 dark:border-secondary-700/50 last:border-0"
              :class="{ 'bg-primary-50/50 dark:bg-primary-900/20': !notif.isRead }"
            >
              <!-- Unread dot -->
              <div class="flex-shrink-0 mt-1.5">
                <div
                  v-if="!notif.isRead"
                  class="w-2 h-2 rounded-full bg-primary-500"
                />
                <div v-else class="w-2 h-2" />
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <p
                  class="text-sm font-medium text-secondary-900 dark:text-secondary-100"
                  :class="notificationTypeColors[notif.type]"
                >
                  {{ notif.title }}
                </p>
                <p class="text-xs text-secondary-600 dark:text-secondary-400 mt-0.5 line-clamp-2">
                  {{ notif.message }}
                </p>
                <p class="text-[10px] text-secondary-400 dark:text-secondary-500 mt-1">
                  {{ timeAgo(notif.createdAt) }}
                </p>
              </div>

              <!-- Actions -->
              <div class="flex-shrink-0 flex items-center gap-0.5">
                <button
                  v-if="!notif.isRead"
                  class="p-1 text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 rounded transition-colors"
                  title="Mark as read"
                  @click.stop="notificationStore.markAsRead(notif.id)"
                >
                  <CheckIcon class="w-3.5 h-3.5" />
                </button>
                <button
                  class="p-1 text-secondary-400 hover:text-danger-600 rounded transition-colors"
                  title="Delete"
                  @click.stop="notificationStore.deleteNotification(notif.id)"
                >
                  <XMarkIcon class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
