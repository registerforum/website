'use client';
import { useEffect, useState, useMemo } from 'react';

export function MasonryLayout({ children, columns = 3, gap = '1rem' }) {
  const [columnCount, setColumnCount] = useState(columns);

  useEffect(() => {
    const updateColumnCount = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth <= 700) {
          setColumnCount(1);
        } else if (window.innerWidth <= 1025) {
          setColumnCount(2);
        } else {
          setColumnCount(columns);
        }
      }
    };

    updateColumnCount();

    const handleResize = () => {
      updateColumnCount();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [columns]);

  // Memoize the column distribution to prevent recalculation on scroll
  const columnWrappers = useMemo(() => {
    const newColumns = Array.from({ length: columnCount }, () => []);
    
    children.forEach((child, index) => {
      const columnIndex = index % columnCount;
      newColumns[columnIndex].push(child);
    });
    
    return newColumns;
  }, [children, columnCount]);

  return (
    <div 
      style={{
        display: 'flex',
        gap: gap,
        alignItems: 'flex-start',
        width: '100%'
      }}
    >
      {columnWrappers.map((column, columnIndex) => (
        <div
          key={columnIndex}
          style={{
            flex: '1 1 0px', // Equal flex basis to ensure equal widths
            display: 'flex',
            flexDirection: 'column',
            gap: gap,
            minWidth: 0 // Prevent flex items from overflowing
          }}
        >
          {column}
        </div>
      ))}
    </div>
  );
}
