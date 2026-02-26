'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Archive, Settings } from 'lucide-react'
import { clsx } from 'clsx'

const LEAVE_START = process.env.NEXT_PUBLIC_LEAVE_START_DATE || '2025-03-01'

function getWeekProgress() {
  const start = new Date(LEAVE_START)
  const now = new Date()
  const totalWeeks = 12
  const elapsed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7))
  const current = Math.min(Math.max(elapsed + 1, 1), totalWeeks)
  const pct = Math.round((current / totalWeeks) * 100)
  return { current, totalWeeks, pct }
}

const navItems = [
  { href: '/', label: 'This Week', icon: Home },
  { href: '/archive', label: 'Archive', icon: Archive },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname()
  const { current, totalWeeks, pct } = getWeekProgress()

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
        <p className="text-xs text-textmuted font-mono mb-3">
          Week {current} of {totalWeeks}
        </p>
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}
