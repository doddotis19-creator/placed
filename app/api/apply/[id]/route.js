import { NextResponse } from 'next/server'
import { MOCK_INTERNSHIPS } from '@/lib/mock-data'

// Tracked apply redirect — logs happen client-side (localStorage), this just does the server redirect.
// Replace MOCK_INTERNSHIPS lookup with a real DB query when Supabase is re-enabled.
export async function GET(request, { params }) {
  const { id } = await params
  const internship = MOCK_INTERNSHIPS.find(i => i.id === id)

  if (!internship?.link) {
    return NextResponse.redirect(new URL('/find-internships', request.url))
  }

  return NextResponse.redirect(internship.link)
}
