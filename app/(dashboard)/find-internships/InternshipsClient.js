'use client'

import { useState } from 'react'

const SECTORS = ['All', 'Finance', 'Tech', 'Consulting', 'Law', 'Property']

function daysRemaining(deadline) {
  if (!deadline) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(deadline)
  d.setHours(0, 0, 0, 0)
  return Math.ceil((d - today) / (1000 * 60 * 60 * 24))
}

function DeadlineBadge({ deadline }) {
  const days = daysRemaining(deadline)
  if (days === null) return null

  let label, cls
  if (days < 0) {
    label = 'Closed'
    cls = 'bg-slate-100 text-slate-500'
  } else if (days === 0) {
    label = 'Due today'
    cls = 'bg-red-50 text-red-600'
  } else if (days <= 7) {
    label = `${days}d left`
    cls = 'bg-red-50 text-red-600'
  } else if (days <= 14) {
    label = `${days}d left`
    cls = 'bg-amber-50 text-amber-600'
  } else {
    label = `${days}d left`
    cls = 'bg-green-50 text-green-700'
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls}`}>
      {label}
    </span>
  )
}

function InternshipCard({ internship }) {
  const { company, role, sector, location, deadline, salary, link } = internship

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:border-indigo-200 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-slate-900 text-sm leading-snug truncate">{role}</p>
          <p className="text-slate-500 text-sm mt-0.5 truncate">{company}</p>
        </div>
        {sector && (
          <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
            {sector}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1.5">
        {location && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </div>
        )}
        {salary && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {salary}
          </div>
        )}
        {deadline && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>
              {new Date(deadline).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            <DeadlineBadge deadline={deadline} />
          </div>
        )}
      </div>

      {/* Apply button */}
      <div className="mt-auto pt-1">
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            Apply →
          </a>
        ) : (
          <button
            disabled
            className="block w-full text-center bg-slate-100 text-slate-400 text-xs font-semibold px-4 py-2 rounded-xl cursor-not-allowed"
          >
            No link available
          </button>
        )}
      </div>
    </div>
  )
}

export default function InternshipsClient({ internships }) {
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('All')

  const filtered = internships.filter((i) => {
    const matchesSector = sector === 'All' || i.sector === sector
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      i.company?.toLowerCase().includes(q) ||
      i.role?.toLowerCase().includes(q) ||
      i.location?.toLowerCase().includes(q)
    return matchesSector && matchesSearch
  })

  return (
    <>
      {/* Search bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
        <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
          <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roles, companies, or keywords…"
            className="flex-1 outline-none text-sm text-slate-700 placeholder-slate-400 bg-transparent"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Sector filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {SECTORS.map((s) => (
          <button
            key={s}
            onClick={() => setSector(s)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              sector === s
                ? 'bg-slate-900 text-white'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 mb-4">
        {filtered.length} {filtered.length === 1 ? 'listing' : 'listings'}
        {sector !== 'All' ? ` in ${sector}` : ''}
        {search ? ` matching "${search}"` : ''}
      </p>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">No listings found</h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            Try adjusting your search or sector filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((internship) => (
            <InternshipCard key={internship.id} internship={internship} />
          ))}
        </div>
      )}
    </>
  )
}
