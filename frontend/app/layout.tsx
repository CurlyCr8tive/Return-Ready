import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Connection OS',
  description: 'Stay connected. Come back ready.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-navy text-textprimary antialiased">
        {children}
      </body>
    </html>
  )
}
