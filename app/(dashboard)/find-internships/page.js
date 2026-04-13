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

  // Supabase listings first (curated), then Adzuna live listings
  const internships = [...(supabaseListings ?? []), ...adzunaListings]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Find Internships</h1>
        <p className="text-slate-500 mt-1">
          Discover opportunities — {adzunaListings.length} live listings from Adzuna plus curated picks.
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
