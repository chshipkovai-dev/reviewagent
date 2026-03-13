'use client'

import { useState, useEffect } from 'react'
import { ThemeToggle } from '@/components/theme-provider'

type Lang = 'en' | 'ru' | 'cs'

const translations = {
  en: {
    badge: 'Free limit reached',
    title: 'Unlock unlimited\ninvoice follow-ups.',
    sub: 'You\'ve used your 2 free invoices. Upgrade to keep chasing payments — automatically.',
    planName: 'InvoicePilot Pro',
    planSub: 'Everything you need',
    price: '$39',
    per: '/month',
    features: [
      'Unlimited invoices',
      '3 AI email versions per invoice',
      'Tone adapts to days overdue',
      'Instant copy — send in 10 seconds',
      'Cancel anytime, no questions asked',
    ],
    cta: 'Upgrade now — $39/month',
    upgrading: 'Redirecting to payment...',
    stripe: 'Secure payment via Stripe.',
    back: '← Back to invoices',
  },
  ru: {
    badge: 'Бесплатный лимит исчерпан',
    title: 'Снимите лимит\nна follow-up письма.',
    sub: 'Вы использовали 2 бесплатных инвойса. Перейдите на Pro — продолжайте автоматически.',
    planName: 'InvoicePilot Pro',
    planSub: 'Всё что нужно',
    price: '$39',
    per: '/мес',
    features: [
      'Безлимитные инвойсы',
      '3 варианта AI письма на инвойс',
      'Тон адаптируется к просрочке',
      'Копирование одним кликом — 10 секунд',
      'Отмена в любой момент',
    ],
    cta: 'Перейти на Pro — $39/мес',
    upgrading: 'Переходим к оплате...',
    stripe: 'Безопасная оплата через Stripe.',
    back: '← Назад к инвойсам',
  },
  cs: {
    badge: 'Dosažen bezplatný limit',
    title: 'Odemkněte neomezené\nupomínkové e-maily.',
    sub: 'Použili jste 2 bezplatné faktury. Upgradujte a pokračujte automaticky.',
    planName: 'InvoicePilot Pro',
    planSub: 'Vše co potřebujete',
    price: '$39',
    per: '/měsíc',
    features: [
      'Neomezené faktury',
      '3 verze AI e-mailu na fakturu',
      'Tón se přizpůsobuje době po splatnosti',
      'Kopírování jedním klikem — 10 sekund',
      'Zrušení kdykoli bez otázek',
    ],
    cta: 'Upgradovat nyní — $39/měsíc',
    upgrading: 'Přesměrování na platbu...',
    stripe: 'Bezpečná platba přes Stripe.',
    back: '← Zpět na faktury',
  },
}

export default function UpgradePage() {
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('ip_lang') as Lang | null
    if (saved && saved in translations) setLang(saved)
  }, [])

  const tr = translations[lang]

  async function handleUpgrade() {
    setLoading(true)
    const res = await fetch('/api/stripe', { method: 'POST' })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 28px 0' }}>
        <ThemeToggle />
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="animate-fade-up" style={{ maxWidth: 420, width: '100%' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #6366F1, #818CF8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>✈</div>
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.3px' }}>InvoicePilot</span>
          </div>

          {/* Badge */}
          <div style={{ marginBottom: 14 }}>
            <span style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              color: 'var(--danger)', fontSize: 12, fontWeight: 600,
              padding: '4px 12px', borderRadius: 999,
            }}>
              {tr.badge}
            </span>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.6px', lineHeight: 1.2, marginBottom: 12, whiteSpace: 'pre-line' }}>
            {tr.title}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>{tr.sub}</p>
        </div>

        {/* Plan card */}
        <div className="card animate-fade-up delay-1" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17 }}>{tr.planName}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>{tr.planSub}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1 }}>{tr.price}</div>
              <div style={{ color: 'var(--dim)', fontSize: 12, marginTop: 2 }}>{tr.per}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tr.features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                  background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: 'var(--success)',
                }}>✓</div>
                <span style={{ fontSize: 14, color: 'var(--muted)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          className="btn-primary animate-fade-up delay-2"
          onClick={handleUpgrade}
          disabled={loading}
          style={{ width: '100%', padding: '14px', fontSize: 15 }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
              {tr.upgrading}
            </span>
          ) : tr.cta}
        </button>

        <p className="animate-fade-up delay-3" style={{ color: 'var(--dim)', fontSize: 12, textAlign: 'center', marginTop: 12 }}>
          {tr.stripe}
        </p>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <a href="/" style={{ color: 'var(--muted)', fontSize: 13, textDecoration: 'none' }}>
            {tr.back}
          </a>
        </div>
      </div>
      </div>
    </div>
  )
}
