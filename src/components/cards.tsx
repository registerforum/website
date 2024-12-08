import styles from "@/styles/Cards.module.css";
import { Article } from "@/types";
import Image from "next/image";

export function LeftImageSmallCard(info: Article) {
    return (
        <a href={`/writing/${info.slug}`}>
            {info.cover && (
                <div className={styles.leftcard}>
                    <Image
                        src={info.cover}
                        alt="Picture of the author"
                        width={200}
                        height={200}
                    />
                    <div className={styles.text}>
                        <h2>{info.authors?.map((author, index) => (
                            <span key={index}>
                                {author.name}{index < info.authors.length - 1 ? ', ' : ''}
                            </span>
                        ))}</h2>
                        <h1>{info.title}</h1>
                        <p>{info.body?.slice(0, 100)}...</p>
                    </div>
                </div>
            )}
        </a>
    );
}

export function TopImageSmallCard(info: Article) {
    return (
        <a href={`/writing/${info.slug}`}>
            {info.cover && (
                <div className={styles.topcard}>
                    <Image
                        src={info.cover}
                        alt="Picture of the author"
                        width={200}
                        height={200}
                    />
                    <div className={styles.text}>
                        <h1>{info.title}</h1>
                        <h2>{info.authors?.map((author, index) => (
                            <span key={index}>
                                {author.name}{index < info.authors.length - 1 ? ', ' : ''}
                            </span>
                        ))}</h2>
                        <p>{info.body?.slice(0, 100)}...</p>
                    </div>
                </div>
            )}
        </a>
    );
}