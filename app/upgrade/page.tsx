'use client'

import { useState, useEffect } from 'react'

type Lang = 'en' | 'ru' | 'cs'

const T = {
  en: {
    badge: 'FREE LIMIT REACHED',
    title: 'Unlock unlimited\nfollow-ups.',
    sub: 'You\'ve used your 2 free invoices. Upgrade to Pro and keep getting paid — automatically.',
    planName: 'InvoicePilot Pro',
    planSub: 'Everything you need to get paid',
    price: '$39',
    per: '/month',
    features: [
      { icon: '∞', text: 'Unlimited invoices' },
      { icon: '✦', text: '3 AI email tones per invoice' },
      { icon: '⚡', text: 'Tone adapts to days overdue' },
      { icon: '⏱', text: 'Copy & send in 10 seconds' },
      { icon: '✕', text: 'Cancel anytime, no questions' },
    ],
    cta: 'Upgrade to Pro — $39/month',
    upgrading: 'Redirecting to Stripe...',
    stripe: 'Secure payment via Stripe · Cancel anytime',
    back: '← Back to invoices',
    guarantee: '30-day money-back guarantee',
  },
  ru: {
    badge: 'ЛИМИТ ИСЧЕРПАН',
    title: 'Снимите лимит\nна follow-up.',
    sub: 'Вы использовали 2 бесплатных инвойса. Перейдите на Pro и продолжайте автоматически.',
    planName: 'InvoicePilot Pro',
    planSub: 'Всё что нужно для получения денег',
    price: '$39',
    per: '/мес',
    features: [
      { icon: '∞', text: 'Безлимитные инвойсы' },
      { icon: '✦', text: '3 варианта AI письма на инвойс' },
      { icon: '⚡', text: 'Тон адаптируется к просрочке' },
      { icon: '⏱', text: 'Копирование за 10 секунд' },
      { icon: '✕', text: 'Отмена в любой момент' },
    ],
    cta: 'Перейти на Pro — $39/мес',
    upgrading: 'Переходим к оплате...',
    stripe: 'Безопасная оплата через Stripe · Отмена в любой момент',
    back: '← Назад к инвойсам',
    guarantee: 'Возврат в течение 30 дней',
  },
  cs: {
    badge: 'DOSAŽEN BEZPLATNÝ LIMIT',
    title: 'Odemkněte neomezené\nupomínky.',
    sub: 'Použili jste 2 bezplatné faktury. Upgradujte na Pro a pokračujte automaticky.',
    planName: 'InvoicePilot Pro',
    planSub: 'Vše co potřebujete pro získání plateb',
    price: '$39',
    per: '/měsíc',
    features: [
      { icon: '∞', text: 'Neomezené faktury' },
      { icon: '✦', text: '3 verze AI e-mailu na fakturu' },
      { icon: '⚡', text: 'Tón se přizpůsobuje urgenci' },
      { icon: '⏱', text: 'Kopírování za 10 sekund' },
      { icon: '✕', text: 'Zrušení kdykoli bez otázek' },
    ],
    cta: 'Upgradovat na Pro — $39/měsíc',
    upgrading: 'Přesměrování na Stripe...',
    stripe: 'Bezpečná platba přes Stripe · Zrušení kdykoli',
    back: '← Zpět na faktury',
    guarantee: '30denní záruka vrácení peněz',
  },
}

const CSS = `
.up-root {
  min-height: 100vh; background: #080503;
  display: flex; align-items: center; justify-content: center;
  padding: 60px 20px 80px; position: relative; overflow: hidden;
}
.up-dots {
  position: fixed; inset: 0; pointer-events: none;
  background-image: radial-gradient(circle, rgba(245,158,11,0.1) 1px, transparent 1px);
  background-size: 32px 32px;
}
.up-glow {
  position: fixed; top: -200px; left: 50%; transform: translateX(-50%);
  width: 800px; height: 600px; border-radius: 50%;
  background: radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 60%);
  filter: blur(70px); pointer-events: none;
}
.up-glow2 {
  position: fixed; bottom: -150px; right: -100px;
  width: 500px; height: 500px; border-radius: 50%;
  background: radial-gradient(ellipse, rgba(180,83,9,0.06) 0%, transparent 65%);
  filter: blur(80px); pointer-events: none;
}

.up-inner {
  position: relative; z-index: 1;
  width: 100%; max-width: 460px;
}

/* Logo */
.up-logo {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  margin-bottom: 36px;
  animation: upIn 0.4s ease both;
}
.up-logo-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: linear-gradient(135deg, #D97706, #F59E0B);
  display: flex; align-items: center; justify-content: center; font-size: 18px;
  box-shadow: 0 4px 16px rgba(245,158,11,0.35);
}

/* Badge */
.up-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(255,77,107,0.08); border: 1px solid rgba(255,77,107,0.2);
  border-radius: 999px; padding: 5px 14px;
  font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
  color: #FF4D6B; margin-bottom: 18px;
  animation: upIn 0.4s 0.04s ease both;
}
.up-badge-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #FF4D6B;
  box-shadow: 0 0 8px rgba(255,77,107,0.8);
  animation: upPulse 2s ease-in-out infinite;
}

/* Title */
.up-title {
  font-size: clamp(30px, 4vw, 40px); font-weight: 900;
  letter-spacing: -1.2px; line-height: 1.1; text-align: center;
  white-space: pre-line; margin-bottom: 14px;
  background: linear-gradient(150deg, #FBBF24 0%, #F59E0B 40%, #D97706 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: upIn 0.4s 0.08s ease both;
}

.up-sub {
  font-size: 14px; color: rgba(255,255,255,0.38); line-height: 1.65;
  text-align: center; max-width: 360px; margin: 0 auto 32px;
  animation: upIn 0.4s 0.12s ease both;
}

/* Pricing ring card */
.up-ring-wrap { position: relative; margin-bottom: 16px; animation: upIn 0.4s 0.16s ease both; }
.up-ring {
  position: absolute; inset: -2px; border-radius: 22px;
  background: conic-gradient(from 0deg, rgba(245,158,11,0), rgba(245,158,11,0.35) 25%, rgba(245,158,11,0) 50%, rgba(245,158,11,0.2) 75%, rgba(245,158,11,0));
  animation: upRingSpin 6s linear infinite; filter: blur(3px);
}
.up-ring-inner { position: absolute; inset: 1px; border-radius: 21px; background: #080503; }

.up-card {
  position: relative; z-index: 1;
  background: rgba(20, 13, 4, 0.94);
  border: 1px solid rgba(245,158,11,0.15);
  border-radius: 20px; padding: 28px 28px 24px;
  backdrop-filter: blur(40px);
  box-shadow: 0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(245,158,11,0.1);
}
.up-card::before {
  content: ''; position: absolute; top: 0; left: 25%; right: 25%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent);
}

/* Plan header */
.up-plan-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding-bottom: 20px; margin-bottom: 20px;
  border-bottom: 1px solid rgba(245,158,11,0.1);
}
.up-plan-name { font-size: 16px; font-weight: 700; color: #F5F0E8; margin-bottom: 3px; }
.up-plan-sub { font-size: 12px; color: rgba(255,255,255,0.35); }
.up-price-wrap { text-align: right; }
.up-price {
  font-size: 36px; font-weight: 900; letter-spacing: -1px; line-height: 1;
  background: linear-gradient(135deg, #FBBF24, #F59E0B);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.up-per { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 3px; }

/* Features */
.up-features { display: flex; flex-direction: column; gap: 12px; }
.up-feature { display: flex; align-items: center; gap: 12px; }
.up-feature-icon {
  width: 24px; height: 24px; border-radius: 7px; flex-shrink: 0;
  background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.18);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: #F59E0B;
}
.up-feature-text { font-size: 14px; color: rgba(255,255,255,0.65); }

/* CTA Button */
.up-btn {
  width: 100%; padding: 16px; border: none; border-radius: 14px;
  font-size: 16px; font-weight: 700; cursor: pointer;
  color: #1A0D00; letter-spacing: -0.3px;
  background: linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FDE68A 100%);
  background-size: 200% 100%;
  box-shadow: 0 4px 24px rgba(245,158,11,0.35), 0 0 0 1px rgba(245,158,11,0.2);
  transition: all 0.25s; position: relative; overflow: hidden;
  animation: upIn 0.4s 0.22s ease both;
  margin-bottom: 12px;
}
.up-btn::after {
  content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
  animation: upShimmer 2.5s 1s ease-in-out infinite;
}
.up-btn:hover { background-position: 100% 0; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(245,158,11,0.45); }
.up-btn:active { transform: translateY(0); }
.up-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* Guarantee */
.up-guarantee {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  font-size: 12px; color: rgba(255,255,255,0.3);
  animation: upIn 0.4s 0.26s ease both;
  margin-bottom: 20px;
}

/* Back link */
.up-back {
  display: block; text-align: center; font-size: 13px;
  color: rgba(255,255,255,0.25); text-decoration: none;
  transition: color 0.2s;
  animation: upIn 0.4s 0.3s ease both;
}
.up-back:hover { color: rgba(255,255,255,0.5); }

/* Lang */
.up-lang {
  position: fixed; top: 20px; right: 20px; z-index: 20;
  display: flex; gap: 2px; padding: 3px;
  background: rgba(10,7,3,0.85); backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.07); border-radius: 10px;
}
.up-lang-btn {
  padding: 5px 11px; border-radius: 7px; font-size: 11px; font-weight: 600;
  background: transparent; color: rgba(255,255,255,0.3); border: none;
  cursor: pointer; transition: all 0.15s; font-family: inherit;
}
.up-lang-btn.on { background: rgba(245,158,11,0.15); color: #F59E0B; }

@keyframes upIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes upRingSpin { to { transform: rotate(360deg); } }
@keyframes upShimmer { 0% { left: -100%; } 50%, 100% { left: 150%; } }
@keyframes upPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes spin { to { transform: rotate(360deg); } }
`

export default function UpgradePage() {
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('ip_lang') as Lang | null
    if (saved && saved in T) setLang(saved)
  }, [])

  const tr = T[lang]

  async function handleUpgrade() {
    setLoading(true)
    const res = await fetch('/api/stripe', { method: 'POST' })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="up-lang">
        {(['en', 'ru', 'cs'] as Lang[]).map(l => (
          <button key={l} className={`up-lang-btn${lang === l ? ' on' : ''}`}
            onClick={() => { setLang(l); localStorage.setItem('ip_lang', l) }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="up-root">
        <div className="up-dots" />
        <div className="up-glow" />
        <div className="up-glow2" />

        <div className="up-inner">
          {/* Logo */}
          <div className="up-logo">
            <div className="up-logo-icon">✈</div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#F5F0E8', letterSpacing: '-0.3px' }}>InvoicePilot</span>
          </div>

          {/* Badge */}
          <div style={{ textAlign: 'center' }}>
            <div className="up-badge">
              <div className="up-badge-dot" />
              {tr.badge}
            </div>
          </div>

          {/* Title */}
          <h1 className="up-title">{tr.title}</h1>
          <p className="up-sub">{tr.sub}</p>

          {/* Plan card with spinning ring */}
          <div className="up-ring-wrap">
            <div className="up-ring" />
            <div className="up-ring-inner" />
            <div className="up-card">
              <div className="up-plan-header">
                <div>
                  <div className="up-plan-name">{tr.planName}</div>
                  <div className="up-plan-sub">{tr.planSub}</div>
                </div>
                <div className="up-price-wrap">
                  <div className="up-price">{tr.price}</div>
                  <div className="up-per">{tr.per}</div>
                </div>
              </div>

              <div className="up-features">
                {tr.features.map((f, i) => (
                  <div key={i} className="up-feature">
                    <div className="up-feature-icon">{f.icon}</div>
                    <div className="up-feature-text">{f.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <button className="up-btn" onClick={handleUpgrade} disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={{ width: 16, height: 16, border: '2px solid rgba(26,13,0,0.3)', borderTopColor: '#1A0D00', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                {tr.upgrading}
              </span>
            ) : tr.cta}
          </button>

          {/* Guarantee */}
          <div className="up-guarantee">
            <span>🛡</span>
            <span>{tr.guarantee}</span>
            <span style={{ margin: '0 6px', opacity: 0.3 }}>·</span>
            <span>{tr.stripe.split('·')[1]?.trim()}</span>
          </div>

          <a href="/" className="up-back">{tr.back}</a>
        </div>
      </div>
    </>
  )
}
