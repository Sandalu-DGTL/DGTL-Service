import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'DGTL Service Hub', template: '%s | DGTL' },
  description: 'A secure client portal for DGTL services, tools and account access.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
