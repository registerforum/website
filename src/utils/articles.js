
import { createClient } from '@/utils/supabase/client';


let cachedArticles = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const isTest = process.env.NODE_ENV === 'test';

async function fetchArticles() {
  const now = Date.now();
  if (!isTest && cachedArticles && now - cacheTimestamp < CACHE_DURATION) {
    return cachedArticles;
  }
  const supabase = await createClient();
  const { data: rows } = await supabase.from("articles").select("*");

  const articles = [];

  for (const row of rows) {
    let authors = [];
    try {
      authors = typeof row.writers === "string"
        ? JSON.parse(row.writers.replace(/'/g, '"'))
        : row.writers || [];
    } catch (error) {
      authors = [];
      console.log(error)
    }
    authors = authors.map((author) => ({
      name: author.name,
      slug: author.name.toLowerCase().replace(/\s+/g, "-"),
      position: author.role || null,
    }));
    articles.push({
      title: row.title,
      authors: authors || [
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
      body: row.body || "",
      photocredit: row.image_author || null,
    });
  }
  if (!isTest) {
    cachedArticles = articles;
    cacheTimestamp = now;
  }
  return articles;
}

export default fetchArticles;
