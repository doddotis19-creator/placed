import { supabase } from '@/lib/supabase'
import InternshipsClient from './InternshipsClient'

export const metadata = { title: 'Find Internships — Placed' }

export default async function FindInternshipsPage() {
  const { data: internships } = await supabase
    .from('internships')
    .select('*')
    .order('deadline', { ascending: true })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Find Internships</h1>
        <p className="text-slate-500 mt-1">Discover opportunities that match your skills and interests.</p>
      </div>
      <InternshipsClient internships={internships ?? []} />
    </div>
  )
}
