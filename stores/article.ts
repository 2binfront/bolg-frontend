import type { ArticleInfo } from '~/interface';

export const useArticleStore = defineStore('articleStore', {
  state: (): {
    curArticle: ArticleInfo;
    allArticles: ArticleInfo[];
  } => ({
    curArticle: {
      _id: '',
      articleId: '',
      title: '',
      createdAt: '2023-07-21T15:32:35.000Z',
      updatedAt: '2023-07-21T15:32:35.000Z',
      content: '',
      category: '',
      tags: [],
    },
    allArticles: [],
  }),
  actions: {
    async getAllArticles() {
      this.allArticles = await $fetch(`/api/blog/article`);
    },
    async getSingleArticles(id: string) {
      this.curArticle = await $fetch(`/api/blog/article/${id}`);
    },
  },
});
