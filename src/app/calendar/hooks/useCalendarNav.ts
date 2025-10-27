import { useState } from 'react';
import type { CalendarView } from '../types/calendar.types';

export function useCalendarNav(initialYear: number, initialMonth: number) {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [view, setView] = useState<CalendarView>('month');

  function prev() {
    if (view === 'month') {
      setMonth(m => (m === 1 ? 12 : m - 1));
      if (month === 1) setYear(y => y - 1);
    }
  }
  function next() {
    if (view === 'month') {
      setMonth(m => (m === 12 ? 1 : m + 1));
      if (month === 12) setYear(y => y + 1);
    }
  }
  function today() {
    const t = new Date();
    setYear(t.getFullYear());
    setMonth(t.getMonth() + 1);
  }

  return { year, month, view, setView, prev, next, today };
}


