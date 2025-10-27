"use client";
import type { CalendarView } from '../types/calendar.types';

export function ViewSwitcher({ view, onChange }: { view: CalendarView; onChange: (v: CalendarView) => void }) {
  const base = "px-3 py-2 rounded-md text-sm font-semibold transition-colors";
  const active = "bg-blue-600 text-white";
  const inactive = "bg-blue-50 text-blue-700 hover:bg-blue-100";
  return (
    <div className="flex gap-2 mb-4">
      {(['month', 'week', 'day'] as CalendarView[]).map(v => (
        <button key={v} onClick={() => onChange(v)} className={`${base} ${view === v ? active : inactive}`}>{v.toUpperCase()}</button>
      ))}
    </div>
  );
}


