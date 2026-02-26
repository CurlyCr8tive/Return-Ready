'use client'

import { useState } from 'react'
import type { Digest } from '@/lib/api'

interface SourceItem {
  title: string
  pub: string
  url: string | null
}

interface SourcesGroup {
  label: string
  items: SourceItem[]
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
        url: c.url ?? null,
      })),
    },
    {
      label: 'Jobs & Hiring',
      items: (digest.jobs_and_hiring?.key_insights ?? []).map(item => ({
        title: typeof item === 'string' ? item : item.insight,
        pub: '',
        url: typeof item === 'string' ? null : (item.url ?? null),
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
        type="button"
        aria-expanded={open}
        aria-controls="sources-list"
        aria-label={`${total} sources — ${open ? 'collapse' : 'expand'} source list`}
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition cursor-pointer"
      >
        {total} sources
        <span className="text-[10px] leading-none" aria-hidden="true">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div id="sources-list" className="mt-3 border border-border rounded-xl overflow-hidden">
          {groups.map((group, gi) => (
            <div key={group.label} className={gi > 0 ? 'border-t border-border' : ''}>
              <p className="px-4 py-2 text-[10px] font-mono font-semibold tracking-widest uppercase text-textmuted bg-navylight/60">
                {group.label}
              </p>
              <div>
                {group.items.map((item, ii) => {
                  const base = 'flex items-start justify-between gap-4 px-4 py-2.5 border-t border-border/50 first:border-0 transition'

                  if (item.url) {
                    return (
                      <a
                        key={ii}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${item.title}${item.pub ? ` — ${item.pub}` : ''} (opens in new tab)`}
                        className={`${base} hover:bg-gold/5`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-textprimary line-clamp-2 leading-relaxed">{item.title}</p>
                          {item.pub && (
                            <p className="text-[10px] text-textmuted mt-0.5 font-mono">{item.pub}</p>
                          )}
                        </div>
                        <span className="flex-shrink-0 text-xs text-gold font-mono mt-0.5" aria-hidden="true">↗</span>
                      </a>
                    )
                  }

                  return (
                    <div key={ii} className={`${base} opacity-70`}>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-textprimary line-clamp-2 leading-relaxed">{item.title}</p>
                        {item.pub && (
                          <p className="text-[10px] text-textmuted mt-0.5 font-mono">{item.pub}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
