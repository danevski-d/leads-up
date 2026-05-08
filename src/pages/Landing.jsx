import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Zap, Sparkles, Calendar, TrendingUp, Plug, Clock,
  ChevronDown, ChevronUp, Star, ArrowRight, Check, Menu, X
} from 'lucide-react'

/* ── Design tokens ───────────────────────────────────────────── */
const T = {
  bg:        '#FAFAFA',
  white:     '#FFFFFF',
  border:    '#E8E8E8',
  text:      '#0A0A0A',
  sub:       '#6B6B6B',
  muted:     '#9B9B9B',
  blue:      '#2563EB',
  blueHover: '#1D4ED8',
  blueLight: '#EFF6FF',
}

const font = "system-ui,-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif"

/* ── Navbar ──────────────────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: T.white,
      borderBottom: `1px solid ${T.border}`,
      fontFamily: font,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/leadsup-icon.png" alt="" style={{ height: 32, objectFit: 'contain', mixBlendMode: 'multiply' }} />
          <img src="/leadsup-text.png" alt="Leads Up" style={{ height: 22, objectFit: 'contain', mixBlendMode: 'multiply' }} />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {[['#features','Features'],['#how-it-works','How it works'],['#pricing','Pricing'],['#faq','FAQ']].map(([h,l]) => (
            <a key={h} href={h} style={{ fontSize: 14, color: T.sub, textDecoration: 'none', fontFamily: font, transition: 'color 0.15s' }}
              onMouseOver={e => e.currentTarget.style.color = T.text}
              onMouseOut={e => e.currentTarget.style.color = T.sub}>{l}</a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" style={{ fontSize: 14, color: T.sub, textDecoration: 'none', fontFamily: font, transition: 'color 0.15s' }}
            onMouseOver={e => e.currentTarget.style.color = T.text}
            onMouseOut={e => e.currentTarget.style.color = T.sub}>
            Sign in
          </Link>
          <a href="https://cal.com/leads-up" target="_blank" rel="noopener noreferrer" style={{
            fontSize: 14, fontWeight: 600, color: T.white, background: T.blue,
            padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontFamily: font,
            transition: 'background 0.15s',
          }}
            onMouseOver={e => e.currentTarget.style.background = T.blueHover}
            onMouseOut={e => e.currentTarget.style.background = T.blue}>
            Book a demo
          </a>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden" onClick={() => setOpen(!open)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.text, padding: 8, minWidth: 44, minHeight: 44 }}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: T.white, borderTop: `1px solid ${T.border}`, padding: '16px 24px 20px' }}>
          {[['#features','Features'],['#how-it-works','How it works'],['#pricing','Pricing'],['#faq','FAQ']].map(([h,l]) => (
            <a key={h} href={h} onClick={() => setOpen(false)}
              style={{ display: 'block', padding: '10px 0', fontSize: 15, color: T.sub, textDecoration: 'none', borderBottom: `1px solid ${T.border}`, fontFamily: font }}>
              {l}
            </a>
          ))}
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link to="/login" onClick={() => setOpen(false)}
              style={{ textAlign: 'center', padding: '10px 0', fontSize: 14, color: T.sub, textDecoration: 'none', fontFamily: font }}>
              Sign in
            </Link>
            <a href="https://cal.com/leads-up" target="_blank" rel="noopener noreferrer"
              style={{ textAlign: 'center', padding: '12px 0', fontSize: 14, fontWeight: 600, color: T.white, background: T.blue, borderRadius: 8, textDecoration: 'none', fontFamily: font }}>
              Book a demo
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

/* ── Hero ────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section style={{ background: T.white, padding: '120px 24px 100px', fontFamily: font }}>
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: T.blueLight, color: T.blue, fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 999, marginBottom: 28 }}>
          AI Revenue System
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: 'clamp(40px,6vw,64px)', fontWeight: 700, letterSpacing: '-2px', lineHeight: 1.08, color: T.text, margin: '0 0 20px', fontFamily: font }}>
          Every lead. Booked automatically.
        </h1>

        {/* Subheadline */}
        <p style={{ fontSize: 18, color: T.sub, lineHeight: 1.7, maxWidth: 540, margin: '0 auto 36px', fontFamily: font }}>
          Leads Up responds to every inbound lead in under 60 seconds — qualifies them by AI, and books the meeting on your calendar. No manual work.
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 44 }}>
          <a href="https://cal.com/leads-up" target="_blank" rel="noopener noreferrer" style={{
            fontSize: 16, fontWeight: 600, color: T.white, background: T.blue,
            padding: '14px 24px', borderRadius: 12, textDecoration: 'none', fontFamily: font,
            transition: 'background 0.15s',
          }}
            onMouseOver={e => e.currentTarget.style.background = T.blueHover}
            onMouseOut={e => e.currentTarget.style.background = T.blue}>
            Book a demo
          </a>
          <a href="#how-it-works" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 16, color: T.text, textDecoration: 'none', fontFamily: font, fontWeight: 500, transition: 'opacity 0.15s' }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.65'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}>
            See how it works <ArrowRight size={16} />
          </a>
        </div>

        {/* Stat pills */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 40 }}>
          {['< 60s response','3.4× more bookings','94% qualification rate','Zero manual work'].map(s => (
            <div key={s} style={{ border: `1px solid ${T.border}`, padding: '8px 16px', borderRadius: 999, fontSize: 13, color: T.sub, fontFamily: font, background: T.white }}>
              {s}
            </div>
          ))}
        </div>

        {/* Trusted by */}
        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 28 }}>
          <span style={{ fontSize: 13, color: T.muted, fontFamily: font }}>
            Trusted by teams using&nbsp;&nbsp;
            {['HubSpot','Calendly','GoHighLevel','Salesforce','n8n'].map((n, i) => (
              <span key={n} style={{ color: T.muted }}>
                {i > 0 && <span style={{ margin: '0 8px' }}>·</span>}
                {n}
              </span>
            ))}
          </span>
        </div>
      </div>
    </section>
  )
}

/* ── Features ────────────────────────────────────────────────── */
const FEATURES = [
  { icon: Zap,       title: 'Instant response',     desc: 'Replies to every lead in under 60 seconds via AI voice, SMS, or email. No lead ever waits.' },
  { icon: Sparkles,  title: 'AI qualification',     desc: 'Every lead is scored 1–100 automatically. Only the best fits reach your calendar.' },
  { icon: Calendar,  title: 'Auto booking',         desc: 'Qualified leads land directly on your calendar. No back-and-forth, no manual scheduling.' },
  { icon: TrendingUp,title: 'Revenue tracking',     desc: 'See exactly which leads convert, where they came from, and how much revenue each source generates.' },
  { icon: Plug,      title: 'Native integrations',  desc: 'Connects to HubSpot, GoHighLevel, Salesforce, Cal.com, n8n and more in minutes.' },
  { icon: Clock,     title: 'Always on',            desc: 'Works 24/7 including nights, weekends, and holidays. Your AI never sleeps.' },
]

function Features() {
  return (
    <section id="features" style={{ background: T.bg, padding: '100px 24px', fontFamily: font }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', color: T.muted, fontWeight: 600, marginBottom: 14, textTransform: 'uppercase', fontFamily: font }}>Features</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, letterSpacing: '-1px', color: T.text, margin: 0, fontFamily: font }}>
            Everything your revenue engine needs.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28 }}>
              <div style={{ width: 40, height: 40, background: T.blueLight, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={18} color={T.blue} />
              </div>
              <div style={{ fontSize: 17, fontWeight: 600, color: T.text, marginBottom: 8, fontFamily: font }}>{title}</div>
              <p style={{ fontSize: 15, color: T.sub, lineHeight: 1.6, margin: 0, fontFamily: font }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── How It Works ────────────────────────────────────────────── */
const STEPS = [
  { n: 1, title: 'Lead comes in', desc: 'From your website form, email, phone call, or any connected source — Leads Up captures it instantly.' },
  { n: 2, title: 'AI qualifies them', desc: 'Our AI engages the lead immediately, asks the right questions, and scores them 1–100 based on your ideal customer profile.' },
  { n: 3, title: 'Meeting is booked', desc: 'High-score leads get a booking link or direct calendar invite. You just show up to the call.' },
]

function HowItWorks() {
  return (
    <section id="how-it-works" style={{ background: T.white, padding: '100px 24px', fontFamily: font }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', color: T.muted, fontWeight: 600, marginBottom: 14, textTransform: 'uppercase' }}>How it works</div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, letterSpacing: '-1px', color: T.text, margin: 0, fontFamily: font }}>
            From lead to booked call in 60 seconds.
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {STEPS.map(({ n, title, desc }, i) => (
            <div key={n} style={{ display: 'flex', gap: 20, position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: T.text, color: T.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{n}</div>
                {i < STEPS.length - 1 && <div style={{ width: 1, flex: 1, background: T.border, borderLeft: `1px dashed ${T.border}`, minHeight: 40, margin: '8px 0' }} />}
              </div>
              <div style={{ paddingBottom: i < STEPS.length - 1 ? 40 : 0, paddingTop: 4 }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: T.text, marginBottom: 8, fontFamily: font }}>{title}</div>
                <p style={{ fontSize: 15, color: T.sub, lineHeight: 1.7, margin: 0, fontFamily: font }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Testimonials ────────────────────────────────────────────── */
const TESTIMONIALS = [
  { quote: 'We were losing 40 percent of our leads from slow response times. Leads Up fixed that overnight. Now we book 3x more demos from the same traffic.', name: 'Marcus T.', company: 'SolarFlow Homes' },
  { quote: 'The AI handles all inbound after hours. It qualifies, answers questions, and books the call. Our team just shows up.', name: 'Sarah K.', company: 'PrimeCare Clinics' },
  { quote: 'ROI in week one. We recovered 3 deals worth $28k that would have gone cold. Setup took 20 minutes.', name: 'James R.', company: 'LiftBridge Agency' },
]

function Testimonials() {
  return (
    <section style={{ background: T.bg, padding: '100px 24px', fontFamily: font }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', color: T.muted, fontWeight: 600, marginBottom: 14, textTransform: 'uppercase' }}>Results</div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, letterSpacing: '-1px', color: T.text, margin: 0, fontFamily: font }}>
            Teams that stopped losing leads.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {TESTIMONIALS.map(({ quote, name, company }) => (
            <div key={name} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28 }}>
              <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                {[...Array(5)].map((_,i) => <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />)}
              </div>
              <p style={{ fontSize: 16, color: T.text, lineHeight: 1.7, fontStyle: 'italic', margin: '0 0 20px', fontFamily: font }}>"{quote}"</p>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text, fontFamily: font }}>{name}</div>
              <div style={{ fontSize: 13, color: T.muted, marginTop: 2, fontFamily: font }}>{company}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Pricing ─────────────────────────────────────────────────── */
const PLANS = [
  {
    name: 'Starter', price: '$297', unit: '/mo', popular: false,
    features: ['AI email and SMS', 'Up to 200 leads/mo', '1 calendar integration', 'Email support'],
    cta: 'Get started',
  },
  {
    name: 'Growth', price: '$597', unit: '/mo', popular: true,
    features: ['Everything in Starter', 'AI voice receptionist', 'Unlimited leads', '3 calendar integrations', 'CRM sync', 'Priority support'],
    cta: 'Get started',
  },
  {
    name: 'Scale', price: 'Custom', unit: '', popular: false,
    features: ['White-label', 'Unlimited everything', 'Dedicated account manager', 'API access', 'SLA'],
    cta: 'Talk to sales',
  },
]

function Pricing() {
  return (
    <section id="pricing" style={{ background: T.white, padding: '100px 24px', fontFamily: font }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', color: T.muted, fontWeight: 600, marginBottom: 14, textTransform: 'uppercase' }}>Pricing</div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, letterSpacing: '-1px', color: T.text, margin: 0, fontFamily: font }}>
            Simple, transparent pricing.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20, marginBottom: 24 }}>
          {PLANS.map(({ name, price, unit, popular, features, cta }) => (
            <div key={name} style={{
              background: T.white,
              border: popular ? `2px solid ${T.blue}` : `1px solid ${T.border}`,
              borderRadius: 16,
              padding: 28,
              position: 'relative',
            }}>
              {popular && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: T.blueLight, color: T.blue, fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 999, whiteSpace: 'nowrap', fontFamily: font }}>
                  Most popular
                </div>
              )}
              <div style={{ fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 8, fontFamily: font }}>{name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                <span style={{ fontSize: 36, fontWeight: 700, color: T.text, letterSpacing: '-1px', fontFamily: font }}>{price}</span>
                <span style={{ fontSize: 16, color: T.muted, fontFamily: font }}>{unit}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Check size={14} color={T.blue} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: T.sub, fontFamily: font }}>{f}</span>
                  </div>
                ))}
              </div>
              <a href="https://cal.com/leads-up" target="_blank" rel="noopener noreferrer" style={{
                display: 'block', textAlign: 'center', padding: '11px 0', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none',
                background: popular ? T.blue : 'transparent',
                color: popular ? T.white : T.text,
                border: popular ? 'none' : `1px solid ${T.border}`,
                fontFamily: font,
                transition: 'all 0.15s',
              }}
                onMouseOver={e => { e.currentTarget.style.background = popular ? T.blueHover : T.bg; }}
                onMouseOut={e => { e.currentTarget.style.background = popular ? T.blue : 'transparent'; }}>
                {cta}
              </a>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', fontSize: 13, color: T.muted, fontFamily: font }}>
          14-day free trial. No credit card required.
        </div>
      </div>
    </section>
  )
}

/* ── FAQ ─────────────────────────────────────────────────────── */
const FAQS = [
  { q: 'How fast does Leads Up respond?', a: 'Under 60 seconds, every time. Our AI picks up the lead the moment they come in — no queue, no delay, no human in the loop.' },
  { q: 'Do I need to change my existing tools?', a: 'No. Leads Up connects to your existing stack — CRMs, calendars, phone systems — without replacing anything you use today.' },
  { q: 'How does AI qualification work?', a: 'We train the AI on your ideal customer profile. Every lead is asked the right questions and scored 1–100 based on fit, intent, and timing.' },
  { q: 'What channels does it support?', a: 'Website forms, inbound calls, email, SMS, and any channel you connect via our integrations.' },
  { q: 'Can I customize the AI responses?', a: 'Yes. You control the voice, tone, questions, and qualification criteria. It sounds like your team, not a bot.' },
  { q: 'Is there a free trial?', a: 'Yes — 14 days, no credit card required. Full access to all features from day one.' },
]

function FAQ() {
  const [open, setOpen] = useState(null)
  return (
    <section id="faq" style={{ background: T.bg, padding: '100px 24px', fontFamily: font }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, letterSpacing: '-1px', color: T.text, margin: 0, fontFamily: font }}>
            Common questions.
          </h2>
        </div>
        {FAQS.map(({ q, a }, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: font }}
            >
              <span style={{ fontSize: 16, fontWeight: 600, color: T.text }}>{q}</span>
              {open === i
                ? <ChevronUp size={18} color={T.sub} style={{ flexShrink: 0 }} />
                : <ChevronDown size={18} color={T.sub} style={{ flexShrink: 0 }} />
              }
            </button>
            {open === i && (
              <p style={{ fontSize: 15, color: T.sub, lineHeight: 1.7, margin: '0 0 18px', fontFamily: font }}>{a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── CTA dark ────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section style={{ background: '#0A0A0A', padding: '120px 24px', textAlign: 'center', fontFamily: font }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 700, letterSpacing: '-1.5px', color: '#FFFFFF', margin: '0 0 16px', lineHeight: 1.1, fontFamily: font }}>
          Your next booked call is 60 seconds away.
        </h2>
        <p style={{ fontSize: 18, color: '#9B9B9B', margin: '0 0 40px', fontFamily: font }}>
          Join service businesses that automated their entire lead conversion.
        </p>
        <a href="https://cal.com/leads-up" target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-block', padding: '14px 28px', borderRadius: 12,
          background: '#FFFFFF', color: '#0A0A0A', fontSize: 16, fontWeight: 600,
          textDecoration: 'none', fontFamily: font, transition: 'opacity 0.15s',
        }}
          onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}>
          Book a demo
        </a>
        <p style={{ fontSize: 13, color: '#6B6B6B', margin: '16px 0 0', fontFamily: font }}>
          Setup in under 20 minutes. No credit card required.
        </p>
      </div>
    </section>
  )
}

/* ── Footer ──────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: T.white, borderTop: `1px solid ${T.border}`, padding: '40px 24px', fontFamily: font }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/leadsup-icon.png" alt="" style={{ height: 28, objectFit: 'contain', mixBlendMode: 'multiply' }} />
          <img src="/leadsup-text.png" alt="Leads Up" style={{ height: 18, objectFit: 'contain', mixBlendMode: 'multiply' }} />
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[['Privacy','#'],['Terms','#'],['Support','mailto:support@useleadsup.com']].map(([l,h]) => (
            <a key={l} href={h} style={{ fontSize: 13, color: T.muted, textDecoration: 'none', fontFamily: font }}
              onMouseOver={e => e.currentTarget.style.color = T.sub}
              onMouseOut={e => e.currentTarget.style.color = T.muted}>{l}</a>
          ))}
        </div>
        <div style={{ fontSize: 13, color: T.muted, fontFamily: font }}>© 2026 Leads Up</div>
      </div>
    </footer>
  )
}

/* ── Page ────────────────────────────────────────────────────── */
export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: font }}>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  )
}
