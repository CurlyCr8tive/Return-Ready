'use client'

import { useEffect, useRef } from 'react'

// Color palette [r, g, b] at each scroll percentage stop
const STOPS = [
  { at: 0,    c1: [20, 184, 166],  c2: [99, 102, 241],   c3: [29, 78, 216],   c4: [201, 168, 76]  }, // teal / indigo / blue / gold
  { at: 0.33, c1: [201, 168, 76],  c2: [139, 92, 246],   c3: [20, 184, 166],  c4: [59, 130, 246]  }, // gold / violet / teal / blue
  { at: 0.66, c1: [59, 130, 246],  c2: [236, 72, 153],   c3: [201, 168, 76],  c4: [99, 102, 241]  }, // blue / pink / gold / indigo
  { at: 1,    c1: [99, 102, 241],  c2: [20, 184, 166],   c3: [139, 92, 246],  c4: [236, 72, 153]  }, // indigo / teal / violet / pink
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
        c4: s0.c4.map((v, j) => lerp(v, s1.c4[j], t)),
      }
    }
  }
  const last = STOPS[STOPS.length - 1]
  return { c1: last.c1, c2: last.c2, c3: last.c3, c4: last.c4 }
}

export function ScrollOrbs() {
  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const ref3 = useRef<HTMLDivElement>(null)
  const ref4 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const main = document.getElementById('main-content')
    if (!main) return

    function update() {
      const pct = main!.scrollTop / Math.max(main!.scrollHeight - main!.clientHeight, 1)
      const { c1, c2, c3, c4 } = interpolate(pct)
      if (ref1.current) {
        ref1.current.style.background = `radial-gradient(circle, rgba(${c1[0]},${c1[1]},${c1[2]},0.15) 0%, transparent 65%)`
      }
      if (ref2.current) {
        ref2.current.style.background = `radial-gradient(circle, rgba(${c2[0]},${c2[1]},${c2[2]},0.13) 0%, transparent 65%)`
      }
      if (ref3.current) {
        ref3.current.style.background = `radial-gradient(circle, rgba(${c3[0]},${c3[1]},${c3[2]},0.10) 0%, transparent 65%)`
      }
      if (ref4.current) {
        ref4.current.style.background = `radial-gradient(circle, rgba(${c4[0]},${c4[1]},${c4[2]},0.12) 0%, transparent 65%)`
      }
    }

    main.addEventListener('scroll', update, { passive: true })
    update()
    return () => main.removeEventListener('scroll', update)
  }, [])

  return (
    <>
      {/* Left — mid height */}
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
      {/* Right — top */}
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
      {/* Center-right — bottom */}
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
      {/* Right of news panel — mid height */}
      <div
        ref={ref4}
        aria-hidden="true"
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          right: '5%',
          top: '42%',
          width: '420px',
          height: '420px',
          background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 65%)',
          filter: 'blur(75px)',
          zIndex: 0,
          transition: 'background 1s ease',
        }}
      />
    </>
  )
}
