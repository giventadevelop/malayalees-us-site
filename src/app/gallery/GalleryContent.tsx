'use client';

import { useState, useEffect } from 'react';
import { GalleryEventCard } from './components/GalleryEventCard';
import { GallerySearch } from './components/GallerySearch';
import { GalleryPagination } from './components/GalleryPagination';
import { fetchEventsForGallery } from './ApiServerActions';
import type { GalleryPageData } from './ApiServerActions';

const ITEMS_PER_PAGE = 12;

export function GalleryContent() {
  const [galleryData, setGalleryData] = useState<GalleryPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: '',
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
  });

  useEffect(() => {
    const loadGalleryData = async () => {
      setLoading(true);
      try {
        const data = await fetchEventsForGallery(
          currentPage, 
          ITEMS_PER_PAGE, 
          searchFilters.searchTerm,
          searchFilters.startDate,
          searchFilters.endDate
        );
        setGalleryData(data);
      } catch (error) {
        console.error('Failed to fetch gallery data:', error);
        setGalleryData(null);
      } finally {
        setLoading(false);
      }
    };
    loadGalleryData();
  }, [currentPage, searchFilters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (filters: {
    searchTerm: string;
    startDate?: string;
    endDate?: string;
  }) => {
    setSearchFilters(filters);
    setCurrentPage(0); // Reset to first page on new search
  };

  if (loading && !galleryData) {
    return (
      <div className="space-y-6">
        <GallerySearch onSearch={handleSearch} loading={loading} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Always show pagination controls, even when loading */}
        <GalleryPagination
          currentPage={currentPage}
          totalPages={1}
          totalCount={0}
          pageSize={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
          loading={loading}
        />
      </div>
    );
  }

  if (!galleryData || !galleryData.eventsWithMedia || galleryData.eventsWithMedia.length === 0) {
    const hasFilters = searchFilters.searchTerm || searchFilters.startDate || searchFilters.endDate;
    
    return (
      <div className="space-y-6">
        <GallerySearch onSearch={handleSearch} loading={loading} />
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📸</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {hasFilters ? 'No events found' : 'No events available'}
          </h3>
          <p className="text-gray-600">
            {hasFilters 
              ? 'No events match your search criteria. Try adjusting your filters.'
              : 'Check back later for event photos and videos'
            }
          </p>
          {hasFilters && (
            <button
              onClick={() => handleSearch({ searchTerm: '', startDate: undefined, endDate: undefined })}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
        
        {/* Always show pagination controls, even when no results */}
        <GalleryPagination
          currentPage={currentPage}
          totalPages={galleryData?.totalPages || 1}
          totalCount={galleryData?.totalEvents || 0}
          pageSize={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
          loading={loading}
        />
      </div>
    );
  }

  const { eventsWithMedia, totalEvents, totalPages } = galleryData;

  return (
    <div className="space-y-6">
      <GallerySearch onSearch={handleSearch} loading={loading} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventsWithMedia?.map((eventWithMedia) => (
          <GalleryEventCard
            key={eventWithMedia.event.id}
            eventWithMedia={eventWithMedia}
          />
        ))}
      </div>

      <GalleryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalEvents}
        pageSize={ITEMS_PER_PAGE}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  );
}