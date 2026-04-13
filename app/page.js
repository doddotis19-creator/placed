import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { SignInButton, SignUpButton } from '@clerk/nextjs'

export default async function LandingPage() {
  const { userId } = await auth()

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col">

      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#09090B]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-semibold text-white text-lg tracking-tight">Placed</span>
        </div>
        <div className="flex items-center gap-3">
          {userId ? (
            <Link
              href="/dashboard"
              className="text-sm bg-white hover:bg-zinc-100 text-zinc-900 font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Go to dashboard →
            </Link>
          ) : (
            <>
              <SignInButton>
                <button className="text-sm text-zinc-400 hover:text-white font-medium px-4 py-2 rounded-lg hover:bg-white/[0.06] transition-colors">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="text-sm bg-white hover:bg-zinc-100 text-zinc-900 font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">
                  Get started
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-28 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        </div>

        {/* Badge */}
        <div className="relative inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] text-zinc-300 text-xs font-medium px-3 py-1.5 rounded-full mb-8 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Now in beta — free for students
        </div>

        {/* Headline */}
        <h1 className="relative text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight max-w-4xl mb-6">
          Land your dream{' '}
          <span className="bg-gradient-to-br from-indigo-400 via-violet-400 to-purple-500 bg-clip-text text-transparent">
            internship
          </span>
          ,<br className="hidden sm:block" /> not just any one.
        </h1>

        <p className="relative text-lg sm:text-xl text-zinc-400 max-w-xl mb-10 leading-relaxed">
          Track every application, discover live listings, generate tailored cover letters,
          and never miss a deadline — all in one clean workspace.
        </p>

        {/* CTAs */}
        <div className="relative flex flex-col sm:flex-row items-center gap-3">
          <SignUpButton>
            <button className="w-full sm:w-auto bg-white hover:bg-zinc-100 text-zinc-900 font-semibold px-7 py-3 rounded-xl text-sm transition-colors shadow-lg shadow-white/5">
              Start tracking for free →
            </button>
          </SignUpButton>
          <SignInButton>
            <button className="w-full sm:w-auto border border-white/10 hover:border-white/20 hover:bg-white/[0.04] text-zinc-300 hover:text-white font-semibold px-7 py-3 rounded-xl text-sm transition-all">
              Sign in to your account
            </button>
          </SignInButton>
        </div>

        {/* Social proof */}
        <p className="relative text-xs text-zinc-500 mt-8">
          No credit card required · Free forever for students
        </p>
      </main>

      {/* ── Feature Highlights ── */}
      <section className="border-t border-white/[0.06] px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-4">
            Everything you need
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4 tracking-tight">
            Stop using spreadsheets.
          </h2>
          <p className="text-zinc-400 text-center text-base max-w-lg mx-auto mb-16">
            Placed gives you a purpose-built toolkit to manage your entire internship search in one place.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                ),
                title: 'Dashboard',
                desc: 'A live overview of your entire job search — statuses, deadlines, and next steps at a glance.',
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                ),
                title: 'Find Internships',
                desc: 'Live listings from Adzuna plus curated picks, filtered by role, location, sector, and pay.',
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                title: 'Kanban Tracker',
                desc: 'Drag-and-drop cards through every stage. Notes, timelines, and deadline badges built in.',
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
                title: 'Cover Letters',
                desc: 'Generate polished, personalised cover letters in seconds using AI — no blank-page dread.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.14] rounded-2xl p-6 transition-all"
              >
                <div className="w-9 h-9 bg-indigo-600/20 text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600/30 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-2 text-sm">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-t border-white/[0.06] px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-4">How it works</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">
            Up and running in minutes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-14">
            {[
              { step: '01', title: 'Create your profile', desc: 'Tell us your sectors, locations, and degree so we can personalise your matches.' },
              { step: '02', title: 'Find and save roles', desc: 'Browse live listings from Adzuna and your curated feed, save anything that catches your eye.' },
              { step: '03', title: 'Track your progress', desc: 'Move applications through your Kanban board. Get email alerts 3 days before any deadline.' },
            ].map((item) => (
              <div key={item.step} className="text-left">
                <span className="text-xs font-mono text-indigo-500 mb-3 block">{item.step}</span>
                <h3 className="font-semibold text-white text-base mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="border-t border-white/[0.06] px-6 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Ready to get placed?
          </h2>
          <p className="text-zinc-400 text-lg mb-10">
            Join students already using Placed to stay organised and land the roles they want.
          </p>
          <SignUpButton>
            <button className="bg-white hover:bg-zinc-100 text-zinc-900 font-semibold px-8 py-3.5 rounded-xl text-base transition-colors shadow-lg shadow-white/5">
              Start for free — no card needed
            </button>
          </SignUpButton>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] px-6 py-6 flex items-center justify-between text-xs text-zinc-600">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-indigo-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-[9px]">P</span>
          </div>
          <span>Placed</span>
        </div>
        <span>© {new Date().getFullYear()} Placed. Built for students.</span>
      </footer>
    </div>
  )
}
