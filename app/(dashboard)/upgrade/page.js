'use client'

import { useState } from 'react'
import { Zap, Check, X } from 'lucide-react'

const FREE_FEATURES = [
  'Browse all internship listings',
  'Track up to 20 applications',
  '3 AI cover letters per month',
  'Deadline email alerts',
  'Excel export',
  'Community chat rooms',
]

const PRO_FEATURES = [
  'Unlimited application tracking',
  'Unlimited AI cover letters',
  'AI CV Roaster',
  'AI Mock Interviewer',
  'AI Rejection Analyser',
  'LinkedIn outreach generator',
  'Priority deadline alerts',
  'Early access to new features',
]

export default function UpgradePage() {
  const [toast, setToast] = useState(false)
  const [billing, setBilling] = useState('monthly')

  function handleUpgrade() {
    setToast(true)
    setTimeout(() => setToast(false), 4000)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: '#F5F5F5', letterSpacing: '-0.02em' }}>
          Upgrade to Pro
        </h1>
        <p className="text-sm" style={{ color: '#525252' }}>
          Unlock the full Placed toolkit for your internship search.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex justify-center mb-10">
        <div className="flex items-center gap-1 rounded-[8px] p-1" style={{ background: '#161616', border: '1px solid #222222' }}>
          <button
            onClick={() => setBilling('monthly')}
            className="px-4 py-1.5 text-xs font-semibold rounded-[6px] transition-all duration-150"
            style={{
              background: billing === 'monthly' ? '#222222' : 'transparent',
              color: billing === 'monthly' ? '#F5F5F5' : '#525252',
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('annual')}
            className="px-4 py-1.5 text-xs font-semibold rounded-[6px] transition-all duration-150 flex items-center gap-2"
            style={{
              background: billing === 'annual' ? '#222222' : 'transparent',
              color: billing === 'annual' ? '#F5F5F5' : '#525252',
            }}
          >
            Annual
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
              style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E' }}>
              Save 49%
            </span>
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">

        {/* Free card */}
        <div className="rounded-[12px] p-6 flex flex-col"
          style={{ background: '#111111', border: '1px solid #222222', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#525252' }}>Free</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight" style={{ color: '#F5F5F5' }}>£0</span>
              <span className="text-sm" style={{ color: '#525252' }}>/month</span>
            </div>
            <p className="text-xs mt-1.5" style={{ color: '#525252' }}>Forever free for students</p>
          </div>

          <ul className="flex flex-col gap-3 mb-8 flex-1">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: '#A3A3A3' }}>
                <Check size={14} style={{ color: '#525252', flexShrink: 0 }} />
                {f}
              </li>
            ))}
          </ul>

          <div className="w-full py-2.5 text-sm font-semibold rounded-[8px] text-center"
            style={{ background: '#161616', border: '1px solid #222222', color: '#525252' }}>
            Current plan
          </div>
        </div>

        {/* Pro card */}
        <div className="rounded-[12px] p-6 flex flex-col relative overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #111111 0%, rgba(99,102,241,0.06) 100%)',
            border: '1.5px solid rgba(99,102,241,0.5)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.1), 0 8px 32px rgba(99,102,241,0.08)',
          }}>

          {/* Most Popular badge */}
          <div className="absolute top-4 right-4">
            <span className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"
              style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.35)' }}>
              <Zap size={9} />
              Most Popular
            </span>
          </div>

          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6366F1' }}>Pro</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight" style={{ color: '#F5F5F5' }}>
                {billing === 'monthly' ? '£8' : '£4.08'}
              </span>
              <span className="text-sm" style={{ color: '#525252' }}>/month</span>
            </div>
            <p className="text-xs mt-1.5" style={{ color: '#525252' }}>
              {billing === 'annual' ? 'Billed as £49/year' : 'Cancel anytime'}
            </p>
          </div>

          <ul className="flex flex-col gap-3 mb-8 flex-1">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: '#A3A3A3' }}>
                <Check size={14} style={{ color: '#6366F1', flexShrink: 0 }} />
                {f}
              </li>
            ))}
          </ul>

          <button
            onClick={handleUpgrade}
            className="w-full py-2.5 text-sm font-semibold rounded-[8px] transition-all duration-150 flex items-center justify-center gap-2"
            style={{ background: '#6366F1', color: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
          >
            <Zap size={14} />
            Upgrade to Pro
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[200] flex items-start gap-3 px-4 py-3.5 rounded-[10px]"
          style={{ background: '#1a1a1a', border: '1px solid #2d2d2d', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', maxWidth: '300px' }}>
          <Zap size={15} className="shrink-0 mt-0.5" style={{ color: '#6366F1' }} />
          <p className="text-sm flex-1 leading-snug" style={{ color: '#F5F5F5' }}>
            Pro payments coming soon — stay tuned!
          </p>
          <button onClick={() => setToast(false)} className="shrink-0 mt-0.5" style={{ color: '#525252' }}>
            <X size={13} />
          </button>
        </div>
      )}
    </div>
  )
}
