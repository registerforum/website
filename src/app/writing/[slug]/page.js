import styles from "@/styles/Article.module.css";
import fetchArticles from "@/utils/articles"; 
import fetchStaff from "@/utils/staff";

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
  console.log(params);
  const articles = await fetchArticles();
  const staff = await fetchStaff();
  const article = articles.find((a) => a.slug === params.slug);
  const author = staff.find((a) => a.name === article.author);
  const pars = article.body?.split("\n");

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>{article.title}</h1>
      <div className={styles.cover}>
        <img className={styles.image} src={article.cover} alt={article.title} />
        <p className={styles.caption}>{article.caption}</p>
      </div>
      <a className={styles.author} href={`/staff/${article.author.toLowerCase().replace(/\s/g, "-")}`}>By&nbsp;{article.author},&nbsp;<div className={styles.position}>{author.position}</div></a>
      <article className={styles.body}>
        {pars.map((par, index) => (
          <p key={index} className={styles.par}>{par}</p>
        ))}
      </article>
    </main>
  );
}
