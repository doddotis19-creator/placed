import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// Tracked apply redirect. Looks up a Supabase internship by id and forwards the
// user to its application link. Adzuna listings are opened directly client-side,
// so this only needs to resolve manually-added internships.
export async function GET(request, { params }) {
  const { id } = await params

  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('internships')
    .select('link')
    .eq('id', id)
    .maybeSingle()

  if (!data?.link) {
    return NextResponse.redirect(new URL('/find-internships', request.url))
  }

  return NextResponse.redirect(data.link)
}
