import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Leads Up — AI Lead Conversion for Service Businesses',
  description: 'AI-powered inbound lead conversion and revenue recovery for service businesses. Never miss a lead again.',
  metadataBase: new URL('https://useleadsup.com'),
  openGraph: {
    type: 'website',
    url: 'https://useleadsup.com/',
    title: 'Leads Up — AI Lead Conversion for Service Businesses',
    description: 'Leads Up responds to every inbound lead in under 60 seconds via AI voice, SMS, or email. Qualifies, follows up, and books meetings 24/7.',
    images: [{ url: '/og-image.png', width: 500, height: 500 }],
    siteName: 'Leads Up',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leads Up — AI Lead Conversion for Service Businesses',
    description: 'AI-powered lead conversion for service businesses. Never miss a lead again.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/leadsup-icon.png',
  },
  keywords: ['AI lead conversion', 'lead qualification', 'AI receptionist', 'inbound leads', 'service business automation', 'lead follow up'],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: 'https://useleadsup.com',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Leads Up',
  url: 'https://useleadsup.com',
  logo: 'https://useleadsup.com/leadsup-icon.png',
  description: 'AI-powered inbound lead conversion and revenue recovery for service businesses.',
  sameAs: [
    'https://www.linkedin.com/company/leadsup',
    'https://twitter.com/leadsup',
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What exactly does Leads Up do?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Leads Up is an AI-powered lead conversion system. When a potential customer reaches out by phone, text, web form, or email, Leads Up responds instantly, qualifies the lead, and either books them or routes them to your team. It works 24/7 so you never miss an opportunity.',
      },
    },
    {
      '@type': 'Question',
      name: 'How fast can we go live?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most businesses are fully set up within 48 hours. Our team handles the configuration, connects your existing tools, and trains the AI on your business before going live.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is Leads Up different from a marketing agency?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A marketing agency brings leads to your door. Leads Up makes sure those leads actually turn into paying customers. We do not run ads — we convert the leads you are already getting but losing to slow response times or missed calls.',
      },
    },
    {
      '@type': 'Question',
      name: 'What tools does Leads Up integrate with?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Leads Up integrates with Google Calendar, HubSpot, Salesforce, GoHighLevel, Jobber, ServiceTitan, Calendly, Slack, Stripe, and 1,000+ more via API.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does Leads Up cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Leads Up starts at $2,400 per month for the Growth plan, which includes AI follow-up across SMS and email, up to 1,500 leads per month, and calendar and CRM integration.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my data secure?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All data is encrypted in transit and at rest. Leads Up follows SOC 2 security standards and never shares your customer data with third parties.',
      },
    },
  ],
}

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Leads Up',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://useleadsup.com',
  description: 'AI-powered inbound lead conversion and revenue recovery for service businesses.',
  offers: {
    '@type': 'Offer',
    price: '2400',
    priceCurrency: 'USD',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '2400',
      priceCurrency: 'USD',
      unitText: 'MONTH',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          strategy="afterInteractive"
        />
        <Script
          id="schema-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          strategy="afterInteractive"
        />
        <Script
          id="schema-software"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
