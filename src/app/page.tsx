import styles from "@/styles/Home.module.css";
import { LeftImageSmallCard, TopImageSmallCard } from "@/components/cards";
import { google } from "googleapis";
import { Article } from "@/types";

const sheetId = process.env.SHEET_ID!;
const keys = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!);

async function fetchSpreadsheetData(): Promise<Article[]> {
  try {
    const auth = await google.auth.getClient({
      projectId: keys.project_id,
      credentials: {
        type: "service_account",
        private_key: keys.private_key,
        client_email: keys.client_email,
        client_id: keys.client_id,
        token_url: keys.token_uri,
        universe_domain: "googleapis.com",
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `Articles!A2:M21`, // Adjust range as needed
    });

    const rows = response.data.values || [];

    const formattedData: Article[] = rows.map((row) => ({
      title: row[0] || null,
      author: row[1] || null,
      date: row[2] || null,
      slug: row[4] || null,
      // cover: row[12] ? row[12].replace("https://drive.google.com/file/d/", "https://drive.usercontent.google.com/download?id=").slice(0, -18).concat("&export=view&authuser=0") || null : null,
      cover: row[5] || null,
      views: parseInt(row[8]) || null,
      trending: row[9] === "TRUE",
      type: row[10] || null,
      body: row[11] || null,
    }));

    console.log("Fetched spreadsheet data.");

    return formattedData;
  } catch (error) {
    console.error("Error fetching spreadsheet data:", error);
    return [];
  }
}

export const revalidate = 3600; // 1 hour in seconds

export default async function Home() {
  const data = await fetchSpreadsheetData();

  const featuredOpinionArticles = data
    .filter((article) => article.trending && article.type === "Opinion" && article.date) // Filter featured with valid dates
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()); // Sort by date descending

  const featuredNewsArticles = data
    .filter((article) => article.trending && article.type === "Metro" && article.date) // Filter featured with valid dates
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()); // Sort by date descending

  const featuredSportsArticles = data
    .filter((article) => article.trending && article.type === "Sports" && article.date) // Filter featured with valid dates
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()); // Sort by date descending

  const featuredAeArticles = data
    .filter((article) => article.trending && article.type === "AE" && article.date) // Filter featured with valid dates
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()); // Sort by date descending

  const featuredFcArticles = data
    .filter((article) => article.trending && article.type === "F+C" && article.date) // Filter featured with valid dates
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()); // Sort by date descending

  const featuredHumorArticles = data
    .filter((article) => article.trending && article.type === "Humor" && article.date) // Filter featured with valid dates
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()); // Sort by date descending

  return (
    <main className={styles.page}>
      <div className={styles.headline}>
      </div>
      <div className={styles.body}>
        <div className={styles.leftcol}>
          <div className={styles.news}>

            <div className={styles.featured}>
              {featuredNewsArticles.slice(0, 2).map((item, index) => (
                <TopImageSmallCard
                  key={item.slug || item.title || ""}
                  title={item.title || ""}
                  img={item.cover || ""}
                  author={item.author || ""}
                  body={item.body || ""}
                  slug={item.slug || ""}
                  id={index}
                />
              ))}
            </div>
            {featuredNewsArticles.slice(2, 7).map((item, index) => (
              <LeftImageSmallCard
                key={item.slug || item.title || ""}
                title={item.title || ""}
                img={item.cover || ""}
                author={item.author || ""}
                body={item.body || ""}
                slug={item.slug || ""}
                id={index}
              />
            ))}
          </div>
          <div className={styles.sports}>
            {featuredSportsArticles.slice(0, 2).map((item, index) => (
              <TopImageSmallCard
                key={item.slug || item.title || ""}
                title={item.title || ""}
                img={item.cover || ""}
                author={item.author || ""}
                body={item.body || ""}
                slug={item.slug || ""}
                id={index}
              />
            ))}
          </div>
          <div className={styles.ae}>
            {featuredAeArticles.slice(0, 2).map((item, index) => (
              <TopImageSmallCard
                key={item.slug || item.title || ""}
                title={item.title || ""}
                img={item.cover || ""}
                author={item.author || ""}
                body={item.body || ""}
                slug={item.slug || ""}
                id={index}
              />
            ))}
          </div>
          <div className={styles.fc}>
            {featuredFcArticles.slice(0, 2).map((item, index) => (
              <TopImageSmallCard
                key={item.slug || item.title || ""}
                title={item.title || ""}
                img={item.cover || ""}
                author={item.author || ""}
                body={item.body || ""}
                slug={item.slug || ""}
                id={index}
              />
            ))}
          </div>
        </div>
        <div className={styles.rightcol}>
          <div className={styles.opinion}>
            {featuredOpinionArticles.slice(0, 3).map((item, index) => (
              <TopImageSmallCard
                key={item.slug || item.title || ""}
                title={item.title || ""}
                img={item.cover || ""}
                author={item.author || ""}
                body={item.body || ""}
                slug={item.slug || ""}
                id={index}
              />
            ))}
          </div>
          <div className={styles.humor}>
            {featuredHumorArticles.map((item, index) => (
              <TopImageSmallCard
                key={item.slug || item.title || ""}
                title={item.title || ""}
                img={item.cover || ""}
                author={item.author || ""}
                body={item.body || ""}
                slug={item.slug || ""}
                id={index}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
