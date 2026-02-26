import { Sidebar } from '@/components/dashboard/Sidebar'
import { ScrollOrbs } from '@/components/dashboard/ScrollOrbs'
import s from './dashboard.module.css'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.page}>
      {/* Skip to main content — visible on keyboard focus only */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gold focus:text-navy focus:text-sm focus:font-semibold focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Atmosphere orbs — color shifts on scroll */}
      <ScrollOrbs />

      {/* Network graph background — decorative only */}
      <svg aria-hidden="true" className={s.networkSvg} xmlns="http://www.w3.org/2000/svg">
        <g className={s.networkLeftGroup}>
          <line x1="0%" y1="25%" x2="18%" y2="45%" stroke="#14b8a6" strokeWidth="1" />
          <line x1="18%" y1="45%" x2="38%" y2="20%" stroke="#14b8a6" strokeWidth="0.8" />
          <line x1="18%" y1="45%" x2="30%" y2="68%" stroke="#14b8a6" strokeWidth="0.8" />
          <line x1="30%" y1="68%" x2="52%" y2="80%" stroke="#14b8a6" strokeWidth="1" />
          <line x1="38%" y1="20%" x2="52%" y2="80%" stroke="#14b8a6" strokeWidth="0.4" strokeDasharray="5 7" />
          <line x1="0%" y1="60%" x2="18%" y2="45%" stroke="#14b8a6" strokeWidth="0.6" strokeDasharray="4 6" />
          <line x1="30%" y1="68%" x2="60%" y2="38%" stroke="#14b8a6" strokeWidth="0.4" strokeDasharray="3 8" />
          <line x1="12%" y1="8%" x2="38%" y2="20%" stroke="#14b8a6" strokeWidth="0.7" />
          <line x1="12%" y1="8%" x2="0%" y2="25%" stroke="#14b8a6" strokeWidth="0.6" />
          <line x1="10%" y1="85%" x2="30%" y2="68%" stroke="#14b8a6" strokeWidth="0.8" />
          <line x1="10%" y1="85%" x2="0%" y2="60%" stroke="#14b8a6" strokeWidth="0.6" />
          <circle cx="0%" cy="25%" r="3" fill="#14b8a6" />
          <circle cx="18%" cy="45%" r="5" fill="#14b8a6" />
          <circle cx="38%" cy="20%" r="4" fill="#14b8a6" />
          <circle cx="30%" cy="68%" r="4.5" fill="#14b8a6" />
          <circle cx="52%" cy="80%" r="4" fill="#14b8a6" />
          <circle cx="12%" cy="8%" r="3" fill="#14b8a6" />
          <circle cx="10%" cy="85%" r="3" fill="#14b8a6" />
          <circle cx="0%" cy="60%" r="2.5" fill="#14b8a6" />
          <circle cx="18%" cy="45%" r="10" fill="none" stroke="#14b8a6" strokeWidth="0.5" opacity="0.35" />
          <circle cx="30%" cy="68%" r="9" fill="none" stroke="#14b8a6" strokeWidth="0.4" opacity="0.3" />
        </g>
        <g className={s.networkRightGroup}>
          <line x1="38%" y1="20%" x2="60%" y2="38%" stroke="#14b8a6" strokeWidth="1" />
          <line x1="60%" y1="38%" x2="82%" y2="18%" stroke="#14b8a6" strokeWidth="0.8" />
          <line x1="82%" y1="18%" x2="100%" y2="35%" stroke="#14b8a6" strokeWidth="0.7" />
          <line x1="52%" y1="80%" x2="75%" y2="62%" stroke="#14b8a6" strokeWidth="0.8" />
          <line x1="75%" y1="62%" x2="92%" y2="75%" stroke="#14b8a6" strokeWidth="0.7" />
          <line x1="60%" y1="38%" x2="75%" y2="62%" stroke="#14b8a6" strokeWidth="0.9" />
          <line x1="82%" y1="18%" x2="92%" y2="75%" stroke="#14b8a6" strokeWidth="0.5" strokeDasharray="4 6" />
          <line x1="65%" y1="5%" x2="82%" y2="18%" stroke="#14b8a6" strokeWidth="0.7" />
          <line x1="65%" y1="5%" x2="38%" y2="20%" stroke="#14b8a6" strokeWidth="0.5" strokeDasharray="4 6" />
          <line x1="88%" y1="90%" x2="92%" y2="75%" stroke="#14b8a6" strokeWidth="0.7" />
          <line x1="88%" y1="90%" x2="75%" y2="62%" stroke="#14b8a6" strokeWidth="0.6" />
          <circle cx="60%" cy="38%" r="5.5" fill="#14b8a6" />
          <circle cx="82%" cy="18%" r="3.5" fill="#14b8a6" />
          <circle cx="100%" cy="35%" r="3" fill="#14b8a6" />
          <circle cx="75%" cy="62%" r="4" fill="#14b8a6" />
          <circle cx="92%" cy="75%" r="3" fill="#14b8a6" />
          <circle cx="65%" cy="5%" r="3.5" fill="#14b8a6" />
          <circle cx="88%" cy="90%" r="3" fill="#14b8a6" />
          <circle cx="60%" cy="38%" r="11" fill="none" stroke="#14b8a6" strokeWidth="0.5" opacity="0.35" />
        </g>
      </svg>

      {/* Dashboard shell */}
      <div className={s.shell}>
        {/* Sidebar — desktop */}
        <aside className={s.sidebar} aria-label="Sidebar navigation">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main id="main-content" className={s.mainWrap}>
          <div className={s.panel}>
            {children}
          </div>
        </main>
      </div>

      {/* Bottom nav — mobile */}
      <nav className={s.mobileNav} aria-label="Mobile navigation">
        <Sidebar mobile />
      </nav>
    </div>
  )
}
