'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
*{font-family:'Inter',-apple-system,sans-serif;box-sizing:border-box;margin:0;padding:0;}

.rp-root{min-height:100vh;background:#050C08;display:flex;align-items:center;justify-content:center;padding:40px 20px;position:relative;overflow:hidden;}
.rp-dots{position:fixed;inset:0;pointer-events:none;background-image:radial-gradient(circle,rgba(16,185,129,0.1) 1px,transparent 1px);background-size:28px 28px;opacity:0.7;}
.rp-glow{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:800px;height:600px;border-radius:50%;background:radial-gradient(ellipse,rgba(16,185,129,0.06) 0%,transparent 60%);filter:blur(60px);pointer-events:none;}

.rp-logo{position:fixed;top:20px;left:20px;z-index:20;display:flex;align-items:center;gap:9px;}
.rp-logo-icon{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,#059669,#10B981);display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 3px 12px rgba(16,185,129,0.3);}

.rp-center{position:relative;z-index:10;width:100%;max-width:400px;}
.rp-ring{position:absolute;inset:-2px;border-radius:26px;background:conic-gradient(from 0deg,rgba(16,185,129,0.0),rgba(16,185,129,0.3) 25%,rgba(16,185,129,0.0) 50%,rgba(16,185,129,0.2) 75%,rgba(16,185,129,0.0));animation:rpSpin 6s linear infinite;filter:blur(4px);}
.rp-ring-inner{position:absolute;inset:1px;border-radius:25px;background:#050C08;}
.rp-card{position:relative;z-index:1;background:rgba(7,16,11,0.95);border:1px solid rgba(16,185,129,0.15);border-radius:24px;padding:36px;backdrop-filter:blur(40px);box-shadow:0 32px 80px rgba(0,0,0,0.6),inset 0 1px 0 rgba(16,185,129,0.08);}

.rp-title{font-size:24px;font-weight:900;letter-spacing:-0.5px;margin-bottom:8px;background:linear-gradient(135deg,#34D399,#10B981);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.rp-sub{font-size:13px;color:rgba(240,251,244,0.35);margin-bottom:24px;line-height:1.6;}

.rp-label{font-size:11px;font-weight:700;color:rgba(240,251,244,0.32);display:block;margin-bottom:7px;letter-spacing:0.5px;text-transform:uppercase;}
.rp-field{position:relative;margin-bottom:14px;}
.rp-input{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:11px;padding:13px 44px 13px 15px;color:#F0FBF4;font-size:14px;outline:none;transition:all 0.2s;}
.rp-input::placeholder{color:rgba(240,251,244,0.18);}
.rp-input:focus{border-color:rgba(16,185,129,0.5);background:rgba(16,185,129,0.04);box-shadow:0 0 0 3px rgba(16,185,129,0.1);}
.rp-input.err{border-color:rgba(255,77,107,0.45);}
.rp-eye{position:absolute;right:13px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:rgba(240,251,244,0.3);font-size:16px;line-height:1;padding:2px;transition:color 0.15s;}
.rp-eye:hover{color:rgba(240,251,244,0.6);}

/* strength bar */
.rp-strength{margin-top:6px;margin-bottom:4px;}
.rp-strength-bar{height:3px;border-radius:2px;background:rgba(255,255,255,0.06);overflow:hidden;}
.rp-strength-fill{height:100%;border-radius:2px;transition:all 0.3s;}
.rp-strength-label{font-size:11px;margin-top:4px;font-weight:600;}

.rp-btn{width:100%;padding:14px;border:none;border-radius:11px;font-size:14px;font-weight:700;cursor:pointer;color:#F0FBF4;background:linear-gradient(135deg,#059669 0%,#10B981 60%,#34D399 100%);box-shadow:0 4px 20px rgba(16,185,129,0.25);transition:all 0.2s;position:relative;overflow:hidden;margin-top:8px;}
.rp-btn::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);animation:rpShimmer 2.5s 0.8s ease-in-out infinite;}
.rp-btn:hover{transform:translateY(-1px);box-shadow:0 8px 28px rgba(16,185,129,0.35);}
.rp-btn:disabled{opacity:0.55;cursor:not-allowed;transform:none;}

.rp-err{margin-top:12px;padding:10px 14px;background:rgba(255,77,107,0.07);border:1px solid rgba(255,77,107,0.18);border-radius:10px;font-size:13px;color:#FF6B85;display:flex;align-items:center;gap:7px;}
.rp-done{text-align:center;padding:8px 0;}
.rp-done-icon{font-size:40px;margin-bottom:14px;}
.rp-done-title{font-size:20px;font-weight:700;color:#F0FBF4;margin-bottom:8px;}
.rp-done-sub{font-size:13px;color:rgba(240,251,244,0.38);line-height:1.65;}

@keyframes rpSpin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
@keyframes rpShimmer{0%{left:-100%;}50%,100%{left:150%;}}
@keyframes rpLoad{to{transform:rotate(360deg);}}
`

function getStrength(pw: string): { score: 0|1|2|3; label: string; color: string; width: string } {
  if (!pw) return { score: 0, label: '', color: 'transparent', width: '0%' }
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[0-9]/.test(pw) && /[a-zA-Z]/.test(pw)) score++
  if (/[^a-zA-Z0-9]/.test(pw)) score++
  if (score <= 1) return { score: 1, label: 'Weak', color: '#FF4D6B', width: '25%' }
  if (score === 2) return { score: 2, label: 'Fair', color: '#F59E0B', width: '55%' }
  return { score: 3, label: 'Strong', color: '#10B981', width: '100%' }
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [status, setStatus] = useState<'idle'|'loading'|'done'|'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const sb = createClient()
    sb.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true)
      else window.location.href = '/login'
    })
  }, [])

  const strength = getStrength(password)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setErrorMsg('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setErrorMsg('Passwords do not match.'); return }
    setErrorMsg(''); setStatus('loading')
    const sb = createClient()
    const { error } = await sb.auth.updateUser({ password })
    if (error) { setErrorMsg(error.message || 'Something went wrong.'); setStatus('error') }
    else setStatus('done')
  }

  if (!ready) return null

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="rp-root">
        <div className="rp-dots" />
        <div className="rp-glow" />
        <div className="rp-logo">
          <div className="rp-logo-icon">⭐</div>
          <span style={{ fontSize:16, fontWeight:700, color:'#F0FBF4', letterSpacing:'-0.3px' }}>ReviewAgent</span>
        </div>

        <div className="rp-center">
          <div style={{ position:'relative' }}>
            <div className="rp-ring" />
            <div className="rp-ring-inner" />
            <div className="rp-card">
              {status === 'done' ? (
                <div className="rp-done">
                  <div className="rp-done-icon">✅</div>
                  <div className="rp-done-title">Password updated</div>
                  <p className="rp-done-sub">Your new password is saved. You can now sign in.</p>
                  <a href="/login" style={{ display:'inline-block',marginTop:20,color:'#10B981',fontSize:13,fontWeight:600,textDecoration:'none' }}>
                    Go to Sign In →
                  </a>
                </div>
              ) : (
                <>
                  <h1 className="rp-title">Set new password</h1>
                  <p className="rp-sub">Choose a strong password to protect your account.</p>
                  <form onSubmit={submit} noValidate>
                    <div className="rp-field">
                      <label className="rp-label">New password</label>
                      <input
                        type={showPw ? 'text' : 'password'}
                        className="rp-input" placeholder="••••••••"
                        value={password} onChange={e => setPassword(e.target.value)}
                        disabled={status==='loading'} autoComplete="new-password"
                      />
                      <button type="button" className="rp-eye" onClick={() => setShowPw(v => !v)}>
                        {showPw ? '🙈' : '👁'}
                      </button>
                    </div>

                    {password && (
                      <div className="rp-strength">
                        <div className="rp-strength-bar">
                          <div className="rp-strength-fill" style={{ width: strength.width, background: strength.color }} />
                        </div>
                        <div className="rp-strength-label" style={{ color: strength.color }}>{strength.label}</div>
                      </div>
                    )}

                    <div className="rp-field">
                      <label className="rp-label">Confirm password</label>
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        className={`rp-input${confirm && password !== confirm ? ' err' : ''}`}
                        placeholder="••••••••"
                        value={confirm} onChange={e => setConfirm(e.target.value)}
                        disabled={status==='loading'} autoComplete="new-password"
                      />
                      <button type="button" className="rp-eye" onClick={() => setShowConfirm(v => !v)}>
                        {showConfirm ? '🙈' : '👁'}
                      </button>
                    </div>

                    {confirm && password !== confirm && (
                      <div style={{ fontSize:12,color:'#FF6B85',marginTop:-8,marginBottom:12,display:'flex',alignItems:'center',gap:5 }}>
                        <span>⚠</span> Passwords do not match
                      </div>
                    )}

                    <button className="rp-btn" type="submit" disabled={status==='loading'}>
                      {status==='loading'
                        ? <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
                            <span style={{ width:15,height:15,border:'2px solid rgba(240,251,244,0.2)',borderTopColor:'#F0FBF4',borderRadius:'50%',display:'inline-block',animation:'rpLoad 0.7s linear infinite' }}/>
                            Saving...
                          </span>
                        : 'Set new password →'}
                    </button>

                    {(status==='error' || errorMsg) && (
                      <div className="rp-err"><span>⚠</span>{errorMsg}</div>
                    )}
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
