'use client'

// ── VARIANT A: SPLIT SCREEN ──────────────────────────────────
// Left panel: dark navy + aurora glow, headline, stats, features
// Right panel: elevated glass form, clean & focused

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

type Lang = 'en' | 'ru' | 'cs'

const translations = {
  en: {
    badge: 'AI-powered · Invoice follow-ups',
    title: 'Stop chasing.\nStart getting paid.',
    sub: 'AI writes 3 follow-up emails per invoice — Friendly, Firm, Final Notice. Copy and send in 10 seconds.',
    benefits: [
      { icon: '✦', label: '3 tones per invoice', sub: 'Friendly → Firm → Final Notice' },
      { icon: '✦', label: 'Adapts to urgency', sub: 'Tone changes with days overdue' },
      { icon: '✦', label: 'Ready in 10 seconds', sub: 'AI writes, you copy & send' },
    ],
    stats: [
      { value: '$2.4M', label: 'Recovered' },
      { value: '4,200+', label: 'Freelancers' },
      { value: '94%', label: 'Response rate' },
    ],
    label: 'Email address',
    placeholder: 'you@example.com',
    submit: 'Continue with email →',
    submitting: 'Sending link...',
    noPassword: 'No password — we send a magic link to your inbox.',
    sentTitle: 'Check your inbox',
    sentSub: (email: string) => `We sent a sign-in link to ${email}. Click it to continue — no password needed.`,
    error: 'Something went wrong. Please try again.',
    emailRequired: 'Email address is required.',
    emailInvalid: 'Please enter a valid email.',
    footer: 'Trusted by freelancers worldwide · Cancel anytime',
    switchVariant: 'Design variants:',
  },
  ru: {
    badge: 'AI follow-up для инвойсов',
    title: 'Хватит гоняться.\nНачни получать деньги.',
    sub: 'AI пишет 3 follow-up письма на инвойс — Мягкое, Твёрдое, Финальное. Копируй и отправляй за 10 секунд.',
    benefits: [
      { icon: '✦', label: '3 варианта письма', sub: 'Мягкое → Твёрдое → Финальное' },
      { icon: '✦', label: 'Адаптируется к просрочке', sub: 'Тон меняется автоматически' },
      { icon: '✦', label: 'Готово за 10 секунд', sub: 'AI пишет, ты копируешь и отправляешь' },
    ],
    stats: [
      { value: '$2.4M', label: 'Возвращено' },
      { value: '4,200+', label: 'Фрилансеров' },
      { value: '94%', label: 'Ответов' },
    ],
    label: 'Email адрес',
    placeholder: 'you@example.com',
    submit: 'Войти по email →',
    submitting: 'Отправляем...',
    noPassword: 'Пароль не нужен — отправим ссылку на почту.',
    sentTitle: 'Проверьте почту',
    sentSub: (email: string) => `Мы отправили ссылку на ${email}. Нажмите её чтобы войти.`,
    error: 'Что-то пошло не так. Попробуйте снова.',
    emailRequired: 'Введите email адрес.',
    emailInvalid: 'Введите корректный email.',
    footer: 'Используют фрилансеры по всему миру · Отмена в любой момент',
    switchVariant: 'Варианты дизайна:',
  },
  cs: {
    badge: 'AI follow-up pro faktury',
    title: 'Přestaňte honit.\nZačněte dostávat peníze.',
    sub: 'AI napíše 3 upomínkové e-maily na fakturu. Zkopírujte a odešlete za 10 sekund.',
    benefits: [
      { icon: '✦', label: '3 tóny na fakturu', sub: 'Přátelský → Pevný → Finální' },
      { icon: '✦', label: 'Přizpůsobuje se urgenci', sub: 'Tón se mění automaticky' },
      { icon: '✦', label: 'Připraveno za 10 sekund', sub: 'AI píše, vy kopírujete' },
    ],
    stats: [
      { value: '$2.4M', label: 'Získáno zpět' },
      { value: '4,200+', label: 'Freelancerů' },
      { value: '94%', label: 'Odpovědí' },
    ],
    label: 'E-mailová adresa',
    placeholder: 'vy@example.com',
    submit: 'Pokračovat e-mailem →',
    submitting: 'Odesíláme...',
    noPassword: 'Žádné heslo — pošleme vám odkaz pro přihlášení.',
    sentTitle: 'Zkontrolujte e-mail',
    sentSub: (email: string) => `Poslali jsme odkaz na ${email}. Klikněte na něj pro přihlášení.`,
    error: 'Něco se pokazilo. Zkuste to znovu.',
    emailRequired: 'Zadejte e-mailovou adresu.',
    emailInvalid: 'Zadejte platnou e-mailovou adresu.',
    footer: 'Důvěřují freelanceři po celém světě · Zrušení kdykoli',
    switchVariant: 'Varianty designu:',
  },
}

const variantStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  * { font-family: 'Inter', -apple-system, sans-serif; }

  .va-root { display: flex; min-height: 100vh; background: #040A14; }

  /* LEFT PANEL */
  .va-left {
    flex: 1; display: flex; flex-direction: column;
    padding: 48px 56px; position: relative; overflow: hidden;
    background: linear-gradient(160deg, #050E1F 0%, #04080F 100%);
  }
  .va-aurora {
    position: absolute; top: -120px; left: -80px;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.06) 50%, transparent 70%);
    filter: blur(40px); pointer-events: none;
  }
  .va-aurora-2 {
    position: absolute; bottom: -100px; right: -60px;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(ellipse, rgba(59,130,246,0.1) 0%, transparent 70%);
    filter: blur(60px); pointer-events: none;
  }

  /* RIGHT PANEL */
  .va-right {
    width: 480px; flex-shrink: 0;
    background: #06060E;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 48px 52px;
    border-left: 1px solid rgba(255,255,255,0.05);
    position: relative; overflow: hidden;
  }
  .va-right::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent);
  }

  /* STAT CARDS */
  .va-stat {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px; padding: 16px 20px;
    animation: vaFloatUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }
  .va-stat:nth-child(2) { animation-delay: 0.08s; }
  .va-stat:nth-child(3) { animation-delay: 0.16s; }

  /* BENEFIT ROW */
  .va-benefit {
    display: flex; align-items: flex-start; gap: 14; padding: 12px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    animation: vaFloatUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }
  .va-benefit:last-child { border-bottom: none; }
  .va-benefit:nth-child(2) { animation-delay: 0.05s; }
  .va-benefit:nth-child(3) { animation-delay: 0.1s; }

  /* FORM GLASS CARD */
  .va-card {
    width: 100%;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 36px 32px;
    backdrop-filter: blur(20px);
    animation: vaFloatUp 0.5s 0.1s cubic-bezier(0.16,1,0.3,1) both;
  }

  /* INPUT */
  .va-input {
    width: 100%; box-sizing: border-box;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px; padding: 14px 16px;
    color: #F1F1F8; font-size: 15px; font-family: inherit;
    outline: none; transition: all 0.2s;
  }
  .va-input::placeholder { color: rgba(255,255,255,0.25); }
  .va-input:focus {
    border-color: rgba(99,102,241,0.6);
    background: rgba(99,102,241,0.06);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }
  .va-input.error { border-color: rgba(255,77,107,0.5); box-shadow: 0 0 0 3px rgba(255,77,107,0.1); }

  /* BUTTON */
  .va-btn {
    width: 100%; padding: 15px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, #6366F1 0%, #818CF8 100%);
    color: white; font-size: 15px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; font-family: inherit;
    box-shadow: 0 4px 20px rgba(99,102,241,0.35);
    position: relative; overflow: hidden;
  }
  .va-btn::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
    opacity: 0; transition: opacity 0.2s;
  }
  .va-btn:hover::after { opacity: 1; }
  .va-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(99,102,241,0.45); }
  .va-btn:active { transform: translateY(0); }
  .va-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

  /* LANG SWITCHER */
  .va-lang-btn {
    padding: 5px 11px; border-radius: 6px; font-size: 11px; font-weight: 600;
    background: transparent; color: rgba(255,255,255,0.35); border: none;
    cursor: pointer; transition: all 0.15s; font-family: inherit;
  }
  .va-lang-btn.active { background: rgba(99,102,241,0.2); color: #818CF8; }
  .va-lang-btn:hover:not(.active) { color: rgba(255,255,255,0.6); }

  /* VARIANT NAV */
  .va-variant-nav {
    position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
    display: flex; align-items: center; gap: 8px;
    background: rgba(10,10,20,0.85); backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.1); border-radius: 999px;
    padding: 8px 16px; font-size: 12px; color: rgba(255,255,255,0.4);
    z-index: 100;
  }
  .va-variant-link {
    padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600;
    text-decoration: none; transition: all 0.15s; color: rgba(255,255,255,0.5);
  }
  .va-variant-link:hover { color: white; background: rgba(255,255,255,0.1); }
  .va-variant-link.curr { background: rgba(99,102,241,0.25); color: #818CF8; }

  @keyframes vaFloatUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* SENT STATE */
  .va-sent {
    text-align: center; animation: vaFloatUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
  }
  .va-sent-icon {
    width: 64px; height: 64px; border-radius: 16px; margin: 0 auto 20px;
    background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25);
    display: flex; align-items: center; justify-content: center; font-size: 28px;
  }

  @media (max-width: 768px) {
    .va-root { flex-direction: column; }
    .va-left { padding: 36px 28px; }
    .va-right { width: 100%; padding: 36px 28px; border-left: none; border-top: 1px solid rgba(255,255,255,0.05); }
    .va-stats { flex-direction: column; }
  }
`

export default function LoginPage() {
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
    <>
      <style dangerouslySetInnerHTML={{ __html: variantStyle }} />

      <div className="va-root">
        {/* ── LEFT PANEL ─────────────────────────────────── */}
        <div className="va-left">
          <div className="va-aurora" />
          <div className="va-aurora-2" />

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 64, zIndex: 1, animation: 'vaFloatUp 0.4s ease both' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
            }}>✈</div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#F1F1F8', letterSpacing: '-0.3px' }}>InvoicePilot</span>
          </div>

          {/* Badge */}
          <div style={{ zIndex: 1, animation: 'vaFloatUp 0.4s 0.05s ease both', marginBottom: 20 }}>
            <span style={{
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
              color: '#818CF8', fontSize: 11, fontWeight: 600, letterSpacing: '0.8px',
              padding: '5px 12px', borderRadius: 999, textTransform: 'uppercase',
            }}>
              {tr.badge}
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 900, lineHeight: 1.1,
            letterSpacing: '-1.5px', color: '#F1F1F8', whiteSpace: 'pre-line',
            marginBottom: 20, zIndex: 1,
            animation: 'vaFloatUp 0.5s 0.1s cubic-bezier(0.16,1,0.3,1) both',
          }}>
            {tr.title}
          </h1>

          <p style={{
            fontSize: 15, color: 'rgba(255,255,255,0.42)', lineHeight: 1.7, maxWidth: 400,
            marginBottom: 48, zIndex: 1,
            animation: 'vaFloatUp 0.5s 0.15s cubic-bezier(0.16,1,0.3,1) both',
          }}>
            {tr.sub}
          </p>

          {/* Benefits */}
          <div style={{ marginBottom: 48, zIndex: 1 }}>
            {tr.benefits.map((b, i) => (
              <div key={i} className="va-benefit" style={{ animationDelay: `${0.2 + i * 0.06}s` }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                  background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: '#818CF8', marginTop: 1,
                }}>{b.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#E2E2F0', marginBottom: 2 }}>{b.label}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{b.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="va-stats" style={{ display: 'flex', gap: 10, zIndex: 1 }}>
            {tr.stats.map((s, i) => (
              <div key={i} className="va-stat" style={{ flex: 1, animationDelay: `${0.35 + i * 0.07}s` }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#F1F1F8', letterSpacing: '-0.5px', marginBottom: 3 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Lang switcher bottom */}
          <div style={{ marginTop: 'auto', paddingTop: 48, zIndex: 1, display: 'flex', gap: 2 }}>
            {(['en', 'ru', 'cs'] as Lang[]).map(l => (
              <button key={l} className={`va-lang-btn${lang === l ? ' active' : ''}`} onClick={() => switchLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ────────────────────────────────── */}
        <div className="va-right">
          <div style={{ width: '100%', maxWidth: 360 }}>

            {status === 'sent' ? (
              <div className="va-sent">
                <div className="va-sent-icon">✉️</div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#F1F1F8', marginBottom: 10, letterSpacing: '-0.4px' }}>
                  {tr.sentTitle}
                </h2>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>
                  {tr.sentSub(email)}
                </p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 32, animation: 'vaFloatUp 0.4s ease both' }}>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: '#F1F1F8', letterSpacing: '-0.5px', marginBottom: 6 }}>
                    Welcome back
                  </h2>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                    Sign in or create your free account
                  </p>
                </div>

                <div className="va-card">
                  <form onSubmit={handleLogin} noValidate>
                    <div style={{ marginBottom: 18 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 8, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                        {tr.label}
                      </label>
                      <input
                        type="email"
                        className={`va-input${emailError ? ' error' : ''}`}
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

                    <button className="va-btn" type="submit" disabled={status === 'loading'}>
                      {status === 'loading' ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          <span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                          {tr.submitting}
                        </span>
                      ) : tr.submit}
                    </button>

                    {status === 'error' && (
                      <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(255,77,107,0.08)', border: '1px solid rgba(255,77,107,0.2)', borderRadius: 10, fontSize: 13, color: '#FF4D6B', textAlign: 'center' }}>
                        {tr.error}
                      </div>
                    )}

                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 14, lineHeight: 1.55 }}>
                      {tr.noPassword}
                    </p>
                  </form>
                </div>

                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 20, animation: 'vaFloatUp 0.4s 0.3s ease both' }}>
                  {tr.footer}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Variant switcher */}
      <div className="va-variant-nav">
        <span>{tr.switchVariant}</span>
        <a href="/login" className="va-variant-link curr">A — Split</a>
        <a href="/login-b" className="va-variant-link">B — Gold</a>
        <a href="/login-c" className="va-variant-link">C — Aurora</a>
      </div>
    </>
  )
}
