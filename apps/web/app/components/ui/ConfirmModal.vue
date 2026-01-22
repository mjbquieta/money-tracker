<script setup lang="ts">
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const props = withDefaults(defineProps<{
  show: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  loading?: boolean;
}>(), {
  title: 'Confirm Action',
  message: 'Are you sure you want to proceed?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'danger',
  loading: false,
});

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const variantClasses = {
  danger: {
    icon: 'bg-danger-100 dark:bg-danger-900/50 text-danger-600 dark:text-danger-400',
    button: 'bg-danger-600 hover:bg-danger-700 focus:ring-danger-500',
  },
  warning: {
    icon: 'bg-warning-100 dark:bg-warning-900/50 text-warning-600 dark:text-warning-400',
    button: 'bg-warning-600 hover:bg-warning-700 focus:ring-warning-500',
  },
  primary: {
    icon: 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400',
    button: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
  },
};

function handleConfirm() {
  if (!props.loading) {
    emit('confirm');
  }
}

function handleCancel() {
  if (!props.loading) {
    emit('cancel');
  }
}
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
        v-if="show"
        class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        @click.self="handleCancel"
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
            v-if="show"
            class="bg-white dark:bg-secondary-800 rounded-2xl shadow-elevated max-w-md w-full overflow-hidden"
          >
            <!-- Header -->
            <div class="flex items-start gap-4 p-6 pb-4">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                :class="variantClasses[variant].icon"
              >
                <ExclamationTriangleIcon class="w-6 h-6" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                  {{ title }}
                </h3>
                <p class="mt-2 text-secondary-600 dark:text-secondary-400">
                  {{ message }}
                </p>
              </div>
              <button
                class="p-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                :disabled="loading"
                @click="handleCancel"
              >
                <XMarkIcon class="w-5 h-5" />
              </button>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 p-6 pt-4 bg-secondary-50 dark:bg-secondary-900">
              <button
                class="flex-1 px-4 py-2.5 text-secondary-700 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-secondary-100 bg-white dark:bg-secondary-800 hover:bg-secondary-100 dark:hover:bg-secondary-700 border border-secondary-200 dark:border-secondary-600 rounded-xl font-medium transition-colors disabled:opacity-50"
                :disabled="loading"
                @click="handleCancel"
              >
                {{ cancelText }}
              </button>
              <button
                class="flex-1 px-4 py-2.5 text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center gap-2"
                :class="variantClasses[variant].button"
                :disabled="loading"
                @click="handleConfirm"
              >
                <template v-if="loading">
                  <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </template>
                <template v-else>
                  {{ confirmText }}
                </template>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
