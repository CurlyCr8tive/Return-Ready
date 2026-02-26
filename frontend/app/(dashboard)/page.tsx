import { digestAPI } from '@/lib/api'
import { DigestCard } from '@/components/dashboard/DigestCard'
import { StatCard } from '@/components/dashboard/StatCard'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [latestRes, statsRes, allRes] = await Promise.allSettled([
    digestAPI.getLatest(),
    digestAPI.getStats(),
    digestAPI.getAll(),
  ])

  const latest =
    latestRes.status === 'fulfilled' && latestRes.value.digest
      ? latestRes.value.digest
      : null

  const stats =
    statsRes.status === 'fulfilled' ? statsRes.value : null

  const allDigests =
    allRes.status === 'fulfilled' ? allRes.value.digests : []

  const previous = allDigests.slice(1, 4)

  return (
    <div>
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-textprimary">
          Welcome Back, Joanna.
        </h1>
        <p className="text-sm text-textmuted mt-1">
          Your AI intel for the week — curated &amp; ready.
        </p>
      </div>

      {/* Hero */}
      <div className="mb-8">
        {latest ? (
          <DigestCard digest={latest} hero />
        ) : (
          <div className="bg-navylight border border-border rounded-xl p-8 text-center">
            <p className="text-sm text-textmuted">Your first digest will appear here on March 1st.</p>
          </div>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Current Week"
            value={`Week ${stats.latest_week_number || 1}`}
            sub="of 12"
          />
          <StatCard
            label="Digests Generated"
            value={stats.total_digests_generated}
            sub={stats.total_unread > 0 ? `${stats.total_unread} unread` : 'All read'}
          />
          <StatCard
            label="Next Digest"
            value={stats.next_digest}
            sub="Monday at 6am"
          />
        </div>
      )}

      {/* Previous digests */}
      {previous.length > 0 && (
        <div>
          <h2 className="text-xs font-mono text-textmuted uppercase tracking-widest mb-3">
            Previous Weeks
          </h2>
          <div className="space-y-2">
            {previous.map((d) => (
              <DigestCard key={d.id} digest={d} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
