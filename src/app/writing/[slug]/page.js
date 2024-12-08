import styles from "@/styles/Article.module.css";
import fetchArticles from "@/utils/articles";
import { unstable_cache } from "next/cache";
import React from "react";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const articles = await fetchArticles();

  const slugs = articles.map((article) => ({
    slug: article.slug || null,
  }));

  return slugs;
}

export async function generateMetadata({ params }) {
  const articles = await unstable_cache(async () => { return await fetchArticles() }, ["articleMetadata"], {
    revalidate: 3600
  })();

  return {
    title: articles.find((a) => a.slug === params.slug).title,
  }
}

export default async function Page({ params }) {
  const { slug } = await params;
  const articles = await unstable_cache(async () => { return await fetchArticles() }, ["article"], {
    revalidate: 3600,
    tags: [slug],
  })();
  const article = articles.find((a) => a.slug === slug);
  const pars = article.body?.split("\n");

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>{article.title}</h1>
      <div className={styles.cover}>
        <img className={styles.image} src={article.cover} alt={article.title} />
        {article.photocredit && <p className={styles.caption}>Photo: {article.photocredit}</p>}
      </div>
      {article.authors && article.authors.length > 0 && (
        <div className={styles.authors}>
          {article.authors.map((author, index) => (
            <React.Fragment key={index}>
              <a href={`/staff/${author.slug}`} className={styles.author}>
                <div className={styles.name}>{author.name}</div>
                <p className={styles.position}>,&nbsp;{author.position?.trim() || "Contributing Writer"}</p>
              </a>
              {index < article.authors.length - 1 && <p className={styles.separator}>&</p>}
            </React.Fragment>
          ))}
          <p className={styles.date}>{article.date}</p>
        </div>
      )}
      <article className={styles.body}>
        {pars.map((par, index) => (
          <p key={index} className={styles.par}>{par}</p>
        ))}
      </article>
    </main>
  );
}
