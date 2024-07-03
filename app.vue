<script setup lang="ts">
const userStore = useUserStore();
const articleStore = useArticleStore();

onMounted(async () => {
  await callOnce(async () => userStore.checkAuth());
  await callOnce(async () => articleStore.getAllArticles());
});
</script>

<template>
  <div>
    <Html lang="en">
      <Head>
        <Title>Simple blog using Nuxt3</Title>
        <Meta name="description" content="Trying to implement a simple blog system in Nuxt3" />
      </Head>
      <Body>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </Body>
    </Html>
  </div>
</template>
