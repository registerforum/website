import Image from 'next/image';
import styles from "@/styles/Header.module.css";

export default function Header() {
    return (
        <header className={styles.container}>
            <a href="/">
                <Image
                    src="/rf-banner.svg"
                    alt="logo"
                    className={styles.banner}
                    width={900}
                    height={100}
                    loading="eager"
                />
            </a>
            <div className={styles.menu}>
                <ul>
                    <a>section 1</a>
                </ul>
            </div>
        </header>
    );
}