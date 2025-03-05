<script lang="ts" setup>
const articleStore = useArticleStore();
const gotoPage = (id: string) => {
  navigateTo(`/article?id=${id}`);
};
const editing = computed(() => {
  const route = useRoute();
  if (route.query.edit) {
    return true;
  } else {
    return false;
  }
});
const addC = ref('');

const handleAddC = async () => {
  nextTick(async () => {
    await articleStore.addCategory(addC.value);
  });
};
const handleEditC = async (item: any) => {
  await articleStore.editCategory(item);
};
const handleDel = async (item: any) => {
  await articleStore.delCategory(item);
};

const showSpecificArticle = (category: any) => {
  navigateTo(`/articles?categoryId=${category.id}`);
};
</script>

<template>
  <div class="flex flex-wrap items-start">
    <div v-for="category in articleStore.categories" :key="category.id" @click="showSpecificArticle(category)" class="flex flex-col ml-8 mt cp">
      <div class="flex items-end text-28px fw700">
        <div class="time-string mr-2">{{ formatTime(category.create_date!) }} </div>
        <div v-if="!editing">{{ category.name }}</div>
        <div v-else class="text-20px fw700">
          <input class="text-20px fw700" type="text" v-model="category.name" @keyup.enter="handleEditC(category)" />
          <button @click="handleDel">delete</button>
        </div>
      </div>
      <div
        v-for="(article, index) in articleStore.allArticles.filter((v) => v.category === category.id)"
        @click="gotoPage(article.id)"
        class="cp flex items-end article-brief"
      >
        <div class="font-italic mr-2">{{ `${formatTime(article.create_date)}: ` }} </div>
        <div class="text-20px fw700">{{ `${article.title}` }}</div>
      </div>
    </div>
    <div v-if="editing" class="ml-8 mt"> new Category: <input type="text" v-model="addC" @keyup.enter="handleAddC" /> </div>
  </div>
</template>

<style lang="scss" scoped></style>
