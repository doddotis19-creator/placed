import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import KanbanBoard from './KanbanBoard'

export const metadata = { title: 'My Applications — Placed' }

export default async function ApplicationsPage() {
  const { userId } = await auth()

  const { data: applications } = await supabase
    .from('user_applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
        <p className="text-slate-500 mt-1">Drag cards between columns to update your progress.</p>
      </div>
      <KanbanBoard initialApplications={applications ?? []} />
    </div>
  )
}
