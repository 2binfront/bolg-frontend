// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true, // 确保启用了SSR
  css: ['~/assets/style/main.scss'],
  modules: ['@unocss/nuxt', '@nuxtjs/mdc', '@nuxt/image', '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],
  runtimeConfig: {},
  routeRules: {
    '/api/blog/**': { proxy: { to: 'http://127.0.0.1:10010/api/blog/**' } },
  },
  //   能自动引入
  //   plugins: [{ src: '~/plugins/vue-mavon-editor', mode: 'client' }],
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
