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
      range: `Articles!A2:L21`, // Adjust range as needed
    });

    const rows = response.data.values || [];

    const formattedData: Article[] = rows.map((row) => ({
      title: row[0] || null,
      author: row[1] || null,
      date: row[2] || null,
      slug: row[4] || null,
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

  return (
    <main className={styles.page}>
      <div className={styles.body}>
        <div className={styles.news}>
          News
            {data.slice(0, 10).map((item, index) => (
              <LeftImageSmallCard
                key={item.slug || item.title || ""}
                title={item.title || ""}
                img={item.cover || ""}
                author={item.author || ""}
                body={item.body || ""}
                id={index}
              />
            ))}
        </div>
        <div className={styles.opinion}>Opinion
        {data.slice(0, 10).map((item, index) => (
              <TopImageSmallCard
                key={item.slug || item.title || ""}
                title={item.title || ""}
                img={item.cover || ""}
                author={item.author || ""}
                body={item.body || ""}
                id={index}
              />
            ))}
        </div>
        <div className={styles.sports}>Sports</div>
        <div className={styles.ae}>A+E</div>
        <div className={styles.humor}>Humor</div>
        <div className={styles.fc}>F+C</div>
      </div>
    </main>
  );
}
