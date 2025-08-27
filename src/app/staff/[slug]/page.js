import styles from "@/styles/Staff.module.css";
// import fetchStaff from "@/utils/staff";
import { PaginatedArticles } from "@/components/paginated-articles";
import fetchArticles from "@/utils/articles";
import { notFound } from "next/navigation";

export const revalidate = 360;
export const dynamicParams = true;

export async function generateStaticParams() {
  const articles = await fetchArticles();

  var staff = [];

  for (const article of articles) {
    if (article.authors && Array.isArray(article.authors)) {
      for (const author of article.authors) {
        if (author && author.name && !staff.find((a) => a.name === author.name)) {
          staff.push({
            name: author.name,
            slug: author.slug || author.name
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, ""),
            position: "Contributing Writer",
            articles: [article],
          });
        } else if (author && author.name && !staff.find((a) => a.name === author.name)?.articles?.find((a) => a.slug === article.slug)) {
          const existingStaff = staff.find((a) => a.name === author.name);
          if (existingStaff) {
            existingStaff.articles.push(article);
          }
        }
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

  const article = articles.find((a) => 
    a.authors && Array.isArray(a.authors) && 
    a.authors.some((author) => author && author.slug === params.slug)
  );
  
  if (!article) {
    return {
      title: "Staff Member",
    };
  }

  const person = article.authors.find((author) => author && author.slug === params.slug);

  return {
    title: person?.name || "Staff Member",
  };
}

export default async function Page({ params: paramsPromise }) {
  const params = await paramsPromise;
  const articles = await fetchArticles();
  
  const article = articles.find((a) => 
    a.authors && Array.isArray(a.authors) && 
    a.authors.some((author) => author && author.slug === params.slug)
  );
  
  if (!article) {
    notFound();
  }

  const person = article.authors.find((author) => author && author.slug === params.slug);
  
  if (!person) {
    notFound();
  }

  let personArticles = [];

  for (const article of articles) {
    if (article.authors && Array.isArray(article.authors) && 
        article.authors.some((author) => author && author.slug === params.slug)) {
      personArticles.push(article);
    }
  }

  // Sort articles by date: latest to earliest
  personArticles = personArticles
    .filter(article => article.visibility)
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

  return (
      <main className={styles.container}>
        <h1 className={styles.name}>{person.name}</h1>
        <h2 className={styles.position}>{person.position?.trim() || "Contributing Writer"}</h2>
        <div className={styles.articles}>
          <PaginatedArticles 
            articles={personArticles}
            itemsPerPage={18}
          />
        </div>
      </main>
  );
}
