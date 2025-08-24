import styles from "@/styles/Carousel.module.css";
import fetchArticles from "@/utils/articles";


export default async function Carousel() {
    const articles = await fetchArticles();

    const featuredArticles = articles
        .filter((article) => article.trending && article.date)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className={styles.carousel}>
            {featuredArticles.slice(0, 5).map((article, index) => (
                <div key={index} className={styles.container}  style={{
                    marginLeft: `calc(-${index} * 100%)`,
                }}>
                    <img src={article.cover} className={styles.image}/>
                </div>
            ))}
        </div>
    );
}