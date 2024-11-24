import Image from 'next/image';
import styles from "@/styles/Header.module.css";
import Link from 'next/link';

export default function Header() {
    return (
        <header className={styles.container}>
            <Link href="/">
                <Image
                    src="/rf-banner.svg"
                    alt="logo"
                    className={styles.banner}
                    width={900}
                    height={100}
                    loading="eager"
                />
            </Link>
            <div className={styles.menu}>
                <p className={styles.left}>Vol. 134</p>
                <ul>
                    <a>News</a>
                    <a>Opinion</a>
                    <a>Sports</a>
                    <a>Arts & Entertainment</a>
                    <a>Food & Culture</a>
                    <a>Humor</a>
                    <a>Archives</a>
                </ul>
                <p className={styles.right}>{new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</p>
            </div>
        </header>
    );
}