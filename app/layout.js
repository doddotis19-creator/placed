import { ClerkProvider } from '@clerk/nextjs'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata = {
  title: 'Placed — Internship Tracker',
  description: 'Track your internship applications, find opportunities, and land your dream role.',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geist.variable} h-full`}>
        <body className="h-full antialiased">{children}</body>
      </html>
    </ClerkProvider>
  )
}
