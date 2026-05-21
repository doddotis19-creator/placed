import { MOCK_APPLICATIONS } from '@/lib/mock-data'
import KanbanBoard from './KanbanBoard'
import ExportButton from './ExportButton'

export const metadata = { title: 'My Applications — Placed' }

export default async function ApplicationsPage() {
  const apps = MOCK_APPLICATIONS

  const total = apps.length
  const responded = apps.filter(a => !['Wishlist', 'Applied'].includes(a.status)).length
  const interviews = apps.filter(a => ['Interview', 'AC'].includes(a.status)).length
  const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0
  const interviewRate = total > 0 ? Math.round((interviews / total) * 100) : 0

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: '#F5F5F5', letterSpacing: '-0.02em' }}>
            My Applications
          </h1>
          <p className="text-sm" style={{ color: '#525252' }}>Drag cards between columns to update your progress.</p>
        </div>
        <ExportButton applications={apps} />
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total applications', value: total, color: '#F5F5F5' },
          { label: 'Response rate', value: `${responseRate}%`, color: '#6366F1' },
          { label: 'Interview rate', value: `${interviewRate}%`, color: '#22C55E' },
        ].map((s) => (
          <div key={s.label} className="rounded-[10px] px-5 py-4 flex flex-col gap-1"
            style={{ background: '#111111', border: '1px solid #222222', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
            <p className="text-xs" style={{ color: '#525252' }}>{s.label}</p>
            <p className="text-2xl font-bold tracking-tight" style={{ color: s.color, letterSpacing: '-0.03em' }}>{s.value}</p>
          </div>
        ))}
      </div>

      <KanbanBoard initialApplications={apps} />
    </div>
  )
}
