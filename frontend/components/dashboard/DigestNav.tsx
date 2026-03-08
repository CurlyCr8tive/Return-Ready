'use client'

import { useEffect, useState } from 'react'

const NAV_ITEMS = [
  { id: 'developments', label: 'What Happened in AI' },
  { id: 'implications', label: 'Why It Matters for Pursuit' },
  { id: 'jobs',         label: 'Jobs & Skills' },
  { id: 'companies',    label: 'Companies to Watch' },
  { id: 'featured',     label: 'One Thing to Read' },
]

export function DigestNav() {
  const [active, setActive] = useState('developments')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    // Outer div is sticky — must NOT have overflow set
    <div className="sticky top-0 z-20 -mx-4 mb-8 border-b border-gold/15 bg-navy/90 backdrop-blur-md sm:-mx-6 md:-mx-10">
      {/* Inner div handles horizontal scroll on mobile */}
      <nav aria-label="Digest sections" className="overflow-x-auto">
        <div className="flex min-w-max gap-0 px-4 sm:px-6 md:px-10">
          {NAV_ITEMS.map(({ id, label }) => {
            const isActive = active === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className={[
                  'relative whitespace-nowrap px-3 py-3.5 font-mono text-[10px] uppercase tracking-widest transition-colors sm:px-4 sm:text-xs',
                  isActive ? 'text-gold' : 'text-textmuted hover:text-textprimary',
                ].join(' ')}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-gold" />
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
