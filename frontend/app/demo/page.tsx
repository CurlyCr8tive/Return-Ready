import Link from 'next/link'
import s from '../login/login.module.css'

export default function DemoLandingPage() {
  return (
    <div className={s.page}>
      {/* Glow blobs */}
      <div className={s.glowLeft} />
      <div className={s.glowRight} />

      {/* Network graph SVG background */}
      <svg className={s.networkSvg} xmlns="http://www.w3.org/2000/svg">
        <g className={s.networkLeftGroup}>
          <line x1="5%" y1="15%" x2="22%" y2="38%" stroke="#14b8a6" strokeWidth="1" />
          <line x1="22%" y1="38%" x2="45%" y2="22%" stroke="#14b8a6" strokeWidth="1" />
          <line x1="22%" y1="38%" x2="35%" y2="62%" stroke="#14b8a6" strokeWidth="0.8" />
          <line x1="5%" y1="15%" x2="35%" y2="62%" stroke="#14b8a6" strokeWidth="0.5" strokeDasharray="4 6" />
          <line x1="10%" y1="80%" x2="35%" y2="62%" stroke="#14b8a6" strokeWidth="0.8" />
          <line x1="10%" y1="80%" x2="22%" y2="38%" stroke="#14b8a6" strokeWidth="0.5" strokeDasharray="3 5" />
          <circle cx="5%" cy="15%" r="3.5" fill="#14b8a6" />
          <circle cx="22%" cy="38%" r="4.5" fill="#14b8a6" />
          <circle cx="45%" cy="22%" r="3" fill="#14b8a6" />
          <circle cx="35%" cy="62%" r="4" fill="#14b8a6" />
          <circle cx="10%" cy="80%" r="3" fill="#14b8a6" />
          <circle cx="22%" cy="38%" r="8" fill="none" stroke="#14b8a6" strokeWidth="0.5" opacity="0.4" />
        </g>
        <g className={s.networkRightGroup}>
          <line x1="45%" y1="22%" x2="68%" y2="42%" stroke="#14b8a6" strokeWidth="1" />
          <line x1="68%" y1="42%" x2="90%" y2="28%" stroke="#14b8a6" strokeWidth="0.8" />
          <line x1="35%" y1="62%" x2="55%" y2="75%" stroke="#14b8a6" strokeWidth="1" />
          <line x1="55%" y1="75%" x2="78%" y2="58%" stroke="#14b8a6" strokeWidth="0.8" />
          <line x1="78%" y1="58%" x2="90%" y2="28%" stroke="#14b8a6" strokeWidth="0.8" />
          <line x1="45%" y1="22%" x2="55%" y2="75%" stroke="#14b8a6" strokeWidth="0.5" strokeDasharray="4 6" />
          <line x1="78%" y1="58%" x2="68%" y2="42%" stroke="#14b8a6" strokeWidth="1" />
          <circle cx="68%" cy="42%" r="5" fill="#14b8a6" />
          <circle cx="90%" cy="28%" r="3" fill="#14b8a6" />
          <circle cx="55%" cy="75%" r="3.5" fill="#14b8a6" />
          <circle cx="78%" cy="58%" r="4" fill="#14b8a6" />
          <circle cx="68%" cy="42%" r="10" fill="none" stroke="#14b8a6" strokeWidth="0.5" opacity="0.4" />
        </g>
      </svg>

      {/* Content */}
      <div className={s.content}>

        {/* Logo + Wordmark */}
        <div className="text-center mb-8">
          <div className={s.logoBox}>
            <span className={s.logoText}>CO</span>
          </div>
          <h1 className={s.title}>Connection OS</h1>
          <p className={s.subtitle}>Stay connected. Come back ready.</p>
        </div>

        {/* Card */}
        <div className={s.card}>
          <div className="mb-6 text-center">
            <h2 className={s.cardTitle}>Welcome to the Demo</h2>
            <p className={s.cardSub}>
              A weekly AI digest dashboard — built for leaders on leave
            </p>
          </div>

          {/* Demo description */}
          <div className="mb-6 space-y-3">
            {[
              'Weekly AI news curated from 10+ sources',
              '"Why this matters" analysis tailored to your org',
              'Companies to watch across industries',
              'Jobs & skills trends, plus a featured read',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex-shrink-0 text-teal-400 text-sm" aria-hidden="true">✓</span>
                <p className="text-sm text-slate-300">{item}</p>
              </div>
            ))}
          </div>

          {/* Demo mode badge */}
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-teal-500/25 bg-teal-500/8 px-3 py-2">
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-400" aria-hidden="true" />
            <p className="text-xs font-mono text-teal-400">
              Sample data · fictional org · no login required
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/demo/dashboard"
            className="block w-full rounded-lg bg-gold px-4 py-3 text-center text-sm font-semibold text-navy transition hover:bg-gold/90"
          >
            View Demo Dashboard →
          </Link>

          <div className="mt-4 text-center">
            <Link
              href="/login"
              className="text-xs text-slate-500 transition hover:text-slate-400"
            >
              Have an account? Sign in
            </Link>
          </div>
        </div>

        {/* Builder credit */}
        <p className="mt-6 text-center text-xs text-slate-600">
          Built by{' '}
          <span className="text-slate-400 font-medium">Cherice Heron</span>
          {' · '}AI Product Design
        </p>
      </div>
    </div>
  )
}
