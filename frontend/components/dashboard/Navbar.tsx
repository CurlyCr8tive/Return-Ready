'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BellRing, FileClock, Gauge, Newspaper, Settings, Users } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: Gauge, group: 'reporting' },
  { href: '/dashboard/biweekly', label: 'Biweekly', icon: FileClock, group: 'reporting' },
  { href: '/dashboard/monthly', label: 'Monthly', icon: BellRing, group: 'reporting' },
  { href: '/dashboard/by-person', label: 'By Person', icon: Users, group: 'reporting' },
  { href: '/dashboard/ai-digest', label: 'AI Digest', icon: Newspaper, group: 'reporting', hasStatus: true },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, group: 'settings' },
]

export function Navbar() {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <aside className="w-[220px] shrink-0 border-r border-white/15 bg-[#112b3f]/80 px-3 py-5">
      <div className="mb-8 px-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/90">Return Ready</p>
        <h1 className="mt-1 text-xl font-semibold text-white">Joanna Dashboard</h1>
      </div>

      <nav className="space-y-1.5">
        {navItems.map(({ href, label, icon: Icon, group, hasStatus }) => {
          const active = isActive(href)
          const divider = group === 'settings'
          return (
            <div key={href} className={divider ? 'mt-3 border-t border-white/10 pt-3' : ''}>
              <Link
                href={href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-all duration-200 ${
                  active
                    ? 'bg-cyan-300/20 text-white'
                    : 'text-slate-100 hover:translate-x-[2px] hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={17} className="transition-transform duration-200 group-hover:scale-105" />
                <span>{label}</span>
                {hasStatus ? (
                  <span className="ml-auto inline-flex h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(124,240,248,0.7)]" />
                ) : null}
              </Link>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
