import SiteNav from '../_components/SiteNav'
import SiteFooter from '../_components/SiteFooter'
import { T, font } from '../_components/constants'

export const metadata = {
  title: 'Terms of Service — Leads Up',
  description: 'Terms and conditions for using the Leads Up platform.',
}

const sections = [
  {
    title: 'Acceptance',
    body: 'By using Leads Up, you agree to these terms.',
  },
  {
    title: 'Service Description',
    body: 'Leads Up provides AI-powered lead conversion tools for service businesses.',
  },
  {
    title: 'Account Responsibilities',
    body: 'You are responsible for keeping your account credentials secure and for all activity under your account.',
  },
  {
    title: 'Acceptable Use',
    body: 'You may not use Leads Up for illegal purposes, to send spam, or to violate any third-party rights.',
  },
  {
    title: 'Payment',
    body: 'Subscription fees are billed monthly or annually. No refunds for partial months. You can cancel anytime.',
  },
  {
    title: 'Limitation of Liability',
    body: 'Leads Up is not liable for indirect or consequential damages.',
  },
  {
    title: 'Contact',
    body: 'Questions? Email legal@useleadsup.com',
  },
]

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: font }}>
      <SiteNav />
      <main style={{ paddingTop: 100, paddingBottom: 120 }}>
        <article style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
          <header style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: T.blue, textTransform: 'uppercase', marginBottom: 16 }}>Legal</div>
            <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 16 }}>Terms of Service</h1>
            <p style={{ fontSize: 14, color: T.sub }}>Last updated: May 2026</p>
          </header>

          {sections.map(({ title, body }) => (
            <section key={title} style={{ marginBottom: 40, paddingBottom: 40, borderBottom: `1px solid ${T.border}` }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 12, letterSpacing: '-0.01em' }}>{title}</h2>
              <p style={{ fontSize: 16, color: T.sub, lineHeight: 1.8, margin: 0 }}>{body}</p>
            </section>
          ))}
        </article>
      </main>
      <SiteFooter />
    </div>
  )
}
