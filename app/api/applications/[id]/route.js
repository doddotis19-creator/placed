import { auth } from '@clerk/nextjs/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const VALID_STATUSES = ['Wishlist', 'Applied', 'OA/Test', 'Interview', 'AC', 'Offer', 'Rejected']

export async function PATCH(request, { params }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    let body
    try {
      body = await request.json()
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const updates = {}
    if (typeof body.status === 'string') {
      if (!VALID_STATUSES.includes(body.status)) {
        return Response.json({ error: 'Invalid status' }, { status: 400 })
      }
      updates.status = body.status
    }
    if (typeof body.notes === 'string') {
      updates.notes = body.notes
    }

    if (Object.keys(updates).length === 0) {
      return Response.json({ error: 'Nothing to update' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    // Scope by user_id so a user can only ever mutate their own rows.
    const { data, error } = await supabase
      .from('user_applications')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
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

export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const supabase = createServerSupabaseClient()
    const { error } = await supabase
      .from('user_applications')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ ok: true })
  } catch (err) {
    return Response.json({ error: err.message ?? 'Unexpected server error' }, { status: 500 })
  }
}
