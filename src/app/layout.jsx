import "@/styles/globals.css";
import { Cormorant_Garamond, Sorts_Mill_Goudy } from "next/font/google";
import fetchLinks from "@/utils/links";
import Header from "@/components/header";

const cormorantGaramond = Cormorant_Garamond({
  weight: "400",
  style: ["normal"],
  display: "swap",
  subsets: ["latin"],
  variable: "--cormorant-garamond",
});

const goudy = Sorts_Mill_Goudy({
  weight: "400",
  style: ["normal"],
  display: "swap",
  subsets: ["latin"],
  variable: "--goudy",
})

export const metadata = {
  title: {
    template: '%s | Register Forum',
    default: 'Register Forum',
  },
  description: "The Official Student Newspaper of CRLS",
};

export default async function RootLayout({ children }) {
  const fetchedLinks = await fetchLinks();
  const links = fetchedLinks.map((link) => ({
    name: link.Parent.name,
    editors: link.Parent.editors,
    type: link.Parent.type,
    parent: link.Parent.parent,
    slug: link.Parent.slug,
    children: link.Children,
  }));

  return (
    <html lang="en">
      <body className={`${cormorantGaramond.variable} ${goudy.variable}`}>
        <Header links={links}/>
        {children}
        {/* <Footer/> */}
      </body>
    </html>
  );
}
