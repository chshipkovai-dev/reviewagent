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
            <a href="#how-it-works" className="ld-nav-link">How it works</a>
            <a href="#pricing" className="ld-nav-link">Pricing</a>
            <a href="/login" className="ld-nav-btn">Sign in</a>
          </div>
        </nav>

        {/* HERO */}
        <section className="ld-hero">
          <div className="ld-hero-left">
            <div className="ld-hero-badge">
              <div className="ld-live-dot" />
              AI-powered · Ready in seconds
            </div>
            <h1 className="ld-h1">
              Every review<br/>deserves a<br/><span>perfect reply.</span>
            </h1>
            <p className="ld-hero-sub">
              AI writes professional responses to your Google reviews in seconds.
              Stop losing customers to unanswered feedback.
            </p>
            <div className="ld-hero-cta">
              <a href="/login" className="ld-btn-primary">
                Start free 7-day trial →
              </a>
              <a href="#how-it-works" className="ld-btn-secondary">See how it works</a>
            </div>
            <div className="ld-trust">
              <div className="ld-trust-item">✓ No credit card</div>
              <div className="ld-trust-dot" />
              <div className="ld-trust-item">✓ Cancel anytime</div>
              <div className="ld-trust-dot" />
              <div className="ld-trust-item">✓ Works with Google Reviews</div>
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
              <a href="/login" className="ld-plan-cta">Start free 7-day trial →</a>
              <div className="ld-plan-guarantee">
                <span>🔒</span> 30-day money-back guarantee · Powered by Stripe
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <div className="ld-cta-banner">
          <h2 className="ld-cta-title">Stop leaving reviews<br/><span>unanswered.</span></h2>
          <p className="ld-cta-sub">Every unanswered review is a missed chance to win back a customer.</p>
          <div className="ld-cta-btns">
            <a href="/login" className="ld-btn-primary">Start free 7-day trial →</a>
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
          </div>
        </footer>

      </div>
    </>
  )
}

// ── MAIN EXPORT ──────────────────────────────────────────
export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('Restaurant')
  const [tone, setTone] = useState<Tone>('professional')
  const [reviews, setReviews] = useState<string[]>([''])
  const [responses, setResponses] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }, [])

  useEffect(() => {
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
      }
      setLoading(false)
    })
  }, [])

  function saveSettings() {
    localStorage.setItem('ra_settings', JSON.stringify({ businessName, businessType, tone }))
    showToast('✓ Settings saved')
  }

  function addReview() { setReviews(prev => [...prev, '']); setResponses([]) }
  function removeReview(i: number) { setReviews(prev => prev.filter((_, idx) => idx !== i)); setResponses([]) }
  function updateReview(i: number, val: string) { setReviews(prev => prev.map((r, idx) => idx === i ? val : r)); setResponses([]) }

  async function generate() {
    const filled = reviews.filter(r => r.trim())
    if (!businessName.trim()) { setError('Enter your business name first'); return }
    if (filled.length === 0) { setError('Paste at least one review'); return }
    setError(null); setGenerating(true); setResponses([])
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_name: businessName, business_type: businessType, tone, reviews: filled }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResponses(data.responses)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setGenerating(false)
    }
  }

  async function copyResponse(text: string, i: number) {
    await navigator.clipboard.writeText(text)
    setCopied(i); setTimeout(() => setCopied(null), 2000)
    showToast('✓ Copied to clipboard')
  }

  // Loading
  if (loading) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#050C08' }}>
        <div style={{ width:28, height:28, border:'2px solid rgba(16,185,129,0.15)', borderTopColor:'#10B981', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  // Landing (not logged in)
  if (!user) return <Landing />

  // ── APP (logged in) ──────────────────────────────────────
  const filledReviews = reviews.filter(r => r.trim())

  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'32px 20px 80px', background:'var(--bg)', minHeight:'100vh' }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#10B981,#059669)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>⭐</div>
          <div>
            <div style={{ fontWeight:700, fontSize:17, letterSpacing:'-0.3px' }}>ReviewAgent</div>
            <div style={{ fontSize:11, color:'var(--muted)' }}>AI replies to your Google reviews</div>
          </div>
        </div>
        <button
          onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login' }}
          style={{ fontSize:13, padding:'7px 14px', background:'transparent', border:'1px solid var(--border)', borderRadius:8, color:'var(--muted)', cursor:'pointer' }}
        >
          Sign out
        </button>
      </div>

      {/* Business Settings */}
      <div className="card" style={{ marginBottom:20 }}>
        <div style={{ fontSize:13, fontWeight:600, marginBottom:16 }}>Your Business</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
          <div>
            <label style={{ fontSize:12, color:'var(--muted)', display:'block', marginBottom:6 }}>Business name</label>
            <input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Mario's Pizza" style={{ width:'100%', boxSizing:'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize:12, color:'var(--muted)', display:'block', marginBottom:6 }}>Business type</label>
            <select value={businessType} onChange={e => setBusinessType(e.target.value)}
              style={{ width:'100%', padding:'9px 12px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, fontSize:13, color:'var(--text)', cursor:'pointer', boxSizing:'border-box' }}>
              {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:12, color:'var(--muted)', display:'block', marginBottom:8 }}>Response tone</label>
          <div style={{ display:'flex', gap:8 }}>
            {(Object.keys(TONE_LABELS) as Tone[]).map(t => (
              <button key={t} onClick={() => setTone(t)} style={{
                padding:'7px 14px', borderRadius:8, fontSize:13, cursor:'pointer',
                border: tone===t ? '1px solid #10B981' : '1px solid var(--border)',
                background: tone===t ? 'rgba(16,185,129,0.1)' : 'transparent',
                color: tone===t ? '#10B981' : 'var(--muted)',
                fontWeight: tone===t ? 600 : 400,
              }}>{TONE_LABELS[t]}</button>
            ))}
          </div>
        </div>
        <button onClick={saveSettings}
          style={{ fontSize:12, padding:'7px 16px', background:'transparent', border:'1px solid var(--border)', borderRadius:8, color:'var(--muted)', cursor:'pointer' }}>
          Save settings
        </button>
      </div>

      {/* Reviews Input */}
      <div className="card" style={{ marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div style={{ fontSize:13, fontWeight:600 }}>Paste your reviews ({reviews.length})</div>
          <button onClick={addReview}
            style={{ fontSize:12, padding:'6px 12px', background:'transparent', border:'1px solid var(--border)', borderRadius:7, color:'var(--muted)', cursor:'pointer' }}>
            + Add review
          </button>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {reviews.map((review, i) => (
            <div key={i} style={{ position:'relative' }}>
              <textarea value={review} onChange={e => updateReview(i, e.target.value)}
                placeholder={`Paste review #${i + 1} here...`} rows={3}
                style={{ width:'100%', boxSizing:'border-box', resize:'vertical', padding:'10px 36px 10px 12px', fontSize:13, lineHeight:1.6, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, color:'var(--text)', fontFamily:'inherit' }} />
              {reviews.length > 1 && (
                <button onClick={() => removeReview(i)}
                  style={{ position:'absolute', top:8, right:8, width:22, height:22, background:'transparent', border:'none', color:'var(--muted)', cursor:'pointer', fontSize:16, lineHeight:1, borderRadius:4 }}>×</button>
              )}
            </div>
          ))}
        </div>
        {error && <div style={{ color:'var(--danger)', fontSize:12, marginTop:10 }}>⚠ {error}</div>}
        <button onClick={generate} disabled={generating} style={{
          marginTop:16, width:'100%', padding:'13px',
          background: generating ? 'var(--elevated)' : 'linear-gradient(135deg,#059669,#10B981)',
          color: generating ? 'var(--muted)' : '#fff',
          border:'none', borderRadius:10, fontSize:14, fontWeight:600,
          cursor: generating ? 'default' : 'pointer', transition:'all 0.2s',
          boxShadow: generating ? 'none' : '0 4px 16px rgba(16,185,129,0.25)',
        }}>
          {generating ? '✍️ Writing responses...' : `✨ Generate ${filledReviews.length > 0 ? filledReviews.length : ''} response${filledReviews.length !== 1 ? 's' : ''}`}
        </button>
      </div>

      {/* Responses */}
      {responses.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {responses.map((response, i) => (
            <div key={i} className="card" style={{ borderLeft:'3px solid #10B981' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <span style={{ fontSize:12, fontWeight:600, color:'#10B981' }}>Response to review #{i + 1}</span>
                <button onClick={() => copyResponse(response, i)} style={{
                  fontSize:12, padding:'5px 12px',
                  background: copied===i ? 'rgba(16,185,129,0.1)' : 'var(--elevated)',
                  border: `1px solid ${copied===i ? '#10B981' : 'var(--border)'}`,
                  color: copied===i ? '#10B981' : 'var(--muted)',
                  borderRadius:6, cursor:'pointer', fontWeight: copied===i ? 600 : 400,
                }}>{copied===i ? '✓ Copied' : 'Copy'}</button>
              </div>
              <div style={{ fontSize:13, color:'var(--muted)', lineHeight:1.7, whiteSpace:'pre-wrap' }}>{response}</div>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div className="toast">
          <span style={{ color:'var(--success)', fontSize:15 }}>✓</span>
          <span>{toast.replace('✓ ', '')}</span>
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
