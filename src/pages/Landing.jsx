import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const font = "system-ui,-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif"

/* ── Design tokens ──────────────────────────────────────────── */
const T = {
  bg: '#0B0D16',
  surface: '#0F1120',
  border: '#1A1D2E',
  text: '#FFFFFF',
  sub: '#94A3B8',
  blue: '#6B8AFF',
  purple: '#A78BFA',
}

/* ── IntegrationHub — preserved exactly ────────────────────── */
const NODES = [
  { id:'hubspot',  logo:'https://assets.findstack.com/vdaa5x4wgysdzradrjabipgw14y6', ring:'#FF7A59', x:450, y:50  },
  { id:'airtable', logo:'https://play-lh.googleusercontent.com/Kv6IIya1TLiCSQCHOz1ihsxuBfSeriuVd8Qpsgby6RFjiWzIJeTnoOWEzHwzttHlhmGM', ring:'#FCB400', x:585, y:99  },
  { id:'gmail',    logo:'https://cdn.worldvectorlogo.com/logos/gmail-icon.svg', ring:'#EA4335', x:657, y:224 },
  { id:'zapier',   logo:'https://cdn.worldvectorlogo.com/logos/zapier.svg', ring:'#FF4A00', x:632, y:365 },
  { id:'openai',   logo:'https://cdn.worldvectorlogo.com/logos/openai-2.svg', ring:'#10A37F', x:522, y:457 },
  { id:'n8n',      logo:'https://play-lh.googleusercontent.com/NIYvBq4mqSvkoYyObM_bJL5c_q5yrmBLQKBGXn-tlidUYkoz2vnGwS0wWz6Knl4lJ54NWjzFwbrRp1vNfNaG', ring:'#E7498F', x:378, y:457 },
  { id:'linkedin', logo:'https://cdn.worldvectorlogo.com/logos/linkedin-icon-2.svg', ring:'#0A66C2', x:268, y:365 },
  { id:'outlook',  logo:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnX6Hykqg5uXM3ZgQDOSVspShRrKgUV93yiA&s', ring:'#0078D4', x:243, y:224 },
  { id:'clay',     logo:'https://s3.amazonaws.com/media.mixrank.com/hero-img/84ec813883cb09c8c7f8737ec57faf6d', ring:'#6B7EE0', x:315, y:99  },
]

const PATHS = {
  hubspot:'M 450 50  Q 500 152 450 260', airtable:'M 585 99  Q 558 182 450 260',
  gmail:'M 657 224 Q 567 240 450 260',   zapier:'M 632 365 Q 555 322 450 260',
  openai:'M 522 457 Q 494 368 450 260',  n8n:'M 378 457 Q 406 368 450 260',
  linkedin:'M 268 365 Q 345 322 450 260',outlook:'M 243 224 Q 333 240 450 260',
  clay:'M 315 99  Q 342 182 450 260',
}

const DUR = { hubspot:3.2, airtable:2.6, gmail:3.5, zapier:2.3, openai:3.0, n8n:3.8, linkedin:2.7, outlook:3.1, clay:3.4 }
const DEL = { hubspot:0, airtable:0.9, gmail:0.4, zapier:1.7, openai:2.4, n8n:1.1, linkedin:0.7, outlook:0.5, clay:2.2 }

function IntegrationHub() {
  const W = 900, H = 520, cx = 450, cy = 260
  return (
    <div className="relative w-full max-w-5xl mx-auto select-none" style={{ paddingBottom:'54%' }}>
      <div className="absolute" style={{ left:'50%', top:`${(cy/H)*100}%`, transform:'translate(-50%,-50%)', width:'340px', height:'340px', borderRadius:'50%', background:'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', pointerEvents:'none' }}/>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" style={{ overflow:'visible' }}>
        <defs>
          <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-sm" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.8" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {[90,130,170].map((r,i) => (
          <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="#6366F1" strokeWidth={0.5-i*0.12} strokeOpacity={0.12-i*0.03}>
            <animate attributeName="r" values={`${r-6};${r+6};${r-6}`} dur={`${4+i*1.2}s`} repeatCount="indefinite"/>
            <animate attributeName="stroke-opacity" values={`${0.12-i*0.03};0.02;${0.12-i*0.03}`} dur={`${4+i*1.2}s`} repeatCount="indefinite"/>
          </circle>
        ))}
        {NODES.map(n => (
          <path key={`line-${n.id}`} d={PATHS[n.id]} stroke={n.ring} strokeWidth="1" fill="none" strokeOpacity="0.2" strokeDasharray="4 5" strokeLinecap="round"/>
        ))}
        {NODES.map(n => (
          <g key={`d1-${n.id}`} filter="url(#glow)">
            <circle r="3.5" fill={n.ring} opacity="0.9">
              <animateMotion dur={`${DUR[n.id]}s`} repeatCount="indefinite" begin={`${DEL[n.id]}s`} path={PATHS[n.id]}/>
            </circle>
          </g>
        ))}
        {NODES.map(n => (
          <g key={`d2-${n.id}`} filter="url(#glow-sm)">
            <circle r="2" fill={n.ring} opacity="0.45">
              <animateMotion dur={`${DUR[n.id]}s`} repeatCount="indefinite" begin={`${DEL[n.id]+DUR[n.id]*0.45}s`} path={PATHS[n.id]}/>
            </circle>
          </g>
        ))}
      </svg>
      {NODES.map(n => (
        <div key={`node-${n.id}`} className="absolute" style={{ left:`${(n.x/W)*100}%`, top:`${(n.y/H)*100}%`, transform:'translate(-50%,-50%)', zIndex:5 }}>
          <div style={{ width:54, height:54, borderRadius:'50%', background:'#1a2235', border:`1.5px solid ${n.ring}35`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 6px 20px rgba(0,0,0,0.5), 0 0 16px -4px ${n.ring}30`, padding:10, transition:'box-shadow 0.3s' }}
            onMouseOver={e=>e.currentTarget.style.boxShadow=`0 0 0 2px ${n.ring}50, 0 6px 24px rgba(0,0,0,0.6), 0 0 24px -4px ${n.ring}55`}
            onMouseOut={e=>e.currentTarget.style.boxShadow=`0 6px 20px rgba(0,0,0,0.5), 0 0 16px -4px ${n.ring}30`}>
            <img src={n.logo} alt="" loading="lazy" style={{ width:'100%', height:'100%', objectFit:'contain', display:'block', borderRadius:4 }} onError={e=>{e.target.style.opacity='0.3'}}/>
          </div>
        </div>
      ))}
      <div className="absolute" style={{ left:'50%', top:`${(cy/H)*100}%`, transform:'translate(-50%,-50%)', zIndex:10 }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ width:72, height:72, borderRadius:'50%', margin:'0 auto', background:'linear-gradient(135deg, #6366F1, #7C3AED)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 0 3px rgba(99,102,241,0.2), 0 0 50px -8px rgba(99,102,241,0.55), 0 0 0 6px rgba(99,102,241,0.06)' }}>
            <img src="/leadsup-icon.png" alt="" style={{ height:40, width:40, objectFit:'contain', mixBlendMode:'lighten' }}/>
          </div>
          <div style={{ marginTop:8 }}>
            <img src="/leadsup-text.png" alt="Leads Up" style={{ height:14, objectFit:'contain', mixBlendMode:'lighten', display:'block', margin:'0 auto' }}/>
            <div style={{ fontSize:8.5, fontWeight:700, color:'#6366F1', letterSpacing:'0.14em', textTransform:'uppercase', marginTop:3 }}>AI ENGINE</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Navbar ─────────────────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false)
  const navLinks = [['#system','System'],['#features','Features'],['#pricing','Pricing'],['#faq','FAQ']]
  return (
    <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:50, background:T.bg, borderBottom:`1px solid ${T.border}`, height:60, display:'flex', alignItems:'center', fontFamily:font, width:'100%' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', width:'100%', padding:'0 40px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', background:'transparent' }}>
          <img src="/leadsup-icon.png" alt="" style={{ height:36, objectFit:'contain', display:'block', background:'transparent', mixBlendMode:'normal' }}/>
          <img src="/leadsup-text.png" alt="Leadsup" style={{ height:22, objectFit:'contain', display:'block', background:'transparent', mixBlendMode:'normal' }}/>
        </Link>

        {/* Center links — desktop */}
        <div className="hidden md:flex" style={{ alignItems:'center', gap:32 }}>
          {navLinks.map(([href, label]) => (
            <a key={href} href={href} style={{ fontSize:14, color:T.sub, textDecoration:'none', transition:'color 0.15s', fontFamily:font }}
              onMouseOver={e=>e.currentTarget.style.color='#FFFFFF'}
              onMouseOut={e=>e.currentTarget.style.color=T.sub}>{label}</a>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex" style={{ alignItems:'center', gap:20 }}>
          <Link to="/login" style={{ fontSize:14, color:T.sub, textDecoration:'none', transition:'color 0.15s', fontFamily:font }}
            onMouseOver={e=>e.currentTarget.style.color='#FFFFFF'}
            onMouseOut={e=>e.currentTarget.style.color=T.sub}>Sign In</Link>
          <a href="#cta" style={{ fontSize:14, fontWeight:600, color:'#080A0F', background:'#FFFFFF', padding:'8px 16px', borderRadius:99, textDecoration:'none', fontFamily:font, transition:'opacity 0.15s' }}
            onMouseOver={e=>e.currentTarget.style.opacity='0.85'}
            onMouseOut={e=>e.currentTarget.style.opacity='1'}>Get started</a>
        </div>

        {/* Mobile burger — hidden on desktop via .nav-burger media query */}
        <button className="nav-burger" onClick={()=>setOpen(!open)}
          style={{ background:'none', border:'none', cursor:'pointer', color:T.sub, padding:8, minWidth:44, minHeight:44, alignItems:'center', justifyContent:'center' }}>
          {open ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden" style={{ position:'absolute', top:60, left:0, right:0, background:T.bg, borderBottom:`1px solid ${T.border}`, padding:'16px 24px 24px', display:'flex', flexDirection:'column', gap:12 }}>
          {navLinks.map(([href, label]) => (
            <a key={href} href={href} onClick={()=>setOpen(false)}
              style={{ fontSize:15, color:T.sub, textDecoration:'none', padding:'8px 0', fontFamily:font }}>{label}</a>
          ))}
          <div style={{ height:1, background:T.border, margin:'4px 0' }}/>
          <Link to="/login" onClick={()=>setOpen(false)} style={{ fontSize:15, color:T.sub, textDecoration:'none', padding:'8px 0', fontFamily:font }}>Sign In</Link>
          <a href="#cta" onClick={()=>setOpen(false)} style={{ fontSize:15, fontWeight:600, color:'#080A0F', background:'#FFFFFF', padding:'12px 20px', borderRadius:99, textDecoration:'none', textAlign:'center', fontFamily:font }}>Get started</a>
        </div>
      )}
    </nav>
  )
}

/* ── Hero ───────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="hero-section" style={{ background:T.bg, paddingTop:120, paddingBottom:80, fontFamily:font }}>
      <div style={{ maxWidth:800, margin:'0 auto', padding:'0 24px', textAlign:'center' }}>
        {/* Badge */}
        <div style={{ display:'inline-flex', alignItems:'center', border:`1px solid ${T.border}`, borderRadius:99, padding:'6px 14px', marginBottom:32, fontSize:12, color:T.sub }}>
          AI Revenue System · Now booking Q2 deployments
        </div>

        {/* Headline */}
        <h1 className="hero-headline" style={{ fontSize:56, fontWeight:700, letterSpacing:'-0.02em', lineHeight:1.1, margin:'0 0 20px', color:T.text }}>
          Turn leads into<br/>
          <span style={{ background:`linear-gradient(135deg, ${T.blue}, ${T.purple})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>booked revenue</span>
          <span style={{ color:T.text }}>—on autopilot.</span>
        </h1>

        {/* Subheadline */}
        <p className="hero-sub" style={{ fontSize:18, color:T.sub, lineHeight:1.7, maxWidth:560, margin:'0 auto 40px', textAlign:'center' }}>
          LeadsUp is the AI revenue infrastructure that follows up, qualifies, and converts every lead into booked calls and paying customers — without human ops.
        </p>

        {/* CTAs */}
        <div className="hero-btns" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, flexWrap:'wrap' }}>
          <a href="#cta" className="hero-btn-primary" style={{ fontSize:15, fontWeight:600, color:'#FFFFFF', background:`linear-gradient(135deg, ${T.blue}, ${T.purple})`, padding:'12px 24px', borderRadius:99, textDecoration:'none', transition:'opacity 0.15s' }}
            onMouseOver={e=>e.currentTarget.style.opacity='0.85'}
            onMouseOut={e=>e.currentTarget.style.opacity='1'}>
            Book a strategy call →
          </a>
          <a href="#system" style={{ fontSize:15, color:'#FFFFFF', background:'transparent', border:'none', textDecoration:'none', cursor:'pointer', transition:'color 0.15s' }}
            onMouseOver={e=>e.currentTarget.style.color=T.sub}
            onMouseOut={e=>e.currentTarget.style.color='#FFFFFF'}>
            See how it works
          </a>
        </div>
      </div>

      {/* Integration hub — scaled down on mobile */}
      <div className="hub-outer" style={{ maxWidth:1000, margin:'60px auto 0', padding:'0 24px' }}>
        <div className="hub-wrapper">
          <IntegrationHub />
        </div>
      </div>
    </section>
  )
}

/* ── Social proof bar ───────────────────────────────────────── */
function SocialProof() {
  const companies = ['NORTHWIND','ACME','LINEARLY','QUANTUM','PARALLAX','VERTEX']
  return (
    <div style={{ background:T.bg, borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}`, padding:'40px 0', fontFamily:font }}>
      <p style={{ fontSize:11, letterSpacing:'0.15em', color:T.sub, textAlign:'center', marginBottom:24 }}>
        TRUSTED BY REVENUE TEAMS AT
      </p>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:48, flexWrap:'wrap', padding:'0 24px' }}>
        {companies.map(c => (
          <span key={c} style={{ fontSize:14, fontWeight:600, letterSpacing:'0.1em', color:'#3A4060' }}>{c}</span>
        ))}
      </div>
    </div>
  )
}

/* ── Stats ──────────────────────────────────────────────────── */
function Stats() {
  const stats = [
    { num:'3.4x',   label:'More booked calls',    sub:'vs. manual follow-up' },
    { num:'<60s',   label:'Lead response time',   sub:'24/7, every channel' },
    { num:'92%',    label:'Reply rate lift',       sub:'AI-personalized' },
    { num:'$1.2M+', label:'Pipeline generated',   sub:'in last 90 days' },
  ]
  return (
    <div style={{ background:T.bg, padding:'80px 40px', fontFamily:font }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0 }} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.num} style={{ padding:'40px', textAlign:'center', borderRight: i < 3 ? `1px solid ${T.border}` : 'none', borderLeft: i === 0 ? `1px solid ${T.border}` : 'none' }} className="stat-col">
            <div style={{ fontSize:56, fontWeight:700, color:T.blue, letterSpacing:'-2px', lineHeight:1 }}>{s.num}</div>
            <div style={{ fontSize:15, fontWeight:600, color:T.text, marginTop:8 }}>{s.label}</div>
            <div style={{ fontSize:13, color:T.sub, marginTop:4 }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── System section ─────────────────────────────────────────── */
function System() {
  const cards = [
    { num:'01', title:'Capture', desc:'Every form, ad, DM, and inbound source is unified into one revenue stream — instantly enriched and scored.' },
    { num:'02', title:'Engage',  desc:'AI agents reply in under 60 seconds across SMS, email, and chat — with brand-perfect tone and full context.' },
    { num:'03', title:'Qualify', desc:'Multi-turn conversations qualify intent, budget, and timing — then hand off only sales-ready leads.' },
    { num:'04', title:'Book',    desc:'Calls land directly on your calendar. Reminders, reschedules, and no-show recovery run automatically.' },
  ]
  return (
    <section id="system" style={{ background:T.bg, padding:'100px 40px', fontFamily:font }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.15em', color:T.blue, textTransform:'uppercase', marginBottom:16 }}>THE SYSTEM</div>
        <h2 style={{ fontSize:'clamp(32px,4.5vw,52px)', fontWeight:700, letterSpacing:'-0.02em', color:T.text, marginBottom:16, lineHeight:1.12 }}>
          A single revenue layer.<br/>Replacing your entire follow-up stack.
        </h2>
        <p style={{ fontSize:16, color:T.sub, maxWidth:560, lineHeight:1.7, marginBottom:60 }}>
          LeadsUp connects to your existing tools and runs your pipeline like a top-performing SDR team — at 1/10th the cost.
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }} className="system-cards">
          {cards.map(c => (
            <div key={c.num} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:32 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.blue, marginBottom:40, letterSpacing:'0.05em' }}>{c.num}</div>
              <div style={{ fontSize:22, fontWeight:700, color:T.text, marginBottom:12, letterSpacing:'-0.02em' }}>{c.title}</div>
              <div style={{ fontSize:14, color:T.sub, lineHeight:1.7 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Platform section ───────────────────────────────────────── */
function Platform() {
  const features = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B8AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.816 1.912a2 2 0 00-1.272 1.272L12 21l-1.912-5.816a2 2 0 00-1.272-1.272L3 12l5.816-1.912a2 2 0 001.272-1.272L12 3z"/>
        </svg>
      ),
      title: 'AI follow-up that never sleeps',
      desc: 'Conversational agents trained on your offer respond instantly across every channel — including the 80% of leads humans never reach.',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B8AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
        </svg>
      ),
      title: 'Booked calls, not busy work',
      desc: 'Every qualified conversation auto-converts into a calendar booking with reminders, confirmations, and re-engagement built in.',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B8AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
        </svg>
      ),
      title: 'Revenue-grade analytics',
      desc: 'Every touchpoint, reply, and booking tied back to pipeline impact. Know exactly what\'s working — and scale it.',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B8AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
        </svg>
      ),
      title: 'Plug into your stack',
      desc: 'Native integrations with HubSpot, Salesforce, Pipedrive, GHL, Calendly, Slack, Stripe — and 1,000+ via API.',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B8AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
      title: 'Trained on your brand',
      desc: 'Voice, tone, objections, edge cases — your AI agent operates with the precision of your best closer.',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B8AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: 'Enterprise-ready',
      desc: 'SOC 2, GDPR, end-to-end encryption, role-based access. Built for teams who can\'t afford to play.',
    },
  ]

  return (
    <section id="features" style={{ background:T.bg, padding:'100px 40px', fontFamily:font }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.15em', color:T.blue, textTransform:'uppercase', marginBottom:16 }}>PLATFORM</div>
        <h2 style={{ fontSize:'clamp(32px,4.5vw,52px)', fontWeight:700, letterSpacing:'-0.02em', color:T.text, marginBottom:60, lineHeight:1.12 }}>
          Built like infrastructure.<br/>Used like magic.
        </h2>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }} className="platform-cards">
          {features.map((f, i) => (
            <div key={i} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:32 }}>
              <div style={{ background:'#13162A', border:`1px solid ${T.border}`, borderRadius:12, width:44, height:44, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
                {f.icon}
              </div>
              <div style={{ fontSize:18, fontWeight:700, color:T.text, marginBottom:10, letterSpacing:'-0.02em' }}>{f.title}</div>
              <div style={{ fontSize:14, color:T.sub, lineHeight:1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── CTA section ────────────────────────────────────────────── */
function CTASection() {
  return (
    <section id="cta" style={{ background:T.bg, padding:'120px 40px', fontFamily:font }}>
      <div style={{ maxWidth:860, margin:'0 auto', background:'linear-gradient(135deg, #0D0F24, #13162A)', border:`1px solid ${T.border}`, borderRadius:24, padding:80, textAlign:'center' }}>
        <h2 style={{ fontSize:'clamp(36px,5vw,56px)', fontWeight:700, letterSpacing:'-0.02em', color:T.text, lineHeight:1.1, margin:0 }}>
          Stop losing leads.
        </h2>
        <h2 style={{ fontSize:'clamp(36px,5vw,56px)', fontWeight:700, letterSpacing:'-0.02em', color:T.blue, lineHeight:1.1, margin:'0 0 20px' }}>
          Start compounding revenue.
        </h2>
        <p style={{ fontSize:18, color:T.sub, lineHeight:1.7, marginBottom:40, maxWidth:560, margin:'0 auto 40px' }}>
          See exactly how LeadsUp would convert your pipeline. 30 minutes, no pitch.
        </p>
        <a href="https://cal.com/leads-up" target="_blank" rel="noopener noreferrer"
          style={{ display:'inline-block', fontSize:16, fontWeight:600, color:'#FFFFFF', background:`linear-gradient(135deg, ${T.blue}, ${T.purple})`, padding:'14px 32px', borderRadius:99, textDecoration:'none', transition:'opacity 0.15s' }}
          onMouseOver={e=>e.currentTarget.style.opacity='0.85'}
          onMouseOut={e=>e.currentTarget.style.opacity='1'}>
          Book your strategy call →
        </a>
        <p style={{ fontSize:13, color:T.sub, marginTop:16 }}>No credit card · No commitment · Real revenue audit</p>
      </div>
    </section>
  )
}

/* ── Footer ─────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background:T.bg, borderTop:`1px solid ${T.border}`, padding:'32px 40px', fontFamily:font }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        {/* Left: logo */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <img src="/leadsup-icon.png" alt="" style={{ height:24, objectFit:'contain', display:'block' }}/>
          <img src="/leadsup-text.png" alt="Leadsup" style={{ height:18, objectFit:'contain', display:'block' }}/>
        </div>
        {/* Center: links */}
        <div style={{ display:'flex', alignItems:'center', gap:24 }}>
          {['Privacy','Terms','Support'].map(l => (
            <a key={l} href="#" style={{ fontSize:13, color:T.sub, textDecoration:'none', transition:'color 0.15s' }}
              onMouseOver={e=>e.currentTarget.style.color=T.text}
              onMouseOut={e=>e.currentTarget.style.color=T.sub}>{l}</a>
          ))}
        </div>
        {/* Right: copyright */}
        <div style={{ fontSize:13, color:T.sub }}>© 2026 Leads Up</div>
      </div>
    </footer>
  )
}

/* ── Root export ────────────────────────────────────────────── */
export default function Landing() {
  return (
    <div style={{ background:T.bg, minHeight:'100vh', fontFamily:font, backgroundImage:'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize:'60px 60px' }}>
      <style>{`
        .nav-burger { display: none; }
        @media (max-width: 767px) {
          .nav-burger { display: flex !important; }
        }
        @media (max-width: 1024px) {
          .system-cards { grid-template-columns: repeat(2, 1fr) !important; }
          .platform-cards { grid-template-columns: repeat(2, 1fr) !important; }
          .stat-col { border-right: none !important; border-left: none !important; border-bottom: 1px solid #1A1D2E; }
        }
        @media (max-width: 640px) {
          .system-cards { grid-template-columns: 1fr !important; }
          .platform-cards { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Navbar />
      <main style={{ paddingTop:60 }}>
        <Hero />
        <SocialProof />
        <Stats />
        <System />
        <Platform />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
