'use client'

import { useState } from 'react'

export default function UpgradePage() {
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    setLoading(true)
    const res = await fetch('/api/stripe', { method: 'POST' })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ maxWidth: 440, width: '100%', textAlign: 'center' }}>

        <div style={{ fontSize: 40, marginBottom: 16 }}>🚀</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}>Upgrade to Pro</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32, lineHeight: 1.6 }}>
          You&apos;ve used your 2 free invoices.<br />
          Upgrade for unlimited AI follow-up emails.
        </p>

        <div className="card" style={{ marginBottom: 24, textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>InvoicePilot Pro</div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>Everything you need</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 28, fontWeight: 800 }}>$39</div>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>/month</div>
            </div>
          </div>

          {[
            '✓ Unlimited invoices',
            '✓ AI writes 3 email versions per invoice',
            '✓ Tone adapts to how overdue it is',
            '✓ Cancel anytime',
          ].map((f, i) => (
            <div key={i} style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 8 }}>{f}</div>
          ))}
        </div>

        <button
          className="btn-primary"
          onClick={handleUpgrade}
          disabled={loading}
          style={{ width: '100%', padding: '14px', fontSize: 16 }}
        >
          {loading ? 'Redirecting...' : 'Upgrade now — $39/month'}
        </button>

        <p style={{ color: 'var(--dim)', fontSize: 12, marginTop: 12 }}>
          Secure payment via Stripe. Cancel anytime.
        </p>

        <a href="/" style={{ display: 'block', marginTop: 16, color: 'var(--muted)', fontSize: 13 }}>
          ← Back to invoices
        </a>
      </div>
    </div>
  )
}
