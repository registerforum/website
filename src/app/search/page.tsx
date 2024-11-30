import Search from "@/components/search";
import Layout from "@/components/layout";

export default function SearchPage() {
    return (
        <Layout search={false}>
            <Search placeholder="Search Articles" />
        </Layout>
    );
}