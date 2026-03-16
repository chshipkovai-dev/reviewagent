'use client'

// ── VARIANT B3: EDITORIAL DIAGONAL ──────────────────────────
// Giant typography dominating left-to-center
// Diagonal gold accent line cutting through layout
// Compact stacked form floating in lower-right
// Very editorial — like a premium print ad became a webpage

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

type Lang = 'en' | 'ru' | 'cs'

const T = {
  en: {
    overline: 'Invoice follow-up automation',
    line1: 'STOP',
    line2: 'CHASING.',
    line3: 'Start',
    line4: 'earning.',
    sub: 'AI writes 3 perfectly-toned follow-up emails per overdue invoice. Copy and send in 10 seconds.',
    label: 'Your email',
    placeholder: 'you@example.com',
    submit: 'Get started →',
    submitting: 'Sending...',
    hint: 'No password · Free forever',
    sentTitle: 'Magic link sent ✦',
    sentSub: (e: string) => `Check ${e}`,
    err: 'Something went wrong.',
    errEmail: 'Enter your email.',
    errInvalid: 'Invalid email.',
    tag1: '$2.4M recovered',
    tag2: '4,200+ freelancers',
    tag3: '8 sec to generate',
    variantLabel: 'Gold variants:',
  },
  ru: {
    overline: 'Автоматизация follow-up для инвойсов',
    line1: 'ХВАТИТ',
    line2: 'ГОНЯТЬСЯ.',
    line3: 'Начни',
    line4: 'зарабатывать.',
    sub: 'AI пишет 3 follow-up письма на каждый просроченный инвойс. Копируй и отправляй за 10 секунд.',
    label: 'Ваш email',
    placeholder: 'you@example.com',
    submit: 'Начать →',
    submitting: 'Отправляем...',
    hint: 'Без пароля · Бесплатно',
    sentTitle: 'Magic link отправлен ✦',
    sentSub: (e: string) => `Проверьте ${e}`,
    err: 'Что-то пошло не так.',
    errEmail: 'Введите email.',
    errInvalid: 'Некорректный email.',
    tag1: '$2.4M возвращено',
    tag2: '4 200+ фрилансеров',
    tag3: '8 сек на генерацию',
    variantLabel: 'Gold варианты:',
  },
  cs: {
    overline: 'Automatizace upomínek pro faktury',
    line1: 'PŘESTAŇTE',
    line2: 'HONIT.',
    line3: 'Začněte',
    line4: 'vydělávat.',
    sub: 'AI napíše 3 upomínkové e-maily na každou fakturu po splatnosti. Zkopírujte za 10 sekund.',
    label: 'Váš e-mail',
    placeholder: 'vy@example.com',
    submit: 'Začít →',
    submitting: 'Odesíláme...',
    hint: 'Bez hesla · Zdarma',
    sentTitle: 'Magic link odeslán ✦',
    sentSub: (e: string) => `Zkontrolujte ${e}`,
    err: 'Něco se pokazilo.',
    errEmail: 'Zadejte e-mail.',
    errInvalid: 'Neplatný e-mail.',
    tag1: '$2.4M získáno',
    tag2: '4 200+ freelancerů',
    tag3: '8 sek na generování',
    variantLabel: 'Gold varianty:',
  },
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,900&display=swap');
*{font-family:'Inter',-apple-system,sans-serif;box-sizing:border-box;margin:0;padding:0;}

.b3-root{
  min-height:100vh;background:#090603;
  display:flex;flex-direction:column;
  position:relative;overflow:hidden;
}

/* ── BG ELEMENTS ── */
.b3-bg-glow{
  position:fixed;top:-300px;right:-200px;width:900px;height:900px;
  background:radial-gradient(ellipse,rgba(245,158,11,0.08) 0%,transparent 60%);
  filter:blur(80px);pointer-events:none;
}
.b3-bg-glow2{
  position:fixed;bottom:-200px;left:-100px;width:700px;height:600px;
  background:radial-gradient(ellipse,rgba(180,83,9,0.06) 0%,transparent 60%);
  filter:blur(100px);pointer-events:none;
}

/* Diagonal gold line across page */
.b3-diag{
  position:fixed;top:0;left:0;width:100%;height:100%;
  pointer-events:none;overflow:hidden;z-index:1;
}
.b3-diag svg{position:absolute;inset:0;width:100%;height:100%;}

/* ── NAV ── */
.b3-nav{
  position:relative;z-index:10;
  display:flex;align-items:center;justify-content:space-between;
  padding:28px 48px;
}
.b3-logo{display:flex;align-items:center;gap:10px;}
.b3-logo-icon{
  width:32px;height:32px;border-radius:8px;
  background:linear-gradient(135deg,#D97706,#F59E0B);
  display:flex;align-items:center;justify-content:center;font-size:16px;
  box-shadow:0 3px 12px rgba(245,158,11,0.3);
}
.b3-lang{display:flex;gap:2px;padding:3px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:10px;}
.b3-lang-btn{padding:5px 11px;border-radius:7px;font-size:11px;font-weight:600;background:transparent;color:rgba(255,255,255,0.3);border:none;cursor:pointer;transition:all 0.15s;}
.b3-lang-btn.on{background:rgba(245,158,11,0.15);color:#F59E0B;}

/* ── HERO ── */
.b3-hero{
  position:relative;z-index:5;
  padding:32px 48px 0;
  animation:b3up 0.6s ease both;
}
.b3-overline{
  font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;
  color:rgba(245,158,11,0.7);margin-bottom:20px;
  display:flex;align-items:center;gap:10px;
}
.b3-overline::before{content:'';width:32px;height:1px;background:rgba(245,158,11,0.4);}

/* Big typography */
.b3-bigline{
  font-size:clamp(64px,10vw,130px);
  font-weight:900;letter-spacing:-4px;line-height:0.92;
  display:block;
}
.b3-bigline.dark{
  color:rgba(255,255,255,0.08);
  -webkit-text-stroke:1px rgba(245,158,11,0.15);
}
.b3-bigline.gold{
  background:linear-gradient(135deg,#FBBF24 0%,#F59E0B 50%,#D97706 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.b3-bigline.white{color:#F5F0E8;}
.b3-bigline.italic{font-style:italic;color:rgba(255,255,255,0.15);-webkit-text-stroke:1px rgba(255,255,255,0.1);}

/* ── LOWER SECTION ── */
.b3-lower{
  position:relative;z-index:5;
  display:flex;align-items:flex-end;justify-content:space-between;
  padding:16px 48px 48px;gap:40px;
  margin-top:auto;
  flex:1;align-items:center;
}

/* Tags / pills */
.b3-tags{display:flex;flex-direction:column;gap:10px;}
.b3-tag{
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(255,255,255,0.03);
  border:1px solid rgba(255,255,255,0.07);
  border-radius:999px;padding:8px 16px;
  font-size:13px;font-weight:500;color:rgba(255,255,255,0.5);
  animation:b3up 0.5s ease both;
}
.b3-tag:nth-child(2){animation-delay:0.06s;}
.b3-tag:nth-child(3){animation-delay:0.12s;}
.b3-tag-dot{width:6px;height:6px;border-radius:50%;background:#F59E0B;flex-shrink:0;box-shadow:0 0 8px rgba(245,158,11,0.6);}

/* ── FORM FLOAT ── */
.b3-form-wrap{
  width:360px;flex-shrink:0;
  animation:b3up 0.5s 0.1s ease both;
}
.b3-sub{
  font-size:13px;color:rgba(255,255,255,0.38);line-height:1.65;
  margin-bottom:20px;max-width:320px;
}
.b3-card{
  background:rgba(255,255,255,0.028);
  border:1px solid rgba(245,158,11,0.15);
  border-radius:18px;padding:28px;
  backdrop-filter:blur(28px);
  box-shadow:0 24px 60px rgba(0,0,0,0.4),0 0 0 1px rgba(245,158,11,0.04),inset 0 1px 0 rgba(255,255,255,0.05);
  position:relative;overflow:hidden;
}
.b3-card::before{
  content:'';position:absolute;top:0;left:20%;right:20%;height:1px;
  background:linear-gradient(90deg,transparent,rgba(245,158,11,0.4),transparent);
}
.b3-input{
  width:100%;background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:11px;padding:13px 15px;
  color:#F5F0E8;font-size:14px;outline:none;transition:all 0.2s;
}
.b3-input::placeholder{color:rgba(255,255,255,0.2);}
.b3-input:focus{border-color:rgba(245,158,11,0.5);background:rgba(245,158,11,0.04);box-shadow:0 0 0 3px rgba(245,158,11,0.1);}
.b3-input.err{border-color:rgba(255,77,107,0.5);}
.b3-btn{
  width:100%;padding:14px;border:none;border-radius:11px;
  font-size:14px;font-weight:700;cursor:pointer;
  color:#1A0D00;
  background:linear-gradient(135deg,#D97706 0%,#F59E0B 50%,#FDE68A 100%);
  background-size:200% 100%;
  box-shadow:0 4px 18px rgba(245,158,11,0.3);
  transition:all 0.25s;position:relative;overflow:hidden;
}
.b3-btn::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);animation:b3shimmer 3s 0.5s ease-in-out infinite;}
.b3-btn:hover{background-position:100% 0;transform:translateY(-2px);box-shadow:0 6px 24px rgba(245,158,11,0.4);}
.b3-btn:disabled{opacity:0.65;cursor:not-allowed;transform:none;}

.b3-sent{text-align:center;padding:10px 0;}
.b3-sent-icon{font-size:40px;margin-bottom:14px;animation:b3bounce 0.5s cubic-bezier(0.34,1.56,0.64,1) both;}

/* ── VARIANT NAV ── */
.b3-vnav{
  position:fixed;bottom:20px;left:50%;transform:translateX(-50%);
  display:flex;align-items:center;gap:6px;
  background:rgba(9,6,3,0.9);backdrop-filter:blur(16px);
  border:1px solid rgba(245,158,11,0.15);border-radius:999px;
  padding:8px 16px;font-size:12px;color:rgba(255,255,255,0.3);z-index:100;
}
.b3-vlink{padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;text-decoration:none;transition:all 0.15s;color:rgba(255,255,255,0.4);}
.b3-vlink:hover{color:white;background:rgba(255,255,255,0.08);}
.b3-vlink.on{background:rgba(245,158,11,0.15);color:#F59E0B;}

@keyframes b3up{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
@keyframes b3shimmer{0%{left:-100%;}50%,100%{left:150%;}}
@keyframes b3bounce{from{opacity:0;transform:scale(0.5);}to{opacity:1;transform:scale(1);}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes b3diag{from{stroke-dashoffset:3000;}to{stroke-dashoffset:0;}}

@media(max-width:768px){
  .b3-nav,.b3-hero,.b3-lower{padding-left:24px;padding-right:24px;}
  .b3-lower{flex-direction:column;align-items:flex-start;gap:28px;padding-bottom:100px;}
  .b3-form-wrap{width:100%;}
  .b3-bigline{font-size:clamp(44px,14vw,80px);letter-spacing:-2px;}
}
`

export default function LoginB3() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'sent'|'error'>('idle')
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('ip_lang') as Lang | null
    if (saved && saved in T) setLang(saved)
  }, [])

  const tr = T[lang]
  function switchLang(l: Lang) { setLang(l); localStorage.setItem('ip_lang', l) }
  function validate(v: string) {
    if (!v.trim()) return tr.errEmail
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return tr.errInvalid
    return ''
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const err = validate(email); if (err) { setEmailError(err); return }
    setEmailError(''); setStatus('loading')
    const sb = createClient()
    const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } })
    setStatus(error ? 'error' : 'sent')
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="b3-root">
        <div className="b3-bg-glow" /><div className="b3-bg-glow2" />

        {/* Diagonal SVG accent line */}
        <div className="b3-diag">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="none" fill="none">
            <line x1="300" y1="0" x2="1100" y2="900"
              stroke="url(#diagGrad)" strokeWidth="1"
              strokeDasharray="3000" strokeDashoffset="3000"
              style={{ animation: 'b3diag 1.5s 0.3s ease forwards' }}
            />
            <defs>
              <linearGradient id="diagGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(245,158,11,0)" />
                <stop offset="30%" stopColor="rgba(245,158,11,0.25)" />
                <stop offset="70%" stopColor="rgba(245,158,11,0.2)" />
                <stop offset="100%" stopColor="rgba(245,158,11,0)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Nav */}
        <nav className="b3-nav">
          <div className="b3-logo">
            <div className="b3-logo-icon">✈</div>
            <span style={{ fontSize:17, fontWeight:700, color:'#F5F0E8', letterSpacing:'-0.3px' }}>InvoicePilot</span>
          </div>
          <div className="b3-lang">
            {(['en','ru','cs'] as Lang[]).map(l =>
              <button key={l} className={`b3-lang-btn${lang===l?' on':''}`} onClick={()=>switchLang(l)}>{l.toUpperCase()}</button>
            )}
          </div>
        </nav>

        {/* Hero typography */}
        <div className="b3-hero">
          <div className="b3-overline">{tr.overline}</div>
          <div style={{ lineHeight:1 }}>
            <span className="b3-bigline dark">{tr.line1}</span>
            <span className="b3-bigline gold" style={{ animationDelay:'0.1s' }}>{tr.line2}</span>
            <span className="b3-bigline white" style={{ animationDelay:'0.18s' }}>{tr.line3}</span>
            <span className="b3-bigline italic" style={{ animationDelay:'0.26s' }}>{tr.line4}</span>
          </div>
        </div>

        {/* Lower: tags + form */}
        <div className="b3-lower">
          <div className="b3-tags">
            {[tr.tag1, tr.tag2, tr.tag3].map((t,i) => (
              <div key={i} className="b3-tag" style={{ animationDelay:`${0.3+i*0.06}s` }}>
                <div className="b3-tag-dot" />{t}
              </div>
            ))}
          </div>

          <div className="b3-form-wrap">
            <p className="b3-sub">{tr.sub}</p>

            {status === 'sent' ? (
              <div className="b3-card">
                <div className="b3-sent">
                  <div className="b3-sent-icon">✉️</div>
                  <h3 style={{ fontSize:18,fontWeight:700,color:'#F5F0E8',marginBottom:8,letterSpacing:'-0.3px' }}>{tr.sentTitle}</h3>
                  <p style={{ fontSize:13,color:'rgba(255,255,255,0.4)',lineHeight:1.6 }}>{tr.sentSub(email)}</p>
                </div>
              </div>
            ) : (
              <div className="b3-card">
                <form onSubmit={submit} noValidate>
                  <label style={{ fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.35)',display:'block',marginBottom:8,letterSpacing:'0.5px',textTransform:'uppercase' }}>
                    {tr.label}
                  </label>
                  <input
                    type="email" className={`b3-input${emailError?' err':''}`}
                    placeholder={tr.placeholder} value={email}
                    onChange={e=>{setEmail(e.target.value);if(emailError)setEmailError('')}}
                    onBlur={()=>{if(email)setEmailError(validate(email))}}
                    disabled={status==='loading'} autoComplete="email"
                    style={{ marginBottom: emailError ? 6 : 14 }}
                  />
                  {emailError && <div style={{ color:'#FF4D6B',fontSize:12,marginBottom:10,display:'flex',alignItems:'center',gap:4 }}><span>⚠</span>{emailError}</div>}
                  <button className="b3-btn" type="submit" disabled={status==='loading'}>
                    {status==='loading'
                      ? <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
                          <span style={{ width:14,height:14,border:'2px solid rgba(26,13,0,0.3)',borderTopColor:'#1A0D00',borderRadius:'50%',display:'inline-block',animation:'spin 0.7s linear infinite' }}/>
                          {tr.submitting}
                        </span>
                      : tr.submit}
                  </button>
                  {status==='error' && <div style={{ marginTop:10,padding:'9px 13px',background:'rgba(255,77,107,0.08)',border:'1px solid rgba(255,77,107,0.2)',borderRadius:10,fontSize:13,color:'#FF4D6B',textAlign:'center' }}>{tr.err}</div>}
                  <p style={{ fontSize:11,color:'rgba(255,255,255,0.2)',textAlign:'center',marginTop:12 }}>{tr.hint}</p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="b3-vnav">
        <span>{tr.variantLabel}</span>
        <a href="/login-b" className="b3-vlink">B</a>
        <a href="/login-b2" className="b3-vlink">B2 — Split</a>
        <a href="/login-b3" className="b3-vlink on">B3 — Diagonal</a>
        <a href="/login-b4" className="b3-vlink">B4 — Orbit</a>
      </div>
    </>
  )
}
