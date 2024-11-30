import styles from "@/styles/Article.module.css";
import fetchArticles from "@/utils/articles";
import fetchStaff from "@/utils/staff";
import { unstable_cache } from "next/cache";

export const revalidate = 3600;  // Revalidate every hour
export const dynamicParams = true; // Allow dynamic params for articles

// Generate dynamic slugs for static paths
export async function generateStaticParams() {
  const articles = await fetchArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function Page({ params }) {
  const { slug } = params;

  // Fetch articles and staff data with caching
  const articles = await unstable_cache(fetchArticles, [], { revalidate: 3600 });
  const staff = await unstable_cache(fetchStaff, [], { revalidate: 3600 });

  // Find the article matching the current slug
  const article = articles.find((a) => a.slug === slug);
  
  // If article is not found, handle the error gracefully
  if (!article) {
    return <div>Article not found.</div>;
  }

  // Find the author details if the article has an author
  const author = article.author ? staff.find((a) => a.name === article.author) : null;

  // Split the body text into paragraphs if it exists
  const pars = article.body?.split("\n") || [];

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>{article.title}</h1>
      
      {/* Article Cover Image */}
      <div className={styles.cover}>
        {article.cover && <img className={styles.image} src={article.cover} alt={article.title} />}
        {article.caption && <p className={styles.caption}>{article.caption}</p>}
      </div>

      {/* Author Info */}
      {article.author && author && (
        <a className={styles.author} href={`/staff/${article.author.toLowerCase().replace(/\s/g, "-")}`}>
          By {article.author}, <div className={styles.position}>{author.position}</div>
        </a>
      )}

      {/* Article Body */}
      <article className={styles.body}>
        {pars.map((par, index) => (
          <p key={index} className={styles.par}>{par}</p>
        ))}
      </article>
    </main>
  );
}
