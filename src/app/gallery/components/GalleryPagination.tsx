'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function GalleryPagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  loading = false,
}: GalleryPaginationProps) {
  // Convert 0-based to 1-based for display
  const displayPage = currentPage + 1;
  const hasResults = totalCount > 0;
  const startItem = hasResults ? currentPage * pageSize + 1 : 0;
  const endItem = hasResults ? currentPage * pageSize + Math.min(pageSize, totalCount - currentPage * pageSize) : 0;

  const handlePrevPage = () => {
    if (currentPage > 0 && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1 && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  const isPrevDisabled = currentPage === 0 || loading;
  const isNextDisabled = currentPage >= totalPages - 1 || loading;

  // Always show pagination controls (like admin pages), even with few items

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevPage}
          disabled={isPrevDisabled}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          Previous
        </button>
        
        <div className="text-sm font-semibold text-gray-700">
          Page {displayPage} of {totalPages}
        </div>
        
        <button
          onClick={handleNextPage}
          disabled={isNextDisabled}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          Next
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      
      <div className="text-center text-sm text-gray-600 mt-2">
        {hasResults ? (
          <>
            Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalCount}</span> events
          </>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span>No events found</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm font-medium">
              [No events match your criteria]
            </span>
          </div>
        )}
      </div>
    </div>
  );
}