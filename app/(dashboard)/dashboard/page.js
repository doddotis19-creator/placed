import { currentUser } from '@clerk/nextjs/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const metadata = { title: 'Dashboard — Placed' }

function StatCard({ label, value, sub, color, trend }) {
  return (
    <div className="rounded-[10px] p-5 flex flex-col gap-1" style={{ background: '#111111', border: '1px solid #222222', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
      <p className="text-xs font-medium" style={{ color: '#525252' }}>{label}</p>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold tracking-tight" style={{ color: color ?? '#F5F5F5', letterSpacing: '-0.03em' }}>{value}</span>
        {trend && (
          <span className="text-xs font-medium mb-1" style={{ color: trend > 0 ? '#22C55E' : '#EF4444' }}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}
          </span>
        )}
      </div>
      <p className="text-xs" style={{ color: '#525252' }}>{sub}</p>
    </div>
  )
}

function DeadlineItem({ app }) {
  function daysRemaining(deadline) {
    if (!deadline) return null
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const d = new Date(deadline); d.setHours(0, 0, 0, 0)
    return Math.ceil((d - today) / (1000 * 60 * 60 * 24))
  }

  const days = daysRemaining(app.deadline)
  const color = days !== null && days <= 7 ? '#EF4444' : days !== null && days <= 14 ? '#F59E0B' : '#22C55E'

  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #1a1a1a' }}>
      <div className="min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: '#F5F5F5' }}>{app.role}</p>
        <p className="text-xs truncate" style={{ color: '#525252' }}>{app.company}</p>
      </div>
      {days !== null && (
        <span className="text-xs font-semibold ml-3 px-2 py-1 rounded-[5px] shrink-0"
          style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
          {days === 0 ? 'Due today' : days < 0 ? 'Closed' : `${days}d`}
        </span>
      )}
    </div>
  )
}

export default async function DashboardPage() {
  const user = await currentUser()
  const { userId } = await auth()

  const { data: applications } = await supabase
    .from('user_applications')
    .select('*')
    .eq('user_id', userId)
    .order('deadline', { ascending: true })

  const apps = applications ?? []
  const today = new Date(); today.setHours(0, 0, 0, 0)

  const activeApps = apps.filter(a => !['Offer', 'Rejected'].includes(a.status)).length
  const interviews = apps.filter(a => a.status === 'Interview' || a.status === 'AC').length
  const upcomingDeadlines = apps.filter(a => {
    if (!a.deadline) return false
    const d = new Date(a.deadline); d.setHours(0, 0, 0, 0)
    const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24))
    return diff >= 0 && diff <= 7
  }).length

  const deadlineApps = apps
    .filter(a => a.deadline)
    .filter(a => {
      const d = new Date(a.deadline); d.setHours(0, 0, 0, 0)
      return d >= today
    })
    .slice(0, 5)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const now = new Date()
  const dateStr = `${dayNames[now.getDay()]}, ${now.getDate()} ${monthNames[now.getMonth()]}`

  const quickActions = [
    { label: 'Generate Cover Letter', href: '/cover-letter', icon: '✦', color: '#6366F1' },
    { label: 'Find Internships', href: '/find-internships', icon: '⌕', color: '#8B5CF6' },
    { label: 'My Applications', href: '/applications', icon: '⊞', color: '#F59E0B' },
    { label: 'Settings', href: '/settings', icon: '⚙', color: '#525252' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-medium mb-1" style={{ color: '#525252' }}>{dateStr}</p>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#F5F5F5', letterSpacing: '-0.02em' }}>
          {greeting}{user?.firstName ? `, ${user.firstName}` : ''} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: '#525252' }}>
          {apps.length === 0
            ? "You haven't added any applications yet. Let's fix that."
            : `You have ${activeApps} active application${activeApps !== 1 ? 's' : ''} in progress.`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Active Applications" value={activeApps} sub="in progress" color="#6366F1" />
        <StatCard label="Interviews Upcoming" value={interviews} sub="scheduled" color="#8B5CF6" />
        <StatCard label="Deadlines This Week" value={upcomingDeadlines} sub="closing soon" color={upcomingDeadlines > 0 ? '#F59E0B' : '#F5F5F5'} />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">

        {/* Left: Quick actions */}
        <div className="lg:col-span-3 rounded-[10px] p-6" style={{ background: '#111111', border: '1px solid #222222', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
          <h2 className="text-sm font-semibold mb-5" style={{ color: '#F5F5F5' }}>Quick actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href}
                className="flex items-center gap-3 p-4 rounded-[8px] transition-all duration-150 group"
                style={{ background: '#161616', border: '1px solid #222222' }}>
                <div className="w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0 text-sm font-bold transition-all duration-150"
                  style={{ background: `${action.color}20`, color: action.color }}>
                  {action.icon}
                </div>
                <span className="text-sm font-medium" style={{ color: '#A3A3A3' }}>{action.label}</span>
              </Link>
            ))}
          </div>

          {apps.length === 0 && (
            <div className="mt-5 rounded-[8px] p-5 text-center" style={{ background: '#161616', border: '1px dashed #222222' }}>
              <p className="text-sm font-medium mb-1" style={{ color: '#A3A3A3' }}>No applications yet</p>
              <p className="text-xs mb-4" style={{ color: '#525252' }}>
                Start by finding internships or adding one manually.
              </p>
              <Link href="/find-internships"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-[6px] transition-all duration-150"
                style={{ background: '#6366F1', color: '#fff' }}>
                Find internships →
              </Link>
            </div>
          )}
        </div>

        {/* Right: Upcoming deadlines */}
        <div className="lg:col-span-2 rounded-[10px] p-6" style={{ background: '#111111', border: '1px solid #222222', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold" style={{ color: '#F5F5F5' }}>Upcoming deadlines</h2>
            <Link href="/applications" className="text-xs font-medium transition-all duration-150" style={{ color: '#6366F1' }}>
              View all →
            </Link>
          </div>
          {deadlineApps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mb-3"
                style={{ background: 'rgba(34,197,94,0.1)' }}>
                <svg className="w-4 h-4" fill="none" stroke="#22C55E" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <p className="text-sm" style={{ color: '#525252' }}>No upcoming deadlines</p>
            </div>
          ) : (
            <div>
              {deadlineApps.map(app => (
                <DeadlineItem key={app.id} app={app} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Application pipeline */}
      {apps.length > 0 && (
        <div className="rounded-[10px] p-6" style={{ background: '#111111', border: '1px solid #222222', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold" style={{ color: '#F5F5F5' }}>Application pipeline</h2>
            <Link href="/applications" className="text-xs font-medium transition-all duration-150" style={{ color: '#6366F1' }}>
              Open board →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: 'Wishlist', color: '#525252' },
              { label: 'Applied', color: '#6366F1' },
              { label: 'OA/Test', color: '#F59E0B' },
              { label: 'Interview', color: '#8B5CF6' },
              { label: 'AC', color: '#EC4899' },
              { label: 'Offer', color: '#22C55E' },
              { label: 'Rejected', color: '#EF4444' },
            ].map((stage) => {
              const count = apps.filter(a => a.status === stage.label).length
              return (
                <div key={stage.label} className="rounded-[8px] p-3 text-center"
                  style={{ background: '#161616', border: '1px solid #222222' }}>
                  <div className="w-2 h-2 rounded-full mx-auto mb-2" style={{ background: stage.color }} />
                  <div className="text-lg font-bold mb-1" style={{ color: stage.color, letterSpacing: '-0.02em' }}>{count}</div>
                  <div className="text-[11px]" style={{ color: '#525252' }}>{stage.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
