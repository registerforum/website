import styles from "@/styles/Section.module.css";
import fetchSections from "@/utils/sections";
import fetchArticles from "@/utils/articles";
import { LeftImageSmallCard } from "@/components/cards";
import { unstable_cache } from "next/cache";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const sections = await unstable_cache(async () => { return await fetchSections() }, ["section"], {
    revalidate: 3600
  })();

  return sections.map((section) => ({
    slug: section.slug,
  }));
}

export async function generateMetadata({ params: paramsPromise }) {
  const sections = await unstable_cache(async () => { return await fetchSections() }, ["section"], {
    revalidate: 3600
  })();

  const params = await paramsPromise;
  const slug = params.slug;

  return {
    title: sections.find((a) => a.slug === slug).name,
  }
}

export default async function Page({ params: paramsPromise }) {
  const params = await paramsPromise;
  const sections = await unstable_cache(async () => { return await fetchSections() }, ["section", params.slug], {
    revalidate: 3600
  })();
  const section = sections.find((a) => a.slug === params.slug);
  const articles = await unstable_cache(async () => { return await fetchArticles() }, ["section", params.slug], {
    revalidate: 3600
  })();
  var sectionArticles = [];
  if (section.type === "child") {
    sectionArticles = articles.filter((a) => a.type === section.slug);
  } else {
    var subSections = sections.filter((a) => a.parent === section.slug).map((a) => a.slug);
    subSections.push(section.slug);

    console.log(subSections)

    sectionArticles = articles.filter((a) => subSections.includes(a.type));
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>{section.name}</h1>
      <div className={styles.articles}>
        {
          sectionArticles.filter(article => article.visibility).map((item, index) => (
            <LeftImageSmallCard
              key={index}
              title={item.title}
              author={item.authors}
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
