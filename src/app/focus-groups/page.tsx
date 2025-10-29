import { getAppUrl } from '@/lib/env';

function toInt(v: string | undefined, d: number) {
  const n = Number(v); return Number.isFinite(n) && n >= 0 ? n : d;
}

export default async function FocusGroupsPage({ searchParams }: { searchParams?: { [k: string]: string | string[] | undefined } }) {
  const baseUrl = getAppUrl();
  const page = toInt(typeof searchParams?.page === 'string' ? searchParams?.page : undefined, 0);
  const size = toInt(typeof searchParams?.size === 'string' ? searchParams?.size : undefined, 9);
  const sort = typeof searchParams?.sort === 'string' ? searchParams?.sort : 'name,asc';

  let groups: any[] = [];
  let total = 0;
  try {
    const res = await fetch(`${baseUrl}/api/proxy/focus-groups?isActive.equals=true&page=${page}&size=${size}&sort=${encodeURIComponent(sort)}`,
      { cache: 'no-store', headers: { 'Content-Type': 'application/json' } });
    if (res.ok) {
      const data = await res.json();
      groups = Array.isArray(data) ? data : [];
      total = Number(res.headers.get('x-total-count') || groups.length || 0);
    }
  } catch { }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-5xl mx-auto px-8 pt-24 pb-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-6 h-3 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full"></div>
            <p className="text-gray-600 font-medium">Community</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-light leading-tight tracking-tight text-gray-900 mb-2">Focus Groups</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">Explore our specialized groups and their upcoming activities.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map(g => (
              <a key={g.id} href={`/focus-groups/${encodeURIComponent(g.slug)}`} className="group block bg-white rounded-xl shadow p-6 hover:shadow-md transition">
                <div className="h-36 rounded-lg mb-4 bg-cover bg-center" style={{ backgroundImage: g.coverImageUrl ? `url(${g.coverImageUrl})` : undefined, backgroundColor: '#f3f4f6' }} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{g.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{g.description || 'No description provided.'}</p>
              </a>
            ))}
            {groups.length === 0 && (
              <div className="col-span-full text-center text-gray-500">No focus groups found.</div>
            )}
          </div>

          {(() => {
            const totalPages = Math.max(1, Math.ceil((total || 0) / size));
            const isPrevDisabled = page <= 0;
            const isNextDisabled = page + 1 >= totalPages;
            const startItem = total > 0 ? page * size + 1 : 0;
            const endItem = total > 0 ? page * size + Math.min(size, total - page * size) : 0;
            const qs = (p: number) => `?page=${p}&size=${size}&sort=${encodeURIComponent(sort)}`;
            return (
              <div className="mt-8">
                <div className="flex justify-between items-center">
                  <a aria-disabled={isPrevDisabled} className={`px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 ${isPrevDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`} href={isPrevDisabled ? '#' : `/focus-groups${qs(page - 1)}`}>Previous</a>
                  <div className="text-sm font-semibold text-gray-700">Page {totalPages === 0 ? 0 : page + 1} of {totalPages}</div>
                  <a aria-disabled={isNextDisabled} className={`px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 ${isNextDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`} href={isNextDisabled ? '#' : `/focus-groups${qs(page + 1)}`}>Next</a>
                </div>
                <div className="text-center text-sm text-gray-600 mt-2">
                  {total > 0 ? (
                    <>Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of <span className="font-medium">{total}</span> items</>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>No items found</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm font-medium">[No items match your criteria]</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
