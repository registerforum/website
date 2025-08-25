
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
  
  // Fetch all articles using pagination with a for loop
  let allRows = [];
  const pageSize = 1000;
  
  for (let page = 0; ; page++) {
    const start = page * pageSize;
    const end = start + pageSize - 1;
    
    const { data: rows, error } = await supabase
      .from("articles")
      .select("*")
      .range(start, end);

    if (error) {
      console.error('Supabase error:', error);
      break;
    }

    if (rows && rows.length > 0) {
      allRows = allRows.concat(rows);
      console.log(`Fetched page ${page + 1}: ${rows.length} rows`);
      
      // If we got fewer rows than the page size, we've reached the end
      if (rows.length < pageSize) {
        break;
      }
    } else {
      break;
    }
  }

  console.log(`Total rows fetched from database: ${allRows.length}`);

  const articles = [];
  let skippedCount = 0;

  for (const row of allRows) {
    try {
      let authors = [];
      try {
        authors = typeof row.writers === "string"
          ? JSON.parse(row.writers.replace(/'/g, '"'))
          : row.writers || [];
      } catch (error) {
        console.log(`Author parsing error for article ${row.slug}:`, error);
        authors = [];
      }
      
      if (!Array.isArray(authors)) {
        console.log(`Authors not an array for ${row.slug}:`, authors);
        authors = [];
      }
      
      authors = authors.map((author) => ({
        name: author.name,
        slug: author.name?.toLowerCase().replace(/\s+/g, "-"),
        position: author.role || null,
      }));
      
      const article = {
        title: row.title,
        authors: authors.length > 0 ? authors : [
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
      };
      
      articles.push(article);
      
      // Log every 10th article for sampling
      if (articles.length % 10 === 0) {
        console.log(`Article ${articles.length}:`, {
          slug: article.slug,
          type: article.type,
          trending: article.trending,
          visibility: article.visibility,
          hasDate: !!article.date
        });
      }
      
    } catch (error) {
      console.error(`Failed to process article ${row.slug}:`, error);
      skippedCount++;
    }
  }
  
  console.log(`Total articles processed: ${articles.length}, skipped: ${skippedCount}`);
  console.log(`Opinion articles: ${articles.filter(a => a.type === 'opinion').length}`);
  console.log(`Trending articles: ${articles.filter(a => a.trending).length}`);
  console.log(`Articles with dates: ${articles.filter(a => a.date).length}`);
  
  if (!isTest) {
    cachedArticles = articles;
    cacheTimestamp = now;
  }
  return articles;
}

export default fetchArticles;
