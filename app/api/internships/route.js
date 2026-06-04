import { NextResponse } from 'next/server'
import { getMergedInternships } from '@/lib/queries'

export const revalidate = 3600

export async function GET(request) {
  const { searchParams } = new URL(request.url)

  const { internships, liveUnavailable } = await getMergedInternships({
    what: searchParams.get('what') || undefined,
    where: searchParams.get('where') || undefined,
    category: searchParams.get('category') || undefined,
  })

  return NextResponse.json({ internships, liveUnavailable })
}
