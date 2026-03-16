'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { ThemeToggle } from '@/components/theme-provider'

type Invoice = {
  id: string
  client_name: string
  amount: number
  days_overdue: number
  description: string
}

type EmailEntry = {
  id: string
  invoiceId: string
  clientName: string
  amount: number
  versions: string[]
  generatedAt: Date
}

type Tab = 'active' | 'paid' | 'history'
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
    emptyActive: 'No active invoices',
    emptyActiveDesc: 'Add an invoice to start chasing payments.',
    emptyPaid: 'No paid invoices yet',
    emptyPaidDesc: 'When you mark an invoice as paid, it appears here.',
    emptyHistory: 'No emails generated yet',
    emptyHistoryDesc: 'Generate follow-up emails for an invoice to see history here.',
    writeEmail: '✨ Write Emails',
    writing: '✍️ Writing...',
    days: 'days',
    friendly: '😊 Friendly',
    firm: '💼 Firm',
    finalNotice: '⚠️ Final Notice',
    copy: 'Copy',
    copied: '✓ Copied',
    markPaid: 'Mark paid',
    paid: 'Paid',
    unpaid: 'Unpaid',
    getStarted: 'Get started — it\'s free',
    heroTitle: 'Stop chasing\nclients for money.',
    heroSub: 'AI writes your follow-up emails in seconds.',
    statOutstanding: 'Outstanding',
    statInvoices: 'Active',
    statAvgDays: 'Avg Days',
    statEmails: 'Emails',
    tabActive: 'Active',
    tabPaid: 'Paid',
    tabHistory: 'Email History',
    alertBanner: (n: number, amt: string) => `${n} invoice${n > 1 ? 's' : ''} seriously overdue — $${amt} at risk`,
    sendReminders: 'Send reminders',
    generatedAt: 'Generated',
    deleteConfirm: 'Delete this invoice?',
    toastPaid: '✓ Marked as paid',
    toastCopied: '✓ Email copied',
    toastDeleted: '✓ Invoice deleted',
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
    emptyActive: 'Нет активных инвойсов',
    emptyActiveDesc: 'Добавьте инвойс чтобы начать получать деньги.',
    emptyPaid: 'Нет оплаченных инвойсов',
    emptyPaidDesc: 'Когда вы отметите инвойс как оплаченный, он появится здесь.',
    emptyHistory: 'Писем ещё нет',
    emptyHistoryDesc: 'Сгенерируйте письма для инвойса — они появятся здесь.',
    writeEmail: '✨ Написать письма',
    writing: '✍️ Пишем...',
    days: 'дн.',
    friendly: '😊 Мягко',
    firm: '💼 Твёрдо',
    finalNotice: '⚠️ Финальное',
    copy: 'Копировать',
    copied: '✓ Скопировано',
    markPaid: 'Оплачено',
    paid: 'Оплачен',
    unpaid: 'Не оплачен',
    getStarted: 'Начать бесплатно',
    heroTitle: 'Хватит гоняться\nза оплатой.',
    heroSub: 'AI напишет follow-up письма за вас.',
    statOutstanding: 'К получению',
    statInvoices: 'Активных',
    statAvgDays: 'Среднее дней',
    statEmails: 'Писем',
    tabActive: 'Активные',
    tabPaid: 'Оплаченные',
    tabHistory: 'История',
    alertBanner: (n: number, amt: string) => `${n} инвойс${n > 1 ? 'а' : ''} серьёзно просрочен — $${amt} под угрозой`,
    sendReminders: 'Отправить напоминания',
    generatedAt: 'Создано',
    deleteConfirm: 'Удалить этот инвойс?',
    toastPaid: '✓ Отмечено как оплачено',
    toastCopied: '✓ Письмо скопировано',
    toastDeleted: '✓ Инвойс удалён',
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
    emptyActive: 'Žádné aktivní faktury',
    emptyActiveDesc: 'Přidejte fakturu a začněte sledovat platby.',
    emptyPaid: 'Žádné zaplacené faktury',
    emptyPaidDesc: 'Zaplacené faktury se zobrazí zde.',
    emptyHistory: 'Zatím žádné e-maily',
    emptyHistoryDesc: 'Vygenerujte e-maily pro fakturu — zobrazí se zde.',
    writeEmail: '✨ Napsat e-maily',
    writing: '✍️ Píšeme...',
    days: 'dní',
    friendly: '😊 Přátelsky',
    firm: '💼 Pevně',
    finalNotice: '⚠️ Finální',
    copy: 'Kopírovat',
    copied: '✓ Zkopírováno',
    markPaid: 'Zaplaceno',
    paid: 'Zaplacena',
    unpaid: 'Nezaplacena',
    getStarted: 'Začít zdarma',
    heroTitle: 'Přestaňte honit\nplatby.',
    heroSub: 'AI napíše vaše upomínkové e-maily za vás.',
    statOutstanding: 'Pohledávky',
    statInvoices: 'Aktivní',
    statAvgDays: 'Prům. dní',
    statEmails: 'E-maily',
    tabActive: 'Aktivní',
    tabPaid: 'Zaplacené',
    tabHistory: 'Historie',
    alertBanner: (n: number, amt: string) => `${n} faktura${n > 1 ? 'y' : ''} vážně po splatnosti — $${amt} v ohrožení`,
    sendReminders: 'Poslat upomínky',
    generatedAt: 'Vytvořeno',
    deleteConfirm: 'Smazat tuto fakturu?',
    toastPaid: '✓ Označeno jako zaplaceno',
    toastCopied: '✓ E-mail zkopírován',
    toastDeleted: '✓ Faktura smazána',
    required: 'Toto pole je povinné',
    amountInvalid: 'Zadejte platnou částku (např. 1500)',
    daysInvalid: 'Zadejte platný počet dní (1–999)',
    clientMin: 'Jméno klienta musí mít alespoň 2 znaky',
  },
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

const EMPTY_FORM = { client_name: '', amount: '', days_overdue: '', description: '' }
const EMPTY_ERRORS = { client_name: '', amount: '', days_overdue: '' }

const overdueColor = (days: number) =>
  days >= 60 ? '#FF4D6B' : days >= 30 ? 'var(--warning)' : '#60A5FA'

const emailColors = ['#60A5FA', '#FB923C', '#FF4D6B']
const emailBorders = ['rgba(96,165,250,0.2)', 'rgba(251,146,60,0.2)', 'rgba(255,77,107,0.2)']

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState(EMPTY_ERRORS)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState<string | null>(null)
  const [activeEmails, setActiveEmails] = useState<{ id: string; versions: string[] } | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [lang, setLang] = useState<Lang>('en')
  const [paidIds, setPaidIds] = useState<Set<string>>(new Set())
  const [tab, setTab] = useState<Tab>('active')
  const [emailHistory, setEmailHistory] = useState<EmailEntry[]>([])
  const [toast, setToast] = useState<string | null>(null)
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null)

  const supabase = createClient()

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2800)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('ip_lang') as Lang | null
    if (saved && saved in translations) setLang(saved)
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user)
        fetchInvoices(data.user.id)
      } else {
        window.location.href = '/login'
      }
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

  async function deleteInvoice(id: string) {
    await supabase.from('invoices').delete().eq('id', id)
    setInvoices(prev => prev.filter(inv => inv.id !== id))
    if (activeEmails?.id === id) setActiveEmails(null)
    showToast(tr.toastDeleted)
  }

  async function generate(invoice: Invoice) {
    setGenerating(invoice.id)
    setActiveEmails(null)
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    })
    const data = await res.json()
    setActiveEmails({ id: invoice.id, versions: data.versions })
    setEmailHistory(prev => [{
      id: `${invoice.id}-${Date.now()}`,
      invoiceId: invoice.id,
      clientName: invoice.client_name,
      amount: invoice.amount,
      versions: data.versions,
      generatedAt: new Date(),
    }, ...prev])
    setGenerating(null)
  }

  function markPaid(id: string) {
    setPaidIds(prev => new Set([...prev, id]))
    if (activeEmails?.id === id) setActiveEmails(null)
    showToast(tr.toastPaid)
  }

  async function copyEmail(text: string, key: string) {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
    showToast(tr.toastCopied)
  }

  // ── Not logged in ───────────────────────────────────────────
  if (!loading && !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, padding: '20px 28px 0' }}>
          <ThemeToggle />
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
            <div style={{
              display: 'inline-flex', width: 56, height: 56, borderRadius: 14,
              background: 'linear-gradient(135deg, #D97706, #F59E0B)',
              alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 24,
            }}>✈</div>
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.6px', marginBottom: 12, whiteSpace: 'pre-line', lineHeight: 1.15 }}>
              {tr.heroTitle}
            </h1>
            <p style={{ color: 'var(--muted)', marginBottom: 32, lineHeight: 1.6, fontSize: 15 }}>{tr.heroSub}</p>
            <a href="/login" className="btn-primary" style={{
              display: 'inline-block', textDecoration: 'none', padding: '13px 30px', fontSize: 15,
            }}>
              {tr.getStarted}
            </a>
          </div>
        </div>
      </div>
    )
  }

  const activeInvoices = invoices.filter(inv => !paidIds.has(inv.id))
  const paidInvoices = invoices.filter(inv => paidIds.has(inv.id))
  const totalOutstanding = activeInvoices.reduce((s, inv) => s + inv.amount, 0)
  const avgDays = activeInvoices.length
    ? Math.round(activeInvoices.reduce((s, inv) => s + inv.days_overdue, 0) / activeInvoices.length)
    : 0
  const seriouslyOverdue = activeInvoices.filter(inv => inv.days_overdue >= 30)
  const overdueAmount = seriouslyOverdue.reduce((s, inv) => s + inv.amount, 0)

  // ── Logged in ───────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 740, margin: '0 auto', padding: '36px 20px 80px' }}>

      {/* Header */}
      <div className="animate-fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'linear-gradient(135deg, #D97706, #F59E0B)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
            }}>✈</div>
            <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.3px' }}>{tr.appName}</h1>
          </div>
          <p style={{ fontSize: 12, color: 'var(--dim)', marginLeft: 40 }}>{tr.tagline}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <ThemeToggle />
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

      {/* Stats row */}
      {!loading && invoices.length > 0 && (
        <div className="animate-fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
          <div className="stat-card" style={{ borderColor: seriouslyOverdue.length > 0 ? 'rgba(255,77,107,0.25)' : undefined }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{tr.statOutstanding}</div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', color: seriouslyOverdue.length > 0 ? '#FF4D6B' : 'var(--text)' }}>${totalOutstanding.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{tr.statInvoices}</div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text)' }}>{activeInvoices.length}</div>
          </div>
          <div className="stat-card">
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{tr.statAvgDays}</div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', color: avgDays >= 30 ? 'var(--warning)' : 'var(--text)' }}>{avgDays}</div>
          </div>
          <div className="stat-card">
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{tr.statEmails}</div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--accent)' }}>{emailHistory.length * 3}</div>
          </div>
        </div>
      )}

      {/* Alert banner */}
      {!loading && seriouslyOverdue.length > 0 && tab === 'active' && (
        <div className="alert-banner animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div className="pulse-dot" />
          <span style={{ flex: 1, color: '#FF4D6B', fontWeight: 500 }}>
            {tr.alertBanner(seriouslyOverdue.length, overdueAmount.toLocaleString())}
          </span>
          <button className="btn-ghost btn-sm" style={{ color: '#FF4D6B', borderColor: 'rgba(255,77,107,0.3)', fontSize: 12 }}
            onClick={() => seriouslyOverdue.forEach(inv => generate(inv))}>
            {tr.sendReminders}
          </button>
        </div>
      )}

      {/* Add invoice form */}
      {showForm && (
        <form onSubmit={addInvoice} className="card animate-scale-in" style={{ marginBottom: 20 }} noValidate>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18, color: 'var(--text)' }}>{tr.newInvoice}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field id="client" label={tr.clientName} error={errors.client_name}>
                <input id="client" placeholder={tr.clientPlaceholder} value={form.client_name}
                  onChange={e => { setForm({ ...form, client_name: e.target.value }); if (errors.client_name) setErrors({ ...errors, client_name: '' }) }}
                  className={errors.client_name ? 'error' : ''} />
              </Field>
              <Field id="amount" label={tr.amount} error={errors.amount}>
                <input id="amount" type="number" placeholder={tr.amountPlaceholder} value={form.amount}
                  onChange={e => { setForm({ ...form, amount: e.target.value }); if (errors.amount) setErrors({ ...errors, amount: '' }) }}
                  className={errors.amount ? 'error' : ''} />
              </Field>
            </div>
            <Field id="days" label={tr.daysOverdue} error={errors.days_overdue}>
              <input id="days" type="number" placeholder={tr.daysPlaceholder} value={form.days_overdue}
                onChange={e => { setForm({ ...form, days_overdue: e.target.value }); if (errors.days_overdue) setErrors({ ...errors, days_overdue: '' }) }}
                className={errors.days_overdue ? 'error' : ''} />
            </Field>
            <Field id="desc" label={tr.project}>
              <input id="desc" placeholder={tr.projectPlaceholder} value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} />
            </Field>
            <button className="btn-primary" type="submit" disabled={saving}>
              {saving ? tr.saving : tr.saveInvoice}
            </button>
          </div>
        </form>
      )}

      {/* Tabs */}
      {!loading && (
        <div className="tabs animate-fade-up delay-2">
          {(['active', 'paid', 'history'] as Tab[]).map(t => {
            const count = t === 'active' ? activeInvoices.length : t === 'paid' ? paidInvoices.length : emailHistory.length
            const label = t === 'active' ? tr.tabActive : t === 'paid' ? tr.tabPaid : tr.tabHistory
            const isDanger = t === 'active' && seriouslyOverdue.length > 0
            return (
              <button key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                {label}
                {count > 0 && (
                  <span className={`tab-badge${isDanger ? ' danger' : ''}`}>{count}</span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '60px 0', fontSize: 14 }}>
          <div style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.7s linear infinite' }} />
          {tr.loading}
        </div>
      )}

      {/* ── Active tab ─────────────────────────────────────── */}
      {!loading && tab === 'active' && (
        activeInvoices.length === 0 ? (
          <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '52px 24px' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{tr.emptyActive}</div>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>{tr.emptyActiveDesc}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {activeInvoices.map(inv => {
              const color = overdueColor(inv.days_overdue)
              const isGen = generating === inv.id
              const hasEmails = activeEmails?.id === inv.id
              const isSerious = inv.days_overdue >= 30

              return (
                <div key={inv.id} className="animate-fade-up">
                  {/* Invoice card */}
                  <div className="invoice-card" style={isSerious ? { borderLeftColor: '#FF4D6B' } : undefined}>
                    {/* Days badge */}
                    <div style={{
                      minWidth: 58, textAlign: 'center',
                      background: `${color}18`, border: `1px solid ${color}35`,
                      borderRadius: 10, padding: '8px 4px', flexShrink: 0,
                    }}>
                      {isSerious && <div className="pulse-dot" style={{ margin: '0 auto 4px' }} />}
                      <div style={{ fontSize: 19, fontWeight: 800, color, lineHeight: 1 }}>{inv.days_overdue}</div>
                      <div style={{ fontSize: 10, color: 'var(--dim)', marginTop: 2 }}>{tr.days}</div>
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
                    <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--text)', flexShrink: 0 }}>
                      ${inv.amount.toLocaleString()}
                    </div>

                    {/* Actions */}
                    <button className="btn-primary" onClick={() => generate(inv)} disabled={isGen}
                      style={{ whiteSpace: 'nowrap', minWidth: 130, fontSize: 13, padding: '9px 14px', flexShrink: 0 }}>
                      {isGen ? tr.writing : tr.writeEmail}
                    </button>
                    <button className="btn-success btn-sm" onClick={() => markPaid(inv.id)} style={{ flexShrink: 0 }}>
                      {tr.markPaid}
                    </button>
                    <button className="btn-delete" onClick={() => { if (confirm(tr.deleteConfirm)) deleteInvoice(inv.id) }} title="Delete">
                      ×
                    </button>
                  </div>

                  {/* Email versions */}
                  {hasEmails && (
                    <div className="animate-fade-up" style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {activeEmails!.versions.map((text, i) => {
                        const labels = [tr.friendly, tr.firm, tr.finalNotice]
                        const copyKey = `active-${i}`
                        return (
                          <div key={i} className="email-card" style={{ borderColor: emailBorders[i] }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                              <span style={{ fontSize: 12, fontWeight: 600, color: emailColors[i] }}>{labels[i]}</span>
                              <button className="btn-ghost btn-sm" onClick={() => copyEmail(text, copyKey)}>
                                {copied === copyKey ? tr.copied : tr.copy}
                              </button>
                            </div>
                            <div style={{ whiteSpace: 'pre-wrap', fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
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
        )
      )}

      {/* ── Paid tab ───────────────────────────────────────── */}
      {!loading && tab === 'paid' && (
        paidInvoices.length === 0 ? (
          <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '52px 24px' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{tr.emptyPaid}</div>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>{tr.emptyPaidDesc}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {paidInvoices.map(inv => (
              <div key={inv.id} className="invoice-card paid animate-fade-up" style={{ borderLeftColor: 'var(--success)' }}>
                <div style={{
                  minWidth: 58, textAlign: 'center',
                  background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: 10, padding: '8px 4px', flexShrink: 0,
                }}>
                  <div style={{ fontSize: 15, color: 'var(--success)' }}>✓</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{inv.client_name}</span>
                    <span className="badge badge-success">{tr.paid}</span>
                  </div>
                  {inv.description && (
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{inv.description}</div>
                  )}
                </div>
                <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--muted)' }}>${inv.amount.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: 'var(--dim)', flexShrink: 0 }}>{inv.days_overdue} {tr.days} overdue</div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ── History tab ────────────────────────────────────── */}
      {!loading && tab === 'history' && (
        emailHistory.length === 0 ? (
          <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '52px 24px' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✉️</div>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{tr.emptyHistory}</div>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>{tr.emptyHistoryDesc}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {emailHistory.map(entry => {
              const isExpanded = expandedHistory === entry.id
              const labels = [tr.friendly, tr.firm, tr.finalNotice]
              return (
                <div key={entry.id} className="history-card animate-fade-up">
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
                    onClick={() => setExpandedHistory(isExpanded ? null : entry.id)}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                      background: 'var(--accent-subtle)', border: '1px solid var(--accent-glow)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                    }}>✉️</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{entry.clientName}</div>
                      <div style={{ fontSize: 11, color: 'var(--dim)', marginTop: 2 }}>
                        ${entry.amount.toLocaleString()} · {tr.generatedAt} {entry.generatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <span className="badge badge-accent">3 emails</span>
                    <span style={{ color: 'var(--dim)', fontSize: 14, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                      ▾
                    </span>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {entry.versions.map((text, i) => {
                        const copyKey = `hist-${entry.id}-${i}`
                        return (
                          <div key={i} style={{ background: 'var(--elevated)', borderRadius: 10, padding: '14px 16px', border: `1px solid ${emailBorders[i]}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                              <span style={{ fontSize: 11, fontWeight: 600, color: emailColors[i] }}>{labels[i]}</span>
                              <button className="btn-ghost btn-sm" onClick={() => copyEmail(text, copyKey)}>
                                {copied === copyKey ? tr.copied : tr.copy}
                              </button>
                            </div>
                            <div style={{ whiteSpace: 'pre-wrap', fontSize: 12, color: 'var(--muted)', lineHeight: 1.65 }}>
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
        )
      )}

      {/* Toast */}
      {toast && (
        <div className="toast">
          <span style={{ color: 'var(--success)', fontSize: 15 }}>✓</span>
          <span>{toast.replace('✓ ', '')}</span>
        </div>
      )}
    </div>
  )
}
