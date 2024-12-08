import { google } from "googleapis";
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

async function saveImageToLocal(driveUrl) {
  const fileIdMatch = driveUrl.match(/\/d\/([^/]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    const imageUrl = `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();
    const filePath = path.join(__dirname, '..', 'public', 'images', `${fileIdMatch[1]}.jpg`);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, buffer);
    return `/images/${fileIdMatch[1]}.jpg`;
  }
  return driveUrl;
}

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
  
    const articles = [];
    for (const row of rows) {
      const slug = row[5];
      if (!slug) break;

      const authorNames = row[1] ? row[1].split(", ") : null;
      const authorTitles = row[2] ? row[2].split(", ") : null;

      const authors = authorNames ? authorNames.map((author) => {
        return {
          name: author,
          slug: author.toLowerCase().replace(/\s/g, "-"),
          position: authorTitles ? authorTitles[authorNames.indexOf(author)] : null,
        }
      }) : null;

      articles.push({
        title: row[0] || null,
        authors: authors || null,
        date: row[3] || null,
        slug: slug,
        cover: await saveImageToLocal(row[6]) || null,
        views: parseInt(row[9]) || null,
        trending: row[10] === "TRUE",
        type: row[11] || null,
        body: row[12] || null,
        photocredit: row[13] || null,
      });
    }
    return articles;
  }