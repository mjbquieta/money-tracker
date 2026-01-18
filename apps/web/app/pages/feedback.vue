<script setup lang="ts">
import {
  LightBulbIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  SparklesIcon,
} from '@heroicons/vue/24/outline';

definePageMeta({
  layout: false,
});

const form = reactive({
  name: '',
  email: '',
  type: 'feature',
  message: '',
});

const submitted = ref(false);
const loading = ref(false);

const requestTypes = [
  { value: 'feature', label: 'Feature Request', description: 'Suggest a new feature or improvement' },
  { value: 'bug', label: 'Bug Report', description: 'Report something that is not working' },
  { value: 'feedback', label: 'General Feedback', description: 'Share your thoughts about the app' },
];

async function handleSubmit() {
  if (!form.message.trim()) return;

  loading.value = true;

  // Simulate submission delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real app, you'd send this to your backend
  console.log('Feedback submitted:', form);

  loading.value = false;
  submitted.value = true;
}

function resetForm() {
  form.name = '';
  form.email = '';
  form.type = 'feature';
  form.message = '';
  submitted.value = false;
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50/30">
    <!-- Navbar -->
    <LayoutPublicNavbar />

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-6">
          <LightBulbIcon class="w-8 h-8 text-primary-600" />
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
          Help Us Improve
        </h1>
        <p class="text-lg text-secondary-600 max-w-xl mx-auto">
          Your feedback shapes the future of Prospera. Share your ideas, report issues, or just tell us what you think!
        </p>
      </div>

      <!-- Success State -->
      <div v-if="submitted" class="bg-white rounded-2xl shadow-card border border-secondary-100 p-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-success-100 rounded-full mb-6">
          <CheckCircleIcon class="w-8 h-8 text-success-600" />
        </div>
        <h2 class="text-2xl font-bold text-secondary-900 mb-3">Thank You!</h2>
        <p class="text-secondary-600 mb-6">
          Your feedback has been received. We truly appreciate you taking the time to help us improve Prospera.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            class="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all font-medium"
            @click="resetForm"
          >
            Submit Another
          </button>
          <NuxtLink to="/">
            <button class="px-6 py-3 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors font-medium">
              Back to Home
            </button>
          </NuxtLink>
        </div>
      </div>

      <!-- Form -->
      <form v-else class="bg-white rounded-2xl shadow-card border border-secondary-100 p-6 sm:p-8" @submit.prevent="handleSubmit">
        <!-- Request Type -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-secondary-700 mb-3">What would you like to share?</label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              v-for="type in requestTypes"
              :key="type.value"
              type="button"
              class="p-4 rounded-xl border-2 text-left transition-all"
              :class="form.type === type.value
                ? 'border-primary-500 bg-primary-50'
                : 'border-secondary-200 hover:border-primary-300 hover:bg-primary-50/50'"
              @click="form.type = type.value"
            >
              <span class="block font-medium text-secondary-900">{{ type.label }}</span>
              <span class="block text-xs text-secondary-500 mt-1">{{ type.description }}</span>
            </button>
          </div>
        </div>

        <!-- Name & Email -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">Name (optional)</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Your name"
              class="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">Email (optional)</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="your@email.com"
              class="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <p class="text-xs text-secondary-400 mt-1">In case we need to follow up</p>
          </div>
        </div>

        <!-- Message -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-secondary-700 mb-2">Your Message *</label>
          <textarea
            v-model="form.message"
            rows="6"
            placeholder="Tell us what's on your mind..."
            required
            class="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
          ></textarea>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading || !form.message.trim()"
          class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-secondary-300 disabled:to-secondary-400 text-white rounded-xl transition-all font-semibold text-lg"
        >
          <template v-if="loading">
            <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Sending...
          </template>
          <template v-else>
            <PaperAirplaneIcon class="w-5 h-5" />
            Send Feedback
          </template>
        </button>
      </form>

      <!-- Note -->
      <div class="mt-8 flex items-start gap-3 p-4 bg-primary-50 rounded-xl">
        <SparklesIcon class="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
        <p class="text-sm text-primary-700">
          Every piece of feedback helps us build a better app. We read everything and prioritize based on community needs. Thank you for being part of the journey!
        </p>
      </div>
    </div>
  </div>
</template>
