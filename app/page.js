import { SignUpButton } from '@clerk/nextjs'
import NavButtons from './_components/NavButtons'

export default function LandingPage() {

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0A0A0A', color: '#F5F5F5' }}>

      {/* ── Navigation ── */}
      <nav style={{ borderBottom: '1px solid #222222', background: 'rgba(10,10,10,0.85)' }}
        className="sticky top-0 z-50 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[8px] flex items-center justify-center"
            style={{ background: '#6366F1', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
          </div>
          <span className="font-semibold text-[15px]" style={{ color: '#F5F5F5', letterSpacing: '-0.01em' }}>Placed</span>
        </div>
        <NavButtons />
      </nav>

      {/* ── Hero ── */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-28 text-center relative overflow-hidden">
        {/* Background radial glow */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #6366F1 0%, transparent 70%)' }} />
        </div>

        {/* Badge */}
        <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
          style={{ border: '1px solid #222222', background: 'rgba(255,255,255,0.03)', color: '#A3A3A3' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22C55E' }} />
          Now in beta — free for students
        </div>

        {/* Headline */}
        <h1 className="relative text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.06] tracking-tight max-w-4xl mb-6"
          style={{ color: '#F5F5F5', letterSpacing: '-0.03em' }}>
          Land the internship{' '}
          <span className="gradient-text">you actually want</span>
        </h1>

        <p className="relative text-lg sm:text-xl max-w-xl mb-10 leading-relaxed" style={{ color: '#A3A3A3' }}>
          AI-powered tools to find, track and apply for internships — completely free.
        </p>

        {/* CTAs */}
        <div className="relative flex flex-col sm:flex-row items-center gap-3">
          <SignUpButton>
            <button className="w-full sm:w-auto text-sm font-semibold px-7 py-3 rounded-[6px] transition-all duration-150"
              style={{ background: '#6366F1', color: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
              Get started free →
            </button>
          </SignUpButton>
          <a href="#how-it-works"
            className="w-full sm:w-auto text-sm font-semibold px-7 py-3 rounded-[6px] transition-all duration-150 text-center"
            style={{ border: '1px solid #222222', color: '#A3A3A3' }}>
            See how it works
          </a>
        </div>

        <p className="relative text-xs mt-6" style={{ color: '#525252' }}>
          No credit card required · Free forever for students
        </p>

        {/* Dashboard mockup */}
        <div className="relative mt-20 w-full max-w-4xl mx-auto rounded-[10px] overflow-hidden"
          style={{ border: '1px solid #222222', background: '#111111', boxShadow: '0 1px 3px rgba(0,0,0,0.4), 0 40px 80px rgba(0,0,0,0.6)' }}>
          {/* Mockup title bar */}
          <div className="flex items-center gap-1.5 px-4 py-3" style={{ borderBottom: '1px solid #222222' }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#EF4444' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F59E0B' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#22C55E' }} />
            <div className="flex-1 mx-4 h-5 rounded-md flex items-center px-3"
              style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <span className="text-[10px]" style={{ color: '#525252' }}>app.placed.co/dashboard</span>
            </div>
          </div>
          {/* Mockup body */}
          <div className="flex h-56">
            {/* Sidebar strip */}
            <div className="w-32 flex flex-col gap-1 p-3" style={{ borderRight: '1px solid #222222' }}>
              <div className="h-5 w-16 rounded mb-3" style={{ background: '#1e1e1e' }} />
              {['Dashboard', 'Find', 'Applications', 'Cover Letter', 'Settings'].map((item, i) => (
                <div key={item} className="h-6 rounded-md flex items-center px-2"
                  style={{ background: i === 0 ? 'rgba(99,102,241,0.15)' : 'transparent' }}>
                  <div className="w-3 h-3 rounded-sm mr-2" style={{ background: i === 0 ? '#6366F1' : '#2a2a2a' }} />
                  <div className="h-2 rounded" style={{ width: `${40 + i * 5}%`, background: i === 0 ? '#6366F1' : '#2a2a2a' }} />
                </div>
              ))}
            </div>
            {/* Main area */}
            <div className="flex-1 p-4">
              <div className="h-4 w-40 rounded mb-4" style={{ background: '#1e1e1e' }} />
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[['12', '#6366F1'], ['3', '#8B5CF6'], ['2', '#22C55E']].map(([num, color], i) => (
                  <div key={i} className="rounded-[10px] p-3" style={{ background: '#161616', border: '1px solid #222222' }}>
                    <div className="text-lg font-bold mb-1" style={{ color }}>{num}</div>
                    <div className="h-2 rounded w-16" style={{ background: '#222222' }} />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {['Wishlist', 'Applied', 'OA', 'Interview', 'Offer'].map((col, i) => {
                  const colors = ['#525252', '#6366F1', '#F59E0B', '#8B5CF6', '#22C55E']
                  return (
                    <div key={col} className="rounded-[8px] p-2" style={{ background: '#161616', border: '1px solid #222222' }}>
                      <div className="flex items-center gap-1 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors[i] }} />
                        <div className="h-1.5 rounded w-10" style={{ background: '#2a2a2a' }} />
                      </div>
                      {i < 3 && <div className="h-8 rounded" style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }} />}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Differentiator ── */}
      <section style={{ borderTop: '1px solid #222222' }} className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 tracking-tight" style={{ color: '#F5F5F5', letterSpacing: '-0.03em' }}>
            More than a spreadsheet.
          </h2>
          <p className="text-center text-base max-w-lg mx-auto mb-16" style={{ color: '#525252' }}>
            Placed handles every step of your internship search — from discovery to offer.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Find',
                desc: 'Browse 1,000+ vetted listings across finance, tech, law, and consulting — curated for students, no noise.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                ),
                color: '#6366F1',
              },
              {
                step: '02',
                title: 'Apply',
                desc: 'One-click tracked applications that auto-log to your Kanban board. Know exactly where you\'ve applied and when.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                ),
                color: '#8B5CF6',
              },
              {
                step: '03',
                title: 'Land it',
                desc: 'AI cover letters, mock interviews, and CV analysis to give you a real edge at every stage of the process.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                ),
                color: '#22C55E',
              },
            ].map((col) => (
              <div key={col.title} className="rounded-[12px] p-7 flex flex-col gap-5"
                style={{ background: '#111111', border: '1px solid #222222', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                <div>
                  <span className="text-xs font-mono" style={{ color: col.color }}>{col.step}</span>
                  <div className="flex items-center gap-3 mt-3 mb-3">
                    <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                      style={{ background: `${col.color}18` }}>
                      <svg className="w-5 h-5" fill="none" stroke={col.color} strokeWidth={1.75} viewBox="0 0 24 24">
                        {col.icon}
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight" style={{ color: '#F5F5F5', letterSpacing: '-0.02em' }}>{col.title}</h3>
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#525252' }}>{col.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ borderTop: '1px solid #222222' }} className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#6366F1' }}>
            Everything you need
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 tracking-tight" style={{ color: '#F5F5F5', letterSpacing: '-0.02em' }}>
            Stop using spreadsheets.
          </h2>
          <p className="text-center max-w-lg mx-auto mb-16 text-base" style={{ color: '#A3A3A3' }}>
            Placed gives you a purpose-built toolkit to manage your entire internship search in one place.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Smart Matching',
                desc: 'Get personalised internship recommendations based on your degree, sectors, and target locations.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                ),
              },
              {
                title: 'AI Cover Letters',
                desc: 'Generate polished, tailored cover letters in seconds — no blank-page dread ever again.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                ),
              },
              {
                title: 'Application Tracker',
                desc: 'Drag-and-drop Kanban board through every stage. Notes, timelines, and status history built in.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                ),
              },
              {
                title: 'Deadline Alerts',
                desc: 'Never miss a closing date. Get email reminders 3 days before any application deadline.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                ),
              },
              {
                title: 'Interview Prep',
                desc: 'Practice common questions, get instant AI feedback, and walk into every interview ready.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                ),
              },
              {
                title: 'Community',
                desc: 'See how other students at your university are getting on and share tips from the trenches.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                ),
              },
            ].map((f) => (
              <div key={f.title} className="group rounded-[10px] p-6 transition-all duration-150 cursor-default"
                style={{ background: '#111111', border: '1px solid #222222', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4 transition-all duration-150"
                  style={{ background: 'rgba(99,102,241,0.15)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="#6366F1" strokeWidth={1.75} viewBox="0 0 24 24">
                    {f.icon}
                  </svg>
                </div>
                <h3 className="font-semibold text-sm mb-2" style={{ color: '#F5F5F5' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#525252' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" style={{ borderTop: '1px solid #222222' }} className="px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#6366F1' }}>
            How it works
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-14 tracking-tight" style={{ color: '#F5F5F5', letterSpacing: '-0.02em' }}>
            Up and running in minutes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              { step: '01', title: 'Create your profile', desc: 'Tell us your sectors, locations, and degree so we can personalise your feed.' },
              { step: '02', title: 'Find and save roles', desc: 'Browse live listings from Adzuna and your curated feed. Save anything that catches your eye.' },
              { step: '03', title: 'Track your progress', desc: 'Move applications through your Kanban board. Get alerts 3 days before any deadline.' },
            ].map((item) => (
              <div key={item.step} className="text-left">
                <span className="text-xs font-mono mb-3 block" style={{ color: '#6366F1' }}>{item.step}</span>
                <h3 className="font-semibold text-base mb-2" style={{ color: '#F5F5F5' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#525252' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ borderTop: '1px solid #222222' }} className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold uppercase tracking-widest mb-12" style={{ color: '#525252' }}>
            Students love Placed
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                quote: "Finally a tool that actually gets how chaotic internship season is. The Kanban board alone saved my sanity.",
                name: 'Priya Sharma',
                uni: 'LSE, Finance',
              },
              {
                quote: "The AI cover letters are shockingly good. I used to spend hours on each one — now it takes five minutes.",
                name: 'James Whitfield',
                uni: 'Durham, Economics',
              },
              {
                quote: "I had 22 applications on the go. Placed was the only way I kept track of them all without losing my mind.",
                name: 'Amara Osei',
                uni: 'UCL, Computer Science',
              },
            ].map((t) => (
              <div key={t.name} className="rounded-[10px] p-6 flex flex-col gap-4"
                style={{ background: '#111111', border: '1px solid #222222', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                <p className="text-sm leading-relaxed" style={{ color: '#A3A3A3' }}>&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-auto">
                  <p className="text-sm font-semibold" style={{ color: '#F5F5F5' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: '#525252' }}>{t.uni}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ borderTop: '1px solid #222222' }} className="px-6 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative rounded-[10px] px-8 py-16 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.1) 100%)', border: '1px solid rgba(99,102,241,0.3)' }}>
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-30"
                style={{ background: 'radial-gradient(circle, #6366F1 0%, transparent 70%)' }} />
            </div>
            <h2 className="relative text-3xl sm:text-4xl font-bold mb-4 tracking-tight" style={{ color: '#F5F5F5', letterSpacing: '-0.02em' }}>
              Ready to get placed?
            </h2>
            <p className="relative text-lg mb-10" style={{ color: '#A3A3A3' }}>
              Join students already using Placed to stay organised and land the roles they want.
            </p>
            <SignUpButton>
              <button className="relative text-sm font-semibold px-8 py-3.5 rounded-[6px] transition-all duration-150"
                style={{ background: '#6366F1', color: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                Start for free — no card needed →
              </button>
            </SignUpButton>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-6 flex items-center justify-between text-xs"
        style={{ borderTop: '1px solid #222222', color: '#525252' }}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: '#6366F1' }}>
            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
          </div>
          <span>Placed</span>
        </div>
        <span>© {new Date().getFullYear()} Placed. Built for students.</span>
      </footer>
    </div>
  )
}
