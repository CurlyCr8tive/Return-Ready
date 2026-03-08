import { ScrollOrbs } from '@/components/dashboard/ScrollOrbs'
import s from '../(dashboard)/dashboard.module.css'

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.page}>
      <ScrollOrbs />

      {/* Same animated network SVG as main dashboard */}
      <svg aria-hidden="true" className={s.networkSvg} xmlns="http://www.w3.org/2000/svg">
        <g className={s.networkLeftGroup}>
          <line x1="0%" y1="25%" x2="18%" y2="45%" stroke="#14b8a6" strokeWidth="1" />
          <line x1="18%" y1="45%" x2="38%" y2="20%" stroke="#14b8a6" strokeWidth="0.8" />
          <line x1="18%" y1="45%" x2="30%" y2="68%" stroke="#14b8a6" strokeWidth="0.8" />
          <line x1="30%" y1="68%" x2="52%" y2="80%" stroke="#14b8a6" strokeWidth="1" />
          <line x1="38%" y1="20%" x2="52%" y2="80%" stroke="#14b8a6" strokeWidth="0.4" strokeDasharray="5 7" />
          <line x1="0%" y1="60%" x2="18%" y2="45%" stroke="#14b8a6" strokeWidth="0.6" strokeDasharray="4 6" />
          <line x1="12%" y1="8%" x2="38%" y2="20%" stroke="#14b8a6" strokeWidth="0.7" />
          <line x1="10%" y1="85%" x2="30%" y2="68%" stroke="#14b8a6" strokeWidth="0.8" />
          <circle cx="18%" cy="45%" r="5" fill="#14b8a6" />
          <circle cx="38%" cy="20%" r="4" fill="#14b8a6" />
          <circle cx="30%" cy="68%" r="4.5" fill="#14b8a6" />
          <circle cx="52%" cy="80%" r="4" fill="#14b8a6" />
          <circle cx="12%" cy="8%" r="3" fill="#14b8a6" />
          <circle cx="18%" cy="45%" r="10" fill="none" stroke="#14b8a6" strokeWidth="0.5" opacity="0.35" />
        </g>
        <g className={s.networkRightGroup}>
          <line x1="38%" y1="20%" x2="60%" y2="38%" stroke="#14b8a6" strokeWidth="1" />
          <line x1="60%" y1="38%" x2="82%" y2="18%" stroke="#14b8a6" strokeWidth="0.8" />
          <line x1="52%" y1="80%" x2="75%" y2="62%" stroke="#14b8a6" strokeWidth="0.8" />
          <line x1="75%" y1="62%" x2="92%" y2="75%" stroke="#14b8a6" strokeWidth="0.7" />
          <line x1="60%" y1="38%" x2="75%" y2="62%" stroke="#14b8a6" strokeWidth="0.9" />
          <circle cx="60%" cy="38%" r="5.5" fill="#14b8a6" />
          <circle cx="82%" cy="18%" r="3.5" fill="#14b8a6" />
          <circle cx="75%" cy="62%" r="4" fill="#14b8a6" />
          <circle cx="92%" cy="75%" r="3" fill="#14b8a6" />
          <circle cx="60%" cy="38%" r="11" fill="none" stroke="#14b8a6" strokeWidth="0.5" opacity="0.35" />
        </g>
      </svg>

      <div className={s.shell}>
        {/* Demo sidebar — desktop */}
        <aside className={s.sidebar} aria-label="Sidebar navigation">
          <DemoSidebar />
        </aside>

        <main id="main-content" className={s.mainWrap}>
          <div className={s.panel}>
            {/* Demo mode banner */}
            <div className="mb-6 flex items-center gap-2.5 rounded-lg border border-teal-500/30 bg-teal-500/10 px-4 py-2.5">
              <span className="h-2 w-2 flex-shrink-0 rounded-full bg-teal-400" aria-hidden="true" />
              <p className="text-xs font-mono text-teal-400">
                Demo Mode — sample digest for a fictional workforce development org
              </p>
            </div>
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className={s.mobileNav} aria-label="Mobile navigation">
        <div className="flex items-center justify-around gap-1 px-4 py-3">
          <span className="text-xs font-mono text-gold">Connection OS · Demo</span>
        </div>
      </nav>
    </div>
  )
}

function DemoSidebar() {
  return (
    <div className="flex flex-col h-full px-4 py-6">
      {/* Wordmark */}
      <div className="mb-3">
        <h1 className="font-display text-lg font-bold text-gold">Connection OS</h1>
      </div>

      {/* Demo org avatar */}
      <div className="mb-6 flex items-center gap-2 px-1 py-1.5">
        <div className="w-7 h-7 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-bold text-teal-400">TB</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs text-textprimary font-medium truncate">TechBridge</span>
          <span className="text-[10px] font-mono text-teal-400">Demo Mode</span>
        </div>
      </div>

      {/* Nav — all point to /demo since this is read-only */}
      <nav className="flex-1 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gold border-l-[3px] border-gold bg-gold/5 pl-[9px]">
          <span className="text-base" aria-hidden="true">⌂</span>
          This Week
        </div>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-textmuted">
          <span className="text-base" aria-hidden="true">▤</span>
          Archive
        </div>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-textmuted">
          <span className="text-base" aria-hidden="true">⚙</span>
          Settings
        </div>
      </nav>

      {/* Bottom */}
      <div className="mt-auto pt-6 border-t border-border">
        <p className="mb-1 text-xs text-textmuted">Week 1 of 12</p>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full w-[8%] rounded-full bg-gold/60" />
        </div>
        <p className="mt-3 text-[11px] text-textmuted leading-relaxed">
          Built by{' '}
          <span className="text-gold font-medium">Cherice Heron</span>
          <br />
          AI Product Design
        </p>
      </div>
    </div>
  )
}
