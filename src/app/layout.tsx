import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bacteria Eats - Survival Game',
  description: 'A game where you control bacteria trying to survive in a bloodstream',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-blood-red min-h-screen">
        {children}
      </body>
    </html>
  )
} 