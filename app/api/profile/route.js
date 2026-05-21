import { auth } from '@clerk/nextjs/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request) {
  try {
    // Verify the caller is authenticated
    const { userId } = await auth()
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate body
    let body
    try {
      body = await request.json()
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const {
      degree_subject,
      university,
      graduation_year,
      sectors,
      locations,
      bio,
    } = body

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

    console.log('[api/profile] Upserting profile for user:', userId)

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'user_id' })
      .select()

    if (error) {
      console.error('[api/profile] Supabase error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      })
      return Response.json(
        { error: error.message, hint: error.hint ?? null },
        { status: 500 }
      )
    }

    console.log('[api/profile] Profile saved:', data?.[0]?.user_id)
    return Response.json({ ok: true, data })
  } catch (err) {
    console.error('[api/profile] Unexpected error:', err)
    return Response.json({ error: err.message ?? 'Unexpected server error' }, { status: 500 })
  }
}
