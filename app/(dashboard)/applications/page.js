export const metadata = { title: 'My Applications — Placed' }

const STATUS_COLORS = {
  Applied: 'bg-blue-50 text-blue-700',
  Interviewing: 'bg-amber-50 text-amber-700',
  Offer: 'bg-green-50 text-green-700',
  Rejected: 'bg-red-50 text-red-700',
}

export default function ApplicationsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
          <p className="text-slate-500 mt-1">Track every internship you&apos;ve applied to.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add application
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {['All', 'Applied', 'Interviewing', 'Offer', 'Rejected'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === 'All'
                ? 'bg-slate-900 text-white'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h3 className="font-semibold text-slate-900 mb-2">No applications yet</h3>
        <p className="text-sm text-slate-500 max-w-xs mx-auto mb-5">
          Add your first application to start tracking your progress.
        </p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
          Add your first application
        </button>
      </div>
    </div>
  )
}
