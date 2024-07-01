<script lang="ts" setup>
// import { prefix } from '/public/config.js';
const articleList = ref<any>([]);
onMounted(async () => {
  articleList.value = await $fetch(`/api/blog/article`);
});
const gotoPage = (id: number) => {
  const router = useRouter();
  router.push(`/article?id=${id}`);
};
</script>

<template>
  <div class="full">
    <div class="home-links">
      <NuxtLink to="/catalog">Catalog</NuxtLink>
      <NuxtLink to="/tag" ml>Tag</NuxtLink>
      <!-- <NuxtLink to="/archive" ml>Archive</NuxtLink> -->
      <NuxtLink to="/about" ml>About</NuxtLink>
    </div>
    <div v-for="(article, index) in articleList" @click="gotoPage(article.id)" class="cp my article-brief">
      <div>
        <span>{{ `Created at ${article.createdAt}, Updated at ${article.updatedAt}` }}</span>
      </div>
      <div class="flex items-end">
        <h3>{{ `${article.title}` }}</h3>
        <div ml>{{ `${article.category} ` }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-links {
}

.article-brief {
  &:hover {
    color: #551a8b;
  }
}
</style>
