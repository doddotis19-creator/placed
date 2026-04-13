// This file MUST only be imported in server-side code (API routes, Server Components).
// The 'server-only' import causes a build error if this file ever ends up in a
// client component bundle, preventing accidental secret exposure.
import 'server-only'

import { createClient } from '@supabase/supabase-js'

/**
 * Returns a Supabase client authenticated with the service role key.
 * Use this ONLY in:
 *   - app/api/** route handlers
 *   - Server Actions
 *   - Server Components that need to bypass RLS (e.g. cron jobs, admin tasks)
 *
 * Never use this in 'use client' files or pass its return value to client components.
 */
export function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    const missing = [
      !url && 'NEXT_PUBLIC_SUPABASE_URL',
      !serviceKey && 'SUPABASE_SERVICE_ROLE_KEY',
    ]
      .filter(Boolean)
      .join(', ')
    throw new Error(`[supabase-server] Missing env vars: ${missing}`)
  }

  return createClient(url, serviceKey, {
    auth: {
      // Never persist sessions for a service-role client
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
