"use client";
import { useMemo } from 'react';
import type { CalendarEvent } from '../types/calendar.types';

function getDays(year: number, month: number) {
  const first = new Date(year, month - 1, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = [] as { day: number | null }[];
  for (let i = 0; i < startDay; i++) cells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d });
  while (cells.length % 7 !== 0) cells.push({ day: null });
  return cells;
}

export function MonthView({ events, year, month }: { events: CalendarEvent[]; year: number; month: number }) {
  const cells = useMemo(() => getDays(year, month), [year, month]);
  const eventsByDay = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();
    for (const ev of events) {
      const day = Number(ev.startDate.split('-')[2]);
      if (!Number.isFinite(day)) continue;
      const arr = map.get(day) || [];
      arr.push(ev);
      map.set(day, arr);
    }
    return map;
  }, [events]);

  return (
    <div className="grid grid-cols-7 gap-2">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(h => (
        <div key={h} className="text-xs font-semibold text-gray-500 text-center py-2">{h}</div>
      ))}
      {cells.map((c, idx) => {
        const evs = c.day ? (eventsByDay.get(c.day) || []) : [];
        return (
          <div key={idx} className="min-h-[100px] border rounded-lg p-2 bg-white">
            <div className="text-xs font-semibold text-gray-700">{c.day ?? ''}</div>
            <div className="mt-1 flex flex-col gap-1">
              {evs.slice(0, 3).map(e => (
                <div key={e.id} className="text-xs truncate px-2 py-1 rounded bg-blue-50 text-blue-700">
                  {e.title}
                </div>
              ))}
              {evs.length > 3 && (
                <div className="text-[10px] text-gray-500">+ {evs.length - 3} more</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}


