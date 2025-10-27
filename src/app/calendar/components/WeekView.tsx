"use client";
import type { CalendarEvent } from '../types/calendar.types';

function startOfWeek(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day; // Sunday start
  return new Date(date.getFullYear(), date.getMonth(), diff);
}

export function WeekView({ events, anchorDate }: { events: CalendarEvent[]; anchorDate: Date }) {
  const start = startOfWeek(anchorDate);
  const days = Array.from({ length: 7 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  const eventsByDay = new Map<number, CalendarEvent[]>();
  for (const ev of events) {
    const dayNum = Number(ev.startDate.split('-')[2]);
    const arr = eventsByDay.get(dayNum) || [];
    arr.push(ev);
    eventsByDay.set(dayNum, arr);
  }
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((d, idx) => {
        const day = d.getDate();
        const evs = eventsByDay.get(day) || [];
        return (
          <div key={idx} className="min-h-[140px] border rounded-lg p-2 bg-white">
            <div className="text-xs font-semibold text-gray-700">{d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
            <div className="mt-1 flex flex-col gap-1">
              {evs.slice(0, 5).map(e => (
                <div key={e.id} className="text-xs truncate px-2 py-1 rounded bg-green-50 text-green-700">
                  {e.title}
                </div>
              ))}
              {evs.length > 5 && (
                <div className="text-[10px] text-gray-500">+ {evs.length - 5} more</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}


