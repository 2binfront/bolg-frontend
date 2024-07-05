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
  },
});
