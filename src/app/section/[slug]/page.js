import styles from "@/styles/Section.module.css";
import fetchSections from "@/utils/sections";
import fetchArticles from "@/utils/articles";
import { LeftImageSmallCard } from "@/components/cards";
import { unstable_cache } from "next/cache";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const sections = await unstable_cache(async () => {return await fetchSections()}, [], {
    revalidate: 3600
  })();

  return sections.map((section) => ({
    slug: section.slug,
  }));
}

export default async function Page({ params: paramsPromise }) {
  const params = await paramsPromise;
  const sections = await unstable_cache(async () => {return await fetchSections()}, [], {
    revalidate: 3600
  })();
  const section = sections.find((a) => a.slug === params.slug);
  const articles = await unstable_cache(async () => {return await fetchArticles()}, [], {
    revalidate: 3600
  })();
  const sectionArticles = articles.filter((a) => a.type === section.slug);

  console.log(sectionArticles);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>{section.name}</h1>
      <div className={styles.articles}>
        {
          sectionArticles.map((item, index) => (
            <LeftImageSmallCard
              key={index}
              title={item.title}
              author={item.author}
              date={item.date}
              slug={item.slug}
              cover={item.cover}
              views={item.views}
              body={item.body}
              trending={item.trending}
              type={item.type}
            />
          ))
        }
      </div>
    </main>
  );
}
