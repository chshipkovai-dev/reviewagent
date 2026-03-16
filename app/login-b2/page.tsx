'use client'

// ── VARIANT B2: GOLD SPLIT + LIVE TIMELINE ───────────────────
// Left: animated invoice lifecycle story + big stats
// Right: premium gold glass form
// Animations: staggered entrance, timeline pulse, shimmer button

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

type Lang = 'en' | 'ru' | 'cs'

const T = {
  en: {
    logo: 'InvoicePilot',
    badge: 'AI · Invoice automation',
    title: 'Your invoices.\nCollected.',
    sub: 'Stop writing follow-up emails manually. AI generates 3 perfectly-toned versions in seconds.',
    steps: [
      { status: 'overdue', label: 'Invoice #1042', meta: '45 days overdue · $2,400', dot: 'danger' },
      { status: 'generating', label: 'AI writing emails...', meta: '3 tones · Friendly · Firm · Final', dot: 'gold' },
      { status: 'ready', label: '3 emails ready', meta: 'Copy & send in 10 seconds', dot: 'success' },
    ],
    stat1v: '$2.4M', stat1l: 'recovered',
    stat2v: '8 sec', stat2l: 'to generate',
    stat3v: '94%', stat3l: 'response rate',
    label: 'Work email',
    placeholder: 'you@example.com',
    submit: 'Get started free →',
    submitting: 'Sending link...',
    hint: 'No password · Magic link to your inbox',
    sentTitle: 'Check your inbox',
    sentSub: (e: string) => `We sent a magic link to ${e}`,
    err: 'Something went wrong. Try again.',
    errEmail: 'Enter your email address.',
    errInvalid: 'Invalid email address.',
    social: 'Joined by 4,200+ freelancers',
    variantLabel: 'Gold variants:',
  },
  ru: {
    logo: 'InvoicePilot',
    badge: 'AI · Автоматизация инвойсов',
    title: 'Ваши инвойсы.\nОплачены.',
    sub: 'Перестаньте вручную писать follow-up письма. AI генерирует 3 идеально-тонированных варианта за секунды.',
    steps: [
      { status: 'overdue', label: 'Инвойс #1042', meta: '45 дней просрочки · $2,400', dot: 'danger' },
      { status: 'generating', label: 'AI пишет письма...', meta: '3 тона · Мягко · Твёрдо · Финальное', dot: 'gold' },
      { status: 'ready', label: '3 письма готовы', meta: 'Скопируй и отправь за 10 секунд', dot: 'success' },
    ],
    stat1v: '$2.4M', stat1l: 'возвращено',
    stat2v: '8 сек', stat2l: 'на генерацию',
    stat3v: '94%', stat3l: 'ответов',
    label: 'Рабочий email',
    placeholder: 'you@example.com',
    submit: 'Начать бесплатно →',
    submitting: 'Отправляем...',
    hint: 'Без пароля · Magic link на почту',
    sentTitle: 'Проверьте почту',
    sentSub: (e: string) => `Мы отправили magic link на ${e}`,
    err: 'Что-то пошло не так.',
    errEmail: 'Введите email.',
    errInvalid: 'Некорректный email.',
    social: '4 200+ фрилансеров уже внутри',
    variantLabel: 'Gold варианты:',
  },
  cs: {
    logo: 'InvoicePilot',
    badge: 'AI · Automatizace faktur',
    title: 'Vaše faktury.\nZaplaceny.',
    sub: 'Přestaňte ručně psát upomínky. AI vygeneruje 3 verze e-mailů za sekundy.',
    steps: [
      { status: 'overdue', label: 'Faktura #1042', meta: '45 dní po splatnosti · $2,400', dot: 'danger' },
      { status: 'generating', label: 'AI píše e-maily...', meta: '3 tóny · Přátelský · Pevný · Finální', dot: 'gold' },
      { status: 'ready', label: '3 e-maily připraveny', meta: 'Zkopírujte a odešlete za 10 sekund', dot: 'success' },
    ],
    stat1v: '$2.4M', stat1l: 'získáno zpět',
    stat2v: '8 sek', stat2l: 'na generování',
    stat3v: '94%', stat3l: 'odpovědí',
    label: 'Pracovní e-mail',
    placeholder: 'vy@example.com',
    submit: 'Začít zdarma →',
    submitting: 'Odesíláme...',
    hint: 'Bez hesla · Odkaz na váš e-mail',
    sentTitle: 'Zkontrolujte e-mail',
    sentSub: (e: string) => `Poslali jsme magic link na ${e}`,
    err: 'Něco se pokazilo.',
    errEmail: 'Zadejte e-mailovou adresu.',
    errInvalid: 'Neplatná e-mailová adresa.',
    social: '4 200+ freelancerů již uvnitř',
    variantLabel: 'Gold varianty:',
  },
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
*{font-family:'Inter',-apple-system,sans-serif;box-sizing:border-box;margin:0;padding:0;}

.b2-root{display:flex;min-height:100vh;background:#080603;}

/* ── LEFT ── */
.b2-left{
  flex:1;display:flex;flex-direction:column;padding:44px 52px;
  background:linear-gradient(150deg,#0D0A05 0%,#09060A 100%);
  position:relative;overflow:hidden;
}
.b2-glow1{
  position:absolute;top:-160px;left:-80px;width:600px;height:600px;border-radius:50%;
  background:radial-gradient(ellipse,rgba(245,158,11,0.1) 0%,transparent 65%);
  filter:blur(60px);pointer-events:none;
}
.b2-glow2{
  position:absolute;bottom:-120px;right:-60px;width:400px;height:400px;border-radius:50%;
  background:radial-gradient(ellipse,rgba(180,83,9,0.07) 0%,transparent 65%);
  filter:blur(80px);pointer-events:none;
}

/* ── RIGHT ── */
.b2-right{
  width:460px;flex-shrink:0;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:52px 48px;
  background:#060402;
  border-left:1px solid rgba(245,158,11,0.07);
  position:relative;overflow:hidden;
}
.b2-right::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(245,158,11,0.3),transparent);
}

/* ── BADGE ── */
.b2-badge{
  display:inline-flex;align-items:center;gap:7px;
  background:rgba(245,158,11,0.07);border:1px solid rgba(245,158,11,0.15);
  border-radius:999px;padding:5px 14px;
  font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;
  color:rgba(245,158,11,0.85);margin-bottom:20px;
  animation:b2up 0.5s ease both;
}
.b2-badge-dot{
  width:6px;height:6px;border-radius:50%;background:#F59E0B;
  animation:b2pulse 2s ease-in-out infinite;
  box-shadow:0 0 8px rgba(245,158,11,0.8);
}

/* ── HEADLINE ── */
.b2-title{
  font-size:clamp(38px,4.2vw,54px);font-weight:900;line-height:1.08;
  letter-spacing:-1.8px;white-space:pre-line;margin-bottom:18px;
  animation:b2up 0.5s 0.06s ease both;
  background:linear-gradient(155deg,#FBBF24 0%,#F59E0B 40%,#D97706 70%,#92400E 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  background-size:200% 200%;
  animation:b2up 0.5s 0.06s ease both, b2gradShift 6s ease-in-out infinite;
}
@keyframes b2gradShift{
  0%,100%{background-position:0% 50%;}
  50%{background-position:100% 50%;}
}

/* ── TIMELINE ── */
.b2-timeline{margin:32px 0;position:relative;}
.b2-timeline::before{
  content:'';position:absolute;left:13px;top:8px;bottom:8px;width:1px;
  background:linear-gradient(to bottom,rgba(245,158,11,0.4),rgba(245,158,11,0.1));
}
.b2-step{
  display:flex;align-items:flex-start;gap:14px;padding:0 0 24px;position:relative;
  animation:b2up 0.5s ease both;
}
.b2-step:last-child{padding-bottom:0;}
.b2-step:nth-child(2){animation-delay:0.08s;}
.b2-step:nth-child(3){animation-delay:0.16s;}
.b2-dot{
  width:26px;height:26px;border-radius:50%;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:700;border:2px solid;
  position:relative;z-index:1;
}
.b2-dot.danger{
  background:rgba(255,77,107,0.1);border-color:rgba(255,77,107,0.4);color:#FF4D6B;
}
.b2-dot.gold{
  background:rgba(245,158,11,0.12);border-color:rgba(245,158,11,0.4);color:#F59E0B;
}
.b2-dot.gold-spin::after{
  content:'';position:absolute;inset:-4px;border-radius:50%;
  border:2px solid transparent;border-top-color:#F59E0B;
  animation:spin 1s linear infinite;
}
.b2-dot.success{
  background:rgba(16,185,129,0.1);border-color:rgba(16,185,129,0.4);color:#10B981;
}
.b2-step-info{padding-top:2px;}
.b2-step-label{font-size:14px;font-weight:600;color:#F5F0E8;margin-bottom:3px;}
.b2-step-meta{font-size:12px;color:rgba(255,255,255,0.35);}

/* ── STATS ROW ── */
.b2-stats{
  display:flex;gap:0;margin-top:auto;padding-top:32px;
  border-top:1px solid rgba(255,255,255,0.05);
  animation:b2up 0.5s 0.28s ease both;
}
.b2-stat{flex:1;padding:0 20px 0 0;}
.b2-stat:first-child{padding-left:0;}
.b2-stat+.b2-stat{border-left:1px solid rgba(255,255,255,0.06);padding-left:20px;}
.b2-stat-val{font-size:24px;font-weight:800;letter-spacing:-0.8px;color:#F5F0E8;margin-bottom:4px;}
.b2-stat-label{font-size:11px;color:rgba(255,255,255,0.3);font-weight:500;}

/* ── FORM CARD ── */
.b2-card{
  width:100%;
  background:rgba(255,255,255,0.025);
  border:1px solid rgba(245,158,11,0.12);
  border-radius:20px;padding:32px;
  backdrop-filter:blur(24px);
  box-shadow:0 20px 60px rgba(0,0,0,0.35),0 0 0 1px rgba(245,158,11,0.05);
  position:relative;overflow:hidden;
  animation:b2up 0.5s 0.1s ease both;
}
.b2-card::before{
  content:'';position:absolute;top:0;left:25%;right:25%;height:1px;
  background:linear-gradient(90deg,transparent,rgba(245,158,11,0.35),transparent);
}

.b2-input{
  width:100%;background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:12px;padding:14px 16px;
  color:#F5F0E8;font-size:15px;outline:none;transition:all 0.2s;
}
.b2-input::placeholder{color:rgba(255,255,255,0.2);}
.b2-input:focus{
  border-color:rgba(245,158,11,0.5);
  background:rgba(245,158,11,0.04);
  box-shadow:0 0 0 3px rgba(245,158,11,0.1);
}
.b2-input.err{border-color:rgba(255,77,107,0.5);box-shadow:0 0 0 3px rgba(255,77,107,0.1);}

.b2-btn{
  width:100%;padding:15px;border:none;border-radius:12px;
  font-size:15px;font-weight:700;cursor:pointer;
  color:#1A0D00;letter-spacing:-0.2px;
  background:linear-gradient(135deg,#D97706 0%,#FBBF24 50%,#FDE68A 100%);
  background-size:200% 100%;
  box-shadow:0 4px 20px rgba(245,158,11,0.3),0 0 0 1px rgba(245,158,11,0.2);
  transition:all 0.25s;position:relative;overflow:hidden;
  animation:b2btnIn 0.4s 0.2s ease both;
}
.b2-btn::after{
  content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);
  animation:b2shimmer 3s ease-in-out infinite;
}
.b2-btn:hover{background-position:100% 0;transform:translateY(-2px);box-shadow:0 8px 28px rgba(245,158,11,0.4);}
.b2-btn:active{transform:translateY(0);}
.b2-btn:disabled{opacity:0.65;cursor:not-allowed;transform:none;}

@keyframes b2shimmer{0%{left:-100%;}50%,100%{left:150%;}}

/* ── SOCIAL ── */
.b2-social{
  display:flex;align-items:center;gap:12px;margin-top:20px;
  animation:b2up 0.5s 0.25s ease both;
}
.b2-stars{color:#F59E0B;font-size:13px;letter-spacing:1px;}

/* ── LANG ── */
.b2-lang{
  display:flex;gap:2px;padding:3px;
  background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);
  border-radius:10px;
}
.b2-lang-btn{
  padding:5px 11px;border-radius:7px;font-size:11px;font-weight:600;
  background:transparent;color:rgba(255,255,255,0.3);border:none;
  cursor:pointer;transition:all 0.15s;
}
.b2-lang-btn.on{background:rgba(245,158,11,0.15);color:#F59E0B;}

/* ── SENT ── */
.b2-sent{text-align:center;animation:b2up 0.4s ease both;}
.b2-sent-icon{
  width:66px;height:66px;border-radius:18px;margin:0 auto 18px;
  background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);
  display:flex;align-items:center;justify-content:center;font-size:30px;
}

/* ── NAV ── */
.b2-vnav{
  position:fixed;bottom:20px;left:50%;transform:translateX(-50%);
  display:flex;align-items:center;gap:6px;
  background:rgba(8,6,3,0.9);backdrop-filter:blur(16px);
  border:1px solid rgba(245,158,11,0.15);border-radius:999px;
  padding:8px 16px;font-size:12px;color:rgba(255,255,255,0.3);z-index:100;
}
.b2-vlink{
  padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;
  text-decoration:none;transition:all 0.15s;color:rgba(255,255,255,0.4);
}
.b2-vlink:hover{color:white;background:rgba(255,255,255,0.08);}
.b2-vlink.on{background:rgba(245,158,11,0.15);color:#F59E0B;}

@keyframes b2up{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
@keyframes b2btnIn{from{opacity:0;transform:scale(0.97);}to{opacity:1;transform:scale(1);}}
@keyframes b2pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}
@keyframes spin{to{transform:rotate(360deg);}}

@media(max-width:800px){
  .b2-root{flex-direction:column;}
  .b2-left{padding:36px 28px;}
  .b2-right{width:100%;padding:36px 28px;border-left:none;border-top:1px solid rgba(245,158,11,0.07);}
}
`

export default function LoginB2() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'sent'|'error'>('idle')
  const [lang, setLang] = useState<Lang>('en')
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('ip_lang') as Lang | null
    if (saved && saved in T) setLang(saved)
    // cycle through steps
    const t = setInterval(() => setActiveStep(s => (s + 1) % 3), 2000)
    return () => clearInterval(t)
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

  const dotIcons = ['!', '↻', '✓']

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="b2-root">

        {/* ── LEFT ── */}
        <div className="b2-left">
          <div className="b2-glow1" /><div className="b2-glow2" />

          {/* Top bar */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:52, position:'relative', zIndex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:34,height:34,borderRadius:9,background:'linear-gradient(135deg,#D97706,#F59E0B)', display:'flex',alignItems:'center',justifyContent:'center',fontSize:17, boxShadow:'0 4px 16px rgba(245,158,11,0.35)' }}>✈</div>
              <span style={{ fontSize:18,fontWeight:700,color:'#F5F0E8',letterSpacing:'-0.3px' }}>{tr.logo}</span>
            </div>
            <div className="b2-lang">
              {(['en','ru','cs'] as Lang[]).map(l => <button key={l} className={`b2-lang-btn${lang===l?' on':''}`} onClick={()=>switchLang(l)}>{l.toUpperCase()}</button>)}
            </div>
          </div>

          {/* Badge */}
          <div className="b2-badge" style={{ zIndex:1 }}>
            <div className="b2-badge-dot" />{tr.badge}
          </div>

          {/* Title */}
          <h1 className="b2-title" style={{ zIndex:1 }}>{tr.title}</h1>

          <p style={{ fontSize:14,color:'rgba(255,255,255,0.38)',lineHeight:1.7,maxWidth:400,marginBottom:4,zIndex:1,position:'relative', animation:'b2up 0.5s 0.12s ease both' }}>
            {tr.sub}
          </p>

          {/* Timeline */}
          <div className="b2-timeline" style={{ position:'relative', zIndex:1 }}>
            {tr.steps.map((step, i) => (
              <div key={i} className="b2-step" style={{
                opacity: activeStep === i ? 1 : activeStep > i ? 0.5 : 0.3,
                transition: 'opacity 0.5s',
                animationDelay: `${0.18 + i * 0.08}s`,
              }}>
                <div className={`b2-dot ${step.dot}${step.dot==='gold'&&activeStep===1?' gold-spin':''}`}>
                  {activeStep === i && step.dot === 'gold' ? '' : dotIcons[i]}
                </div>
                <div className="b2-step-info">
                  <div className="b2-step-label">{step.label}</div>
                  <div className="b2-step-meta">{step.meta}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="b2-stats">
            {[
              {v:tr.stat1v,l:tr.stat1l},
              {v:tr.stat2v,l:tr.stat2l},
              {v:tr.stat3v,l:tr.stat3l},
            ].map((s,i) => (
              <div key={i} className="b2-stat">
                <div className="b2-stat-val">{s.v}</div>
                <div className="b2-stat-label">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="b2-right">
          <div style={{ width:'100%', maxWidth:360 }}>

            {status === 'sent' ? (
              <div className="b2-card"><div className="b2-sent">
                <div className="b2-sent-icon">✉️</div>
                <h2 style={{ fontSize:22,fontWeight:700,color:'#F5F0E8',letterSpacing:'-0.4px',marginBottom:10 }}>{tr.sentTitle}</h2>
                <p style={{ fontSize:14,color:'rgba(255,255,255,0.4)',lineHeight:1.65 }}>{tr.sentSub(email)}</p>
              </div></div>
            ) : (
              <>
                <div style={{ marginBottom:28, animation:'b2up 0.4s ease both' }}>
                  <h2 style={{ fontSize:22,fontWeight:800,color:'#F5F0E8',letterSpacing:'-0.5px',marginBottom:6 }}>Start for free</h2>
                  <p style={{ fontSize:13,color:'rgba(255,255,255,0.32)' }}>No card required · Cancel anytime</p>
                </div>

                <div className="b2-card">
                  <form onSubmit={submit} noValidate>
                    <label style={{ fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.35)',display:'block',marginBottom:8,letterSpacing:'0.5px',textTransform:'uppercase' }}>
                      {tr.label}
                    </label>
                    <input
                      type="email" className={`b2-input${emailError?' err':''}`}
                      placeholder={tr.placeholder} value={email}
                      onChange={e=>{setEmail(e.target.value);if(emailError)setEmailError('')}}
                      onBlur={()=>{if(email)setEmailError(validate(email))}}
                      disabled={status==='loading'} autoComplete="email"
                      style={{ marginBottom:emailError?6:16 }}
                    />
                    {emailError && <div style={{ color:'#FF4D6B',fontSize:12,marginBottom:12,display:'flex',alignItems:'center',gap:4 }}><span>⚠</span>{emailError}</div>}

                    <button className="b2-btn" type="submit" disabled={status==='loading'}>
                      {status==='loading'
                        ? <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
                            <span style={{ width:15,height:15,border:'2px solid rgba(26,13,0,0.3)',borderTopColor:'#1A0D00',borderRadius:'50%',display:'inline-block',animation:'spin 0.7s linear infinite' }}/>
                            {tr.submitting}
                          </span>
                        : tr.submit}
                    </button>

                    {status==='error' && <div style={{ marginTop:12,padding:'10px 14px',background:'rgba(255,77,107,0.08)',border:'1px solid rgba(255,77,107,0.2)',borderRadius:10,fontSize:13,color:'#FF4D6B',textAlign:'center' }}>{tr.err}</div>}

                    <p style={{ fontSize:12,color:'rgba(255,255,255,0.2)',textAlign:'center',marginTop:14 }}>{tr.hint}</p>
                  </form>
                </div>

                <div className="b2-social">
                  <div className="b2-stars">★★★★★</div>
                  <span style={{ fontSize:13,color:'rgba(255,255,255,0.28)',fontWeight:500 }}>{tr.social}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="b2-vnav">
        <span>{tr.variantLabel}</span>
        <a href="/login-b" className="b2-vlink">B</a>
        <a href="/login-b2" className="b2-vlink on">B2 — Split</a>
        <a href="/login-b3" className="b2-vlink">B3 — Diagonal</a>
        <a href="/login-b4" className="b2-vlink">B4 — Orbit</a>
      </div>
    </>
  )
}
