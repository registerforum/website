'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/Search.module.css';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.inputcontainer}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search articles..."
                    className={styles.searchbar}
                />
                <button type="submit" className={styles.searchbutton}>
                    🔍
                </button>
            </form>
        </div>
    );
}
