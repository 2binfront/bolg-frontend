export interface ArticleInfo {
  _id: string;
  articleId: string;
  title: string;
  create_date: string;
  updatedAt: string;
  content: string;
  category: string;
  tags: string[] | string;
}
export interface Category {
  _id: string;
  name: string;
  create_date?: string;
  updatedAt?: string;
}
export interface Tag {
  _id: string;
  name: string;
  create_date?: string;
  updatedAt?: string;
}
