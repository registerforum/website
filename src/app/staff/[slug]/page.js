import styles from "@/styles/Staff.module.css";
// import fetchStaff from "@/utils/staff";
import { LeftImageSmallCard } from "@/components/cards";
import { unstable_cache } from "next/cache";
import fetchArticles from "@/utils/articles";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const articles = await unstable_cache(async () => {return await fetchArticles()}, [], {
    revalidate: 3600
  })();

  var staff = [];

  for (const article of articles) {
    if (!staff.find((a) => a.name === article.author.name)) {
      staff.push({
        name: article.author.name || null,
        slug: article.author.name?.toLowerCase().replace(/\s/g, "-"),
        position: 'Contributing Writer',
        articles: [article],
      });
    } else if (!staff.find((a) => a.name === article.author.name).articles.find((a) => a.slug === article.slug)) {
      staff.find((a) => a.name === article.author.name).articles.push(article);
    }
  }

  return staff.map((person) => ({
    slug: person.slug,
  }));
}

export default async function Page({ params: paramsPromise }) {
  const params = await paramsPromise;
  const articles = await unstable_cache(async () => {return await fetchArticles()}, [params.slug], {
    revalidate: 3600
  })();
  const person = articles.find((a) => a.author.slug === params.slug).author;
  const personArticles = articles.filter((a) => a.author.slug === params.slug);

  return (
    <div className={styles.container}>
      <h1 className={styles.name}>{person.name}</h1>
      <h2 className={styles.position}>{person.position}</h2>
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
    </div>
  );
}
