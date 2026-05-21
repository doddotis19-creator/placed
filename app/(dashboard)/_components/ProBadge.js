'use client'

import { useState } from 'react'
import { Zap, X } from 'lucide-react'
import Link from 'next/link'

export default function ProBadge() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[10px] font-semibold transition-all duration-150"
        style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.35)' }}
      >
        <Zap size={9} />
        Pro
      </button>

      {showModal && (
        <>
          <div
            className="fixed inset-0 z-[150]"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
            onClick={() => setShowModal(false)}
          />
          <div
            className="fixed z-[160] rounded-[12px] p-6 flex flex-col gap-5"
            style={{
              background: '#111111',
              border: '1px solid #2a2a2a',
              boxShadow: '0 16px 60px rgba(0,0,0,0.7)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '340px',
              maxWidth: 'calc(100vw - 32px)',
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(99,102,241,0.15)' }}
                >
                  <Zap size={18} style={{ color: '#6366F1' }} />
                </div>
                <div>
                  <p className="font-semibold text-[15px]" style={{ color: '#F5F5F5' }}>Pro feature</p>
                  <p className="text-xs mt-0.5" style={{ color: '#525252' }}>Upgrade to unlock this</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} style={{ color: '#525252' }}>
                <X size={16} />
              </button>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: '#A3A3A3' }}>
              This is a Pro feature. Upgrade for{' '}
              <strong style={{ color: '#F5F5F5' }}>£8/month</strong> to unlock unlimited AI tools,
              mock interviews, CV analysis, and more.
            </p>

            <div className="flex gap-3">
              <Link
                href="/upgrade"
                onClick={() => setShowModal(false)}
                className="flex-1 text-center py-2.5 text-sm font-semibold rounded-[8px] transition-all duration-150"
                style={{ background: '#6366F1', color: '#fff' }}
              >
                See Pro plans
              </Link>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 text-sm font-medium rounded-[8px] transition-all duration-150"
                style={{ background: '#161616', border: '1px solid #222222', color: '#A3A3A3' }}
              >
                Maybe later
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
