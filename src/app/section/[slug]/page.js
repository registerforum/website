import styles from "@/styles/Section.module.css";
import fetchSections from "@/utils/sections";
import fetchArticles from "@/utils/articles";
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
          <p>The section &quot;{params.slug}&quot; could not be found.</p>
        </main>
      );
    }
    
    console.log(`Found section:`, section);
    
    // Debug: Log all unique article types to understand the data structure
    const uniqueArticleTypes = [...new Set(articles.map(a => a.type))].sort();
    console.log(`All unique article types in database:`, uniqueArticleTypes);
    
    var sectionArticles = [];
    if (section.type === "child") {
      console.log(`Processing child section: ${section.slug}`);
      
      // Log articles that match this section type before filtering
      const matchingArticles = articles.filter((a) => a.type === section.slug);
      console.log(`Articles with type "${section.slug}":`, matchingArticles.length);
      console.log(`Breakdown: visible=${matchingArticles.filter(a => a.visibility).length}, trending=${matchingArticles.filter(a => a.trending).length}`);
      
      // Log first few matching articles for debugging
      if (matchingArticles.length > 0) {
        console.log(`Sample matching articles:`, matchingArticles.slice(0, 3).map(a => ({
          slug: a.slug,
          title: a.title,
          type: a.type,
          visibility: a.visibility,
          trending: a.trending,
          date: a.date
        })));
      }
      
      sectionArticles = matchingArticles
        .filter(a => a.visibility) // Only show visible articles
        .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
    } else {
      console.log(`Processing parent section: ${section.slug}`);
      
      var subSections = sections
        .filter((a) => a.parent === section.slug)
        .map((a) => a.slug);
      subSections.push(section.slug);

      console.log(`Sub-sections for ${section.slug}:`, subSections);
      
      // Debug: Show how many articles match each subsection
      subSections.forEach(subSlug => {
        const allMatching = articles.filter(a => a.type === subSlug);
        const visibleMatching = allMatching.filter(a => a.visibility);
        const trendingMatching = allMatching.filter(a => a.trending);
        console.log(`Articles with type "${subSlug}": ${allMatching.length} total, ${visibleMatching.length} visible, ${trendingMatching.length} trending`);
      });

      const allMatchingArticles = articles.filter((a) => subSections.includes(a.type));
      console.log(`Total articles matching sub-sections: ${allMatchingArticles.length}`);
      console.log(`Articles by visibility: visible=${allMatchingArticles.filter(a => a.visibility).length}, not visible=${allMatchingArticles.filter(a => !a.visibility).length}`);
      console.log(`Articles by trending: trending=${allMatchingArticles.filter(a => a.trending).length}, not trending=${allMatchingArticles.filter(a => !a.trending).length}`);

      sectionArticles = allMatchingArticles
        .filter(a => a.visibility) // Only show visible articles
        .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
    }
    
    console.log(`Final filtered articles for section ${section.slug}: ${sectionArticles.length}`);
    console.log(`First few articles:`, sectionArticles.slice(0, 5).map(a => ({
      slug: a.slug,
      title: a.title,
      type: a.type,
      visibility: a.visibility,
      trending: a.trending
    })));

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
