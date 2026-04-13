'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const TABS = ['All', 'For You', 'Finance', 'Tech', 'Consulting', 'Law', 'Marketing', 'Engineering', 'Property', 'FMCG']

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

function computeMatch(internship, userSectors, userLocations) {
  if (!userSectors.length && !userLocations.length) return null
  let score = 0
  let total = 0

  if (userSectors.length) {
    total += 60
    if (userSectors.includes(internship.sector)) score += 60
  }
  if (userLocations.length) {
    total += 40
    const loc = internship.location?.toLowerCase() ?? ''
    if (userLocations.some((l) => loc.includes(l.toLowerCase()))) score += 40
  }

  return total > 0 ? Math.round((score / total) * 100) : null
}

function MatchBadge({ pct }) {
  if (pct === null) return null
  const cls =
    pct >= 80
      ? 'bg-green-50 text-green-700'
      : pct >= 50
      ? 'bg-amber-50 text-amber-700'
      : 'bg-slate-100 text-slate-500'
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>
      {pct}% match
    </span>
  )
}

function InternshipCard({ internship, userSectors, userLocations, userId, onSaved }) {
  const { id, company, role, sector, location, deadline, salary, link } = internship
  const match = computeMatch(internship, userSectors, userLocations)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    if (saved || saving) return
    setSaving(true)
    await supabase.from('user_applications').insert({
      user_id: userId,
      internship_id: id,
      company,
      role,
      sector: sector ?? null,
      location: location ?? null,
      deadline: deadline ?? null,
      salary: salary ?? null,
      link: link ?? null,
      status: 'Wishlist',
      notes: '',
    })
    setSaving(false)
    setSaved(true)
    onSaved?.()
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:border-indigo-200 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-slate-900 text-sm leading-snug truncate">{role}</p>
          <p className="text-slate-500 text-sm mt-0.5 truncate">{company}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {sector && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
              {sector}
            </span>
          )}
          <MatchBadge pct={match} />
        </div>
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

      {/* Action buttons */}
      <div className="mt-auto pt-1 flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving || saved}
          title={saved ? 'Saved to tracker' : 'Save to Wishlist'}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
            saved
              ? 'bg-green-50 text-green-700 cursor-default'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}
        >
          <svg
            className="w-3.5 h-3.5"
            fill={saved ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          {saved ? 'Saved' : saving ? '…' : 'Save'}
        </button>

        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            Apply →
          </a>
        ) : (
          <button
            disabled
            className="flex-1 text-center bg-slate-100 text-slate-400 text-xs font-semibold px-4 py-2 rounded-xl cursor-not-allowed"
          >
            No link available
          </button>
        )}
      </div>
    </div>
  )
}

export default function InternshipsClient({ internships, userSectors, userLocations, userId }) {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('All')

  const hasProfile = userSectors.length > 0 || userLocations.length > 0

  const filtered = internships
    .filter((i) => {
      if (tab === 'For You') {
        const match = computeMatch(i, userSectors, userLocations)
        return match !== null && match > 0
      }
      return tab === 'All' || i.sector === tab
    })
    .filter((i) => {
      const q = search.toLowerCase()
      return (
        !q ||
        i.company?.toLowerCase().includes(q) ||
        i.role?.toLowerCase().includes(q) ||
        i.location?.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      if (tab === 'For You') {
        const ma = computeMatch(a, userSectors, userLocations) ?? 0
        const mb = computeMatch(b, userSectors, userLocations) ?? 0
        return mb - ma
      }
      return 0
    })

  return (
    <>
      {/* Search */}
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

      {/* Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === t
                ? t === 'For You'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-white'
                : t === 'For You'
                ? 'text-indigo-600 hover:bg-indigo-50'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            {t === 'For You' ? '✦ For You' : t}
          </button>
        ))}
      </div>

      {/* For You — no profile nudge */}
      {tab === 'For You' && !hasProfile && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-5 flex items-start gap-3">
          <svg className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-indigo-700">
            Add your target sectors and preferred locations in <strong>Settings</strong> to unlock personalised matches.
          </p>
        </div>
      )}

      {/* Count */}
      <p className="text-sm text-slate-500 mb-4">
        {filtered.length} {filtered.length === 1 ? 'listing' : 'listings'}
        {tab !== 'All' ? ` in ${tab}` : ''}
        {search ? ` matching "${search}"` : ''}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">No listings found</h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            {tab === 'For You'
              ? 'We couldn't find matches. Try updating your sector preferences in Settings.'
              : 'Try adjusting your search or sector filter.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              userSectors={userSectors}
              userLocations={userLocations}
              userId={userId}
            />
          ))}
        </div>
      )}
    </>
  )
}
