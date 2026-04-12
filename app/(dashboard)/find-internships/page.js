export const metadata = { title: 'Find Internships — Placed' }

export default function FindInternshipsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Find Internships</h1>
        <p className="text-slate-500 mt-1">Discover opportunities that match your skills and interests.</p>
      </div>

      {/* Search bar placeholder */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-400 text-sm">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            Search roles, companies, or keywords…
          </div>
          <button className="bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Coming soon */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </div>
        <h3 className="font-semibold text-slate-900 mb-2">Listings coming soon</h3>
        <p className="text-sm text-slate-500 max-w-xs mx-auto">
          We&apos;re curating internship listings. Check back shortly.
        </p>
      </div>
    </div>
  )
}
