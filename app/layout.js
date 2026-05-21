import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'Placed — Internship Tracker',
  description: 'Track your internship applications, find opportunities, and land your dream role.',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} h-full`}>
        <body className="h-full antialiased">{children}</body>
      </html>
    </ClerkProvider>
  )
}
