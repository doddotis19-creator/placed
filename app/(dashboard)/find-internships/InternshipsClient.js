'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Sparkles, CheckCircle2 } from 'lucide-react'
import Toast from '../_components/Toast'
import PostApplyModal from '../_components/PostApplyModal'

const TABS = ['All', 'For You', 'Finance', 'Technology', 'Consulting', 'Law', 'Marketing', 'Engineering']

function daysRemaining(deadline) {
  if (!deadline) return null
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const d = new Date(deadline); d.setHours(0, 0, 0, 0)
  return Math.ceil((d - today) / (1000 * 60 * 60 * 24))
}

function DeadlineBadge({ deadline }) {
  const days = daysRemaining(deadline)
  if (days === null) return null

  let label, bg, color
  if (days < 0) {
    label = 'Closed'; bg = 'rgba(82,82,82,0.15)'; color = '#525252'
  } else if (days === 0) {
    label = 'Due today'; bg = 'rgba(239,68,68,0.12)'; color = '#EF4444'
  } else if (days <= 7) {
    label = `${days}d left`; bg = 'rgba(239,68,68,0.12)'; color = '#EF4444'
  } else if (days <= 14) {
    label = `${days}d left`; bg = 'rgba(245,158,11,0.12)'; color = '#F59E0B'
  } else {
    label = `${days}d left`; bg = 'rgba(34,197,94,0.12)'; color = '#22C55E'
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-semibold"
      style={{ background: bg, color, border: `1px solid ${color}30` }}>
      {label}
    </span>
  )
}

// Smart-matching score, out of 100:
//   sector match 40 · location match 20 · deadline not passed 20
//   salary listed 5 · graduation year appropriate 15
// Adzuna listings have no deadline, so we show a neutral "Rolling" pill.
function RollingBadge() {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-semibold"
      style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
      Rolling
    </span>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-[10px] p-5 flex flex-col gap-4 animate-pulse"
      style={{ background: '#111111', border: '1px solid #222222' }}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-[8px] shrink-0" style={{ background: '#1a1a1a' }} />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-3 rounded w-3/4" style={{ background: '#1a1a1a' }} />
          <div className="h-2.5 rounded w-1/2" style={{ background: '#161616' }} />
        </div>
      </div>
      <div className="flex gap-1.5">
        <div className="h-5 w-16 rounded-full" style={{ background: '#1a1a1a' }} />
        <div className="h-5 w-20 rounded-full" style={{ background: '#161616' }} />
      </div>
      <div className="h-8 rounded-[6px]" style={{ background: '#161616' }} />
    </div>
  )
}

function computeMatch(internship, userSectors, userLocations, userGradYear) {
  const hasProfile = userSectors.length > 0 || userLocations.length > 0 || !!userGradYear
  if (!hasProfile) return null

  let score = 0

  if (userSectors.length && internship.sector && userSectors.includes(internship.sector)) {
    score += 40
  }

  if (userLocations.length && internship.location) {
    const loc = internship.location.toLowerCase()
    if (userLocations.some((l) => loc.includes(l.toLowerCase()))) score += 20
  }

  if (internship.deadline) {
    const d = new Date(internship.deadline); d.setHours(0, 0, 0, 0)
    const today = new Date(); today.setHours(0, 0, 0, 0)
    if (d >= today) score += 20
  }

  if (internship.salary) score += 5

  if (userGradYear) {
    if (internship.deadline) {
      // The opportunity is appropriate if it closes on or before the user graduates.
      if (new Date(internship.deadline).getFullYear() <= Number(userGradYear)) score += 15
    } else {
      score += 15
    }
  }

  return score
}

function MatchBadge({ pct }) {
  if (pct === null) return null
  const color = pct >= 80 ? '#22C55E' : pct >= 50 ? '#F59E0B' : '#525252'
  return (
    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
      {pct}% match
    </span>
  )
}

function CompanyAvatar({ company }) {
  const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#22C55E', '#06B6D4']
  const idx = (company?.charCodeAt(0) ?? 0) % colors.length
  return (
    <div className="w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0 text-sm font-bold text-white"
      style={{ background: colors[idx] }}>
      {company?.[0]?.toUpperCase() ?? '?'}
    </div>
  )
}

// Insert (or upsert) a tracked application row in Supabase via the API route.
// internship_id is only honoured server-side when it's a real UUID.
async function trackApplication(internship, status) {
  try {
    await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        internship_id: internship.source === 'supabase' ? internship.id : null,
        company: internship.company,
        role: internship.role,
        sector: internship.sector ?? null,
        location: internship.location ?? null,
        deadline: internship.deadline ?? null,
        salary: internship.salary ?? null,
        link: internship.link ?? null,
        status,
      }),
    })
  } catch {}
}

function InternshipCard({ internship, userSectors, userLocations, userGradYear, isApplied, onApply }) {
  const { company, role, sector, location, deadline, salary, link, description } = internship
  const match = computeMatch(internship, userSectors, userLocations, userGradYear)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [applied, setApplied] = useState(isApplied)

  async function handleSave() {
    if (saved || saving) return
    setSaving(true)
    await trackApplication(internship, 'Wishlist')
    setSaving(false)
    setSaved(true)
  }

  function handleApply() {
    if (applied) return
    // Optimistic: mark applied, track in the background, then open the listing.
    setApplied(true)
    trackApplication(internship, 'Applied')
    if (link) window.open(link, '_blank', 'noopener,noreferrer')
    onApply(internship)
  }

  return (
    <div className="rounded-[10px] p-5 flex flex-col gap-4 transition-all duration-150"
      style={{ background: '#111111', border: '1px solid #222222', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <CompanyAvatar company={company} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm leading-snug truncate" style={{ color: '#F5F5F5' }}>{role}</p>
          <p className="text-xs truncate mt-0.5" style={{ color: '#A3A3A3' }}>{company}</p>
        </div>
        {match !== null && (
          <div className="shrink-0"><MatchBadge pct={match} /></div>
        )}
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-1.5">
        {sector && (
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
            {sector}
          </span>
        )}
        {location && (
          <span className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full"
            style={{ background: '#161616', color: '#A3A3A3', border: '1px solid #222222' }}>
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {location}
          </span>
        )}
        {salary && (
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full"
            style={{ background: '#161616', color: '#A3A3A3', border: '1px solid #222222' }}>
            {salary}
          </span>
        )}
        {deadline ? <DeadlineBadge deadline={deadline} /> : <RollingBadge />}
      </div>

      {/* Description snippet */}
      {description && (
        <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: '#525252' }}>
          {description}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto items-start">
        {/* Save to Wishlist */}
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className="flex items-center gap-1.5 px-3 py-2 rounded-[6px] text-xs font-semibold transition-all duration-150 shrink-0"
          style={{
            background: saved ? 'rgba(34,197,94,0.12)' : '#161616',
            border: `1px solid ${saved ? 'rgba(34,197,94,0.3)' : '#222222'}`,
            color: saved ? '#22C55E' : '#A3A3A3',
          }}
        >
          {saved ? (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
          )}
          {saved ? 'Saved' : saving ? '...' : 'Save'}
        </button>

        {/* Apply button + label */}
        <div className="flex-1 flex flex-col gap-1">
          {link ? (
            <button
              onClick={handleApply}
              disabled={applied}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-[6px] transition-all duration-150"
              style={applied ? {
                background: 'rgba(34,197,94,0.12)',
                border: '1px solid rgba(34,197,94,0.3)',
                color: '#22C55E',
              } : {
                background: '#6366F1',
                color: '#fff',
              }}
            >
              {applied && <CheckCircle2 size={12} />}
              {applied ? 'Applied' : 'Apply'}
            </button>
          ) : (
            <button
              onClick={() => window.open(
                `https://www.google.com/search?q=${encodeURIComponent(company + ' internship application 2026')}`,
                '_blank',
                'noopener,noreferrer'
              )}
              title="Application link not available — visit company careers page"
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-[6px] transition-all duration-150"
              style={{ background: '#161616', color: '#525252', border: '1px solid #222222' }}
            >
              Apply
            </button>
          )}
          {!applied && (
            <p className="text-center text-[10px] leading-none" style={{ color: '#3d3d3d' }}>
              {link ? 'Direct application link' : 'Application link not available'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function InternshipsClient({ userSectors, userLocations, userGradYear, appliedKeys = [] }) {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('All')
  const [viewMode, setViewMode] = useState('grid')
  const [toast, setToast] = useState(null)
  const [postApplyModal, setPostApplyModal] = useState(null)
  const modalTimerRef = useRef(null)

  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)
  const [liveUnavailable, setLiveUnavailable] = useState(false)

  // Fetch live listings on load and whenever the search term changes (debounced
  // 500ms). The search term is passed to Adzuna as `what`; manually-added
  // Supabase listings are merged server-side.
  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => {
      setLoading(true)
      const params = new URLSearchParams()
      if (search.trim()) params.set('what', search.trim())
      fetch(`/api/internships?${params.toString()}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((data) => {
          setInternships(data.internships ?? [])
          setLiveUnavailable(!!data.liveUnavailable)
          setLoading(false)
        })
        .catch((err) => { if (err.name !== 'AbortError') setLoading(false) })
    }, search ? 500 : 0)

    return () => { clearTimeout(timer); controller.abort() }
  }, [search])

  const appliedSet = new Set(appliedKeys)
  const isApplied = (i) => appliedSet.has(`${(i.company ?? '').toLowerCase().trim()}|${(i.role ?? '').toLowerCase().trim()}`)

  const hasProfile = userSectors.length > 0 || userLocations.length > 0 || !!userGradYear

  const showToast = useCallback((message) => {
    setToast({ message, key: Date.now() })
  }, [])

  function handleApply(internship) {
    showToast("Good luck! Don't forget to log how it goes.")
    // Show post-apply modal after 2 seconds
    clearTimeout(modalTimerRef.current)
    modalTimerRef.current = setTimeout(() => {
      setPostApplyModal(internship)
    }, 2000)
  }

  function handleModalApplied() {
    if (!postApplyModal) return
    trackApplication(postApplyModal, 'Applied')
    setPostApplyModal(null)
    showToast('Added to your Applications tracker as Applied.')
  }

  function handleModalWishlist() {
    if (!postApplyModal) return
    trackApplication(postApplyModal, 'Wishlist')
    setPostApplyModal(null)
    showToast('Added to your Applications tracker as Wishlist.')
  }

  const filtered = internships
    .filter((i) => {
      if (tab === 'For You') {
        const match = computeMatch(i, userSectors, userLocations, userGradYear)
        return match !== null && match > 0
      }
      return tab === 'All' || i.sector === tab
    })
    .filter((i) => {
      const q = search.toLowerCase()
      return !q || i.company?.toLowerCase().includes(q) || i.role?.toLowerCase().includes(q) || i.location?.toLowerCase().includes(q)
    })
    .sort((a, b) => {
      if (tab === 'For You') {
        const ma = computeMatch(a, userSectors, userLocations, userGradYear) ?? 0
        const mb = computeMatch(b, userSectors, userLocations, userGradYear) ?? 0
        return mb - ma
      }
      return 0
    })

  return (
    <>
      {/* Search bar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-[10px] transition-all duration-150"
          style={{ background: '#111111', border: '1px solid #222222', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
            style={{ color: '#525252' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roles, companies, sectors..."
            className="flex-1 outline-none text-sm bg-transparent"
            style={{ color: '#F5F5F5' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ color: '#525252' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* View toggle */}
        <div className="flex rounded-[8px] overflow-hidden" style={{ border: '1px solid #222222', background: '#111111' }}>
          <button onClick={() => setViewMode('grid')}
            className="p-2.5 transition-all duration-150"
            style={{ background: viewMode === 'grid' ? '#222222' : 'transparent', color: viewMode === 'grid' ? '#F5F5F5' : '#525252' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </button>
          <button onClick={() => setViewMode('list')}
            className="p-2.5 transition-all duration-150"
            style={{ background: viewMode === 'list' ? '#222222' : 'transparent', color: viewMode === 'list' ? '#F5F5F5' : '#525252' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
        {TABS.map((t) => {
          const isActive = tab === t
          const isForYou = t === 'For You'
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150"
              style={{
                background: isActive ? (isForYou ? '#6366F1' : '#F5F5F5') : '#161616',
                color: isActive ? (isForYou ? '#fff' : '#0A0A0A') : '#525252',
                border: isActive ? 'none' : '1px solid #222222',
              }}
            >
              {isForYou ? (
                <span className="flex items-center gap-1"><Sparkles size={11} />For You</span>
              ) : t}
            </button>
          )
        })}
      </div>

      {/* For You nudge */}
      {tab === 'For You' && !hasProfile && (
        <div className="rounded-[8px] p-4 mb-5 flex items-start gap-3"
          style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="#6366F1" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p className="text-sm" style={{ color: '#818cf8' }}>
            Add your target sectors and locations in <strong>Settings</strong> to unlock personalised matches.
          </p>
        </div>
      )}

      {/* Live listings unavailable notice */}
      {liveUnavailable && !loading && (
        <div className="rounded-[8px] px-4 py-2.5 mb-4 flex items-center gap-2 text-xs"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#F59E0B' }}>
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          Live listings temporarily unavailable — showing saved listings only.
        </div>
      )}

      {/* Count */}
      {!loading && (
        <p className="text-xs mb-4" style={{ color: '#525252' }}>
          {filtered.length} {filtered.length === 1 ? 'listing' : 'listings'}
          {tab !== 'All' ? ` in ${tab}` : ''}
          {search ? ` matching "${search}"` : ''}
        </p>
      )}

      {/* Grid / List */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[10px] p-16 text-center" style={{ background: '#111111', border: '1px solid #222222' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(99,102,241,0.1)' }}>
            <svg className="w-6 h-6" fill="none" stroke="#6366F1" strokeWidth={1.75} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2" style={{ color: '#F5F5F5' }}>No internships match your filters</h3>
          <p className="text-sm" style={{ color: '#525252' }}>
            {tab === 'For You' ? 'Try updating your preferences in Settings.' : 'Try adjusting your search or sector filter.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              userSectors={userSectors}
              userLocations={userLocations}
              userGradYear={userGradYear}
              isApplied={isApplied(internship)}
              onApply={handleApply}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((internship) => {
            const match = computeMatch(internship, userSectors, userLocations, userGradYear)
            return (
              <div key={internship.id} className="flex items-center gap-4 px-5 py-4 rounded-[8px] transition-all duration-150"
                style={{ background: '#111111', border: '1px solid #222222' }}>
                <div className="w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0 text-xs font-bold text-white"
                  style={{ background: '#6366F1' }}>
                  {internship.company?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-semibold" style={{ color: '#F5F5F5' }}>{internship.role}</span>
                  <span className="text-sm ml-2" style={{ color: '#525252' }}>{internship.company}</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  {internship.location && <span className="text-xs" style={{ color: '#525252' }}>{internship.location}</span>}
                  {internship.deadline ? <DeadlineBadge deadline={internship.deadline} /> : <RollingBadge />}
                  {match !== null && <MatchBadge pct={match} />}
                </div>
                {internship.link ? (
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        trackApplication(internship, 'Applied')
                        window.open(internship.link, '_blank', 'noopener,noreferrer')
                        handleApply(internship)
                      }}
                      className="text-xs font-semibold px-3 py-1.5 rounded-[6px] transition-all duration-150"
                      style={{ background: '#6366F1', color: '#fff' }}>
                      Apply
                    </button>
                    <span className="text-[9px] leading-none" style={{ color: '#3d3d3d' }}>Direct link</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      onClick={() => window.open(
                        `https://www.google.com/search?q=${encodeURIComponent(internship.company + ' internship application 2026')}`,
                        '_blank',
                        'noopener,noreferrer'
                      )}
                      title="Application link not available — visit company careers page"
                      className="text-xs font-semibold px-3 py-1.5 rounded-[6px] transition-all duration-150"
                      style={{ background: '#161616', color: '#525252', border: '1px solid #222222' }}>
                      Apply
                    </button>
                    <span className="text-[9px] leading-none text-center" style={{ color: '#3d3d3d', maxWidth: '64px' }}>No direct link</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast key={toast.key} message={toast.message} onClose={() => setToast(null)} />
      )}

      {/* Post-apply modal */}
      {postApplyModal && (
        <PostApplyModal
          company={postApplyModal.company}
          onApplied={handleModalApplied}
          onWishlist={handleModalWishlist}
          onDismiss={() => setPostApplyModal(null)}
        />
      )}
    </>
  )
}
