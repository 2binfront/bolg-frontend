<script lang="ts" setup>
import type { Tag } from '~/interface';

const articleStore = useArticleStore();
const showSpecificArticle = (tag: Tag) => {
  navigateTo(`/articles?tagId=${tag._id}`);
};

const addT = ref({
  name: '',
});
const editing = computed(() => {
  const route = useRoute();
  if (route.query.edit) {
    return true;
  } else {
    return false;
  }
});

const handleAddT = async (name: string) => {
  await articleStore.addTag(name);
};
const handleEditT = async (tag: any) => {
  await articleStore.editTag(tag);
};
const handleDel = async (tag: any) => {
  await articleStore.delTag(tag);
};
</script>

<template>
  <div class="flex">
    <div class="mx font-italic text-20px cp underline article-brief" v-for="tag in articleStore.tags" :key="tag._id" @click="showSpecificArticle(tag)">
      <div v-if="!editing">
        {{ tag.name }}
      </div>
      <div v-else>
        <input class="text-20px fw700" type="text" v-model="tag.name" @keyup.enter="handleEditT(tag)" />
        <button @click="handleDel">delete</button>
      </div>
    </div>
    <div v-if="editing" class="ml-8 mt"> new Tag: <input type="text" v-model="addT.name" @keyup.enter="handleAddT(addT.name)" /> </div>
  </div>
</template>

<style lang="scss" scoped></style>
