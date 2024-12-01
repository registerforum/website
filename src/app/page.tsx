import styles from "@/styles/Home.module.css";
import { LeftImageSmallCard, TopImageSmallCard } from "@/components/cards";
import fetchArticles from "@/utils/articles";
import { unstable_cache } from "next/cache";

export const revalidate = 3600; // 1 hour in seconds

export default async function Home() {
  const data = await unstable_cache(async () => {return await fetchArticles()}, [], {
    revalidate: 3600
  })();

  const featuredOpinionArticles = data
    .filter((article) => article.trending && article.type === "opinion" && article.date) // Filter featured with valid dates
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()); // Sort by date descending

  const featuredNewsArticles = data
    .filter((article) => article.trending && article.type === "metro" && article.date) // Filter featured with valid dates
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()); // Sort by date descending

  const featuredSportsArticles = data
    .filter((article) => article.trending && article.type === "sports" && article.date) // Filter featured with valid dates
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()); // Sort by date descending

  const featuredAeArticles = data
    .filter((article) => article.trending && article.type === "ae" && article.date) // Filter featured with valid dates
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()); // Sort by date descending

  const featuredFcArticles = data
    .filter((article) => article.trending && article.type === "fc" && article.date) // Filter featured with valid dates
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()); // Sort by date descending

  const featuredHumorArticles = data
    .filter((article) => article.trending && article.type === "humor" && article.date) // Filter featured with valid dates
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()); // Sort by date descending

  return (
    <main className={styles.page}>
      <div className={styles.body}>
        <div className={styles.leftcol}>
          <div className={styles.news}>

            <div className={styles.featured}>
              {featuredNewsArticles.slice(0, 2).map((item, index) => (
                <TopImageSmallCard
                  key={index}
                  title={item.title || ""}
                  cover={item.cover || ""}
                  authors={item.authors || ""}
                  body={item.body || ""}
                  slug={item.slug || ""}
                  date={item.date || ""}
                  trending={item.trending || false}
                  type={item.type || ""}
                  views={item.views || 0}
                />
              ))}
            </div>
            {featuredNewsArticles.slice(2, 7).map((item, index) => (
              <LeftImageSmallCard
                key={index}
                title={item.title || ""}
                cover={item.cover || ""}
                authors={item.authors || ""}
                body={item.body || ""}
                slug={item.slug || ""}
                date={item.date || ""}
                trending={item.trending || false}
                type={item.type || ""}
                views={item.views || 0}
              />
            ))}
          </div>
          <div className={styles.sports}>
            {featuredSportsArticles.slice(0, 2).map((item, index) => (
              <TopImageSmallCard
                key={index}
                title={item.title || ""}
                cover={item.cover || ""}
                authors={item.authors || ""}
                body={item.body || ""}
                slug={item.slug || ""}
                date={item.date || ""}
                trending={item.trending || false}
                type={item.type || ""}
                views={item.views || 0}
              />
            ))}
          </div>
          <div className={styles.ae}>
            {featuredAeArticles.slice(0, 2).map((item, index) => (
              <TopImageSmallCard
                key={index}
                title={item.title || ""}
                cover={item.cover || ""}
                authors={item.authors || ""}
                body={item.body || ""}
                slug={item.slug || ""}
                date={item.date || ""}
                trending={item.trending || false}
                type={item.type || ""}
                views={item.views || 0}
              />
            ))}
          </div>
          <div className={styles.fc}>
            {featuredFcArticles.slice(0, 2).map((item, index) => (
              <TopImageSmallCard
                key={index}
                title={item.title || ""}
                cover={item.cover || ""}
                authors={item.authors || ""}
                body={item.body || ""}
                slug={item.slug || ""}
                date={item.date || ""}
                trending={item.trending || false}
                type={item.type || ""}
                views={item.views || 0}
              />
            ))}
          </div>
        </div>
        <div className={styles.rightcol}>
          <div className={styles.opinion}>
            {featuredOpinionArticles.slice(0, 3).map((item, index) => (
              <TopImageSmallCard
                key={index}
                title={item.title || ""}
                cover={item.cover || ""}
                authors={item.authors || ""}
                body={item.body || ""}
                slug={item.slug || ""}
                date={item.date || ""}
                trending={item.trending || false}
                type={item.type || ""}
                views={item.views || 0}
              />
            ))}
          </div>
          <div className={styles.humor}>
            {featuredHumorArticles.map((item, index) => (
              <TopImageSmallCard
                key={index}
                title={item.title || ""}
                cover={item.cover || ""}
                authors={item.authors || ""}
                body={item.body || ""}
                slug={item.slug || ""}
                date={item.date || ""}
                trending={item.trending || false}
                type={item.type || ""}
                views={item.views || 0}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
