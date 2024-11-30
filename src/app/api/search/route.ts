import { NextRequest, NextResponse } from "next/server";
import fetchArticles from "@/utils/articles";
import { unstable_cache } from "next/cache";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const articles = await unstable_cache(async () => { return await fetchArticles() }, ["homepage"], {
            revalidate: 3600
        })();

        // const articles = await fetchArticles();

        const { searchTerm } = await req.json();

        const searchResults = articles.filter((article) => {
            return article.title.toLowerCase().includes(searchTerm)
        });

        return NextResponse.json(searchResults);
    } catch (error) {
        console.error("Error fetching articles:", error);
        return NextResponse.error();
    }
}