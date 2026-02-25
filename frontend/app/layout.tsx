// frontend/app/layout.tsx
// Root layout for Return Ready — wraps all routes with global styles and font imports
// Provides Supabase session context to all pages

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Return Ready',
  description: 'Private AI-powered continuity platform for parental leave',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-slate-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
