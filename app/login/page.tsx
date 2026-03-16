'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Mode = 'signin' | 'signup' | 'reset'

export default function Login() {
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/')
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSuccess('Check your email to confirm your account.')
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) throw error
        setSuccess('Reset link sent — check your email.')
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, background: 'var(--bg)',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #10B981, #059669)',
            alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 14,
          }}>⭐</div>
          <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.4px' }}>ReviewAgent</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>AI replies to your Google reviews</div>
        </div>

        {/* Card */}
        <div className="card">
          {/* Tabs */}
          {mode !== 'reset' && (
            <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--elevated)', borderRadius: 8, padding: 4 }}>
              {(['signin', 'signup'] as Mode[]).map(m => (
                <button key={m} onClick={() => { setMode(m); setError(null); setSuccess(null) }} style={{
                  flex: 1, padding: '8px', borderRadius: 6, border: 'none', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer',
                  background: mode === m ? 'var(--surface)' : 'transparent',
                  color: mode === m ? 'var(--text)' : 'var(--muted)',
                  transition: 'all 0.15s',
                }}>
                  {m === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>
          )}

          {mode === 'reset' && (
            <div style={{ marginBottom: 20 }}>
              <button onClick={() => setMode('signin')} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, cursor: 'pointer', padding: 0 }}>
                ← Back to sign in
              </button>
              <div style={{ fontWeight: 600, fontSize: 16, marginTop: 8 }}>Reset password</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>Enter your email and we&apos;ll send a reset link.</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Email address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required autoComplete="email"
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            {mode !== 'reset' && (
              <div style={{ marginBottom: 8 }}>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Password</label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            )}

            {mode === 'signin' && (
              <div style={{ textAlign: 'right', marginBottom: 20 }}>
                <button type="button" onClick={() => { setMode('reset'); setError(null) }} style={{
                  background: 'none', border: 'none', color: 'var(--muted)', fontSize: 12, cursor: 'pointer', padding: 0,
                }}>Forgot password?</button>
              </div>
            )}

            {error && (
              <div style={{ color: 'var(--danger)', fontSize: 12, marginBottom: 14 }}>⚠ {error}</div>
            )}
            {success && (
              <div style={{ color: '#10B981', fontSize: 12, marginBottom: 14 }}>✓ {success}</div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px', borderRadius: 9, border: 'none',
              background: loading ? 'var(--elevated)' : '#10B981',
              color: loading ? 'var(--muted)' : '#fff',
              fontSize: 14, fontWeight: 600, cursor: loading ? 'default' : 'pointer',
            }}>
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign in →' : mode === 'signup' ? 'Create account →' : 'Send reset link →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 20 }}>
          $49/month · Cancel anytime
        </p>
      </div>
    </div>
  )
}
