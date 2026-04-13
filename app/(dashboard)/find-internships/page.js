import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import InternshipsClient from './InternshipsClient'

export const metadata = { title: 'Find Internships — Placed' }

export default async function FindInternshipsPage() {
  const { userId } = await auth()

  const [{ data: internships }, { data: profile }] = await Promise.all([
    supabase.from('internships').select('*').order('deadline', { ascending: true }),
    supabase.from('profiles').select('sectors, locations').eq('user_id', userId).single(),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Find Internships</h1>
        <p className="text-slate-500 mt-1">Discover opportunities that match your skills and interests.</p>
      </div>
      <InternshipsClient
        internships={internships ?? []}
        userSectors={profile?.sectors ?? []}
        userLocations={profile?.locations ?? []}
        userId={userId}
      />
    </div>
  )
}
