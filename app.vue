<script setup lang="ts">
const userStore = useUserStore();
const articleStore = useArticleStore();
onMounted(async () => {
  await userStore.checkAuth();
  await articleStore.getAllArticles();
});
</script>

<template>
  <div>
    <Html lang="en">
      <Head>
        <Title>Blog</Title>
        <Meta name="description" content="A simple blog system with Nuxt3 and Nest" />
      </Head>
      <Body>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </Body>
    </Html>
  </div>
</template>
