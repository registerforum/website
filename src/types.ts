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
    authors: [{
        name: string | null;
        slug: string | null;
        position: string | null;
    }];
    date: string | null;
    slug: string | null;
    cover: string | null;
    views: number | null;
    trending: boolean;
    type: string | null;
    body: string | null;
}

export interface Section {
    name: string | null;
    editors: string[] | null;
    type: string | null;
    parent: string | null;
    slug: string | null;
    children: Section[];
};