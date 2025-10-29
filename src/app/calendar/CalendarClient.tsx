"use client";
import { useEffect, useState } from 'react';
import type { CalendarEventDTO } from './ApiServerActions';
import { fetchEventsForMonthServer } from './ApiServerActions';
import { toCalendarEvents } from './utils/eventFormatters';
import { ViewSwitcher } from './components/ViewSwitcher';
import { CalendarPagination } from './components/CalendarPagination';
import { MonthView } from './components/MonthView';
import { WeekView } from './components/WeekView';
import { DayView } from './components/DayView';
import { useCalendarNav } from './hooks/useCalendarNav';

export default function CalendarClient({ initialEvents, initialYear, initialMonth, focusGroup }: { initialEvents: CalendarEventDTO[]; initialYear: number; initialMonth: number; focusGroup?: string; }) {
  const [events, setEvents] = useState(toCalendarEvents(initialEvents));
  const [loading, setLoading] = useState(false);
  const nav = useCalendarNav(initialYear, initialMonth);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchEventsForMonthServer(nav.year, nav.month, focusGroup);
        setEvents(toCalendarEvents(data));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [nav.year, nav.month]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-xl font-semibold text-gray-900">{new Date(nav.year, nav.month - 1, 1).toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
        <div className="flex gap-2">
          <button onClick={nav.prev} className="px-3 py-2 rounded bg-blue-50 text-blue-700 hover:bg-blue-100">Previous</button>
          <button onClick={nav.today} className="px-3 py-2 rounded bg-blue-50 text-blue-700 hover:bg-blue-100">Today</button>
          <button onClick={nav.next} className="px-3 py-2 rounded bg-blue-50 text-blue-700 hover:bg-blue-100">Next</button>
        </div>
      </div>
      <ViewSwitcher view={nav.view} onChange={nav.setView} />
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : (
        <>
          {nav.view === 'month' && <MonthView events={events} year={nav.year} month={nav.month} />}
          {nav.view === 'week' && (
            <WeekView events={events} anchorDate={new Date(nav.year, nav.month - 1, 1)} />
          )}
          {nav.view === 'day' && (
            <DayView events={events} date={new Date()} />
          )}
        </>
      )}
      <CalendarPagination totalCount={events.length} onPrevMonth={nav.prev} onNextMonth={nav.next} />
    </div>
  );
}


