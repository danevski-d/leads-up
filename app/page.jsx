import dynamic from 'next/dynamic'
import Link from 'next/link'
import SiteNav from './_components/SiteNav'
import ChatWidget from '../src/components/ChatWidget'
import SiteFooter from './_components/SiteFooter'
import BackgroundGradient from '@/components/ui/background-gradient'
import { T, font } from './_components/constants'

const IntegrationHub = dynamic(() => import('./_components/IntegrationHub'), { ssr: false })
const GetStartedClient = dynamic(() => import('./_components/GetStartedClient'), { ssr: false })
const OpenFormButton = dynamic(() => import('./_components/OpenFormButton'), { ssr: false })

export async function generateMetadata() {
  return {
    title: 'Leads Up — AI Lead Conversion for B2B & Service Businesses',
    description: 'AI-powered inbound lead conversion. Respond to every lead in under 60 seconds, qualify automatically, and book calls while you sleep.',
    metadataBase: new URL('https://useleadsup.com'),
    openGraph: {
      type: 'website',
      url: 'https://useleadsup.com/',
      title: 'Leads Up — AI Lead Conversion for B2B & Service Businesses',
      description: 'AI-powered inbound lead conversion. Respond to every lead in under 60 seconds, qualify automatically, and book calls while you sleep.',
      images: [{ url: '/og-image.png', width: 500, height: 500 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Leads Up — AI Lead Conversion for B2B & Service Businesses',
      description: 'AI-powered inbound lead conversion. Respond in under 60 seconds, qualify automatically, book calls while you sleep.',
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
    title: 'Connects to your stack',
    desc: 'Plugs into your existing CRM, calendar, and outreach tools. No rip-and-replace — Leads Up sits on top of what you already use.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B8AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  },
  {
    title: 'Trained on your business',
    desc: 'Voice, tone, objections, edge cases — your AI agent is configured on your offer before going live. It sounds like you, not a bot.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B8AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  },
  {
    title: 'Live in 48 hours',
    desc: 'No long onboarding. We configure, connect, and deploy your AI revenue system in two business days — then you watch the pipeline fill.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B8AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  },
]

const plans = [
  {
    name: 'Growth', price: '$2,400', period: '/mo',
    tagline: 'For B2B teams and agencies ready to systematize inbound.',
    features: ['AI follow-up across SMS + email', 'Up to 1,500 leads/month', 'Calendar + CRM integration', 'Standard support'],
    cta: 'Start with Growth', href: '/login?mode=signup', highlight: false,
  },
  {
    name: 'Scale', price: '$4,900', period: '/mo',
    tagline: 'Full revenue infrastructure for agencies and operators scaling fast.',
    features: ['Everything in Growth', 'Unlimited leads', 'Custom AI training on your offer', 'Dedicated revenue strategist', 'Priority + Slack support'],
    cta: 'Book a strategy call', href: '#cta', highlight: true, badge: 'Most Popular',
  },
  {
    name: 'Enterprise', price: 'Custom', period: '',
    tagline: 'For multi-brand operators and high-volume sales organizations.',
    features: ['Custom integrations', 'Dedicated infrastructure', 'White-glove onboarding', 'Quarterly business reviews'],
    cta: 'Talk to sales', href: '#cta', highlight: false,
  },
]

export default function Page() {
  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: font,
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
      backgroundSize: '60px 60px',
      position: 'relative',
    }}>
      <BackgroundGradient />

      <style>{`
        /* ── Hover utilities ── */
        .lp-nav-link       { color: #94A3B8; text-decoration: none; transition: color 0.15s; font-family: ${font}; }
        .lp-nav-link:hover { color: #FFFFFF; }
        .lp-btn-fade       { transition: opacity 0.15s; }
        .lp-btn-fade:hover { opacity: 0.85 !important; }
        .lp-link-inv       { color: #FFFFFF; text-decoration: none; transition: color 0.15s; }
        .lp-link-inv:hover { color: #94A3B8; }
        .lp-footer-link    { color: #94A3B8; text-decoration: none; transition: color 0.15s; }
        .lp-footer-link:hover { color: #FFFFFF; }

        /* ── Card hover lift ── */
        .lp-card-hover { transition: border-color 0.2s, transform 0.2s; }
        .lp-card-hover:hover { border-color: #2A2D40 !important; transform: translateY(-2px); }

        /* ── Burger ── */
        .nav-burger { display: none; }

        /* ── Base section padding ── */
        .section-pad {
          padding-top: 100px;
          padding-bottom: 100px;
          padding-left: 24px;
          padding-right: 24px;
        }

        /* ── Mobile ≤ 767px ── */
        @media (max-width: 767px) {
          .nav-burger         { display: flex !important; }

          .hero-section       { padding-top: 72px !important; padding-bottom: 16px !important; }
          .hero-inner         { padding: 0 20px !important; }
          .hero-badge         { font-size: 11px !important; padding: 5px 12px !important; }
          .hero-headline      { font-size: 32px !important; line-height: 1.15 !important; white-space: normal !important; }
          .hero-sub           { font-size: 15px !important; margin-bottom: 28px !important; }
          .hero-btns          { flex-direction: column !important; width: 100% !important; gap: 12px !important; padding: 0 !important; }
          .hero-btn-primary   { width: 100% !important; text-align: center !important; box-sizing: border-box !important; display: block !important; padding: 14px 20px !important; }
          .hero-link-secondary{ width: 100% !important; text-align: center !important; }

          .hub-outer          { padding: 0 8px !important; overflow: hidden !important; }
          .hub-wrapper        { transform: none !important; margin-bottom: 0 !important; padding-top: 12px !important; padding-bottom: 24px !important; }
          .hub-node           { width: 40px !important; height: 40px !important; padding: 8px !important; }

          .stats-bar          { padding: 24px 20px !important; gap: 0 !important; }
          .stat-item          { padding: 16px 12px !important; border-right: none !important; border-bottom: 1px solid #1A1D2E !important; }
          .stat-item:last-child { border-bottom: none !important; }
          .stat-num-sm        { font-size: 22px !important; }

          .section-pad        { padding-top: 60px !important; padding-bottom: 60px !important; padding-left: 20px !important; padding-right: 20px !important; }

          .benefit-cards      { grid-template-columns: 1fr !important; gap: 12px !important; }
          .how-cards          { grid-template-columns: 1fr !important; gap: 12px !important; }
          .system-cards       { grid-template-columns: 1fr !important; gap: 12px !important; }
          .platform-cards     { grid-template-columns: 1fr !important; gap: 12px !important; }
          .pricing-cards      { grid-template-columns: 1fr !important; gap: 16px !important; }

          .stats-grid         { grid-template-columns: repeat(2,1fr) !important; }
          .stat-col           { padding: 28px 16px !important; border-right: none !important; border-bottom: 1px solid #1A1D2E !important; }
          .stat-col:nth-child(odd) { border-right: 1px solid #1A1D2E !important; }
          .stat-col:nth-last-child(-n+2) { border-bottom: none !important; }
          .stat-num           { font-size: 38px !important; }

          .testimonial-block  { padding: 28px 20px !important; }
          .cta-card           { padding: 44px 20px !important; border-radius: 16px !important; }
          .cta-headline       { font-size: 30px !important; }
          .cta-sub            { font-size: 15px !important; }

          .section-label      { font-size: 10px !important; }
          .section-heading    { font-size: 22px !important; line-height: 1.25 !important; white-space: normal !important; }

          .logos-bar          { padding: 16px 20px !important; }
          .logo-pill          { font-size: 10px !important; padding: 4px 10px !important; }

          .footer-inner       { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
          .footer-links       { flex-wrap: wrap !important; gap: 14px !important; }

          .early-access-grid  { grid-template-columns: 1fr !important; gap: 12px !important; }
        }

        /* ── Tablet 768–1024px ── */
        @media (min-width: 768px) and (max-width: 1024px) {
          .hero-headline      { font-size: 44px !important; }
          .section-pad        { padding-left: 32px !important; padding-right: 32px !important; }
          .benefit-cards      { grid-template-columns: repeat(2,1fr) !important; }
          .how-cards          { grid-template-columns: repeat(2,1fr) !important; }
          .system-cards       { grid-template-columns: repeat(2,1fr) !important; }
          .platform-cards     { grid-template-columns: repeat(2,1fr) !important; }
          .pricing-cards      { grid-template-columns: repeat(2,1fr) !important; }
          .stats-grid         { grid-template-columns: repeat(2,1fr) !important; }
          .stat-col           { border-right: none !important; border-bottom: 1px solid #1A1D2E !important; }
          .stat-col:nth-child(odd) { border-right: 1px solid #1A1D2E !important; }
          .cta-card           { padding: 60px 40px !important; }
          .early-access-grid  { grid-template-columns: repeat(2,1fr) !important; }
        }

        /* ── Large desktop ≥ 1440px ── */
        @media (min-width: 1440px) {
          .hero-headline { font-size: 68px !important; }
          .section-pad   { padding-left: 60px !important; padding-right: 60px !important; }
        }

        /* ── FAQ accordion ── */
        details { border-bottom: 1px solid #1A1D2E; }
        details summary {
          display: flex; justify-content: space-between; align-items: center;
          padding: 22px 0; cursor: pointer; font-size: 16px; font-weight: 500;
          color: #FFFFFF; list-style: none; gap: 16px;
        }
        details summary::-webkit-details-marker { display: none; }
        details summary::marker { content: ''; display: none; }
        details summary::after {
          content: '+'; font-size: 20px; font-weight: 300; color: #94A3B8;
          flex-shrink: 0; transition: transform 0.2s;
        }
        details[open] summary::after { transform: rotate(45deg); }
        details p { font-size: 15px; color: #94A3B8; line-height: 1.75; padding-bottom: 22px; margin: 0; }

        @media (max-width: 767px) {
          details summary { font-size: 14px !important; padding: 18px 0 !important; }
          details p { font-size: 14px !important; }
        }
      `}</style>

      <SiteNav />

      <main style={{ paddingTop: 60 }} className="pb-20 sm:pb-0">

        {/* ── Hero ── */}
        <section className="hero-section" aria-labelledby="hero-heading"
          style={{ paddingTop: 80, paddingBottom: 20, fontFamily: font }}>
          <div className="hero-inner" style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>

            <div className="hero-badge" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              border: `1px solid ${T.border}`, borderRadius: 99,
              padding: '6px 14px', marginBottom: 20, fontSize: 12, color: T.sub,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', display: 'inline-block', flexShrink: 0 }} />
              AI Revenue System · Now accepting new clients
            </div>

            <h1 id="hero-heading" className="hero-headline" style={{
              fontSize: 44, fontWeight: 700, letterSpacing: '-0.025em',
              lineHeight: 1.08, margin: '0 0 18px', color: T.text, whiteSpace: 'nowrap',
            }}>
              Never Miss<br />
              <span style={{
                background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Another Lead</span>
            </h1>

            <p className="hero-sub" style={{
              fontSize: 18, color: T.sub, lineHeight: 1.7,
              maxWidth: 560, margin: '0 auto 24px', textAlign: 'center',
            }}>
              AI-powered lead conversion for B2B teams and service agencies. Respond, qualify, and book — automatically.
            </p>

            <div className="hero-btns" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 16, flexWrap: 'wrap',
            }}>
              <OpenFormButton
                className="hero-btn-primary lp-btn-fade"
                style={{
                  fontSize: 15, fontWeight: 600, color: '#FFFFFF',
                  background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`,
                  padding: '13px 26px', borderRadius: 99, border: 'none', cursor: 'pointer',
                }}>
                Get started →
              </OpenFormButton>
              <a href="#how-it-works" className="lp-link-inv hero-link-secondary" style={{ fontSize: 15 }}>
                See how it works
              </a>
            </div>
          </div>

          <div className="hub-outer" style={{ maxWidth: 860, margin: '28px auto 0', padding: '0 24px' }}>
            <div className="hub-wrapper">
              <IntegrationHub />
            </div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section aria-label="Key metrics" style={{ fontFamily: font, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
          <div className="stats-bar" style={{
            maxWidth: 860, margin: '0 auto',
            display: 'flex', alignItems: 'stretch',
            padding: '0 24px',
          }}>
            {[
              { stat: '43s',  label: 'Average response time' },
              { stat: '24/7', label: 'Always on, every channel' },
              { stat: '48h',  label: 'Live in two business days' },
            ].map(({ stat, label }, i) => (
              <div key={stat} className="stat-item" style={{
                flex: 1, textAlign: 'center', padding: '28px 16px',
                borderRight: i < 2 ? `1px solid ${T.border}` : 'none',
              }}>
                <div className="stat-num-sm" style={{ fontSize: 26, fontWeight: 800, color: T.blue, letterSpacing: '-1px' }}>{stat}</div>
                <div style={{ fontSize: 12, color: T.sub, marginTop: 5, lineHeight: 1.4 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Integrations logos ── */}
        <div className="logos-bar" style={{ padding: '24px 24px', fontFamily: font }}>
          <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>
              Works with your existing stack
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
              {['HubSpot', 'Google Calendar', 'GoHighLevel', 'Calendly', 'Slack', 'Gmail', 'n8n'].map(name => (
                <span key={name} className="logo-pill" style={{
                  border: `1px solid ${T.border}`, borderRadius: 99,
                  padding: '5px 14px', fontSize: 12, color: '#4B5563',
                  background: 'rgba(255,255,255,0.02)',
                }}>
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Why Leads Up ── */}
        <section aria-labelledby="benefits-heading" className="section-pad" style={{ fontFamily: font }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div className="section-label" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: T.blue, textTransform: 'uppercase', marginBottom: 16 }}>Why Leads Up</div>
            <h2 id="benefits-heading" className="section-heading" style={{ fontSize: 'clamp(22px,3vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', color: T.text, marginBottom: 52, lineHeight: 1.15 }}>
              Built for the businesses Google sends leads to.
            </h2>
            <div className="benefit-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              {[
                {
                  title: 'Instant Lead Response',
                  desc: 'Reply to every inquiry in under 60 seconds, 24/7, across phone, SMS, and email. Speed wins the deal.',
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B8AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                },
                {
                  title: 'Automated Qualification',
                  desc: 'AI agents run multi-turn conversations to qualify budget, timeline, and intent — so your team only speaks to real buyers.',
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B8AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
                },
                {
                  title: 'Built for B2B & Agencies',
                  desc: 'Designed for service businesses, agencies, and B2B teams that get inbound leads but lose them to slow follow-up.',
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B8AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
                },
              ].map((c, i) => (
                <article key={i} className="lp-card-hover" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, padding: '32px 28px' }}>
                  <div style={{ background: '#13162A', border: `1px solid ${T.border}`, borderRadius: 12, width: 46, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
                    {c.icon}
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: T.text, marginBottom: 10, letterSpacing: '-0.01em' }}>{c.title}</h3>
                  <p style={{ fontSize: 14, color: T.sub, lineHeight: 1.75, margin: 0 }}>{c.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how-it-works" aria-labelledby="how-heading" className="section-pad" style={{ fontFamily: font, paddingTop: 80, paddingBottom: 80 }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div className="section-label" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: T.blue, textTransform: 'uppercase', marginBottom: 16 }}>How It Works</div>
            <h2 id="how-heading" className="section-heading" style={{ fontSize: 'clamp(22px,3vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', color: T.text, marginBottom: 52, lineHeight: 1.15 }}>
              From inquiry to booked call in three steps.
            </h2>
            <div className="how-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              {[
                { step: '1', title: 'A lead comes in', desc: 'From your website, Google, or a referral — every inquiry is captured instantly, no matter the channel or time of day.' },
                { step: '2', title: 'AI responds instantly', desc: 'Leads Up qualifies, books, or routes the lead in under 60 seconds — day or night, weekend or holiday, no human needed.' },
                { step: '3', title: 'You close the deal', desc: 'Your calendar fills with qualified calls. You focus on closing, not chasing. The system handles everything before the conversation.' },
              ].map(({ step, title, desc }) => (
                <article key={step} className="lp-card-hover" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: '32px 28px', position: 'relative' }}>
                  <div style={{ fontSize: 52, fontWeight: 900, color: `${T.blue}18`, letterSpacing: '-4px', lineHeight: 1, marginBottom: 20, fontFamily: 'monospace' }}>{step}</div>
                  <h3 style={{ fontSize: 19, fontWeight: 700, color: T.text, marginBottom: 10, letterSpacing: '-0.02em' }}>{title}</h3>
                  <p style={{ fontSize: 14, color: T.sub, lineHeight: 1.75, margin: 0 }}>{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── The System ── */}
        <section id="system" aria-labelledby="system-heading" className="section-pad" style={{ fontFamily: font }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div className="section-label" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: T.blue, textTransform: 'uppercase', marginBottom: 16 }}>The System</div>
            <h2 id="system-heading" className="section-heading" style={{ fontSize: 'clamp(22px,3vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', color: T.text, marginBottom: 16, lineHeight: 1.15 }}>
              A single revenue layer. Replacing your entire follow-up stack.
            </h2>
            <p style={{ fontSize: 16, color: T.sub, maxWidth: 540, lineHeight: 1.7, marginBottom: 52 }}>
              Leads Up connects to your existing tools and runs your pipeline like a full SDR team — at a fraction of the cost.
            </p>
            <div className="system-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
              {steps.map(s => (
                <article key={s.num} className="lp-card-hover" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: '28px 24px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.blue, marginBottom: 36, letterSpacing: '0.06em' }}>{s.num}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 10, letterSpacing: '-0.02em' }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: T.sub, lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Platform features ── */}
        <section id="features" aria-labelledby="platform-heading" className="section-pad" style={{ fontFamily: font }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div className="section-label" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: T.blue, textTransform: 'uppercase', marginBottom: 16 }}>Platform</div>
            <h2 id="platform-heading" className="section-heading" style={{ fontSize: 'clamp(22px,3vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', color: T.text, marginBottom: 52, lineHeight: 1.15 }}>
              Built like infrastructure. Used like magic.
            </h2>
            <div className="platform-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 48 }}>
              {featureCards.map((c, i) => (
                <article key={i} className="lp-card-hover" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: '26px 26px 30px' }}>
                  <div style={{ background: '#13162A', border: `1px solid ${T.border}`, borderRadius: 12, width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                    {c.icon}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 8, letterSpacing: '-0.01em' }}>{c.title}</h3>
                  <p style={{ fontSize: 14, color: T.sub, lineHeight: 1.75, margin: 0 }}>{c.desc}</p>
                </article>
              ))}
            </div>

            {/* ── Early access block (replaces fake testimonial) ── */}
            <article style={{
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 20, padding: '48px 52px',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${T.blue}, ${T.purple})` }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}
                className="early-access-grid">
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: T.blue, textTransform: 'uppercase', marginBottom: 20 }}>Early Access</div>
                  <h3 style={{ fontSize: 'clamp(22px,2.5vw,32px)', fontWeight: 700, color: T.text, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 16 }}>
                    Be among the first businesses running AI on their pipeline.
                  </h3>
                  <p style={{ fontSize: 15, color: T.sub, lineHeight: 1.7, margin: '0 0 28px' }}>
                    Leads Up is in active deployment. We work with a small number of clients at a time to ensure the system is configured, tested, and delivering results before we scale.
                  </p>
                  <OpenFormButton className="lp-btn-fade" style={{
                    display: 'inline-block', fontSize: 14, fontWeight: 600, color: '#FFFFFF',
                    background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`,
                    padding: '12px 24px', borderRadius: 99, border: 'none', cursor: 'pointer',
                  }}>
                    Request early access →
                  </OpenFormButton>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { label: 'Setup time', value: '48 hours' },
                    { label: 'Avg response time', value: '43 seconds' },
                    { label: 'Channels covered', value: 'Phone · SMS · Email · Chat' },
                    { label: 'Spots available', value: 'Limited — Q3 2026' },
                  ].map(({ label, value }) => (
                    <div key={label} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '14px 18px', borderRadius: 12,
                      background: 'rgba(107,138,255,0.04)', border: `1px solid ${T.border}`,
                    }}>
                      <span style={{ fontSize: 13, color: T.sub }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ── Metrics bar ── */}
        <section aria-label="Performance metrics" style={{ fontFamily: font }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
              {[
                { num: '43s',   label: 'Avg response time',    sub: 'Every lead, every channel' },
                { num: '24/7',  label: 'System availability',  sub: 'No holidays, no sick days'  },
                { num: '48h',   label: 'Deployment time',      sub: 'From signup to live'        },
                { num: '100%',  label: 'Leads captured',       sub: 'Nothing slips through'      },
              ].map((m, i) => (
                <div key={m.num} className="stat-col" style={{
                  padding: '44px 32px', textAlign: 'center',
                  borderRight: i < 3 ? `1px solid ${T.border}` : 'none',
                }}>
                  <div className="stat-num" style={{ fontSize: 48, fontWeight: 700, color: T.blue, letterSpacing: '-2px', lineHeight: 1 }}>{m.num}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginTop: 10 }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: T.sub, marginTop: 4 }}>{m.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" aria-labelledby="pricing-heading" className="section-pad" style={{ fontFamily: font }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div className="section-label" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: T.blue, textTransform: 'uppercase', marginBottom: 16 }}>Pricing</div>
            <h2 id="pricing-heading" className="section-heading" style={{ fontSize: 'clamp(22px,3vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', color: T.text, marginBottom: 52, lineHeight: 1.15 }}>
              Priced like a system. Pays for itself in week one.
            </h2>
            <div className="pricing-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, alignItems: 'start' }}>
              {plans.map(p => (
                <article key={p.name} style={{
                  background: p.highlight ? 'linear-gradient(135deg, #0D1035, #0F1220)' : T.surface,
                  border: p.highlight ? `1px solid ${T.blue}40` : `1px solid ${T.border}`,
                  borderRadius: 20, padding: '32px 28px',
                  position: 'relative', overflow: 'hidden',
                  boxShadow: p.highlight ? `0 0 60px -20px ${T.blue}25` : 'none',
                }}>
                  {p.highlight && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${T.blue}, ${T.purple})` }} />}
                  {p.badge && (
                    <div style={{
                      display: 'inline-flex', fontSize: 10, fontWeight: 700, color: T.blue,
                      background: `${T.blue}12`, border: `1px solid ${T.blue}28`,
                      borderRadius: 99, padding: '4px 10px', marginBottom: 18,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                    }}>
                      {p.badge}
                    </div>
                  )}
                  <h3 style={{ fontSize: 12, fontWeight: 700, color: T.text, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>{p.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 10 }}>
                    <span style={{ fontSize: 40, fontWeight: 700, color: T.text, letterSpacing: '-2px' }}>{p.price}</span>
                    {p.period && <span style={{ fontSize: 14, color: T.sub }}>{p.period}</span>}
                  </div>
                  <p style={{ fontSize: 13, color: T.sub, lineHeight: 1.6, marginBottom: 24, borderBottom: `1px solid ${T.border}`, paddingBottom: 24 }}>{p.tagline}</p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28, listStyle: 'none', padding: 0 }}>
                    {p.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: T.sub }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><polyline points="20 6 9 17 4 12" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={p.href} className="lp-btn-fade" style={{
                    display: 'block', textAlign: 'center', padding: '12px 20px',
                    borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: 'none',
                    background: p.highlight ? `linear-gradient(135deg, ${T.blue}, ${T.purple})` : 'transparent',
                    color: p.highlight ? '#fff' : T.text,
                    border: p.highlight ? 'none' : `1px solid ${T.border}`,
                  }}>
                    {p.cta}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" aria-labelledby="faq-heading" className="section-pad" style={{ fontFamily: font }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div className="section-label" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: T.blue, textTransform: 'uppercase', marginBottom: 16 }}>FAQ</div>
            <h2 id="faq-heading" className="section-heading" style={{ fontSize: 'clamp(22px,3vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', color: T.text, marginBottom: 44, lineHeight: 1.15 }}>
              Questions, answered.
            </h2>
            <details>
              <summary>What exactly does Leads Up do?</summary>
              <p>Leads Up is an AI-powered lead conversion system. When a potential customer reaches out — by phone, text, web form, or email — Leads Up responds instantly, qualifies the lead, and either books a call or routes them to your team. It works 24/7 so you never miss an opportunity.</p>
            </details>
            <details>
              <summary>How is this different from a marketing agency?</summary>
              <p>A marketing agency brings leads to your door. Leads Up makes sure those leads actually turn into paying customers. We do not run ads — we convert the leads you are already getting but losing to slow response times or missed follow-up.</p>
            </details>
            <details>
              <summary>How fast can we go live?</summary>
              <p>Most clients are fully live within 48 hours. We handle the configuration, connect your existing tools, and train the AI on your business before deploying.</p>
            </details>
            <details>
              <summary>What tools do you integrate with?</summary>
              <p>Leads Up connects with Google Calendar, HubSpot, GoHighLevel, Slack, Gmail, Calendly, and more via n8n automation. If you use a CRM or scheduling tool, we can almost certainly connect to it.</p>
            </details>
            <details>
              <summary>Is my data secure?</summary>
              <p>Yes. All data is encrypted in transit and at rest. Each client's data is fully isolated — your leads are never shared or accessible to other accounts.</p>
            </details>
            <details>
              <summary>Will the AI sound like our brand?</summary>
              <p>Yes. Before going live we configure the AI on your tone, your offer, and common objections. You review everything and can request changes at any time from your dashboard.</p>
            </details>
            <details>
              <summary>Do you offer a guarantee?</summary>
              <p>Yes. If you do not see measurable improvement in lead response rate within the first 30 days, we will work with you for free until you do.</p>
            </details>
          </div>
        </section>

        {/* ── CTA ── */}
        <section id="cta" aria-labelledby="cta-heading" className="section-pad" style={{ fontFamily: font }}>
          <div className="cta-card" style={{
            maxWidth: 860, margin: '0 auto',
            background: 'linear-gradient(135deg, #0D0F24, #13162A)',
            border: `1px solid ${T.border}`,
            borderRadius: 24, padding: '80px 60px',
            textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${T.blue}, ${T.purple})` }} />
            <h2 id="cta-heading" className="cta-headline" style={{ fontSize: 'clamp(28px,5vw,50px)', fontWeight: 700, letterSpacing: '-0.025em', color: T.text, lineHeight: 1.1, margin: 0 }}>
              Stop losing leads.
            </h2>
            <p style={{ fontSize: 'clamp(28px,5vw,50px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 20px', background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Start compounding revenue.
            </p>
            <p className="cta-sub" style={{ fontSize: 17, color: T.sub, lineHeight: 1.7, maxWidth: 500, margin: '0 auto 36px' }}>
              See exactly how Leads Up would convert your pipeline. 30 minutes, no pitch, real audit.
            </p>
            <OpenFormButton className="lp-btn-fade" style={{
              display: 'inline-block', fontSize: 16, fontWeight: 600, color: '#FFFFFF',
              background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`,
              padding: '14px 32px', borderRadius: 99, border: 'none', cursor: 'pointer',
            }}>
              Book your strategy call
            </OpenFormButton>
            <p style={{ fontSize: 12, color: '#4B5563', marginTop: 16 }}>No credit card · No commitment · Real revenue audit</p>
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Leads Up",
              "description": "AI-powered inbound lead conversion for B2B and service businesses",
              "applicationCategory": "BusinessApplication",
              "url": "https://useleadsup.com",
              "offers": { "@type": "Offer", "availability": "https://schema.org/InStock" }
            })
          }}
        />
      </main>

      <SiteFooter />
      <ChatWidget />
      <GetStartedClient />
    </div>
  )
}