'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

type Tone = 'friendly' | 'professional' | 'formal'

const TONE_LABELS: Record<Tone, string> = {
  friendly: '😊 Friendly',
  professional: '💼 Professional',
  formal: '🎩 Formal',
}

const BUSINESS_TYPES = [
  'Restaurant', 'Cafe', 'Bar', 'Hair Salon', 'Nail Salon', 'Barbershop',
  'Gym / Fitness', 'Spa', 'Hotel', 'Retail Store', 'Dental Clinic',
  'Medical Clinic', 'Other',
]

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Business settings
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('Restaurant')
  const [tone, setTone] = useState<Tone>('professional')

  // Reviews
  const [reviews, setReviews] = useState<string[]>([''])
  const [responses, setResponses] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user)
        // Load saved settings
        const saved = localStorage.getItem('ra_settings')
        if (saved) {
          const s = JSON.parse(saved)
          if (s.businessName) setBusinessName(s.businessName)
          if (s.businessType) setBusinessType(s.businessType)
          if (s.tone) setTone(s.tone)
        }
      } else {
        window.location.href = '/login'
      }
      setLoading(false)
    })
  }, [])

  function saveSettings() {
    localStorage.setItem('ra_settings', JSON.stringify({ businessName, businessType, tone }))
    showToast('✓ Settings saved')
  }

  function addReview() {
    setReviews(prev => [...prev, ''])
    setResponses([])
  }

  function removeReview(i: number) {
    setReviews(prev => prev.filter((_, idx) => idx !== i))
    setResponses([])
  }

  function updateReview(i: number, val: string) {
    setReviews(prev => prev.map((r, idx) => idx === i ? val : r))
    setResponses([])
  }

  async function generate() {
    const filled = reviews.filter(r => r.trim())
    if (!businessName.trim()) { setError('Enter your business name first'); return }
    if (filled.length === 0) { setError('Paste at least one review'); return }
    setError(null)
    setGenerating(true)
    setResponses([])
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_name: businessName, business_type: businessType, tone, reviews: filled }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResponses(data.responses)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setGenerating(false)
    }
  }

  async function copyResponse(text: string, i: number) {
    await navigator.clipboard.writeText(text)
    setCopied(i)
    setTimeout(() => setCopied(null), 2000)
    showToast('✓ Copied to clipboard')
  }

  // ── Landing (not logged in) ──────────────────────────────
  if (!loading && !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{
            display: 'inline-flex', width: 60, height: 60, borderRadius: 16,
            background: 'linear-gradient(135deg, #10B981, #059669)',
            alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 24,
          }}>⭐</div>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.8px', lineHeight: 1.15, marginBottom: 14 }}>
            Stop losing customers<br />to unanswered reviews.
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
            AI writes professional responses to your Google reviews in seconds.
            Paste your reviews, get ready-to-post replies.
          </p>
          <a href="/login" style={{
            display: 'inline-block', textDecoration: 'none',
            padding: '13px 32px', fontSize: 15, fontWeight: 600,
            background: '#10B981', color: '#fff', borderRadius: 10,
          }}>
            Get started — it&apos;s free
          </a>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 14 }}>
            $49/month after trial · Cancel anytime
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 28, height: 28, border: '2px solid var(--border)', borderTopColor: '#10B981', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
    )
  }

  const filledReviews = reviews.filter(r => r.trim())

  // ── App (logged in) ──────────────────────────────────────
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px 80px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'linear-gradient(135deg, #10B981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
          }}>⭐</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.3px' }}>ReviewAgent</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>AI replies to your Google reviews</div>
          </div>
        </div>
        <button
          onClick={async () => { await supabase.auth.signOut(); setUser(null) }}
          style={{ fontSize: 13, padding: '7px 14px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--muted)', cursor: 'pointer' }}
        >
          Sign out
        </button>
      </div>

      {/* Business Settings */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: 'var(--text)' }}>Your Business</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Business name</label>
            <input
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              placeholder="Mario's Pizza"
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Business type</label>
            <select
              value={businessType}
              onChange={e => setBusinessType(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, color: 'var(--text)', cursor: 'pointer', boxSizing: 'border-box' }}
            >
              {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 8 }}>Response tone</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(Object.keys(TONE_LABELS) as Tone[]).map(t => (
              <button
                key={t}
                onClick={() => setTone(t)}
                style={{
                  padding: '7px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
                  border: tone === t ? '1px solid #10B981' : '1px solid var(--border)',
                  background: tone === t ? 'rgba(16,185,129,0.1)' : 'transparent',
                  color: tone === t ? '#10B981' : 'var(--muted)',
                  fontWeight: tone === t ? 600 : 400,
                }}
              >
                {TONE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={saveSettings}
          style={{ fontSize: 12, padding: '7px 16px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--muted)', cursor: 'pointer' }}
        >
          Save settings
        </button>
      </div>

      {/* Reviews Input */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
            Paste your reviews ({reviews.length})
          </div>
          <button
            onClick={addReview}
            style={{ fontSize: 12, padding: '6px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 7, color: 'var(--muted)', cursor: 'pointer' }}
          >
            + Add review
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {reviews.map((review, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <textarea
                value={review}
                onChange={e => updateReview(i, e.target.value)}
                placeholder={`Paste review #${i + 1} here...`}
                rows={3}
                style={{
                  width: '100%', boxSizing: 'border-box', resize: 'vertical',
                  padding: '10px 36px 10px 12px', fontSize: 13, lineHeight: 1.6,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 8, color: 'var(--text)', fontFamily: 'inherit',
                }}
              />
              {reviews.length > 1 && (
                <button
                  onClick={() => removeReview(i)}
                  style={{
                    position: 'absolute', top: 8, right: 8, width: 22, height: 22,
                    background: 'transparent', border: 'none', color: 'var(--muted)',
                    cursor: 'pointer', fontSize: 16, lineHeight: 1, borderRadius: 4,
                  }}
                >×</button>
              )}
            </div>
          ))}
        </div>

        {error && (
          <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 10 }}>⚠ {error}</div>
        )}

        <button
          onClick={generate}
          disabled={generating}
          style={{
            marginTop: 16, width: '100%', padding: '12px',
            background: generating ? 'var(--elevated)' : '#10B981',
            color: generating ? 'var(--muted)' : '#fff',
            border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 600,
            cursor: generating ? 'default' : 'pointer', transition: 'all 0.2s',
          }}
        >
          {generating
            ? '✍️ Writing responses...'
            : `✨ Generate ${filledReviews.length > 0 ? filledReviews.length : ''} response${filledReviews.length !== 1 ? 's' : ''}`
          }
        </button>
      </div>

      {/* Responses */}
      {responses.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {responses.map((response, i) => (
            <div key={i} className="card" style={{ borderLeft: '3px solid #10B981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#10B981' }}>
                  Response to review #{i + 1}
                </span>
                <button
                  onClick={() => copyResponse(response, i)}
                  style={{
                    fontSize: 12, padding: '5px 12px',
                    background: copied === i ? 'rgba(16,185,129,0.1)' : 'var(--elevated)',
                    border: `1px solid ${copied === i ? '#10B981' : 'var(--border)'}`,
                    color: copied === i ? '#10B981' : 'var(--muted)',
                    borderRadius: 6, cursor: 'pointer', fontWeight: copied === i ? 600 : 400,
                  }}
                >
                  {copied === i ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {response}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="toast">
          <span style={{ color: 'var(--success)', fontSize: 15 }}>✓</span>
          <span>{toast.replace('✓ ', '')}</span>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
