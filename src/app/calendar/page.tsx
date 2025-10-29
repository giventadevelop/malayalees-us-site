import { fetchEventsForMonthServer } from './ApiServerActions';
import CalendarClient from './CalendarClient';

export default async function CalendarPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const focusGroup = typeof searchParams?.focusGroup === 'string' ? searchParams?.focusGroup : undefined;
  const initialEvents = await fetchEventsForMonthServer(year, month, focusGroup);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-6 h-3 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full"></div>
            <p className="text-gray-600 font-medium">Public Calendar</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-light leading-tight tracking-tight text-gray-900 mb-2">
            Calendar
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Browse upcoming events by month
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <CalendarClient initialEvents={initialEvents} initialYear={year} initialMonth={month} focusGroup={focusGroup} />
        </div>
      </div>
    </div>
  );
}


