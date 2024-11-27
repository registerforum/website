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
  
    const rows = response.data.values || [];
  
    return rows.map((row) => ({
      title: row[0] || null,
      author: row[1] || null,
      date: row[2] || null,
      slug: row[4] || null,
      // cover: row[12] ? row[12].replace("https://drive.google.com/file/d/", "https://drive.usercontent.google.com/download?id=").slice(0, -18).concat("&export=view&authuser=0") || null : null,
      cover: row[5] || null,
      // views: parseInt(row[8]) || null,
      // trending: row[9] === "TRUE",
      type: row[10] || null,
      body: row[11] || null,
      caption: row[13] || null,
    }));
  }