<script lang="ts" setup>
const articleStore = useArticleStore();
const route = useRoute();

const curArticles = computed(() => {
  if (route.query.tagId) {
    return articleStore.allArticles.filter((v) => v.tags.includes(route.query.tagId as string));
  } else {
    return articleStore.allArticles;
  }
});
const gotoPage = (id: string) => {
  navigateTo(`/article?id=${id}`);
};
</script>

<template>
  <div class="full">
    <div v-for="(article, index) in curArticles" @click="gotoPage(article._id)" class="cp my article-brief">
      <div>
        <span class="time-string">{{ `Created on ${formatTime(article.create_date)}, Updated on ${formatTime(article.updatedAt)}` }}</span>
      </div>
      <div class="flex items-end">
        <h2>{{ `${article.title}` }}</h2>
        <div ml>{{ `${articleStore.categories.find((v) => v._id === article.category)?.name} ` }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
