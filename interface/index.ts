export interface ArticleInfo {
  id: string;
  is_deleted?: boolean;
  articleId: string;
  title: string;
  create_date: string;
  write_date: string;
  content: string;
  category: any;
  tags: number[];
  sequence?: number;
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
