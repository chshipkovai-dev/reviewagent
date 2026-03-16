'use client'

// ── VARIANT B: MIDNIGHT GOLD ─────────────────────────────────
// Warm almost-black background, gold/amber accents, centered
// Feels like premium fintech: Brex, Mercury, private banking

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

type Lang = 'en' | 'ru' | 'cs'

const translations = {
  en: {
    badge: 'AI Follow-ups',
    title: 'Get paid.\nFaster.',
    sub: 'AI writes 3 follow-up emails per invoice. Copy and send in 10 seconds.',
    label: 'Email address',
    placeholder: 'you@example.com',
    submit: 'Get started free →',
    submitting: 'Sending link...',
    noPassword: 'No password · Magic link sent to your inbox',
    sentTitle: 'Check your inbox',
    sentSub: (email: string) => `We sent a sign-in link to ${email}`,
    error: 'Something went wrong. Please try again.',
    emailRequired: 'Email address is required.',
    emailInvalid: 'Please enter a valid email.',
    switchVariant: 'Design variants:',
    social: '4,200+ freelancers worldwide',
  },
  ru: {
    badge: 'AI Follow-up',
    title: 'Получай деньги.\nБыстрее.',
    sub: 'AI пишет 3 follow-up письма на инвойс. Копируй и отправляй за 10 секунд.',
    label: 'Email адрес',
    placeholder: 'you@example.com',
    submit: 'Начать бесплатно →',
    submitting: 'Отправляем...',
    noPassword: 'Без пароля · Ссылка придёт на почту',
    sentTitle: 'Проверьте почту',
    sentSub: (email: string) => `Мы отправили ссылку на ${email}`,
    error: 'Что-то пошло не так. Попробуйте снова.',
    emailRequired: 'Введите email адрес.',
    emailInvalid: 'Введите корректный email.',
    switchVariant: 'Варианты дизайна:',
    social: '4,200+ фрилансеров по всему миру',
  },
  cs: {
    badge: 'AI Follow-up',
    title: 'Získejte peníze.\nRychleji.',
    sub: 'AI napíše 3 upomínkové e-maily na fakturu. Zkopírujte a odešlete za 10 sekund.',
    label: 'E-mailová adresa',
    placeholder: 'vy@example.com',
    submit: 'Začít zdarma →',
    submitting: 'Odesíláme...',
    noPassword: 'Bez hesla · Odkaz přijde na e-mail',
    sentTitle: 'Zkontrolujte e-mail',
    sentSub: (email: string) => `Poslali jsme odkaz na ${email}`,
    error: 'Něco se pokazilo. Zkuste to znovu.',
    emailRequired: 'Zadejte e-mailovou adresu.',
    emailInvalid: 'Zadejte platnou e-mailovou adresu.',
    switchVariant: 'Varianty designu:',
    social: '4 200+ freelancerů po celém světě',
  },
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  .vb-root {
    min-height: 100vh;
    background: #09070A;
    display: flex; align-items: center; justify-content: center;
    padding: 40px 20px; position: relative; overflow: hidden;
    font-family: 'Inter', -apple-system, sans-serif;
  }

  /* Background warm glow blobs */
  .vb-blob-1 {
    position: fixed; top: -200px; left: 50%; transform: translateX(-50%);
    width: 900px; height: 500px; border-radius: 50%;
    background: radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 65%);
    filter: blur(60px); pointer-events: none;
  }
  .vb-blob-2 {
    position: fixed; bottom: -150px; left: -100px;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(ellipse, rgba(180,83,9,0.08) 0%, transparent 65%);
    filter: blur(80px); pointer-events: none;
  }
  .vb-blob-3 {
    position: fixed; bottom: 0; right: -80px;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 65%);
    filter: blur(70px); pointer-events: none;
  }

  /* Noise overlay */
  .vb-noise {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  .vb-inner {
    position: relative; z-index: 1; width: 100%; max-width: 440px;
    display: flex; flex-direction: column; align-items: center;
  }

  /* Logo */
  .vb-logo {
    display: flex; align-items: center; gap: 10;
    margin-bottom: 48px;
    animation: vbUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }
  .vb-logo-icon {
    width: 40px; height: 40px; border-radius: 11px;
    background: linear-gradient(135deg, #D97706, #F59E0B);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    box-shadow: 0 4px 20px rgba(245,158,11,0.35), 0 0 0 1px rgba(245,158,11,0.2);
  }

  /* Badge */
  .vb-badge {
    display: inline-flex; align-items: center; gap: 6;
    background: rgba(245,158,11,0.08);
    border: 1px solid rgba(245,158,11,0.18);
    border-radius: 999px; padding: 5px 14px;
    font-size: 11px; font-weight: 700; letter-spacing: 1px;
    color: #F59E0B; text-transform: uppercase;
    margin-bottom: 20px;
    animation: vbUp 0.5s 0.04s cubic-bezier(0.16,1,0.3,1) both;
  }
  .vb-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #F59E0B;
    box-shadow: 0 0 6px rgba(245,158,11,0.8);
    animation: vbPulse 2s ease-in-out infinite;
  }

  /* Headline */
  .vb-title {
    font-size: clamp(52px, 8vw, 72px);
    font-weight: 900; letter-spacing: -2.5px; line-height: 1.0;
    text-align: center; white-space: pre-line;
    margin-bottom: 16px;
    animation: vbUp 0.5s 0.08s cubic-bezier(0.16,1,0.3,1) both;
    background: linear-gradient(160deg, #FBBF24 0%, #F59E0B 35%, #D97706 65%, #92400E 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .vb-sub {
    font-size: 15px; color: rgba(255,255,255,0.38); line-height: 1.65;
    text-align: center; max-width: 340px; margin-bottom: 40px;
    animation: vbUp 0.5s 0.12s cubic-bezier(0.16,1,0.3,1) both;
  }

  /* How it works pills */
  .vb-steps {
    display: flex; gap: 8; margin-bottom: 36px; flex-wrap: wrap; justify-content: center;
    animation: vbUp 0.5s 0.15s cubic-bezier(0.16,1,0.3,1) both;
  }
  .vb-step {
    display: flex; align-items: center; gap: 7;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 999px; padding: 7px 14px;
    font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.45);
  }
  .vb-step-num {
    width: 18px; height: 18px; border-radius: 50%;
    background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.2);
    color: #F59E0B; font-size: 10px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }

  /* Card */
  .vb-card {
    width: 100%; background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px; padding: 32px;
    backdrop-filter: blur(24px);
    box-shadow: 0 24px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
    animation: vbUp 0.5s 0.18s cubic-bezier(0.16,1,0.3,1) both;
    position: relative; overflow: hidden;
  }
  .vb-card::before {
    content: ''; position: absolute; top: 0; left: 20%; right: 20%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(245,158,11,0.25), transparent);
  }

  /* Input */
  .vb-input {
    width: 100%; box-sizing: border-box;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px; padding: 14px 16px;
    color: #F5F0E8; font-size: 15px; font-family: inherit;
    outline: none; transition: all 0.2s;
  }
  .vb-input::placeholder { color: rgba(255,255,255,0.2); }
  .vb-input:focus {
    border-color: rgba(245,158,11,0.5);
    background: rgba(245,158,11,0.04);
    box-shadow: 0 0 0 3px rgba(245,158,11,0.1);
  }
  .vb-input.error { border-color: rgba(255,77,107,0.5); box-shadow: 0 0 0 3px rgba(255,77,107,0.1); }

  /* Button */
  .vb-btn {
    width: 100%; padding: 15px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FCD34D 100%);
    color: #1C0E00; font-size: 15px; font-weight: 700;
    cursor: pointer; transition: all 0.2s; font-family: inherit;
    box-shadow: 0 4px 24px rgba(245,158,11,0.3), 0 0 0 1px rgba(245,158,11,0.2);
    letter-spacing: -0.2px;
  }
  .vb-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(245,158,11,0.4), 0 0 0 1px rgba(245,158,11,0.3); }
  .vb-btn:active { transform: translateY(0); }
  .vb-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* Social proof */
  .vb-social {
    display: flex; align-items: center; gap: 10; margin-top: 28px;
    animation: vbUp 0.5s 0.25s cubic-bezier(0.16,1,0.3,1) both;
  }
  .vb-avatars { display: flex; }
  .vb-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    border: 2px solid #09070A;
    font-size: 12px; display: flex; align-items: center; justify-content: center;
    margin-left: -8px; first-child { margin-left: 0; }
  }

  /* Lang */
  .vb-lang {
    position: fixed; top: 20px; right: 20px; z-index: 10;
    display: flex; gap: 2; background: rgba(10,8,10,0.8); backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 4px;
  }
  .vb-lang-btn {
    padding: 5px 11px; border-radius: 7px; font-size: 11px; font-weight: 600;
    background: transparent; color: rgba(255,255,255,0.35); border: none;
    cursor: pointer; transition: all 0.15s; font-family: inherit;
  }
  .vb-lang-btn.active { background: rgba(245,158,11,0.15); color: #F59E0B; }

  /* Variant nav */
  .vb-variant-nav {
    position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
    display: flex; align-items: center; gap: 8;
    background: rgba(10,8,10,0.85); backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.08); border-radius: 999px;
    padding: 8px 16px; font-size: 12px; color: rgba(255,255,255,0.35);
    z-index: 100;
  }
  .vb-variant-link {
    padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600;
    text-decoration: none; transition: all 0.15s; color: rgba(255,255,255,0.45);
  }
  .vb-variant-link:hover { color: white; background: rgba(255,255,255,0.08); }
  .vb-variant-link.curr { background: rgba(245,158,11,0.15); color: #F59E0B; }

  .vb-sent { text-align: center; animation: vbUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
  .vb-sent-icon {
    width: 68px; height: 68px; border-radius: 18px; margin: 0 auto 20px;
    background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2);
    display: flex; align-items: center; justify-content: center; font-size: 30px;
  }

  @keyframes vbUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes vbPulse {
    0%, 100% { box-shadow: 0 0 6px rgba(245,158,11,0.8); }
    50% { box-shadow: 0 0 14px rgba(245,158,11,1); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`

const AVATARS = ['🧑‍💻', '👩‍🎨', '👨‍💼', '👩‍💻', '🧑‍🎨']

export default function LoginPageB() {
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

  const steps = [
    { n: '1', t: 'Add invoice' },
    { n: '2', t: 'AI writes emails' },
    { n: '3', t: 'Copy & send' },
  ]

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Lang switcher */}
      <div className="vb-lang">
        {(['en', 'ru', 'cs'] as Lang[]).map(l => (
          <button key={l} className={`vb-lang-btn${lang === l ? ' active' : ''}`} onClick={() => switchLang(l)}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="vb-root">
        <div className="vb-blob-1" />
        <div className="vb-blob-2" />
        <div className="vb-blob-3" />
        <div className="vb-noise" />

        <div className="vb-inner">
          {/* Logo */}
          <div className="vb-logo">
            <div className="vb-logo-icon">✈</div>
            <span style={{ fontSize: 19, fontWeight: 700, color: '#F5F0E8', letterSpacing: '-0.4px' }}>InvoicePilot</span>
          </div>

          {/* Badge */}
          <div className="vb-badge">
            <div className="vb-badge-dot" />
            {tr.badge}
          </div>

          {/* Title */}
          <h1 className="vb-title">{tr.title}</h1>

          <p className="vb-sub">{tr.sub}</p>

          {/* Steps */}
          <div className="vb-steps">
            {steps.map(s => (
              <div key={s.n} className="vb-step">
                <div className="vb-step-num">{s.n}</div>
                {s.t}
              </div>
            ))}
          </div>

          {/* Form card */}
          {status === 'sent' ? (
            <div className="vb-card">
              <div className="vb-sent">
                <div className="vb-sent-icon">✉️</div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#F5F0E8', marginBottom: 10, letterSpacing: '-0.4px' }}>
                  {tr.sentTitle}
                </h2>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>
                  {tr.sentSub(email)}
                </p>
              </div>
            </div>
          ) : (
            <div className="vb-card">
              <form onSubmit={handleLogin} noValidate>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: 8, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    {tr.label}
                  </label>
                  <input
                    type="email"
                    className={`vb-input${emailError ? ' error' : ''}`}
                    placeholder={tr.placeholder}
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (emailError) setEmailError('') }}
                    onBlur={() => { if (email) setEmailError(validateEmail(email)) }}
                    disabled={status === 'loading'}
                    autoComplete="email"
                  />
                  {emailError && (
                    <div style={{ color: '#FF4D6B', fontSize: 12, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>⚠</span> {emailError}
                    </div>
                  )}
                </div>

                <button className="vb-btn" type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <span style={{ width: 15, height: 15, border: '2px solid rgba(28,14,0,0.3)', borderTopColor: '#1C0E00', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                      {tr.submitting}
                    </span>
                  ) : tr.submit}
                </button>

                {status === 'error' && (
                  <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(255,77,107,0.08)', border: '1px solid rgba(255,77,107,0.2)', borderRadius: 10, fontSize: 13, color: '#FF4D6B', textAlign: 'center' }}>
                    {tr.error}
                  </div>
                )}

                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 14 }}>
                  {tr.noPassword}
                </p>
              </form>
            </div>
          )}

          {/* Social proof */}
          <div className="vb-social">
            <div className="vb-avatars">
              {AVATARS.map((a, i) => (
                <div key={i} className="vb-avatar" style={{
                  background: ['#1E1420', '#14181E', '#1A1410', '#0E1A14', '#18141E'][i],
                  marginLeft: i === 0 ? 0 : -8,
                }}>{a}</div>
              ))}
            </div>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{tr.social}</span>
          </div>
        </div>
      </div>

      {/* Variant switcher */}
      <div className="vb-variant-nav">
        <span>{tr.switchVariant}</span>
        <a href="/login" className="vb-variant-link">A — Split</a>
        <a href="/login-b" className="vb-variant-link curr">B — Gold</a>
        <a href="/login-c" className="vb-variant-link">C — Aurora</a>
      </div>
    </>
  )
}
