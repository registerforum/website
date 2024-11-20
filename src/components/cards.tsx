import styles from "@/styles/Cards.module.css";
import { ArticleCardInfo } from "@/types";

export function SmallCard(info: ArticleCardInfo) {
    return (
        <div key={info.id} className={styles.card}>
            <img src={info.img} alt="Picture of the author" />
            <div className={styles.text}>
                <h1>{info.title}</h1>
                <h2>{info.author}</h2>
                <p>{info.body.slice(0, 100)}...</p>
            </div>
        </div>
    );
}