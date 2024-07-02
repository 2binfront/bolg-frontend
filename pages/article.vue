<script lang="ts" setup>
import { marked } from 'marked';
import type { ArticleInfo } from '~/interface';
const userStore = useUserStore();
const article = ref<ArticleInfo>({
  _id: '',
  articleId: '',
  title: '',
  createdAt: '2023-07-21T15:32:35.000Z',
  updatedAt: '2023-07-21T15:32:35.000Z',
  content: '',
  category: '',
  tags: [],
});

const editing = ref(false);
const handleEdit = () => {
  if (userStore.canEdit) {
    editing.value = !editing.value;
  }
};
const handleSave = async () => {
  try {
    const route = useRoute();
    await $fetch(`/api/blog/article/${route.query.id}`, {
      method: 'patch',
      headers: {
        Authorization: `Bearer ${userStore.access_token}`,
      },
      body: {
        title: article.value.title,
        content: article.value.content,
        category: article.value.category,
        tags: article.value.tags,
      },
    });
    editing.value = false;
  } catch (error) {}
};
const loading = ref(false);
onMounted(async () => {
  loading.value = true;
  const route = useRoute();
  article.value = await $fetch(`/api/blog/article/${route.query.id}`);
  loading.value = false;
});

const html = computed(() => marked.parse(article.value.content));
</script>

<template>
  <div class="full">
    <div class="home-links">
      <NuxtLink to="/catalog">Catalog</NuxtLink>
      <NuxtLink to="/tag" ml>Tag</NuxtLink>
      <!-- <NuxtLink to="/archive" ml>Archive</NuxtLink> -->
      <NuxtLink to="/about" ml>About</NuxtLink>
    </div>
    <div class="mt">
      <div class="frb">
        <div class="flex items-end">
          <div @dblclick="handleEdit">
            <h1 v-if="!editing">{{ article.title }}</h1>
            <input v-else v-model="article.title" class="w-400px text-24px fw700" />
          </div>
          <span class="ml-2">{{ `Created at ${article.createdAt}, Updated at ${article.updatedAt}` }}</span>
        </div>
        <button v-if="editing" class="mr" @click="handleSave">Save</button>
      </div>
      <div class="mt-2 flex">
        <div v-if="editing" class="mr flex-1">
          <ClientOnly fallback-tag="span" fallback="Loading...">
            <mavon-editor v-model="article.content" class="h-75vh" />
          </ClientOnly>
        </div>
        <div v-else v-html="html" class="max-w-60vw"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
pre {
  padding: 1em 0 !important;
  --tw-prose-pre-bg: #8881 !important;
}
.line {
  display: block;
  padding: 0 1rem;
}
.line.highlight {
  width: 100%;
  background-color: #8881 !important;
}
.line.diff.remove {
  background-color: rgba(194, 58, 58, 0.3) !important;
}
.line.diff.add {
  background-color: rgba(46, 141, 46, 0.3) !important;
}
.line.diff.remove::before {
  content: '-';
  color: #c23a3a;
  position: absolute;
}
.line.diff.add::before {
  content: '+';
  color: #23b73c;
  position: absolute;
}
</style>
