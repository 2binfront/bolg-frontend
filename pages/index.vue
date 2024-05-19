<script lang="ts" setup>
const articleList = [
  { title: 'test1', time: '20011031', tag: 'test', catalog: 'test', content: 'this is a test article', id: 0 },
  { title: 'test1', time: '20011031', tag: 'test', catalog: 'test', content: 'this is a test article', id: 1 },
  { title: 'test1', time: '20011031', tag: 'test', catalog: 'test', content: 'this is a test article', id: 2 },
];
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
        <span>{{ `${article.title} ${article.time}` }}</span>

        <span ml>{{ `${article.catalog} ${article.tag}` }}</span>
      </div>
      <div>
        <span>{{ `${article.content}` }}</span>
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
