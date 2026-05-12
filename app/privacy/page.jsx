import SiteNav from '../_components/SiteNav'
import SiteFooter from '../_components/SiteFooter'
import { T, font } from '../_components/constants'

export const metadata = {
  title: 'Privacy Policy — Leads Up',
  description: 'How Leads Up collects, uses, and protects your data.',
}

const sections = [
  {
    title: 'Information We Collect',
    body: 'We collect information you provide directly (name, email, business details) and usage data (pages visited, features used) to improve our service.',
  },
  {
    title: 'How We Use Your Information',
    body: 'To operate and improve Leads Up, communicate with you, provide customer support, and send product updates (you can opt out anytime).',
  },
  {
    title: 'Data Sharing',
    body: 'We do not sell your data. We share data only with service providers who help us operate the platform (e.g. hosting, analytics), under strict confidentiality agreements.',
  },
  {
    title: 'Data Security',
    body: 'All data is encrypted in transit (TLS) and at rest (AES-256). We follow SOC 2 security standards.',
  },
  {
    title: 'Your Rights',
    body: 'You may request access to, correction of, or deletion of your personal data at any time by emailing privacy@useleadsup.com.',
  },
  {
    title: 'Contact',
    body: 'Questions? Email privacy@useleadsup.com',
  },
]

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: font }}>
      <SiteNav />
      <main style={{ paddingTop: 100, paddingBottom: 120 }}>
        <article style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
          <header style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: T.blue, textTransform: 'uppercase', marginBottom: 16 }}>Legal</div>
            <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 16 }}>Privacy Policy</h1>
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
