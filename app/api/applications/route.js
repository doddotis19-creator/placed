import { auth } from '@clerk/nextjs/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getApplications } from '@/lib/queries'

// Adzuna IDs look like "adzuna-12345" and aren't real internships rows, so we
// only set internship_id when it's a genuine UUID foreign key.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const applications = await getApplications(userId)
  return Response.json({ applications })
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

    const { company, role, sector, location, deadline, salary, link, status, internship_id } = body

    if (!company || !role) {
      return Response.json({ error: 'company and role are required' }, { status: 400 })
    }

    const payload = {
      user_id: userId,
      internship_id: internship_id && UUID_RE.test(internship_id) ? internship_id : null,
      company,
      role,
      sector: sector || null,
      location: location || null,
      deadline: deadline || null,
      salary: salary || null,
      link: link || null,
      status: status || 'Wishlist',
      notes: '',
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('user_applications')
      .insert(payload)
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ ok: true, application: data })
  } catch (err) {
    return Response.json({ error: err.message ?? 'Unexpected server error' }, { status: 500 })
  }
}
