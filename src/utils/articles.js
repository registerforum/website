import { createClient } from '@/utils/supabase/client';
import { unstable_cache } from "next/cache";

const fetchArticles = unstable_cache(async () => {
  const supabase = await createClient();
  const { data: rows } = await supabase.from("articles").select("*");

  console.log(rows);

  console.log(rows);

  const articles = [];

  for (const row of rows) {
    // let authors = [];

    // try {
    //   authors = typeof row.writers === "string"
    //     ? JSON.parse(row.writers)
    //     : row.writers || [];
    // } catch (error) {
    //   authors = [];
    //   console.error("Error parsing authors:", error);
    // }

    // authors = authors.map((author) => ({
    //   name: author.name,
    //   slug: author.name.toLowerCase().replace(/\s+/g, "-"),
    //   position: author.role || null,
    // }));

    articles.push({
      title: row.title,
      authors: [
        {
          name: "Test Author",
          slug: "test-author",
          position: "Contributing Writer"
        }
      ],
      date: row.date || null,
      slug: row.slug,
      cover: row.image || null,
      visibility: row.published,
      views: 0,
      trending: row.published,
      type: row.section || null,
      body: row.body || null,
      photocredit: row.image_author || null,
    });
  }

  console.log(articles);

  return articles;
}, { revalidate: 300 }); // Revalidate every 5 minutes

export default fetchArticles;
