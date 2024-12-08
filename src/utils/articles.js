import { google } from "googleapis";
import { unstable_cache } from "next/cache";

const fetchArticles = unstable_cache(async () => {
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
    range: `Articles!A2:N`, // Adjust the range as needed
  });

  console.log("Fetched articles from Google Sheets");

  const rows = response.data.values || [];
  const articles = [];

  for (const row of rows) {
    if (!row[0] || !row[5]) continue; // Skip rows with missing essential data

    const authorNames = row[1]?.split(", ") || [];
    const authorTitles = row[2]?.split(", ") || [];

    const authors = authorNames.map((author, index) => ({
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

  return articles;
}, { tags: ["articles"], revalidate: 30 }); // Revalidate every 5 minutes

export default fetchArticles;
