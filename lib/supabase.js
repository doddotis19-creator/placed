import { createClient } from '@supabase/supabase-js'

// Lazy-initialize the client so module import doesn't fail at build time
// when env vars aren't yet evaluated (e.g. during static page collection).
let _client = null

function getClient() {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
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
