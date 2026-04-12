import { currentUser } from '@clerk/nextjs/server'

export const metadata = { title: 'Dashboard — Placed' }

export default async function DashboardPage() {
  const user = await currentUser()

  const stats = [
    { label: 'Applications', value: '0', sub: 'total sent' },
    { label: 'In Progress', value: '0', sub: 'active apps' },
    { label: 'Interviews', value: '0', sub: 'scheduled' },
    { label: 'Offers', value: '0', sub: 'received' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
        </h1>
        <p className="text-slate-500 mt-1">Here&apos;s an overview of your internship search.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="font-semibold text-slate-900 mb-2">No applications yet</h3>
        <p className="text-sm text-slate-500 max-w-xs mx-auto">
          Start by finding internships or adding an application manually to track your progress.
        </p>
      </div>
    </div>
  )
}
