import { google } from "googleapis";
import styles from "@/styles/Article.module.css";

export const revalidate = 3600;

export const dynamicParams = true;

async function fetchSections() {
  const sheetId = process.env.SHEET_ID;
  const keys = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

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
    range: `Sections!A2:N`,
  });

  const rows = response.data.values || [];

  return rows.map((row) => ({
    name: row[0] || null,
    editors: row[1].split(", ") || null,  
    type: row[2] || null,
    parent: row[3] || null,
    slug: row[4] || null,
  }));
}

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
