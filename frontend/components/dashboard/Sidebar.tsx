'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Archive, Settings } from 'lucide-react'
import { clsx } from 'clsx'
import { getWeekLabel } from '@/lib/weekLabel'
import styles from './sidebar.module.css'

const LEAVE_START = process.env.NEXT_PUBLIC_LEAVE_START_DATE || '2025-03-01'
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
  const { current, pct } = getWeekProgress()

  if (mobile) {
    return (
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex flex-col items-center gap-1 px-3 py-1 text-xs transition',
                active ? 'text-gold' : 'text-textmuted hover:text-textprimary'
              )}
            >
              <Icon size={18} />
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
      <div className="mb-8">
        <h1 className="font-display text-lg font-bold text-gold">Connection OS</h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition',
                active
                  ? 'text-gold border-l-[3px] border-gold bg-gold/5 pl-[9px]'
                  : 'text-textmuted hover:text-textprimary hover:bg-white/5'
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User + progress */}
      <div className="mt-auto pt-6 border-t border-border">
        <p className="text-xs font-medium text-textprimary mb-0.5">Joanna Patterson</p>
        {(() => {
          const { monthWeek, monthName, overallWeek } = getWeekLabel(current)
          return (
            <span className="relative group/week inline-flex items-center cursor-default mb-3">
              <span className="text-xs text-textmuted font-mono">
                Week {monthWeek} · {monthName}
              </span>
              <span className="absolute bottom-full left-0 mb-1.5 px-2 py-1 bg-navy border border-border rounded-md text-xs font-mono text-textmuted whitespace-nowrap opacity-0 group-hover/week:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                Week {overallWeek} of 12
              </span>
            </span>
          )
        })()}
        <div className={styles.progressTrack}>
          <div className={clsx(styles.progressFill, styles[`w${pct}` as keyof typeof styles])} />
        </div>
      </div>
    </div>
  )
}
