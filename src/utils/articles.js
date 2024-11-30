import { google } from "googleapis";

export default async function fetchArticles() {
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

    const staffResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `Writers!A2:C`, // Adjust the range as needed
    });
  
    const rows = response.data.values || [];
    const staffRows = staffResponse.data.values || [];
  
    const articles = [];
    for (const row of rows) {
      const slug = row[4];
      if (!slug) break;

      const authorNames = row[1] ? row[1].split(", ") : null;

      const authors = authorNames ? authorNames.map((author) => {
        return {
          name: author,
          slug: author.toLowerCase().replace(/\s/g, "-"),
          position: staffRows.find((a) => a[0] === author) ? staffRows.find((a) => a[0] === author)[2] : "Contributing Writer",
        }
      }) : null;

      articles.push({
        title: row[0] || null,
        authors: authors || null,
        date: row[2] || null,
        slug: slug,
        cover: row[5] || null,
        views: parseInt(row[8]) || null,
        trending: row[9] === "TRUE",
        type: row[10] || null,
        body: row[11] || null,
      });
    }
    return articles;
  }