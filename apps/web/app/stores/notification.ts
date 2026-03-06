import { defineStore } from 'pinia';
import type { AppNotification } from '~/types';

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<AppNotification[]>([]);
  const unreadCount = ref(0);
  const loading = ref(false);
  const api = useApi();

  async function fetchNotifications() {
    loading.value = true;
    const { data, error } = await api.get<AppNotification[]>('/api/v1/notifications');
    loading.value = false;

    if (error) return { success: false, error };

    notifications.value = data ?? [];
    return { success: true, error: null };
  }

  async function fetchUnreadCount() {
    const { data, error } = await api.get<{ count: number }>('/api/v1/notifications/unread-count');
    if (error) return { success: false, error };

    unreadCount.value = data?.count ?? 0;
    return { success: true, error: null };
  }

  async function markAsRead(id: string) {
    const { error } = await api.patch(`/api/v1/notifications/${id}/read`, {});
    if (error) return { success: false, error };

    const notif = notifications.value.find((n) => n.id === id);
    if (notif && !notif.isRead) {
      notif.isRead = true;
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    }
    return { success: true, error: null };
  }

  async function markAllAsRead() {
    const { error } = await api.patch('/api/v1/notifications/read-all', {});
    if (error) return { success: false, error };

    notifications.value.forEach((n) => (n.isRead = true));
    unreadCount.value = 0;
    return { success: true, error: null };
  }

  async function deleteNotification(id: string) {
    const { error } = await api.del(`/api/v1/notifications/${id}`);
    if (error) return { success: false, error };

    const notif = notifications.value.find((n) => n.id === id);
    if (notif && !notif.isRead) {
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    }
    notifications.value = notifications.value.filter((n) => n.id !== id);
    return { success: true, error: null };
  }

  async function deleteAll() {
    const { error } = await api.del('/api/v1/notifications');
    if (error) return { success: false, error };

    notifications.value = [];
    unreadCount.value = 0;
    return { success: true, error: null };
  }

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAll,
  };
});
