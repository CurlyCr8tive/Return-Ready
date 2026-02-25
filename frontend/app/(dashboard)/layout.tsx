import { Navbar } from '@/components/dashboard/Navbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#2a5873] px-4 py-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(122,209,219,0.22)_0%,transparent_38%),radial-gradient(circle_at_82%_85%,rgba(92,198,205,0.2)_0%,transparent_34%),linear-gradient(160deg,#3f6f87_0%,#2b5d76_42%,#234f67_100%)]" />

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-65"
        viewBox="0 0 1400 1000"
        preserveAspectRatio="none"
      >
        <g stroke="#63d4c7" strokeWidth="3.5" fill="none" opacity="0.36">
          <path d="M190 770 L470 900 L760 830 L1030 575 L980 270 L680 150 L430 300 L250 560 Z" />
          <path d="M430 300 L760 830" />
          <path d="M680 150 L250 560" />
          <path d="M680 150 L1030 575" />
          <path d="M470 900 L250 560" />
        </g>
        <g fill="#74dfd1" opacity="0.7">
          <circle cx="190" cy="770" r="12" />
          <circle cx="470" cy="900" r="13" />
          <circle cx="760" cy="830" r="13" />
          <circle cx="1030" cy="575" r="13" />
          <circle cx="980" cy="270" r="12" />
          <circle cx="680" cy="150" r="12" />
          <circle cx="430" cy="300" r="12" />
          <circle cx="250" cy="560" r="12" />
        </g>
      </svg>

      <div className="pointer-events-none absolute -left-16 top-24 h-48 w-48 rounded-full bg-[#79e8dc]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-28 h-52 w-52 rounded-full bg-[#7ee3d5]/20 blur-3xl" />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 1400 1000"
        preserveAspectRatio="none"
      >
        <g stroke="#79dfd2" strokeWidth="2.5" fill="none" opacity="0.55">
          <path d="M72 120 L240 74 L360 176 L220 312 L82 258 Z" />
          <path d="M1180 160 L1320 240 L1270 392 L1120 370 L1070 235 Z" />
          <path d="M104 834 L272 914 L312 1012 L120 998 L42 900 Z" />
        </g>
        <g fill="#7ee9dc" opacity="0.65">
          <circle cx="72" cy="120" r="7" />
          <circle cx="240" cy="74" r="7" />
          <circle cx="360" cy="176" r="7" />
          <circle cx="220" cy="312" r="7" />
          <circle cx="82" cy="258" r="7" />
          <circle cx="1180" cy="160" r="7" />
          <circle cx="1320" cy="240" r="7" />
          <circle cx="1270" cy="392" r="7" />
          <circle cx="1120" cy="370" r="7" />
          <circle cx="1070" cy="235" r="7" />
          <circle cx="104" cy="834" r="7" />
          <circle cx="272" cy="914" r="7" />
          <circle cx="312" cy="1012" r="7" />
          <circle cx="120" cy="998" r="7" />
          <circle cx="42" cy="900" r="7" />
        </g>
      </svg>

      <div className="relative mx-auto flex min-h-[92vh] w-full max-w-[1260px] overflow-hidden rounded-2xl border border-white/15 bg-[linear-gradient(120deg,rgba(8,28,44,0.96)_0%,rgba(11,31,49,0.98)_48%,rgba(6,25,40,0.96)_100%)] shadow-[0_28px_90px_rgba(0,0,0,0.38)]">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
