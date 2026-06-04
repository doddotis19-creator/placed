// Server-only data access helpers. All reads go through the service-role client
// and are always scoped to a Clerk user_id, so ownership is enforced in app code.
import 'server-only'

import { createServerSupabaseClient } from './supabase-server'
import { fetchAdzunaInternships } from './adzuna'

/** Fetch a single user's profile by their Clerk user ID, or null if none exists. */
export async function getProfile(userId) {
  if (!userId) return null
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('[queries.getProfile]', error.message)
    return null
  }
  return data ?? null
}

/** Fetch all of a user's tracked applications, oldest first. */
export async function getApplications(userId) {
  if (!userId) return []
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('user_applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[queries.getApplications]', error.message)
    return []
  }
  return data ?? []
}

/**
 * Merge live Adzuna listings with manually-added Supabase internships.
 * Deduplicates by company name + role title (case-insensitive). Manually-added
 * Supabase rows take precedence over Adzuna duplicates. If Adzuna fails or
 * returns nothing, we fall back to Supabase listings only and flag it.
 *
 * @param {{ what?: string, where?: string, category?: string }} opts
 * @returns {Promise<{ internships: Array, liveUnavailable: boolean }>}
 */
export async function getMergedInternships(opts = {}) {
  const supabase = createServerSupabaseClient()

  const [adzuna, dbResult] = await Promise.all([
    fetchAdzunaInternships(opts),
    supabase.from('internships').select('*').order('created_at', { ascending: false }),
  ])

  if (dbResult.error) {
    console.error('[queries.getMergedInternships]', dbResult.error.message)
  }

  const dbInternships = (dbResult.data ?? []).map((i) => ({ ...i, source: 'supabase' }))
  const liveUnavailable = adzuna.length === 0

  const seen = new Set()
  const merged = []
  // DB (manual) first so it wins on duplicate keys, then Adzuna fills the rest.
  for (const list of [dbInternships, adzuna]) {
    for (const item of list) {
      const key = `${(item.company ?? '').toLowerCase().trim()}|${(item.role ?? '').toLowerCase().trim()}`
      if (seen.has(key)) continue
      seen.add(key)
      merged.push(item)
    }
  }
  return { internships: merged, liveUnavailable }
}
