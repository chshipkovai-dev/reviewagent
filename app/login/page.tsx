'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Mode = 'signin' | 'signup' | 'reset'
type Lang = 'en' | 'ru' | 'cs'

// ── TRANSLATIONS ──────────────────────────────────────────
const T = {
  en: {
    headline: 'Turn every review\ninto a reason\nto come back.',
    headlineAccent: 'to come back.',
    sub: 'AI writes professional responses to your Google reviews in seconds. Stop losing customers to silence.',
    stat1l: 'customers expect\na reply to reviews',
    stat2l: 'average response\ngeneration time',
    stat3l: 'vs $200–500/mo\nfor agencies',
    aiResponse: 'AI Response',
    repliedTo: (author: string, business: string) => `Replied to ${author} · ${business}`,
    signIn: 'Sign In', signUp: 'Sign Up',
    titleSignIn: 'Welcome back', titleSignUp: 'Create your account', titleReset: 'Reset password',
    subSignIn: 'Sign in to manage your review responses.', subSignUp: 'Start responding to reviews in seconds.',
    subReset: "Enter your email and we'll send a reset link.",
    back: '← Back to sign in',
    labelEmail: 'Email address', labelPassword: 'Password', labelConfirm: 'Confirm password',
    placeholderEmail: 'you@example.com', placeholderPassword: '••••••••',
    forgot: 'Forgot password?',
    btnSignIn: 'Sign in →', btnSignUp: 'Create account →', btnReset: 'Send reset link →',
    loading: 'Please wait...',
    errMatch: 'Passwords do not match.',
    errShort: 'Password must be at least 8 characters.',
    errInvalid: 'Invalid email or password.',
    errDefault: 'Something went wrong.',
    successSignUp: 'Check your email to confirm your account.',
    successReset: 'Reset link sent — check your email.',
    divider: 'secure login',
    hint: '🔒 Your data is encrypted · $49/month · Cancel anytime',
  },
  ru: {
    headline: 'Отвечайте на каждый\nотзыв и возвращайте\nклиентов снова.',
    headlineAccent: 'клиентов снова.',
    sub: 'AI пишет профессиональные ответы на ваши Google-отзывы за секунды. Перестаньте терять клиентов из-за молчания.',
    stat1l: 'клиентов ожидают\nответ на отзыв',
    stat2l: 'среднее время\nгенерации ответа',
    stat3l: 'вместо $200–500/мес\nу агентств',
    aiResponse: 'Ответ AI',
    repliedTo: (author: string, business: string) => `Ответ для ${author} · ${business}`,
    signIn: 'Войти', signUp: 'Регистрация',
    titleSignIn: 'С возвращением', titleSignUp: 'Создайте аккаунт', titleReset: 'Сброс пароля',
    subSignIn: 'Войдите для управления ответами на отзывы.', subSignUp: 'Начните отвечать на отзывы за секунды.',
    subReset: 'Введите email — пришлём ссылку для сброса.',
    back: '← Назад',
    labelEmail: 'Email адрес', labelPassword: 'Пароль', labelConfirm: 'Подтвердите пароль',
    placeholderEmail: 'you@example.com', placeholderPassword: '••••••••',
    forgot: 'Забыли пароль?',
    btnSignIn: 'Войти →', btnSignUp: 'Создать аккаунт →', btnReset: 'Отправить ссылку →',
    loading: 'Подождите...',
    errMatch: 'Пароли не совпадают.',
    errShort: 'Пароль минимум 8 символов.',
    errInvalid: 'Неверный email или пароль.',
    errDefault: 'Что-то пошло не так.',
    successSignUp: 'Проверьте почту — там ссылка для подтверждения.',
    successReset: 'Ссылка отправлена — проверьте почту.',
    divider: 'безопасный вход',
    hint: '🔒 Данные защищены · $49/мес · Отмена в любой момент',
  },
  cs: {
    headline: 'Odpovídejte na každou\nrecenzi a přivádějte\nzákazníky zpět.',
    headlineAccent: 'zákazníky zpět.',
    sub: 'AI píše profesionální odpovědi na vaše Google recenze během sekund. Přestaňte ztrácet zákazníky kvůli tichu.',
    stat1l: 'zákazníků očekává\nodpověď na recenzi',
    stat2l: 'průměrná doba\ngenerování odpovědi',
    stat3l: 'oproti $200–500/měs\nu agentur',
    aiResponse: 'Odpověď AI',
    repliedTo: (author: string, business: string) => `Odpověď pro ${author} · ${business}`,
    signIn: 'Přihlásit', signUp: 'Registrace',
    titleSignIn: 'Vítejte zpět', titleSignUp: 'Vytvořte účet', titleReset: 'Obnovit heslo',
    subSignIn: 'Přihlaste se pro správu odpovědí na recenze.', subSignUp: 'Začněte odpovídat na recenze během sekund.',
    subReset: 'Zadejte e-mail a zašleme odkaz pro obnovu.',
    back: '← Zpět',
    labelEmail: 'E-mailová adresa', labelPassword: 'Heslo', labelConfirm: 'Potvrdit heslo',
    placeholderEmail: 'vy@example.com', placeholderPassword: '••••••••',
    forgot: 'Zapomněli jste heslo?',
    btnSignIn: 'Přihlásit se →', btnSignUp: 'Vytvořit účet →', btnReset: 'Odeslat odkaz →',
    loading: 'Čekejte...',
    errMatch: 'Hesla se neshodují.',
    errShort: 'Heslo musí mít alespoň 8 znaků.',
    errInvalid: 'Neplatný e-mail nebo heslo.',
    errDefault: 'Něco se pokazilo.',
    successSignUp: 'Zkontrolujte e-mail — tam je odkaz pro potvrzení.',
    successReset: 'Odkaz odeslán — zkontrolujte e-mail.',
    divider: 'bezpečné přihlášení',
    hint: '🔒 Data jsou šifrována · $49/měs · Zrušení kdykoli',
  },
}

// Demo reviews (English — product demo content)
const DEMO_REVIEWS = [
  {
    stars: 5, author: 'Sarah M.', business: 'Bella Cucina',
    text: 'Amazing food and atmosphere! The pasta was incredible, will definitely be back.',
    response: 'Thank you so much, Sarah! We\'re thrilled you loved the pasta — it\'s our chef\'s specialty. Can\'t wait to welcome you back! 🍝',
  },
  {
    stars: 2, author: 'James K.', business: 'Luxe Hair Studio',
    text: 'Service was slow, waited 40 minutes despite having a reservation.',
    response: 'Hi James, we sincerely apologize for the wait. This is not the experience we strive to provide. Please reach out — we\'d love to make it right.',
  },
  {
    stars: 4, author: 'Emily R.', business: 'Luxe Hair Studio',
    text: 'Great haircut, love the new look! Staff was very friendly. Parking was a bit tricky.',
    response: 'Thank you Emily! So happy you love your new look! We\'ll look into improving parking for our guests. See you next time! ✂️',
  },
]

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
*{font-family:'Inter',-apple-system,sans-serif;box-sizing:border-box;margin:0;padding:0;}

.ra-root{min-height:100vh;display:flex;background:#050C08;overflow:hidden;}

/* ══ LEFT PANEL ══ */
.ra-left{
  width:55%;position:relative;
  background:#050C08;
  display:flex;flex-direction:column;
  padding:48px 56px;overflow:hidden;
}
.ra-left::before{
  content:'';position:absolute;inset:0;
  background-image:radial-gradient(circle,rgba(16,185,129,0.1) 1px,transparent 1px);
  background-size:28px 28px;pointer-events:none;
  animation:dotPulse 6s ease-in-out infinite;
}
@keyframes dotPulse{0%,100%{opacity:0.5;}50%{opacity:0.9;}}
.ra-glow1{position:absolute;top:-120px;left:-80px;width:500px;height:500px;border-radius:50%;background:radial-gradient(ellipse,rgba(16,185,129,0.07) 0%,transparent 65%);filter:blur(60px);pointer-events:none;}
.ra-glow2{position:absolute;bottom:-60px;right:-40px;width:400px;height:400px;border-radius:50%;background:radial-gradient(ellipse,rgba(5,150,105,0.06) 0%,transparent 65%);filter:blur(80px);pointer-events:none;}

.ra-logo{display:flex;align-items:center;gap:10px;position:relative;z-index:2;margin-bottom:48px;}
.ra-logo-icon{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,#059669,#10B981);display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 4px 16px rgba(16,185,129,0.3);}
.ra-logo-name{font-size:17px;font-weight:700;color:#F0FBF4;letter-spacing:-0.3px;}

.ra-headline{position:relative;z-index:2;font-size:clamp(26px,2.4vw,36px);font-weight:900;letter-spacing:-1.2px;line-height:1.12;color:#F0FBF4;margin-bottom:14px;white-space:pre-line;}
.ra-headline span{background:linear-gradient(135deg,#34D399,#10B981);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.ra-sub{position:relative;z-index:2;font-size:14px;color:rgba(240,251,244,0.42);line-height:1.7;margin-bottom:36px;max-width:420px;}

/* demo */
.ra-demo{position:relative;z-index:2;flex:1;display:flex;flex-direction:column;justify-content:center;gap:12px;}
.ra-review-card{background:rgba(16,185,129,0.04);border:1px solid rgba(16,185,129,0.12);border-radius:16px;padding:18px 20px;animation:cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;}
@keyframes cardIn{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
.ra-card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.ra-stars{display:flex;gap:3px;}
.ra-author-chip{display:flex;align-items:center;gap:6px;}
.ra-avatar{width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#064E3B,#10B981);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#F0FBF4;}
.ra-author-name{font-size:12px;font-weight:600;color:rgba(240,251,244,0.55);}
.ra-review-text{font-size:13px;color:rgba(240,251,244,0.72);line-height:1.6;}
.ra-response-wrap{display:flex;align-items:flex-start;gap:10px;animation:cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;}
.ra-ai-badge{flex-shrink:0;margin-top:2px;width:22px;height:22px;border-radius:6px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.25);display:flex;align-items:center;justify-content:center;font-size:10px;}
.ra-response-card{flex:1;background:rgba(240,251,244,0.03);border:1px solid rgba(240,251,244,0.07);border-radius:14px;padding:14px 16px;}
.ra-response-label{font-size:10px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#10B981;margin-bottom:8px;display:flex;align-items:center;gap:6px;}
.ra-typing-dot{width:5px;height:5px;border-radius:50%;background:#10B981;animation:typingBlink 1s ease-in-out infinite;}
@keyframes typingBlink{0%,100%{opacity:1;}50%{opacity:0.2;}}
.ra-response-text{font-size:12px;color:rgba(240,251,244,0.58);line-height:1.65;}
.ra-replied{display:inline-flex;align-items:center;gap:5px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);border-radius:999px;padding:4px 12px;font-size:11px;font-weight:700;color:#10B981;margin-top:4px;animation:badgeIn 0.3s cubic-bezier(0.16,1,0.3,1) both;}
@keyframes badgeIn{from{opacity:0;transform:scale(0.8);}to{opacity:1;transform:scale(1);}}

/* stats */
.ra-stats{position:relative;z-index:2;display:flex;margin-top:28px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;overflow:hidden;}
.ra-stat{flex:1;padding:14px;border-right:1px solid rgba(255,255,255,0.05);}
.ra-stat:last-child{border-right:none;}
.ra-stat-v{font-size:20px;font-weight:900;color:#F0FBF4;letter-spacing:-0.6px;}
.ra-stat-l{font-size:11px;color:rgba(240,251,244,0.32);margin-top:3px;line-height:1.4;white-space:pre-line;}

/* ══ RIGHT PANEL ══ */
.ra-right{
  width:45%;display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  padding:48px 40px;
  background:#07100B;
  border-left:1px solid rgba(16,185,129,0.08);
  position:relative;overflow:hidden;
}
.ra-right::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse at 50% 0%,rgba(16,185,129,0.04) 0%,transparent 60%);pointer-events:none;}
.ra-form-wrap{position:relative;z-index:1;width:100%;max-width:400px;}

.ra-form-title{font-size:24px;font-weight:800;letter-spacing:-0.6px;color:#F0FBF4;margin-bottom:6px;}
.ra-form-sub{font-size:13px;color:rgba(240,251,244,0.38);margin-bottom:28px;line-height:1.6;}

/* lang switcher */
.ra-lang{
  position:fixed;top:20px;right:20px;z-index:50;
  display:flex;gap:2px;padding:3px;
  background:rgba(5,12,8,0.9);backdrop-filter:blur(12px);
  border:1px solid rgba(16,185,129,0.12);border-radius:10px;
}
.ra-lang-btn{padding:5px 11px;border-radius:7px;font-size:11px;font-weight:600;background:transparent;color:rgba(240,251,244,0.3);border:none;cursor:pointer;transition:all 0.15s;}
.ra-lang-btn.on{background:rgba(16,185,129,0.12);color:#10B981;}

/* tabs */
.ra-tabs{display:flex;gap:2px;padding:3px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:11px;margin-bottom:24px;}
.ra-tab{flex:1;padding:9px;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.15s;background:transparent;color:rgba(240,251,244,0.3);}
.ra-tab.on{background:rgba(16,185,129,0.12);color:#10B981;}

/* fields */
.ra-field{margin-bottom:14px;position:relative;}
.ra-label{font-size:11px;font-weight:700;color:rgba(240,251,244,0.35);display:block;margin-bottom:7px;letter-spacing:0.5px;text-transform:uppercase;}
.ra-input{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:11px;padding:13px 44px 13px 15px;color:#F0FBF4;font-size:14px;outline:none;transition:all 0.2s;}
.ra-input::placeholder{color:rgba(240,251,244,0.18);}
.ra-input:focus{border-color:rgba(16,185,129,0.5);background:rgba(16,185,129,0.04);box-shadow:0 0 0 3px rgba(16,185,129,0.1);}
.ra-eye{position:absolute;right:13px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:rgba(240,251,244,0.3);font-size:15px;line-height:1;padding:2px;transition:color 0.15s;}
.ra-eye:hover{color:rgba(240,251,244,0.6);}
/* strength */
.ra-strength{margin:-6px 0 10px;}
.ra-strength-bar{height:3px;border-radius:2px;background:rgba(255,255,255,0.06);overflow:hidden;margin-bottom:4px;}
.ra-strength-fill{height:100%;border-radius:2px;transition:all 0.35s;}
.ra-strength-label{font-size:11px;font-weight:600;}

.ra-forgot{text-align:right;margin:-6px 0 14px;}
.ra-forgot button{background:none;border:none;cursor:pointer;font-size:12px;color:rgba(16,185,129,0.55);transition:color 0.15s;}
.ra-forgot button:hover{color:#10B981;}

/* button */
.ra-btn{width:100%;padding:14px;border:none;border-radius:11px;font-size:14px;font-weight:700;cursor:pointer;color:#F0FBF4;letter-spacing:-0.1px;background:linear-gradient(135deg,#059669 0%,#10B981 60%,#34D399 100%);box-shadow:0 4px 20px rgba(16,185,129,0.25),0 0 0 1px rgba(16,185,129,0.15);transition:all 0.2s;position:relative;overflow:hidden;margin-top:4px;}
.ra-btn::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);animation:btnShimmer 2.5s 1s ease-in-out infinite;}
.ra-btn:hover{transform:translateY(-1px);box-shadow:0 8px 28px rgba(16,185,129,0.35);}
.ra-btn:disabled{opacity:0.55;cursor:not-allowed;transform:none;}
@keyframes btnShimmer{0%{left:-100%;}50%,100%{left:150%;}}

/* messages */
.ra-error{display:flex;align-items:center;gap:7px;padding:10px 14px;background:rgba(255,77,107,0.07);border:1px solid rgba(255,77,107,0.18);border-radius:10px;font-size:13px;color:#FF6B85;margin-bottom:14px;}
.ra-success{display:flex;align-items:center;gap:7px;padding:10px 14px;background:rgba(16,185,129,0.07);border:1px solid rgba(16,185,129,0.2);border-radius:10px;font-size:13px;color:#34D399;margin-bottom:14px;}

.ra-divider{display:flex;align-items:center;gap:12px;margin:20px 0;}
.ra-divider-line{flex:1;height:1px;background:rgba(255,255,255,0.06);}
.ra-divider-text{font-size:11px;color:rgba(240,251,244,0.22);white-space:nowrap;}
.ra-hint{font-size:12px;color:rgba(240,251,244,0.2);text-align:center;display:flex;align-items:center;justify-content:center;gap:5px;}
.ra-back{background:none;border:none;cursor:pointer;color:rgba(16,185,129,0.6);font-size:13px;display:flex;align-items:center;gap:5px;margin-bottom:20px;transition:color 0.15s;}
.ra-back:hover{color:#10B981;}

@keyframes spin{to{transform:rotate(360deg);}}
.ra-spinner{width:15px;height:15px;border-radius:50%;border:2px solid rgba(240,251,244,0.2);border-top-color:#F0FBF4;display:inline-block;animation:spin 0.7s linear infinite;}

@media(max-width:768px){
  .ra-root{flex-direction:column;}
  .ra-left{width:100%;padding:32px 24px;min-height:auto;}
  .ra-headline{font-size:24px;}
  .ra-demo{display:none;}
  .ra-right{width:100%;padding:32px 24px;border-left:none;border-top:1px solid rgba(16,185,129,0.08);}
  .ra-stats{display:none;}
}
`

function StarRating({ count }: { count: number }) {
  return (
    <div className="ra-stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= count ? '#F59E0B' : 'rgba(255,255,255,0.15)', fontSize: 13 }}>★</span>
      ))}
    </div>
  )
}

function DemoPanel({ tr }: { tr: typeof T['en'] }) {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<'review' | 'typing' | 'response' | 'replied'>('review')

  useEffect(() => {
    const timings: [number, typeof phase][] = [
      [1200, 'typing'], [2600, 'response'], [4200, 'replied'], [6200, 'review'],
    ]
    const timers: ReturnType<typeof setTimeout>[] = []
    function schedule() {
      timers.forEach(t => clearTimeout(t))
      timings.forEach(([delay, p]) => timers.push(setTimeout(() => setPhase(p), delay)))
      timers.push(setTimeout(() => {
        setIdx(i => (i + 1) % DEMO_REVIEWS.length)
        setPhase('review')
        schedule()
      }, 7000))
    }
    schedule()
    return () => timers.forEach(t => clearTimeout(t))
  }, [])

  const review = DEMO_REVIEWS[idx]

  return (
    <div className="ra-demo">
      <div key={`rev-${idx}`} className="ra-review-card">
        <div className="ra-card-header">
          <StarRating count={review.stars} />
          <div className="ra-author-chip">
            <div className="ra-avatar">{review.author[0]}</div>
            <span className="ra-author-name">{review.author} · Google</span>
          </div>
        </div>
        <p className="ra-review-text">"{review.text}"</p>
      </div>

      {(phase === 'typing' || phase === 'response' || phase === 'replied') && (
        <div key={`res-${idx}`} className="ra-response-wrap">
          <div className="ra-ai-badge">✦</div>
          <div className="ra-response-card">
            <div className="ra-response-label">
              {tr.aiResponse}
              {phase === 'typing' && <>
                <div className="ra-typing-dot" />
                <div className="ra-typing-dot" style={{ animationDelay:'0.2s' }} />
                <div className="ra-typing-dot" style={{ animationDelay:'0.4s' }} />
              </>}
            </div>
            {(phase === 'response' || phase === 'replied') && (
              <p key={`txt-${idx}`} className="ra-response-text">{review.response}</p>
            )}
          </div>
        </div>
      )}

      {phase === 'replied' && (
        <div key={`badge-${idx}`}>
          <div className="ra-replied">
            <span>✓</span> {tr.repliedTo(review.author, review.business)}
          </div>
        </div>
      )}
    </div>
  )
}

function getStrength(pw: string): { label: string; color: string; width: string } {
  if (!pw) return { label: '', color: 'transparent', width: '0%' }
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[0-9]/.test(pw) && /[a-zA-Z]/.test(pw)) score++
  if (/[^a-zA-Z0-9]/.test(pw)) score++
  if (score <= 1) return { label: 'Weak', color: '#FF4D6B', width: '25%' }
  if (score === 2) return { label: 'Fair', color: '#F59E0B', width: '55%' }
  return { label: 'Strong', color: '#10B981', width: '100%' }
}

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('signin')
  const [lang, setLang] = useState<Lang>('en')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem('ra_lang') as Lang | null
    if (saved && saved in T) setLang(saved)
  }, [])

  const tr = T[lang]
  function switchLang(l: Lang) { setLang(l); localStorage.setItem('ra_lang', l) }
  function switchMode(m: Mode) { setMode(m); setError(null); setSuccess(null); setPassword(''); setConfirm(''); setShowPw(false); setShowConfirm(false) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null); setSuccess(null)
    if (mode === 'signup' && password !== confirm) { setError(tr.errMatch); return }
    if (mode !== 'reset' && password.length < 8) { setError(tr.errShort); return }
    setLoading(true)
    const trimmedEmail = email.trim().toLowerCase()
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password })
        if (error) throw error
        router.push('/')
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: trimmedEmail, password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
        })
        if (error) throw error
        setSuccess(tr.successSignUp)
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) throw error
        setSuccess(tr.successReset)
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : ''
      setError(msg.toLowerCase().includes('invalid') ? tr.errInvalid : tr.errDefault)
    } finally {
      setLoading(false)
    }
  }

  const formTitle = mode === 'signin' ? tr.titleSignIn : mode === 'signup' ? tr.titleSignUp : tr.titleReset
  const formSub   = mode === 'signin' ? tr.subSignIn   : mode === 'signup' ? tr.subSignUp   : tr.subReset

  // Build headline with accent on last line
  const headlineLines = tr.headline.split('\n')

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Lang switcher — fixed top right */}
      <div className="ra-lang">
        {(['en','ru','cs'] as Lang[]).map(l => (
          <button key={l} className={`ra-lang-btn${lang===l?' on':''}`} onClick={() => switchLang(l)}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="ra-root">

        {/* ══ LEFT PANEL ══ */}
        <div className="ra-left">
          <div className="ra-glow1" /><div className="ra-glow2" />

          <div className="ra-logo">
            <div className="ra-logo-icon">⭐</div>
            <span className="ra-logo-name">ReviewAgent</span>
          </div>

          <h1 className="ra-headline">
            {headlineLines.map((line, i) =>
              i === headlineLines.length - 1
                ? <span key={i}>{line}</span>
                : <span key={i} style={{ display:'block', WebkitTextFillColor:'#F0FBF4' }}>{line}</span>
            )}
          </h1>
          <p className="ra-sub">{tr.sub}</p>

          <DemoPanel tr={tr} />

          <div className="ra-stats">
            <div className="ra-stat">
              <div className="ra-stat-v">73%</div>
              <div className="ra-stat-l">{tr.stat1l}</div>
            </div>
            <div className="ra-stat">
              <div className="ra-stat-v">8 sec</div>
              <div className="ra-stat-l">{tr.stat2l}</div>
            </div>
            <div className="ra-stat">
              <div className="ra-stat-v">$49</div>
              <div className="ra-stat-l">{tr.stat3l}</div>
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="ra-right">
          <div className="ra-form-wrap">

            {mode === 'reset' && (
              <button className="ra-back" onClick={() => switchMode('signin')}>{tr.back}</button>
            )}

            <h2 className="ra-form-title">{formTitle}</h2>
            <p className="ra-form-sub">{formSub}</p>

            {mode !== 'reset' && (
              <div className="ra-tabs">
                <button className={`ra-tab${mode==='signin'?' on':''}`} onClick={() => switchMode('signin')}>{tr.signIn}</button>
                <button className={`ra-tab${mode==='signup'?' on':''}`} onClick={() => switchMode('signup')}>{tr.signUp}</button>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="ra-field">
                <label className="ra-label">{tr.labelEmail}</label>
                <input type="email" className="ra-input" placeholder={tr.placeholderEmail}
                  value={email} onChange={e => setEmail(e.target.value)}
                  disabled={loading} autoComplete="email" />
              </div>

              {mode !== 'reset' && (
                <>
                  <div className="ra-field">
                    <label className="ra-label">{tr.labelPassword}</label>
                    <input
                      type={showPw ? 'text' : 'password'} className="ra-input"
                      placeholder={tr.placeholderPassword}
                      value={password} onChange={e => setPassword(e.target.value)}
                      disabled={loading} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    />
                    <button type="button" className="ra-eye" onClick={() => setShowPw(v => !v)}>
                      {showPw ? '🙈' : '👁'}
                    </button>
                  </div>
                  {mode === 'signup' && password && (
                    <div className="ra-strength">
                      <div className="ra-strength-bar">
                        <div className="ra-strength-fill" style={{ width: getStrength(password).width, background: getStrength(password).color }} />
                      </div>
                      <div className="ra-strength-label" style={{ color: getStrength(password).color }}>{getStrength(password).label}</div>
                    </div>
                  )}
                </>
              )}

              {mode === 'signup' && (
                <div className="ra-field">
                  <label className="ra-label">{tr.labelConfirm}</label>
                  <input
                    type={showConfirm ? 'text' : 'password'} className="ra-input"
                    placeholder={tr.placeholderPassword}
                    value={confirm} onChange={e => setConfirm(e.target.value)}
                    disabled={loading} autoComplete="new-password"
                  />
                  <button type="button" className="ra-eye" onClick={() => setShowConfirm(v => !v)}>
                    {showConfirm ? '🙈' : '👁'}
                  </button>
                </div>
              )}

              {mode === 'signin' && (
                <div className="ra-forgot">
                  <button type="button" onClick={() => switchMode('reset')}>{tr.forgot}</button>
                </div>
              )}

              {error   && <div className="ra-error"><span>⚠</span>{error}</div>}
              {success && <div className="ra-success"><span>✓</span>{success}</div>}

              <button type="submit" className="ra-btn" disabled={loading}>
                {loading
                  ? <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
                      <span className="ra-spinner" />{tr.loading}
                    </span>
                  : mode === 'signin' ? tr.btnSignIn
                  : mode === 'signup' ? tr.btnSignUp
                  : tr.btnReset}
              </button>
            </form>

            <div className="ra-divider">
              <div className="ra-divider-line" />
              <span className="ra-divider-text">{tr.divider}</span>
              <div className="ra-divider-line" />
            </div>

            <div className="ra-hint">{tr.hint}</div>
          </div>
        </div>
      </div>
    </>
  )
}
