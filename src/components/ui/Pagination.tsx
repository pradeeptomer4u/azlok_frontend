'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = ''
}: PaginationProps) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max to show
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        startPage = 2;
        endPage = 4;
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
        endPage = totalPages - 1;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className={`flex items-center justify-center mt-4 ${className}`}>
      <ul className="inline-flex -space-x-px text-sm">
        <li>
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`
              flex items-center justify-center px-3 h-8 ms-0 leading-tight 
              rounded-l-lg border border-gray-300
              ${currentPage === 1 
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
              }
            `}
          >
            Previous
          </button>
        </li>
        
        {getPageNumbers().map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300">
                ...
              </span>
            ) : (
              <button
                onClick={() => typeof page === 'number' && onPageChange(page)}
                className={`
                  flex items-center justify-center px-3 h-8 leading-tight border border-gray-300
                  ${currentPage === page
                    ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700'
                    : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
                  }
                `}
              >
                {page}
              </button>
            )}
          </li>
        ))}
        
        <li>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`
              flex items-center justify-center px-3 h-8 leading-tight 
              rounded-r-lg border border-gray-300
              ${currentPage === totalPages 
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
              }
            `}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
