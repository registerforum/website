import styles from "@/styles/Section.module.css";
import fetchSections from "@/utils/sections";
import fetchArticles from "@/utils/articles";
import { ListCard } from "@/components/cards";
import { PaginatedArticles } from "@/components/paginated-articles";

export const revalidate = 360;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const sections = await fetchSections();
    return sections.map((section) => ({
      slug: section.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for sections:', error);
    return [];
  }
}

export async function generateMetadata({ params: paramsPromise }) {
  try {
    const sections = await fetchSections();
    const params = await paramsPromise;
    const slug = params.slug;
    
    const section = sections.find((a) => a.slug === slug);
    
    return {
      title: section ? section.name : `Section ${slug}` + " | Register Forum",
    };
  } catch (error) {
    console.error('Error generating metadata for section:', error);
    return {
      title: "Section | Register Forum",
    };
  }
}

export default async function Page({ params: paramsPromise }) {
  try {
    const params = await paramsPromise;
    console.log(`Loading section page for slug: ${params.slug}`);
    
    const [sections, articles] = await Promise.all([
      fetchSections(),
      fetchArticles()
    ]);
    
    console.log(`Fetched ${sections.length} sections and ${articles.length} articles`);
    
    const section = sections.find((a) => a.slug === params.slug);
    
    if (!section) {
      console.error(`Section not found for slug: ${params.slug}`);
      console.log('Available sections:', sections.map(s => s.slug));
      return (
        <main className={styles.container}>
          <div className={styles.smalltop}>
            <h1 className={styles.title}>Section Not Found</h1>
          </div>
          <p>The section "{params.slug}" could not be found.</p>
        </main>
      );
    }
    
    console.log(`Found section:`, section);
    
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

      console.log(`Sub-sections for ${section.slug}:`, subSections);

      sectionArticles = articles
        .filter((a) => subSections.includes(a.type))
        .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
    }
    
    console.log(`Found ${sectionArticles.length} articles for section ${section.slug}`);

    return (
      <main className={styles.container}>
        {section.editors && section.editors.length > 0 ? (
          <div className={styles.largetop}>
            <h1 className={styles.title}>{section.name || 'Untitled Section'}</h1>
            <div className={styles.editors}>
              {section.editors.map((editor, index) => (
                <div key={index}>
                  {editor.name} &apos;{editor.yog ? editor.yog.slice(-2) : '??'}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.smalltop}>
            <h1 className={styles.title}>{section.name || 'Untitled Section'}</h1>
          </div>
        )}
        <div className={styles.articles}>
          <PaginatedArticles 
            articles={sectionArticles}
            itemsPerPage={18}
          />
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error in section page:', error);
    return (
      <main className={styles.container}>
        <div className={styles.smalltop}>
          <h1 className={styles.title}>Error Loading Section</h1>
        </div>
        <p>There was an error loading this section. Please try again later.</p>
      </main>
    );
  }
}
