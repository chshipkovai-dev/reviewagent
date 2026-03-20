'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

type Tone = 'friendly' | 'professional' | 'formal'

const TONE_LABELS: Record<Tone, string> = {
  friendly: '😊 Friendly',
  professional: '💼 Professional',
  formal: '🎩 Formal',
}

const BUSINESS_TYPES = [
  'Restaurant', 'Cafe', 'Bar', 'Hair Salon', 'Nail Salon', 'Barbershop',
  'Gym / Fitness', 'Spa', 'Hotel', 'Retail Store', 'Dental Clinic',
  'Medical Clinic', 'Other',
]

// ── LANDING CSS ──────────────────────────────────────────
const LANDING_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.ld-root{
  min-height:100vh;background:#050C08;color:#F0FBF4;
  font-family:'Inter',-apple-system,sans-serif;
  overflow-x:hidden;
}

/* dots bg */
.ld-root::before{
  content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:radial-gradient(circle,rgba(16,185,129,0.08) 1px,transparent 1px);
  background-size:28px 28px;
}

/* ── NAV ── */
.ld-nav{
  position:fixed;top:0;left:0;right:0;z-index:100;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 40px;height:64px;
  background:rgba(5,12,8,0.85);backdrop-filter:blur(16px);
  border-bottom:1px solid rgba(16,185,129,0.07);
}
.ld-logo{display:flex;align-items:center;gap:9px;text-decoration:none;}
.ld-logo-icon{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,#059669,#10B981);display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 3px 12px rgba(16,185,129,0.25);}
.ld-logo-name{font-size:16px;font-weight:700;color:#F0FBF4;letter-spacing:-0.3px;}
.ld-nav-right{display:flex;align-items:center;gap:12px;}
.ld-nav-link{font-size:13px;font-weight:500;color:rgba(240,251,244,0.45);text-decoration:none;transition:color 0.15s;}
.ld-nav-link:hover{color:#F0FBF4;}
.ld-nav-btn{font-size:13px;font-weight:600;padding:8px 18px;border-radius:9px;text-decoration:none;transition:all 0.2s;border:1px solid rgba(16,185,129,0.3);color:#10B981;background:rgba(16,185,129,0.06);}
.ld-nav-btn:hover{background:rgba(16,185,129,0.12);border-color:rgba(16,185,129,0.5);}

/* ── HERO ── */
.ld-hero{
  position:relative;z-index:1;
  display:flex;align-items:center;
  min-height:100vh;padding:100px 40px 80px;
  max-width:1160px;margin:0 auto;gap:80px;
}
.ld-hero-left{flex:1;min-width:0;}
.ld-hero-badge{
  display:inline-flex;align-items:center;gap:7px;
  background:rgba(16,185,129,0.07);border:1px solid rgba(16,185,129,0.15);
  border-radius:999px;padding:5px 14px;
  font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;
  color:rgba(16,185,129,0.8);margin-bottom:28px;
}
.ld-live-dot{width:6px;height:6px;border-radius:50%;background:#10B981;animation:ldLivePulse 1.5s ease-in-out infinite;box-shadow:0 0 8px #10B981;}
@keyframes ldLivePulse{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.4);opacity:0.6;}}

.ld-h1{font-size:clamp(38px,4.5vw,62px);font-weight:900;letter-spacing:-2px;line-height:1.06;margin-bottom:20px;color:#F0FBF4;}
.ld-h1 span{background:linear-gradient(135deg,#34D399,#10B981 50%,#059669);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.ld-hero-sub{font-size:17px;color:rgba(240,251,244,0.45);line-height:1.7;margin-bottom:36px;max-width:480px;}

.ld-hero-cta{display:flex;align-items:center;gap:14px;flex-wrap:wrap;}
.ld-btn-primary{
  display:inline-flex;align-items:center;gap:8px;
  padding:15px 28px;border-radius:12px;font-size:15px;font-weight:700;
  text-decoration:none;color:#F0FBF4;
  background:linear-gradient(135deg,#059669,#10B981 60%,#34D399);
  box-shadow:0 4px 24px rgba(16,185,129,0.3),0 0 0 1px rgba(16,185,129,0.2);
  transition:all 0.2s;position:relative;overflow:hidden;
}
.ld-btn-primary::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);animation:ldShimmer 3s 1s ease-in-out infinite;}
.ld-btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(16,185,129,0.4);}
@keyframes ldShimmer{0%{left:-100%;}50%,100%{left:150%;}}

.ld-btn-secondary{font-size:14px;font-weight:500;color:rgba(240,251,244,0.45);text-decoration:none;transition:color 0.15s;}
.ld-btn-secondary:hover{color:#F0FBF4;}

.ld-trust{display:flex;align-items:center;gap:20px;margin-top:28px;flex-wrap:wrap;}
.ld-trust-item{display:flex;align-items:center;gap:6px;font-size:12px;color:rgba(240,251,244,0.3);}
.ld-trust-dot{width:4px;height:4px;border-radius:50%;background:rgba(16,185,129,0.4);}

/* ── HERO RIGHT: DEMO MOCKUP ── */
.ld-hero-right{
  flex:0 0 460px;
  position:relative;
  animation:ldUp 0.7s 0.2s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes ldUp{from{opacity:0;transform:translateY(32px);}to{opacity:1;transform:translateY(0);}}

.ld-mockup{
  background:rgba(7,16,11,0.9);
  border:1px solid rgba(16,185,129,0.12);
  border-radius:20px;padding:24px;
  box-shadow:0 32px 80px rgba(0,0,0,0.5),0 0 0 1px rgba(16,185,129,0.05);
  backdrop-filter:blur(20px);
}
.ld-mockup-bar{display:flex;align-items:center;gap:6px;margin-bottom:20px;}
.ld-dot{width:10px;height:10px;border-radius:50%;}

.ld-review-block{margin-bottom:14px;}
.ld-review-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.ld-review-author{display:flex;align-items:center;gap:7px;}
.ld-review-av{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#064E3B,#10B981);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;}
.ld-review-name{font-size:12px;font-weight:600;color:rgba(240,251,244,0.7);}
.ld-review-source{font-size:10px;color:rgba(240,251,244,0.3);}
.ld-review-stars{display:flex;gap:2px;font-size:12px;}
.ld-review-text{font-size:12px;color:rgba(240,251,244,0.6);line-height:1.6;padding:10px 12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;}

.ld-ai-row{display:flex;align-items:center;gap:8px;margin:12px 0 10px;}
.ld-ai-line{flex:1;height:1px;background:rgba(16,185,129,0.1);}
.ld-ai-chip{display:flex;align-items:center;gap:5px;padding:3px 10px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.18);border-radius:999px;font-size:10px;font-weight:700;letter-spacing:0.5px;color:#10B981;text-transform:uppercase;white-space:nowrap;}

.ld-response-block{padding:12px 14px;background:rgba(16,185,129,0.04);border:1px solid rgba(16,185,129,0.15);border-radius:12px;}
.ld-response-text{font-size:12px;color:rgba(240,251,244,0.75);line-height:1.65;margin-bottom:10px;}
.ld-copy-btn{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);border-radius:6px;font-size:11px;font-weight:600;color:#10B981;cursor:pointer;}

.ld-mockup-footer{display:flex;align-items:center;justify-content:space-between;margin-top:16px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.05);}
.ld-mockup-stat{text-align:center;}
.ld-mockup-stat-v{font-size:15px;font-weight:800;color:#F0FBF4;}
.ld-mockup-stat-l{font-size:10px;color:rgba(240,251,244,0.3);margin-top:2px;}

/* glow behind mockup */
.ld-hero-right::before{
  content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  width:400px;height:400px;border-radius:50%;
  background:radial-gradient(ellipse,rgba(16,185,129,0.08) 0%,transparent 65%);
  filter:blur(60px);pointer-events:none;z-index:-1;
}

/* ── STATS STRIP ── */
.ld-stats{
  position:relative;z-index:1;
  display:flex;border-top:1px solid rgba(255,255,255,0.05);
  border-bottom:1px solid rgba(255,255,255,0.05);
  background:rgba(255,255,255,0.02);
}
.ld-stat{
  flex:1;padding:32px 20px;text-align:center;
  border-right:1px solid rgba(255,255,255,0.05);
}
.ld-stat:last-child{border-right:none;}
.ld-stat-v{font-size:36px;font-weight:900;letter-spacing:-1.5px;color:#F0FBF4;margin-bottom:6px;}
.ld-stat-v span{background:linear-gradient(135deg,#34D399,#10B981);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.ld-stat-l{font-size:13px;color:rgba(240,251,244,0.38);line-height:1.5;}

/* ── HOW IT WORKS ── */
.ld-section{position:relative;z-index:1;padding:100px 40px;max-width:1100px;margin:0 auto;}
.ld-section-label{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(16,185,129,0.7);margin-bottom:16px;}
.ld-section-title{font-size:clamp(28px,3vw,42px);font-weight:900;letter-spacing:-1.2px;line-height:1.1;color:#F0FBF4;margin-bottom:16px;}
.ld-section-sub{font-size:16px;color:rgba(240,251,244,0.4);line-height:1.7;max-width:500px;margin-bottom:56px;}

.ld-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;}
.ld-step{
  padding:28px;background:rgba(255,255,255,0.02);
  border:1px solid rgba(255,255,255,0.06);border-radius:16px;
  transition:border-color 0.2s;
}
.ld-step:hover{border-color:rgba(16,185,129,0.2);}
.ld-step-num{
  width:36px;height:36px;border-radius:10px;
  background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);
  display:flex;align-items:center;justify-content:center;
  font-size:14px;font-weight:800;color:#10B981;margin-bottom:16px;
}
.ld-step-title{font-size:16px;font-weight:700;color:#F0FBF4;margin-bottom:8px;letter-spacing:-0.3px;}
.ld-step-desc{font-size:13px;color:rgba(240,251,244,0.38);line-height:1.65;}

/* ── TESTIMONIALS ── */
.ld-reviews-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.ld-tcard{
  padding:24px;
  background:rgba(255,255,255,0.02);
  border:1px solid rgba(255,255,255,0.06);
  border-radius:16px;
}
.ld-tcard-stars{display:flex;gap:3px;margin-bottom:14px;}
.ld-tcard-text{font-size:13px;color:rgba(240,251,244,0.62);line-height:1.7;margin-bottom:16px;font-style:italic;}
.ld-tcard-author{display:flex;align-items:center;gap:10px;}
.ld-tcard-av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#064E3B,#10B981);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#F0FBF4;flex-shrink:0;}
.ld-tcard-name{font-size:13px;font-weight:600;color:#F0FBF4;}
.ld-tcard-role{font-size:11px;color:rgba(240,251,244,0.35);margin-top:1px;}

/* ── PRICING ── */
.ld-pricing-wrap{display:flex;justify-content:center;}
.ld-plan{
  width:100%;max-width:420px;
  background:rgba(7,16,11,0.95);
  border:1px solid rgba(16,185,129,0.2);
  border-radius:24px;padding:40px;
  box-shadow:0 24px 60px rgba(0,0,0,0.4),0 0 0 1px rgba(16,185,129,0.05);
  position:relative;overflow:hidden;
}
.ld-plan::before{content:'';position:absolute;top:-60px;right:-60px;width:200px;height:200px;border-radius:50%;background:radial-gradient(ellipse,rgba(16,185,129,0.08) 0%,transparent 65%);pointer-events:none;}
.ld-plan-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);border-radius:999px;padding:4px 12px;font-size:10px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#10B981;margin-bottom:20px;}
.ld-plan-price{font-size:52px;font-weight:900;letter-spacing:-2px;color:#F0FBF4;line-height:1;margin-bottom:4px;}
.ld-plan-price span{font-size:20px;font-weight:600;color:rgba(240,251,244,0.4);letter-spacing:0;}
.ld-plan-period{font-size:13px;color:rgba(240,251,244,0.35);margin-bottom:28px;}
.ld-plan-features{list-style:none;display:flex;flex-direction:column;gap:12px;margin-bottom:32px;}
.ld-plan-feature{display:flex;align-items:flex-start;gap:10px;font-size:14px;color:rgba(240,251,244,0.75);}
.ld-feat-icon{width:18px;height:18px;border-radius:5px;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.2);display:flex;align-items:center;justify-content:center;font-size:9px;color:#10B981;flex-shrink:0;margin-top:1px;}
.ld-plan-cta{
  display:block;width:100%;padding:15px;border:none;border-radius:12px;
  font-size:15px;font-weight:700;cursor:pointer;text-decoration:none;text-align:center;
  color:#F0FBF4;background:linear-gradient(135deg,#059669,#10B981 60%,#34D399);
  box-shadow:0 4px 20px rgba(16,185,129,0.25);transition:all 0.2s;
}
.ld-plan-cta:hover{transform:translateY(-1px);box-shadow:0 8px 28px rgba(16,185,129,0.35);}
.ld-plan-guarantee{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:16px;font-size:12px;color:rgba(240,251,244,0.3);}

/* ── WAITLIST FORM ── */
.ld-wl-form{display:flex;gap:10px;flex-wrap:wrap;align-items:center;}
.ld-wl-form-center{justify-content:center;}
.ld-wl-input{flex:1;min-width:220px;padding:13px 16px;background:rgba(240,251,244,0.06);border:1px solid rgba(16,185,129,0.25);border-radius:10px;color:#F0FBF4;font-size:15px;outline:none;transition:border 0.2s;}
.ld-wl-input::placeholder{color:rgba(240,251,244,0.3);}
.ld-wl-input:focus{border-color:rgba(16,185,129,0.6);}
.ld-wl-btn{padding:13px 22px;background:linear-gradient(135deg,#059669,#10B981);border:none;border-radius:10px;color:#fff;font-size:15px;font-weight:700;cursor:pointer;white-space:nowrap;transition:opacity 0.2s,transform 0.2s;}
.ld-wl-btn:hover:not(:disabled){opacity:0.9;transform:translateY(-1px);}
.ld-wl-btn:disabled{opacity:0.6;cursor:not-allowed;}
.ld-wl-success{padding:14px 20px;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.3);border-radius:10px;color:#34D399;font-size:15px;font-weight:600;}
.ld-wl-err{width:100%;font-size:13px;color:#F87171;margin-top:4px;}

/* ── CTA BANNER ── */
.ld-cta-banner{
  position:relative;z-index:1;
  margin:0 40px 80px;
  padding:60px 56px;
  background:rgba(16,185,129,0.05);
  border:1px solid rgba(16,185,129,0.12);
  border-radius:24px;text-align:center;
  overflow:hidden;
}
.ld-cta-banner::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:300px;border-radius:50%;background:radial-gradient(ellipse,rgba(16,185,129,0.07) 0%,transparent 65%);pointer-events:none;}
.ld-cta-title{font-size:clamp(24px,3vw,38px);font-weight:900;letter-spacing:-1px;color:#F0FBF4;margin-bottom:12px;position:relative;}
.ld-cta-title span{background:linear-gradient(135deg,#34D399,#10B981);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.ld-cta-sub{font-size:15px;color:rgba(240,251,244,0.4);margin-bottom:32px;position:relative;}
.ld-cta-btns{display:flex;align-items:center;justify-content:center;gap:16px;position:relative;flex-wrap:wrap;}

/* ── FOOTER ── */
.ld-footer{
  position:relative;z-index:1;
  border-top:1px solid rgba(255,255,255,0.05);
  padding:32px 40px;
  display:flex;align-items:center;justify-content:space-between;
  flex-wrap:wrap;gap:16px;
}
.ld-footer-copy{font-size:12px;color:rgba(240,251,244,0.25);}
.ld-footer-links{display:flex;gap:20px;}
.ld-footer-link{font-size:12px;color:rgba(240,251,244,0.25);text-decoration:none;transition:color 0.15s;}
.ld-footer-link:hover{color:rgba(240,251,244,0.5);}

/* ── RESPONSIVE ── */
@media(max-width:900px){
  .ld-hero{flex-direction:column;gap:48px;padding:100px 24px 60px;}
  .ld-hero-right{flex:none;width:100%;}
  .ld-stats{flex-wrap:wrap;}
  .ld-stat{flex:1 1 50%;}
  .ld-section{padding:60px 24px;}
  .ld-steps{grid-template-columns:1fr;}
  .ld-reviews-grid{grid-template-columns:1fr;}
  .ld-cta-banner{margin:0 24px 60px;padding:40px 24px;}
  .ld-footer{padding:24px;}
  .ld-nav{padding:0 20px;}
}
`

// ── LANDING COMPONENT ────────────────────────────────────
function Landing() {
  const [wlEmail, setWlEmail] = useState('')
  const [wlStatus, setWlStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault()
    if (!wlEmail || wlStatus === 'loading' || wlStatus === 'success') return
    setWlStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: wlEmail }),
      })
      if (res.ok) {
        setWlStatus('success')
      } else {
        setWlStatus('error')
      }
    } catch {
      setWlStatus('error')
    }
  }

  const WaitlistForm = ({ variant = 'default' }: { variant?: 'default' | 'center' }) => (
    wlStatus === 'success' ? (
      <div className="ld-wl-success" style={{ textAlign: variant === 'center' ? 'center' : 'left' }}>
        <span>🎉</span> You&apos;re on the list! We&apos;ll email you when we launch.
      </div>
    ) : (
      <form className={`ld-wl-form${variant === 'center' ? ' ld-wl-form-center' : ''}`} onSubmit={handleWaitlist}>
        <input
          type="email"
          className="ld-wl-input"
          placeholder="your@email.com"
          value={wlEmail}
          onChange={e => setWlEmail(e.target.value)}
          required
        />
        <button type="submit" className="ld-wl-btn" disabled={wlStatus === 'loading'}>
          {wlStatus === 'loading' ? 'Joining…' : 'Get early access →'}
        </button>
        {wlStatus === 'error' && <div className="ld-wl-err">Something went wrong, try again.</div>}
      </form>
    )
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: LANDING_CSS }} />
      <div className="ld-root">

        {/* NAV */}
        <nav className="ld-nav">
          <a href="/" className="ld-logo">
            <div className="ld-logo-icon">⭐</div>
            <span className="ld-logo-name">ReviewAgent</span>
          </a>
          <div className="ld-nav-right">
            <a href="#pricing" className="ld-nav-link">Pricing</a>
            <div style={{ width:1, height:16, background:'rgba(240,251,244,0.12)' }} />
            <a href="/login" className="ld-nav-btn">Sign in</a>
          </div>
        </nav>

        {/* HERO */}
        <section className="ld-hero">
          <div className="ld-hero-left">
            <div className="ld-hero-badge">
              <div className="ld-live-dot" />
              Google Business Integration · Early Access
            </div>
            <h1 className="ld-h1">
              Your AI agent that<br/>replies to every<br/><span>Google review.</span>
            </h1>
            <p className="ld-hero-sub">
              Connect your Google Business Profile once — ReviewAgent automatically reads new reviews and posts professional replies. You just watch.
            </p>
            <div className="ld-hero-cta">
              <WaitlistForm />
            </div>
            <div className="ld-trust">
              <div className="ld-trust-item">✓ No manual copy-paste</div>
              <div className="ld-trust-dot" />
              <div className="ld-trust-item">✓ Works automatically</div>
              <div className="ld-trust-dot" />
              <div className="ld-trust-item">✓ Early bird pricing</div>
            </div>
          </div>

          {/* MOCKUP */}
          <div className="ld-hero-right">
            <div className="ld-mockup">
              <div className="ld-mockup-bar">
                <div className="ld-dot" style={{ background:'#FF5F57' }} />
                <div className="ld-dot" style={{ background:'#FFBD2E' }} />
                <div className="ld-dot" style={{ background:'#28CA41' }} />
                <span style={{ marginLeft:8,fontSize:11,color:'rgba(240,251,244,0.25)',fontWeight:500 }}>Google Review · Just received</span>
              </div>

              <div className="ld-review-block">
                <div className="ld-review-header">
                  <div className="ld-review-author">
                    <div className="ld-review-av">M</div>
                    <div>
                      <div className="ld-review-name">Maria Novak</div>
                      <div className="ld-review-source">Google · 2 hours ago</div>
                    </div>
                  </div>
                  <div className="ld-review-stars">
                    {'★★★★☆'.split('').map((s, i) => (
                      <span key={i} style={{ color: i < 4 ? '#F59E0B' : 'rgba(255,255,255,0.15)' }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div className="ld-review-text">
                  "The food was really good but we waited almost 30 minutes for a table. The pasta was amazing though — we'll probably come back."
                </div>
              </div>

              <div className="ld-ai-row">
                <div className="ld-ai-line" />
                <div className="ld-ai-chip">
                  <span>✦</span> ReviewAgent AI · 8 sec
                </div>
                <div className="ld-ai-line" />
              </div>

              <div className="ld-response-block">
                <p className="ld-response-text">
                  Thank you so much for your honest feedback, Maria! We're thrilled you enjoyed the pasta — it's one of our signatures. We sincerely apologize for the wait; we're working on improving our table management. We hope to give you a flawless experience next time! 🍝
                </p>
                <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                  <div className="ld-copy-btn">
                    <span>⎘</span> Copy to Google
                  </div>
                  <span style={{ fontSize:11,color:'rgba(16,185,129,0.6)',fontWeight:600 }}>✓ Ready to post</span>
                </div>
              </div>

              <div className="ld-mockup-footer">
                <div className="ld-mockup-stat">
                  <div className="ld-mockup-stat-v">8 sec</div>
                  <div className="ld-mockup-stat-l">to generate</div>
                </div>
                <div className="ld-mockup-stat">
                  <div className="ld-mockup-stat-v">3 tones</div>
                  <div className="ld-mockup-stat-l">to choose from</div>
                </div>
                <div className="ld-mockup-stat">
                  <div className="ld-mockup-stat-v">1 click</div>
                  <div className="ld-mockup-stat-l">to copy & post</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="ld-stats">
          {[
            { v: '73%', l: 'of customers expect a reply\nto their review' },
            { v: '4.8×', l: 'more new customers for businesses\nthat respond to reviews' },
            { v: '$49', l: 'per month — vs $200–500/mo\nfor a reputation agency' },
            { v: '8 sec', l: 'average time to generate\na professional response' },
          ].map((s, i) => (
            <div key={i} className="ld-stat">
              <div className="ld-stat-v"><span>{s.v}</span></div>
              <div className="ld-stat-l" style={{ whiteSpace:'pre-line' }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* HOW IT WORKS */}
        <section className="ld-section" id="how-it-works">
          <div className="ld-section-label">How it works</div>
          <h2 className="ld-section-title">From review to reply<br/>in three steps.</h2>
          <p className="ld-section-sub">No training, no setup. Paste your review and get a ready-to-post response in seconds.</p>
          <div className="ld-steps">
            {[
              { n:'1', title:'Set up your business', desc:'Enter your business name, type (restaurant, salon, gym...) and choose your preferred response tone — friendly, professional or formal.' },
              { n:'2', title:'Paste your reviews', desc:'Copy and paste 1 to 10 Google reviews at once. The AI reads the sentiment, stars, and context of each review individually.' },
              { n:'3', title:'Copy & post in one click', desc:'Get a polished, personalized response for each review. Click Copy and paste it directly into Google. Done in under 30 seconds.' },
            ].map(s => (
              <div key={s.n} className="ld-step">
                <div className="ld-step-num">{s.n}</div>
                <div className="ld-step-title">{s.title}</div>
                <p className="ld-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="ld-section" style={{ paddingTop:0 }}>
          <div className="ld-section-label">What owners say</div>
          <h2 className="ld-section-title">Trusted by local businesses.</h2>
          <p className="ld-section-sub" style={{ marginBottom:40 }}>Restaurant owners, salon managers, gym operators — all saving time every week.</p>
          <div className="ld-reviews-grid">
            {[
              { text: '"I used to ignore reviews because I never had time to respond. Now I reply to every single one in under 5 minutes a week. My rating went from 4.1 to 4.6."', name: 'James T.', role: 'Owner, The Oak Bistro', init: 'J' },
              { text: '"The responses sound genuinely human, not robotic. My regulars have actually commented that they appreciate how I reply to everyone now."', name: 'Sophie K.', role: 'Manager, Luxe Hair Studio', init: 'S' },
              { text: '"Customers who left 3-star reviews came back after we responded with empathy and an invitation to return. Worth every cent of $49."', name: 'Marco R.', role: 'Owner, Bella Cucina', init: 'M' },
            ].map((t, i) => (
              <div key={i} className="ld-tcard">
                <div className="ld-tcard-stars">
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color:'#F59E0B',fontSize:13 }}>★</span>)}
                </div>
                <p className="ld-tcard-text">{t.text}</p>
                <div className="ld-tcard-author">
                  <div className="ld-tcard-av">{t.init}</div>
                  <div>
                    <div className="ld-tcard-name">{t.name}</div>
                    <div className="ld-tcard-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section className="ld-section" id="pricing" style={{ paddingTop:0 }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <div className="ld-section-label" style={{ justifyContent:'center', display:'flex' }}>Pricing</div>
            <h2 className="ld-section-title" style={{ textAlign:'center' }}>Simple, honest pricing.</h2>
            <p className="ld-section-sub" style={{ margin:'0 auto', textAlign:'center' }}>One plan. Everything included. Cancel anytime.</p>
          </div>
          <div className="ld-pricing-wrap">
            <div className="ld-plan">
              <div className="ld-plan-badge">
                <span>⭐</span> Pro Plan
              </div>
              <div className="ld-plan-price"><span>$</span>49</div>
              <div className="ld-plan-period">per month · billed monthly</div>
              <ul className="ld-plan-features">
                {[
                  'Unlimited review responses',
                  'All 3 response tones (Friendly, Professional, Formal)',
                  'Up to 10 reviews per batch',
                  'Works with any Google Business profile',
                  'Supports all business types',
                ].map((f, i) => (
                  <li key={i} className="ld-plan-feature">
                    <div className="ld-feat-icon">✓</div>
                    {f}
                  </li>
                ))}
              </ul>
              <WaitlistForm variant="center" />
              <div className="ld-plan-guarantee" style={{ marginTop:16 }}>
                <span>🎯</span> Early bird pricing — locked in for waitlist members
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="ld-section" id="faq" style={{ paddingTop:0 }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <div className="ld-section-label" style={{ justifyContent:'center', display:'flex' }}>FAQ</div>
            <h2 className="ld-section-title" style={{ textAlign:'center' }}>Common questions.</h2>
          </div>
          <div style={{ maxWidth:640, margin:'0 auto', display:'flex', flexDirection:'column', gap:12 }}>
            {[
              { q: 'How does the Google Business integration work?', a: 'You connect your Google Business Profile once via OAuth. ReviewAgent then automatically reads your new reviews and posts professional replies — no manual work required.' },
              { q: 'What kind of businesses does this work for?', a: 'Any local business with Google reviews — restaurants, cafes, salons, barbershops, fitness studios, dental clinics, and more.' },
              { q: 'Do I need to approve every reply before it posts?', a: 'You choose. Run in auto-pilot mode and replies post automatically, or turn on approval mode and confirm each reply before it goes live.' },
              { q: 'What is early bird pricing?', a: 'Waitlist members lock in a discounted price that stays for as long as they keep their subscription. Price goes up at public launch.' },
              { q: 'Are my reviews stored or shared?', a: 'No. Reviews are fetched and processed in real time. We do not store the content of your reviews or replies on our servers.' },
              { q: 'When do you launch?', a: 'We are in final development. Waitlist members will get access first — sign up above to be notified.' },
            ].map(({ q, a }) => (
              <details key={q} style={{ background:'var(--elevated)', border:'1px solid var(--border)', borderRadius:12, padding:'16px 20px', cursor:'pointer' }}>
                <summary style={{ fontWeight:600, fontSize:14, color:'var(--text)', listStyle:'none', display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
                  {q}
                  <span style={{ color:'var(--muted)', fontSize:18, flexShrink:0 }}>+</span>
                </summary>
                <p style={{ marginTop:12, fontSize:13.5, color:'var(--muted)', lineHeight:1.6 }}>{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <div className="ld-cta-banner">
          <h2 className="ld-cta-title">Be first when<br/><span>we launch.</span></h2>
          <p className="ld-cta-sub">Join the waitlist — early access + locked-in early bird pricing.</p>
          <div className="ld-cta-btns">
            <WaitlistForm variant="center" />
          </div>
        </div>

        {/* FOOTER */}
        <footer className="ld-footer">
          <a href="/" className="ld-logo" style={{ textDecoration:'none' }}>
            <div className="ld-logo-icon">⭐</div>
            <span className="ld-logo-name" style={{ fontSize:14 }}>ReviewAgent</span>
          </a>
          <div className="ld-footer-copy">© 2026 ReviewAgent. All rights reserved.</div>
          <div className="ld-footer-links">
            <a href="/login" className="ld-footer-link">Sign in</a>
            <a href="#pricing" className="ld-footer-link">Pricing</a>
            <a href="#faq" className="ld-footer-link">FAQ</a>
            <a href="/privacy" className="ld-footer-link">Privacy</a>
            <a href="/terms" className="ld-footer-link">Terms</a>
          </div>
        </footer>

      </div>
    </>
  )
}

// ── APP CSS ──────────────────────────────────────────────
const APP_CSS = `
.ra-app{min-height:100vh;background:var(--bg);display:flex;flex-direction:column;}

/* HEADER */
.ra-hdr{position:sticky;top:0;z-index:100;height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 24px;background:rgba(5,12,8,0.92);backdrop-filter:blur(16px);border-bottom:1px solid rgba(16,185,129,0.07);flex-shrink:0;}
.ra-hdr-logo{display:flex;align-items:center;gap:9px;}
.ra-hdr-logo-icon{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,#059669,#10B981);display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 10px rgba(16,185,129,0.2);}
.ra-hdr-logo-name{font-size:15px;font-weight:700;letter-spacing:-0.3px;}
.ra-hdr-right{display:flex;align-items:center;gap:8px;}
.ra-hdr-stat{display:flex;align-items:center;gap:5px;padding:4px 10px;border-radius:7px;background:rgba(16,185,129,0.07);border:1px solid rgba(16,185,129,0.1);font-size:11.5px;color:var(--muted);}
.ra-hdr-stat b{color:#10B981;font-weight:700;}
.ra-upgrade{display:inline-flex;align-items:center;gap:5px;padding:6px 14px;border-radius:8px;background:linear-gradient(135deg,#059669,#10B981);color:#fff;font-size:12px;font-weight:700;text-decoration:none;box-shadow:0 2px 10px rgba(16,185,129,0.2);transition:all 0.2s;}
.ra-upgrade:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(16,185,129,0.35);}
.ra-signout{font-size:12px;padding:6px 12px;background:transparent;border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;transition:all 0.15s;}
.ra-signout:hover{color:var(--text);border-color:var(--border-hover);}

/* BODY */
.ra-body{display:grid;grid-template-columns:240px 1fr;flex:1;max-width:1060px;width:100%;margin:0 auto;padding:0 24px;}

/* SIDEBAR */
.ra-side{padding:24px 20px 40px 0;border-right:1px solid rgba(16,185,129,0.06);}
.ra-side-label{font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--dim);margin-bottom:12px;}
.ra-side-field{margin-bottom:10px;}
.ra-side-field-lbl{font-size:11.5px;color:var(--muted);margin-bottom:5px;display:block;}
.ra-side-input{width:100%;padding:8px 11px;border-radius:8px;background:var(--elevated);border:1px solid var(--border);color:var(--text);font-size:13px;font-family:inherit;outline:none;transition:border-color 0.2s;box-sizing:border-box;}
.ra-side-input:focus{border-color:rgba(16,185,129,0.35);}
.ra-side-select{width:100%;padding:8px 11px;border-radius:8px;background:var(--elevated);border:1px solid var(--border);color:var(--text);font-size:13px;font-family:inherit;cursor:pointer;outline:none;box-sizing:border-box;}
.ra-saved{font-size:11px;color:#10B981;height:16px;margin-top:6px;opacity:0;transition:opacity 0.3s;}
.ra-saved.show{opacity:1;}
.ra-side-div{height:1px;background:rgba(16,185,129,0.06);margin:18px 0;}
.ra-tone-list{display:flex;flex-direction:column;gap:5px;}
.ra-tone-opt{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:9px;border:1px solid var(--border);background:transparent;color:var(--muted);cursor:pointer;font-family:inherit;text-align:left;transition:all 0.15s;width:100%;}
.ra-tone-opt:hover{background:var(--elevated);color:var(--text);}
.ra-tone-opt.active{background:rgba(16,185,129,0.08);border-color:rgba(16,185,129,0.28);color:#10B981;}
.ra-tone-icon{font-size:15px;flex-shrink:0;width:20px;}
.ra-tone-name{font-weight:600;font-size:12.5px;}
.ra-tone-desc{font-size:10.5px;opacity:0.6;margin-top:1px;}
.ra-stats-list{display:flex;flex-direction:column;gap:7px;}
.ra-stat-row{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--muted);}
.ra-stat-val{font-weight:700;color:#10B981;font-size:13px;}

/* MAIN */
.ra-main{padding:24px 0 80px 24px;}
.ra-workspace{background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden;margin-bottom:20px;}
.ra-ws-head{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:var(--elevated);border-bottom:1px solid var(--border);}
.ra-ws-title{font-size:13px;font-weight:700;display:flex;align-items:center;gap:7px;color:var(--text);}
.ra-ws-dot{width:5px;height:5px;border-radius:50%;background:#10B981;flex-shrink:0;}
.ra-add-btn{display:flex;align-items:center;gap:5px;padding:5px 12px;border-radius:7px;background:transparent;border:1px solid var(--border);color:var(--muted);font-size:12px;font-weight:600;cursor:pointer;transition:all 0.15s;}
.ra-add-btn:hover{color:var(--text);border-color:var(--border-hover);}
.ra-reviews-list{padding:14px 18px;display:flex;flex-direction:column;gap:10px;}
.ra-rev-row{display:grid;grid-template-columns:24px 1fr 24px;gap:8px;align-items:flex-start;padding-top:2px;}
.ra-rev-num{width:24px;height:24px;border-radius:7px;background:rgba(16,185,129,0.07);border:1px solid rgba(16,185,129,0.12);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:rgba(16,185,129,0.55);margin-top:10px;flex-shrink:0;}
.ra-rev-ta{width:100%;min-height:76px;resize:none;padding:10px 12px;border-radius:10px;background:var(--elevated);border:1px solid var(--border);color:var(--text);font-size:13px;font-family:inherit;line-height:1.6;outline:none;transition:border-color 0.2s, border-left-color 0.2s;box-sizing:border-box;}
.ra-rev-ta:focus{border-color:rgba(16,185,129,0.25);border-left-color:#10B981;}
.ra-rev-ta::placeholder{color:var(--dim);}
.ra-rev-rm{width:24px;height:24px;border-radius:6px;background:transparent;border:none;color:var(--dim);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;margin-top:10px;transition:all 0.15s;padding:0;line-height:1;}
.ra-rev-rm:hover{background:rgba(255,77,107,0.1);color:#FF4D6B;}
.ra-ws-foot{padding:14px 18px;border-top:1px solid var(--border);}
.ra-gen-btn{width:100%;height:50px;border-radius:10px;border:none;background:linear-gradient(135deg,#059669 0%,#10B981 50%,#34D399 100%);color:#fff;font-size:15px;font-weight:700;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 20px rgba(16,185,129,0.25);position:relative;overflow:hidden;}
.ra-gen-btn::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);animation:raShimmer 3s 0.5s ease-in-out infinite;}
@keyframes raShimmer{0%{left:-100%}50%,100%{left:150%}}
.ra-gen-btn:hover{transform:translateY(-1px);box-shadow:0 6px 28px rgba(16,185,129,0.38);}
.ra-gen-btn:active{transform:none;}
.ra-gen-btn:disabled{background:var(--elevated);color:var(--muted);cursor:default;transform:none;box-shadow:none;}
.ra-gen-btn:disabled::after{display:none;}
.ra-error{font-size:12px;color:var(--danger);margin-top:10px;display:flex;align-items:center;gap:5px;}

/* RESPONSES */
.ra-resp-head{font-size:10.5px;font-weight:700;color:var(--dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;display:flex;align-items:center;gap:10px;}
.ra-resp-head::after{content:'';flex:1;height:1px;background:var(--border);}
.ra-resp-cards{display:flex;flex-direction:column;gap:14px;}
.ra-resp-card{background:var(--surface);border:1px solid var(--border);border-left:3px solid #10B981;border-radius:14px;overflow:hidden;animation:raFadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both;}
@keyframes raFadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.ra-resp-src{padding:10px 16px;background:rgba(16,185,129,0.03);border-bottom:1px solid rgba(16,185,129,0.07);}
.ra-resp-src-lbl{font-size:9.5px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:rgba(16,185,129,0.45);margin-bottom:4px;}
.ra-resp-src-txt{font-size:12px;color:var(--muted);line-height:1.5;font-style:italic;}
.ra-resp-body{padding:16px;}
.ra-resp-txt{font-size:13.5px;color:var(--text);line-height:1.75;white-space:pre-wrap;margin-bottom:14px;}
.ra-resp-foot{display:flex;align-items:center;justify-content:space-between;}
.ra-copy-btn{display:flex;align-items:center;gap:6px;padding:7px 16px;border-radius:8px;font-size:12.5px;font-weight:700;cursor:pointer;transition:all 0.15s;border:1px solid var(--border);background:var(--elevated);color:var(--muted);}
.ra-copy-btn:hover{color:var(--text);border-color:var(--border-hover);}
.ra-copy-btn.done{background:rgba(16,185,129,0.1);border-color:rgba(16,185,129,0.25);color:#10B981;transform:scale(1.03);}
.ra-replied-btn{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--dim);background:none;border:none;padding:0;cursor:pointer;transition:color 0.15s;}
.ra-replied-btn:hover{color:var(--muted);}
.ra-replied-btn.done{color:#10B981;}
.ra-replied-box{width:16px;height:16px;border-radius:4px;border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:9px;transition:all 0.15s;flex-shrink:0;}
.ra-replied-btn.done .ra-replied-box{border-color:#10B981;background:rgba(16,185,129,0.15);color:#10B981;}

/* EMPTY */
.ra-empty{display:flex;flex-direction:column;align-items:center;padding:52px 24px;text-align:center;border:1px dashed var(--border);border-radius:14px;margin-top:4px;}
.ra-empty-icon{font-size:32px;margin-bottom:14px;opacity:0.4;}
.ra-empty-title{font-size:14px;font-weight:700;color:var(--text);margin-bottom:6px;}
.ra-empty-sub{font-size:13px;color:var(--muted);line-height:1.6;max-width:280px;}

/* RESPONSIVE */
@media(max-width:768px){
  .ra-body{grid-template-columns:1fr;padding:0 14px;}
  .ra-side{padding:16px 0;border-right:none;border-bottom:1px solid rgba(16,185,129,0.06);}
  .ra-main{padding:16px 0 60px;}
  .ra-hdr-stat{display:none;}
  .ra-tone-list{flex-direction:row;flex-wrap:wrap;}
  .ra-tone-opt{flex:1;min-width:0;}
  .ra-tone-desc{display:none;}
}
`

const GEN_STEPS = ['Reading your reviews…', 'Writing responses…', 'Almost done…']

// ── MAIN EXPORT ──────────────────────────────────────────
export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('Restaurant')
  const [tone, setTone] = useState<Tone>('professional')
  const [reviews, setReviews] = useState<string[]>([''])
  const [responses, setResponses] = useState<string[]>([])
  const [lastReviews, setLastReviews] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)
  const [genStep, setGenStep] = useState(GEN_STEPS[0])
  const [copied, setCopied] = useState<number | null>(null)
  const [replied, setReplied] = useState<Set<number>>(new Set())
  const [toast, setToast] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [totalResponses, setTotalResponses] = useState(0)
  const [savedFlash, setSavedFlash] = useState(false)

  const supabase = createClient()

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }, [])

  useEffect(() => {
    // Clean up Supabase error params from URL (e.g. otp_expired after clicking old link)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const hash = window.location.hash
      if (params.get('error') || hash.includes('error=')) {
        window.history.replaceState({}, '', '/')
      }
    }

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user)
        const saved = localStorage.getItem('ra_settings')
        if (saved) {
          const s = JSON.parse(saved)
          if (s.businessName) setBusinessName(s.businessName)
          if (s.businessType) setBusinessType(s.businessType)
          if (s.tone) setTone(s.tone)
        }
        const stats = JSON.parse(localStorage.getItem('ra_stats') || '{"total":0}')
        setTotalResponses(stats.total || 0)
      }
      setLoading(false)
    })
  }, [])

  function autoSave(name: string, type: string, t: Tone) {
    localStorage.setItem('ra_settings', JSON.stringify({ businessName: name, businessType: type, tone: t }))
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1400)
  }

  function addReview() { setReviews(prev => [...prev, '']); setResponses([]); setLastReviews([]) }
  function removeReview(i: number) { setReviews(prev => prev.filter((_, idx) => idx !== i)); setResponses([]); setLastReviews([]) }
  function updateReview(i: number, val: string) { setReviews(prev => prev.map((r, idx) => idx === i ? val : r)); setResponses([]); setLastReviews([]) }

  async function generate() {
    const filled = reviews.filter(r => r.trim())
    if (!businessName.trim()) { setError('Enter your business name first'); return }
    if (filled.length === 0) { setError('Paste at least one review'); return }
    setError(null); setGenerating(true); setResponses([]); setLastReviews([]); setReplied(new Set())

    let stepIdx = 0
    setGenStep(GEN_STEPS[0])
    const stepTimer = setInterval(() => {
      stepIdx = (stepIdx + 1) % GEN_STEPS.length
      setGenStep(GEN_STEPS[stepIdx])
    }, 2200)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_name: businessName, business_type: businessType, tone, reviews: filled }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResponses(data.responses)
      setLastReviews(filled)
      const stats = JSON.parse(localStorage.getItem('ra_stats') || '{"total":0}')
      const newTotal = (stats.total || 0) + data.responses.length
      localStorage.setItem('ra_stats', JSON.stringify({ total: newTotal }))
      setTotalResponses(newTotal)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      clearInterval(stepTimer)
      setGenerating(false)
    }
  }

  async function copyResponse(text: string, i: number) {
    await navigator.clipboard.writeText(text)
    setCopied(i); setTimeout(() => setCopied(null), 2000)
    showToast('✓ Copied to clipboard')
  }

  function toggleReplied(i: number) {
    setReplied(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  if (loading) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#050C08' }}>
        <div style={{ width:28, height:28, border:'2px solid rgba(16,185,129,0.15)', borderTopColor:'#10B981', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (!user) return <Landing />

  // ── APP ──────────────────────────────────────────────────
  const filledReviews = reviews.filter(r => r.trim())

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: APP_CSS }} />
      <div className="ra-app">

        {/* HEADER */}
        <header className="ra-hdr">
          <div className="ra-hdr-logo">
            <div className="ra-hdr-logo-icon">⭐</div>
            <span className="ra-hdr-logo-name">ReviewAgent</span>
          </div>
          <div className="ra-hdr-right">
            {totalResponses > 0 && (
              <div className="ra-hdr-stat"><b>{totalResponses}</b> responses generated</div>
            )}
            <a href="/upgrade" className="ra-upgrade">⚡ Upgrade</a>
            <button className="ra-signout" onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login' }}>
              Sign out
            </button>
          </div>
        </header>

        {/* BODY */}
        <div className="ra-body">

          {/* SIDEBAR */}
          <aside className="ra-side">
            <div style={{ marginBottom:24 }}>
              <div className="ra-side-label">Your Business</div>
              <div className="ra-side-field">
                <label className="ra-side-field-lbl">Business name</label>
                <input
                  className="ra-side-input"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  onBlur={e => autoSave(e.target.value, businessType, tone)}
                  placeholder="Mario's Pizza"
                />
              </div>
              <div className="ra-side-field">
                <label className="ra-side-field-lbl">Business type</label>
                <select
                  className="ra-side-select"
                  value={businessType}
                  onChange={e => { setBusinessType(e.target.value); autoSave(businessName, e.target.value, tone) }}
                >
                  {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className={`ra-saved ${savedFlash ? 'show' : ''}`}>✓ Saved</div>
            </div>

            <div className="ra-side-div" />

            <div style={{ marginBottom:24 }}>
              <div className="ra-side-label">Response Tone</div>
              <div className="ra-tone-list">
                {[
                  { key:'friendly',     icon:'😊', name:'Friendly',     desc:'Warm and personal' },
                  { key:'professional', icon:'💼', name:'Professional', desc:'Confident and clear' },
                  { key:'formal',       icon:'🎩', name:'Formal',       desc:'Reserved and polished' },
                ].map(({ key, icon, name, desc }) => (
                  <button
                    key={key}
                    className={`ra-tone-opt ${tone === key ? 'active' : ''}`}
                    onClick={() => { setTone(key as Tone); autoSave(businessName, businessType, key as Tone) }}
                  >
                    <span className="ra-tone-icon">{icon}</span>
                    <div style={{ flex:1 }}>
                      <div className="ra-tone-name">{name}</div>
                      <div className="ra-tone-desc">{desc}</div>
                    </div>
                    {tone === key && <span style={{ fontSize:10, color:'#10B981', flexShrink:0 }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {totalResponses > 0 && (
              <>
                <div className="ra-side-div" />
                <div>
                  <div className="ra-side-label">Stats</div>
                  <div className="ra-stats-list">
                    <div className="ra-stat-row">
                      <span>Total responses</span>
                      <span className="ra-stat-val">{totalResponses}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </aside>

          {/* MAIN */}
          <main className="ra-main">

            {/* WORKSPACE */}
            <div className="ra-workspace">
              <div className="ra-ws-head">
                <div className="ra-ws-title">
                  <div className="ra-ws-dot" />
                  Paste your reviews
                  <span style={{ fontWeight:400, color:'var(--muted)', fontSize:12 }}>({reviews.length})</span>
                </div>
                <button className="ra-add-btn" onClick={addReview} disabled={reviews.length >= 10}>
                  + Add review
                </button>
              </div>

              <div className="ra-reviews-list">
                {reviews.map((review, i) => (
                  <div key={i} className="ra-rev-row">
                    <div className="ra-rev-num">{i + 1}</div>
                    <textarea
                      className="ra-rev-ta"
                      value={review}
                      onChange={e => updateReview(i, e.target.value)}
                      placeholder={`Paste Google review #${i + 1} here…`}
                      rows={3}
                    />
                    {reviews.length > 1
                      ? <button className="ra-rev-rm" onClick={() => removeReview(i)}>×</button>
                      : <div />
                    }
                  </div>
                ))}
              </div>

              <div className="ra-ws-foot">
                {error && <div className="ra-error">⚠ {error}</div>}
                <button className="ra-gen-btn" onClick={generate} disabled={generating}>
                  {generating
                    ? genStep
                    : `✨ Generate ${filledReviews.length > 0 ? filledReviews.length : ''} response${filledReviews.length !== 1 ? 's' : ''}`
                  }
                </button>
              </div>
            </div>

            {/* RESPONSES */}
            {responses.length > 0 ? (
              <>
                <div className="ra-resp-head">AI Responses · Ready to post</div>
                <div className="ra-resp-cards">
                  {responses.map((response, i) => (
                    <div key={i} className="ra-resp-card" style={{ animationDelay:`${i * 0.09}s` }}>
                      {lastReviews[i] && (
                        <div className="ra-resp-src">
                          <div className="ra-resp-src-lbl">↩ Responding to</div>
                          <div className="ra-resp-src-txt">
                            {lastReviews[i].length > 110 ? lastReviews[i].slice(0, 110) + '…' : lastReviews[i]}
                          </div>
                        </div>
                      )}
                      <div className="ra-resp-body">
                        <div className="ra-resp-txt">{response}</div>
                        <div className="ra-resp-foot">
                          <button
                            className={`ra-copy-btn ${copied === i ? 'done' : ''}`}
                            onClick={() => copyResponse(response, i)}
                          >
                            {copied === i ? '✓ Copied!' : '⎘ Copy'}
                          </button>
                          <button
                            className={`ra-replied-btn ${replied.has(i) ? 'done' : ''}`}
                            onClick={() => toggleReplied(i)}
                          >
                            <div className="ra-replied-box">{replied.has(i) ? '✓' : ''}</div>
                            {replied.has(i) ? 'Replied in Google' : 'Mark as replied'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : !generating && (
              <div className="ra-empty">
                <div className="ra-empty-icon">⭐</div>
                <div className="ra-empty-title">Your AI responses appear here</div>
                <div className="ra-empty-sub">Paste your Google reviews above, then click Generate to get ready-to-post replies in seconds.</div>
              </div>
            )}

          </main>
        </div>

        {toast && (
          <div className="toast">
            <span style={{ color:'var(--success)', fontSize:15 }}>✓</span>
            <span>{toast.replace('✓ ', '')}</span>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </>
  )
}
