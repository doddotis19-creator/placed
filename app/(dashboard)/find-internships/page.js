import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { fetchAdzunaInternships } from '@/lib/adzuna'
import InternshipsClient from './InternshipsClient'

export const metadata = { title: 'Find Internships — Placed' }

export default async function FindInternshipsPage() {
  const { userId } = await auth()

  const [{ data: supabaseListings }, { data: profile }, adzunaListings] = await Promise.all([
    supabase.from('internships').select('*').order('deadline', { ascending: true }),
    supabase.from('profiles').select('sectors, locations').eq('user_id', userId).single(),
    fetchAdzunaInternships(),
  ])

  const internships = [...(supabaseListings ?? []), ...adzunaListings]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: '#F5F5F5', letterSpacing: '-0.02em' }}>
          Find Internships
        </h1>
        <p className="text-sm" style={{ color: '#525252' }}>
          {adzunaListings.length} live listings from Adzuna plus curated picks.
        </p>
      </div>
      <InternshipsClient
        internships={internships}
        userSectors={profile?.sectors ?? []}
        userLocations={profile?.locations ?? []}
        userId={userId}
      />
    </div>
  )
}
