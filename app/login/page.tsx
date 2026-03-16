'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

type Lang = 'en' | 'ru' | 'cs'
type Mode = 'signin' | 'signup' | 'reset'

const T = {
  en: {
    badge: 'LIVE · Invoice automation',
    title: 'Get paid.\nOn time.\nEvery time.',
    sub: 'AI writes the perfect follow-up email for every overdue invoice. 3 tones. 10 seconds.',
    tabSignIn: 'Sign In',
    tabSignUp: 'Sign Up',
    labelEmail: 'Email address',
    labelPassword: 'Password',
    labelConfirm: 'Confirm password',
    placeholderEmail: 'you@example.com',
    placeholderPassword: '••••••••',
    submitSignIn: 'Sign in →',
    submitSignUp: 'Create account →',
    submitReset: 'Send reset link →',
    submitting: 'Please wait...',
    forgotPassword: 'Forgot password?',
    backToSignIn: '← Back to sign in',
    resetTitle: 'Reset password',
    resetSub: 'Enter your email and we\'ll send a reset link.',
    hint: 'Your data is secure · End-to-end encrypted',
    sentSignUp: 'Check your email ✦',
    sentSignUpSub: (e: string) => `Verification link sent to ${e}. Click it to activate your account.`,
    sentReset: 'Reset link sent ✦',
    sentResetSub: (e: string) => `Check ${e} for the password reset link.`,
    errEmail: 'Enter your email.',
    errInvalid: 'Invalid email address.',
    errPassword: 'Password must be at least 8 characters.',
    errConfirm: 'Passwords do not match.',
    errWrong: 'Invalid email or password.',
    errUsed: 'This email is already registered. Sign in instead.',
    err: 'Something went wrong. Try again.',
    floats: [
      { label: 'Acme Corp', amount: '$3,200', days: '60 days', status: 'danger', icon: '⚠' },
      { label: 'Studio K', amount: '$1,800', days: '32 days', status: 'warning', icon: '!' },
      { label: 'AI wrote 3 emails', amount: '8 sec', days: 'just now', status: 'gold', icon: '✦' },
      { label: 'DevShop', amount: '$4,500', days: '45 days', status: 'danger', icon: '⚠' },
      { label: 'TechVenture', amount: '$920', days: 'Paid ✓', status: 'success', icon: '✓' },
    ],
  },
  ru: {
    badge: 'LIVE · Автоматизация инвойсов',
    title: 'Получай деньги.\nВовремя.\nКаждый раз.',
    sub: 'AI пишет идеальное follow-up письмо для каждого просроченного инвойса. 3 тона. 10 секунд.',
    tabSignIn: 'Войти',
    tabSignUp: 'Регистрация',
    labelEmail: 'Email адрес',
    labelPassword: 'Пароль',
    labelConfirm: 'Подтвердите пароль',
    placeholderEmail: 'you@example.com',
    placeholderPassword: '••••••••',
    submitSignIn: 'Войти →',
    submitSignUp: 'Создать аккаунт →',
    submitReset: 'Отправить ссылку →',
    submitting: 'Подождите...',
    forgotPassword: 'Забыли пароль?',
    backToSignIn: '← Назад',
    resetTitle: 'Сброс пароля',
    resetSub: 'Введите email — пришлём ссылку для сброса.',
    hint: 'Ваши данные защищены · Шифрование',
    sentSignUp: 'Проверьте почту ✦',
    sentSignUpSub: (e: string) => `Ссылка подтверждения отправлена на ${e}. Нажмите её чтобы активировать аккаунт.`,
    sentReset: 'Ссылка отправлена ✦',
    sentResetSub: (e: string) => `Проверьте ${e} — там ссылка для сброса пароля.`,
    errEmail: 'Введите email.',
    errInvalid: 'Некорректный email.',
    errPassword: 'Пароль минимум 8 символов.',
    errConfirm: 'Пароли не совпадают.',
    errWrong: 'Неверный email или пароль.',
    errUsed: 'Этот email уже зарегистрирован. Войдите.',
    err: 'Что-то пошло не так. Попробуйте снова.',
    floats: [
      { label: 'Acme Corp', amount: '$3,200', days: '60 дней', status: 'danger', icon: '⚠' },
      { label: 'Studio K', amount: '$1,800', days: '32 дня', status: 'warning', icon: '!' },
      { label: 'AI написал 3 письма', amount: '8 сек', days: 'только что', status: 'gold', icon: '✦' },
      { label: 'DevShop', amount: '$4,500', days: '45 дней', status: 'danger', icon: '⚠' },
      { label: 'TechVenture', amount: '$920', days: 'Оплачено ✓', status: 'success', icon: '✓' },
    ],
  },
  cs: {
    badge: 'LIVE · Automatizace faktur',
    title: 'Dostávejte peníze.\nVčas.\nPokaždé.',
    sub: 'AI napíše dokonalý upomínkový e-mail pro každou fakturu po splatnosti. 3 tóny. 10 sekund.',
    tabSignIn: 'Přihlásit se',
    tabSignUp: 'Registrace',
    labelEmail: 'E-mailová adresa',
    labelPassword: 'Heslo',
    labelConfirm: 'Potvrdit heslo',
    placeholderEmail: 'vy@example.com',
    placeholderPassword: '••••••••',
    submitSignIn: 'Přihlásit se →',
    submitSignUp: 'Vytvořit účet →',
    submitReset: 'Odeslat odkaz →',
    submitting: 'Čekejte...',
    forgotPassword: 'Zapomněli jste heslo?',
    backToSignIn: '← Zpět',
    resetTitle: 'Obnovit heslo',
    resetSub: 'Zadejte e-mail a zašleme odkaz pro obnovu.',
    hint: 'Vaše data jsou zabezpečena · Šifrování',
    sentSignUp: 'Zkontrolujte e-mail ✦',
    sentSignUpSub: (e: string) => `Ověřovací odkaz odeslán na ${e}. Klikněte na něj pro aktivaci účtu.`,
    sentReset: 'Odkaz odeslán ✦',
    sentResetSub: (e: string) => `Zkontrolujte ${e} — tam je odkaz pro obnovu hesla.`,
    errEmail: 'Zadejte e-mail.',
    errInvalid: 'Neplatná e-mailová adresa.',
    errPassword: 'Heslo musí mít alespoň 8 znaků.',
    errConfirm: 'Hesla se neshodují.',
    errWrong: 'Neplatný e-mail nebo heslo.',
    errUsed: 'Tento e-mail je již registrován. Přihlaste se.',
    err: 'Něco se pokazilo. Zkuste to znovu.',
    floats: [
      { label: 'Acme Corp', amount: '$3,200', days: '60 dní', status: 'danger', icon: '⚠' },
      { label: 'Studio K', amount: '$1,800', days: '32 dní', status: 'warning', icon: '!' },
      { label: 'AI napsal 3 e-maily', amount: '8 sek', days: 'právě teď', status: 'gold', icon: '✦' },
      { label: 'DevShop', amount: '$4,500', days: '45 dní', status: 'danger', icon: '⚠' },
      { label: 'TechVenture', amount: '$920', days: 'Zaplaceno ✓', status: 'success', icon: '✓' },
    ],
  },
}

const POSITIONS = [
  { top:'12%', left:'6%', delay:0, dur:6 },
  { top:'18%', right:'7%', delay:0.8, dur:7 },
  { top:'62%', left:'4%', delay:1.4, dur:5.5 },
  { top:'68%', right:'6%', delay:0.4, dur:6.5 },
  { top:'40%', left:'2%', delay:1.8, dur:7.5 },
]

const FLOAT_ANIMS = ['b4float0','b4float1','b4float2','b4float3','b4float4']

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
*{font-family:'Inter',-apple-system,sans-serif;box-sizing:border-box;margin:0;padding:0;}

.b4-root{
  min-height:100vh;background:#080503;
  display:flex;align-items:center;justify-content:center;
  position:relative;overflow:hidden;
  padding:60px 20px 80px;
}

/* ── DOTS PATTERN ── */
.b4-dots{
  position:fixed;inset:0;pointer-events:none;
  background-image:radial-gradient(circle,rgba(245,158,11,0.12) 1px,transparent 1px);
  background-size:32px 32px;
  animation:b4dotsPulse 8s ease-in-out infinite;
}
@keyframes b4dotsPulse{
  0%,100%{opacity:0.6;}
  50%{opacity:1;}
}

/* ── WARM GLOW ── */
.b4-glow{
  position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
  width:1000px;height:700px;border-radius:50%;
  background:radial-gradient(ellipse,rgba(245,158,11,0.06) 0%,transparent 60%);
  filter:blur(60px);pointer-events:none;
}
.b4-glow2{
  position:fixed;top:-100px;right:-100px;width:600px;height:500px;border-radius:50%;
  background:radial-gradient(ellipse,rgba(180,83,9,0.06) 0%,transparent 65%);
  filter:blur(80px);pointer-events:none;
}

/* ── FLOATING CARDS ── */
.b4-float{
  position:fixed;
  background:rgba(255,255,255,0.03);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:14px;padding:12px 16px;
  backdrop-filter:blur(12px);
  min-width:180px;
  animation:b4entrance 0.6s ease both;
  pointer-events:none;
}
.b4-float.danger{border-color:rgba(255,77,107,0.2);background:rgba(255,77,107,0.04);}
.b4-float.warning{border-color:rgba(245,158,11,0.2);background:rgba(245,158,11,0.04);}
.b4-float.gold{border-color:rgba(245,158,11,0.25);background:rgba(245,158,11,0.06);}
.b4-float.success{border-color:rgba(16,185,129,0.2);background:rgba(16,185,129,0.04);}
.b4-float-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;}
.b4-float-label{font-size:12px;font-weight:600;color:rgba(255,255,255,0.65);}
.b4-float-icon-wrap{width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;}
.b4-float-icon-wrap.danger{background:rgba(255,77,107,0.15);color:#FF4D6B;}
.b4-float-icon-wrap.warning{background:rgba(245,158,11,0.15);color:#F59E0B;}
.b4-float-icon-wrap.gold{background:rgba(245,158,11,0.18);color:#F59E0B;}
.b4-float-icon-wrap.success{background:rgba(16,185,129,0.15);color:#10B981;}
.b4-float-amount{font-size:17px;font-weight:800;letter-spacing:-0.5px;color:#F5F0E8;margin-bottom:3px;}
.b4-float-days{font-size:11px;color:rgba(255,255,255,0.3);}

/* ── CENTER CARD ── */
.b4-center{
  position:relative;z-index:10;
  width:100%;max-width:420px;
  animation:b4up 0.6s ease both;
}

.b4-ring{
  position:absolute;inset:-2px;border-radius:26px;
  background:conic-gradient(from 0deg,rgba(245,158,11,0.0),rgba(245,158,11,0.3) 25%,rgba(245,158,11,0.0) 50%,rgba(245,158,11,0.2) 75%,rgba(245,158,11,0.0));
  animation:b4spin 6s linear infinite;
  filter:blur(4px);
}
.b4-ring-inner{position:absolute;inset:1px;border-radius:25px;background:#080503;}

.b4-card{
  position:relative;z-index:1;
  background:rgba(20,13,4,0.92);
  border:1px solid rgba(245,158,11,0.15);
  border-radius:24px;padding:36px;
  backdrop-filter:blur(40px);
  box-shadow:0 32px 80px rgba(0,0,0,0.6),inset 0 1px 0 rgba(245,158,11,0.1);
}

/* Badge */
.b4-badge{
  display:inline-flex;align-items:center;gap:7px;
  background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.18);
  border-radius:999px;padding:5px 14px;
  font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;
  color:rgba(245,158,11,0.8);margin-bottom:24px;
}
.b4-live-dot{
  width:6px;height:6px;border-radius:50%;background:#F59E0B;
  animation:b4livePulse 1.5s ease-in-out infinite;
  box-shadow:0 0 8px rgba(245,158,11,1);
}
@keyframes b4livePulse{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.4);opacity:0.7;}}

/* Title */
.b4-title{
  font-size:clamp(26px,3.5vw,34px);font-weight:900;
  letter-spacing:-1px;line-height:1.15;white-space:pre-line;
  margin-bottom:10px;
  background:linear-gradient(150deg,#FBBF24 0%,#F59E0B 40%,#D97706 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.b4-sub{font-size:12px;color:rgba(255,255,255,0.32);line-height:1.6;margin-bottom:22px;}

/* Mode Tabs */
.b4-tabs{
  display:flex;gap:2px;padding:3px;
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.07);
  border-radius:12px;margin-bottom:20px;
}
.b4-tab{
  flex:1;padding:9px;border:none;border-radius:9px;
  font-size:13px;font-weight:600;cursor:pointer;transition:all 0.15s;
  background:transparent;color:rgba(255,255,255,0.35);
}
.b4-tab.on{
  background:rgba(245,158,11,0.15);color:#F59E0B;
}

/* Inputs */
.b4-field{margin-bottom:14px;}
.b4-label{font-size:11px;font-weight:700;color:rgba(255,255,255,0.32);display:block;margin-bottom:7px;letter-spacing:0.5px;text-transform:uppercase;}
.b4-input{
  width:100%;background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.09);
  border-radius:12px;padding:13px 16px;
  color:#F5F0E8;font-size:15px;outline:none;transition:all 0.2s;
}
.b4-input::placeholder{color:rgba(255,255,255,0.18);}
.b4-input:focus{border-color:rgba(245,158,11,0.55);background:rgba(245,158,11,0.05);box-shadow:0 0 0 3px rgba(245,158,11,0.12);}
.b4-input.err{border-color:rgba(255,77,107,0.5);}
.b4-err-msg{color:#FF4D6B;font-size:12px;margin-top:5px;display:flex;align-items:center;gap:4px;}

.b4-btn{
  width:100%;padding:14px;border:none;border-radius:12px;
  font-size:15px;font-weight:700;cursor:pointer;
  color:#1A0D00;letter-spacing:-0.2px;
  background:linear-gradient(135deg,#D97706 0%,#F59E0B 50%,#FDE68A 100%);
  background-size:200% 100%;
  box-shadow:0 4px 20px rgba(245,158,11,0.35),0 0 0 1px rgba(245,158,11,0.2);
  transition:all 0.25s;position:relative;overflow:hidden;margin-top:4px;
}
.b4-btn::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent);animation:b4shimmer 2.5s 0.8s ease-in-out infinite;}
.b4-btn:hover{background-position:100% 0;transform:translateY(-2px);box-shadow:0 8px 28px rgba(245,158,11,0.45);}
.b4-btn:disabled{opacity:0.65;cursor:not-allowed;transform:none;}

.b4-forgot{
  text-align:right;margin-top:-8px;margin-bottom:14px;
}
.b4-forgot button{
  background:none;border:none;cursor:pointer;
  font-size:12px;color:rgba(245,158,11,0.6);
  transition:color 0.15s;
}
.b4-forgot button:hover{color:#F59E0B;}

.b4-hint{font-size:12px;color:rgba(255,255,255,0.18);text-align:center;margin-top:14px;display:flex;align-items:center;justify-content:center;gap:6px;}
.b4-hint-icon{opacity:0.5;}

/* Sent state */
.b4-sent{text-align:center;padding:8px 0;}
.b4-sent-icon{font-size:42px;margin-bottom:14px;animation:b4bounce 0.5s cubic-bezier(0.34,1.56,0.64,1) both;}
.b4-sent-title{font-size:20px;font-weight:700;color:#F5F0E8;letter-spacing:-0.4px;margin-bottom:8px;}
.b4-sent-sub{font-size:13px;color:rgba(255,255,255,0.38);line-height:1.65;}

/* Stats inline */
.b4-stats{
  display:flex;gap:0;margin-top:18px;
  background:rgba(255,255,255,0.03);
  border:1px solid rgba(255,255,255,0.06);
  border-radius:12px;overflow:hidden;
}
.b4-stat{flex:1;padding:10px 12px;text-align:center;border-right:1px solid rgba(255,255,255,0.06);}
.b4-stat:last-child{border-right:none;}
.b4-stat-v{font-size:15px;font-weight:800;color:#F5F0E8;letter-spacing:-0.4px;}
.b4-stat-l{font-size:10px;color:rgba(255,255,255,0.25);margin-top:2px;font-weight:500;}

/* Lang */
.b4-lang{
  position:fixed;top:20px;right:20px;z-index:20;
  display:flex;gap:2px;padding:3px;
  background:rgba(10,7,3,0.85);backdrop-filter:blur(12px);
  border:1px solid rgba(255,255,255,0.07);border-radius:10px;
}
.b4-lang-btn{padding:5px 11px;border-radius:7px;font-size:11px;font-weight:600;background:transparent;color:rgba(255,255,255,0.3);border:none;cursor:pointer;transition:all 0.15s;}
.b4-lang-btn.on{background:rgba(245,158,11,0.15);color:#F59E0B;}

/* Logo */
.b4-logo{
  position:fixed;top:20px;left:20px;z-index:20;
  display:flex;align-items:center;gap:9px;
}
.b4-logo-icon{
  width:30px;height:30px;border-radius:8px;
  background:linear-gradient(135deg,#D97706,#F59E0B);
  display:flex;align-items:center;justify-content:center;font-size:14px;
  box-shadow:0 3px 12px rgba(245,158,11,0.3);
}

/* Keyframes */
@keyframes b4up{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
@keyframes b4entrance{from{opacity:0;transform:scale(0.9)translateY(10px);}to{opacity:1;transform:scale(1)translateY(0);}}
@keyframes b4shimmer{0%{left:-100%;}50%,100%{left:150%;}}
@keyframes b4bounce{from{opacity:0;transform:scale(0.5);}to{opacity:1;transform:scale(1);}}
@keyframes b4spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
@keyframes b4float0{0%,100%{transform:translateY(0px) rotate(-1deg);}50%{transform:translateY(-12px) rotate(1deg);}}
@keyframes b4float1{0%,100%{transform:translateY(0px) rotate(1deg);}50%{transform:translateY(-10px) rotate(-1deg);}}
@keyframes b4float2{0%,100%{transform:translateY(-6px);}50%{transform:translateY(6px);}}
@keyframes b4float3{0%,100%{transform:translateY(0px) rotate(-0.5deg);}50%{transform:translateY(-14px) rotate(0.5deg);}}
@keyframes b4float4{0%,100%{transform:translateY(-4px);}50%{transform:translateY(8px);}}
@keyframes spin{to{transform:rotate(360deg);}}
`

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [mode, setMode] = useState<Mode>('signin')
  const [lang, setLang] = useState<Lang>('en')
  const [status, setStatus] = useState<'idle'|'loading'|'sent'|'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{email?:string;password?:string;confirm?:string}>({})

  useEffect(() => {
    const saved = localStorage.getItem('ip_lang') as Lang | null
    if (saved && saved in T) setLang(saved)

    // If already logged in, redirect to dashboard
    const sb = createClient()
    sb.auth.getSession().then(({ data }) => {
      if (data.session) window.location.href = '/'
    })
  }, [])

  const tr = T[lang]
  function switchLang(l: Lang) { setLang(l); localStorage.setItem('ip_lang', l) }

  function validate(): boolean {
    const errs: {email?:string;password?:string;confirm?:string} = {}
    if (!email.trim()) errs.email = tr.errEmail
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = tr.errInvalid
    if (mode !== 'reset') {
      if (!password || password.length < 8) errs.password = tr.errPassword
      if (mode === 'signup' && password !== confirm) errs.confirm = tr.errConfirm
    }
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setErrorMsg(''); setStatus('loading')
    const sb = createClient()

    if (mode === 'signin') {
      const { error } = await sb.auth.signInWithPassword({ email, password })
      if (error) {
        setErrorMsg(tr.errWrong); setStatus('error')
      } else {
        window.location.href = '/'
      }
    } else if (mode === 'signup') {
      const { error } = await sb.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      })
      if (error) {
        const msg = error.message?.toLowerCase() || ''
        setErrorMsg(msg.includes('already') ? tr.errUsed : tr.err)
        setStatus('error')
      } else {
        setStatus('sent')
      }
    } else {
      // reset
      const { error } = await sb.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`
      })
      if (error) { setErrorMsg(tr.err); setStatus('error') }
      else setStatus('sent')
    }
  }

  function switchMode(m: Mode) {
    setMode(m); setStatus('idle'); setErrorMsg(''); setFieldErrors({})
    setPassword(''); setConfirm('')
  }

  const sentTitle = mode === 'reset' ? tr.sentReset : tr.sentSignUp
  const sentSub = mode === 'reset' ? tr.sentResetSub(email) : tr.sentSignUpSub(email)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="b4-root">
        <div className="b4-dots" />
        <div className="b4-glow" /><div className="b4-glow2" />

        {/* Logo */}
        <div className="b4-logo">
          <div className="b4-logo-icon">✈</div>
          <span style={{ fontSize:16, fontWeight:700, color:'#F5F0E8', letterSpacing:'-0.3px' }}>InvoicePilot</span>
        </div>

        {/* Lang */}
        <div className="b4-lang">
          {(['en','ru','cs'] as Lang[]).map(l =>
            <button key={l} className={`b4-lang-btn${lang===l?' on':''}`} onClick={()=>switchLang(l)}>{l.toUpperCase()}</button>
          )}
        </div>

        {/* Floating cards */}
        {tr.floats.map((card, i) => {
          const pos = POSITIONS[i]
          const stylePos: React.CSSProperties = {
            top: (pos as any).top || undefined,
            bottom: (pos as any).bottom || undefined,
            left: (pos as any).left || undefined,
            right: (pos as any).right || undefined,
            animation: `b4entrance 0.5s ${(pos as any).delay}s ease both, ${FLOAT_ANIMS[i]} ${(pos as any).dur}s ${(pos as any).delay + 0.5}s ease-in-out infinite`,
          }
          return (
            <div key={i} className={`b4-float ${card.status}`} style={stylePos}>
              <div className="b4-float-top">
                <div className="b4-float-label">{card.label}</div>
                <div className={`b4-float-icon-wrap ${card.status}`}>{card.icon}</div>
              </div>
              <div className="b4-float-amount">{card.amount}</div>
              <div className="b4-float-days">{card.days}</div>
            </div>
          )
        })}

        {/* Center card */}
        <div className="b4-center">
          <div style={{ position:'relative' }}>
            <div className="b4-ring" />
            <div className="b4-ring-inner" />
            <div className="b4-card">

              {status === 'sent' ? (
                <div className="b4-sent">
                  <div className="b4-sent-icon">✉️</div>
                  <div className="b4-sent-title">{sentTitle}</div>
                  <p className="b4-sent-sub">{sentSub}</p>
                  <button
                    onClick={() => switchMode('signin')}
                    style={{ marginTop:20, background:'none', border:'none', cursor:'pointer', color:'rgba(245,158,11,0.7)', fontSize:13, fontWeight:600 }}
                  >{tr.backToSignIn}</button>
                </div>
              ) : (
                <>
                  <div className="b4-badge">
                    <div className="b4-live-dot" />
                    {tr.badge}
                  </div>

                  {mode !== 'reset' ? (
                    <>
                      <h1 className="b4-title">{tr.title}</h1>
                      <p className="b4-sub">{tr.sub}</p>

                      {/* Sign In / Sign Up tabs */}
                      <div className="b4-tabs">
                        <button className={`b4-tab${mode==='signin'?' on':''}`} onClick={()=>switchMode('signin')}>{tr.tabSignIn}</button>
                        <button className={`b4-tab${mode==='signup'?' on':''}`} onClick={()=>switchMode('signup')}>{tr.tabSignUp}</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h1 className="b4-title">{tr.resetTitle}</h1>
                      <p className="b4-sub">{tr.resetSub}</p>
                    </>
                  )}

                  <form onSubmit={submit} noValidate>
                    {/* Email */}
                    <div className="b4-field">
                      <label className="b4-label">{tr.labelEmail}</label>
                      <input
                        type="email"
                        className={`b4-input${fieldErrors.email?' err':''}`}
                        placeholder={tr.placeholderEmail}
                        value={email}
                        onChange={e => { setEmail(e.target.value); setFieldErrors(f=>({...f,email:''})) }}
                        disabled={status==='loading'}
                        autoComplete="email"
                      />
                      {fieldErrors.email && <div className="b4-err-msg"><span>⚠</span>{fieldErrors.email}</div>}
                    </div>

                    {/* Password */}
                    {mode !== 'reset' && (
                      <div className="b4-field">
                        <label className="b4-label">{tr.labelPassword}</label>
                        <input
                          type="password"
                          className={`b4-input${fieldErrors.password?' err':''}`}
                          placeholder={tr.placeholderPassword}
                          value={password}
                          onChange={e => { setPassword(e.target.value); setFieldErrors(f=>({...f,password:''})) }}
                          disabled={status==='loading'}
                          autoComplete={mode==='signin'?'current-password':'new-password'}
                        />
                        {fieldErrors.password && <div className="b4-err-msg"><span>⚠</span>{fieldErrors.password}</div>}
                      </div>
                    )}

                    {/* Confirm password — signup only */}
                    {mode === 'signup' && (
                      <div className="b4-field">
                        <label className="b4-label">{tr.labelConfirm}</label>
                        <input
                          type="password"
                          className={`b4-input${fieldErrors.confirm?' err':''}`}
                          placeholder={tr.placeholderPassword}
                          value={confirm}
                          onChange={e => { setConfirm(e.target.value); setFieldErrors(f=>({...f,confirm:''})) }}
                          disabled={status==='loading'}
                          autoComplete="new-password"
                        />
                        {fieldErrors.confirm && <div className="b4-err-msg"><span>⚠</span>{fieldErrors.confirm}</div>}
                      </div>
                    )}

                    {/* Forgot password link */}
                    {mode === 'signin' && (
                      <div className="b4-forgot">
                        <button type="button" onClick={() => switchMode('reset')}>{tr.forgotPassword}</button>
                      </div>
                    )}

                    <button className="b4-btn" type="submit" disabled={status==='loading'}>
                      {status==='loading'
                        ? <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
                            <span style={{ width:15,height:15,border:'2px solid rgba(26,13,0,0.3)',borderTopColor:'#1A0D00',borderRadius:'50%',display:'inline-block',animation:'spin 0.7s linear infinite' }}/>
                            {tr.submitting}
                          </span>
                        : mode==='signin' ? tr.submitSignIn : mode==='signup' ? tr.submitSignUp : tr.submitReset}
                    </button>

                    {status==='error' && (
                      <div style={{ marginTop:12,padding:'10px 14px',background:'rgba(255,77,107,0.08)',border:'1px solid rgba(255,77,107,0.2)',borderRadius:10,fontSize:13,color:'#FF4D6B',textAlign:'center' }}>
                        {errorMsg}
                      </div>
                    )}

                    {mode === 'reset' && (
                      <button type="button" onClick={() => switchMode('signin')}
                        style={{ display:'block',width:'100%',marginTop:14,background:'none',border:'none',cursor:'pointer',fontSize:13,color:'rgba(255,255,255,0.3)',textAlign:'center' }}>
                        {tr.backToSignIn}
                      </button>
                    )}

                    <div className="b4-hint">
                      <span className="b4-hint-icon">🔒</span>
                      {tr.hint}
                    </div>
                  </form>

                  {mode !== 'reset' && (
                    <div className="b4-stats">
                      {[['$2.4M','Recovered'],['94%','Response'],['8 sec','To write']].map(([v,l],i)=>(
                        <div key={i} className="b4-stat">
                          <div className="b4-stat-v">{v}</div>
                          <div className="b4-stat-l">{l}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
