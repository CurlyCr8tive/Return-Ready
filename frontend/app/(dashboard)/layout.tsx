import { Sidebar } from '@/components/dashboard/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-navy">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex w-[220px] flex-shrink-0 flex-col bg-navylight border-r border-border">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        {children}
      </main>

      {/* Bottom nav — mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-navylight border-t border-border">
        <Sidebar mobile />
      </nav>
    </div>
  )
}
