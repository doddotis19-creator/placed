'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import {
  TrendingUp, Cpu, Briefcase, Scale, Megaphone,
  Wrench, Building2, ShoppingBag, Play, Heart,
} from 'lucide-react'

const SECTORS = [
  { label: 'Finance', Icon: TrendingUp },
  { label: 'Technology', Icon: Cpu },
  { label: 'Consulting', Icon: Briefcase },
  { label: 'Law', Icon: Scale },
  { label: 'Marketing', Icon: Megaphone },
  { label: 'Engineering', Icon: Wrench },
  { label: 'Property', Icon: Building2 },
  { label: 'FMCG', Icon: ShoppingBag },
  { label: 'Media', Icon: Play },
  { label: 'Healthcare', Icon: Heart },
]

const LOCATIONS = ['London', 'Manchester', 'Edinburgh', 'Birmingham', 'Bristol', 'Remote', 'Open to anything']
const GRAD_YEARS = ['2025', '2026', '2027', '2028', '2029']

const STEPS = [
  { num: 1, title: 'Where are you studying?', sub: 'Tell us about your academic background.' },
  { num: 2, title: 'What are you interested in?', sub: 'Select the sectors you want to work in.' },
  { num: 3, title: 'Where do you want to work?', sub: 'Pick your preferred locations.' },
  { num: 4, title: 'Almost there', sub: 'A few final details to complete your profile.' },
]

export default function OnboardingPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [step, setStep] = useState(1)
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

  async function handleSubmit() {
    if (!isLoaded) return
    setSaving(true)
    setError(null)

    try {
      // Save profile to localStorage — no database required in mock mode
      localStorage.setItem('placed_profile', JSON.stringify({
        degree_subject: form.degree_subject,
        university: form.university,
        graduation_year: form.graduation_year,
        sectors: form.sectors,
        locations: form.locations,
        bio: form.bio,
        onboarding_complete: true,
      }))

      router.push('/dashboard')
    } catch (err) {
      setError(`Failed to save: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0A' }}>
        <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#6366F1', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  const currentStep = STEPS[step - 1]
  const progress = (step / STEPS.length) * 100

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12" style={{ background: '#0A0A0A' }}>
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10 justify-center">
          <div className="w-8 h-8 rounded-[8px] flex items-center justify-center" style={{ background: '#6366F1' }}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
          </div>
          <span className="font-semibold text-[15px]" style={{ color: '#F5F5F5' }}>Placed</span>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium" style={{ color: '#525252' }}>Step {step} of {STEPS.length}</span>
            <span className="text-xs font-medium" style={{ color: '#525252' }}>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: '#222222' }}>
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: '#6366F1' }} />
          </div>
        </div>

        {/* Card */}
        <div className="rounded-[10px] p-8 fade-up" key={step}
          style={{ background: '#111111', border: '1px solid #222222', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>

          {/* Step header */}
          <div className="mb-8">
            <span className="text-xs font-mono mb-2 block" style={{ color: '#6366F1' }}>0{step}</span>
            <h1 className="text-xl font-bold mb-1.5 tracking-tight" style={{ color: '#F5F5F5', letterSpacing: '-0.02em' }}>
              {currentStep.title}
            </h1>
            <p className="text-sm" style={{ color: '#525252' }}>{currentStep.sub}</p>
          </div>

          {/* Step 1: Academic info */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: '#A3A3A3' }}>University</label>
                <input
                  type="text"
                  value={form.university}
                  onChange={(e) => setForm((f) => ({ ...f, university: e.target.value }))}
                  placeholder="e.g. University of Bristol"
                  className="w-full px-4 py-2.5 text-sm outline-none transition-all duration-150 rounded-[6px]"
                  style={{ background: '#161616', border: '1px solid #222222', color: '#F5F5F5' }}
                  onFocus={e => { e.target.style.borderColor = '#6366F1' }}
                  onBlur={e => { e.target.style.borderColor = '#222222' }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: '#A3A3A3' }}>Degree subject</label>
                <input
                  type="text"
                  value={form.degree_subject}
                  onChange={(e) => setForm((f) => ({ ...f, degree_subject: e.target.value }))}
                  placeholder="e.g. Computer Science"
                  className="w-full px-4 py-2.5 text-sm outline-none transition-all duration-150 rounded-[6px]"
                  style={{ background: '#161616', border: '1px solid #222222', color: '#F5F5F5' }}
                  onFocus={e => { e.target.style.borderColor = '#6366F1' }}
                  onBlur={e => { e.target.style.borderColor = '#222222' }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2.5" style={{ color: '#A3A3A3' }}>Graduation year</label>
                <div className="flex flex-wrap gap-2">
                  {GRAD_YEARS.map((y) => {
                    const active = form.graduation_year === y
                    return (
                      <button
                        key={y}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, graduation_year: f.graduation_year === y ? '' : y }))}
                        className="px-4 py-2 text-sm font-medium rounded-[6px] transition-all duration-150"
                        style={{
                          background: active ? '#6366F1' : '#161616',
                          border: `1px solid ${active ? '#6366F1' : '#222222'}`,
                          color: active ? '#fff' : '#A3A3A3',
                        }}
                      >
                        {y}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Sectors */}
          {step === 2 && (
            <div className="grid grid-cols-2 gap-2">
              {SECTORS.map(({ label, Icon }) => {
                const active = form.sectors.includes(label)
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleItem('sectors', label)}
                    className="flex items-center gap-3 px-4 py-3 rounded-[8px] text-sm font-medium transition-all duration-150 text-left"
                    style={{
                      background: active ? 'rgba(99,102,241,0.12)' : '#161616',
                      border: `1px solid ${active ? '#6366F1' : '#222222'}`,
                      color: active ? '#818cf8' : '#A3A3A3',
                    }}
                  >
                    <span className="w-4 shrink-0" style={{ color: active ? '#6366F1' : '#525252' }}>
                      <Icon size={14} />
                    </span>
                    {label}
                    {active && (
                      <svg className="w-3.5 h-3.5 ml-auto shrink-0" fill="none" stroke="#6366F1" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* Step 3: Locations */}
          {step === 3 && (
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((loc) => {
                const active = form.locations.includes(loc)
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => toggleItem('locations', loc)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150"
                    style={{
                      background: active ? 'rgba(99,102,241,0.12)' : '#161616',
                      border: `1px solid ${active ? '#6366F1' : '#222222'}`,
                      color: active ? '#818cf8' : '#A3A3A3',
                    }}
                  >
                    {active && (
                      <svg className="w-3 h-3 shrink-0" fill="none" stroke="#6366F1" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                    {loc}
                  </button>
                )
              })}
            </div>
          )}

          {/* Step 4: Bio & finishing */}
          {step === 4 && (
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: '#A3A3A3' }}>Short bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder="Tell us a bit about yourself and what you're looking for…"
                  rows={4}
                  maxLength={300}
                  className="w-full px-4 py-3 text-sm outline-none transition-all duration-150 rounded-[6px] resize-none"
                  style={{ background: '#161616', border: '1px solid #222222', color: '#F5F5F5' }}
                  onFocus={e => { e.target.style.borderColor = '#6366F1' }}
                  onBlur={e => { e.target.style.borderColor = '#222222' }}
                />
                <p className="text-xs mt-1.5 text-right" style={{ color: '#525252' }}>{form.bio.length}/300</p>
              </div>

              {/* CV upload area */}
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: '#A3A3A3' }}>Upload CV <span style={{ color: '#525252' }}>(optional)</span></label>
                <div className="rounded-[8px] border-2 border-dashed px-6 py-8 text-center cursor-pointer transition-all duration-150"
                  style={{ borderColor: '#222222' }}
                  onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#6366F1' }}
                  onDragLeave={e => { e.currentTarget.style.borderColor = '#222222' }}>
                  <svg className="w-8 h-8 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ color: '#525252' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <p className="text-sm font-medium mb-1" style={{ color: '#A3A3A3' }}>Drag and drop your CV here</p>
                  <p className="text-xs" style={{ color: '#525252' }}>PDF or Word — we'll use it to personalise your cover letters</p>
                  <label className="mt-4 inline-block px-4 py-2 rounded-[6px] text-xs font-medium cursor-pointer transition-all duration-150"
                    style={{ background: '#161616', border: '1px solid #222222', color: '#A3A3A3' }}>
                    Browse files
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" />
                  </label>
                </div>
              </div>

              {error && (
                <div className="rounded-[6px] px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' }}>
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid #222222' }}>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="px-4 py-2.5 text-sm font-medium rounded-[6px] transition-all duration-150"
                style={{ background: '#161616', border: '1px solid #222222', color: '#A3A3A3' }}
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {step < STEPS.length ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                className="px-6 py-2.5 text-sm font-semibold rounded-[6px] transition-all duration-150"
                style={{ background: '#6366F1', color: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="px-6 py-2.5 text-sm font-semibold rounded-[6px] transition-all duration-150 disabled:opacity-50"
                style={{ background: '#6366F1', color: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
              >
                {saving ? 'Saving…' : 'Complete setup →'}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#525252' }}>
          You can update all of this any time in Settings.
        </p>
      </div>
    </div>
  )
}
