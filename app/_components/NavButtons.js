'use client'

import { useAuth, SignInButton, SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function NavButtons() {
  const { userId } = useAuth()

  if (userId) {
    return (
      <Link
        href="/dashboard"
        className="text-sm font-semibold px-4 py-2 rounded-[6px] transition-all duration-150"
        style={{ background: '#6366F1', color: '#fff' }}
      >
        Go to dashboard →
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <SignInButton>
        <button
          className="text-sm font-medium px-4 py-2 rounded-[6px] transition-all duration-150"
          style={{ color: '#A3A3A3' }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#F5F5F5'
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#A3A3A3'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          Sign in
        </button>
      </SignInButton>
      <SignUpButton>
        <button
          className="text-sm font-semibold px-4 py-2 rounded-[6px] transition-all duration-150"
          style={{ background: '#6366F1', color: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
        >
          Get started free
        </button>
      </SignUpButton>
    </div>
  )
}
