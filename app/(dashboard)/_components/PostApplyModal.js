'use client'

import { Target } from 'lucide-react'

export default function PostApplyModal({ company, onApplied, onWishlist, onDismiss }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[150]"
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
        onClick={onDismiss}
      />

      {/* Modal */}
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
        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
            style={{ background: 'rgba(99,102,241,0.15)' }}
          >
            <Target size={18} style={{ color: '#6366F1' }} />
          </div>
          <div>
            <p className="font-semibold text-[15px] leading-snug" style={{ color: '#F5F5F5' }}>
              Applied to {company}?
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#525252' }}>
              Keep your tracker up to date.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onApplied}
            className="w-full py-2.5 text-sm font-semibold rounded-[8px] transition-all duration-150"
            style={{ background: '#6366F1', color: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
          >
            Yes, log it as Applied
          </button>
          <button
            onClick={onWishlist}
            className="w-full py-2.5 text-sm font-medium rounded-[8px] transition-all duration-150"
            style={{ background: '#161616', border: '1px solid #222222', color: '#A3A3A3' }}
          >
            Still deciding — add to Wishlist
          </button>
          <button
            onClick={onDismiss}
            className="w-full py-2 text-sm font-medium rounded-[8px] transition-all duration-150"
            style={{ color: '#525252' }}
          >
            Not applying
          </button>
        </div>
      </div>
    </>
  )
}
