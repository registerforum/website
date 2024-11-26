import { google } from "googleapis";
import { Section } from "@/types";

// Next.js will revalidate the cache at most once every 60 seconds
export const revalidate = 60;

// Allow dynamic parameters for server-side rendering on unknown paths
export const dynamicParams = true;

const sheetId = process.env.SHEET_ID;
const keys = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!);

// Fetch articles from Google Sheets
async function fetchSections() {
  try {
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

    const formattedData: { Parent: Section, Children: Section[] }[] = [];

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
        formattedData.find((parent) => parent.Parent.name === rows[i][3])?.Children.push({
          name: rows[i][0],
          editors: rows[i][1].split(", "),
          type: rows[i][2],
          parent: rows[i][3],
          slug: rows[i][4]
        });
      }
    }

    console.log(formattedData);

    // console.log(formattedData[0].cover)

    console.log("Fetched spreadsheet data.");

    return formattedData;
  } catch (error) {
    console.error("Error fetching spreadsheet data:", error);
    return [];
  }
}

// Generate static params for all articles
export async function generateStaticParams() {
  const sections = await fetchSections();

  for (const section of sections) {
    const params = section.Children.map((child) => ({
      slug: child.slug,
    }));

    params.push({
      slug: section.Parent.slug,
    });

    return params;
  }
}

// Render the article page
export default async function Page({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = await paramsPromise;
  const articles = await fetchSections();
  const section = articles.find((section) => section.Parent.slug === params.slug);

  return (
    <main>
      <h1>{section?.Parent.name}</h1>
      <ul>
        {section?.Children.map((child) => (
          <li key={child.slug}>
            <a href={`/section/${child.slug}`}>{child.name}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
