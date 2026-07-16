export interface ArticleInfo {
  id: number | string;
  is_deleted?: boolean;
  articleId: string;
  title: string;
  create_date: string;
  write_date: string;
  content: string;
  category: Category | number | string;
  tags: Array<Tag | number | string>;
  sequence?: number;
}

export interface ArticleQuery {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  tagId?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Category {
  id: string;
  name: string;
  create_date?: string;
  write_date?: string;
  sequence?: number;
}
export interface Tag {
  id: string;
  name: string;
  create_date?: string;
  write_date?: string;
  sequence?: number;
}
