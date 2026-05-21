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

function computeMatch(internship, userSectors, userLocations) {
  if (!userSectors.length && !userLocations.length) return null
  let score = 0; let total = 0
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

function logApplyClick(internship) {
  try {
    const key = 'placed_apply_clicks'
    const existing = JSON.parse(localStorage.getItem(key) ?? '[]')
    // Avoid duplicates
    if (!existing.find(c => c.internshipId === internship.id)) {
      localStorage.setItem(key, JSON.stringify([
        ...existing,
        { internshipId: internship.id, company: internship.company, role: internship.role, timestamp: new Date().toISOString() },
      ]))
    }
  } catch {}
}

function logApplicationStatus(internship, status) {
  try {
    const key = 'placed_saved_applications'
    const existing = JSON.parse(localStorage.getItem(key) ?? '[]')
    if (!existing.find(a => a.internship_id === internship.id)) {
      localStorage.setItem(key, JSON.stringify([
        ...existing,
        {
          internship_id: internship.id,
          company: internship.company,
          role: internship.role,
          sector: internship.sector ?? null,
          location: internship.location ?? null,
          deadline: internship.deadline ?? null,
          salary: internship.salary ?? null,
          link: internship.link ?? null,
          status,
          notes: '',
          created_at: new Date().toISOString(),
        },
      ]))
    }
  } catch {}
}

function InternshipCard({ internship, userSectors, userLocations, onApply }) {
  const { id, company, role, sector, location, deadline, salary, link } = internship
  const match = computeMatch(internship, userSectors, userLocations)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    const clicks = JSON.parse(localStorage.getItem('placed_apply_clicks') ?? '[]')
    if (clicks.some(c => c.internshipId === id)) setApplied(true)
  }, [id])

  async function handleSave() {
    if (saved || saving) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 300))
    setSaving(false)
    setSaved(true)
  }

  function handleApply() {
    if (applied) return
    logApplyClick(internship)
    logApplicationStatus(internship, 'Applied')
    setApplied(true)
    if (link) window.open(`/api/apply/${id}`, '_blank', 'noopener,noreferrer')
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
        {deadline && <DeadlineBadge deadline={deadline} />}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
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

        {/* Apply button */}
        {link ? (
          <button
            onClick={handleApply}
            disabled={applied}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-[6px] transition-all duration-150"
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
          <button disabled
            className="flex-1 text-center text-xs font-semibold px-4 py-2 rounded-[6px] cursor-not-allowed"
            style={{ background: '#161616', color: '#525252', border: '1px solid #222222' }}>
            No link available
          </button>
        )}
      </div>
    </div>
  )
}

export default function InternshipsClient({ internships, userSectors, userLocations }) {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('All')
  const [viewMode, setViewMode] = useState('grid')
  const [toast, setToast] = useState(null)
  const [postApplyModal, setPostApplyModal] = useState(null)
  const modalTimerRef = useRef(null)

  const hasProfile = userSectors.length > 0 || userLocations.length > 0

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
    logApplicationStatus(postApplyModal, 'Applied')
    setPostApplyModal(null)
    showToast('Added to your Applications tracker as Applied.')
  }

  function handleModalWishlist() {
    if (!postApplyModal) return
    logApplicationStatus(postApplyModal, 'Wishlist')
    setPostApplyModal(null)
    showToast('Added to your Applications tracker as Wishlist.')
  }

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
      return !q || i.company?.toLowerCase().includes(q) || i.role?.toLowerCase().includes(q) || i.location?.toLowerCase().includes(q)
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

      {/* Count */}
      <p className="text-xs mb-4" style={{ color: '#525252' }}>
        {filtered.length} {filtered.length === 1 ? 'listing' : 'listings'}
        {tab !== 'All' ? ` in ${tab}` : ''}
        {search ? ` matching "${search}"` : ''}
      </p>

      {/* Grid / List */}
      {filtered.length === 0 ? (
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
              onApply={handleApply}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((internship) => {
            const match = computeMatch(internship, userSectors, userLocations)
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
                  {internship.deadline && <DeadlineBadge deadline={internship.deadline} />}
                  {match !== null && <MatchBadge pct={match} />}
                </div>
                {internship.link && (
                  <button
                    onClick={() => handleApply(internship) || window.open(`/api/apply/${internship.id}`, '_blank', 'noopener,noreferrer')}
                    className="text-xs font-semibold px-3 py-1.5 rounded-[6px] shrink-0 transition-all duration-150"
                    style={{ background: '#6366F1', color: '#fff' }}>
                    Apply
                  </button>
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
