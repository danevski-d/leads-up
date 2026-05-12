import SiteNav from '../_components/SiteNav'
import SiteFooter from '../_components/SiteFooter'
import { T, font } from '../_components/constants'

export const metadata = {
  title: 'Security — Leads Up',
  description: 'How Leads Up keeps your data safe with enterprise-grade security.',
}

const sections = [
  {
    title: 'Encryption',
    body: 'All data is encrypted in transit using TLS 1.2+ and at rest using AES-256.',
  },
  {
    title: 'Access Controls',
    body: 'Role-based access controls ensure only authorized team members can access customer data.',
  },
  {
    title: 'Compliance',
    body: 'We follow SOC 2 Type II security standards.',
  },
  {
    title: 'Incident Response',
    body: 'We have a documented incident response plan. In the event of a breach, affected customers are notified within 72 hours.',
  },
  {
    title: 'Penetration Testing',
    body: 'Our platform undergoes regular third-party security audits.',
  },
  {
    title: 'Contact',
    body: 'Security concerns? Email security@useleadsup.com',
  },
]

export default function SecurityPage() {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: font }}>
      <SiteNav />
      <main style={{ paddingTop: 100, paddingBottom: 120 }}>
        <article style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
          <header style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: T.blue, textTransform: 'uppercase', marginBottom: 16 }}>Trust &amp; Safety</div>
            <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 16 }}>Security</h1>
            <p style={{ fontSize: 16, color: T.sub, lineHeight: 1.7 }}>
              Enterprise-grade protection for every customer, by default.
            </p>
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
