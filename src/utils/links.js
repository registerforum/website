import { google } from "googleapis";

const sheetId = process.env.SHEET_ID;
const keys = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

export default async function fetchLinks() {
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
        range: `Sections!A2:E22`, // Adjust range as needed
    });

    const rows = response.data.values || [];

    const formattedData = [];

    for (let i = 0; i < rows.length; i++) {
        if (rows[i][2] === "parent") {
            formattedData.push({
                Parent: {
                    name: rows[i][0],
                    editors: rows[i][1].split(", "),
                    type: rows[i][2],
                    parent: null,
                    slug: rows[i][4]
                },
                Children: []
            });
        }

        if (rows[i][2] === "child" || rows[i][2] === "sub") {
            formattedData.find((parent) => parent.Parent.slug === rows[i][3])?.Children.push({
                name: rows[i][0],
                editors: rows[i][1].split(", "),
                type: rows[i][2],
                parent: rows[i][3],
                slug: rows[i][4]
            });
        }
    }

    console.log("Fetched spreadsheet data.");

    return formattedData;
}