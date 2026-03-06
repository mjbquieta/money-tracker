// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },

  app: {
    head: {
      title: 'Prospera',
      titleTemplate: '%s | Prospera',
      meta: [
        { name: 'description', content: 'Prospera helps you track your money, manage expenses, and build healthier financial habits — so you can focus on growing your future with confidence.' },
        { name: 'theme-color', content: '#16a34a' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/prospera-icon.png' },
      ],
      script: [
        {
          innerHTML: `(function(){var t=localStorage.getItem('theme-preference');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')})()`,
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || '',
    },
  },

  nitro: {
    devProxy: {
      '/api/': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },

  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@vite-pwa/nuxt'],

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Prospera',
      short_name: 'Prospera',
      description: 'Personal finance management — track money, manage expenses, build healthier financial habits.',
      theme_color: '#16a34a',
      background_color: '#f8fafc',
      display: 'standalone',
      orientation: 'portrait-primary',
      icons: [
        {
          src: '/prospera-icon.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/prospera-icon.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/prospera-icon.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: false,
    },
  },
});
