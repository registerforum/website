'use client'

import { useState, useEffect } from 'react';
import styles from "@/styles/Header.module.css";
import Link from 'next/link';
import { Section } from "@/types";

export default function Header({ links }: Readonly<{ links: Section[] }>) {
    const [windowWidth, setWindowWidth] = useState<number>(0); // Initial value 0
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false); // Tracks if the component is mounted

    // Set the window width and update it on resize only after the component is mounted
    useEffect(() => {
        setMounted(true); // Set mounted to true after the component has mounted
        const handleResize = () => setWindowWidth(window.innerWidth);
        setWindowWidth(window.innerWidth); // Set window width on mount
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // If we're still waiting for the component to mount, render nothing or a loading state
    if (!mounted) {
        return (
            <header className={styles.container}>
                <Link href="/">
                    <img
                        src="/rf-banner.svg"
                        alt="logo"
                        className={styles.banner}
                    />
                </Link>
                <div className={styles.menu}>
                    <div className={styles.infocontainer}>
                        <p className={styles.left}>Vol. 134</p>
                        <p className={styles.right}>
                            {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
                        </p>
                    </div>
                </div>
            </header>
        )
    }

    return (
        <header className={styles.container}>
            <Link href="/">
                <img
                    src="/rf-banner.svg"
                    alt="logo"
                    className={styles.banner}
                />
            </Link>
            <div className={styles.menu}>
                {windowWidth >= 900 ? (
                    <>
                        <div className={styles.linkscontainer}>
                            <ul>
                                {links.map((section, index) => (
                                    <li className={styles.dropdown} key={index}>
                                        <Link href={`/section/${section.slug}`} className={styles.visiblelink}>
                                            {section.name}
                                        </Link>
                                        <div className={styles.dropdownlinks}>
                                            {section.children?.map((child) => (
                                                child.type === "child" ? (
                                                    <Link href={`/section/${child.slug}`} key={child.slug}>
                                                        {child.name}
                                                    </Link>
                                                ) : (
                                                    <Link href={`/section/${section.slug}#${child.slug}`} key={child.slug}>
                                                        {child.name}
                                                    </Link>
                                                )
                                            ))}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={styles.infocontainer}>
                            <p className={styles.left}>Vol. 134</p>
                            <p className={styles.right}>
                                {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div
                            style={showMenu ? { left: "0" } : { left: "-100%" }}
                            className={styles.linkscontainer}
                        >
                            <button onClick={() => setShowMenu(!showMenu)} className={styles.closebutton}>
                                <div className={styles.closearrow}></div>
                            </button>
                            <ul>
                                {links.map((section, index) => 
                                    section.children && section.children.length > 0 ? (
                                        <li className={styles.dropdown} key={index}>
                                            <details>
                                                <summary>
                                                    <Link href={`/section/${section.slug}`} className={styles.visiblelink} onClick={() => setShowMenu(!showMenu)}>
                                                        {section.name}
                                                    </Link>
                                                </summary>
                                                <div className={styles.dropdownlinks}>
                                                    {section.children.map((child) => (
                                                        child.type === "child" ? (
                                                            <Link href={`/section/${child.slug}`} key={child.slug} onClick={() => setShowMenu(!showMenu)}>
                                                                {child.name}
                                                            </Link>
                                                        ) : (
                                                            <Link href={`/section/${section.slug}#${child.slug}`} key={child.slug} onClick={() => setShowMenu(!showMenu)}>
                                                                {child.name}
                                                            </Link>
                                                        )
                                                    ))}
                                                </div>
                                            </details>
                                        </li>
                                    ) : (
                                        <li className={styles.nondropdown} key={index}>
                                            <Link href={`/section/${section.slug}`} className={styles.visiblelink} onClick={() => setShowMenu(!showMenu)}>
                                                {section.name}
                                            </Link>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                        <div className={styles.infocontainer}>
                            <button onClick={() => setShowMenu(!showMenu)} className={styles.openbutton}>
                                <div className={styles.openarrow}></div>
                            </button>
                            <div>
                                <p className={styles.left}>Vol. 134</p>
                                <p className={styles.right}>
                                    {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}
