import { google } from "googleapis";

// Next.js will revalidate the cache at most once every 60 seconds
export const revalidate = 3660;

// Allow dynamic parameters for server-side rendering on unknown paths
export const dynamicParams = true;

const sheetId = process.env.SHEET_ID;
const keys = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Fetch sections from Google Sheets
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

    const sectionsMap = {};

    rows.forEach(row => {
      const [name, editorsStr, type, parentName, slug] = row;
      const editors = editorsStr ? editorsStr.split(", ").map((editor) => editor.trim()) : [];

      if (type === "parent") {
        sectionsMap[slug] = { 
          Parent: { name, editors, type, parent: null, slug },
          Children: []
        };
      } else if (type === "child" || type === "sub") {
        const parent = sectionsMap[parentName];
        if (parent) {
          parent.Children.push({ name, editors, type, parent: parentName, slug });
        }
      }
    });

    const formattedData = Object.values(sectionsMap);

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
  
  const params = [];

  // Generate params for each parent and its children
  sections.forEach(({ Parent }) => {
    params.push({ params: { slug: Parent.slug } });
  });

  return params;
}

// Render the article page
export default async function Page({ params: paramsPromise }) {
  const params = await paramsPromise;
  const sections = await fetchSections();
  
  // Find the parent section based on the slug
  const section = sections.find(section => section.Parent.slug === params.slug);

  if (!section) {
    // Handle case when section is not found, e.g., show a 404 page or a message
    return <main><h1>Section not found</h1></main>;
  }

  return (
    <main>
      <h1>{section.Parent.name}</h1>
      <ul>
        {section.Children.map((child) => (
          <li key={child.slug}>
            <a href={`/section/${child.slug}`}>{child.name}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
