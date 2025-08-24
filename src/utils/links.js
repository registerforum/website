
import { createClient } from '@/utils/supabase/client';

let cachedLinks = null;
let linksCacheTimestamp = 0;
const LINKS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default async function fetchLinks() {
    const now = Date.now();
    if (cachedLinks && now - linksCacheTimestamp < LINKS_CACHE_DURATION) {
        return cachedLinks;
    }
    const supabase = createClient();
    const { data: rows } = await supabase.from("sections").select("*");

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

    cachedLinks = formattedData;
    linksCacheTimestamp = now;
    return formattedData;
}