<script setup lang="ts">
import {
  HeartIcon,
  CodeBracketIcon,
  SparklesIcon,
} from "@heroicons/vue/24/outline";

definePageMeta({
  layout: false,
});
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
        <h1
          class="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-4"
        >
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
            <CodeBracketIcon
              class="w-5 h-5 text-primary-600 dark:text-primary-400"
            />
          </div>
          <h2
            class="text-xl font-semibold text-secondary-900 dark:text-secondary-100"
          >
            The Story
          </h2>
        </div>

        <div
          class="space-y-4 text-secondary-600 dark:text-secondary-400 leading-relaxed"
        >
          <p>
            Hey there! I'm
            <a
              href="https://michaelquieta.com"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >Michael Quieta</a
            >, a freelance developer who loves building things that make life a
            little easier. Prospera started as a simple idea: what if tracking
            your money didn't have to feel like a chore?
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
          <SparklesIcon
            class="w-6 h-6 text-success-600 dark:text-success-400"
          />
          <h2
            class="text-xl font-semibold text-success-800 dark:text-success-300"
          >
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
          <div class="mb-4 flex justify-center">
            <svg
              class="w-16 h-16"
              viewBox="0 0 1292 1537"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="matrix(3.377, 0, 0, 3.377, -439.192, -60.021)">
                <path
                  d="M392.3,239.5c0.9-1-19.6-13.2-54.2-18.9c-17.2-3.1-37.7-4-59.6-3.2c-21.8,1.4-45.6,4.5-67.7,13.9 c-2.9,1.2-5.7,2.7-8.4,4.6c-2.6,2-5.4,4.5-6.6,8.8c-1.3,4,0.9,9.3,3.9,11.5c2.8,2.4,6.3,3.7,8.9,4.6c11.1,4.1,22.6,6.7,33.6,8.7 c22,4.3,43.1,6.2,61.4,6.9c18.3,0.8,34.1,0,45.4-1.1c11.9-0.9,18.6-3,20.2-3.2c11.7-2.7,19.9-8.8,18.6-12.1 c-1.3-3.5-10.7-3.2-21.6-0.7c-1.3,0.1-8.1,2.4-18.5,3.5c-10.9,1.4-25.8,2.7-43.8,2.5c-17.9-0.1-38.5-1.2-60.1-4.7 c-10.9-1.6-21.8-3.8-32.6-7.3c-5.5-1.5-9.3-4.1-8.3-7c0.7-3.2,5.9-6.9,10.6-9c20.9-9.7,43.9-13.5,65.4-15.7 c21.6-1.6,41.9-1.4,59,1c17.2,2.3,31.1,6.1,40.6,9.6C388.1,235,392.2,239.8,392.3,239.5z"
                  fill="#8B6538"
                  stroke="#8B6538"
                  stroke-width="3"
                />
                <path
                  d="M320.2,388.7c0-0.1-11.1-0.4-27.7-2.6c-16.4-2.1-39.3-7.9-57.4-23c-18.4-14.6-29.8-36.5-35.5-53.3 c-3-8.4-5-15.8-6.3-21.1c-1.5-5.8-1.6-9.3-1.8-9.9c-0.5-5.2,1.3-9.2,4.6-10.6c3.4-1.5,7.9,3.2,8.4,9.1c0.2,0.7,0.2,4.1,1,8.8 c0.9,5.1,2.3,12.2,4.5,20.3c2.3,8.2,5.3,17.3,10.1,26.3c4.8,9,11.2,18,19.1,25.3c15.8,15.3,37.3,22.7,53.5,26 C309.2,387.5,320.3,388.6,320.2,388.7z"
                  fill="#8B6538"
                  stroke="#8B6538"
                  stroke-width="3"
                />
                <path
                  d="M404.6,311.6c-0.1-0.1,8-6.8,19.5-17.6c11.1-10.7,26.2-27.1,29.3-47.4c1.7-9.8,0-20.3-5.9-26.2 c-2.7-2.8-6.8-5-10.3-5.9c-3.6-1-7.4-0.8-10.9-0.3c-6.9,1.3-12.3,4.5-15.4,7.1c-2.5,2.3-4.2,5.1-4.5,5.5 c-2.7,3.8-7.3,6.1-10.5,4.2c-3.1-1.9-3.6-7-0.2-11.9c0.6-0.6,2.1-3.4,7.4-7.7c4.9-3.6,12.3-7.2,21.7-8.2 c9.3-1.1,21.6,1.8,29.3,11.2c7.9,9.6,8.2,22.7,5.5,33.4c-5.4,22.4-22.4,37.7-34.4,47.6C413.1,305.5,404.6,311.5,404.6,311.6z"
                  fill="#8B6538"
                  stroke="#8B6538"
                  stroke-width="3"
                />
                <path
                  d="M204.3,331.8c0.1,0.1-4.1,2.2-9.4,8.1c-2.6,3-5.2,7.3-6.5,12.8c-1.3,5.5-1,12.2,1.7,18.7 c5.2,13.2,18.4,24.4,33.6,32.4c15.2,8.4,33.2,14.1,51.6,17.1c18.4,3,37.3,3.4,54.9,2c17.8-1.6,34.1-5.5,47.9-9.7 c28-9.1,45-20.9,47-22.1c7.8-5.3,11.8-12.3,9.5-15.2c-2.3-2.9-9.7-0.6-16.9,4.3c-1.7,1.1-17.3,12.8-43,22.4 c-13.1,4.6-28.6,9.1-45.4,11.3c-16.9,2.1-35.2,2.5-53.1,0.5c-17.9-2-35.5-6.7-50.6-14.2c-15.3-7.1-28.1-17.3-33.7-29.5 c-5.9-12.3-1.4-24.5,3.4-30.3C200.3,334.2,204.5,331.9,204.3,331.8z"
                  fill="#8B6538"
                  stroke="#8B6538"
                  stroke-width="3"
                />
                <path
                  d="M286.3,191c-0.1-0.1,9.1-6.7,22.3-17.1c3.1-2.8,7.1-5.4,10.2-8.8c3.2-3.2,5.9-7.8,5.9-12.2 c0-4.4-3.5-8.5-7.5-11.7c-4.1-3.3-9-6-14-8.5c-10-5.3-20.7-9.5-30.2-16.1c-4.7-3.3-9.4-7.4-12.1-13.4c-2.8-6.1-1.9-13.1,0.4-18 c5-10.2,12.7-14.5,17.5-17.7c5.1-3.1,8.4-4.5,9-4.8c5.5-2.4,11-1.1,12.1,2.3c1.2,3.5-2,7.6-6.8,9.8c-0.6,0.3-3.7,1.4-8.1,3.7 c-4.3,2.3-10.6,5.9-13.7,11.6c-1.5,2.9-2.2,6.1-1,9.4c1.2,3.3,4.3,6.9,8.1,10c7.8,6.3,18.2,11.5,28,17.6c5,3,9.9,6.2,14.3,10.2 c4.2,3.9,8.6,9.3,8.2,15.9c-0.5,6.4-4.2,10.9-7.9,14.3c-3.8,3.5-7.8,5.6-11.1,8.3C295.7,185,286.2,190.8,286.3,191z"
                  fill="#A0826D"
                  stroke="#A0826D"
                  stroke-width="3"
                />
              </g>
            </svg>
          </div>
          <h2
            class="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-3"
          >
            Support the Project
          </h2>
          <p
            class="text-secondary-600 dark:text-secondary-400 mb-6 max-w-md mx-auto"
          >
            If you're feeling generous and want to support a solo developer's
            caffeine addiction, any amount is deeply appreciated!
          </p>

          <div
            class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700 mb-6"
          >
            <p
              class="text-lg font-bold text-primary-600 dark:text-primary-400 mb-2"
            >
              "Buy Me a Coffee"
            </p>
          </div>

          <!-- Donation Option -->
          <div class="flex flex-col items-center">
            <img
              src="/instapay-qr.JPG"
              alt="GCash or InstaPay QR Code"
              class="w-64 h-64 rounded-xl border border-secondary-200 dark:border-secondary-700 shadow-sm"
            />
            <p
              class="mt-4 text-lg font-semibold text-secondary-700 dark:text-secondary-300"
            >
              GCash or InstaPay
            </p>
          </div>

          <p class="mt-6 text-sm text-secondary-500 dark:text-secondary-400">
            No pressure at all! Your continued use of Prospera is support
            enough.
          </p>
        </div>
      </div>
    </div>

    <LayoutPublicFooter />
  </div>
</template>
