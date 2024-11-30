import styles from "@/styles/Article.module.css";
import fetchArticles from "@/utils/articles";
import fetchStaff from "@/utils/staff";
import { unstable_cache } from "next/cache";

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
  const [articles, staff] = await Promise.all([
    unstable_cache(async () => { return await fetchArticles() }, [], { revalidate: 3600 })(),
    unstable_cache(async () => { return await fetchStaff() }, [], { revalidate: 3600 })()
  ]);
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) {
    return <div>Article not found</div>;
  }
  var author = {};
  if (staff.find((a) => a.name === article.author)) {
    author = staff.find((a) => a.name === article.author);
  } else {
    author = {
      name: article.author,
      slug: article.author.toLowerCase().replace(/\s/g, "-"),
      position: 'Contributing Writer'
    }
  }
  const pars = article.body?.split("\n");

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>{article.title}</h1>
      <div className={styles.cover}>
        <img className={styles.image} src={article.cover} alt={article.title} />
        <p className={styles.caption}>{article.caption}</p>
      </div>
      <div className={styles.author}>
        <a href={`/staff/${author.slug}`} className={styles.name}>{author.name}</a>
        <p className={styles.position}>{author.position}</p>
      </div>
      <article className={styles.body}>
        {pars.map((par, index) => (
          <p key={index} className={styles.par}>{par}</p>
        ))}
      </article>
    </main>
  );
}
