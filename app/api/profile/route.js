import { auth } from '@clerk/nextjs/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getProfile } from '@/lib/queries'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const profile = await getProfile(userId)
  return Response.json({ profile })
}

export async function POST(request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body
    try {
      body = await request.json()
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { degree_subject, university, graduation_year, sectors, locations, bio } = body

    const payload = {
      user_id: userId,
      degree_subject: degree_subject || null,
      university: university || null,
      graduation_year: graduation_year ? parseInt(graduation_year, 10) : null,
      sectors: Array.isArray(sectors) ? sectors : [],
      locations: Array.isArray(locations) ? locations : [],
      bio: bio || null,
      onboarding_complete: true,
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message, hint: error.hint ?? null }, { status: 500 })
    }

    return Response.json({ ok: true, profile: data })
  } catch (err) {
    return Response.json({ error: err.message ?? 'Unexpected server error' }, { status: 500 })
  }
}
