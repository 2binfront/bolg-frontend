import type { ArticleInfo, ArticleQuery, Category, PaginatedResponse, Tag } from '~/interface';

export const useArticleStore = defineStore('articleStore', {
  state: (): {
    curArticle: ArticleInfo;
    allArticles: ArticleInfo[];
    categories: Category[];
    tags: Tag[];
    pagination: Omit<PaginatedResponse<ArticleInfo>, 'items'>;
  } => ({
    curArticle: {
      id: '',
      articleId: '',
      title: '',
      is_deleted: false,
      sequence: 0,
      create_date: '',
      write_date: '',
      content: '',
      category: '',
      tags: [],
    },
    allArticles: [],
    categories: [],
    tags: [],
    pagination: {
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    },
  }),
  actions: {
    async getArticles(query: ArticleQuery = {}) {
      try {
        const response = await $fetch<PaginatedResponse<ArticleInfo>>(`/api/blog/article`, {
          query,
        });
        this.allArticles = response.items;
        this.pagination = {
          total: response.total,
          page: response.page,
          pageSize: response.pageSize,
          totalPages: response.totalPages,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async getReferenceData() {
      try {
        this.categories = await $fetch(`/api/blog/category`);
        this.tags = await $fetch(`/api/blog/tag`);
      } catch (error) {
        console.log(error);
      }
    },
    async getSingleArticles(id: string) {
      this.curArticle = await $fetch(`/api/blog/article/${id}`);
    },
    async delArticle(id: string) {
      await $fetch(`/api/blog/article/${id}`, {
        method: 'delete',
        headers: {
          Authorization: `Bearer ${useUserStore().access_token}`,
        },
      });
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
    async delCategory(category: { name: string; id: string }) {
      await $fetch(`/api/blog/category?id=${category.id}`, {
        method: 'delete',
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
    async delTag(tag: { name: string; id: string }) {
      await $fetch(`/api/blog/tag?id=${tag.id}`, {
        method: 'delete',
        headers: {
          Authorization: `Bearer ${useUserStore().access_token}`,
        },
        body: { name: tag.name },
      });
    },
  },
});
