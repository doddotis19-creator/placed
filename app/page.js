import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { SignInButton, SignUpButton } from '@clerk/nextjs'

export default async function LandingPage() {
  const { userId } = await auth()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-semibold text-slate-900 text-lg">Placed</span>
        </div>
        <div className="flex items-center gap-3">
          {userId ? (
            <Link
              href="/dashboard"
              className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <SignInButton>
                <button className="text-sm text-slate-600 hover:text-slate-900 font-medium px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
                  Get started
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
          Now in beta — free for students
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight max-w-3xl mb-6">
          Land your dream{' '}
          <span className="text-indigo-600">internship</span>,<br />
          not just any one.
        </h1>

        <p className="text-xl text-slate-500 max-w-xl mb-10 leading-relaxed">
          Placed helps you track every application, generate tailored cover letters, and discover
          new opportunities — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <SignUpButton>
            <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors shadow-sm">
              Start tracking for free
            </button>
          </SignUpButton>
          <SignInButton>
            <button className="w-full sm:w-auto text-slate-600 hover:text-slate-900 font-semibold px-8 py-3.5 rounded-xl text-base transition-colors border border-slate-200 hover:border-slate-300 hover:bg-slate-50">
              Sign in to your account
            </button>
          </SignInButton>
        </div>
      </main>

      {/* Features */}
      <section className="border-t border-slate-100 bg-slate-50 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">
            Everything you need to stay on top of your search
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                ),
                title: 'Dashboard',
                desc: 'A live overview of your entire job search — statuses, deadlines, and next steps.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                ),
                title: 'Find Internships',
                desc: 'Browse curated listings filtered by role, location, industry, and pay.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                title: 'Application Tracker',
                desc: 'Log every application with status, notes, contacts, and interview dates.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
                title: 'Cover Letters',
                desc: 'Generate personalized cover letters in seconds using AI.',
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-6 py-6 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Placed. Built for students, by students.
      </footer>
    </div>
  )
}
