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
export interface Category {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface Tag {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}
