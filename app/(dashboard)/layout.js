import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Sidebar from './_components/Sidebar'
import { getProfile } from '@/lib/queries'

export default async function DashboardLayout({ children }) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // Every dashboard page requires a completed profile. If none exists, send
  // the user through onboarding first.
  const profile = await getProfile(userId)
  if (!profile) {
    redirect('/onboarding')
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0A0A0A' }}>
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <main className="flex-1 overflow-y-auto p-6 md:p-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  )
}
