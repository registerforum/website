import styles from "@/styles/Article.module.css";
import fetchSections from "@/utils/sections";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const sections = await fetchSections();

  return sections.map((section) => ({
    slug: section.slug,
  }));
}

export default async function Page({ params: paramsPromise }) {
  const params = await paramsPromise;
  const sections = await fetchSections();
  const section = sections.find((a) => a.slug === params.slug);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>{section.name}</h1>

    </main>
  );
}
