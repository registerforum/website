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
                <p>Vol. 134</p>
                <ul>
                    <a>section 1</a>
                </ul>
                <p></p>
            </div>
        </header>
    );
}