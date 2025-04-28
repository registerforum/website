'use client'

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import fetchArticles from '@/utils/articles';
import Fuse from 'fuse.js';
import { LeftImageSmallCard } from '@/components/cards';

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
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Results for &quot;{query}&quot;</h1>

      {loading ? (
        <p>Searching...</p>
      ) : results.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <>
          {results.map((item, index) => (
            <LeftImageSmallCard
              key={index}
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
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
