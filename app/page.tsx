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

type Lang = 'en' | 'ru' | 'cs'

const translations = {
  en: {
    appName: 'InvoicePilot',
    tagline: 'AI writes your follow-up emails',
    addInvoice: '+ Add Invoice',
    cancel: 'Cancel',
    signOut: 'Sign out',
    newInvoice: 'New Invoice',
    clientName: 'Client name',
    clientPlaceholder: 'Acme Corp',
    amount: 'Amount ($)',
    amountPlaceholder: '2400',
    daysOverdue: 'Days overdue',
    daysPlaceholder: '14',
    project: 'Project description (optional)',
    projectPlaceholder: 'Website redesign for Q1',
    saveInvoice: 'Save Invoice',
    saving: 'Saving...',
    loading: 'Loading your invoices...',
    emptyTitle: 'No overdue invoices',
    emptyDesc: 'Add an invoice above to generate follow-up emails.',
    writeEmail: '✨ Write Emails',
    writing: '✍️ Writing...',
    days: 'days',
    friendly: '😊 Friendly',
    firm: '💼 Firm',
    finalNotice: '⚠️ Final Notice',
    copy: 'Copy',
    copied: '✓ Copied!',
    getStarted: 'Get started — it\'s free',
    heroTitle: 'Stop chasing\nclients for money.',
    heroSub: 'AI writes your follow-up emails in seconds.',
    // Validation
    required: 'This field is required',
    amountInvalid: 'Enter a valid amount (e.g. 1500)',
    daysInvalid: 'Enter valid number of days (1–999)',
    clientMin: 'Client name must be at least 2 characters',
  },
  ru: {
    appName: 'InvoicePilot',
    tagline: 'AI пишет follow-up письма за вас',
    addInvoice: '+ Добавить инвойс',
    cancel: 'Отмена',
    signOut: 'Выйти',
    newInvoice: 'Новый инвойс',
    clientName: 'Имя клиента',
    clientPlaceholder: 'Acme Corp',
    amount: 'Сумма ($)',
    amountPlaceholder: '2400',
    daysOverdue: 'Дней просрочки',
    daysPlaceholder: '14',
    project: 'Описание проекта (необязательно)',
    projectPlaceholder: 'Редизайн сайта Q1',
    saveInvoice: 'Сохранить',
    saving: 'Сохраняем...',
    loading: 'Загружаем инвойсы...',
    emptyTitle: 'Нет просроченных инвойсов',
    emptyDesc: 'Добавьте инвойс выше чтобы сгенерировать письма.',
    writeEmail: '✨ Написать письма',
    writing: '✍️ Пишем...',
    days: 'дн.',
    friendly: '😊 Мягко',
    firm: '💼 Твёрдо',
    finalNotice: '⚠️ Финальное',
    copy: 'Копировать',
    copied: '✓ Скопировано!',
    getStarted: 'Начать бесплатно',
    heroTitle: 'Хватит гоняться\nза оплатой.',
    heroSub: 'AI напишет follow-up письма за вас.',
    required: 'Это поле обязательно',
    amountInvalid: 'Введите корректную сумму (например, 1500)',
    daysInvalid: 'Введите количество дней от 1 до 999',
    clientMin: 'Имя клиента должно быть не менее 2 символов',
  },
  cs: {
    appName: 'InvoicePilot',
    tagline: 'AI píše vaše upomínkové e-maily',
    addInvoice: '+ Přidat fakturu',
    cancel: 'Zrušit',
    signOut: 'Odhlásit',
    newInvoice: 'Nová faktura',
    clientName: 'Jméno klienta',
    clientPlaceholder: 'Acme Corp',
    amount: 'Částka ($)',
    amountPlaceholder: '2400',
    daysOverdue: 'Dní po splatnosti',
    daysPlaceholder: '14',
    project: 'Popis projektu (volitelné)',
    projectPlaceholder: 'Redesign webu Q1',
    saveInvoice: 'Uložit fakturu',
    saving: 'Ukládáme...',
    loading: 'Načítáme faktury...',
    emptyTitle: 'Žádné faktury po splatnosti',
    emptyDesc: 'Přidejte fakturu výše a vygenerujte upomínkové e-maily.',
    writeEmail: '✨ Napsat e-maily',
    writing: '✍️ Píšeme...',
    days: 'dní',
    friendly: '😊 Přátelsky',
    firm: '💼 Pevně',
    finalNotice: '⚠️ Finální',
    copy: 'Kopírovat',
    copied: '✓ Zkopírováno!',
    getStarted: 'Začít zdarma',
    heroTitle: 'Přestaňte honit\nplatby.',
    heroSub: 'AI napíše vaše upomínkové e-maily za vás.',
    required: 'Toto pole je povinné',
    amountInvalid: 'Zadejte platnou částku (např. 1500)',
    daysInvalid: 'Zadejte platný počet dní (1–999)',
    clientMin: 'Jméno klienta musí mít alespoň 2 znaky',
  },
}

const EMPTY_FORM = { client_name: '', amount: '', days_overdue: '', description: '' }
const EMPTY_ERRORS = { client_name: '', amount: '', days_overdue: '' }

const overdueColor = (days: number) =>
  days >= 60 ? 'var(--danger)' : days >= 30 ? 'var(--warning)' : '#60A5FA'

const emailColors = ['#60A5FA', 'var(--warning)', 'var(--danger)']
const emailBorders = ['#60A5FA40', '#F59E0B40', '#EF444440']

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState(EMPTY_ERRORS)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState<string | null>(null)
  const [emails, setEmails] = useState<{ id: string; versions: string[] } | null>(null)
  const [copied, setCopied] = useState<number | null>(null)
  const [lang, setLang] = useState<Lang>('en')

  const supabase = createClient()

  useEffect(() => {
    const saved = localStorage.getItem('ip_lang') as Lang | null
    if (saved && saved in translations) setLang(saved)
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) fetchInvoices(data.user.id)
      else setLoading(false)
    })
  }, [])

  function switchLang(l: Lang) {
    setLang(l)
    localStorage.setItem('ip_lang', l)
  }

  const tr = translations[lang]

  async function fetchInvoices(uid: string) {
    const { data } = await supabase
      .from('invoices').select('*').eq('user_id', uid)
      .order('created_at', { ascending: false })
    setInvoices(data ?? [])
    setLoading(false)
  }

  function validate() {
    const errs = { client_name: '', amount: '', days_overdue: '' }
    if (!form.client_name.trim()) errs.client_name = tr.required
    else if (form.client_name.trim().length < 2) errs.client_name = tr.clientMin
    if (!form.amount) errs.amount = tr.required
    else if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) errs.amount = tr.amountInvalid
    if (!form.days_overdue) errs.days_overdue = tr.required
    else if (isNaN(Number(form.days_overdue)) || Number(form.days_overdue) < 1 || Number(form.days_overdue) > 999) errs.days_overdue = tr.daysInvalid
    setErrors(errs)
    return !errs.client_name && !errs.amount && !errs.days_overdue
  }

  async function addInvoice(e: React.FormEvent) {
    e.preventDefault()
    if (!validate() || !user) return
    setSaving(true)
    await supabase.from('invoices').insert({
      client_name: form.client_name.trim(),
      amount: Number(form.amount),
      days_overdue: Number(form.days_overdue),
      description: form.description.trim(),
      user_id: user.id,
    })
    setForm(EMPTY_FORM)
    setErrors(EMPTY_ERRORS)
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

  async function copyEmail(text: string, idx: number) {
    await navigator.clipboard.writeText(text)
    setCopied(idx)
    setTimeout(() => setCopied(null), 2000)
  }

  function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
    return (
      <div>
        <label htmlFor={id} style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: 7 }}>
          {label}
        </label>
        {children}
        {error && (
          <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>⚠</span> {error}
          </div>
        )}
      </div>
    )
  }

  // ── Not logged in ───────────────────────────────────────────
  if (!loading && !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 28px 0' }}>
          <div style={{ display: 'flex', gap: 4, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 4 }}>
            {(['en', 'ru', 'cs'] as Lang[]).map(l => (
              <button key={l} onClick={() => switchLang(l)} style={{
                padding: '5px 12px', borderRadius: 7, fontSize: 13, fontWeight: 500,
                background: lang === l ? 'var(--accent)' : 'transparent',
                color: lang === l ? 'white' : 'var(--muted)', transition: 'all 0.2s',
              }}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="animate-fade-up" style={{ textAlign: 'center', maxWidth: 400 }}>
            <div style={{ fontSize: 42, marginBottom: 16 }}>✈</div>
            <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.6px', marginBottom: 12, whiteSpace: 'pre-line' }}>
              {tr.heroTitle}
            </h1>
            <p style={{ color: 'var(--muted)', marginBottom: 32, lineHeight: 1.6, fontSize: 15 }}>{tr.heroSub}</p>
            <a href="/login" style={{
              display: 'inline-block', background: 'var(--accent)', color: 'white',
              padding: '13px 30px', borderRadius: 10, fontWeight: 600, textDecoration: 'none',
              fontSize: 15, transition: 'all 0.2s',
            }}>
              {tr.getStarted}
            </a>
          </div>
        </div>
      </div>
    )
  }

  // ── Logged in ───────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px' }}>

      {/* Header */}
      <div className="animate-fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: 'linear-gradient(135deg, #6366F1, #818CF8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
            }}>✈</div>
            <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.3px' }}>{tr.appName}</h1>
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginLeft: 38 }}>{tr.tagline}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* Lang switcher */}
          <div style={{ display: 'flex', gap: 2, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 3 }}>
            {(['en', 'ru', 'cs'] as Lang[]).map(l => (
              <button key={l} onClick={() => switchLang(l)} style={{
                padding: '4px 9px', borderRadius: 5, fontSize: 11, fontWeight: 600,
                background: lang === l ? 'var(--accent)' : 'transparent',
                color: lang === l ? 'white' : 'var(--dim)', transition: 'all 0.2s',
              }}>{l.toUpperCase()}</button>
            ))}
          </div>
          <button className="btn-primary" onClick={() => { setShowForm(!showForm); setErrors(EMPTY_ERRORS) }} style={{ fontSize: 13, padding: '8px 14px' }}>
            {showForm ? tr.cancel : tr.addInvoice}
          </button>
          <button className="btn-ghost" onClick={async () => { await supabase.auth.signOut(); setUser(null) }} style={{ fontSize: 13, padding: '8px 14px' }}>
            {tr.signOut}
          </button>
        </div>
      </div>

      {/* Add invoice form */}
      {showForm && (
        <form onSubmit={addInvoice} className="card animate-scale-in" style={{ marginBottom: 24 }} noValidate>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18, color: 'var(--text)' }}>{tr.newInvoice}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field id="client" label={tr.clientName} error={errors.client_name}>
                <input
                  id="client"
                  placeholder={tr.clientPlaceholder}
                  value={form.client_name}
                  onChange={e => { setForm({ ...form, client_name: e.target.value }); if (errors.client_name) setErrors({ ...errors, client_name: '' }) }}
                  className={errors.client_name ? 'error' : ''}
                />
              </Field>
              <Field id="amount" label={tr.amount} error={errors.amount}>
                <input
                  id="amount"
                  type="number"
                  placeholder={tr.amountPlaceholder}
                  value={form.amount}
                  onChange={e => { setForm({ ...form, amount: e.target.value }); if (errors.amount) setErrors({ ...errors, amount: '' }) }}
                  className={errors.amount ? 'error' : ''}
                />
              </Field>
            </div>
            <Field id="days" label={tr.daysOverdue} error={errors.days_overdue}>
              <input
                id="days"
                type="number"
                placeholder={tr.daysPlaceholder}
                value={form.days_overdue}
                onChange={e => { setForm({ ...form, days_overdue: e.target.value }); if (errors.days_overdue) setErrors({ ...errors, days_overdue: '' }) }}
                className={errors.days_overdue ? 'error' : ''}
              />
            </Field>
            <Field id="desc" label={tr.project}>
              <input
                id="desc"
                placeholder={tr.projectPlaceholder}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </Field>
            <button className="btn-primary" type="submit" disabled={saving}>
              {saving ? tr.saving : tr.saveInvoice}
            </button>
          </div>
        </form>
      )}

      {/* Invoice list */}
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '60px 0', fontSize: 14 }}>
          <div style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.7s linear infinite' }} />
          {tr.loading}
        </div>
      ) : invoices.length === 0 ? (
        <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '56px 24px' }}>
          <div style={{ fontSize: 38, marginBottom: 14 }}>📋</div>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{tr.emptyTitle}</div>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>{tr.emptyDesc}</p>
        </div>
      ) : (
        <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {invoices.map(inv => {
            const color = overdueColor(inv.days_overdue)
            const isGen = generating === inv.id
            const hasEmails = emails?.id === inv.id

            return (
              <div key={inv.id}>
                {/* Invoice card */}
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
                  {/* Days badge */}
                  <div style={{
                    minWidth: 60, textAlign: 'center',
                    background: `${color}15`, border: `1px solid ${color}40`,
                    borderRadius: 10, padding: '8px 4px', flexShrink: 0,
                  }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1 }}>{inv.days_overdue}</div>
                    <div style={{ fontSize: 10, color: 'var(--dim)', marginTop: 3 }}>{tr.days}</div>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {inv.client_name}
                    </div>
                    {inv.description && (
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {inv.description}
                      </div>
                    )}
                  </div>

                  {/* Amount */}
                  <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)', flexShrink: 0 }}>
                    ${inv.amount.toLocaleString()}
                  </div>

                  {/* Action */}
                  <button
                    className="btn-primary"
                    onClick={() => generate(inv)}
                    disabled={isGen}
                    style={{ whiteSpace: 'nowrap', minWidth: 140, fontSize: 13, padding: '9px 16px', flexShrink: 0 }}
                  >
                    {isGen ? tr.writing : tr.writeEmail}
                  </button>
                </div>

                {/* Email versions */}
                {hasEmails && (
                  <div className="animate-fade-up" style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {emails!.versions.map((text, i) => {
                      const labels = [tr.friendly, tr.firm, tr.finalNotice]
                      return (
                        <div key={i} className="card" style={{ borderColor: emailBorders[i], padding: '18px 20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: emailColors[i] }}>{labels[i]}</span>
                            <button
                              className="btn-ghost"
                              onClick={() => copyEmail(text, i)}
                              style={{ fontSize: 12, padding: '6px 14px', borderRadius: 7 }}
                            >
                              {copied === i ? tr.copied : tr.copy}
                            </button>
                          </div>
                          <div style={{
                            whiteSpace: 'pre-wrap', fontSize: 13, color: 'var(--muted)',
                            lineHeight: 1.7, fontFamily: 'inherit',
                          }}>
                            {text}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
