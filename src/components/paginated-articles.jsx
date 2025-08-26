'use client';
import { useState, useMemo } from 'react';
import { MasonryLayout } from './masonry';
import { Pagination } from './pagination';

export function PaginatedArticles({ articles, itemsPerPage = 10 }) {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return articles.slice(startIndex, endIndex);
  }, [articles, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of articles section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <MasonryLayout columns={3} gap="1rem">
        {paginatedArticles}
      </MasonryLayout>
      
      <Pagination
        currentPage={currentPage}
        totalItems={articles.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </>
  );
}
