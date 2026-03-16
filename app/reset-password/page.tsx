'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
*{font-family:'Inter',-apple-system,sans-serif;box-sizing:border-box;margin:0;padding:0;}
.rp-root{min-height:100vh;background:#080503;display:flex;align-items:center;justify-content:center;padding:40px 20px;}
.rp-dots{position:fixed;inset:0;pointer-events:none;background-image:radial-gradient(circle,rgba(245,158,11,0.12) 1px,transparent 1px);background-size:32px 32px;opacity:0.7;}
.rp-glow{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:800px;height:600px;border-radius:50%;background:radial-gradient(ellipse,rgba(245,158,11,0.06) 0%,transparent 60%);filter:blur(60px);pointer-events:none;}
.rp-center{position:relative;z-index:10;width:100%;max-width:400px;}
.rp-ring{position:absolute;inset:-2px;border-radius:26px;background:conic-gradient(from 0deg,rgba(245,158,11,0.0),rgba(245,158,11,0.3) 25%,rgba(245,158,11,0.0) 50%,rgba(245,158,11,0.2) 75%,rgba(245,158,11,0.0));animation:spin 6s linear infinite;filter:blur(4px);}
.rp-ring-inner{position:absolute;inset:1px;border-radius:25px;background:#080503;}
.rp-card{position:relative;z-index:1;background:rgba(20,13,4,0.92);border:1px solid rgba(245,158,11,0.15);border-radius:24px;padding:36px;backdrop-filter:blur(40px);box-shadow:0 32px 80px rgba(0,0,0,0.6),inset 0 1px 0 rgba(245,158,11,0.1);}
.rp-logo{position:fixed;top:20px;left:20px;z-index:20;display:flex;align-items:center;gap:9px;}
.rp-logo-icon{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,#D97706,#F59E0B);display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 3px 12px rgba(245,158,11,0.3);}
.rp-title{font-size:24px;font-weight:900;letter-spacing:-0.5px;margin-bottom:8px;background:linear-gradient(150deg,#FBBF24 0%,#F59E0B 40%,#D97706 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.rp-sub{font-size:13px;color:rgba(255,255,255,0.32);margin-bottom:24px;line-height:1.6;}
.rp-label{font-size:11px;font-weight:700;color:rgba(255,255,255,0.32);display:block;margin-bottom:7px;letter-spacing:0.5px;text-transform:uppercase;}
.rp-input{width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);border-radius:12px;padding:13px 16px;color:#F5F0E8;font-size:15px;outline:none;transition:all 0.2s;margin-bottom:14px;}
.rp-input::placeholder{color:rgba(255,255,255,0.18);}
.rp-input:focus{border-color:rgba(245,158,11,0.55);background:rgba(245,158,11,0.05);box-shadow:0 0 0 3px rgba(245,158,11,0.12);}
.rp-input.err{border-color:rgba(255,77,107,0.5);}
.rp-btn{width:100%;padding:14px;border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;color:#1A0D00;background:linear-gradient(135deg,#D97706 0%,#F59E0B 50%,#FDE68A 100%);box-shadow:0 4px 20px rgba(245,158,11,0.35);transition:all 0.25s;position:relative;overflow:hidden;}
.rp-btn::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent);animation:shimmer 2.5s 0.8s ease-in-out infinite;}
.rp-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(245,158,11,0.45);}
.rp-btn:disabled{opacity:0.65;cursor:not-allowed;transform:none;}
.rp-err{margin-top:12px;padding:10px 14px;background:rgba(255,77,107,0.08);border:1px solid rgba(255,77,107,0.2);border-radius:10px;font-size:13px;color:#FF4D6B;text-align:center;}
.rp-done{text-align:center;padding:8px 0;}
.rp-done-icon{font-size:40px;margin-bottom:14px;}
.rp-done-title{font-size:20px;font-weight:700;color:#F5F0E8;margin-bottom:8px;}
.rp-done-sub{font-size:13px;color:rgba(255,255,255,0.38);line-height:1.65;}
@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
@keyframes shimmer{0%{left:-100%;}50%,100%{left:150%;}}
@keyframes spinload{to{transform:rotate(360deg);}}
`

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'done'|'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase puts the session in the URL hash after redirect
    const sb = createClient()
    sb.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true)
      else window.location.href = '/login'
    })
  }, [])

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
          <div className="rp-logo-icon">✈</div>
          <span style={{ fontSize:16, fontWeight:700, color:'#F5F0E8', letterSpacing:'-0.3px' }}>InvoicePilot</span>
        </div>
        <div className="rp-center">
          <div style={{ position:'relative' }}>
            <div className="rp-ring" />
            <div className="rp-ring-inner" />
            <div className="rp-card">
              {status === 'done' ? (
                <div className="rp-done">
                  <div className="rp-done-icon">✅</div>
                  <div className="rp-done-title">Password updated ✦</div>
                  <p className="rp-done-sub">Your new password is saved. You can now sign in.</p>
                  <a href="/login" style={{ display:'inline-block',marginTop:20,color:'#F59E0B',fontSize:13,fontWeight:600,textDecoration:'none' }}>Go to Sign In →</a>
                </div>
              ) : (
                <>
                  <h1 className="rp-title">New password</h1>
                  <p className="rp-sub">Choose a strong password for your account.</p>
                  <form onSubmit={submit} noValidate>
                    <label className="rp-label">New password</label>
                    <input type="password" className="rp-input" placeholder="••••••••" value={password}
                      onChange={e=>setPassword(e.target.value)} disabled={status==='loading'} autoComplete="new-password" />
                    <label className="rp-label">Confirm password</label>
                    <input type="password" className={`rp-input${errorMsg.includes('match')?' err':''}`} placeholder="••••••••" value={confirm}
                      onChange={e=>setConfirm(e.target.value)} disabled={status==='loading'} autoComplete="new-password" />
                    <button className="rp-btn" type="submit" disabled={status==='loading'}>
                      {status==='loading'
                        ? <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
                            <span style={{ width:15,height:15,border:'2px solid rgba(26,13,0,0.3)',borderTopColor:'#1A0D00',borderRadius:'50%',display:'inline-block',animation:'spinload 0.7s linear infinite' }}/>
                            Saving...
                          </span>
                        : 'Set new password →'}
                    </button>
                    {(status==='error'||errorMsg) && <div className="rp-err">{errorMsg}</div>}
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
