'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { setStatus('error'); return }
    setStatus('sent')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>InvoicePilot</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Sign in to manage your invoices</p>
        </div>

        {status === 'sent' ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Check your email</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>
              We sent a magic link to <strong>{email}</strong>.<br />
              Click it to sign in — no password needed.
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="card">
            <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
              Your email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={status === 'loading'}
              style={{ marginBottom: 12 }}
            />
            <button
              className="btn-primary"
              type="submit"
              disabled={status === 'loading'}
              style={{ width: '100%' }}
            >
              {status === 'loading' ? 'Sending...' : 'Send magic link'}
            </button>
            {status === 'error' && (
              <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 8, textAlign: 'center' }}>
                Something went wrong. Try again.
              </p>
            )}
            <p style={{ fontSize: 12, color: 'var(--dim)', textAlign: 'center', marginTop: 16 }}>
              No password needed — we email you a sign-in link.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
