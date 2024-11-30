import { google } from "googleapis";
import fetchArticles from "@/utils/articles";

export default async function fetchStaff() {
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
        range: `Writers!A2:C`, // Adjust the range as needed
    });

    const rows = response.data.values || [];

    const articles = await fetchArticles();

    var staff = rows.map((row) => ({
        name: row[0] || null,
        slug: row[0] ? row[0].toLowerCase().replace(/\s/g, "-") : null,
        position: row[2] || null,
        articles: articles.filter((a) => a.author === row[0]),
    }));

    for (const article of articles) {
        if (!staff.find((a) => a.name === article.author)) {
            staff.push({
                name: article.author,
                slug: article.author.toLowerCase().replace(/\s/g, "-"),
                position: 'Contributing Writer',
                articles: [article],
            });
        } else if (!staff.find((a) => a.name === article.author).articles.find((a) => a.slug === article.slug)) {
            staff.find((a) => a.name === article.author).articles.push(article);
        }
    }

    for (const person of staff) {
        if (!person.position) {
            person.position = 'Contributing Writer';
        }
    }
    
    return staff;
}