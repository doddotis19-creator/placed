// Guard: build fails if this file is ever imported from a client component.
// ADZUNA_APP_ID and ADZUNA_APP_KEY must never reach the browser bundle.
import 'server-only'

const CATEGORY_TO_SECTOR = {
  'IT Jobs': 'Technology',
  'Accounting & Finance Jobs': 'Finance',
  'Consultancy Jobs': 'Consulting',
  'Legal Jobs': 'Law',
  'PR, Advertising & Marketing Jobs': 'Marketing',
  'Engineering Jobs': 'Engineering',
  'Property Jobs': 'Property',
}

// Student-relevant title keywords — Adzuna returns general jobs, so we keep only
// the ones that read like internships/early-careers roles.
const RELEVANT_TITLE_TERMS = [
  'intern',
  'internship',
  'graduate',
  'placement',
  'spring week',
  'summer analyst',
]

function mapSalary(min, max) {
  if (!min || !max) return null
  const fmt = (n) => `£${Math.round(n).toLocaleString('en-GB')}`
  return `${fmt(min)} - ${fmt(max)}`
}

/**
 * Fetch internship listings from Adzuna.
 * @param {{ what?: string, where?: string, category?: string }} opts
 *   Optional frontend filters passed straight through to Adzuna.
 * @returns {Promise<Array>} mapped internship objects (empty array on failure).
 */
export async function fetchAdzunaInternships({ what, where, category } = {}) {
  const appId = process.env.ADZUNA_APP_ID
  const appKey = process.env.ADZUNA_APP_KEY

  if (!appId || !appKey) return []

  try {
    const params = new URLSearchParams({
      app_id: appId,
      app_key: appKey,
      results_per_page: '50',
      what: what || 'internship',
      'content-type': 'application/json',
    })
    if (where) params.set('where', where)
    if (category) params.set('category', category)

    const res = await fetch(
      `https://api.adzuna.com/v1/api/jobs/gb/search/1?${params}`,
      { next: { revalidate: 3600 } }
    )

    if (!res.ok) {
      console.error('[Adzuna] API error', res.status)
      return []
    }

    const data = await res.json()

    const mapped = (data.results ?? []).map((job) => ({
      id: `adzuna-${job.id}`,
      role: job.title,
      company: job.company?.display_name ?? 'Unknown Company',
      location: job.location?.display_name ?? null,
      salary: mapSalary(job.salary_min, job.salary_max),
      // Adzuna has no deadline — the card shows "Rolling" when this is null.
      deadline: null,
      // redirect_url is Adzuna's tracked, direct application link.
      link: job.redirect_url ?? null,
      sector: CATEGORY_TO_SECTOR[job.category?.label] ?? 'Other',
      description: job.description ?? null,
      source: 'adzuna',
    }))

    // Prioritise student-relevant roles by title keyword.
    return mapped.filter((job) => {
      const title = (job.role ?? '').toLowerCase()
      return RELEVANT_TITLE_TERMS.some((term) => title.includes(term))
    })
  } catch (err) {
    console.error('[Adzuna] Fetch failed:', err)
    return []
  }
}
