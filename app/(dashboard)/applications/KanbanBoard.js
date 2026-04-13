'use client'

import { useState, useRef } from 'react'
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

function ApplicationCard({ app, onDelete, onNotesChange }) {
  const [notes, setNotes] = useState(app.notes ?? '')
  const saveTimer = useRef(null)

  function handleNotesChange(e) {
    const val = e.target.value
    setNotes(val)
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => onNotesChange(app.id, val), 800)
  }

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', app.id)
        e.dataTransfer.effectAllowed = 'move'
      }}
      className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group select-none"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate leading-snug">{app.role}</p>
          <p className="text-xs text-slate-500 truncate mt-0.5">{app.company}</p>
        </div>
        <button
          onClick={() => onDelete(app.id)}
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
        <div className="flex items-center gap-1.5 mb-2.5">
          <svg className="w-3 h-3 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs text-slate-400">
            {new Date(app.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </span>
          <DeadlineBadge deadline={app.deadline} />
        </div>
      )}

      {/* Notes */}
      <textarea
        value={notes}
        onChange={handleNotesChange}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        draggable={false}
        placeholder="Add notes…"
        rows={2}
        className="w-full text-xs text-slate-600 placeholder-slate-300 bg-slate-50 rounded-lg px-2.5 py-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-400 border border-transparent focus:border-indigo-300 cursor-text select-text"
      />
    </div>
  )
}

function KanbanColumn({ column, cards, onDrop, onDelete, onNotesChange }) {
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
      {/* Column header */}
      <div className="px-3 pt-3 pb-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full shrink-0 ${column.dot}`} />
          <span className="text-xs font-semibold text-slate-700">{column.label}</span>
        </div>
        <span className="text-xs text-slate-400 font-medium tabular-nums">{cards.length}</span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 px-2 pb-3 flex-1 min-h-[80px]">
        {cards.map((app) => (
          <ApplicationCard
            key={app.id}
            app={app}
            onDelete={onDelete}
            onNotesChange={onNotesChange}
          />
        ))}
      </div>
    </div>
  )
}

export default function KanbanBoard({ initialApplications }) {
  const [applications, setApplications] = useState(initialApplications)

  async function handleDrop(cardId, newStatus) {
    const app = applications.find((a) => a.id === cardId)
    if (!app || app.status === newStatus) return

    setApplications((prev) =>
      prev.map((a) => a.id === cardId ? { ...a, status: newStatus } : a)
    )

    await supabase
      .from('user_applications')
      .update({ status: newStatus })
      .eq('id', cardId)
  }

  async function handleDelete(cardId) {
    setApplications((prev) => prev.filter((a) => a.id !== cardId))
    await supabase.from('user_applications').delete().eq('id', cardId)
  }

  async function handleNotesChange(cardId, notes) {
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
    <div className="overflow-x-auto pb-4 -mx-2 px-2">
      <div className="flex gap-3 min-w-max">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            cards={applications.filter((a) => a.status === col.id)}
            onDrop={handleDrop}
            onDelete={handleDelete}
            onNotesChange={handleNotesChange}
          />
        ))}
      </div>
    </div>
  )
}
