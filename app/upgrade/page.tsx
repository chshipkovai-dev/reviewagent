'use client'

import { useState } from 'react'

const features = [
  { icon: '∞', label: 'Unlimited AI-generated replies' },
  { icon: '⭐', label: '3 response tones — friendly, professional, formal' },
  { icon: '⚡', label: 'Up to 10 reviews processed at once' },
  { icon: '📋', label: 'One-click copy to clipboard' },
  { icon: '🔒', label: 'Your brand voice, every time' },
  { icon: '✕',  label: 'Cancel anytime, no questions asked' },
]

const testimonials = [
  { name: 'Maria S.',  role: 'Restaurant owner',   text: 'I went from 0% reply rate to 100% in one week. A customer literally left a 5-star review saying we care about feedback.' },
  { name: 'James K.',  role: 'Salon owner',         text: 'Used to spend 30 min a week on replies. Now it\'s 2 minutes. The responses sound exactly like me — just better.' },
  { name: 'Linda P.',  role: 'Fitness studio owner', text: 'One new member said she chose us because we always reply to reviews. That\'s one client = $600/year.' },
]

export default function UpgradePage() {
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    setLoading(true)
    const res = await fetch('/api/stripe', { method: 'POST' })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .up-wrap {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 48px 20px 80px;
          background: var(--bg);
        }
        .up-logo {
          display: inline-flex;
          width: 52px; height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, #059669, #10B981);
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 12px;
          box-shadow: 0 4px 20px rgba(16,185,129,0.3);
        }
        .up-eyebrow {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #10B981;
          margin-bottom: 10px;
        }
        .up-headline {
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -0.6px;
          text-align: center;
          color: var(--text);
          margin-bottom: 8px;
          max-width: 480px;
        }
        .up-sub {
          font-size: 15px;
          color: var(--muted);
          text-align: center;
          margin-bottom: 40px;
          max-width: 380px;
          line-height: 1.55;
        }
        .up-card {
          width: 100%;
          max-width: 440px;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: 18px;
          overflow: hidden;
          margin-bottom: 16px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.25);
        }
        .up-card-header {
          padding: 24px 28px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          background: linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(5,150,105,0.03) 100%);
        }
        .up-plan-name {
          font-weight: 800;
          font-size: 17px;
          color: var(--text);
        }
        .up-plan-desc {
          font-size: 12px;
          color: var(--muted);
          margin-top: 3px;
        }
        .up-price {
          text-align: right;
        }
        .up-price-num {
          font-size: 38px;
          font-weight: 900;
          letter-spacing: -1.5px;
          color: #10B981;
          line-height: 1;
        }
        .up-price-per {
          font-size: 12px;
          color: var(--muted);
          margin-top: 2px;
        }
        .up-trial-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(16,185,129,0.12);
          border: 1px solid rgba(16,185,129,0.25);
          color: #10B981;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 4px 10px;
          border-radius: 999px;
          margin-top: 6px;
        }
        .up-features {
          padding: 22px 28px;
          display: flex;
          flex-direction: column;
          gap: 13px;
        }
        .up-feature {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .up-feature-icon {
          width: 28px; height: 28px;
          border-radius: 8px;
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          flex-shrink: 0;
          color: #10B981;
        }
        .up-feature-label {
          font-size: 13.5px;
          color: var(--muted);
          line-height: 1.3;
        }
        .up-cta-btn {
          width: 100%;
          padding: 15px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%);
          color: #fff;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          letter-spacing: -0.2px;
          box-shadow: 0 4px 24px rgba(16,185,129,0.38);
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .up-cta-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          animation: upShimmer 2.8s ease-in-out infinite;
        }
        @keyframes upShimmer {
          0%   { left: -100%; }
          50%, 100% { left: 150%; }
        }
        .up-cta-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(16,185,129,0.5); }
        .up-cta-btn:active { transform: none; }
        .up-cta-btn:disabled { opacity: 0.55; cursor: default; transform: none; box-shadow: none; }
        .up-note {
          font-size: 12px;
          color: var(--muted);
          text-align: center;
          margin-top: 10px;
        }
        .up-trust {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 14px;
          flex-wrap: wrap;
        }
        .up-trust-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          color: var(--dim);
        }
        .up-divider {
          width: 100%;
          max-width: 440px;
          height: 1px;
          background: var(--border);
          margin: 36px 0 32px;
        }
        .up-testimonials-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 16px;
          text-align: center;
        }
        .up-testimonials {
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .up-testi-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 18px 20px;
        }
        .up-testi-text {
          font-size: 13.5px;
          color: var(--muted);
          line-height: 1.55;
          margin-bottom: 12px;
        }
        .up-testi-author {
          display: flex;
          align-items: center;
          gap: 9px;
        }
        .up-testi-avatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #059669, #10B981);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }
        .up-testi-name {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--text);
        }
        .up-testi-role {
          font-size: 11.5px;
          color: var(--dim);
        }
        .up-back {
          margin-top: 32px;
          font-size: 13px;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .up-back:hover { color: var(--text); }
      `}} />

      <div className="up-wrap">
        {/* Logo */}
        <div className="up-logo">⭐</div>

        <div className="up-eyebrow">ReviewAgent Pro</div>

        <h1 className="up-headline">
          Respond to every review.<br />Keep every customer.
        </h1>

        <p className="up-sub">
          AI replies to your Google reviews in seconds.<br />
          No more unanswered feedback, no more lost trust.
        </p>

        {/* Plan card */}
        <div className="up-card">
          <div className="up-card-header">
            <div>
              <div className="up-plan-name">Pro Plan</div>
              <div className="up-plan-desc">Everything you need to stay on top</div>
              <div className="up-trial-badge">✦ 7-day free trial</div>
            </div>
            <div className="up-price">
              <div className="up-price-num">$49</div>
              <div className="up-price-per">/month</div>
            </div>
          </div>

          <div className="up-features">
            {features.map(({ icon, label }) => (
              <div className="up-feature" key={label}>
                <div className="up-feature-icon">{icon}</div>
                <div className="up-feature-label">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ width: '100%', maxWidth: 440 }}>
          <button
            className="up-cta-btn"
            onClick={handleUpgrade}
            disabled={loading}
          >
            {loading ? 'Redirecting to Stripe…' : 'Start free 7-day trial'}
          </button>

          <p className="up-note">Then $49/month. Cancel anytime before the trial ends.</p>

          <div className="up-trust">
            <span className="up-trust-item">🛡 No charge for 7 days</span>
            <span className="up-trust-item">🔒 Secure payment via Stripe</span>
            <span className="up-trust-item">✕ Cancel anytime</span>
          </div>
        </div>

        <div className="up-divider" />

        {/* Social proof */}
        <div className="up-testimonials-title">What owners say</div>

        <div className="up-testimonials">
          {testimonials.map(({ name, role, text }) => (
            <div className="up-testi-card" key={name}>
              <p className="up-testi-text">"{text}"</p>
              <div className="up-testi-author">
                <div className="up-testi-avatar">{name[0]}</div>
                <div>
                  <div className="up-testi-name">{name}</div>
                  <div className="up-testi-role">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <a href="/" className="up-back">← Back to app</a>
      </div>
    </>
  )
}
