import Link from 'next/link'
import SiteNav from './_components/SiteNav'
import SiteFooter from './_components/SiteFooter'
import FAQAccordion from './_components/FAQAccordion'
import IntegrationHub from './_components/IntegrationHub'
import BackgroundGradient from '@/components/ui/background-gradient'
import { T, font } from './_components/constants'

export async function generateMetadata() {
  return {
    title: 'Leads Up — AI Lead Conversion for Service Businesses',
    description: 'AI-powered inbound lead conversion and revenue recovery. Never miss a lead again. Built for service businesses.',
    metadataBase: new URL('https://useleadsup.com'),
    openGraph: {
      type: 'website',
      url: 'https://useleadsup.com/',
      title: 'Leads Up — AI Lead Conversion for Service Businesses',
      description: 'AI-powered inbound lead conversion and revenue recovery. Never miss a lead again. Built for service businesses.',
      images: [{ url: '/og-image.png', width: 500, height: 500 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Leads Up — AI Lead Conversion for Service Businesses',
      description: 'AI-powered inbound lead conversion and revenue recovery. Never miss a lead again.',
      images: ['/og-image.png'],
    },
  }
}

const steps = [
  { num: '01', title: 'Capture', desc: 'Every form, ad, DM, and inbound source is unified into one revenue stream — instantly enriched and scored.' },
  { num: '02', title: 'Engage',  desc: 'AI agents reply in under 60 seconds across SMS, email, and chat — with brand-perfect tone and full context.' },
  { num: '03', title: 'Qualify', desc: 'Multi-turn conversations qualify intent, budget, and timing — then hand off only sales-ready leads.' },
  { num: '04', title: 'Book',    desc: 'Calls land directly on your calendar. Reminders, reschedules, and no-show recovery run automatically.' },
]

const featureCards = [
  {
    title: 'AI follow-up that never sleeps',
    desc: 'Conversational agents trained on your offer respond instantly across every channel — including the 80% of leads humans never reach.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B8AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.816 1.912a2 2 0 00-1.272 1.272L12 21l-1.912-5.816a2 2 0 00-1.272-1.272L3 12l5.816-1.912a2 2 0 001.272-1.272L12 3z"/></svg>,
  },
  {
    title: 'Booked calls, not busy work',
    desc: 'Every qualified conversation auto-converts into a calendar booking with reminders, confirmations, and re-engagement built in.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B8AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  },
  {
    title: 'Revenue-grade analytics',
    desc: "Every touchpoint, reply, and booking tied back to pipeline impact. Know exactly what's working — and scale it.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B8AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  },
  {
    title: 'Plug into your stack',
    desc: 'Native integrations with HubSpot, Salesforce, Pipedrive, GHL, Calendly, Slack, Stripe — and 1,000+ via API.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B8AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  },
  {
    title: 'Trained on your brand',
    desc: 'Voice, tone, objections, edge cases — your AI agent operates with the precision of your best closer.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B8AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  },
  {
    title: 'Enterprise-ready',
    desc: "SOC 2, GDPR, end-to-end encryption, role-based access. Built for teams who can't afford to play.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B8AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  },
]

const plans = [
  {
    name: 'Growth', price: '$2,400', period: '/mo',
    tagline: 'For teams scaling inbound to 500+ leads/mo.',
    features: ['AI follow-up across SMS + email', 'Up to 1,500 leads/month', 'Calendar + CRM integration', 'Standard support'],
    cta: 'Start with Growth', href: '/login?mode=signup', highlight: false,
  },
  {
    name: 'Scale', price: '$4,900', period: '/mo',
    tagline: 'Full revenue infrastructure for 7–8 figure operators.',
    features: ['Everything in Growth', 'Unlimited leads', 'Custom AI training on your offer', 'Dedicated revenue strategist', 'Priority + Slack support'],
    cta: 'Book strategy call', href: '#cta', highlight: true, badge: 'Most Popular',
  },
  {
    name: 'Enterprise', price: 'Custom', period: '',
    tagline: 'For multi-brand operators and high-volume sales orgs.',
    features: ['Custom integrations & SLAs', 'SOC 2 + dedicated infra', 'White-glove onboarding', 'Quarterly business reviews'],
    cta: 'Talk to sales', href: '#cta', highlight: false,
  },
]

export default function Page() {
  return (
    <div style={{ minHeight: '100vh', fontFamily: font, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px', position: 'relative' }}>
      <BackgroundGradient />

      <style>{`
        /* Hover utilities — replaces inline JS event handlers */
        .lp-nav-link  { color: #94A3B8; text-decoration: none; transition: color 0.15s; font-family: ${font}; }
        .lp-nav-link:hover  { color: #FFFFFF; }
        .lp-btn-fade  { transition: opacity 0.15s; }
        .lp-btn-fade:hover  { opacity: 0.85 !important; }
        .lp-link-inv  { color: #FFFFFF; text-decoration: none; transition: color 0.15s; }
        .lp-link-inv:hover  { color: #94A3B8; }
        .lp-footer-link { color: #94A3B8; text-decoration: none; transition: color 0.15s; }
        .lp-footer-link:hover { color: #FFFFFF; }

        /* Burger: desktop hide */
        .nav-burger { display: none; }

        /* Mobile ≤ 767px */
        @media (max-width: 767px) {
          .nav-burger        { display: flex !important; }
          .hero-section      { padding-top: 76px !important; padding-bottom: 20px !important; }
          .hero-inner        { padding: 0 20px !important; }
          .hero-headline     { font-size: 30px !important; line-height: 1.18 !important; white-space: normal !important; }
          .hero-sub          { font-size: 15px !important; margin-bottom: 28px !important; }
          .hero-btns         { flex-direction: column !important; width: 100% !important; gap: 12px !important; padding: 0 4px !important; }
          .hero-btn-primary  { width: 100% !important; text-align: center !important; box-sizing: border-box !important; display: block !important; }
          .hub-outer         { padding: 0 4px !important; overflow: visible !important; max-height: none !important; }
          .hub-wrapper       { transform: none !important; margin-bottom: 0 !important; padding-top: 8px !important; padding-bottom: 32px !important; }
          .hub-node          { width: 40px !important; height: 40px !important; padding: 8px !important; }
          .stats-grid        { grid-template-columns: repeat(2,1fr) !important; }
          .stat-col          { border-right: none !important; border-left: none !important; border-bottom: 1px solid #1A1D2E !important; padding: 24px 16px !important; }
          .stat-num          { font-size: 36px !important; }
          .section-pad       { padding-top: 60px !important; padding-bottom: 60px !important; padding-left: 20px !important; padding-right: 20px !important; }
          .system-cards      { grid-template-columns: 1fr !important; gap: 12px !important; }
          .benefit-cards     { grid-template-columns: 1fr !important; gap: 12px !important; }
          .platform-cards    { grid-template-columns: 1fr !important; gap: 12px !important; }
          .pricing-cards     { grid-template-columns: 1fr !important; gap: 16px !important; }
          .how-cards         { grid-template-columns: 1fr !important; gap: 12px !important; }
          .testimonial-block { padding: 28px 20px !important; }
          .cta-card          { padding: 44px 24px !important; border-radius: 16px !important; }
          .footer-inner      { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
          .footer-links      { flex-wrap: wrap !important; gap: 14px !important; }
          .simple-stats      { flex-direction: column !important; gap: 16px !important; align-items: flex-start !important; }
        }

        /* Tablet 768px – 1024px */
        @media (min-width: 768px) and (max-width: 1024px) {
          .system-cards      { grid-template-columns: repeat(2,1fr) !important; }
          .benefit-cards     { grid-template-columns: repeat(2,1fr) !important; }
          .platform-cards    { grid-template-columns: repeat(2,1fr) !important; }
          .pricing-cards     { grid-template-columns: repeat(2,1fr) !important; }
          .stats-grid        { grid-template-columns: repeat(2,1fr) !important; }
          .stat-col          { border-right: none !important; border-left: none !important; border-bottom: 1px solid #1A1D2E; }
          .section-pad       { padding-left: 32px !important; padding-right: 32px !important; }
          .cta-card          { padding: 60px 40px !important; }
          .testimonial-block { padding: 36px 36px !important; }
        }

        /* Large desktop ≥ 1440px */
        @media (min-width: 1440px) {
          .hero-headline { font-size: 64px !important; }
          .section-pad   { padding-left: 60px !important; padding-right: 60px !important; }
        }
      `}</style>

      <SiteNav />

      <main style={{ paddingTop: 60 }}>

        {/* ── Hero ───────────────────────────────────────────── */}
        <section className="hero-section" aria-labelledby="hero-heading" style={{ paddingTop: 120, paddingBottom: 60, fontFamily: font }}>
          <div className="hero-inner" style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', border: `1px solid ${T.border}`, borderRadius: 99, padding: '6px 14px', marginBottom: 28, fontSize: 12, color: T.sub }}>
              AI Revenue System · Now booking Q2 deployments
            </div>

            <h1 id="hero-heading" className="hero-headline" style={{ fontSize: 56, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 20px', color: T.text }}>
              Never Miss<br />
              <span style={{ background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Another Lead</span>
            </h1>

            <p className="hero-sub" style={{ fontSize: 18, color: T.sub, lineHeight: 1.7, maxWidth: 580, margin: '0 auto 36px', textAlign: 'center' }}>
              Leads Up converts inbound leads automatically — by phone, text, or email — so service businesses close more deals without hiring more staff.
            </p>

            <div className="hero-btns" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              <a href="#cta" className="hero-btn-primary lp-btn-fade" style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF', background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, padding: '12px 24px', borderRadius: 99, textDecoration: 'none' }}>
                Book a strategy call
              </a>
              <a href="#how-it-works" className="lp-link-inv" style={{ fontSize: 15 }}>
                See how it works
              </a>
            </div>
          </div>

          <div className="hub-outer" style={{ maxWidth: 1000, margin: '56px auto 0', padding: '0 24px' }}>
            <div className="hub-wrapper">
              <IntegrationHub />
            </div>
          </div>
        </section>

        {/* ── Simple stats bar ────────────────────────────── */}
        <section aria-label="Key metrics" style={{ fontFamily: font, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: '28px 40px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }} className="simple-stats">
            {[
              { stat: '< 60s',  label: 'average response time' },
              { stat: '24/7',   label: 'availability' },
              { stat: '100%',   label: 'works with your existing tools' },
            ].map(({ stat, label }) => (
              <div key={stat} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: T.blue, letterSpacing: '-1px' }}>{stat}</div>
                <div style={{ fontSize: 13, color: T.sub, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Benefit features (new SEO section) ──────────── */}
        <section aria-labelledby="benefits-heading" className="section-pad" style={{ padding: '100px 40px', fontFamily: font }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: T.blue, textTransform: 'uppercase', marginBottom: 16 }}>Why Leads Up</div>
            <h2 id="benefits-heading" style={{ fontSize: 'clamp(30px,4vw,48px)', fontWeight: 700, letterSpacing: '-0.02em', color: T.text, marginBottom: 56, lineHeight: 1.12 }}>
              Built for the businesses<br />Google sends leads to.
            </h2>
            <div className="benefit-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              {[
                {
                  title: 'Instant Lead Response',
                  desc: 'Reply to every inquiry in under 60 seconds, 24/7, across phone, SMS, and email.',
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B8AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                },
                {
                  title: 'Revenue Recovery',
                  desc: 'Re-engage lost or cold leads automatically so no opportunity slips through the cracks.',
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B8AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
                },
                {
                  title: 'Built for Service Businesses',
                  desc: 'Works with HVAC, plumbing, cleaning, landscaping, legal, dental, and more.',
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B8AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
                },
              ].map((c, i) => (
                <article key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, padding: '36px 32px' }}>
                  <div style={{ background: '#13162A', border: `1px solid ${T.border}`, borderRadius: 12, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                    {c.icon}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 12, letterSpacing: '-0.01em' }}>{c.title}</h3>
                  <p style={{ fontSize: 15, color: T.sub, lineHeight: 1.7, margin: 0 }}>{c.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ────────────────────────────────── */}
        <section id="how-it-works" aria-labelledby="how-heading" className="section-pad" style={{ padding: '80px 40px', fontFamily: font }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: T.blue, textTransform: 'uppercase', marginBottom: 16 }}>How It Works</div>
            <h2 id="how-heading" style={{ fontSize: 'clamp(30px,4vw,48px)', fontWeight: 700, letterSpacing: '-0.02em', color: T.text, marginBottom: 56, lineHeight: 1.12 }}>
              From inquiry to booked appointment<br />in three steps.
            </h2>
            <div className="how-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              {[
                { step: '1', title: 'A lead comes in', desc: 'From your website, Google, or phone — every inquiry is captured instantly, no matter the channel.' },
                { step: '2', title: 'AI responds instantly', desc: 'Leads Up qualifies, books, or routes them in under 60 seconds — day or night, weekend or holiday.' },
                { step: '3', title: 'You close the deal', desc: 'Focus on the work you love. Your calendar fills with qualified appointments, not cold outreach.' },
              ].map(({ step, title, desc }) => (
                <article key={step} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: '32px 28px', position: 'relative' }}>
                  <div style={{ fontSize: 48, fontWeight: 900, color: `${T.blue}20`, letterSpacing: '-4px', lineHeight: 1, marginBottom: 20, fontFamily: 'monospace' }}>{step}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 12, letterSpacing: '-0.02em' }}>{title}</h3>
                  <p style={{ fontSize: 14, color: T.sub, lineHeight: 1.7, margin: 0 }}>{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── System (pipeline detail) ─────────────────────── */}
        <section id="system" aria-labelledby="system-heading" className="section-pad" style={{ padding: '100px 40px', fontFamily: font }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: T.blue, textTransform: 'uppercase', marginBottom: 16 }}>The System</div>
            <h2 id="system-heading" style={{ fontSize: 'clamp(30px,4vw,48px)', fontWeight: 700, letterSpacing: '-0.02em', color: T.text, marginBottom: 16, lineHeight: 1.12, maxWidth: 640 }}>
              A single revenue layer. Replacing your entire follow-up stack.
            </h2>
            <p style={{ fontSize: 16, color: T.sub, maxWidth: 560, lineHeight: 1.7, marginBottom: 56 }}>
              Leads Up connects to your existing tools and runs your pipeline like a top-performing SDR team — at 1/10th the cost.
            </p>
            <div className="system-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
              {steps.map(s => (
                <article key={s.num} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: '32px 28px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.blue, marginBottom: 40, letterSpacing: '0.05em' }}>{s.num}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 12, letterSpacing: '-0.02em' }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: T.sub, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Platform features ────────────────────────────── */}
        <section id="features" aria-labelledby="platform-heading" className="section-pad" style={{ padding: '100px 40px', fontFamily: font }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: T.blue, textTransform: 'uppercase', marginBottom: 16 }}>Platform</div>
            <h2 id="platform-heading" style={{ fontSize: 'clamp(30px,4vw,48px)', fontWeight: 700, letterSpacing: '-0.02em', color: T.text, marginBottom: 56, lineHeight: 1.12 }}>
              Built like infrastructure.<br />Used like magic.
            </h2>
            <div className="platform-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 48 }}>
              {featureCards.map((c, i) => (
                <article key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: '28px 28px 32px' }}>
                  <div style={{ background: '#13162A', border: `1px solid ${T.border}`, borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    {c.icon}
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: T.text, marginBottom: 10, letterSpacing: '-0.02em' }}>{c.title}</h3>
                  <p style={{ fontSize: 14, color: T.sub, lineHeight: 1.7, margin: 0 }}>{c.desc}</p>
                </article>
              ))}
            </div>

            <article className="testimonial-block" aria-label="Customer testimonial" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, padding: '48px 56px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${T.blue}, ${T.purple})` }} />
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: T.blue, textTransform: 'uppercase', marginBottom: 24 }}>Customer Story</div>
              <blockquote style={{ fontSize: 'clamp(16px,2vw,22px)', fontWeight: 500, color: T.text, lineHeight: 1.6, margin: 0, maxWidth: 800, letterSpacing: '-0.01em' }}>
                "We replaced two SDRs and a follow-up agency with LeadsUp. Booked calls went up 312% in the first 60 days — and our team finally stopped chasing cold leads."
              </blockquote>
              <footer style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0 }} aria-hidden="true">MR</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Marcus Reyes</div>
                  <div style={{ fontSize: 13, color: T.sub, marginTop: 2 }}>VP Revenue, Northwind Capital</div>
                </div>
              </footer>
            </article>
          </div>
        </section>

        {/* ── Metrics bar ──────────────────────────────────── */}
        <section aria-label="Performance metrics" style={{ fontFamily: font }}>
          <div style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: '32px 0' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.15em', color: T.sub, textAlign: 'center', marginBottom: 20 }}>TRUSTED BY REVENUE TEAMS AT</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, flexWrap: 'wrap', padding: '0 24px' }}>
              {['NORTHWIND', 'ACME', 'LINEAR', 'LY', 'QUANTUM', 'PARALLAX', 'VERTEX'].map(b => (
                <span key={b} style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', color: '#3A4060' }}>{b}</span>
              ))}
            </div>
          </div>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
              {[
                { num: '3.4x',   label: 'More booked calls',  sub: 'vs. manual follow-up' },
                { num: '<60s',   label: 'Lead response time',  sub: '24/7, every channel'  },
                { num: '92%',    label: 'Reply rate lift',     sub: 'AI-personalized'       },
                { num: '$1.2M+', label: 'Pipeline generated',  sub: 'in last 90 days'      },
              ].map((m, i) => (
                <div key={m.num} className="stat-col" style={{ padding: '48px 40px', textAlign: 'center', borderRight: i < 3 ? `1px solid ${T.border}` : 'none', borderLeft: i === 0 ? `1px solid ${T.border}` : 'none' }}>
                  <div className="stat-num" style={{ fontSize: 52, fontWeight: 700, color: T.blue, letterSpacing: '-2px', lineHeight: 1 }}>{m.num}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: T.text, marginTop: 10 }}>{m.label}</div>
                  <div style={{ fontSize: 13, color: T.sub, marginTop: 4 }}>{m.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ──────────────────────────────────────── */}
        <section id="pricing" aria-labelledby="pricing-heading" className="section-pad" style={{ padding: '100px 40px', fontFamily: font }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: T.blue, textTransform: 'uppercase', marginBottom: 16 }}>Pricing</div>
            <h2 id="pricing-heading" style={{ fontSize: 'clamp(30px,4vw,48px)', fontWeight: 700, letterSpacing: '-0.02em', color: T.text, marginBottom: 56, lineHeight: 1.12 }}>
              Priced like a system.<br />Pays for itself in week one.
            </h2>
            <div className="pricing-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, alignItems: 'start' }}>
              {plans.map(p => (
                <article key={p.name} style={{ background: p.highlight ? 'linear-gradient(135deg, #0D1035, #0F1220)' : T.surface, border: p.highlight ? `1px solid ${T.blue}40` : `1px solid ${T.border}`, borderRadius: 20, padding: '36px 32px', position: 'relative', overflow: 'hidden', boxShadow: p.highlight ? `0 0 60px -20px ${T.blue}30` : 'none' }}>
                  {p.highlight && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${T.blue}, ${T.purple})` }} />}
                  {p.badge && (
                    <div style={{ display: 'inline-flex', fontSize: 11, fontWeight: 700, color: T.blue, background: `${T.blue}15`, border: `1px solid ${T.blue}30`, borderRadius: 99, padding: '4px 10px', marginBottom: 20, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {p.badge}
                    </div>
                  )}
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: T.text, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>{p.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
                    <span style={{ fontSize: 42, fontWeight: 700, color: T.text, letterSpacing: '-2px' }}>{p.price}</span>
                    {p.period && <span style={{ fontSize: 15, color: T.sub }}>{p.period}</span>}
                  </div>
                  <p style={{ fontSize: 14, color: T.sub, lineHeight: 1.6, marginBottom: 28, borderBottom: `1px solid ${T.border}`, paddingBottom: 28 }}>{p.tagline}</p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32, listStyle: 'none', padding: 0, margin: '0 0 32px' }}>
                    {p.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: T.sub }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><polyline points="20 6 9 17 4 12" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={p.href} className="lp-btn-fade" style={{ display: 'block', textAlign: 'center', padding: '13px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: 'none', background: p.highlight ? `linear-gradient(135deg, ${T.blue}, ${T.purple})` : 'transparent', color: p.highlight ? '#fff' : T.text, border: p.highlight ? 'none' : `1px solid ${T.border}` }}>
                    {p.cta}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section id="faq" aria-labelledby="faq-heading" className="section-pad" style={{ padding: '100px 40px', fontFamily: font }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: T.blue, textTransform: 'uppercase', marginBottom: 16 }}>FAQ</div>
            <h2 id="faq-heading" style={{ fontSize: 'clamp(30px,4vw,48px)', fontWeight: 700, letterSpacing: '-0.02em', color: T.text, marginBottom: 48, lineHeight: 1.12 }}>
              Questions, answered.
            </h2>
            <FAQAccordion />
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section id="cta" aria-labelledby="cta-heading" className="section-pad" style={{ padding: '100px 40px', fontFamily: font }}>
          <div className="cta-card" style={{ maxWidth: 860, margin: '0 auto', background: 'linear-gradient(135deg, #0D0F24, #13162A)', border: `1px solid ${T.border}`, borderRadius: 24, padding: '80px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${T.blue}, ${T.purple})` }} />
            <h2 id="cta-heading" style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, letterSpacing: '-0.02em', color: T.text, lineHeight: 1.1, margin: 0 }}>
              Stop losing leads.
            </h2>
            <p style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 20px', background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Start compounding revenue.
            </p>
            <p style={{ fontSize: 18, color: T.sub, lineHeight: 1.7, maxWidth: 520, margin: '0 auto 40px' }}>
              See exactly how Leads Up would convert your pipeline. 30 minutes, no pitch.
            </p>
            <a href="https://cal.com/leads-up" target="_blank" rel="noopener noreferrer" className="lp-btn-fade"
              style={{ display: 'inline-block', fontSize: 16, fontWeight: 600, color: '#FFFFFF', background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, padding: '14px 32px', borderRadius: 99, textDecoration: 'none' }}>
              Book your strategy call
            </a>
            <p style={{ fontSize: 13, color: T.sub, marginTop: 16 }}>No credit card · No commitment · Real revenue audit</p>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  )
}
