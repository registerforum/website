import { createClient } from '@/utils/supabase/client';

export default async function fetchSections() {
    const supabase = createClient();
    const { data: rows } = await supabase.from("sections").select("*");

    const sections = [];

    // console.log("Here are the rows: ",rows)

    for (const row of rows) {
        if (row.type === "parent" || row.type === "child") {
            sections.push({
                name: row.name || null,
                editors: row.editors || null,
                type: row.type || "parent",
                parent: row.parent || null,
                slug: row.slug || null,
                children: [],
            });
        } else {
            const parent = sections.find((a) => a.slug === row.parent);
            if (parent) {
                parent.children.push({
                    name: row.name || null,
                    editors: row.editors || null,
                    type: row.type || "child",
                    parent: row.parent || null,
                    slug: row.slug || null,
                });
            }
        }
    }

    // console.log("Here are the sections: ",sections)

    return sections;
}