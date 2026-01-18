// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

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
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
    },
  },

  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
});
