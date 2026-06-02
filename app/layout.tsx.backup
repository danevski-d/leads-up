import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Leads Up - AI Lead Conversion',
  description: 'AI-powered inbound lead conversion and revenue recovery for service businesses. Never miss a lead again.',
  metadataBase: new URL('https://useleadsup.com'),
  openGraph: {
    type: 'website',
    url: 'https://useleadsup.com/',
    title: 'Leads Up - Never Lose a Lead Again',
    description: 'Leads Up responds to every inbound lead in under 60 seconds via AI voice, SMS, or email. Qualifies, follows up, and books meetings 24/7.',
    images: [{ url: '/og-image.png', width: 500, height: 500 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leads Up - Never Lose a Lead Again',
    description: 'AI-powered lead conversion for service businesses. Never miss a lead again.',
    images: ['/og-image.png'],
  },
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
