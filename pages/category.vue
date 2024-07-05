<script lang="ts" setup>
const articleStore = useArticleStore();
const gotoPage = (id: string) => {
  navigateTo(`/article?id=${id}`);
};
</script>

<template>
  <div class="">
    <div v-for="category in articleStore.categories" :key="category._id">
      <div class="flex items-end text-28px fw700"
        ><div class="time-string mr-2">{{ formatTime(category.createdAt!) }}</div
        >{{ category.name }}
      </div>
      <div
        v-for="(article, index) in articleStore.allArticles.filter((v) => v.category === category._id)"
        @click="gotoPage(article._id)"
        class="cp flex items-end article-brief"
      >
        <div class="font-italic mr-2">{{ `${formatTime(article.createdAt)}: ` }} </div>
        <div class="text-20px fw700">{{ ` ${article.title}` }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
