import { Navbar } from '@/components/dashboard/Navbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,#275877_0%,#0d2537_45%,#081622_100%)] px-4 py-6">
      <div className="mx-auto flex min-h-[92vh] w-full max-w-[1260px] overflow-hidden rounded-2xl border border-white/15 bg-[#0b2435]/85 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
