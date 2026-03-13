'use client'

import { useEffect, useState } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem('ip_theme') || 'dark'
    document.documentElement.setAttribute('data-theme', saved)
  }, [])
  return <>{children}</>
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('ip_theme') as 'dark' | 'light' | null
    setTheme(saved || 'dark')
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('ip_theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  return (
    <button className="theme-toggle" onClick={toggle} title="Toggle theme">
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}

export function BackgroundOrbs() {
  return (
    <div className="bg-scene" aria-hidden>
      <div className="bg-grid" />
      <div className="bg-glow" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
    </div>
  )
}
