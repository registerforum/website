import styles from "@/styles/Cards.module.css";
import { ArticleCardInfo } from "@/types";

export function LeftImageSmallCard(info: ArticleCardInfo) {
    return (
        <a href={`/writing/${info.slug}`}>
            <div key={info.id} className={styles.leftcard}>
                <img src={info.img} alt="Picture of the author" />
                <div className={styles.text}>
                    <h2>{info.author}</h2>
                    <h1>{info.title}</h1>
                    <p>{info.body.slice(0, 200)}...</p>
                </div>
            </div>
        </a>
    );
}

export function TopImageSmallCard(info: ArticleCardInfo) {
    return (
        <a href={`/writing/${info.slug}`}>
            <div key={info.id} className={styles.topcard}>
                <img src={info.img} alt="Picture of the author" />
                <div className={styles.text}>
                    <h1>{info.title}</h1>
                    <h2>{info.author}</h2>
                    <p>{info.body.slice(0, 200)}...</p>
                </div>
            </div>
        </a>
    );
}