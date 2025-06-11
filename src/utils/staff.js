// Removed unused google import
import fetchArticles from "@/utils/articles";
import { createClient } from "@/utils/supabase/client";

export default async function fetchStaff() {
    const supabase = await createClient();
    const { data: rows } = await supabase.from("staff").select("*");


    const articles = await fetchArticles();

    var staff = rows.map((row) => ({
        name: row.name || null,
        slug: row.slug
            ? row.slug.toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "")
            : null,
        position: row.titles || 'Contributing Writer',
        articles: articles.filter((a) => a.author === row.name)
    }));

    for (const article of articles) {
        if (!staff.find((a) => a.name === article.author)) {
            staff.push({
                name: article.author,
                slug: article.author.toLowerCase().replace(/\s/g, "-"),
                position: 'Contributing Writer',
                articles: [article],
            });
        } else if (!staff.find((a) => a.name === article.author).articles.find((a) => a.slug === article.slug)) {
            staff.find((a) => a.name === article.author).articles.push(article);
        }
    }
    

    for (const person of staff) {
        if (!person.position) {
            person.position = 'Contributing Writer';
        }
    }
    
    return staff;
}