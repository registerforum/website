import styles from "@/styles/Staff.module.css";
// import fetchStaff from "@/utils/staff";
import { ListCard } from "@/components/cards";
import fetchArticles from "@/utils/articles";

export const revalidate = 360;
export const dynamicParams = true;

export async function generateStaticParams() {
  const articles = await fetchArticles();

  var staff = [];

  for (const article of articles) {
    for (const author of article.authors) {
      if (!staff.find((a) => a.name === author.name)) {
        staff.push({
          name: author.name || null,
          slug: author.name
            ?.toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, ""),
          position: "Contributing Writer",
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

export async function generateMetadata({ params: paramsPromise }) {
  const articles = await fetchArticles();

  const params = await paramsPromise;

  const person = articles.find((a) => a.authors.some((author) => author.slug === params.slug)).authors.find((author) => author.slug === params.slug);

  return {
    title: person.name,
  }
}

export default async function Page({ params: paramsPromise }) {
  const params = await paramsPromise;
  const articles = await fetchArticles();
  const person = articles.find((a) => a.authors.some((author) => author.slug === params.slug)).authors.find((author) => author.slug === params.slug);
  let personArticles = [];

  for (const article of articles) {
    if (article.authors.some((author) => author.slug === params.slug)) {
      personArticles.push(article);
    }
  }

  return (
      <main className={styles.container}>
        <h1 className={styles.name}>{person.name}</h1>
        <h2 className={styles.position}>{person.position?.trim() || "Contributing Writer"}</h2>
        <div className={styles.articles}>
          {personArticles.filter(article => article.visibility).map((article) => (
            <ListCard key={article.slug}
              title={article.title}
              cover={article.cover}
              slug={article.slug}
              caption={article.caption}
              authors={article.authors}
              date={article.date}
              views={article.views}
              body={article.body}
            />
          ))}
        </div>
      </main>
  );
}
