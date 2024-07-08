import type { ArticleInfo, Category, Tag } from '~/interface';

export const useArticleStore = defineStore('articleStore', {
  state: (): {
    curArticle: ArticleInfo;
    allArticles: ArticleInfo[];
    categories: Category[];
    tags: Tag[];
  } => ({
    curArticle: {
      _id: '',
      articleId: '',
      title: '',
      createdAt: '',
      updatedAt: '',
      content: '',
      category: '',
      tags: [],
    },
    allArticles: [],
    categories: [],
    tags: [],
  }),
  actions: {
    async getAllArticles() {
      this.allArticles = await $fetch(`/api/blog/article`);
      this.categories = await $fetch(`/api/blog/category`);
      this.tags = await $fetch(`/api/blog/tag`);
    },
    async getSingleArticles(id: string) {
      this.curArticle = await $fetch(`/api/blog/article/${id}`);
    },
    async addCategory(category: string) {
      await $fetch(`/api/blog/category`, {
        method: 'post',
        headers: {
          Authorization: `Bearer ${useUserStore().access_token}`,
        },
        body: {
          name: category,
        },
      });
    },
    async editCategory(category: { name: string; id: string }) {
      await $fetch(`/api/blog/category?id=${category.id}`, {
        method: 'patch',
        headers: {
          Authorization: `Bearer ${useUserStore().access_token}`,
        },
        body: { name: category.name },
      });
    },
    async addTag(tag: string) {
      await $fetch(`/api/blog/tag`, {
        method: 'post',
        headers: {
          Authorization: `Bearer ${useUserStore().access_token}`,
        },
        body: {
          name: tag,
        },
      });
    },
    async editTag(tag: { name: string; id: string }) {
      await $fetch(`/api/blog/tag?id=${tag.id}`, {
        method: 'patch',
        headers: {
          Authorization: `Bearer ${useUserStore().access_token}`,
        },
        body: { name: tag.name },
      });
    },
  },
});
