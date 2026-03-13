'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

type Invoice = {
  id: string
  client_name: string
  amount: number
  days_overdue: number
  description: string
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ client_name: '', amount: '', days_overdue: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState<string | null>(null)
  const [emails, setEmails] = useState<{ id: string; versions: string[] } | null>(null)
  const [copied, setCopied] = useState<number | null>(null)

  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) fetchInvoices(data.user.id)
      else setLoading(false)
    })
  }, [])

  async function fetchInvoices(uid: string) {
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
    setInvoices(data ?? [])
    setLoading(false)
  }

  async function addInvoice(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    await supabase.from('invoices').insert({
      client_name: form.client_name,
      amount: Number(form.amount),
      days_overdue: Number(form.days_overdue),
      description: form.description,
      user_id: user.id,
    })
    setForm({ client_name: '', amount: '', days_overdue: '', description: '' })
    setShowForm(false)
    setSaving(false)
    fetchInvoices(user.id)
  }

  async function generate(invoice: Invoice) {
    setGenerating(invoice.id)
    setEmails(null)
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    })
    const data = await res.json()
    setEmails({ id: invoice.id, versions: data.versions })
    setGenerating(null)
  }

  async function copy(text: string, idx: number) {
    await navigator.clipboard.writeText(text)
    setCopied(idx)
    setTimeout(() => setCopied(null), 2000)
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setInvoices([])
  }

  const overdueColor = (days: number) => {
    if (days >= 60) return 'var(--danger)'
    if (days >= 30) return 'var(--warning)'
    return '#60A5FA'
  }

  // Not logged in
  if (!loading && !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ textAlign: 'center', maxWidth: 440 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>InvoicePilot</h1>
          <p style={{ color: 'var(--muted)', marginBottom: 32, lineHeight: 1.6 }}>
            Stop chasing clients for money.<br />AI writes your follow-up emails in seconds.
          </p>
          <a href="/login" style={{
            display: 'inline-block', background: 'var(--accent)', color: 'white',
            padding: '12px 28px', borderRadius: 8, fontWeight: 600, textDecoration: 'none', fontSize: 15,
          }}>
            Get started — it&apos;s free
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px' }}>InvoicePilot</h1>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>AI writes your follow-up emails</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Invoice'}
          </button>
          <button className="btn-ghost" onClick={signOut} style={{ fontSize: 13, padding: '8px 14px' }}>
            Sign out
          </button>
        </div>
      </div>

      {/* Add invoice form */}
      {showForm && (
        <form onSubmit={addInvoice} className="card" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>New Invoice</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Client name</label>
                <input placeholder="Acme Corp" value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Amount ($)</label>
                <input type="number" placeholder="2400" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Days overdue</label>
              <input type="number" placeholder="14" value={form.days_overdue} onChange={e => setForm({ ...form, days_overdue: e.target.value })} required />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Project (optional)</label>
              <input placeholder="Website redesign" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <button className="btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Invoice'}
            </button>
          </div>
        </form>
      )}

      {/* Invoice list */}
      {loading ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>Loading...</p>
      ) : invoices.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
          <p style={{ color: 'var(--muted)' }}>No invoices yet. Add your first overdue invoice above.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {invoices.map(inv => (
            <div key={inv.id}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  minWidth: 64, textAlign: 'center',
                  background: `${overdueColor(inv.days_overdue)}15`,
                  border: `1px solid ${overdueColor(inv.days_overdue)}40`,
                  borderRadius: 8, padding: '8px 4px',
                }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: overdueColor(inv.days_overdue) }}>{inv.days_overdue}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>days</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{inv.client_name}</div>
                  {inv.description && <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{inv.description}</div>}
                </div>
                <div style={{ fontWeight: 700, fontSize: 18, marginRight: 8 }}>${inv.amount.toLocaleString()}</div>
                <button className="btn-primary" onClick={() => generate(inv)} disabled={generating === inv.id} style={{ whiteSpace: 'nowrap', minWidth: 130 }}>
                  {generating === inv.id ? '✍️ Writing...' : '✨ Write Email'}
                </button>
              </div>

              {emails?.id === inv.id && (
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {emails.versions.map((text, i) => (
                    <div key={i} className="card" style={{ borderColor: i === 0 ? '#60A5FA40' : i === 1 ? '#F59E0B40' : '#EF444440' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: i === 0 ? '#60A5FA' : i === 1 ? 'var(--warning)' : 'var(--danger)' }}>
                          {i === 0 ? '😊 Friendly' : i === 1 ? '💼 Firm' : '⚠️ Final Notice'}
                        </span>
                        <button className="btn-ghost" onClick={() => copy(text, i)} style={{ fontSize: 13, padding: '6px 14px' }}>
                          {copied === i ? '✓ Copied!' : 'Copy'}
                        </button>
                      </div>
                      <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, fontFamily: 'inherit' }}>
                        {text}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
