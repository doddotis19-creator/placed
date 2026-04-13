import { createClient } from '@supabase/supabase-js'

// Lazy-initialize the client so module import doesn't fail at build time
// when env vars aren't yet evaluated (e.g. during static page collection).
let _client = null

function getClient() {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      const missing = [!url && 'NEXT_PUBLIC_SUPABASE_URL', !key && 'NEXT_PUBLIC_SUPABASE_ANON_KEY']
        .filter(Boolean)
        .join(', ')
      console.error(`[Supabase] Missing env vars: ${missing}`)
      throw new Error(`Supabase not configured — missing: ${missing}`)
    }

    try {
      _client = createClient(url, key)
    } catch (err) {
      console.error('[Supabase] createClient failed:', err.message)
      console.error('[Supabase] URL value:', url.startsWith('https') ? url : `"${url}" (not a https URL — check .env.local)`)
      throw err
    }
  }
  return _client
}

// Proxy preserves the existing `supabase.from(...).select(...)` call pattern
// throughout the codebase without any other changes required.
export const supabase = new Proxy(
  {},
  {
    get(_, prop) {
      const client = getClient()
      const value = Reflect.get(client, prop)
      return typeof value === 'function' ? value.bind(client) : value
    },
  }
)
