'use client'

import { useEffect, useRef } from 'react'

// Color palette [r, g, b] at each scroll percentage stop
const STOPS = [
  { at: 0,    c1: [20, 184, 166],  c2: [99, 102, 241],   c3: [29, 78, 216]   }, // teal / indigo / blue
  { at: 0.33, c1: [201, 168, 76],  c2: [139, 92, 246],   c3: [20, 184, 166]  }, // gold / violet / teal
  { at: 0.66, c1: [59, 130, 246],  c2: [236, 72, 153],   c3: [201, 168, 76]  }, // blue / pink / gold
  { at: 1,    c1: [99, 102, 241],  c2: [20, 184, 166],   c3: [139, 92, 246]  }, // indigo / teal / violet
]

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t)
}

function interpolate(pct: number) {
  for (let i = 0; i < STOPS.length - 1; i++) {
    const s0 = STOPS[i], s1 = STOPS[i + 1]
    if (pct >= s0.at && pct <= s1.at) {
      const t = (pct - s0.at) / (s1.at - s0.at)
      return {
        c1: s0.c1.map((v, j) => lerp(v, s1.c1[j], t)),
        c2: s0.c2.map((v, j) => lerp(v, s1.c2[j], t)),
        c3: s0.c3.map((v, j) => lerp(v, s1.c3[j], t)),
      }
    }
  }
  const last = STOPS[STOPS.length - 1]
  return { c1: last.c1, c2: last.c2, c3: last.c3 }
}

export function ScrollOrbs() {
  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const ref3 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const main = document.getElementById('main-content')
    if (!main) return

    function update() {
      const pct = main!.scrollTop / Math.max(main!.scrollHeight - main!.clientHeight, 1)
      const { c1, c2, c3 } = interpolate(pct)
      if (ref1.current) {
        ref1.current.style.background = `radial-gradient(circle, rgba(${c1[0]},${c1[1]},${c1[2]},0.15) 0%, transparent 65%)`
      }
      if (ref2.current) {
        ref2.current.style.background = `radial-gradient(circle, rgba(${c2[0]},${c2[1]},${c2[2]},0.13) 0%, transparent 65%)`
      }
      if (ref3.current) {
        ref3.current.style.background = `radial-gradient(circle, rgba(${c3[0]},${c3[1]},${c3[2]},0.10) 0%, transparent 65%)`
      }
    }

    main.addEventListener('scroll', update, { passive: true })
    return () => main.removeEventListener('scroll', update)
  }, [])

  return (
    <>
      <div
        ref={ref1}
        aria-hidden="true"
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          left: '-6%',
          top: '30%',
          width: '560px',
          height: '560px',
          background: 'radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 65%)',
          filter: 'blur(70px)',
          zIndex: 0,
          transition: 'background 1s ease',
        }}
      />
      <div
        ref={ref2}
        aria-hidden="true"
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          right: '-4%',
          top: '5%',
          width: '480px',
          height: '480px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 65%)',
          filter: 'blur(65px)',
          zIndex: 0,
          transition: 'background 1s ease',
        }}
      />
      <div
        ref={ref3}
        aria-hidden="true"
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          right: '20%',
          bottom: '10%',
          width: '360px',
          height: '360px',
          background: 'radial-gradient(circle, rgba(29,78,216,0.10) 0%, transparent 65%)',
          filter: 'blur(60px)',
          zIndex: 0,
          transition: 'background 1s ease',
        }}
      />
    </>
  )
}
