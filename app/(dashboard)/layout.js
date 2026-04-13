import { UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Sidebar from './_components/Sidebar'
import { supabase } from '@/lib/supabase'

export default async function DashboardLayout({ children }) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_complete')
    .eq('user_id', userId)
    .single()

  if (!profile?.onboarding_complete) {
    redirect('/onboarding')
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-end shrink-0">
          <UserButton afterSignOutUrl="/" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
