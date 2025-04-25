import { createClient } from '@/utils/supabase/client';

export default async function fetchLinks() {
    const supabase = createClient();
    const { data: rows } = await supabase.from("sections").select("*");

    console.log("Here are the rows: ",rows)

    const formattedData = [];

    rows.sort((a, b) => {
        if (a.type === b.type) {
            return a.order - b.order;
        }
        return a.type === "parent" ? -1 : 1;
    });

    for (let i = 0; i < rows.length; i++) {
        if (rows[i].type == "parent") {
            formattedData.push({
                Parent: {
                    name: rows[i].name,
                    editors: rows[i].editors,
                    type: rows[i].type,
                    parent: null,
                    slug: rows[i].slug
                },
                Children: []
            });
        }

        if (rows[i].type == "child") {
            formattedData.find((parent) => parent.Parent.slug == rows[i].parent)?.Children.push({
                name: rows[i].name,
                editors: rows[i].editors,
                type: rows[i].type,
                parent: rows[i].parent,
                slug: rows[i].slug
            });
        }
    }

    console.log("Here are the rows: ",formattedData)

    console.log("Fetched spreadsheet data.");

    return formattedData;
}