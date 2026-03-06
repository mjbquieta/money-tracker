import { defineStore } from 'pinia';
import type { Tag, CreateTagPayload, UpdateTagPayload, Expense } from '~/types';

export const useTagStore = defineStore('tag', () => {
  const tags = ref<Tag[]>([]);
  const loading = ref(false);
  const api = useApi();

  async function fetchTags() {
    loading.value = true;
    const { data, error } = await api.get<Tag[]>('/api/v1/tags');
    loading.value = false;

    if (error) {
      return { success: false, error };
    }

    tags.value = data ?? [];
    return { success: true, error: null };
  }

  async function createTag(payload: CreateTagPayload) {
    const { data, error } = await api.post<Tag>('/api/v1/tags', payload);

    if (error) {
      return { success: false, error };
    }

    if (data) {
      tags.value.push(data);
      tags.value.sort((a, b) => a.name.localeCompare(b.name));
    }
    return { success: true, error: null, data };
  }

  async function updateTag(id: string, payload: UpdateTagPayload) {
    const { data, error } = await api.patch<Tag>(`/api/v1/tags/${id}`, payload);

    if (error) {
      return { success: false, error };
    }

    if (data) {
      const index = tags.value.findIndex((t) => t.id === id);
      if (index !== -1) tags.value[index] = data;
      tags.value.sort((a, b) => a.name.localeCompare(b.name));
    }
    return { success: true, error: null, data };
  }

  async function deleteTag(id: string) {
    const { error } = await api.del(`/api/v1/tags/${id}`);

    if (error) {
      return { success: false, error };
    }

    tags.value = tags.value.filter((t) => t.id !== id);
    return { success: true, error: null };
  }

  async function tagExpense(expenseId: string, tagIds: string[]) {
    const { data, error } = await api.put<Expense>(
      `/api/v1/tags/expenses/${expenseId}`,
      { tagIds },
    );

    if (error) {
      return { success: false, error };
    }

    return { success: true, error: null, data };
  }

  return {
    tags,
    loading,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    tagExpense,
  };
});
