<script setup lang="ts">
import {
  HeartIcon,
  CodeBracketIcon,
  SparklesIcon,
} from "@heroicons/vue/24/outline";

definePageMeta({
  layout: false,
});

const coffeeEmojis = ["🍺", "🍻", "🥃", "🍷"];
const randomEmoji =
  coffeeEmojis[Math.floor(Math.random() * coffeeEmojis.length)];
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-accent-50 via-white to-primary-50/30 dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-950"
  >
    <!-- Navbar -->
    <LayoutPublicNavbar />

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="text-center mb-12">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/50 dark:to-accent-900/50 rounded-3xl mb-6"
        >
          <HeartIcon class="w-10 h-10 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
          About Prospera
        </h1>
        <p class="text-lg text-secondary-600 dark:text-secondary-400">
          A passion project built with love
        </p>
      </div>

      <!-- Story Section -->
      <div
        class="bg-white dark:bg-secondary-800 rounded-2xl shadow-card border border-secondary-100 dark:border-secondary-700 p-6 sm:p-8 mb-8"
      >
        <div class="flex items-center gap-3 mb-6">
          <div
            class="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-xl flex items-center justify-center"
          >
            <CodeBracketIcon class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 class="text-xl font-semibold text-secondary-900 dark:text-secondary-100">The Story</h2>
        </div>

        <div class="space-y-4 text-secondary-600 dark:text-secondary-400 leading-relaxed">
          <p>
            Hey there! I'm a freelance developer who loves building things that
            make life a little easier. Prospera started as a simple idea: what
            if tracking your money didn't have to feel like a chore?
          </p>
          <p>
            I built this app in my spare time, fueled by countless cups of
            coffee (and maybe a few beers), because I genuinely believe everyone
            deserves simple, free tools to manage their finances better.
          </p>
          <p>
            This isn't backed by some big company or venture capital. It's just
            me, my laptop, and a dream to help people build better money habits
            without the complexity of traditional finance apps.
          </p>
          <p class="font-medium text-secondary-700 dark:text-secondary-300">
            If Prospera has helped you even a little bit, that makes all the
            late nights worth it.
          </p>
        </div>
      </div>

      <!-- Why Free Section -->
      <div
        class="bg-gradient-to-br from-success-50 to-success-100/50 dark:from-success-900/30 dark:to-success-900/20 rounded-2xl border border-success-200 dark:border-success-800 p-6 sm:p-8 mb-8"
      >
        <div class="flex items-center gap-3 mb-4">
          <SparklesIcon class="w-6 h-6 text-success-600 dark:text-success-400" />
          <h2 class="text-xl font-semibold text-success-800 dark:text-success-300">
            Why is it Free?
          </h2>
        </div>
        <p class="text-success-700 dark:text-success-400 leading-relaxed">
          Because managing your money shouldn't cost you money. I believe
          financial tools should be accessible to everyone, regardless of their
          situation. No premium tiers, no hidden fees, no ads. Just a simple app
          that does what it's supposed to do.
        </p>
      </div>

      <!-- Support Section -->
      <div
        class="bg-gradient-to-br from-accent-50 to-primary-50 dark:from-accent-900/30 dark:to-primary-900/30 rounded-2xl border border-accent-200 dark:border-accent-800 p-6 sm:p-8"
      >
        <div class="text-center">
          <div class="text-5xl mb-4">{{ randomEmoji }}</div>
          <h2 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-3">
            Support the Project
          </h2>
          <p class="text-secondary-600 dark:text-secondary-400 mb-6 max-w-md mx-auto">
            If you're feeling generous and want to support a solo developer's
            caffeine addiction (or beer fund, let's be honest), any amount is
            deeply appreciated!
          </p>

          <div class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700 mb-6">
            <p class="text-lg font-bold text-primary-600 dark:text-primary-400 mb-2">
              "Kahit pang Kape lng ok na!"
            </p>
          </div>

          <!-- Donation Option -->
          <div class="flex flex-col items-center">
            <img
              src="/instapay-qr.JPG"
              alt="GCash or InstaPay QR Code"
              class="w-64 h-64 rounded-xl border border-secondary-200 dark:border-secondary-700 shadow-sm"
            />
            <p class="mt-4 text-lg font-semibold text-secondary-700 dark:text-secondary-300">
              GCash or InstaPay
            </p>
          </div>

          <p class="mt-6 text-sm text-secondary-500 dark:text-secondary-400">
            No pressure at all! Your continued use of Prospera is support
            enough.
          </p>
        </div>
      </div>

      <!-- Footer Message -->
      <div class="mt-10 text-center">
        <p class="text-secondary-500 dark:text-secondary-400 flex items-center justify-center gap-2">
          Made with <HeartIcon class="w-4 h-4 text-danger-500" /> by a solo
          developer
        </p>
        <p class="text-sm text-secondary-400 dark:text-secondary-500 mt-2">
          Thank you for being part of this journey!
        </p>
      </div>
    </div>
  </div>
</template>
