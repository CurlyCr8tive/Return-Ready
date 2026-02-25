// frontend/app/(staff)/layout.tsx
// Staff portal layout — minimal header, no sidebar

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-lightgray">
      <header className="bg-navy text-white px-6 py-4 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <span className="font-semibold text-base tracking-tight">Return Ready</span>
          <span className="text-midblue text-sm">| Team Portal</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {children}
      </main>
    </div>
  )
}
