'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Mode = 'signin' | 'signup' | 'reset'

// Demo reviews cycling on the left panel
const DEMO_REVIEWS = [
  {
    stars: 5,
    author: 'Sarah M.',
    text: 'Amazing food and atmosphere! The pasta was incredible, will definitely be back.',
    business: 'Bella Cucina',
    type: 'Restaurant',
    response: 'Thank you so much, Sarah! We\'re thrilled you loved the pasta — it\'s our chef\'s specialty. We can\'t wait to welcome you back soon! 🍝',
  },
  {
    stars: 2,
    author: 'James K.',
    text: 'Service was slow, waited 40 minutes for our table despite having a reservation.',
    business: 'Luxe Hair Studio',
    type: 'Hair Salon',
    response: 'Hi James, we sincerely apologize for the wait. This is not the experience we strive to provide. Please reach out directly — we\'d love to make it right.',
  },
  {
    stars: 4,
    author: 'Emily R.',
    text: 'Great haircut, love the new look! Staff was very friendly. Parking was a bit tricky.',
    business: 'Luxe Hair Studio',
    type: 'Hair Salon',
    response: 'Thank you Emily! So happy you love your new look! We\'ll look into improving parking options for our guests. See you next time! ✂️',
  },
]

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
*{font-family:'Inter',-apple-system,sans-serif;box-sizing:border-box;margin:0;padding:0;}

/* ── ROOT SPLIT ── */
.ra-root{
  min-height:100vh;display:flex;
  background:#050C08;
  overflow:hidden;
}

/* ══ LEFT PANEL ══════════════════════════════════════════ */
.ra-left{
  width:55%;position:relative;
  background:#050C08;
  display:flex;flex-direction:column;
  padding:48px 56px;
  overflow:hidden;
}

/* dot grid */
.ra-left::before{
  content:'';position:absolute;inset:0;
  background-image:radial-gradient(circle,rgba(16,185,129,0.1) 1px,transparent 1px);
  background-size:28px 28px;
  pointer-events:none;
  animation:dotPulse 6s ease-in-out infinite;
}
@keyframes dotPulse{0%,100%{opacity:0.5;}50%{opacity:0.9;}}

/* green ambient glow */
.ra-glow1{
  position:absolute;top:-120px;left:-80px;
  width:500px;height:500px;border-radius:50%;
  background:radial-gradient(ellipse,rgba(16,185,129,0.07) 0%,transparent 65%);
  filter:blur(60px);pointer-events:none;
}
.ra-glow2{
  position:absolute;bottom:-60px;right:-40px;
  width:400px;height:400px;border-radius:50%;
  background:radial-gradient(ellipse,rgba(5,150,105,0.06) 0%,transparent 65%);
  filter:blur(80px);pointer-events:none;
}

/* logo */
.ra-logo{
  display:flex;align-items:center;gap:10px;
  position:relative;z-index:2;margin-bottom:56px;
}
.ra-logo-icon{
  width:34px;height:34px;border-radius:9px;
  background:linear-gradient(135deg,#059669,#10B981);
  display:flex;align-items:center;justify-content:center;
  font-size:16px;box-shadow:0 4px 16px rgba(16,185,129,0.3);
}
.ra-logo-name{font-size:17px;font-weight:700;color:#F0FBF4;letter-spacing:-0.3px;}

/* headline */
.ra-headline{
  position:relative;z-index:2;
  font-size:clamp(28px,2.6vw,38px);
  font-weight:900;letter-spacing:-1.2px;line-height:1.12;
  color:#F0FBF4;margin-bottom:16px;
}
.ra-headline span{
  background:linear-gradient(135deg,#34D399,#10B981);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.ra-sub{
  position:relative;z-index:2;
  font-size:14px;color:rgba(240,251,244,0.45);
  line-height:1.7;margin-bottom:44px;max-width:420px;
}

/* ── DEMO CARD AREA ── */
.ra-demo{
  position:relative;z-index:2;
  flex:1;display:flex;flex-direction:column;justify-content:center;
  gap:12px;
}

/* review card */
.ra-review-card{
  background:rgba(16,185,129,0.04);
  border:1px solid rgba(16,185,129,0.12);
  border-radius:16px;padding:18px 20px;
  animation:cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes cardIn{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}

.ra-card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.ra-stars{display:flex;gap:3px;font-size:13px;}
.ra-author-chip{
  display:flex;align-items:center;gap:6px;
}
.ra-avatar{
  width:24px;height:24px;border-radius:50%;
  background:linear-gradient(135deg,#064E3B,#10B981);
  display:flex;align-items:center;justify-content:center;
  font-size:10px;font-weight:700;color:#F0FBF4;
}
.ra-author-name{font-size:12px;font-weight:600;color:rgba(240,251,244,0.6);}
.ra-review-text{font-size:13px;color:rgba(240,251,244,0.75);line-height:1.6;}

/* ai response card */
.ra-response-wrap{
  display:flex;align-items:flex-start;gap:10px;
  animation:cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
}
.ra-ai-badge{
  flex-shrink:0;margin-top:2px;
  width:22px;height:22px;border-radius:6px;
  background:rgba(16,185,129,0.15);
  border:1px solid rgba(16,185,129,0.25);
  display:flex;align-items:center;justify-content:center;
  font-size:10px;
}
.ra-response-card{
  flex:1;
  background:rgba(240,251,244,0.03);
  border:1px solid rgba(240,251,244,0.07);
  border-radius:14px;padding:14px 16px;
}
.ra-response-label{
  font-size:10px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;
  color:#10B981;margin-bottom:8px;display:flex;align-items:center;gap:6px;
}
.ra-typing-dot{
  width:5px;height:5px;border-radius:50%;background:#10B981;
  animation:typingBlink 1s ease-in-out infinite;
}
@keyframes typingBlink{0%,100%{opacity:1;}50%{opacity:0.2;}}
.ra-response-text{font-size:12px;color:rgba(240,251,244,0.6);line-height:1.65;}

/* replied badge */
.ra-replied{
  display:inline-flex;align-items:center;gap:5px;
  background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);
  border-radius:999px;padding:4px 12px;
  font-size:11px;font-weight:700;color:#10B981;margin-top:4px;
  animation:badgeIn 0.3s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes badgeIn{from{opacity:0;transform:scale(0.8);}to{opacity:1;transform:scale(1);}}

/* stats row */
.ra-stats{
  position:relative;z-index:2;
  display:flex;gap:0;margin-top:32px;
  background:rgba(255,255,255,0.03);
  border:1px solid rgba(255,255,255,0.06);
  border-radius:12px;overflow:hidden;
}
.ra-stat{flex:1;padding:14px;border-right:1px solid rgba(255,255,255,0.05);}
.ra-stat:last-child{border-right:none;}
.ra-stat-v{font-size:20px;font-weight:900;color:#F0FBF4;letter-spacing:-0.6px;}
.ra-stat-l{font-size:11px;color:rgba(240,251,244,0.35);margin-top:3px;line-height:1.4;}

/* ══ RIGHT PANEL ══════════════════════════════════════════ */
.ra-right{
  width:45%;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  padding:48px 40px;
  background:#07100B;
  border-left:1px solid rgba(16,185,129,0.08);
  position:relative;
  overflow:hidden;
}
.ra-right::before{
  content:'';position:absolute;top:0;left:0;right:0;bottom:0;
  background:radial-gradient(ellipse at 50% 0%,rgba(16,185,129,0.04) 0%,transparent 60%);
  pointer-events:none;
}

.ra-form-wrap{position:relative;z-index:1;width:100%;max-width:400px;}

.ra-form-title{
  font-size:24px;font-weight:800;letter-spacing:-0.6px;color:#F0FBF4;
  margin-bottom:6px;
}
.ra-form-sub{font-size:13px;color:rgba(240,251,244,0.38);margin-bottom:28px;line-height:1.6;}

/* tabs */
.ra-tabs{
  display:flex;gap:2px;padding:3px;
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.06);
  border-radius:11px;margin-bottom:24px;
}
.ra-tab{
  flex:1;padding:9px;border:none;border-radius:8px;
  font-size:13px;font-weight:600;cursor:pointer;transition:all 0.15s;
  background:transparent;color:rgba(240,251,244,0.3);
}
.ra-tab.on{background:rgba(16,185,129,0.12);color:#10B981;}

/* field */
.ra-field{margin-bottom:14px;}
.ra-label{
  font-size:11px;font-weight:700;color:rgba(240,251,244,0.35);
  display:block;margin-bottom:7px;letter-spacing:0.5px;text-transform:uppercase;
}
.ra-input{
  width:100%;background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:11px;padding:13px 15px;
  color:#F0FBF4;font-size:14px;outline:none;
  transition:all 0.2s;
}
.ra-input::placeholder{color:rgba(240,251,244,0.18);}
.ra-input:focus{
  border-color:rgba(16,185,129,0.5);
  background:rgba(16,185,129,0.04);
  box-shadow:0 0 0 3px rgba(16,185,129,0.1);
}
.ra-input.err{border-color:rgba(255,77,107,0.45);}

/* forgot */
.ra-forgot{text-align:right;margin:-6px 0 14px;}
.ra-forgot button{background:none;border:none;cursor:pointer;font-size:12px;color:rgba(16,185,129,0.55);transition:color 0.15s;}
.ra-forgot button:hover{color:#10B981;}

/* btn */
.ra-btn{
  width:100%;padding:14px;border:none;border-radius:11px;
  font-size:14px;font-weight:700;cursor:pointer;
  color:#F0FBF4;letter-spacing:-0.1px;
  background:linear-gradient(135deg,#059669 0%,#10B981 60%,#34D399 100%);
  box-shadow:0 4px 20px rgba(16,185,129,0.25),0 0 0 1px rgba(16,185,129,0.15);
  transition:all 0.2s;position:relative;overflow:hidden;
  margin-top:4px;
}
.ra-btn::after{
  content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);
  animation:btnShimmer 2.5s 1s ease-in-out infinite;
}
.ra-btn:hover{transform:translateY(-1px);box-shadow:0 8px 28px rgba(16,185,129,0.35);}
.ra-btn:disabled{opacity:0.55;cursor:not-allowed;transform:none;}
@keyframes btnShimmer{0%{left:-100%;}50%,100%{left:150%;}}

/* messages */
.ra-error{
  display:flex;align-items:center;gap:7px;
  padding:10px 14px;background:rgba(255,77,107,0.07);
  border:1px solid rgba(255,77,107,0.18);border-radius:10px;
  font-size:13px;color:#FF6B85;margin-bottom:14px;
}
.ra-success{
  display:flex;align-items:center;gap:7px;
  padding:10px 14px;background:rgba(16,185,129,0.07);
  border:1px solid rgba(16,185,129,0.2);border-radius:10px;
  font-size:13px;color:#34D399;margin-bottom:14px;
}

.ra-divider{
  display:flex;align-items:center;gap:12px;margin:20px 0;
}
.ra-divider-line{flex:1;height:1px;background:rgba(255,255,255,0.06);}
.ra-divider-text{font-size:11px;color:rgba(240,251,244,0.25);white-space:nowrap;}

.ra-hint{
  font-size:12px;color:rgba(240,251,244,0.22);
  text-align:center;margin-top:20px;
  display:flex;align-items:center;justify-content:center;gap:5px;
}

/* reset mode */
.ra-back{
  background:none;border:none;cursor:pointer;
  color:rgba(16,185,129,0.6);font-size:13px;
  display:flex;align-items:center;gap:5px;
  margin-bottom:20px;transition:color 0.15s;
}
.ra-back:hover{color:#10B981;}

/* spinner */
@keyframes spin{to{transform:rotate(360deg);}}
.ra-spinner{
  width:15px;height:15px;border-radius:50%;
  border:2px solid rgba(240,251,244,0.2);
  border-top-color:#F0FBF4;
  display:inline-block;animation:spin 0.7s linear infinite;
}

/* mobile */
@media(max-width:768px){
  .ra-root{flex-direction:column;}
  .ra-left{width:100%;padding:32px 24px;min-height:auto;}
  .ra-headline{font-size:26px;}
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

// Left panel demo: cycles through reviews with animated response
function DemoPanel() {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<'review' | 'typing' | 'response' | 'replied'>('review')

  useEffect(() => {
    const timings: [number, typeof phase][] = [
      [1200, 'typing'],
      [2600, 'response'],
      [4200, 'replied'],
      [6200, 'review'],
    ]
    let current = 0
    const timers: ReturnType<typeof setTimeout>[] = []

    function schedule() {
      timers.forEach(t => clearTimeout(t))
      timings.forEach(([delay, p]) => {
        timers.push(setTimeout(() => setPhase(p), delay))
      })
      timers.push(setTimeout(() => {
        setIdx(i => (i + 1) % DEMO_REVIEWS.length)
        setPhase('review')
        current++
        schedule()
      }, 7000))
    }
    schedule()
    return () => timers.forEach(t => clearTimeout(t))
  }, [])

  const review = DEMO_REVIEWS[idx]

  return (
    <div className="ra-demo">
      {/* Incoming review */}
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

      {/* AI response */}
      {(phase === 'typing' || phase === 'response' || phase === 'replied') && (
        <div key={`res-${idx}`} className="ra-response-wrap">
          <div className="ra-ai-badge">✦</div>
          <div className="ra-response-card">
            <div className="ra-response-label">
              AI Response
              {phase === 'typing' && <div className="ra-typing-dot" />}
              {phase === 'typing' && <div className="ra-typing-dot" style={{ animationDelay:'0.2s' }} />}
              {phase === 'typing' && <div className="ra-typing-dot" style={{ animationDelay:'0.4s' }} />}
            </div>
            {(phase === 'response' || phase === 'replied') && (
              <p key={`txt-${idx}`} className="ra-response-text">{review.response}</p>
            )}
          </div>
        </div>
      )}

      {/* Replied badge */}
      {phase === 'replied' && (
        <div key={`badge-${idx}`}>
          <div className="ra-replied">
            <span>✓</span> Replied to {review.author} · {review.business}
          </div>
        </div>
      )}
    </div>
  )
}

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  function switchMode(m: Mode) {
    setMode(m); setError(null); setSuccess(null)
    setPassword(''); setConfirm('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null); setSuccess(null)

    if (mode === 'signup' && password !== confirm) {
      setError('Passwords do not match.'); return
    }
    if (mode !== 'reset' && password.length < 8) {
      setError('Password must be at least 8 characters.'); return
    }

    setLoading(true)
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/')
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
        })
        if (error) throw error
        setSuccess('Check your email to confirm your account.')
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) throw error
        setSuccess('Reset link sent — check your email.')
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong'
      setError(msg.toLowerCase().includes('invalid') ? 'Invalid email or password.' : msg)
    } finally {
      setLoading(false)
    }
  }

  const formTitle = mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Reset password'
  const formSub = mode === 'signin' ? 'Sign in to manage your review responses.' : mode === 'signup' ? 'Start responding to reviews in seconds.' : 'Enter your email and we\'ll send a reset link.'

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="ra-root">

        {/* ══ LEFT PANEL ══ */}
        <div className="ra-left">
          <div className="ra-glow1" /><div className="ra-glow2" />

          <div className="ra-logo">
            <div className="ra-logo-icon">⭐</div>
            <span className="ra-logo-name">ReviewAgent</span>
          </div>

          <h1 className="ra-headline">
            Turn every review<br/>into a reason<br/><span>to come back.</span>
          </h1>
          <p className="ra-sub">
            AI writes professional responses to your Google reviews in seconds.
            Stop losing customers to silence.
          </p>

          <DemoPanel />

          <div className="ra-stats">
            <div className="ra-stat">
              <div className="ra-stat-v">73%</div>
              <div className="ra-stat-l">customers expect<br/>a reply to reviews</div>
            </div>
            <div className="ra-stat">
              <div className="ra-stat-v">8 sec</div>
              <div className="ra-stat-l">average response<br/>generation time</div>
            </div>
            <div className="ra-stat">
              <div className="ra-stat-v">$49</div>
              <div className="ra-stat-l">vs $200–500/mo<br/>for agencies</div>
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="ra-right">
          <div className="ra-form-wrap">

            {mode === 'reset' ? (
              <button className="ra-back" onClick={() => switchMode('signin')}>← Back to sign in</button>
            ) : null}

            <h2 className="ra-form-title">{formTitle}</h2>
            <p className="ra-form-sub">{formSub}</p>

            {mode !== 'reset' && (
              <div className="ra-tabs">
                <button className={`ra-tab${mode==='signin'?' on':''}`} onClick={() => switchMode('signin')}>Sign In</button>
                <button className={`ra-tab${mode==='signup'?' on':''}`} onClick={() => switchMode('signup')}>Sign Up</button>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="ra-field">
                <label className="ra-label">Email address</label>
                <input
                  type="email" className="ra-input" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  disabled={loading} autoComplete="email"
                />
              </div>

              {mode !== 'reset' && (
                <div className="ra-field">
                  <label className="ra-label">Password</label>
                  <input
                    type="password" className="ra-input" placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)}
                    disabled={loading} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  />
                </div>
              )}

              {mode === 'signup' && (
                <div className="ra-field">
                  <label className="ra-label">Confirm password</label>
                  <input
                    type="password" className="ra-input" placeholder="••••••••"
                    value={confirm} onChange={e => setConfirm(e.target.value)}
                    disabled={loading} autoComplete="new-password"
                  />
                </div>
              )}

              {mode === 'signin' && (
                <div className="ra-forgot">
                  <button type="button" onClick={() => switchMode('reset')}>Forgot password?</button>
                </div>
              )}

              {error && <div className="ra-error"><span>⚠</span>{error}</div>}
              {success && <div className="ra-success"><span>✓</span>{success}</div>}

              <button type="submit" className="ra-btn" disabled={loading}>
                {loading
                  ? <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
                      <span className="ra-spinner" />
                      Please wait...
                    </span>
                  : mode === 'signin' ? 'Sign in →'
                  : mode === 'signup' ? 'Create account →'
                  : 'Send reset link →'}
              </button>
            </form>

            <div className="ra-divider">
              <div className="ra-divider-line" />
              <span className="ra-divider-text">secure login</span>
              <div className="ra-divider-line" />
            </div>

            <div className="ra-hint">🔒 Your data is encrypted · $49/month · Cancel anytime</div>
          </div>
        </div>

      </div>
    </>
  )
}
