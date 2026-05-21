'use client'

import { useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div
      className="fixed bottom-6 right-6 z-[200] flex items-start gap-3 px-4 py-3.5 rounded-[10px]"
      style={{
        background: '#1a1a1a',
        border: '1px solid #2d2d2d',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        maxWidth: '320px',
      }}
    >
      <CheckCircle2 size={15} className="shrink-0 mt-0.5" style={{ color: '#22C55E' }} />
      <p className="text-sm flex-1 leading-snug" style={{ color: '#F5F5F5' }}>{message}</p>
      <button onClick={onClose} className="shrink-0 mt-0.5 transition-colors" style={{ color: '#525252' }}>
        <X size={13} />
      </button>
    </div>
  )
}
