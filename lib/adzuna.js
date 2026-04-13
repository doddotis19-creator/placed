const CATEGORY_TO_SECTOR = {
  'IT Jobs': 'Tech',
  'Engineering Jobs': 'Engineering',
  'Accounting & Finance Jobs': 'Finance',
  'Legal Jobs': 'Law',
  'Marketing Jobs': 'Marketing',
  'Sales Jobs': 'Marketing',
  'Manufacturing Jobs': 'Engineering',
  'Property Jobs': 'Property',
  'Consultancy Jobs': 'Consulting',
  'Graduate Jobs': null,
}

function mapSalary(min, max) {
  if (!min && !max) return null
  const fmt = (n) => n >= 1000 ? `£${Math.round(n / 1000)}k` : `£${n}`
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `From ${fmt(min)}`
  return `Up to ${fmt(max)}`
}

export async function fetchAdzunaInternships() {
  const appId = process.env.ADZUNA_APP_ID
  const appKey = process.env.ADZUNA_APP_KEY

  if (!appId || !appKey) return []

  try {
    const params = new URLSearchParams({
      app_id: appId,
      app_key: appKey,
      what: 'internship',
      results_per_page: '50',
      'content-type': 'application/json',
    })

    const res = await fetch(
      `https://api.adzuna.com/v1/api/jobs/gb/search/1?${params}`,
      { next: { revalidate: 3600 } }
    )

    if (!res.ok) {
      console.error('[Adzuna] API error', res.status)
      return []
    }

    const data = await res.json()

    return (data.results ?? []).map((job) => ({
      id: `adzuna-${job.id}`,
      company: job.company?.display_name ?? 'Unknown Company',
      role: job.title,
      location: job.location?.display_name ?? null,
      sector: CATEGORY_TO_SECTOR[job.category?.label] ?? null,
      deadline: null,
      salary: mapSalary(job.salary_min, job.salary_max),
      link: job.redirect_url ?? null,
      source: 'adzuna',
    }))
  } catch (err) {
    console.error('[Adzuna] Fetch failed:', err)
    return []
  }
}
