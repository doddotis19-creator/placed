'use client'

import { useState, useRef, useEffect } from 'react'

const COLUMNS = [
  { id: 'Wishlist',   label: 'Wishlist',   color: '#525252' },
  { id: 'Applied',    label: 'Applied',    color: '#6366F1' },
  { id: 'OA/Test',    label: 'OA / Test',  color: '#F59E0B' },
  { id: 'Interview',  label: 'Interview',  color: '#8B5CF6' },
  { id: 'AC',         label: 'AC',         color: '#EC4899' },
  { id: 'Offer',      label: 'Offer',      color: '#22C55E' },
  { id: 'Rejected',   label: 'Rejected',   color: '#EF4444' },
]

function daysRemaining(deadline) {
  if (!deadline) return null
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const d = new Date(deadline); d.setHours(0, 0, 0, 0)
  return Math.ceil((d - today) / (1000 * 60 * 60 * 24))
}

function DeadlineBadge({ deadline }) {
  const days = daysRemaining(deadline)
  if (days === null) return null
  if (days < 0) return <span className="text-[10px]" style={{ color: '#525252' }}>Closed</span>
  const color = days === 0 ? '#EF4444' : days <= 7 ? '#EF4444' : days <= 14 ? '#F59E0B' : '#525252'
  const label = days === 0 ? 'Due today' : `${days}d`
  return (
    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-[3px]"
      style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}>
      {label}
    </span>
  )
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
    if (notes !== app.notes) await onNotesSave(app.id, notes)
  }

  const timeline = [
    { label: 'Saved to Wishlist', at: app.created_at },
    ...statusHistory.slice(1).map((entry) => ({ label: `Moved to ${entry.status}`, at: entry.changed_at })),
  ]

  return (
    <>
      <div className="fixed inset-0 z-40 backdrop-blur-[2px]"
        style={{ background: 'rgba(0,0,0,0.6)' }}
        onClick={onClose} />

      <div className="slide-in-right fixed inset-y-0 right-0 z-50 w-[400px] max-w-full flex flex-col overflow-hidden"
        style={{ background: '#111111', borderLeft: '1px solid #222222', boxShadow: '-20px 0 60px rgba(0,0,0,0.6)' }}>

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 py-5 shrink-0"
          style={{ borderBottom: '1px solid #222222' }}>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: col?.color ?? '#525252' }} />
              <span className="text-xs font-medium" style={{ color: col?.color ?? '#525252' }}>{app.status}</span>
            </div>
            <p className="font-semibold text-base leading-snug" style={{ color: '#F5F5F5' }}>{app.role}</p>
            <p className="text-sm mt-0.5" style={{ color: '#A3A3A3' }}>{app.company}</p>
          </div>
          <button onClick={onClose} className="shrink-0 mt-0.5 p-1 rounded-[4px] transition-all duration-150"
            style={{ color: '#525252' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Details */}
          <div className="px-6 py-5" style={{ borderBottom: '1px solid #1a1a1a' }}>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest mb-4" style={{ color: '#525252' }}>Details</h3>
            <div className="space-y-3">
              {app.location && (
                <div className="flex items-center gap-2.5 text-sm" style={{ color: '#A3A3A3' }}>
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" style={{ color: '#525252' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {app.location}
                </div>
              )}
              {app.salary && (
                <div className="flex items-center gap-2.5 text-sm" style={{ color: '#A3A3A3' }}>
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" style={{ color: '#525252' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {app.salary}
                </div>
              )}
              {app.deadline && (
                <div className="flex items-center gap-2.5 text-sm" style={{ color: '#A3A3A3' }}>
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" style={{ color: '#525252' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <span>{new Date(app.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <DeadlineBadge deadline={app.deadline} />
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="px-6 py-5" style={{ borderBottom: '1px solid #1a1a1a' }}>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#525252' }}>Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleBlur}
              placeholder="Add notes, interview prep, contacts…"
              rows={5}
              className="w-full text-sm placeholder-[#525252] rounded-[6px] px-3.5 py-3 resize-none outline-none transition-all duration-150"
              style={{ background: '#161616', border: '1px solid #222222', color: '#F5F5F5' }}
              onFocus={e => { e.target.style.borderColor = '#6366F1' }}
              onBlur2={e => { e.target.style.borderColor = '#222222' }}
            />
            <p className="text-[11px] mt-1.5" style={{ color: '#525252' }}>Saves automatically on blur</p>
          </div>

          {/* Timeline */}
          <div className="px-6 py-5" style={{ borderBottom: '1px solid #1a1a1a' }}>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest mb-4" style={{ color: '#525252' }}>Timeline</h3>
            <div className="relative pl-4">
              <div className="absolute left-1.5 top-2 bottom-2 w-px" style={{ background: '#222222' }} />
              <div className="space-y-4">
                {timeline.map((entry, i) => (
                  <div key={i} className="relative flex items-start gap-3">
                    <div className="absolute -left-4 mt-1.5 w-2 h-2 rounded-full"
                      style={{ background: '#222222', border: '2px solid #333333' }} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium" style={{ color: '#A3A3A3' }}>{entry.label}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: '#525252' }}>{formatDate(entry.at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Move to */}
          <div className="px-6 py-5">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#525252' }}>Move to</h3>
            <div className="flex flex-wrap gap-2">
              {COLUMNS.filter((c) => c.id !== app.status).map((c) => (
                <button key={c.id} onClick={() => onStatusChange(app.id, c.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all duration-150"
                  style={{ background: '#161616', border: '1px solid #222222', color: '#A3A3A3' }}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.color }} />
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 shrink-0" style={{ borderTop: '1px solid #222222', background: '#0d0d0d' }}>
          {app.link ? (
            <a href={app.link} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full font-semibold text-sm px-4 py-2.5 rounded-[6px] transition-all duration-150"
              style={{ background: '#6366F1', color: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
              Apply now
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          ) : (
            <button disabled className="w-full font-semibold text-sm px-4 py-2.5 rounded-[6px] cursor-not-allowed"
              style={{ background: '#161616', color: '#525252', border: '1px solid #222222' }}>
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
      onDragEnd={() => { setTimeout(() => { isDragging.current = false }, 50) }}
      onClick={() => { if (!isDragging.current) onOpen(app) }}
      className="group rounded-[8px] p-3.5 transition-all duration-150 cursor-pointer select-none"
      style={{ background: '#161616', border: '1px solid #222222', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold truncate leading-snug" style={{ color: '#F5F5F5' }}>{app.role}</p>
          <p className="text-[11px] truncate mt-0.5" style={{ color: '#525252' }}>{app.company}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(app.id) }}
          className="opacity-0 group-hover:opacity-100 transition-all duration-150 shrink-0 p-0.5"
          title="Remove"
          style={{ color: '#525252' }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1" style={{ color: '#525252' }}>
          <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <span className="text-[10px]">
            {app.deadline ? new Date(app.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'No deadline'}
          </span>
        </div>
        {app.deadline && <DeadlineBadge deadline={app.deadline} />}
      </div>

      {app.notes && (
        <p className="text-[10px] truncate mt-2 italic" style={{ color: '#525252' }}>{app.notes}</p>
      )}
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
      className="kanban-column flex flex-col min-w-[210px] w-[210px] rounded-[10px] transition-all duration-150"
      style={{
        background: dragOver ? `${column.color}08` : '#111111',
        border: dragOver ? `1px solid ${column.color}40` : '1px solid #222222',
      }}
    >
      {/* Column header */}
      <div className="px-3 pt-3 pb-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: column.color }} />
          <span className="text-[12px] font-semibold" style={{ color: '#A3A3A3' }}>{column.label}</span>
        </div>
        <span className="text-[11px] font-medium tabular-nums px-1.5 py-0.5 rounded-[4px]"
          style={{ background: '#161616', color: '#525252', border: '1px solid #222222' }}>
          {cards.length}
        </span>
      </div>

      <div className="flex flex-col gap-2 px-2 pb-3 flex-1 min-h-[100px]">
        {cards.map((app) => (
          <ApplicationCard key={app.id} app={app} onDelete={onDelete} onOpen={onOpen} />
        ))}

        {/* Add placeholder */}
        <div className="rounded-[6px] border-dashed border-2 px-3 py-2.5 text-center opacity-0 hover:opacity-100 transition-all duration-150 cursor-pointer"
          style={{ borderColor: '#222222' }}>
          <span className="text-[11px]" style={{ color: '#525252' }}>+ Add</span>
        </div>
      </div>
    </div>
  )
}

// ─── Kanban Board ──────────────────────────────────────────────────────────────

export default function KanbanBoard({ initialApplications }) {
  const [applications, setApplications] = useState(initialApplications)
  const [selectedApp, setSelectedApp] = useState(null)

  const [statusHistory, setStatusHistory] = useState(() => {
    const hist = {}
    for (const app of initialApplications) {
      hist[app.id] = [{ status: app.status, changed_at: app.created_at }]
    }
    return hist
  })

  useEffect(() => {
    if (selectedApp) {
      const updated = applications.find((a) => a.id === selectedApp.id)
      if (updated) setSelectedApp(updated)
    }
  }, [applications])

  function handleDrop(cardId, newStatus) {
    const app = applications.find((a) => a.id === cardId)
    if (!app || app.status === newStatus) return

    setApplications((prev) => prev.map((a) => a.id === cardId ? { ...a, status: newStatus } : a))
    setStatusHistory((prev) => ({
      ...prev,
      [cardId]: [...(prev[cardId] ?? []), { status: newStatus, changed_at: new Date().toISOString() }],
    }))
    // Mock mode: no database — state is kept in memory only
  }

  function handleDelete(cardId) {
    if (selectedApp?.id === cardId) setSelectedApp(null)
    setApplications((prev) => prev.filter((a) => a.id !== cardId))
    // Mock mode: no database — state is kept in memory only
  }

  function handleNotesSave(cardId, notes) {
    setApplications((prev) => prev.map((a) => a.id === cardId ? { ...a, notes } : a))
    // Mock mode: no database — state is kept in memory only
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-[10px] p-16 text-center" style={{ background: '#111111', border: '1px solid #222222' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(99,102,241,0.1)' }}>
          <svg className="w-6 h-6" fill="none" stroke="#6366F1" strokeWidth={1.75} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        </div>
        <h3 className="font-semibold mb-2" style={{ color: '#F5F5F5' }}>No applications yet</h3>
        <p className="text-sm" style={{ color: '#525252' }}>
          Save internships from the <strong style={{ color: '#A3A3A3' }}>Find Internships</strong> page to start tracking.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="kanban-scroll overflow-x-auto pb-4 -mx-2 px-2">
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
          onStatusChange={(id, status) => handleDrop(id, status)}
        />
      )}
    </>
  )
}
