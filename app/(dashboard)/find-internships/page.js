import { auth } from '@clerk/nextjs/server'
import { getProfile, getApplications } from '@/lib/queries'
import InternshipsClient from './InternshipsClient'

export const metadata = { title: 'Find Internships — Placed' }

export default async function FindInternshipsPage() {
  const { userId } = await auth()

  const [profile, applications] = await Promise.all([
    getProfile(userId),
    getApplications(userId),
  ])

  // Used to mark listings the user has already tracked (matched by company + role).
  const appliedKeys = applications.map(
    (a) => `${(a.company ?? '').toLowerCase().trim()}|${(a.role ?? '').toLowerCase().trim()}`
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: '#F5F5F5', letterSpacing: '-0.02em' }}>
          Find Internships
        </h1>
        <p className="text-sm" style={{ color: '#525252' }}>
          Live listings across finance, technology, consulting, law and more.
        </p>
      </div>
      <InternshipsClient
        userSectors={profile?.sectors ?? []}
        userLocations={profile?.locations ?? []}
        userGradYear={profile?.graduation_year ?? null}
        appliedKeys={appliedKeys}
      />
    </div>
  )
}
