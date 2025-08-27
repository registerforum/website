'use client';
import { useState, useMemo } from 'react';
import { MasonryLayout } from './masonry';
import { Pagination } from './pagination';
import { ListCard } from './cards';

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
        {paginatedArticles.map((item, index) => (
          <ListCard
            key={item.slug || index}
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
