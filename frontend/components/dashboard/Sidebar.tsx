'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Home, Archive, Settings, LogOut } from 'lucide-react'
import { clsx } from 'clsx'
import { getWeekLabel } from '@/lib/weekLabel'
import { supabase } from '@/lib/supabase'
import styles from './sidebar.module.css'

const LEAVE_START = process.env.NEXT_PUBLIC_LEAVE_START_DATE || '2026-03-01'
const TOTAL_WEEKS = 12

function getWeekProgress() {
  const start = new Date(LEAVE_START)
  const now = new Date()
  const elapsed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7))
  const current = Math.min(Math.max(elapsed + 1, 1), TOTAL_WEEKS)
  const pct = Math.round((current / TOTAL_WEEKS) * 100)
  return { current, pct }
}

const navItems = [
  { href: '/', label: 'This Week', icon: Home },
  { href: '/archive', label: 'Archive', icon: Archive },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const { current, pct } = getWeekProgress()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    if (profileOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [profileOpen])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (mobile) {
    return (
      <div className="flex items-center justify-around gap-1 px-1 py-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={clsx(
                'flex min-h-[48px] min-w-[78px] flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-[11px] font-medium transition',
                active
                  ? 'bg-gold/10 text-gold'
                  : 'text-textmuted hover:bg-white/5 hover:text-textprimary'
              )}
            >
              <Icon size={17} aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full px-4 py-6">
      {/* Wordmark */}
      <div className="mb-3">
        <h1 className="font-display text-lg font-bold text-gold">Connection OS</h1>
      </div>

      {/* Profile avatar + dropdown */}
      <div ref={profileRef} className="relative mb-6">
        <button
          type="button"
          aria-label="Profile menu"
          aria-expanded={profileOpen ? 'true' : 'false'}
          aria-haspopup="true"
          onClick={() => setProfileOpen(v => !v)}
          className="flex items-center gap-2 px-1 py-1.5 rounded-lg hover:bg-white/5 transition w-full text-left"
        >
          <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <span className="text-[10px] font-bold text-gold">JP</span>
          </div>
          <span className="text-xs text-textmuted font-medium truncate">Joanna Patterson</span>
          <span className="ml-auto text-[9px] text-textmuted flex-shrink-0" aria-hidden="true">{profileOpen ? '▲' : '▼'}</span>
        </button>

        {profileOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-navy border border-border rounded-xl shadow-xl z-50 overflow-hidden">
            <Link
              href="/settings"
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-textmuted hover:text-textprimary hover:bg-white/5 transition"
            >
              <Settings size={13} aria-hidden="true" />
              Settings
            </Link>
            <div className="border-t border-border" role="separator" />
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-xs text-textmuted hover:text-red-400 hover:bg-red-500/5 transition"
            >
              <LogOut size={13} aria-hidden="true" />
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1" aria-label="Main navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition',
                active
                  ? 'text-gold border-l-[3px] border-gold bg-gold/5 pl-[9px]'
                  : 'text-textmuted hover:text-textprimary hover:bg-white/5'
              )}
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Progress + greeting */}
      <div className="mt-auto pt-6 border-t border-border">
        {(() => {
          const { monthWeek, monthName, overallWeek } = getWeekLabel(current)
          return (
            <>
              <p className="text-[11px] text-textmuted mb-0.5">Hey Joanna, It&apos;s:</p>
              <span className="relative group/week inline-flex items-center cursor-default mb-3">
                <span className="text-xs text-textprimary font-mono font-semibold">
                  Week {monthWeek} · {monthName}
                </span>
                <span className="absolute bottom-full left-0 mb-1.5 px-2 py-1 bg-navy border border-border rounded-md text-xs font-mono text-textmuted whitespace-nowrap opacity-0 group-hover/week:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                  Week {overallWeek} of 12
                </span>
              </span>
            </>
          )
        })()}
        <div className={styles.progressTrack}>
          <div className={clsx(styles.progressFill, styles[`w${pct}` as keyof typeof styles])} />
        </div>
      </div>
    </div>
  )
}
