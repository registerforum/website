import Image from 'next/image';
import styles from "@/styles/Header.module.css";
import Link from 'next/link';
import { google } from "googleapis";
import { Section } from "@/types";
import { unstable_cache } from "next/cache";
import Search from "@/components/search";

const sheetId = process.env.SHEET_ID!;
const keys = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!);

async function fetchSpreadsheetData(): Promise<{ Parent: Section, Children: Section[] }[]> {
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

        // console.log(formattedData[0].cover)

        console.log("Fetched spreadsheet data.");

        return formattedData;
    } catch (error) {
        console.error("Error fetching spreadsheet data:", error);
        return [];
    }
}

interface HeaderProps {
    search: boolean;
}

export default async function Header({ search }: HeaderProps) {
    const data = await unstable_cache(async () => { return await fetchSpreadsheetData() }, [], {
        revalidate: 3600
    })();

    return (
        <header className={styles.container}>
            {search && <Search placeholder=''/>}
            <Link href="/">
                <Image
                    src="/rf-banner.svg"
                    alt="logo"
                    className={styles.banner}
                    width={900}
                    height={100}
                    loading="eager"
                    priority={true}
                />
            </Link>
            <div className={styles.menu}>
                <p className={styles.left}>Vol. 134</p>
                <ul>
                    {
                        data.map((section, index) => (
                            <li className={styles.dropdown} key={index}>
                                <Link href={`/section/${section.Parent.slug}`} className={styles.visiblelink}>
                                    {section.Parent.name}
                                </Link>
                                <div className={styles.dropdownlinks}>
                                    {
                                        (() => {
                                            const links = [];
                                            for (let childIndex = 0; childIndex < section.Children.length; childIndex++) {
                                                const child = section.Children[childIndex];
                                                if (child.type === "child") {
                                                    links.push(
                                                        <Link href={`/section/${child.slug}`} key={childIndex}>
                                                            {child.name}
                                                        </Link>
                                                    );
                                                } else {
                                                    links.push(
                                                        <Link href={`/section/${section.Parent.slug}#${child.slug}`} key={childIndex}>
                                                            {child.name}
                                                        </Link>
                                                    )
                                                }
                                            }
                                            return links;
                                        })()
                                    }
                                </div>
                            </li>
                        ))
                    }
                </ul>
                <p className={styles.right}>{new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</p>
            </div>
        </header>
    );
}