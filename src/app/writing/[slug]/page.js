import { google } from "googleapis";
import styles from "@/styles/Article.module.css";
import fetchArticles from "@/utils/articles"; 

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const articles = await fetchArticles();

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function Page({ params: paramsPromise }) {
  const params = await paramsPromise;
  const articles = await fetchArticles();
  const article = articles.find((a) => a.slug === params.slug);
  const pars = article.body.split("\n");

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>{article.title}</h1>
      <div className={styles.cover}>
        <img className={styles.image} src={article.cover} alt={article.title} />
        <p className={styles.byline}>{article.caption}</p>
      </div>
      <article className={styles.body}>
        {pars.map((par, index) => (
          <p key={index} className={styles.par}>{par}</p>
        ))}
      </article>
    </main>
  );
}
