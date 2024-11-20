export interface ArticleCardInfo {
    title: string;
    img: string;
    author: string;
    body: string;
    id: number;
}

export interface Article {
    title: string | null;
    author: string | null;
    date: string | null;
    slug: string | null;
    cover: string | null;
    views: number | null;
    trending: boolean;
    type: string | null;
    body: string | null;
  }