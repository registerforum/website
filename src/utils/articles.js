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
  
    return rows.map((row) => ({
      title: row[0] || null,
      author: {
        name: row[1] || null,
        slug: row[1] ? row[1].toLowerCase().replace(/\s/g, "-") : null,
        position: staffRows.find((a) => a[0] === row[1]) ? staffRows.find((a) => a[0] === row[1])[2] : "Contributing Writer",
      },
      date: row[2] || null,
      slug: row[4] || null,
      // cover: row[12] ? row[12].replace("https://drive.google.com/file/d/", "https://drive.usercontent.google.com/download?id=").slice(0, -18).concat("&export=view&authuser=0") || null : null,
      cover: row[5] || null,
      views: parseInt(row[8]) || null,
      trending: row[9] === "TRUE",
      type: row[10] || null,
      body: row[11] || null,
    }));
  }