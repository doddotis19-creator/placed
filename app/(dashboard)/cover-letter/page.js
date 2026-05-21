'use client'

import { useState } from 'react'

export default function CoverLetterPage() {
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [background, setBackground] = useState('')
  const [tone, setTone] = useState('Professional')
  const [generated, setGenerated] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const TONES = ['Professional', 'Enthusiastic', 'Concise']

  async function handleGenerate() {
    if (!company || !role || !jobDesc) return
    setLoading(true)

    // Simulate generation — replace with real AI call when ready
    await new Promise(r => setTimeout(r, 1800))

    setGenerated(`Dear Hiring Manager at ${company},

I am writing to express my sincere interest in the ${role} position at ${company}. Having reviewed the role requirements carefully, I am confident that my background and passion for this field make me a strong candidate.

${background ? `${background}\n\n` : ''}My academic journey has equipped me with a rigorous analytical foundation, and I am particularly drawn to ${company}'s commitment to excellence and innovation. I have consistently demonstrated the ability to deliver results in fast-paced, collaborative environments.

I would welcome the opportunity to discuss how my skills and enthusiasm can contribute to your team. Thank you for considering my application.

Yours sincerely,
[Your Name]`)

    setLoading(false)
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(generated)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
        <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: '#F5F5F5', letterSpacing: '-0.02em' }}>
          Cover Letter Generator
        </h1>
        <p className="text-sm" style={{ color: '#525252' }}>Generate tailored cover letters in seconds using AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Input panel ── */}
        <div className="rounded-[10px] p-6 flex flex-col gap-5"
          style={{ background: '#111111', border: '1px solid #222222', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
          <h2 className="text-sm font-semibold" style={{ color: '#F5F5F5' }}>Job details</h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: '#A3A3A3' }}>Company name</label>
            <input type="text" value={company} onChange={e => setCompany(e.target.value)}
              placeholder="e.g. Goldman Sachs"
              className="w-full px-4 py-2.5 text-sm outline-none transition-all duration-150"
              style={inputStyle} {...focusHandlers} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: '#A3A3A3' }}>Role title</label>
            <input type="text" value={role} onChange={e => setRole(e.target.value)}
              placeholder="e.g. Summer Analyst"
              className="w-full px-4 py-2.5 text-sm outline-none transition-all duration-150"
              style={inputStyle} {...focusHandlers} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: '#A3A3A3' }}>Job description</label>
            <textarea rows={5} value={jobDesc} onChange={e => setJobDesc(e.target.value)}
              placeholder="Paste the job description here…"
              className="w-full px-4 py-3 text-sm outline-none resize-none transition-all duration-150"
              style={inputStyle} {...focusHandlers} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: '#A3A3A3' }}>
              Your background <span style={{ color: '#525252' }}>(optional)</span>
            </label>
            <textarea rows={3} value={background} onChange={e => setBackground(e.target.value)}
              placeholder="Briefly describe your skills, experience, or anything to highlight…"
              className="w-full px-4 py-3 text-sm outline-none resize-none transition-all duration-150"
              style={inputStyle} {...focusHandlers} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium" style={{ color: '#A3A3A3' }}>Tone</label>
            <div className="flex gap-2">
              {TONES.map((t) => (
                <button key={t} onClick={() => setTone(t)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-[6px] transition-all duration-150"
                  style={{
                    background: tone === t ? '#6366F1' : '#161616',
                    border: `1px solid ${tone === t ? '#6366F1' : '#222222'}`,
                    color: tone === t ? '#fff' : '#A3A3A3',
                  }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !company || !role || !jobDesc}
            className="w-full py-3 text-sm font-semibold rounded-[6px] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: '#6366F1', color: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: '#ffffff80', borderTopColor: 'transparent' }} />
                Generating…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                Generate cover letter
              </>
            )}
          </button>
        </div>

        {/* ── Output panel ── */}
        <div className="rounded-[10px] flex flex-col overflow-hidden"
          style={{ background: '#111111', border: '1px solid #222222', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>

          {/* Output header */}
          <div className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{ borderBottom: '1px solid #222222' }}>
            <h2 className="text-sm font-semibold" style={{ color: '#F5F5F5' }}>Generated letter</h2>
            {generated && (
              <div className="flex items-center gap-2">
                <button onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-[6px] transition-all duration-150"
                  style={{ background: '#161616', border: '1px solid #222222', color: '#A3A3A3' }}>
                  {copied ? (
                    <><svg className="w-3.5 h-3.5" fill="none" stroke="#22C55E" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg><span style={{ color: '#22C55E' }}>Copied!</span></>
                  ) : (
                    <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>Copy</>
                  )}
                </button>
                <button onClick={() => handleGenerate()}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-[6px] transition-all duration-150"
                  style={{ background: '#161616', border: '1px solid #222222', color: '#A3A3A3' }}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Regenerate
                </button>
              </div>
            )}
          </div>

          {/* Letter body */}
          <div className="flex-1 p-6 overflow-y-auto">
            {generated ? (
              <>
                {/* Paper document */}
                <div className="rounded-[8px] p-6 mb-4 min-h-[300px]"
                  style={{ background: '#0d0d0d', border: '1px solid #1a1a1a' }}>
                  <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans" style={{ color: '#A3A3A3' }}>
                    {generated}
                  </pre>
                </div>

                {/* AI feedback chips */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Strong opening', color: '#22C55E' },
                    { label: 'Good skill alignment', color: '#22C55E' },
                    { label: 'Consider more specific examples', color: '#F59E0B' },
                  ].map(({ label, color }) => (
                    <span key={label} className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
                      style={{ background: `${color}12`, color, border: `1px solid ${color}25` }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                      {label}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ background: 'rgba(99,102,241,0.1)' }}>
                  <svg className="w-6 h-6" fill="none" stroke="#6366F1" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: '#A3A3A3' }}>Your letter will appear here</p>
                <p className="text-xs" style={{ color: '#525252' }}>Fill in the details on the left and hit Generate.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
