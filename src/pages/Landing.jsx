import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Zap, Phone, MessageSquare, Calendar, ChevronDown, ChevronUp,
  ArrowRight, CheckCircle, RefreshCw, Target, Menu, X,
  PhoneCall, Clock, TrendingUp, Mic
} from 'lucide-react'
import { faqs } from '../data/mockData'

/* ─── Integrations data ─────────────────────────────────────── */
const INTEGRATIONS = [
  { id: 'hubspot',  name: 'HubSpot',   abbr: 'HS', color: '#FF7A59', bg: 'rgba(255,122,89,0.12)',  x: 450, y: 52  },
  { id: 'airtable', name: 'Airtable',  abbr: 'AT', color: '#2D7FF9', bg: 'rgba(45,127,249,0.12)',  x: 710, y: 148 },
  { id: 'gmail',    name: 'Gmail',     abbr: 'GM', color: '#EA4335', bg: 'rgba(234,67,53,0.12)',   x: 800, y: 355 },
  { id: 'zapier',   name: 'Zapier',    abbr: 'ZP', color: '#FF4A00', bg: 'rgba(255,74,0,0.12)',    x: 660, y: 492 },
  { id: 'n8n',      name: 'n8n',       abbr: 'N8', color: '#E7498F', bg: 'rgba(231,73,143,0.12)',  x: 240, y: 492 },
  { id: 'retell',   name: 'Retell AI', abbr: 'RT', color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', x: 100, y: 355 },
  { id: 'clarity',  name: 'Clarity',   abbr: 'CL', color: '#00C2E0', bg: 'rgba(0,194,224,0.12)',  x: 190, y: 148 },
]

// Quadratic bezier paths: M <node-x> <node-y> Q <ctrl-x> <ctrl-y> 450 268
const PATHS = {
  hubspot:  'M 450 52 Q 510 155 450 268',
  airtable: 'M 710 148 Q 615 198 450 268',
  gmail:    'M 800 355 Q 645 308 450 268',
  zapier:   'M 660 492 Q 572 388 450 268',
  n8n:      'M 240 492 Q 328 388 450 268',
  retell:   'M 100 355 Q 255 308 450 268',
  clarity:  'M 190 148 Q 285 198 450 268',
}

const DURATIONS = { hubspot: 3.1, airtable: 2.7, gmail: 3.6, zapier: 2.4, n8n: 3.9, retell: 2.9, clarity: 3.4 }
const DELAYS    = { hubspot: 0,   airtable: 0.9, gmail: 0.4, zapier: 1.8, n8n: 1.1, retell: 0.6, clarity: 2.3 }

/* ─── Integration Hub Visual ────────────────────────────────── */
function IntegrationHub() {
  const W = 900, H = 540, cx = 450, cy = 268

  return (
    <div className="relative w-full max-w-5xl mx-auto select-none" style={{ paddingBottom: '57%' }}>
      {/* SVG layer: lines + animated dots + rings */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 w-full h-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id="dot-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="center-ring-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="line-fade-1" cx="0%" cy="0%" r="100%">
            <stop offset="0%" stopColor="#7677F4" stopOpacity="0" />
            <stop offset="100%" stopColor="#7677F4" stopOpacity="0.5" />
          </radialGradient>
        </defs>

        {/* Pulsing center rings */}
        <circle cx={cx} cy={cy} r="88" fill="none" stroke="#7677F4" strokeWidth="0.6" strokeOpacity="0.18">
          <animate attributeName="r" values="82;96;82" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.18;0.04;0.18" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx={cx} cy={cy} r="130" fill="none" stroke="#7677F4" strokeWidth="0.4" strokeOpacity="0.10">
          <animate attributeName="r" values="120;138;120" dur="4.5s" repeatCount="indefinite" begin="0.8s" />
          <animate attributeName="stroke-opacity" values="0.10;0.02;0.10" dur="4.5s" repeatCount="indefinite" begin="0.8s" />
        </circle>
        <circle cx={cx} cy={cy} r="175" fill="none" stroke="#6366F1" strokeWidth="0.3" strokeOpacity="0.07">
          <animate attributeName="r" values="165;182;165" dur="6s" repeatCount="indefinite" begin="1.5s" />
        </circle>

        {/* Static dashed connection lines */}
        {INTEGRATIONS.map(node => (
          <path
            key={`line-${node.id}`}
            d={PATHS[node.id]}
            stroke={node.color}
            strokeWidth="0.9"
            fill="none"
            strokeOpacity="0.18"
            strokeDasharray="5 6"
            strokeLinecap="round"
          />
        ))}

        {/* Animated glowing dots — flow from node to center */}
        {INTEGRATIONS.map(node => (
          <g key={`dot-${node.id}`} filter="url(#dot-glow)">
            <circle r="4" fill={node.color} opacity="0.95">
              <animateMotion
                dur={`${DURATIONS[node.id]}s`}
                repeatCount="indefinite"
                begin={`${DELAYS[node.id]}s`}
                path={PATHS[node.id]}
              />
            </circle>
          </g>
        ))}

        {/* Smaller trailing dots (staggered) for depth */}
        {INTEGRATIONS.map(node => (
          <g key={`dot2-${node.id}`} filter="url(#dot-glow)">
            <circle r="2.5" fill={node.color} opacity="0.5">
              <animateMotion
                dur={`${DURATIONS[node.id]}s`}
                repeatCount="indefinite"
                begin={`${DELAYS[node.id] + DURATIONS[node.id] * 0.5}s`}
                path={PATHS[node.id]}
              />
            </circle>
          </g>
        ))}
      </svg>

      {/* Integration node cards — HTML absolutely positioned */}
      {INTEGRATIONS.map(node => (
        <div
          key={`card-${node.id}`}
          className="absolute"
          style={{
            left: `${(node.x / W) * 100}%`,
            top: `${(node.y / H) * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className="flex items-center gap-2.5 pl-2.5 pr-4 py-2 rounded-xl"
            style={{
              background: '#0A0B18',
              border: `1px solid ${node.color}30`,
              boxShadow: `0 0 16px -4px ${node.color}22, 0 4px 20px -6px rgba(0,0,0,0.6)`,
              whiteSpace: 'nowrap',
            }}
          >
            {/* Abbr badge */}
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0"
              style={{ background: node.bg, color: node.color }}
            >
              {node.abbr}
            </div>
            <div>
              <div className="text-xs font-semibold leading-tight" style={{ color: '#D4D8F0' }}>
                {node.name}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[9px]" style={{ color: '#3D4165' }}>Connected</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Center: Leads Up chip */}
      <div
        className="absolute"
        style={{ left: '50%', top: `${(cy / H) * 100}%`, transform: 'translate(-50%, -50%)', zIndex: 10 }}
      >
        <div
          className="px-5 py-3.5 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #0E0F20 0%, #131428 100%)',
            border: '1px solid rgba(118,119,244,0.4)',
            boxShadow: '0 0 50px -8px rgba(109,113,244,0.5), 0 0 0 1px rgba(118,119,244,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6D71F4 0%, #8B5CF6 100%)' }}
            >
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight">Leads Up</div>
              <div className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: '#7677F4' }}>
                AI Engine
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5 pt-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px]" style={{ color: '#3D4165' }}>7 integrations active · processing</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Navbar ─────────────────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(6,6,15,0.82)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6D71F4 0%, #8B5CF6 100%)' }}
          >
            <Zap size={15} className="text-white" />
          </div>
          <span className="text-[15px] font-bold tracking-tight text-white">Leads Up</span>
        </Link>

        <div className="hidden md:flex items-center gap-7 text-sm" style={{ color: '#5A5E80' }}>
          {[['#features', 'Features'], ['#how-it-works', 'How It Works'], ['#faq', 'FAQ']].map(([href, label]) => (
            <a key={href} href={href} className="hover:text-white transition-colors duration-200">{label}</a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link to="/login" className="text-sm px-4 py-2 transition-colors duration-200" style={{ color: '#5A5E80' }}
            onMouseOver={e => e.target.style.color = '#fff'}
            onMouseOut={e => e.target.style.color = '#5A5E80'}
          >
            Sign In
          </Link>
          <Link to="/login"
            className="text-sm px-5 py-2.5 rounded-xl font-semibold text-white transition-all duration-200"
            style={{ background: 'linear-gradient(135deg, #6D71F4 0%, #7C3AED 100%)', boxShadow: '0 0 20px -6px rgba(109,113,244,0.6)' }}
          >
            Get Started Free
          </Link>
        </div>

        <button className="md:hidden" style={{ color: '#5A5E80' }} onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-5 pt-3 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {[['#features', 'Features'], ['#how-it-works', 'How It Works'], ['#faq', 'FAQ']].map(([href, label]) => (
            <a key={href} href={href} className="block py-2 text-sm" style={{ color: '#5A5E80' }} onClick={() => setOpen(false)}>{label}</a>
          ))}
          <Link to="/login" className="block mt-3 py-3 text-center text-sm font-semibold text-white rounded-xl"
            style={{ background: 'linear-gradient(135deg, #6D71F4 0%, #7C3AED 100%)' }}>
            Get Started Free
          </Link>
        </div>
      )}
    </nav>
  )
}

/* ─── Hero ───────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 noise-overlay">
      {/* Deep dark background */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(109,113,244,0.12) 0%, transparent 70%), #06060F' }} />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.018]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full text-sm font-medium"
          style={{ background: 'rgba(118,119,244,0.08)', border: '1px solid rgba(118,119,244,0.2)', color: '#A5A8FF' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Inbound Lead Conversion · Powered by AI
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-[82px] font-black tracking-tight leading-[0.95] mb-6">
          <span style={{ color: '#ECEEFF' }}>Never Miss</span>
          <br />
          <span className="gradient-text">A Lead.</span>
          <br />
          <span style={{ color: '#ECEEFF' }}>Never Lose</span>
          <br />
          <span className="gradient-text-warm">Revenue.</span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-4 leading-relaxed" style={{ color: '#575B7C' }}>
          Every inbound call, form, or text gets an AI response in under 60 seconds —
          qualified, and booked directly to your calendar. <span style={{ color: '#8B8ECC' }}>While you sleep.</span>
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16 mt-8">
          <Link to="/login"
            className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200"
            style={{ background: 'linear-gradient(135deg, #6D71F4 0%, #7C3AED 100%)', boxShadow: '0 0 40px -8px rgba(109,113,244,0.7)' }}
          >
            Book a Demo
            <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/login"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-200"
            style={{ border: '1px solid rgba(255,255,255,0.08)', color: '#7679CC', background: 'rgba(255,255,255,0.02)' }}
          >
            Start Free Trial
          </Link>
        </div>

        {/* Integration Hub */}
        <IntegrationHub />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-10">
          {[
            { n: '< 60s', l: 'AI Response Time' },
            { n: '3.4×',  l: 'More Bookings' },
            { n: '$2.6M', l: 'Revenue Recovered' },
            { n: '94%',   l: 'Lead Capture Rate' },
          ].map(({ n, l }) => (
            <div key={l} className="py-4 px-2 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-2xl font-black mb-1" style={{ color: '#C4B5FD' }}>{n}</div>
              <div className="text-xs uppercase tracking-widest" style={{ color: '#3D4165' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Problem ────────────────────────────────────────────────── */
function Problem() {
  return (
    <section id="problem" className="py-28 relative" style={{ background: '#06060F' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="section-label">The Problem</div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
            <span style={{ color: '#ECEEFF' }}>Every Inbound Lead</span><br />
            <span className="gradient-text-warm">Is a Race You're Losing</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#4B4F6E' }}>
            Speed is the only metric that matters when a new lead lands. Here's what's happening right now.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              stat: '78%',
              label: 'of buyers hire the first to respond',
              desc: 'The average service business takes 47 hours to reply. By then, your lead has already booked with someone else — and never looked back.',
              accent: '#FF6B6B',
            },
            {
              stat: '44%',
              label: 'of reps give up after one follow-up',
              desc: 'Manual outreach doesn\'t scale. Inbound leads that don\'t get an instant reply and 5-7 follow-ups within 48 hours almost never convert.',
              accent: '#FCA5A5',
            },
            {
              stat: '68%',
              label: 'of "lost" leads eventually buy — elsewhere',
              desc: 'Without automated reactivation, those contacts quietly become someone else\'s revenue. A single re-engagement campaign changes everything.',
              accent: '#FBBF24',
            },
          ].map(({ stat, label, desc, accent }) => (
            <div key={stat} className="p-7 rounded-2xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-5xl font-black mb-2" style={{ color: accent }}>{stat}</div>
              <div className="text-sm font-semibold mb-3" style={{ color: '#9296C4' }}>{label}</div>
              <p className="text-sm leading-relaxed" style={{ color: '#3D4165' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Features / Solution ────────────────────────────────────── */
function Features() {
  const features = [
    {
      icon: Mic,
      label: 'AI Receptionist',
      headline: 'Answers Every Call. Captures Every Lead.',
      desc: 'When a prospect calls after hours — or when your team is busy — our AI Receptionist picks up, introduces your business, qualifies the lead in a natural conversation, and books a callback or appointment instantly. Not a voicemail. A real, intelligent interaction.',
      highlight: 'After-hours call capture + instant booking',
      color: '#A78BFA',
      bg: 'rgba(167,139,250,0.1)',
      featured: true,
    },
    {
      icon: Zap,
      label: 'Instant AI Response',
      headline: 'First reply in under 60 seconds.',
      desc: 'Every form submission, SMS, or web chat gets a personalized AI response before your competitor even sees the notification. 24/7, including holidays.',
      highlight: '< 60 second response time',
      color: '#818CF8',
      bg: 'rgba(129,140,248,0.1)',
    },
    {
      icon: Target,
      label: 'Smart Qualification',
      headline: 'Score and prioritize automatically.',
      desc: 'The AI conducts natural follow-up conversations to uncover budget, timeline, and intent — then gives each lead a score so your team knows exactly where to focus.',
      highlight: '0–100 lead scoring',
      color: '#67E8F9',
      bg: 'rgba(103,232,249,0.1)',
    },
    {
      icon: Calendar,
      label: 'Direct Booking',
      headline: 'Booked calls, no back-and-forth.',
      desc: 'Qualified leads select a time from your real-time availability and book directly. Calendar sync with Google and Outlook keeps everything in sync.',
      highlight: 'Google & Outlook integration',
      color: '#6EE7B7',
      bg: 'rgba(110,231,183,0.1)',
    },
    {
      icon: MessageSquare,
      label: 'Multi-touch Follow-up',
      headline: '14-day automated nurture.',
      desc: 'Leads that don\'t respond immediately enter a smart sequence of SMS and email follow-ups timed to maximize response rates — stopping the moment they engage.',
      highlight: 'SMS + email sequences',
      color: '#FCD34D',
      bg: 'rgba(252,211,77,0.1)',
    },
    {
      icon: RefreshCw,
      label: 'Lead Reactivation',
      headline: 'Wake up dormant contacts.',
      desc: 'Automatically identify cold leads in your database and re-engage them with targeted campaigns. Most clients recover 10–20% of previously lost leads in 30 days.',
      highlight: '10–20% reactivation rate',
      color: '#F9A8D4',
      bg: 'rgba(249,168,212,0.1)',
    },
  ]

  return (
    <section id="features" className="py-28" style={{ background: 'linear-gradient(180deg, #06060F 0%, #08091A 100%)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-label">Features</div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
            <span style={{ color: '#ECEEFF' }}>One Platform.</span>{' '}
            <span className="gradient-text">Every Inbound Lead.</span><br />
            <span style={{ color: '#ECEEFF' }}>Booked Automatically.</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#4B4F6E' }}>
            Leads Up handles the entire inbound-to-booked pipeline — from the first ring or form submission to a confirmed appointment on your calendar.
          </p>
        </div>

        {/* Featured AI Receptionist card */}
        <div className="mb-5 p-8 rounded-3xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(167,139,250,0.08) 0%, rgba(109,113,244,0.05) 100%)',
            border: '1px solid rgba(167,139,250,0.2)',
            boxShadow: '0 0 60px -20px rgba(167,139,250,0.2)',
          }}
        >
          <div className="absolute top-4 right-4 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
            style={{ background: 'rgba(167,139,250,0.15)', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.3)' }}>
            Featured
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.15)' }}>
                  <Mic size={22} style={{ color: '#A78BFA' }} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#A78BFA' }}>AI Receptionist</div>
                  <div className="text-xl font-black text-white">Answers Every Call. Books Every Lead.</div>
                </div>
              </div>
              <p className="leading-relaxed mb-6" style={{ color: '#575B7C' }}>
                When a prospect calls after hours — or when your team is busy — our AI Receptionist picks up, introduces your business, qualifies the caller in a natural conversation, and books a callback or appointment instantly.
              </p>
              <p className="leading-relaxed mb-6" style={{ color: '#575B7C' }}>
                <span style={{ color: '#A78BFA' }}>Not a voicemail. Not a bot menu.</span> A real, intelligent interaction that treats every caller like your most important lead.
              </p>
              <div className="flex flex-wrap gap-3">
                {['24/7 call answering', 'Natural AI conversation', 'Live call transfer', 'Instant booking'].map(tag => (
                  <span key={tag} className="text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{ background: 'rgba(167,139,250,0.1)', color: '#C4B5FD', border: '1px solid rgba(167,139,250,0.2)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {/* Visual mock */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.2)' }}>
                  <PhoneCall size={14} style={{ color: '#A78BFA' }} />
                </div>
                <div>
                  <div className="text-xs text-white font-medium">Inbound Call · After Hours</div>
                  <div className="text-[10px]" style={{ color: '#3D4165' }}>Unknown caller · Mobile</div>
                </div>
                <div className="ml-auto text-[10px] font-bold text-emerald-400">Answered in 1s</div>
              </div>
              {[
                { from: 'AI', msg: 'Hi, thanks for calling RiverTech HVAC! I\'m the AI assistant. How can I help you today?', color: '#A78BFA' },
                { from: 'Lead', msg: 'Hi, I need my AC serviced. Is someone available this week?', color: '#6B7280' },
                { from: 'AI', msg: 'Absolutely! We have openings Thursday and Friday. What\'s your address and best contact number?', color: '#A78BFA' },
                { from: 'Lead', msg: '412 Oak St — and you can reach me at this number.', color: '#6B7280' },
                { from: 'AI', msg: 'Perfect! I\'ve booked you for Thursday at 10 AM. You\'ll receive a confirmation SMS shortly. 🎉', color: '#A78BFA' },
              ].map(({ from, msg, color }, i) => (
                <div key={i} className={`mb-3 ${from === 'Lead' ? 'text-right' : ''}`}>
                  <div className="inline-block text-left px-3 py-2 rounded-xl text-xs max-w-[85%]"
                    style={{ background: from === 'AI' ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.05)', color: from === 'AI' ? '#C4B5FD' : '#9097C0', border: `1px solid ${color}20` }}>
                    {msg}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Other features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.slice(1).map(({ icon: Icon, label, headline, desc, highlight, color, bg }) => (
            <div key={label} className="feature-card p-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: bg }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color }}>
                {label}
              </div>
              <div className="text-base font-bold text-white mb-2">{headline}</div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#3D4165' }}>{desc}</p>
              <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color }}>
                <CheckCircle size={11} />
                {highlight}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── How It Works ───────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n: '01', icon: Phone,        title: 'Lead Arrives',         desc: 'A call, form, SMS, or chat comes in from any source — web, Google, Facebook, or a direct dial.' },
    { n: '02', icon: Zap,          title: 'AI Responds Instantly', desc: 'Within seconds, the AI Receptionist or messaging engine sends a personalized, on-brand first reply.' },
    { n: '03', icon: Target,       title: 'Qualifies & Scores',   desc: 'The AI gathers budget, timeline, and intent — then assigns a priority score and routes the lead.' },
    { n: '04', icon: Calendar,     title: 'Books the Appointment', desc: 'High-priority leads choose a time from your real availability and get a confirmed booking — instantly.' },
  ]

  return (
    <section id="how-it-works" className="py-28" style={{ background: '#06060F' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-label">How It Works</div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
            <span style={{ color: '#ECEEFF' }}>Inbound Lead to</span>{' '}
            <span className="gradient-text">Booked Call</span><br />
            <span style={{ color: '#ECEEFF' }}>in Under 90 Seconds</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#4B4F6E' }}>
            Set up in one afternoon. No technical knowledge required. Revenue starts flowing the same day.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map(({ n, icon: Icon, title, desc }, i) => (
            <div key={n} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-full w-full h-px z-0"
                  style={{ background: 'linear-gradient(90deg, rgba(118,119,244,0.3), transparent)', width: 'calc(100% - 20px)', marginLeft: '20px' }} />
              )}
              <div className="p-6 rounded-2xl relative z-10 h-full"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(109,113,244,0.15)' }}>
                    <Icon size={17} style={{ color: '#818CF8' }} />
                  </div>
                  <span className="text-3xl font-black" style={{ color: '#1E2035' }}>{n}</span>
                </div>
                <div className="text-sm font-bold text-white mb-2">{title}</div>
                <p className="text-sm leading-relaxed" style={{ color: '#3D4165' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ROI bar */}
        <div className="mt-10 p-6 rounded-2xl flex flex-wrap items-center gap-8 justify-between"
          style={{ background: 'rgba(109,113,244,0.06)', border: '1px solid rgba(109,113,244,0.15)' }}>
          {[
            { val: '< 60s', label: 'First AI response' },
            { val: '< 90s', label: 'Lead qualified & scored' },
            { val: '< 5min', label: 'Appointment booked' },
            { val: '0 mins', label: 'Manual work required' },
          ].map(({ val, label }) => (
            <div key={label} className="text-center flex-1 min-w-24">
              <div className="text-2xl font-black gradient-text">{val}</div>
              <div className="text-xs mt-1" style={{ color: '#3D4165' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── FAQ ────────────────────────────────────────────────────── */
function FAQ() {
  const [open, setOpen] = useState(null)
  const items = [
    ...faqs.slice(0, 5),
    {
      q: 'How does the AI Receptionist handle calls?',
      a: 'It answers within 1 second using a natural-sounding voice, introduces your business, gathers lead information through conversation, and offers direct booking. If the caller needs a human, it can warm-transfer to your team instantly or take a message with full context.',
    },
  ]

  return (
    <section id="faq" className="py-28" style={{ background: '#06060F' }}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="section-label">FAQ</div>
          <h2 className="text-4xl font-black tracking-tight text-white">Common Questions</h2>
        </div>
        <div className="space-y-2">
          {items.map(({ q, a }, i) => (
            <div key={i} className="rounded-2xl overflow-hidden"
              style={{ background: open === i ? 'rgba(109,113,244,0.06)' : 'rgba(255,255,255,0.025)', border: open === i ? '1px solid rgba(109,113,244,0.2)' : '1px solid rgba(255,255,255,0.06)', transition: 'all 0.2s' }}>
              <button className="w-full text-left px-6 py-5 flex items-start justify-between gap-4" onClick={() => setOpen(open === i ? null : i)}>
                <span className="text-sm font-semibold text-white">{q}</span>
                {open === i
                  ? <ChevronUp size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#818CF8' }} />
                  : <ChevronDown size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#3D4165' }} />
                }
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: '#575B7C', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA ────────────────────────────────────────────────────── */
function CTA() {
  return (
    <section className="py-24" style={{ background: 'linear-gradient(180deg, #06060F 0%, #080914 100%)' }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="relative p-12 rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(109,113,244,0.1) 0%, rgba(124,58,237,0.06) 100%)',
            border: '1px solid rgba(109,113,244,0.2)',
            boxShadow: '0 0 80px -20px rgba(109,113,244,0.2)',
          }}>
          <div className="absolute inset-0 opacity-30"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(109,113,244,0.3) 0%, transparent 70%)' }} />
          <div className="relative z-10">
            <div className="section-label justify-center mb-4">Ready to Scale?</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
              <span style={{ color: '#ECEEFF' }}>Start Converting Inbound</span><br />
              <span className="gradient-text">Leads Into Booked Calls</span>
            </h2>
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: '#4B4F6E' }}>
              Join 1,200+ service businesses. 14-day free trial. No credit card. Setup in under an hour.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link to="/login"
                className="group flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold text-white text-lg transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #6D71F4 0%, #7C3AED 100%)', boxShadow: '0 0 50px -8px rgba(109,113,244,0.7)' }}
              >
                Get Started Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
                style={{ border: '1px solid rgba(255,255,255,0.08)', color: '#7679CC' }}>
                Book a Demo
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              {['14-day free trial', 'No credit card', 'Cancel anytime', 'Setup in &lt;1 hour'].map(f => (
                <span key={f} className="flex items-center gap-1.5 text-sm" style={{ color: '#3D4165' }}>
                  <CheckCircle size={12} className="text-emerald-500" />
                  {f.replace('&lt;', '<')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ─────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="py-10" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: '#06060F' }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6D71F4, #8B5CF6)' }}>
            <Zap size={12} className="text-white" />
          </div>
          <span className="text-sm font-bold text-white">Leads Up</span>
        </div>
        <div className="flex gap-6 text-sm" style={{ color: '#3D4165' }}>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="mailto:support@leadsup.io" className="hover:text-white transition-colors">Support</a>
        </div>
        <div className="text-sm" style={{ color: '#22243A' }}>© 2026 Leads Up</div>
      </div>
    </footer>
  )
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Problem />
      <Features />
      <HowItWorks />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}
