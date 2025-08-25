import styles from "@/styles/Section.module.css";
import fetchSections from "@/utils/sections";
import fetchArticles from "@/utils/articles";
import { ListCard } from "@/components/cards";
import { MasonryLayout } from "@/components/masonry";

export const revalidate = 360;
export const dynamicParams = true;

export async function generateStaticParams() {
  const sections = await fetchSections();
  return sections.map((section) => ({
    slug: section.slug,
  }));
}

export async function generateMetadata({ params: paramsPromise }) {
  const sections = await fetchSections();
  const params = await paramsPromise;
  const slug = params.slug;

  return {
    title: sections.find((a) => a.slug === slug).name,
  };
}

export default async function Page({ params: paramsPromise }) {
  const params = await paramsPromise;
  const sections = await fetchSections();
  const section = sections.find((a) => a.slug === params.slug);
  const articles = await fetchArticles();
  console.log(section);
  var sectionArticles = [];
  if (section.type === "child") {
    sectionArticles = articles
      .filter((a) => a.type === section.slug)
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  } else {
    var subSections = sections
      .filter((a) => a.parent === section.slug)
      .map((a) => a.slug);
    subSections.push(section.slug);

    console.log(subSections);

    sectionArticles = articles
      .filter((a) => subSections.includes(a.type))
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  }

  return (
    <main className={styles.container}>
      {section.editors ? (
        <div className={styles.largetop}>
          <h1 className={styles.title}>{section.name}</h1>
          <div className={styles.editors}>
            {section.editors.map((a, index) => (
              <div key={index}>
                {a.name} &apos;{a.yog.slice(-2)}
              </div>
            ))}
          </div>
        </div>
      ) : ( <div className={styles.smalltop}><h1 className={styles.title}>{section.name}</h1></div> ) }
      <div className={styles.articles}>
        <MasonryLayout columns={3} gap="1rem">
          {sectionArticles
            .filter((article) => article.visibility)
            .map((item, index) => (
              <ListCard
                key={index}
                title={item.title}
                authors={item.authors}
                date={item.date}
                slug={item.slug}
                cover={item.cover}
                views={item.views}
                body={item.body}
                trending={item.trending}
                type={item.type}
              />
            ))}
        </MasonryLayout>
      </div>
    </main>
  );
}
