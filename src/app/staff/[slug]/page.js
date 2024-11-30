import styles from "@/styles/Staff.module.css";
import fetchStaff from "@/utils/staff";
import { LeftImageSmallCard } from "@/components/cards";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const staff = await fetchStaff();

  return staff.map((person) => ({
    slug: person.slug,
  }));
}

export default async function Page({ params: paramsPromise }) {
  const params = await paramsPromise;
  const staff = await fetchStaff();
  const person = staff.find((a) => a.slug === params.slug);

  return (
    <div className={styles.container}>
      <h1 className={styles.name}>{person.name}</h1>
      <h2 className={styles.position}>{person.position}</h2>
      <div className={styles.articles}>
        {person.articles.map((article) => (
          <LeftImageSmallCard key={article.slug} 
            title={article.title}
            cover={article.cover}
            slug={article.slug}
            caption={article.caption}
            // author={article.author}
            date={article.date}
            views={article.views}
            body={article.body}
          />
        ))}
      </div>
    </div>
  );
}
