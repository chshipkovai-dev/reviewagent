'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

type Lang = 'en' | 'ru' | 'cs'

const translations = {
  en: {
    badge: 'AI-powered invoice follow-ups',
    title: 'Stop chasing clients\nfor money.',
    sub: 'Paste your invoice details. AI writes 3 follow-up emails — Friendly, Firm, and Final Notice. Copy and send in 10 seconds.',
    benefits: [
      { icon: '✍️', text: '3 email versions per invoice' },
      { icon: '🎯', text: 'Tone adapts to days overdue' },
      { icon: '⚡', text: 'Ready in under 10 seconds' },
    ],
    label: 'Your email address',
    placeholder: 'you@example.com',
    submit: 'Send magic link →',
    submitting: 'Sending...',
    noPassword: 'No password needed — we\'ll email you a sign-in link.',
    sentTitle: 'Check your inbox ✉️',
    sentSub: (email: string) => `We sent a magic link to ${email}. Click it to sign in — no password needed.`,
    error: 'Something went wrong. Please try again.',
    emailRequired: 'Please enter your email address.',
    emailInvalid: 'Please enter a valid email address.',
    footer: 'Trusted by freelancers worldwide · Cancel anytime',
  },
  ru: {
    badge: 'AI-автоматизация follow-up',
    title: 'Хватит гоняться\nза оплатой.',
    sub: 'Введите данные инвойса. AI напишет 3 письма — мягкое, твёрдое и финальное уведомление. Скопируй и отправь за 10 секунд.',
    benefits: [
      { icon: '✍️', text: '3 варианта письма на каждый инвойс' },
      { icon: '🎯', text: 'Тон меняется в зависимости от просрочки' },
      { icon: '⚡', text: 'Готово меньше чем за 10 секунд' },
    ],
    label: 'Ваш email',
    placeholder: 'you@example.com',
    submit: 'Отправить magic link →',
    submitting: 'Отправляем...',
    noPassword: 'Пароль не нужен — отправим ссылку для входа на почту.',
    sentTitle: 'Проверьте почту ✉️',
    sentSub: (email: string) => `Мы отправили magic link на ${email}. Нажмите на него чтобы войти.`,
    error: 'Что-то пошло не так. Попробуйте ещё раз.',
    emailRequired: 'Введите ваш email.',
    emailInvalid: 'Введите корректный email адрес.',
    footer: 'Используют фрилансеры по всему миру · Отмена в любой момент',
  },
  cs: {
    badge: 'AI follow-up pro faktury',
    title: 'Přestaňte honit\nplatby.',
    sub: 'Zadejte údaje o faktuře. AI napíše 3 upomínkové e-maily — přátelský, pevný a finální. Zkopírujte a odešlete za 10 sekund.',
    benefits: [
      { icon: '✍️', text: '3 verze e-mailu na každou fakturu' },
      { icon: '🎯', text: 'Tón se přizpůsobuje době po splatnosti' },
      { icon: '⚡', text: 'Připraveno za méně než 10 sekund' },
    ],
    label: 'Vaše e-mailová adresa',
    placeholder: 'vy@example.com',
    submit: 'Odeslat magic link →',
    submitting: 'Odesíláme...',
    noPassword: 'Žádné heslo — pošleme vám odkaz pro přihlášení.',
    sentTitle: 'Zkontrolujte e-mail ✉️',
    sentSub: (email: string) => `Poslali jsme magic link na ${email}. Klikněte na něj pro přihlášení.`,
    error: 'Něco se pokazilo. Zkuste to znovu.',
    emailRequired: 'Zadejte prosím svou e-mailovou adresu.',
    emailInvalid: 'Zadejte prosím platnou e-mailovou adresu.',
    footer: 'Důvěřují freelanceři po celém světě · Zrušení kdykoli',
  },
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('ip_lang') as Lang | null
    if (saved && saved in translations) setLang(saved)
  }, [])

  function switchLang(l: Lang) {
    setLang(l)
    localStorage.setItem('ip_lang', l)
  }

  const tr = translations[lang]

  function validateEmail(val: string): string {
    if (!val.trim()) return tr.emailRequired
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return tr.emailInvalid
    return ''
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const err = validateEmail(email)
    if (err) { setEmailError(err); return }
    setEmailError('')
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Language switcher */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 28px 0' }} className="animate-fade-in">
        <div style={{ display: 'flex', gap: 4, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 4 }}>
          {(['en', 'ru', 'cs'] as Lang[]).map(l => (
            <button
              key={l}
              onClick={() => switchLang(l)}
              style={{
                padding: '5px 12px', borderRadius: 7, fontSize: 13, fontWeight: 500,
                background: lang === l ? 'var(--accent)' : 'transparent',
                color: lang === l ? 'white' : 'var(--muted)',
                transition: 'all 0.2s',
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Logo */}
          <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 14, padding: '10px 18px', marginBottom: 24,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #6366F1, #818CF8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
              }}>✈</div>
              <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.3px' }}>InvoicePilot</span>
            </div>

            {/* Badge */}
            <div style={{ marginBottom: 16 }}>
              <span style={{
                background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
                color: '#818CF8', fontSize: 12, fontWeight: 600,
                padding: '4px 12px', borderRadius: 999, letterSpacing: '0.3px',
              }}>
                {tr.badge}
              </span>
            </div>

            <h1 style={{
              fontSize: 30, fontWeight: 800, letterSpacing: '-0.6px',
              lineHeight: 1.15, marginBottom: 14, whiteSpace: 'pre-line',
            }}>
              {tr.title}
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.65, maxWidth: 360, margin: '0 auto' }}>
              {tr.sub}
            </p>
          </div>

          {/* Benefits */}
          <div className="animate-fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
            {tr.benefits.map((b, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '11px 16px',
              }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{b.icon}</span>
                <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>{b.text}</span>
              </div>
            ))}
          </div>

          {/* Form / Sent state */}
          {status === 'sent' ? (
            <div className="card animate-scale-in" style={{ textAlign: 'center', padding: '40px 28px' }}>
              <div style={{ fontSize: 44, marginBottom: 16 }}>✉️</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{tr.sentTitle}</h2>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>
                {tr.sentSub(email)}
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="card animate-fade-up delay-2" noValidate>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
                  {tr.label}
                </label>
                <input
                  type="email"
                  placeholder={tr.placeholder}
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (emailError) setEmailError('') }}
                  onBlur={() => { if (email) setEmailError(validateEmail(email)) }}
                  disabled={status === 'loading'}
                  className={emailError ? 'error' : ''}
                  style={{ fontSize: 15 }}
                />
                {emailError && (
                  <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span>⚠</span> {emailError}
                  </div>
                )}
              </div>

              <button
                className="btn-primary"
                type="submit"
                disabled={status === 'loading'}
                style={{ width: '100%', padding: '13px', fontSize: 15 }}
              >
                {status === 'loading' ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    {tr.submitting}
                  </span>
                ) : tr.submit}
              </button>

              {status === 'error' && (
                <div style={{
                  color: 'var(--danger)', fontSize: 13, marginTop: 12, textAlign: 'center',
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 8, padding: '10px 14px',
                }}>
                  {tr.error}
                </div>
              )}

              <p style={{ fontSize: 12, color: 'var(--dim)', textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>
                {tr.noPassword}
              </p>
            </form>
          )}

          {/* Footer */}
          <p className="animate-fade-up delay-3" style={{ textAlign: 'center', fontSize: 12, color: 'var(--dim)', marginTop: 24 }}>
            {tr.footer}
          </p>

        </div>
      </div>
    </div>
  )
}
