"use client";

export function CalendarPagination({ totalCount, onPrevMonth, onNextMonth }: { totalCount: number; onPrevMonth: () => void; onNextMonth: () => void }) {
  const page = 1;
  const totalPages = 1;
  const isPrevDisabled = false;
  const isNextDisabled = false;
  const startItem = totalCount > 0 ? 1 : 0;
  const endItem = totalCount;
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center">
        <button disabled={isPrevDisabled} onClick={onPrevMonth} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors">Previous</button>
        <div className="text-sm font-semibold text-gray-700">Page {page} of {totalPages}</div>
        <button disabled={isNextDisabled} onClick={onNextMonth} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors">Next</button>
      </div>
      <div className="text-center text-sm text-gray-600 mt-2">
        {totalCount > 0 ? (
          <>Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of <span className="font-medium">{totalCount}</span> events</>
        ) : (
          <span>No events found</span>
        )}
      </div>
    </div>
  );
}


