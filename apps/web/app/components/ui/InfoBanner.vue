<script setup lang="ts">
import {
  InformationCircleIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

interface Props {
  variant?: "info" | "tip" | "warning";
  dismissible?: boolean;
  dismissKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "info",
  dismissible: false,
  dismissKey: undefined,
});

const isDismissed = ref(false);

onMounted(() => {
  if (props.dismissible && props.dismissKey) {
    const dismissed = localStorage.getItem(`banner-dismissed-${props.dismissKey}`);
    isDismissed.value = dismissed === "true";
  }
});

function dismiss() {
  isDismissed.value = true;
  if (props.dismissKey) {
    localStorage.setItem(`banner-dismissed-${props.dismissKey}`, "true");
  }
}

const variantStyles = computed(() => {
  switch (props.variant) {
    case "tip":
      return {
        container: "bg-accent-50 dark:bg-accent-900/30 border-accent-200 dark:border-accent-700",
        icon: "text-accent-600 dark:text-accent-400",
        text: "text-accent-800 dark:text-accent-200",
      };
    case "warning":
      return {
        container: "bg-warning-50 dark:bg-warning-900/30 border-warning-200 dark:border-warning-700",
        icon: "text-warning-600 dark:text-warning-400",
        text: "text-warning-800 dark:text-warning-200",
      };
    default:
      return {
        container: "bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-700",
        icon: "text-primary-600 dark:text-primary-400",
        text: "text-primary-800 dark:text-primary-200",
      };
  }
});

const IconComponent = computed(() => {
  switch (props.variant) {
    case "tip":
      return LightBulbIcon;
    case "warning":
      return ExclamationTriangleIcon;
    default:
      return InformationCircleIcon;
  }
});
</script>

<template>
  <div
    v-if="!isDismissed"
    class="rounded-lg border p-4 flex items-start gap-3"
    :class="variantStyles.container"
  >
    <component
      :is="IconComponent"
      class="w-5 h-5 flex-shrink-0 mt-0.5"
      :class="variantStyles.icon"
    />
    <div class="flex-1 text-sm" :class="variantStyles.text">
      <slot />
    </div>
    <button
      v-if="dismissible"
      class="flex-shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      :class="variantStyles.text"
      @click="dismiss"
    >
      <XMarkIcon class="w-4 h-4" />
    </button>
  </div>
</template>
