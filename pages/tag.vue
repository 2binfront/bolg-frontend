<script lang="ts" setup>
import type { Tag } from '~/interface';

const articleStore = useArticleStore();
const showSpecificArticle = (tag: Tag) => {
  navigateTo(`/articles?tagId=${tag._id}`);
};
</script>

<template>
  <div class="flex">
    <div class="mx font-italic text-20px cp underline article-brief" v-for="tag in articleStore.tags" :key="tag._id" @click="showSpecificArticle(tag)">{{
      tag.name
    }}</div>
  </div>
</template>

<style lang="scss" scoped></style>
