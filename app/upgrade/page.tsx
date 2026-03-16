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
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, background: 'var(--bg)',
    }}>
      <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
        {/* Logo */}
        <div style={{
          display: 'inline-flex', width: 52, height: 52, borderRadius: 14,
          background: 'linear-gradient(135deg, #10B981, #059669)',
          alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 14,
        }}>⭐</div>
        <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.4px', marginBottom: 4 }}>ReviewAgent Pro</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 32 }}>Unlimited AI responses to Google reviews</div>

        {/* Plan card */}
        <div className="card" style={{ textAlign: 'left', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Pro Plan</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Everything you need</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px', color: '#10B981' }}>$49</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>/month</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              ['∞', 'Unlimited AI responses'],
              ['⭐', '3 response tones (friendly / professional / formal)'],
              ['⚡', 'Up to 10 reviews at once'],
              ['📋', 'One-click copy to clipboard'],
              ['✕', 'Cancel anytime'],
            ].map(([icon, text]) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                  background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, color: '#10B981',
                }}>{icon}</div>
                <div style={{ fontSize: 14, color: 'var(--muted)' }}>{text}</div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleUpgrade} disabled={loading} style={{
          width: '100%', padding: '14px', borderRadius: 10, border: 'none',
          background: loading ? 'var(--elevated)' : '#10B981',
          color: loading ? 'var(--muted)' : '#fff',
          fontSize: 15, fontWeight: 700, cursor: loading ? 'default' : 'pointer', marginBottom: 12,
        }}>
          {loading ? 'Redirecting to Stripe...' : 'Upgrade to Pro — $49/month'}
        </button>

        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20 }}>
          🛡 30-day money-back guarantee · Secure payment via Stripe
        </div>

        <a href="/" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>← Back to app</a>
      </div>
    </div>
  )
}
