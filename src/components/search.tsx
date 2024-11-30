'use client';

import { useState } from 'react';
import { Article } from '@/types';
import { LeftImageSmallCard } from './cards';
import styles from '@/styles/Search.module.css';
import { container } from 'googleapis/build/src/apis/container';

export default function Search({ placeholder }: { placeholder: string }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<Article[]>([]);

    function handleSearch(term: string) {
        fetch(`/api/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchTerm: term }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setResults(data);
            });
    }

    return (
        <div className={styles.container}>
            <div className={styles.inputcontainer}>
                <input
                    className={styles.searchbar}
                    placeholder={placeholder}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                    }}
                />
                <button className={styles.searchbutton} onClick={() => {
                    handleSearch(searchTerm);
                }}>
                    Search
                </button>
            </div>
            <div className={styles.searchresults}>
                {results.map((result, index) => (
                    <LeftImageSmallCard
                        key={index}
                        title={result.title}
                        cover={result.cover}
                        authors={result.authors}
                        body={result.body}
                        slug={result.slug}
                        date={result.date}
                        trending={result.trending}
                        type={result.type}
                        views={result.views}
                    />
                ))}
            </div>
        </div>
    );
}