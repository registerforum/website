"use client";  // This directive makes the component a client component

import { useState } from "react";
import styles from "@/styles/MobileMenu.module.css"; // Assuming this is the same CSS file you're using
import Link from "next/link";
import Image from "next/image";

const MobileMenu = ({ links }) => {
    const [isMenuOpen, setMenuOpen] = useState(false);

    // Toggle menu open/close
    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <header className={styles.container}>
                <Link href="/">
                    <Image
                        src="/rf-banner.svg"
                        alt="logo"
                        className={styles.banner}
                        width={900}
                        height={100}
                        loading="eager"
                        priority={true}
                    />
                </Link>
                <div className={styles.menu}>
                    <button onClick={toggleMenu} className={styles.hamburger}>
                        <span className={styles.bar} />
                        <span className={styles.bar} />
                        <span className={styles.bar} />
                    </button>
                    <p className={styles.left}>Vol. 134</p>
                    <p className={styles.right}>{new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</p>
                </div>
            </header>
            <div className={styles.linkscontainer} 
                style={{ left: isMenuOpen ? "0" : "-100%" }}
            >
            <ul>
                <button onClick={toggleMenu} className={styles.close} />
                {
                    links.map((section) => (
                        <li className={styles.dropdown} key={section.Parent.slug}>
                            <Link href={`/section/${section.Parent.slug}`} className={styles.visiblelink}>
                                {section.Parent.name}
                            </Link>
                            <div className={styles.dropdownlinks}>
                                {section.Children.map((child) => (
                                    child.type === "child" ? (
                                        <Link href={`/section/${child.slug}`} key={child.slug}>
                                            {child.name}
                                        </Link>
                                    ) : (
                                        <Link href={`/section/${section.Parent.slug}#${child.slug}`} key={child.slug}>
                                            {child.name}
                                        </Link>
                                    )
                                ))}
                            </div>
                        </li>
                    ))
                }
            </ul>
            </div>
        </>
    );
};

export default MobileMenu;
