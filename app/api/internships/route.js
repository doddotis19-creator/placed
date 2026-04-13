import { NextResponse } from 'next/server'
import { fetchAdzunaInternships } from '@/lib/adzuna'

// Cache the route response for 1 hour
export const revalidate = 3600

export async function GET() {
  const internships = await fetchAdzunaInternships()
  return NextResponse.json({ internships })
}
