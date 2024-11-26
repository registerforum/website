export interface ArticleCardInfo {
    title: string;
    img: string;
    author: string;
    body: string;
    slug: string;
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

export interface Section {
    name: string;
    editors: string[];
    type: 'parent' | 'child' | 'sub';
    parent: string | null;
    slug: string;
}