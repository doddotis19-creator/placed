// Adzuna/Supabase calls temporarily disabled — using mock data in lib/mock-data.js.
// To re-enable, uncomment the implementation below.

import { NextResponse } from 'next/server'

export const revalidate = 3600

export async function GET() {
  return NextResponse.json({ internships: [] })
}

/*
import { fetchAdzunaInternships } from '@/lib/adzuna'

export async function GET() {
  const internships = await fetchAdzunaInternships()
  return NextResponse.json({ internships })
}
*/
