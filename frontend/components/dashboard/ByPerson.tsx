'use client'

import { useEffect, useState } from 'react'
import { dashboardAPI, PersonSummary } from '@/lib/api'
import { mockPeople } from '@/lib/mock-data'

export function ByPerson() {
  const [people, setPeople] = useState<PersonSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardAPI
      .getByPerson()
      .then((res) => setPeople(res.people.length ? res.people : mockPeople))
      .catch(() => setPeople(mockPeople))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="space-y-4 text-slate-100">
      <div>
        <h2 className="text-3xl font-semibold text-white">By Person</h2>
        <p className="mt-2 text-sm text-slate-300">One card per staff member with KPI trend, flags, and reported updates.</p>
      </div>

      {loading ? <p className="text-slate-300">Loading...</p> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {people.map((person) => (
          <article key={person.person} className="dashboard-card rounded-2xl p-4">
            <h3 className="text-lg text-white">{person.person}</h3>
            <p className="mt-3 text-xs uppercase tracking-[0.14em] text-cyan-200">Flags</p>
            <ul className="mt-1 space-y-1 text-sm text-slate-100">
              {person.flags.length === 0 ? <li>None reported</li> : null}
              {person.flags.slice(0, 3).map((f, i) => (
                <li key={`${f.week_start}-${i}`}>{f.week_start}: {f.flag}</li>
              ))}
            </ul>

            <p className="mt-3 text-xs uppercase tracking-[0.14em] text-cyan-200">Recent KPI Entries</p>
            <ul className="mt-1 space-y-1 text-sm text-slate-100">
              {person.kpi_trend.slice(-4).map((k, i) => (
                <li key={`${k.week_start}-${k.kpi_name}-${i}`}>
                  {k.week_start}: {k.kpi_name} = {String(k.kpi_value ?? 'n/a')}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
