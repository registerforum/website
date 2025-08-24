import { NextResponse } from "next/server";
import fetchArticles from "@/utils/articles";

export async function POST(req) {
    try {
        const articles = await fetchArticles();
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