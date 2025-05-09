// https://nuxt.com/docs/api/configuration/nuxt-config

require('dotenv').config();
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  ssr: true, // 确保启用了SSR
  css: ['~/assets/style/main.scss'],
  modules: ['@unocss/nuxt', '@nuxtjs/mdc', '@nuxt/image', '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],
  runtimeConfig: {},
  routeRules: {
    '/api/blog/**': { proxy: `${process.env.API_URL}/api/blog/**` },
    '/api/rss.xml': { proxy: `${process.env.API_URL}/api/rss.xml` },
    '/api/atom.xml': { proxy: `${process.env.API_URL}/api/atom.xml` },
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
