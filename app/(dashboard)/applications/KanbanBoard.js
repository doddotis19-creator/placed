'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const COLUMNS = [
  { id: 'Wishlist',  label: 'Wishlist',  dot: 'bg-slate-400' },
  { id: 'Applied',   label: 'Applied',   dot: 'bg-blue-500' },
  { id: 'OA/Test',   label: 'OA / Test', dot: 'bg-purple-500' },
  { id: 'Interview', label: 'Interview', dot: 'bg-amber-500' },
  { id: 'AC',        label: 'AC',        dot: 'bg-orange-500' },
  { id: 'Offer',     label: 'Offer',     dot: 'bg-green-500' },
  { id: 'Rejected',  label: 'Rejected',  dot: 'bg-red-400' },
]

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
  if (days < 0) return <span className="text-xs text-slate-400">Closed</span>
  if (days === 0) return <span className="text-xs font-semibold text-red-600">Due today</span>
  if (days <= 7)  return <span className="text-xs font-semibold text-red-600">{days}d left</span>
  if (days <= 14) return <span className="text-xs text-amber-600">{days}d left</span>
  return <span className="text-xs text-slate-400">{days}d left</span>
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── Side Panel ────────────────────────────────────────────────────────────────

function SidePanel({ app, statusHistory, onClose, onNotesSave, onStatusChange }) {
  const [notes, setNotes] = useState(app.notes ?? '')
  const col = COLUMNS.find((c) => c.id === app.status)

  async function handleBlur() {
    if (notes !== app.notes) {
      await onNotesSave(app.id, notes)
    }
  }

  // Build a simple timeline from created_at / status history
  const timeline = [
    { label: 'Saved to Wishlist', at: app.created_at },
    ...statusHistory.slice(1).map((entry) => ({
      label: `Moved to ${entry.status}`,
      at: entry.changed_at,
    })),
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="slide-in-right fixed inset-y-0 right-0 z-50 w-[400px] max-w-full bg-white border-l border-slate-200 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-slate-100">
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 text-base leading-snug">{app.role}</p>
            <p className="text-slate-500 text-sm mt-0.5">{app.company}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 text-slate-400 hover:text-slate-600 mt-0.5 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Details */}
          <div className="px-6 py-5 space-y-3 border-b border-slate-100">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Details</h3>

            {/* Status */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full shrink-0 ${col?.dot ?? 'bg-slate-400'}`} />
              <span className="text-sm font-medium text-slate-700">{app.status}</span>
            </div>

            {app.location && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {app.location}
              </div>
            )}

            {app.salary && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {app.salary}
              </div>
            )}

            {app.sector && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {app.sector}
              </div>
            )}

            {app.deadline && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  {new Date(app.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <DeadlineBadge deadline={app.deadline} />
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleBlur}
              placeholder="Add your notes, interview prep, contacts…"
              rows={5}
              className="w-full text-sm text-slate-700 placeholder-slate-300 bg-slate-50 rounded-xl px-3.5 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white border border-slate-200 focus:border-indigo-400 transition-all"
            />
            <p className="text-xs text-slate-400 mt-1.5">Saves automatically when you click away</p>
          </div>

          {/* Timeline */}
          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Timeline</h3>
            <div className="relative pl-4">
              {/* Vertical line */}
              <div className="absolute left-1.5 top-2 bottom-2 w-px bg-slate-200" />

              <div className="space-y-4">
                {timeline.map((entry, i) => (
                  <div key={i} className="relative flex items-start gap-3">
                    <div className="absolute -left-4 mt-1 w-2 h-2 rounded-full bg-white border-2 border-slate-300 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-700">{entry.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{formatDate(entry.at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Change status */}
          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Move to</h3>
            <div className="flex flex-wrap gap-2">
              {COLUMNS.filter((c) => c.id !== app.status).map((c) => (
                <button
                  key={c.id}
                  onClick={() => onStatusChange(app.id, c.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer — Apply link */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 shrink-0">
          {app.link ? (
            <a
              href={app.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              Apply now
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ) : (
            <button
              disabled
              className="w-full bg-slate-100 text-slate-400 font-semibold text-sm px-4 py-2.5 rounded-xl cursor-not-allowed"
            >
              No application link saved
            </button>
          )}
        </div>
      </div>
    </>
  )
}

// ─── Application Card ──────────────────────────────────────────────────────────

function ApplicationCard({ app, onDelete, onOpen }) {
  const isDragging = useRef(false)

  return (
    <div
      draggable
      onDragStart={(e) => {
        isDragging.current = true
        e.dataTransfer.setData('text/plain', app.id)
        e.dataTransfer.effectAllowed = 'move'
      }}
      onDragEnd={() => {
        setTimeout(() => { isDragging.current = false }, 50)
      }}
      onClick={() => {
        if (!isDragging.current) onOpen(app)
      }}
      className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group select-none"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate leading-snug">{app.role}</p>
          <p className="text-xs text-slate-500 truncate mt-0.5">{app.company}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(app.id) }}
          className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all shrink-0 mt-0.5"
          title="Remove"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Deadline */}
      {app.deadline && (
        <div className="flex items-center gap-1.5 mb-2">
          <svg className="w-3 h-3 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs text-slate-400">
            {new Date(app.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </span>
          <DeadlineBadge deadline={app.deadline} />
        </div>
      )}

      {/* Notes preview */}
      {app.notes && (
        <p className="text-xs text-slate-400 truncate mt-1 italic">{app.notes}</p>
      )}

      {/* Click hint */}
      <p className="text-xs text-slate-300 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        Click to open details
      </p>
    </div>
  )
}

// ─── Kanban Column ─────────────────────────────────────────────────────────────

function KanbanColumn({ column, cards, onDrop, onDelete, onOpen }) {
  const [dragOver, setDragOver] = useState(false)

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragEnter={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        const id = e.dataTransfer.getData('text/plain')
        if (id) onDrop(id, column.id)
      }}
      className={`flex flex-col min-w-[220px] w-[220px] rounded-2xl transition-all ${
        dragOver ? 'bg-indigo-50 ring-2 ring-indigo-300 ring-offset-1' : 'bg-slate-100/80'
      }`}
    >
      <div className="px-3 pt-3 pb-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full shrink-0 ${column.dot}`} />
          <span className="text-xs font-semibold text-slate-700">{column.label}</span>
        </div>
        <span className="text-xs text-slate-400 font-medium tabular-nums">{cards.length}</span>
      </div>

      <div className="flex flex-col gap-2 px-2 pb-3 flex-1 min-h-[80px]">
        {cards.map((app) => (
          <ApplicationCard
            key={app.id}
            app={app}
            onDelete={onDelete}
            onOpen={onOpen}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Kanban Board ──────────────────────────────────────────────────────────────

export default function KanbanBoard({ initialApplications }) {
  const [applications, setApplications] = useState(initialApplications)
  const [selectedApp, setSelectedApp] = useState(null)

  // Per-app status history (session-only; persists as long as page is open)
  const [statusHistory, setStatusHistory] = useState(() => {
    const hist = {}
    for (const app of initialApplications) {
      hist[app.id] = [{ status: app.status, changed_at: app.created_at }]
    }
    return hist
  })

  // Keep selectedApp in sync with latest applications state
  useEffect(() => {
    if (selectedApp) {
      const updated = applications.find((a) => a.id === selectedApp.id)
      if (updated) setSelectedApp(updated)
    }
  }, [applications])

  async function handleDrop(cardId, newStatus) {
    const app = applications.find((a) => a.id === cardId)
    if (!app || app.status === newStatus) return

    setApplications((prev) =>
      prev.map((a) => a.id === cardId ? { ...a, status: newStatus } : a)
    )

    setStatusHistory((prev) => ({
      ...prev,
      [cardId]: [
        ...(prev[cardId] ?? []),
        { status: newStatus, changed_at: new Date().toISOString() },
      ],
    }))

    await supabase
      .from('user_applications')
      .update({ status: newStatus })
      .eq('id', cardId)
  }

  async function handleDelete(cardId) {
    if (selectedApp?.id === cardId) setSelectedApp(null)
    setApplications((prev) => prev.filter((a) => a.id !== cardId))
    await supabase.from('user_applications').delete().eq('id', cardId)
  }

  async function handleNotesSave(cardId, notes) {
    setApplications((prev) =>
      prev.map((a) => a.id === cardId ? { ...a, notes } : a)
    )
    await supabase
      .from('user_applications')
      .update({ notes })
      .eq('id', cardId)
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h3 className="font-semibold text-slate-900 mb-2">No applications yet</h3>
        <p className="text-sm text-slate-500 max-w-xs mx-auto">
          Save internships from the <strong>Find Internships</strong> page to start tracking your progress.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto pb-4 -mx-2 px-2">
        <div className="flex gap-3 min-w-max">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              cards={applications.filter((a) => a.status === col.id)}
              onDrop={handleDrop}
              onDelete={handleDelete}
              onOpen={setSelectedApp}
            />
          ))}
        </div>
      </div>

      {selectedApp && (
        <SidePanel
          app={selectedApp}
          statusHistory={statusHistory[selectedApp.id] ?? []}
          onClose={() => setSelectedApp(null)}
          onNotesSave={handleNotesSave}
          onStatusChange={(id, status) => {
            handleDrop(id, status)
          }}
        />
      )}
    </>
  )
}
