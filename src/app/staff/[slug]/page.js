import styles from "@/styles/Staff.module.css";
// import fetchStaff from "@/utils/staff";
import { LeftImageSmallCard } from "@/components/cards";
import { unstable_cache } from "next/cache";
import fetchArticles from "@/utils/articles";
import Head from "next/head";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const articles = await unstable_cache(async () => { return await fetchArticles() }, ["staff"], {
    revalidate: 3600,
  })();

  var staff = [];

  for (const article of articles) {
    for (const author of article.authors) {
      if (!staff.find((a) => a.name === author.name)) {
        staff.push({
          name: author.name || null,
          slug: author.name?.toLowerCase().replace(/\s/g, "-"),
          position: 'Contributing Writer',
          articles: [article],
        });
      } else if (!staff.find((a) => a.name === author.name).articles.find((a) => a.slug === article.slug)) {
        staff.find((a) => a.name === author.name).articles.push(article);
      }
    }
  }


  return staff.map((person) => ({
    slug: person.slug,
  }));
}

export default async function Page({ params: paramsPromise }) {
  const params = await paramsPromise;
  const articles = await unstable_cache(async () => { return await fetchArticles() }, ["staff"], {
    revalidate: 3600,
    tags: [params.slug],
  })();
  const person = articles.find((a) => a.authors.some((author) => author.slug === params.slug)).authors.find((author) => author.slug === params.slug);
  let personArticles = [];

  for (const article of articles) {
    if (article.authors.some((author) => author.slug === params.slug)) {
      personArticles.push(article);
    }
  }

  return (
    <>
      <main className={styles.container}>
        <Head>
          <title>{person.name} - Register Forum</title>
        </Head>
        <h1 className={styles.name}>{person.name}</h1>
        <h2 className={styles.position}>{person.position || "Contributing Writer"}</h2>
        <div className={styles.articles}>
          {personArticles.map((article) => (
            <LeftImageSmallCard key={article.slug}
              title={article.title}
              cover={article.cover}
              slug={article.slug}
              caption={article.caption}
              author={article.author}
              date={article.date}
              views={article.views}
              body={article.body}
            />
          ))}
        </div>
      </main>
    </>
  );
}
