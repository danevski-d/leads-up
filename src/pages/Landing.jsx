import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Zap, Phone, MessageSquare, Calendar, ChevronDown, ChevronUp,
  ArrowRight, CheckCircle, RefreshCw, Target, Menu, X,
  PhoneCall, Mic
} from 'lucide-react'
import { faqs } from '../data/mockData'

const C = {
  bg:'#0D1117', bgSection:'#111827', card:'#111827', cardBorder:'#1F2937',
  primary:'#6366F1', primaryDark:'#7C3AED', primaryGlow:'rgba(99,102,241,0.55)',
  text:'#F9FAFB', textSub:'#9CA3AF', textMuted:'#4B5563',
  accent:'#818CF8', green:'#34D399', amber:'#FBBF24', rose:'#FB7185',
}

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

function TrialModal({ onClose }) {
  const [form, setForm] = useState({ name:'', company:'', role:'', email:'', size:'1-10', interest:'Both' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const field = { background:'#0D1117', border:'1px solid #1F2937', borderRadius:12, padding:'10px 16px', color:C.text, fontSize:14, width:'100%', outline:'none', transition:'border-color 0.15s' }
  const focus = e => e.target.style.borderColor = C.primary
  const blur  = e => e.target.style.borderColor = '#1F2937'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" style={{ background:'rgba(0,0,0,0.85)', backdropFilter:'blur(10px)' }}>
      <div className="w-full max-w-lg rounded-2xl p-6 relative overflow-y-auto" style={{ background:'#0D1117', border:'1px solid #1F2937', boxShadow:`0 0 80px -20px ${C.primaryGlow}`, maxHeight:'90vh' }}>
        <button onClick={onClose} style={{ position:'absolute', top:20, right:20, color:C.textMuted, background:'none', border:'none', cursor:'pointer', minWidth:32, minHeight:32 }}>
          <X size={18}/>
        </button>
        <h2 style={{ fontSize:20, fontWeight:700, color:C.text, marginBottom:4 }}>Start Free Trial</h2>
        <p style={{ fontSize:13, color:C.textMuted, marginBottom:20 }}>Tell us about your business to get set up.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {[
            {label:'Full Name', key:'name', type:'text', ph:'Jane Smith'},
            {label:'Company', key:'company', type:'text', ph:'Acme Services'},
            {label:'Role', key:'role', type:'text', ph:'Owner / Sales Lead'},
            {label:'Work Email', key:'email', type:'email', ph:'jane@company.com'},
          ].map(({label,key,type,ph}) => (
            <div key={key}>
              <label style={{ fontSize:11, fontWeight:600, color:C.textMuted, display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</label>
              <input type={type} value={form[key]} placeholder={ph} onChange={e=>set(key,e.target.value)} style={field} onFocus={focus} onBlur={blur}/>
            </div>
          ))}
          <div>
            <label style={{ fontSize:11, fontWeight:600, color:C.textMuted, display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Company Size</label>
            <select value={form.size} onChange={e=>set('size',e.target.value)} style={{...field,cursor:'pointer'}}>
              {['1-10','11-50','51-200','200+'].map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:11, fontWeight:600, color:C.textMuted, display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Interested In</label>
            <select value={form.interest} onChange={e=>set('interest',e.target.value)} style={{...field,cursor:'pointer'}}>
              {['Inbound Lead Conversion','Revenue Recovery','Both'].map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <p style={{ fontSize:11, color:C.textMuted, marginBottom:16 }}>By continuing you agree to our Terms & Privacy Policy.</p>
        <a href="https://cal.com/leads-up" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2"
          style={{ width:'100%', padding:'15px 24px', borderRadius:14, background:`linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, color:'white', fontWeight:700, fontSize:15, textDecoration:'none', boxShadow:`0 0 32px -8px ${C.primaryGlow}` }}>
          Book a Call <ArrowRight size={16}/>
        </a>
      </div>
    </div>
  )
}

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
          <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke={C.primary} strokeWidth={0.5-i*0.12} strokeOpacity={0.12-i*0.03}>
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
          <div style={{ width:72, height:72, borderRadius:'50%', margin:'0 auto', background:`linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 0 3px rgba(99,102,241,0.2), 0 0 50px -8px ${C.primaryGlow}, 0 0 0 6px rgba(99,102,241,0.06)` }}>
            <Zap size={28} color="white" strokeWidth={2.2}/>
          </div>
          <div style={{ marginTop:8 }}>
            <div style={{ fontSize:12, fontWeight:800, color:C.text, letterSpacing:'-0.01em' }}>Leads Up</div>
            <div style={{ fontSize:8.5, fontWeight:700, color:C.primary, letterSpacing:'0.14em', textTransform:'uppercase', marginTop:2 }}>AI ENGINE</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Navbar({ onOpenTrial }) {
  const [open, setOpen] = useState(false)
  const [logoErr, setLogoErr] = useState(false)
  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background:`${C.bg}E8`, borderBottom:'1px solid #1F2937', backdropFilter:'blur(20px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          {!logoErr ? (
            <img src="/leadsup-logo.jpg" alt="Leads Up" style={{ width:120, height:'auto', maxHeight:36, objectFit:'contain' }} onError={()=>setLogoErr(true)}/>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:`linear-gradient(135deg, ${C.primary}, ${C.primaryDark})` }}>
                <Zap size={15} color="white"/>
              </div>
              <span style={{ fontSize:15, fontWeight:700, color:C.text }}>Leads Up</span>
            </div>
          )}
        </Link>
        <div className="hidden md:flex items-center gap-7 text-sm">
          {[['#features','Features'],['#how-it-works','How It Works'],['#faq','FAQ']].map(([h,l])=>(
            <a key={h} href={h} style={{ color:C.textMuted, textDecoration:'none', transition:'color 0.15s' }}
              onMouseOver={e=>e.currentTarget.style.color=C.text} onMouseOut={e=>e.currentTarget.style.color=C.textMuted}>{l}</a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" style={{ fontSize:13, color:C.textMuted, textDecoration:'none', padding:'8px 16px', transition:'color 0.15s' }}
            onMouseOver={e=>e.currentTarget.style.color=C.text} onMouseOut={e=>e.currentTarget.style.color=C.textMuted}>
            Sign In
          </Link>
          <button onClick={onOpenTrial} style={{ fontSize:13, fontWeight:600, color:'white', padding:'9px 20px', borderRadius:12, border:'none', cursor:'pointer', background:`linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, boxShadow:`0 0 20px -6px ${C.primaryGlow}` }}>
            Get Started Free
          </button>
        </div>
        <button className="md:hidden" style={{ color:C.textMuted, background:'none', border:'none', cursor:'pointer', padding:8, minWidth:44, minHeight:44, display:'flex', alignItems:'center', justifyContent:'center' }} onClick={()=>setOpen(!open)}>
          {open ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-5 pt-3 space-y-2" style={{ borderTop:'1px solid #1F2937' }}>
          {[['#features','Features'],['#how-it-works','How It Works'],['#faq','FAQ']].map(([h,l])=>(
            <a key={h} href={h} className="block py-2.5 text-sm" style={{ color:C.textMuted }} onClick={()=>setOpen(false)}>{l}</a>
          ))}
          <Link to="/login" onClick={()=>setOpen(false)}
            className="block w-full py-3 text-center text-sm font-semibold rounded-xl"
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid #1F2937', color:C.accent, textDecoration:'none' }}>
            Sign In
          </Link>
          <button onClick={()=>{setOpen(false);onOpenTrial()}}
            className="block w-full py-3 text-center text-sm font-semibold text-white rounded-xl"
            style={{ background:`linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, border:'none', cursor:'pointer' }}>
            Get Started Free
          </button>
        </div>
      )}
    </nav>
  )
}

function Hero({ onOpenTrial }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0" style={{ background:`radial-gradient(ellipse 90% 65% at 50% -10%, rgba(99,102,241,0.2) 0%, transparent 65%), ${C.bg}` }}/>
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage:'radial-gradient(circle, #818CF8 1px, transparent 1px)', backgroundSize:'40px 40px' }}/>
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full" style={{ background:'rgba(99,102,241,0.12)', border:`1px solid rgba(99,102,241,0.3)`, fontSize:11, fontWeight:700, color:C.accent, letterSpacing:'0.08em', textTransform:'uppercase' }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:C.accent, display:'inline-block', animation:'pulse 2s infinite' }}/>
          AI Revenue System
        </div>
        <h1 style={{ fontSize:'clamp(1.9rem,5.5vw,3.75rem)', fontWeight:700, lineHeight:1.13, letterSpacing:'-0.02em', marginBottom:20, color:C.text }}>
          Never Miss a Lead.{' '}
          <span style={{ background:'linear-gradient(135deg, #818CF8, #C4B5FD, #67E8F9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            Never Lose Revenue.
          </span>
        </h1>
        <p style={{ fontSize:'clamp(0.9rem,1.3vw,1.1rem)', color:C.textSub, maxWidth:520, margin:'0 auto 32px', lineHeight:1.7 }}>
          Every inbound call, form, or message gets an AI response in under 60 seconds — qualified and booked directly to your calendar.{' '}
          <span style={{ color:C.accent }}>Around the clock.</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <a href="https://cal.com/leads-up" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2"
            style={{ padding:'14px 28px', borderRadius:14, background:`linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, color:'white', fontWeight:600, fontSize:15, textDecoration:'none', boxShadow:`0 0 40px -8px ${C.primaryGlow}` }}>
            Book a Demo <ArrowRight size={16}/>
          </a>
          <button onClick={onOpenTrial}
            className="inline-flex items-center justify-center gap-2"
            style={{ padding:'14px 28px', borderRadius:14, border:`1px solid rgba(255,255,255,0.12)`, color:C.accent, background:'rgba(255,255,255,0.04)', fontWeight:600, fontSize:15, cursor:'pointer' }}>
            Start Free Trial
          </button>
        </div>

        {/* Integration Hub — animated on ALL screen sizes */}
        <div style={{ padding:'2px', borderRadius:24, background:'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(124,58,237,0.1), rgba(99,102,241,0.05))' }}>
          <div style={{ borderRadius:22, padding:'24px 8px 12px', background:'rgba(13,17,23,0.9)', backdropFilter:'blur(12px)' }}>
            {/* Full animation — scaled down on mobile */}
            <div className="hidden sm:block">
              <IntegrationHub />
            </div>
            {/* Mobile — same animated diagram scaled to fit */}
            <div className="sm:hidden w-full" style={{ aspectRatio: '900/520', position: 'relative', overflow: 'visible' }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                transform: 'scale(0.42)',
                transformOrigin: 'top left',
                width: 'calc(100% / 0.42)',
                mheight: 'calc(100% / 0.42)',
              }}>
                <IntegrationHub />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mt-8">
          {[
            {n:'< 60s', l:'AI Response Time'},
            {n:'3.4x',  l:'More Bookings'},
            {n:'$2.6M', l:'Revenue Recovered'},
            {n:'94%',   l:'Lead Capture Rate'},
          ].map(({n,l})=>(
            <div key={l} className="text-center py-4 rounded-2xl" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid #1F2937' }}>
              <div style={{ fontSize:20, fontWeight:800, color:C.accent, marginBottom:3 }}>{n}</div>
              <div style={{ fontSize:10, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.08em' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Problem() {
  return (
    <section id="problem" className="py-16 md:py-24" style={{ background:C.bgSection }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="section-label">The Problem</div>
          <h2 style={{ fontSize:'clamp(1.7rem,3.5vw,2.4rem)', fontWeight:700, color:C.text, marginBottom:14, lineHeight:1.2 }}>
            Every Inbound Lead Is a{' '}
            <span style={{ background:'linear-gradient(135deg,#FCA5A5,#FBBF24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              Race You're Losing
            </span>
          </h2>
          <p style={{ color:C.textSub, fontSize:15, maxWidth:480, margin:'0 auto' }}>Speed is the only metric that matters when a new lead lands.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { stat:'78%', label:'of buyers hire the first to respond', desc:'The average business takes 47 hours to reply. By then, your lead has booked with someone else.', accent:'#FB7185' },
            { stat:'44%', label:'of reps give up after one follow-up', desc:'Manual outreach does not scale. Leads need instant replies and 5-7 follow-ups within 48 hours.', accent:'#FBBF24' },
            { stat:'68%', label:'of lost leads eventually buy elsewhere', desc:'Without automated reactivation, those contacts quietly become someone else revenue.', accent:'#34D399' },
          ].map(({ stat, label, desc, accent }) => (
            <div key={stat} className="p-7 rounded-2xl" style={{ background:C.card, border:`1px solid ${C.cardBorder}` }}>
              <div style={{ fontSize:48, fontWeight:900, color:accent, lineHeight:1, marginBottom:8 }}>{stat}</div>
              <div style={{ fontSize:13, fontWeight:600, color:C.textSub, marginBottom:10 }}>{label}</div>
              <p style={{ fontSize:13, color:C.textMuted, lineHeight:1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    { icon:Zap, label:'Instant AI Response', headline:'First reply in under 60 seconds.', desc:'Every form, SMS, or chat gets a personalized AI response before your competitor sees the notification. 24/7.', highlight:'< 60s response time', color:'#818CF8', bg:'rgba(129,140,248,0.1)' },
    { icon:Target, label:'Smart Qualification', headline:'Score and prioritize automatically.', desc:'The AI uncovers budget, timeline, and intent scoring each lead so your team focuses on what converts.', highlight:'0-100 lead scoring', color:'#67E8F9', bg:'rgba(103,232,249,0.1)' },
    { icon:Calendar, label:'Direct Booking', headline:'Booked calls, no back-and-forth.', desc:'Qualified leads choose from your real availability and book instantly. Syncs with Google and Outlook.', highlight:'Google & Outlook integration', color:'#34D399', bg:'rgba(52,211,153,0.1)' },
    { icon:MessageSquare, label:'Multi-touch Follow-up', headline:'14-day automated nurture.', desc:'Leads that do not respond enter smart SMS + email sequences, stopping the moment they engage.', highlight:'SMS + email sequences', color:'#FBBF24', bg:'rgba(251,191,36,0.1)' },
    { icon:RefreshCw, label:'Lead Reactivation', headline:'Wake up dormant contacts.', desc:'Automatically re-engage cold leads. Most clients recover 10-20% of previously lost leads in 30 days.', highlight:'10-20% win-back rate', color:'#F9A8D4', bg:'rgba(249,168,212,0.1)' },
  ]
  return (
    <section id="features" className="py-16 md:py-24" style={{ background:C.bg }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="section-label">Features</div>
          <h2 style={{ fontSize:'clamp(1.7rem,3.5vw,2.4rem)', fontWeight:700, color:C.text, lineHeight:1.2, marginBottom:14 }}>
            One Platform.{' '}
            <span style={{ background:`linear-gradient(135deg, ${C.accent}, #C4B5FD, #67E8F9)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              Every Inbound Lead. Booked.
            </span>
          </h2>
          <p style={{ fontSize:15, color:C.textSub, maxWidth:480, margin:'0 auto' }}>From the first ring or form to a confirmed appointment handled entirely by AI.</p>
        </div>
        <div className="mb-5 p-6 sm:p-8 rounded-3xl relative overflow-hidden" style={{ background:'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(99,102,241,0.06))', border:'1px solid rgba(124,58,237,0.25)', boxShadow:'0 0 60px -20px rgba(124,58,237,0.2)' }}>
          <div className="absolute top-4 right-4 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full" style={{ background:'rgba(124,58,237,0.15)', color:'#C4B5FD', border:'1px solid rgba(124,58,237,0.3)' }}>Featured</div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background:'rgba(124,58,237,0.15)' }}>
                  <Mic size={22} style={{ color:'#C4B5FD' }}/>
                </div>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#C4B5FD', marginBottom:4 }}>AI Receptionist</div>
                  <div style={{ fontSize:17, fontWeight:700, color:C.text }}>Answers Every Call. Books Every Lead.</div>
                </div>
              </div>
              <p style={{ color:C.textSub, lineHeight:1.7, marginBottom:16, fontSize:14 }}>When a prospect calls after hours our AI Receptionist picks up, qualifies the caller in a natural conversation, and books an appointment instantly.</p>
              <div className="flex flex-wrap gap-2">
                {['24/7 call answering','Natural AI conversation','Live call transfer','Instant booking'].map(t=>(
                  <span key={t} style={{ fontSize:11, padding:'5px 12px', borderRadius:99, background:'rgba(124,58,237,0.1)', color:'#C4B5FD', border:'1px solid rgba(124,58,237,0.2)', fontWeight:500 }}>{t}</span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-4 sm:p-5 mt-4 md:mt-0" style={{ background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background:'rgba(124,58,237,0.2)' }}>
                  <PhoneCall size={14} style={{ color:'#C4B5FD' }}/>
                </div>
                <div className="min-w-0">
                  <div style={{ fontSize:12, color:C.text, fontWeight:500 }}>Inbound Call - After Hours</div>
                  <div style={{ fontSize:10, color:C.textMuted }}>Unknown caller - Mobile</div>
                </div>
                <div style={{ marginLeft:'auto', fontSize:10, fontWeight:700, color:C.green, flexShrink:0 }}>Answered in 1s</div>
              </div>
              {[
                {from:'AI', msg:'Hi, thanks for calling! I am the AI assistant. How can I help you today?'},
                {from:'Lead', msg:'Hi, I need my AC serviced. Is someone available this week?'},
                {from:'AI', msg:'Absolutely! We have Thursday and Friday open. What is your address?'},
                {from:'Lead', msg:'412 Oak St and you can reach me at this number.'},
                {from:'AI', msg:'Perfect! Booked for Thursday at 10 AM. Confirmation SMS on its way.'},
              ].map(({from,msg},i)=>(
                <div key={i} style={{ marginBottom:10, textAlign:from==='Lead'?'right':'left' }}>
                  <div style={{ display:'inline-block', padding:'8px 12px', borderRadius:12, fontSize:11, maxWidth:'88%', background:from==='AI'?'rgba(124,58,237,0.14)':'rgba(255,255,255,0.06)', color:from==='AI'?'#C4B5FD':'#9CA3AF', border:`1px solid ${from==='AI'?'rgba(124,58,237,0.2)':'rgba(255,255,255,0.07)'}` }}>
                    {msg}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({icon:Icon,label,headline,desc,highlight,color,bg})=>(
            <div key={label} className="feature-card p-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background:bg }}>
                <Icon size={18} style={{ color }}/>
              </div>
              <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.09em', color, marginBottom:6 }}>{label}</div>
              <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:8 }}>{headline}</div>
              <p style={{ fontSize:13, color:C.textMuted, lineHeight:1.6, marginBottom:14 }}>{desc}</p>
              <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, color }}>
                <CheckCircle size={11}/>{highlight}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {n:'01',icon:Phone, title:'Lead Arrives', desc:'A call, form, SMS, or chat comes in from any source web, Google, Facebook, or a direct dial.'},
    {n:'02',icon:Zap, title:'AI Responds Instantly', desc:'Within seconds, the AI Receptionist or messaging engine sends a personalized, on-brand reply.'},
    {n:'03',icon:Target, title:'Qualifies & Scores', desc:'The AI gathers budget, timeline, and intent then assigns a priority score and routes the lead.'},
    {n:'04',icon:Calendar, title:'Books the Appointment', desc:'High-priority leads choose a time from your real availability and get a confirmed booking instantly.'},
  ]
  return (
    <section id="how-it-works" className="py-16 md:py-24" style={{ background:C.bgSection }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="section-label">How It Works</div>
          <h2 style={{ fontSize:'clamp(1.7rem,3.5vw,2.4rem)', fontWeight:700, color:C.text, lineHeight:1.2, marginBottom:14 }}>
            Inbound Lead to{' '}
            <span style={{ background:`linear-gradient(135deg, ${C.accent}, #C4B5FD)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              Booked Call
            </span>{' '}in Under 90 Seconds
          </h2>
          <p style={{ fontSize:15, color:C.textSub, maxWidth:440, margin:'0 auto' }}>Set up in one afternoon. Revenue starts flowing the same day.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map(({n,icon:Icon,title,desc},i)=>(
            <div key={n} className="p-6 rounded-2xl h-full" style={{ background:C.card, border:`1px solid ${C.cardBorder}` }}>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ width:40, height:40, borderRadius:12, background:'rgba(99,102,241,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={17} style={{ color:C.accent }}/>
                </div>
                <span style={{ fontSize:28, fontWeight:900, color:'#1F2937' }}>{n}</span>
              </div>
              <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:6 }}>{title}</div>
              <p style={{ fontSize:12, color:C.textMuted, lineHeight:1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 p-5 sm:p-6 rounded-2xl flex flex-wrap items-center gap-6 justify-between" style={{ background:'rgba(99,102,241,0.07)', border:'1px solid rgba(99,102,241,0.2)' }}>
          {[['< 60s','First AI response'],['< 90s','Lead qualified'],['< 5min','Appointment booked'],['0 mins','Manual work required']].map(([v,l])=>(
            <div key={l} className="text-center flex-1" style={{ minWidth:80 }}>
              <div style={{ fontSize:22, fontWeight:800, background:`linear-gradient(135deg, ${C.accent}, #C4B5FD)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{v}</div>
              <div style={{ fontSize:11, color:C.textMuted, marginTop:3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const [open, setOpen] = useState(null)
  const items = [
    ...faqs.slice(0,5),
    {q:'How does the AI Receptionist handle calls?', a:'It answers within 1 second, introduces your business, qualifies the caller through natural conversation, and offers direct booking. If needed, it warm-transfers to your team or takes a detailed message.'},
  ]
  return (
    <section id="faq" className="py-16 md:py-24" style={{ background:C.bg }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="section-label">FAQ</div>
          <h2 style={{ fontSize:'clamp(1.7rem,3vw,2.2rem)', fontWeight:700, color:C.text }}>Common Questions</h2>
        </div>
        <div className="space-y-2">
          {items.map(({q,a},i)=>(
            <div key={i} style={{ borderRadius:16, overflow:'hidden', background:open===i?'rgba(99,102,241,0.06)':C.card, border:`1px solid ${open===i?'rgba(99,102,241,0.25)':C.cardBorder}`, transition:'all 0.2s' }}>
              <button className="w-full text-left" style={{ padding:'18px 20px', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, background:'none', border:'none', cursor:'pointer', minHeight:56 }}
                onClick={()=>setOpen(open===i?null:i)}>
                <span style={{ fontSize:13, fontWeight:600, color:C.text, textAlign:'left' }}>{q}</span>
                {open===i ? <ChevronUp size={16} style={{ color:C.accent, flexShrink:0, marginTop:2 }}/> : <ChevronDown size={16} style={{ color:C.textMuted, flexShrink:0, marginTop:2 }}/>}
              </button>
              {open===i && (
                <div style={{ padding:'0 20px 18px', paddingTop:14, fontSize:13, color:C.textSub, lineHeight:1.7, borderTop:`1px solid ${C.cardBorder}` }}>{a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA({ onOpenTrial }) {
  return (
    <section className="py-16 md:py-24" style={{ background:C.bgSection }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="relative p-8 sm:p-12 rounded-3xl overflow-hidden" style={{ background:'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(124,58,237,0.07))', border:'1px solid rgba(99,102,241,0.25)', boxShadow:`0 0 80px -20px ${C.primaryGlow}` }}>
          <div className="absolute inset-0 opacity-25" style={{ background:'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,0.4) 0%, transparent 70%)' }}/>
          <div className="relative z-10">
            <div className="section-label justify-center mb-4">Ready to Scale?</div>
            <h2 style={{ fontSize:'clamp(1.7rem,3.5vw,2.4rem)', fontWeight:700, color:C.text, lineHeight:1.2, marginBottom:14 }}>
              Start Converting Inbound Leads<br/>
              <span style={{ background:`linear-gradient(135deg, ${C.accent}, #C4B5FD)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Into Booked Calls
              </span>
            </h2>
            <p style={{ fontSize:15, color:C.textSub, maxWidth:440, margin:'0 auto 32px' }}>Join 1,200+ service businesses. 14-day free trial. No credit card. Setup in under an hour.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <button onClick={onOpenTrial} className="flex items-center justify-center gap-2"
                style={{ padding:'15px 36px', borderRadius:14, background:`linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, color:'white', fontWeight:700, fontSize:16, border:'none', cursor:'pointer', boxShadow:`0 0 50px -8px ${C.primaryGlow}` }}>
                Get Started Free <ArrowRight size={17}/>
              </button>
              <a href="https://cal.com/leads-up" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
                style={{ padding:'15px 36px', borderRadius:14, border:'1px solid rgba(255,255,255,0.14)', color:C.accent, fontWeight:600, fontSize:16, textDecoration:'none' }}>
                Book a Demo
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {['14-day free trial','No credit card','Cancel anytime','Setup in under 1 hour'].map(f=>(
                <span key={f} className="flex items-center gap-1.5" style={{ fontSize:13, color:C.textMuted }}>
                  <CheckCircle size={12} color={C.green}/>{f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="pb-28 sm:pb-10" style={{ borderTop:`1px solid ${C.cardBorder}`, background:C.bg, paddingTop:36, paddingLeft:24, paddingRight:24 }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div style={{ width:24, height:24, borderRadius:6, background:`linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Zap size={13} color="white"/>
          </div>
          <span style={{ fontSize:14, fontWeight:700, color:C.text }}>Leads Up</span>
        </div>
        <div className="flex gap-6" style={{ fontSize:13, color:C.textMuted }}>
          <a href="#" style={{ color:C.textMuted, textDecoration:'none' }}>Privacy</a>
          <a href="#" style={{ color:C.textMuted, textDecoration:'none' }}>Terms</a>
          <a href="mailto:support@useleadsup.com" style={{ color:C.textMuted, textDecoration:'none' }}>Support</a>
        </div>
        <div style={{ fontSize:13, color:'#374151' }}>2026 Leads Up</div>
      </div>
    </footer>
  )
}

export default function Landing() {
  const [showTrialModal, setShowTrialModal] = useState(false)
  const openTrial = () => setShowTrialModal(true)
  return (
    <div style={{ minHeight:'100vh', background:C.bg }}>
      {showTrialModal && <TrialModal onClose={()=>setShowTrialModal(false)}/>}

      {/* Sticky mobile CTA — hidden on sm+ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden"
        style={{ background:'rgba(13,17,23,0.97)', borderTop:`1px solid ${C.cardBorder}`, backdropFilter:'blur(16px)', padding:'10px 16px 14px' }}>
        <a href="https://cal.com/leads-up" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-xl font-bold text-white text-sm"
          style={{ padding:'15px 20px', background:`linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, textDecoration:'none', boxShadow:`0 0 24px -6px ${C.primaryGlow}` }}>
          Book a Free Demo <ArrowRight size={15}/>
        </a>
      </div>

      <Navbar onOpenTrial={openTrial}/>
      <Hero onOpenTrial={openTrial}/>
      <Problem/>
      <Features/>
      <HowItWorks/>
      <FAQ/>
      <CTA onOpenTrial={openTrial}/>
      <Footer/>
    </div>
  )
}