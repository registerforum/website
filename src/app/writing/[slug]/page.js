import styles from "@/styles/Article.module.css";
import fetchArticles from "@/utils/articles";
import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/article-body";

export async function generateStaticParams() {
  const articles = await fetchArticles();
  const slugs = articles.map((article) => ({
    slug: article.slug || null,
  }));
  return slugs;
}

export async function generateMetadata({ params }) {
  await params;
  const articles = await fetchArticles();
  const article = articles.find((a) => a.slug === params.slug);

  return {
    title: article?.title || "Article",
  };
}

export default async function Page({ params }) {
  const { slug } = params;
  const articles = await fetchArticles();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>{article.title}</h1>
      {article.cover && (
        <div className={styles.cover}>
          <Image 
            className={styles.image} 
            src={article.cover} 
            alt={article.title || 'Article cover image'}
            width={600}
            height={300}
            priority={true}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover'
            }}
            sizes="(max-width: 768px) 100vw, 600px"
          />
          {article.photocredit && <p className={styles.caption}>Photo: {article.photocredit}</p>}
        </div>
      )}
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
      <ArticleBody content={article.body} />
    </main>
  );
}
