'use client';
import { useState, useMemo } from 'react';
import { MasonryLayout } from './masonry';
import { Pagination } from './pagination';
import { ListCard } from './cards';

export function PaginatedArticles({ articles, itemsPerPage = 10 }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Defensive check for articles array
  const safeArticles = Array.isArray(articles) ? articles : [];

  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return safeArticles.slice(startIndex, endIndex);
  }, [safeArticles, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of articles section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show message if no articles
  if (safeArticles.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>No articles found for this section.</p>
      </div>
    );
  }

  return (
    <>
      <MasonryLayout columns={3} gap="1rem">
        {paginatedArticles.map((item, index) => (
          <ListCard
            key={item.slug || `article-${index}`}
            title={item.title || 'Untitled'}
            authors={item.authors || []}
            date={item.date || ''}
            slug={item.slug || ''}
            cover={item.cover || ''}
            views={item.views || 0}
            body={item.body || ''}
            trending={item.trending || false}
            type={item.type || ''}
          />
        ))}
      </MasonryLayout>
      
      {safeArticles.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalItems={safeArticles.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}
