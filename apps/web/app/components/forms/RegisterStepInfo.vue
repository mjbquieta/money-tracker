<script setup lang="ts">
interface Props {
  modelValue: {
    email: string;
    name: string;
    username: string;
    password: string;
    confirmPassword: string;
  };
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: Props['modelValue']];
}>();

const form = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const passwordMismatch = computed(() => {
  return form.value.password && form.value.confirmPassword &&
    form.value.password !== form.value.confirmPassword;
});
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Personal Information</h3>
    <p class="text-sm text-gray-500 dark:text-gray-400">Enter your account details to get started.</p>

    <UiBaseInput
      v-model="form.name"
      label="Full Name"
      placeholder="John Doe"
      required
    />

    <UiBaseInput
      v-model="form.username"
      label="Username"
      placeholder="johndoe"
      required
    />

    <UiBaseInput
      v-model="form.email"
      label="Email Address"
      type="email"
      placeholder="you@example.com"
      required
    />

    <UiBaseInput
      v-model="form.password"
      label="Password"
      type="password"
      placeholder="Create a strong password"
      required
    />

    <UiBaseInput
      v-model="form.confirmPassword"
      label="Confirm Password"
      type="password"
      placeholder="Confirm your password"
      :error="passwordMismatch ? 'Passwords do not match' : ''"
      required
    />
  </div>
</template>
