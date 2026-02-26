'use client'

import { useState } from 'react'
import type { Digest } from '@/lib/api'

interface SourcesGroup {
  label: string
  items: { title: string; pub: string; url: string | null }[]
}

export function SourcesPanel({ digest }: { digest: Pick<Digest,
  'ai_developments' | 'companies_to_watch' | 'jobs_and_hiring' | 'featured_resource' | 'external_source_count'
> }) {
  const [open, setOpen] = useState(false)

  const groups: SourcesGroup[] = [
    {
      label: 'AI Developments',
      items: (digest.ai_developments ?? []).map(d => ({
        title: d.headline,
        pub: d.source,
        url: d.url,
      })),
    },
    {
      label: 'Companies to Watch',
      items: (digest.companies_to_watch ?? []).map(c => ({
        title: c.name,
        pub: c.what_they_do,
        url: null,
      })),
    },
    {
      label: 'Jobs & Hiring',
      items: (digest.jobs_and_hiring?.key_insights ?? []).map(insight => ({
        title: insight,
        pub: '',
        url: null,
      })),
    },
    digest.featured_resource
      ? {
          label: 'Featured Resource',
          items: [{
            title: digest.featured_resource.title,
            pub: digest.featured_resource.publication,
            url: digest.featured_resource.url,
          }],
        }
      : null,
  ].filter(Boolean) as SourcesGroup[]

  const total = digest.external_source_count

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition cursor-pointer"
      >
        {total} sources
        <span className="text-[10px] leading-none">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-3 border border-border rounded-xl overflow-hidden">
          {groups.map((group, gi) => (
            <div key={group.label} className={gi > 0 ? 'border-t border-border' : ''}>
              <p className="px-4 py-2 text-[10px] font-mono font-semibold tracking-widest uppercase text-textmuted bg-navylight/60">
                {group.label}
              </p>
              <ul>
                {group.items.map((item, ii) => (
                  <li
                    key={ii}
                    className="flex items-start justify-between gap-4 px-4 py-2.5 border-t border-border/50 first:border-0 hover:bg-white/[0.02] transition"
                  >
                    <div className="flex-1 min-w-0">
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-textprimary hover:text-gold transition line-clamp-2"
                        >
                          {item.title}
                        </a>
                      ) : (
                        <span className="text-xs text-textprimary line-clamp-2">{item.title}</span>
                      )}
                      {item.pub && (
                        <p className="text-[10px] text-textmuted mt-0.5 font-mono">{item.pub}</p>
                      )}
                    </div>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 text-[10px] text-gold hover:underline font-mono mt-0.5"
                        aria-label="Open article"
                      >
                        ↗
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
