'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'cv', label: 'CV & Documents' },
  { id: 'account', label: 'Account' },
  { id: 'danger', label: 'Danger Zone' },
]

const SECTORS = ['Finance', 'Technology', 'Consulting', 'Law', 'Marketing', 'Engineering', 'Property', 'FMCG', 'Media', 'Healthcare']
const LOCATIONS = ['London', 'Manchester', 'Edinburgh', 'Birmingham', 'Bristol', 'Remote', 'Open to anything']

function Toggle({ on, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="relative inline-flex h-5 w-9 shrink-0 rounded-full transition-all duration-150"
      style={{ background: on ? '#6366F1' : '#222222', border: `1px solid ${on ? '#6366F1' : '#333333'}` }}
    >
      <span className="pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full shadow-sm transition-all duration-150"
        style={{ background: '#fff', margin: '2px', transform: on ? 'translateX(16px)' : 'translateX(0)' }} />
    </button>
  )
}

export default function SettingsPage() {
  const { user } = useUser()
  const [tab, setTab] = useState('profile')
  const [notifications, setNotifications] = useState({
    deadlineReminders: true,
    newMatches: false,
    applicationUpdates: true,
  })
  const [deleteConfirm, setDeleteConfirm] = useState('')

  const [profile, setProfile] = useState({
    university: '',
    degree_subject: '',
    graduation_year: '',
    sectors: [],
    locations: [],
    bio: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let active = true
    fetch('/api/profile')
      .then((r) => r.json())
      .then((data) => {
        if (active && data.profile) {
          setProfile({
            university: data.profile.university ?? '',
            degree_subject: data.profile.degree_subject ?? '',
            graduation_year: data.profile.graduation_year ? String(data.profile.graduation_year) : '',
            sectors: data.profile.sectors ?? [],
            locations: data.profile.locations ?? [],
            bio: data.profile.bio ?? '',
          })
        }
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  function toggle(key, value) {
    setProfile((p) => ({
      ...p,
      [key]: p[key].includes(value) ? p[key].filter((x) => x !== value) : [...p[key], value],
    }))
  }

  async function saveProfile() {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      }
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    background: '#161616',
    border: '1px solid #222222',
    color: '#F5F5F5',
    borderRadius: '6px',
  }

  const focusHandlers = {
    onFocus: (e) => { e.target.style.borderColor = '#6366F1' },
    onBlur: (e) => { e.target.style.borderColor = '#222222' },
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: '#F5F5F5', letterSpacing: '-0.02em' }}>Settings</h1>
        <p className="text-sm" style={{ color: '#525252' }}>Manage your account, preferences and documents.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left nav */}
        <div className="md:w-48 shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="text-left px-3 py-2 rounded-[6px] text-sm font-medium whitespace-nowrap transition-all duration-150"
                style={{
                  background: tab === t.id ? (t.id === 'danger' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.12)') : 'transparent',
                  color: tab === t.id ? (t.id === 'danger' ? '#EF4444' : '#818cf8') : t.id === 'danger' ? '#EF4444' : '#A3A3A3',
                  border: tab === t.id ? `1px solid ${t.id === 'danger' ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.2)'}` : '1px solid transparent',
                }}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Profile */}
          {tab === 'profile' && (
            <div className="rounded-[10px] p-6" style={{ background: '#111111', border: '1px solid #222222', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
              <h2 className="text-sm font-semibold mb-6" style={{ color: '#F5F5F5' }}>Profile</h2>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6 pb-6" style={{ borderBottom: '1px solid #1a1a1a' }}>
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="Avatar" className="w-14 h-14 rounded-full object-cover" style={{ border: '2px solid #222222' }} />
                ) : (
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
                    style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8', border: '2px solid rgba(99,102,241,0.3)' }}>
                    {user?.firstName?.[0] ?? '?'}
                  </div>
                )}
                <div>
                  <p className="font-semibold" style={{ color: '#F5F5F5' }}>{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm" style={{ color: '#525252' }}>{user?.emailAddresses?.[0]?.emailAddress ?? '—'}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: '#A3A3A3' }}>First name</label>
                    <input type="text" defaultValue={user?.firstName ?? ''} placeholder="First name"
                      className="w-full px-4 py-2.5 text-sm outline-none transition-all duration-150" style={inputStyle} {...focusHandlers} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: '#A3A3A3' }}>Last name</label>
                    <input type="text" defaultValue={user?.lastName ?? ''} placeholder="Last name"
                      className="w-full px-4 py-2.5 text-sm outline-none transition-all duration-150" style={inputStyle} {...focusHandlers} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium" style={{ color: '#A3A3A3' }}>University</label>
                  <input type="text" placeholder="University name"
                    value={profile.university}
                    onChange={(e) => setProfile((p) => ({ ...p, university: e.target.value }))}
                    className="w-full px-4 py-2.5 text-sm outline-none transition-all duration-150" style={inputStyle} {...focusHandlers} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium" style={{ color: '#A3A3A3' }}>Degree subject</label>
                  <input type="text" placeholder="e.g. Computer Science"
                    value={profile.degree_subject}
                    onChange={(e) => setProfile((p) => ({ ...p, degree_subject: e.target.value }))}
                    className="w-full px-4 py-2.5 text-sm outline-none transition-all duration-150" style={inputStyle} {...focusHandlers} />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: '#A3A3A3' }}>Target sectors</label>
                  <div className="flex flex-wrap gap-2">
                    {SECTORS.map((s) => {
                      const active = profile.sectors.includes(s)
                      return (
                        <button key={s} type="button" onClick={() => toggle('sectors', s)}
                          className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150"
                          style={{
                            background: active ? 'rgba(99,102,241,0.12)' : '#161616',
                            border: `1px solid ${active ? '#6366F1' : '#222222'}`,
                            color: active ? '#818cf8' : '#A3A3A3',
                          }}>
                          {s}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: '#A3A3A3' }}>Preferred locations</label>
                  <div className="flex flex-wrap gap-2">
                    {LOCATIONS.map((l) => {
                      const active = profile.locations.includes(l)
                      return (
                        <button key={l} type="button" onClick={() => toggle('locations', l)}
                          className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150"
                          style={{
                            background: active ? 'rgba(99,102,241,0.12)' : '#161616',
                            border: `1px solid ${active ? '#6366F1' : '#222222'}`,
                            color: active ? '#818cf8' : '#A3A3A3',
                          }}>
                          {l}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <button onClick={saveProfile} disabled={saving}
                  className="px-5 py-2.5 text-sm font-semibold rounded-[6px] transition-all duration-150 disabled:opacity-50"
                  style={{ background: saved ? '#22C55E' : '#6366F1', color: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                  {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save changes'}
                </button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {tab === 'notifications' && (
            <div className="rounded-[10px] p-6" style={{ background: '#111111', border: '1px solid #222222', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
              <h2 className="text-sm font-semibold mb-6" style={{ color: '#F5F5F5' }}>Notifications</h2>
              <div className="space-y-5">
                {[
                  { key: 'deadlineReminders', label: 'Deadline reminders', desc: 'Email alerts 3 days before a saved deadline' },
                  { key: 'newMatches', label: 'New matching listings', desc: 'Be alerted when new internships match your profile' },
                  { key: 'applicationUpdates', label: 'Application updates', desc: 'Notifications when you move an application to a new stage' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid #1a1a1a' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#F5F5F5' }}>{label}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#525252' }}>{desc}</p>
                    </div>
                    <Toggle on={notifications[key]} onChange={(v) => setNotifications(n => ({ ...n, [key]: v }))} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CV & Documents */}
          {tab === 'cv' && (
            <div className="rounded-[10px] p-6" style={{ background: '#111111', border: '1px solid #222222', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
              <h2 className="text-sm font-semibold mb-6" style={{ color: '#F5F5F5' }}>CV & Documents</h2>
              <div className="rounded-[8px] border-2 border-dashed px-6 py-10 text-center"
                style={{ borderColor: '#222222' }}
                onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#6366F1' }}
                onDragLeave={e => { e.currentTarget.style.borderColor = '#222222' }}>
                <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ color: '#525252' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p className="text-sm font-medium mb-1" style={{ color: '#A3A3A3' }}>Drag your CV here to upload</p>
                <p className="text-xs mb-4" style={{ color: '#525252' }}>PDF or Word accepted — we'll use it to personalise your cover letters</p>
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[6px] text-xs font-semibold cursor-pointer transition-all duration-150"
                  style={{ background: '#6366F1', color: '#fff' }}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  Upload CV
                  <input type="file" accept=".pdf,.doc,.docx" className="hidden" />
                </label>
              </div>
            </div>
          )}

          {/* Account */}
          {tab === 'account' && (
            <div className="rounded-[10px] p-6" style={{ background: '#111111', border: '1px solid #222222', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
              <h2 className="text-sm font-semibold mb-6" style={{ color: '#F5F5F5' }}>Account</h2>
              <div className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium" style={{ color: '#A3A3A3' }}>Email address</label>
                  <input type="email" value={user?.emailAddresses?.[0]?.emailAddress ?? ''} disabled
                    className="w-full px-4 py-2.5 text-sm rounded-[6px] cursor-not-allowed"
                    style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', color: '#525252' }} />
                  <p className="text-[11px]" style={{ color: '#525252' }}>Email is managed through your Clerk account.</p>
                </div>
                <div className="pt-2">
                  <p className="text-sm font-medium mb-2" style={{ color: '#F5F5F5' }}>Password</p>
                  <button className="text-sm font-medium px-4 py-2 rounded-[6px] transition-all duration-150"
                    style={{ background: '#161616', border: '1px solid #222222', color: '#A3A3A3' }}>
                    Change password →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          {tab === 'danger' && (
            <div className="rounded-[10px] p-6" style={{ background: '#111111', border: '1px solid rgba(239,68,68,0.3)', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
              <h2 className="text-sm font-semibold mb-2" style={{ color: '#EF4444' }}>Danger Zone</h2>
              <p className="text-sm mb-6" style={{ color: '#525252' }}>
                This will permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium" style={{ color: '#A3A3A3' }}>
                    Type <strong style={{ color: '#F5F5F5' }}>delete my account</strong> to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirm}
                    onChange={e => setDeleteConfirm(e.target.value)}
                    placeholder="delete my account"
                    className="w-full max-w-xs px-4 py-2.5 text-sm outline-none rounded-[6px] transition-all duration-150"
                    style={{ background: '#161616', border: '1px solid rgba(239,68,68,0.3)', color: '#F5F5F5' }}
                  />
                </div>
                <button
                  disabled={deleteConfirm !== 'delete my account'}
                  className="self-start text-sm font-semibold px-5 py-2.5 rounded-[6px] transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: '#EF4444', color: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
                >
                  Delete account permanently
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
