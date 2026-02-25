'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BellRing, FileClock, Gauge, Newspaper, Settings, Users } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: Gauge },
  { href: '/dashboard/biweekly', label: 'Biweekly', icon: FileClock },
  { href: '/dashboard/monthly', label: 'Monthly', icon: BellRing },
  { href: '/dashboard/by-person', label: 'By Person', icon: Users },
  { href: '/dashboard/ai-digest', label: 'AI Digest', icon: Newspaper },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <aside className="w-[220px] shrink-0 border-r border-white/15 bg-[#112b3f]/80 px-3 py-5">
      <div className="mb-8 px-3">
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/90">Return Ready</p>
        <h1 className="mt-1 text-xl font-semibold text-white">Joanna Dashboard</h1>
      </div>

      <nav className="space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                active
                  ? 'bg-cyan-300/20 text-white'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
