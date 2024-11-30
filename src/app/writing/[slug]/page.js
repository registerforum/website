import styles from "@/styles/Article.module.css";
import fetchArticles from "@/utils/articles";
import { unstable_cache } from "next/cache";

export const revalidate = 3600;  // Revalidate every hour
export const dynamicParams = true; // Dynamic routes based on slug

// Generate dynamic slugs for static paths
export async function generateStaticParams() {
  const articles = await fetchArticles(); // Fetch all articles
  return articles.map((article) => ({
    slug: article.slug,  // Generate dynamic params for each article's slug
  }));
}

// Static generation with revalidation every hour
export default async function Page({ params }) {
  const { slug } = params;  // Get the slug from dynamic params

  // Use unstable_cache with the slug as part of the cache key
  const articles = await unstable_cache(async () => {
    return await fetchArticles(); // Fetch all articles
  }, [slug], { revalidate: 3600 }); // Cache depends on the slug
  
  const article = articles.find((a) => a.slug === slug); // Find the article based on slug
  
  if (!article) {
    return <div>Article not found</div>; // Return a "not found" message if article is missing
  }

  const pars = article.body?.split("\n") || []; // Split the body into paragraphs

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>{article.title}</h1>

      <div className={styles.cover}>
        <img className={styles.image} src={article.cover} alt={article.title} />
        <p className={styles.caption}>{article.caption}</p>
      </div>

      {/* Render the author's name and position */}
      <div className={styles.author}>
        <a href={`/staff/${article.author.slug}`} className={styles.name}>
          {article.author.name}
        </a>
        <p className={styles.position}>,&nbsp;{article.author.position}</p>
      </div>

      {/* Render the article body as paragraphs */}
      <article className={styles.body}>
        {pars.map((par, index) => (
          <p key={index} className={styles.par}>{par}</p>
        ))}
      </article>
    </main>
  );
}
