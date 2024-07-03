export interface ArticleInfo {
  _id: string;
  articleId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  category: string;
  tags: string[] | string;
}
