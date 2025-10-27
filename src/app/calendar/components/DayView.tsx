"use client";
import type { CalendarEvent } from '../types/calendar.types';

export function DayView({ events, date }: { events: CalendarEvent[]; date: Date }) {
  const day = date.getDate();
  const todays = events.filter(e => Number(e.startDate.split('-')[2]) === day);
  return (
    <div className="border rounded-lg bg-white p-4">
      <div className="text-sm font-semibold text-gray-700 mb-2">{date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
      <div className="flex flex-col gap-2">
        {todays.length === 0 && <div className="text-sm text-gray-500">No events scheduled.</div>}
        {todays.map(e => (
          <div key={e.id} className="rounded border px-3 py-2">
            <div className="text-sm font-semibold text-gray-800">{e.title}</div>
            <div className="text-xs text-gray-500">{e.startTime} - {e.endTime} • {e.location ?? 'TBA'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


