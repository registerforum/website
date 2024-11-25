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
                    <div className={styles.dropdown}>
                        <a className={styles.visiblelink}>News</a>
                        <div className={styles.dropdownlinks}>
                            <a>Nation</a>
                            <a>Metro</a>
                            <a>Around School</a>
                        </div>
                    </div>
                    <div className={styles.dropdown}>
                        <a className={styles.visiblelink}>Opinion</a>
                        <div className={styles.dropdownlinks}>
                            <a>Columns</a>
                            <a>Editorials</a>
                        </div>
                    </div>
                    <div className={styles.dropdown}>
                        <a className={styles.visiblelink}>Sports</a>
                        <div className={styles.dropdownlinks}>
                            <a>CRLS Sports</a>
                            <a>Other Sports</a>
                        </div>
                    </div>
                    <div className={styles.dropdown}>
                        <a className={styles.visiblelink}>Arts & Entertainment</a>
                        <div className={styles.dropdownlinks}>
                            <a>CRLS Arts</a>
                            <a>Metro Arts</a>
                            <a>Review</a>
                        </div>
                    </div>
                    <div className={styles.dropdown}>
                        <a className={styles.visiblelink}>Food & Culture</a>
                        <div className={styles.dropdownlinks}>
                            <a>Recipies</a>
                        </div>
                    </div>
                    <div className={styles.dropdown}>
                        <a className={styles.visiblelink}>Humor</a>
                        <div className={styles.dropdownlinks}>
                            <a>Columns</a>
                            <a>Cartoons</a>
                            <a>Games</a>
                        </div>
                    </div>
                    <a>Archives</a>
                </ul>
                <p className={styles.right}>{new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</p>
            </div>
        </header>
    );
}