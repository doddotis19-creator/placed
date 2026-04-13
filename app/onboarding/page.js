'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const SECTORS = ['Finance', 'Tech', 'Consulting', 'Law', 'Marketing', 'Engineering', 'Property', 'FMCG']
const LOCATIONS = ['London', 'New York', 'Manchester', 'Edinburgh', 'Birmingham', 'Bristol', 'Remote', 'International']
const GRAD_YEARS = ['2025', '2026', '2027', '2028', '2029']

export default function OnboardingPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [form, setForm] = useState({
    degree_subject: '',
    university: '',
    graduation_year: '',
    sectors: [],
    locations: [],
    bio: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function toggleItem(key, value) {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((x) => x !== value) : [...f[key], value],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isLoaded || !user) return
    setSaving(true)
    setError(null)

    const { error: err } = await supabase.from('profiles').upsert(
      {
        user_id: user.id,
        degree_subject: form.degree_subject || null,
        university: form.university || null,
        graduation_year: form.graduation_year ? parseInt(form.graduation_year) : null,
        sectors: form.sectors,
        locations: form.locations,
        bio: form.bio || null,
        onboarding_complete: true,
      },
      { onConflict: 'user_id' }
    )

    setSaving(false)
    if (err) {
      setError('Something went wrong. Please try again.')
    } else {
      router.push('/dashboard')
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-2xl mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Set up your profile</h1>
          <p className="text-slate-500 mt-2">Help us find the best internships for you.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col gap-6">
          {/* Degree + University */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Degree subject</label>
              <input
                type="text"
                value={form.degree_subject}
                onChange={(e) => setForm((f) => ({ ...f, degree_subject: e.target.value }))}
                placeholder="e.g. Computer Science"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">University</label>
              <input
                type="text"
                value={form.university}
                onChange={(e) => setForm((f) => ({ ...f, university: e.target.value }))}
                placeholder="e.g. University of Bristol"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Graduation year */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Graduation year</label>
            <div className="flex gap-2 flex-wrap">
              {GRAD_YEARS.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, graduation_year: f.graduation_year === y ? '' : y }))}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    form.graduation_year === y
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* Target sectors */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Target sectors{' '}
              <span className="text-slate-400 font-normal">(pick all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {SECTORS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleItem('sectors', s)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    form.sectors.includes(s)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred locations */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Preferred locations{' '}
              <span className="text-slate-400 font-normal">(pick all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => toggleItem('locations', l)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    form.locations.includes(l)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Short bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              placeholder="Tell us a bit about yourself and what you're looking for…"
              rows={3}
              maxLength={300}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-slate-400 mt-1">{form.bio.length}/300</p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            {saving ? 'Saving…' : 'Complete setup →'}
          </button>

          <p className="text-center text-xs text-slate-400">
            You can update these preferences any time in Settings.
          </p>
        </form>
      </div>
    </div>
  )
}
