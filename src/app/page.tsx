import styles from "@/styles/Home.module.css";
import { LeftImageSmallCard, TopImageSmallCard } from "@/components/cards";
import { google } from "googleapis";
import fetchLinks from "@/utils/links";

export const metadata = {
  title: "Home | Register Forum",
};

fetchLinks();

export default async function Home() {
  const sheetId = process.env.SHEET_ID;
  const keys = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || "");

  const auth = await google.auth.getClient({
    projectId: keys.project_id,
    credentials: {
      type: "service_account",
      private_key: keys.private_key,
      client_email: keys.client_email,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `Articles!A2:N`, // Adjust the range as needed
  });

  console.log("Fetched articles from Google Sheets");

  const rows = response.data.values || [];
  const articles = [];

  for (const row of rows) {
    if (!row[0] || !row[5]) continue; // Skip rows with missing essential data

    const authorNames = row[1]?.split(", ") || [];
    const authorTitles = row[2]?.split(", ") || [];

    const authors = authorNames.map((author: string, index: number) => ({
      name: author,
      slug: author.toLowerCase().replace(/\s+/g, "-"),
      position: authorTitles[index] || null,
    }));

    articles.push({
      title: row[0] || null,
      authors: authors.length ? authors : null,
      date: row[3] || null,
      slug: row[5],
      cover: row[6] || null,
      visibility: row[9]?.toUpperCase() === "TRUE",
      views: parseInt(row[9]) || 0,
      trending: row[10]?.toUpperCase() === "TRUE",
      type: row[11] || null,
      body: row[12] || null,
      photocredit: row[13] || null,
    });
  }

  const data = articles.filter((article) => article.visibility); // Filter out non-visible articles

  const featuredOpinionArticles = data
    .filter(
      (article) =>
        article.trending && article.type === "opinion" && article.date,
    ) // Filter featured with valid dates
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()); // Sort by date descending

  const featuredNewsArticles = data
    .filter(
      (article) =>
        article.trending &&
        (article.type === "metro" ||
          article.type === "nation" ||
          article.type === "as" ||
          article.type === "news") &&
        article.date,
    ) // Filter featured with valid dates
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()); // Sort by date descending

  const featuredSportsArticles = data
    .filter(
      (article) =>
        article.trending && article.type === "sports" && article.date,
    ) // Filter featured with valid dates
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()); // Sort by date descending

  const featuredAeArticles = data
    .filter(
      (article) => article.trending && article.type === "ae" && article.date,
    ) // Filter featured with valid dates
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()); // Sort by date descending

  const featuredFcArticles = data
    .filter(
      (article) => article.trending && article.type === "fc" && article.date,
    ) // Filter featured with valid dates
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()); // Sort by date descending

  const featuredHumorArticles = data
    .filter(
      (article) => article.trending && article.type === "humor" && article.date,
    ) // Filter featured with valid dates
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()); // Sort by date descending

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
