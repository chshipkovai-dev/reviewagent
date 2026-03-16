'use client'

// ── VARIANT C: AURORA / EDITORIAL ───────────────────────────
// Dramatic full-bleed multi-color mesh background
// Ultra-large typography, coral/rose accent, ultra-minimal form
// Feel: Revolut · Figma · Linear dark + bold

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

type Lang = 'en' | 'ru' | 'cs'

const translations = {
  en: {
    preheading: 'Stop losing money to slow payers',
    title: 'Invoice follow-ups\nthat actually work.',
    submit: 'Start free →',
    submitting: 'Sending...',
    placeholder: 'your@email.com',
    noPassword: 'No password needed',
    sentTitle: 'Magic link sent ✦',
    sentSub: (email: string) => `Check ${email} — click the link to sign in`,
    error: 'Something went wrong.',
    emailRequired: 'Enter your email.',
    emailInvalid: 'Invalid email address.',
    features: ['3 email tones', 'Under 10 seconds', 'Zero password'],
    switchVariant: 'Design variants:',
    cta2: 'See how it works',
  },
  ru: {
    preheading: 'Хватит терять деньги из-за должников',
    title: 'Follow-up письма\nкоторые работают.',
    submit: 'Начать бесплатно →',
    submitting: 'Отправляем...',
    placeholder: 'ваш@email.com',
    noPassword: 'Без пароля',
    sentTitle: 'Magic link отправлен ✦',
    sentSub: (email: string) => `Проверьте ${email} — нажмите ссылку чтобы войти`,
    error: 'Что-то пошло не так.',
    emailRequired: 'Введите email.',
    emailInvalid: 'Некорректный email.',
    features: ['3 тона письма', 'Меньше 10 секунд', 'Без пароля'],
    switchVariant: 'Варианты дизайна:',
    cta2: 'Как это работает',
  },
  cs: {
    preheading: 'Přestaňte přicházet o peníze',
    title: 'Upomínkové e-maily\nkteré fungují.',
    submit: 'Začít zdarma →',
    submitting: 'Odesíláme...',
    placeholder: 'váš@email.com',
    noPassword: 'Bez hesla',
    sentTitle: 'Magic link odeslán ✦',
    sentSub: (email: string) => `Zkontrolujte ${email} — klikněte na odkaz`,
    error: 'Něco se pokazilo.',
    emailRequired: 'Zadejte e-mail.',
    emailInvalid: 'Neplatná e-mailová adresa.',
    features: ['3 tóny e-mailu', 'Méně než 10 sekund', 'Bez hesla'],
    switchVariant: 'Varianty designu:',
    cta2: 'Jak to funguje',
  },
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,800&display=swap');

  .vc-root {
    min-height: 100vh; position: relative; overflow: hidden;
    background: #060410;
    display: flex; flex-direction: column;
    font-family: 'Inter', -apple-system, sans-serif;
  }

  /* ── MESH BACKGROUND ────────────────────────────── */
  .vc-mesh {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
  }
  .vc-m1 {
    position: absolute; width: 900px; height: 700px;
    top: -250px; left: -200px;
    background: radial-gradient(ellipse at center, rgba(124,58,237,0.28) 0%, transparent 65%);
    filter: blur(80px);
  }
  .vc-m2 {
    position: absolute; width: 700px; height: 600px;
    top: -100px; right: -150px;
    background: radial-gradient(ellipse at center, rgba(236,72,153,0.18) 0%, transparent 65%);
    filter: blur(90px);
  }
  .vc-m3 {
    position: absolute; width: 800px; height: 600px;
    bottom: -200px; right: -100px;
    background: radial-gradient(ellipse at center, rgba(20,184,166,0.16) 0%, transparent 65%);
    filter: blur(100px);
  }
  .vc-m4 {
    position: absolute; width: 600px; height: 500px;
    bottom: -100px; left: -80px;
    background: radial-gradient(ellipse at center, rgba(99,102,241,0.14) 0%, transparent 65%);
    filter: blur(80px);
  }
  /* Moving glow spots */
  .vc-spot {
    position: absolute; width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,77,107,0.12), transparent 70%);
    top: 40%; left: 45%; filter: blur(40px);
    animation: vcFloat 8s ease-in-out infinite;
  }

  /* ── GRID OVERLAY ───────────────────────────────── */
  .vc-grid {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* ── LAYOUT ─────────────────────────────────────── */
  .vc-nav {
    position: relative; z-index: 10;
    display: flex; align-items: center; justify-content: space-between;
    padding: 24px 40px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }

  .vc-body {
    position: relative; z-index: 1;
    flex: 1; display: flex; align-items: center;
    padding: 0 40px; gap: 60px;
  }

  .vc-left {
    flex: 1; padding-right: 40px;
  }

  .vc-right {
    width: 400px; flex-shrink: 0;
  }

  /* ── TYPOGRAPHY ─────────────────────────────────── */
  .vc-preheading {
    display: inline-flex; align-items: center; gap: 8;
    font-size: 11px; font-weight: 700; letter-spacing: 1.2px;
    text-transform: uppercase; color: rgba(255,77,107,0.9);
    margin-bottom: 20px;
    animation: vcUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }
  .vc-preheading::before {
    content: ''; width: 24px; height: 1px; background: rgba(255,77,107,0.6);
  }

  .vc-title {
    font-size: clamp(40px, 5vw, 62px);
    font-weight: 900; line-height: 1.08; letter-spacing: -2px;
    color: #F8F4FF; white-space: pre-line; margin-bottom: 32px;
    animation: vcUp 0.5s 0.06s cubic-bezier(0.16,1,0.3,1) both;
  }
  .vc-title em {
    font-style: italic;
    background: linear-gradient(135deg, #FF4D6B 0%, #C026D3 50%, #7C3AED 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── FEATURE PILLS ──────────────────────────────── */
  .vc-pills {
    display: flex; flex-wrap: wrap; gap: 8; margin-bottom: 48px;
    animation: vcUp 0.5s 0.12s cubic-bezier(0.16,1,0.3,1) both;
  }
  .vc-pill {
    display: flex; align-items: center; gap: 6;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 999px; padding: 7px 16px;
    font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.55);
  }
  .vc-pill-dot {
    width: 5px; height: 5px; border-radius: 50%; background: #FF4D6B; flex-shrink: 0;
  }

  /* ── DECORATIVE CARDS ───────────────────────────── */
  .vc-deco-wrap {
    position: relative; height: 160px;
    animation: vcUp 0.5s 0.18s cubic-bezier(0.16,1,0.3,1) both;
  }
  .vc-deco-card {
    position: absolute;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px; padding: 14px 18px;
    backdrop-filter: blur(12px);
    font-size: 13px;
  }
  .vc-deco-card-1 { left: 0; top: 0; width: 220px; animation: vcFloat2 5s ease-in-out infinite; }
  .vc-deco-card-2 { left: 80px; top: 64px; width: 200px; animation: vcFloat2 5s 1.5s ease-in-out infinite; }

  /* ── RIGHT SIDE / FORM ──────────────────────────── */
  .vc-form-wrap {
    width: 100%;
    animation: vcUp 0.5s 0.15s cubic-bezier(0.16,1,0.3,1) both;
  }

  .vc-form-title {
    font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.4);
    letter-spacing: '0.3px'; margin-bottom: 20px; line-height: 1.5;
  }

  .vc-input-wrap {
    display: flex; gap: 0; margin-bottom: 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px; overflow: hidden;
    transition: all 0.2s;
  }
  .vc-input-wrap:focus-within {
    border-color: rgba(255,77,107,0.45);
    box-shadow: 0 0 0 3px rgba(255,77,107,0.1);
    background: rgba(255,77,107,0.03);
  }
  .vc-input-wrap.error {
    border-color: rgba(255,77,107,0.5);
    box-shadow: 0 0 0 3px rgba(255,77,107,0.12);
  }
  .vc-input {
    flex: 1; background: transparent; border: none; outline: none;
    padding: 16px 18px; color: #F8F4FF; font-size: 15px; font-family: inherit;
  }
  .vc-input::placeholder { color: rgba(255,255,255,0.2); }

  .vc-btn {
    padding: 16px 22px; background: #FF4D6B; color: white;
    font-size: 14px; font-weight: 700; border: none; cursor: pointer;
    font-family: inherit; transition: all 0.2s; white-space: nowrap;
    letter-spacing: -0.2px;
  }
  .vc-btn:hover { background: #FF3358; }
  .vc-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .vc-divider {
    display: flex; align-items: center; gap: 12; margin: 16px 0;
  }
  .vc-divider::before, .vc-divider::after {
    content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.07);
  }

  /* Glass card for full form */
  .vc-glass {
    background: rgba(255,255,255,0.028);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; padding: 28px;
    backdrop-filter: blur(28px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.35);
    position: relative; overflow: hidden;
  }
  .vc-glass::before {
    content: ''; position: absolute; top: 0; left: 30%; right: 30%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,77,107,0.3), transparent);
  }

  /* Sent state */
  .vc-sent { text-align: center; padding: 8px 0; animation: vcUp 0.4s ease both; }
  .vc-sent-icon {
    font-size: 44px; margin-bottom: 16px;
    animation: vcBounce 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
  }

  /* Logo */
  .vc-logo {
    display: flex; align-items: center; gap: 10;
  }
  .vc-logo-icon {
    width: 32px; height: 32px; border-radius: 9px;
    background: linear-gradient(135deg, #FF4D6B, #C026D3);
    display: flex; align-items: center; justify-content: center; font-size: 16px;
    box-shadow: 0 4px 14px rgba(255,77,107,0.35);
  }

  /* Lang */
  .vc-lang {
    display: flex; gap: 2; background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 3px;
  }
  .vc-lang-btn {
    padding: 5px 11px; border-radius: 7px; font-size: 11px; font-weight: 600;
    background: transparent; color: rgba(255,255,255,0.3); border: none;
    cursor: pointer; transition: all 0.15s; font-family: inherit;
  }
  .vc-lang-btn.active { background: rgba(255,77,107,0.15); color: #FF4D6B; }

  /* Variant nav */
  .vc-variant-nav {
    position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
    display: flex; align-items: center; gap: 8;
    background: rgba(6,4,16,0.85); backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.08); border-radius: 999px;
    padding: 8px 16px; font-size: 12px; color: rgba(255,255,255,0.35);
    z-index: 100;
  }
  .vc-variant-link {
    padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600;
    text-decoration: none; transition: all 0.15s; color: rgba(255,255,255,0.45);
  }
  .vc-variant-link:hover { color: white; background: rgba(255,255,255,0.08); }
  .vc-variant-link.curr { background: rgba(255,77,107,0.15); color: #FF4D6B; }

  @keyframes vcUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes vcFloat {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(30px, -20px); }
  }
  @keyframes vcFloat2 {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  @keyframes vcBounce {
    from { opacity: 0; transform: scale(0.5); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 900px) {
    .vc-body { flex-direction: column; padding: 32px 24px 80px; gap: 32px; }
    .vc-left { padding-right: 0; }
    .vc-right { width: 100%; }
    .vc-nav { padding: 20px 24px; }
    .vc-title { font-size: 36px; }
    .vc-deco-wrap { height: 100px; }
  }
`

export default function LoginPageC() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('ip_lang') as Lang | null
    if (saved && saved in translations) setLang(saved)
  }, [])

  function switchLang(l: Lang) { setLang(l); localStorage.setItem('ip_lang', l) }
  const tr = translations[lang]

  function validateEmail(val: string) {
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
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="vc-root">
        {/* Mesh */}
        <div className="vc-mesh">
          <div className="vc-m1" /><div className="vc-m2" />
          <div className="vc-m3" /><div className="vc-m4" />
          <div className="vc-spot" />
        </div>
        <div className="vc-grid" />

        {/* Nav */}
        <nav className="vc-nav">
          <div className="vc-logo">
            <div className="vc-logo-icon">✈</div>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#F8F4FF', letterSpacing: '-0.3px' }}>InvoicePilot</span>
          </div>
          <div className="vc-lang">
            {(['en', 'ru', 'cs'] as Lang[]).map(l => (
              <button key={l} className={`vc-lang-btn${lang === l ? ' active' : ''}`} onClick={() => switchLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </nav>

        {/* Body */}
        <div className="vc-body">
          {/* ── LEFT ── */}
          <div className="vc-left">
            <div className="vc-preheading">{tr.preheading}</div>

            <h1 className="vc-title">
              {tr.title.split('\n').map((line, i) =>
                i === 0
                  ? <span key={i}>{line}<br /></span>
                  : <em key={i}>{line}</em>
              )}
            </h1>

            <div className="vc-pills">
              {tr.features.map((f, i) => (
                <div key={i} className="vc-pill">
                  <div className="vc-pill-dot" />
                  {f}
                </div>
              ))}
            </div>

            {/* Floating preview cards */}
            <div className="vc-deco-wrap">
              <div className="vc-deco-card vc-deco-card-1">
                <div style={{ fontSize: 10, color: 'rgba(255,77,107,0.8)', fontWeight: 700, letterSpacing: '0.5px', marginBottom: 6 }}>⚠ 60 DAYS OVERDUE</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>Hi Sarah, this is a final notice regarding invoice #1042 for $3,200...</div>
              </div>
              <div className="vc-deco-card vc-deco-card-2">
                <div style={{ fontSize: 10, color: 'rgba(99,102,241,0.9)', fontWeight: 700, letterSpacing: '0.5px', marginBottom: 6 }}>✦ AI WROTE THIS IN 8 SEC</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>3 versions · Friendly · Firm · Final Notice</div>
              </div>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="vc-right">
            {status === 'sent' ? (
              <div className="vc-glass">
                <div className="vc-sent">
                  <div className="vc-sent-icon">✉️</div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: '#F8F4FF', marginBottom: 8, letterSpacing: '-0.4px' }}>
                    {tr.sentTitle}
                  </h2>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>
                    {tr.sentSub(email)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="vc-form-wrap">
                <p className="vc-form-title">
                  Join 4,200+ freelancers who stopped chasing invoices
                </p>

                <div className="vc-glass">
                  <form onSubmit={handleLogin} noValidate>
                    <div className={`vc-input-wrap${emailError ? ' error' : ''}`}>
                      <input
                        type="email"
                        className="vc-input"
                        placeholder={tr.placeholder}
                        value={email}
                        onChange={e => { setEmail(e.target.value); if (emailError) setEmailError('') }}
                        onBlur={() => { if (email) setEmailError(validateEmail(email)) }}
                        disabled={status === 'loading'}
                        autoComplete="email"
                      />
                      <button className="vc-btn" type="submit" disabled={status === 'loading'}>
                        {status === 'loading' ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                            {tr.submitting}
                          </span>
                        ) : tr.submit}
                      </button>
                    </div>

                    {emailError && (
                      <div style={{ color: '#FF4D6B', fontSize: 12, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>⚠</span> {emailError}
                      </div>
                    )}

                    {status === 'error' && (
                      <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(255,77,107,0.08)', border: '1px solid rgba(255,77,107,0.2)', borderRadius: 10, fontSize: 13, color: '#FF4D6B', textAlign: 'center' }}>
                        {tr.error}
                      </div>
                    )}

                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', textAlign: 'center', marginTop: 14 }}>
                      {tr.noPassword}
                    </p>
                  </form>
                </div>

                {/* Stats strip */}
                <div style={{
                  display: 'flex', gap: 0, marginTop: 16,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 14, overflow: 'hidden',
                }}>
                  {[['$2.4M', 'Recovered'], ['94%', 'Response rate'], ['8s', 'To generate']].map(([v, l], i) => (
                    <div key={i} style={{
                      flex: 1, padding: '14px 12px', textAlign: 'center',
                      borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#F8F4FF', letterSpacing: '-0.5px' }}>{v}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 3, fontWeight: 500 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Variant switcher */}
      <div className="vc-variant-nav">
        <span>{tr.switchVariant}</span>
        <a href="/login" className="vc-variant-link">A — Split</a>
        <a href="/login-b" className="vc-variant-link">B — Gold</a>
        <a href="/login-c" className="vc-variant-link curr">C — Aurora</a>
      </div>
    </>
  )
}
