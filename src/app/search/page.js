'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import fetchArticles from '@/utils/articles';
import Fuse from 'fuse.js';
import { LeftImageSmallCard } from '@/components/cards';
import styles from '@/styles/SearchPage.module.css';

function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState(searchParams.get('q') || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/search?q=${term}`);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <input
        type="text"
        placeholder="Search..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className={styles.searchInput}
      />
      <button type="submit" className={styles.searchButton}>Search</button>
    </form>
  );
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const fetchedArticles = await fetchArticles();

      if (query) {
        const fuse = new Fuse(fetchedArticles, {
          keys: ['title', 'authors.name'],
          threshold: 0.3,
        });
        setResults(fuse.search(query).map(res => res.item));
      } else {
        setResults([]);
      }
      setLoading(false);
    }
    fetchData();
  }, [query]);

  return (
    <div className={styles.searchContainer}>
      <h1 className={styles.searchHeading}>
        Search Results for &quot;{query}&quot;
      </h1>
      {loading ? (
        <p className={styles.searchLoading}>Searching...</p>
      ) : results.length === 0 ? (
        <p className={styles.searchNoResults}>No articles found.</p>
      ) : (
        <div className={styles.searchResults}>
          {results.map((item, index) => (
            <LeftImageSmallCard
              key={index}
              className={styles.searchCard}
              title={item.title}
              authors={item.authors}
              date={item.date}
              slug={item.slug}
              cover={item.cover}
              views={item.views}
              body={item.body}
              trending={item.trending}
              type={item.type}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <SearchBar />
      <Suspense fallback={<div className={styles.searchFallback}>Loading...</div>}>
        <SearchResults />
      </Suspense>
    </>
  );
}
