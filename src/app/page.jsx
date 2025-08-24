import styles from "@/styles/Home.module.css";
import { LeftImageSmallCard, TopImageSmallCard } from "@/components/cards";
import fetchLinks from "@/utils/links";
import fetchArticles from "@/utils/articles";


export const metadata = {
  title: "Home | Register Forum",
};

fetchLinks();

export default async function Home() {
  const data = await fetchArticles();


  const featuredOpinionArticles = data
    .filter(
      (article) =>
        article.trending && article.type === "opinion" && article.date,
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const featuredNewsArticles = data
    .filter(
      (article) =>
        article.trending &&
        (article.type === "metro" ||
          article.type === "nation" ||
          article.type === "as" ||
          article.type === "news") &&
        article.date,
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const featuredSportsArticles = data
    .filter(
      (article) =>
        article.trending && article.type === "sports" && article.date,
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const featuredAeArticles = data
    .filter(
      (article) => article.trending && article.type === "ae" && article.date,
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const featuredFcArticles = data
    .filter(
      (article) => article.trending && article.type === "fc" && article.date,
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const featuredHumorArticles = data
    .filter(
      (article) => article.trending && article.type === "humor" && article.date,
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className={styles.page}>
      <div className={styles.body}>
        <div className={styles.leftcol}>
          <div className={styles.news}>
            <p className={styles.sectiontag}>News</p>
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
            <p className={styles.sectiontag}>Sports</p>
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
            <p className={styles.sectiontag}>A&E</p>
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
            <p className={styles.sectiontag}>F&C</p>
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
            <p className={styles.sectiontag}>Opinion</p>
            {featuredOpinionArticles.slice(0, 4).map((item, index) => (
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
            <p className={styles.sectiontag}>Humor</p>
            {featuredHumorArticles.slice(0, 2).map((item, index) => (
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
