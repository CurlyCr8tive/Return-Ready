'use client'

import { useEffect, useState } from 'react'
import { aiDigestAPI, AIDigest as AIDigestType } from '@/lib/api'

export function AIDigest() {
  const [digests, setDigests] = useState<AIDigestType[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})

  const load = async () => {
    const res = await aiDigestAPI.list()
    setDigests(res.digests)
  }

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  const generate = async () => {
    await aiDigestAPI.generate()
    await load()
  }

  return (
    <section className="space-y-4 text-slate-100">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-semibold text-white">AI News Digest</h2>
          <p className="mt-2 text-sm text-slate-300">Weekly digest with implications for Pursuit.</p>
        </div>
        <button
          onClick={generate}
          className="rounded-xl bg-cyan-300/25 px-4 py-2 text-sm text-white hover:bg-cyan-300/35"
        >
          Generate Now
        </button>
      </div>

      {loading ? <p className="text-slate-300">Loading...</p> : null}

      <div className="space-y-3">
        {digests.map((digest, idx) => (
          <article key={`${digest.week_start}-${idx}`} className="rounded-2xl border border-white/15 bg-[#12364c]">
            <button
              className="flex w-full items-center justify-between px-4 py-3 text-left"
              onClick={() => setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }))}
            >
              <span className="text-sm text-white">Week of {digest.week_start}</span>
              <span className="text-xs text-cyan-200">{expanded[idx] ? 'Hide' : 'Expand'}</span>
            </button>

            {expanded[idx] ? (
              <div className="space-y-3 border-t border-white/10 px-4 py-4 text-sm text-slate-100">
                <pre className="overflow-x-auto text-xs">{JSON.stringify(digest.sections, null, 2)}</pre>
                {digest.source_links?.length ? (
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-cyan-200">Sources</p>
                    <ul className="mt-1 space-y-1 text-sm">
                      {digest.source_links.map((link) => (
                        <li key={link}>
                          <a className="text-cyan-200 hover:text-cyan-100" href={link} target="_blank" rel="noreferrer">
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}
