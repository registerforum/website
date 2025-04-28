'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/Search.module.css';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const router = useRouter();

    const handleClick = (e: React.FormEvent) => {
        if (isSearchVisible && query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        } else {
            setIsSearchVisible(!isSearchVisible);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.icon} onClick={handleClick}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="butt"
                    strokeLinejoin="miter"
                    className={styles.searchicon}
                    width="16"
                    height="16"
                >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </div>
            {isSearchVisible && (
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search articles..."
                    className={styles.searchbar}
                />
            )}
        </div>
    );
}
