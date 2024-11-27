import { google } from "googleapis";

export default async function fetchSections() {
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

    const sections = [];

    for (const row of rows) {
        if (row[2] === "parent" || row[2] === "child") {
            sections.push({
                name: row[0] || null,
                editors: row[1] ? row[1].split(", ") : null,
                type: row[2] || null,
                parent: row[3] || null,
                slug: row[4] || null,
                children: [],
            });
        } else {
            const parent = sections.find((a) => a.slug === row[3]);
            if (parent) {
                parent.children.push({
                    name: row[0] || null,
                    editors: row[1] ? row[1].split(", ") : null,
                    type: row[2] || null,
                    parent: row[3] || null,
                    slug: row[4] || null,
                });
            }
        }
    }

    return sections;
}