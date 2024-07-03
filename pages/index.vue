<script lang="ts" setup>
// import { prefix } from '/public/config.js';
const articleStore = useArticleStore();
onMounted(async () => {
  //   articleList.value = await $fetch(`/api/blog/article`);
});
const gotoPage = (id: string) => {
  navigateTo(`/article?id=${id}`);
};
</script>

<template>
  <div class="full">
    <div v-for="(article, index) in articleStore.allArticles" @click="gotoPage(article._id)" class="cp my article-brief">
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
.article-brief {
  &:hover {
    color: #551a8b;
  }
}
</style>
