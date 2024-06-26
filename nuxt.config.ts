// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/style/main.scss'],
  modules: ['@unocss/nuxt', '@nuxtjs/mdc'],
  routeRules: {
    '/api/blog/**': { proxy: { to: 'http://127.0.0.1:10010/api/blog/**' } },
  },
  mdc: {
    highlight: {
      theme: {
        default: 'vitesse-light',
        dark: 'material-theme-palenight',
      },
      preload: ['sql'],
    },
    remarkPlugins: {
      'remark-mdc': {
        options: {
          experimental: {
            autoUnwrap: true,
          },
        },
      },
    },
  },
});
