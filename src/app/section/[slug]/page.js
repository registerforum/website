import { google } from "googleapis";

// Next.js will revalidate the cache at most once every 60 seconds
export const revalidate = 60;

// Allow dynamic parameters for server-side rendering on unknown paths
export const dynamicParams = true;

// Fetch articles from Google Sheets
async function fetchArticles() {
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
    range: `Articles!A2:L`, // Adjust the range as needed
  });

  const rows = response.data.values || [];

  return rows.map((row) => ({
    slug: row[4] || "", // Assuming the slug is in column E
    title: row[0] || "", // Assuming the title is in column A
    body: row[11] || "", // Assuming the body content is in column L
  }));
}

// Generate static params for all articles
export async function generateStaticParams() {
  const articles = await fetchArticles();

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// Render the article page
export default async function Page({ params: paramsPromise }) {
  const params = await paramsPromise;
  const articles = await fetchArticles();
  const article = articles.find((a) => a.slug === params.slug);

  return (
    <main>
      <h1>{article.title}</h1>
      <article>{article.body}</article>
    </main>
  );
}
