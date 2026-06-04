// Browser-safe Supabase client. Uses the public (anon/publishable) key only.
// NEVER import lib/supabase-server.js or use the service role key here.
import { createClient } from '@supabase/supabase-js'

let _client = null

/**
 * Returns a Supabase client authenticated with the public anon key.
 * Safe to call from 'use client' components. The anon key is restricted by
 * Row Level Security, so it can never read or write rows it isn't allowed to.
 */
export function getSupabaseClient() {
  if (_client) return _client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    const missing = [
      !url && 'NEXT_PUBLIC_SUPABASE_URL',
      !anonKey && 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    ]
      .filter(Boolean)
      .join(', ')
    throw new Error(`[supabase-client] Missing env vars: ${missing}`)
  }

  _client = createClient(url, anonKey, {
    auth: { persistSession: false },
  })
  return _client
}
