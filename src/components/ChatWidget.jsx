import { useState, useRef, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const STEPS = [
  { key: 'business_type', question: "What kind of business do you run?" },
  { key: 'monthly_leads', question: "Roughly how many inbound leads do you get per month?" },
  { key: 'challenge', question: "What is your biggest challenge right now — slow follow-up, missed calls, no-shows, or something else?" },
  { key: 'current_tools', question: "What tools are you currently using to manage leads or bookings?" },
  { key: 'name', question: "What is your first name?" },
  { key: 'contact', question: "Last thing — what is the best email or phone number to reach you?" },
]

const SYSTEM_PROMPT = `You are the AI advisor for Leads Up — a premium AI revenue system that converts inbound leads automatically for service businesses.

ABOUT LEADS UP:
- Respond to every lead in under 60 seconds, 24/7 via SMS, email, and chat
- Qualify leads, book appointments, recover lost revenue automatically
- Integrates with HubSpot, Salesforce, GoHighLevel, Jobber, ServiceTitan, Calendly, Stripe and 1000+ others
- Most clients go live within 48 hours
- 30-day guarantee: measurable improvement or we work for free

WHO WE ARE: An AI revenue system for service businesses — HVAC, plumbing, cleaning, landscaping, legal, dental, agencies.

WHY US: The average service business loses 78% of leads due to slow response. We fix that.

PRICING: Never give specific prices. Say pricing depends on complexity and the premium tier. Invite them to book a strategy call.

RULES: Answer in 2-3 sentences max. Warm and professional tone. After answering any question, continue by asking the next collection question.`

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState('collect')
  const [lead, setLead] = useState({})
  const [badge, setBadge] = useState(true)
  const [aiHistory, setAiHistory] = useState([])
  const [saved, setSaved] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open && messages.length === 0) {
      setTimeout(() => {
        addBot("Welcome! I am the AI advisor for Leads Up — we help service businesses convert more inbound leads automatically, without hiring more staff.")
        setTimeout(() => addBot(STEPS[0].question), 800)
      }, 300)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, busy])

  function addBot(html) { setMessages(prev => [...prev, { role: 'bot', html }]) }
  function addUser(text) { setMessages(prev => [...prev, { role: 'user', text }]) }

  async function saveLead(d) {
    if (saved) return
    setSaved(true)
    try {
      await supabase.from('leads').insert([{
        name: d.name || null,
        email: d.contact?.includes('@') ? d.contact : null,
        phone: d.contact && !d.contact.includes('@') ? d.contact : null,
        status: 'new',
        source: 'website_chat',
        value: 0,
        business_type: d.business_type || null,
        monthly_leads: d.monthly_leads || null,
        challenge: d.challenge || null,
        current_tools: d.current_tools || null,
        notes: `Business: ${d.business_type || '-'} | Leads/mo: ${d.monthly_leads || '-'} | Challenge: ${d.challenge || '-'} | Tools: ${d.current_tools || '-'}`,
        chat_source: 'website_chat',
      }])
    } catch(e) { console.error('Lead save failed:', e) }
  }

  async function answerViaAI(text) {
    const updated = [...aiHistory, { role: 'user', content: text }]
    setAiHistory(updated)
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': import.meta.env.VITE_ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 300, system: SYSTEM_PROMPT, messages: updated })
    })
    const data = await res.json()
    const reply = data.content?.[0]?.text || "Our team will cover that on the strategy call."
    setAiHistory(prev => [...prev, { role: 'assistant', content: reply }])
    return reply
  }

  function isQuestion(t) {
    return /\?|who are you|what (do|is|are|does)|how (do|does|can)|why |pricing|price|cost|guarantee|integrat|tell me|explain|about you/i.test(t)
  }

  function bookingCard() {
    return `<div style="background:linear-gradient(135deg,rgba(124,110,247,0.15),rgba(91,79,212,0.1));border:1px solid rgba(124,110,247,0.4);border-radius:12px;padding:14px 16px;margin-top:8px"><div style="font-size:14px;font-weight:600;color:#f0eeff;margin-bottom:4px">You are a great fit</div><div style="font-size:12px;color:#8b88a8;margin-bottom:12px;line-height:1.5">Book a free 30-minute strategy call. We will show you exactly how Leads Up works for your business.</div><a href="https://cal.com/leads-up" target="_blank" style="display:inline-block;background:linear-gradient(135deg,#7c6ef7,#5b4fd4);color:#fff;text-decoration:none;padding:9px 18px;border-radius:8px;font-size:13px;font-weight:600">Book your strategy call</a></div>`
  }

  function summaryCard(d) {
    const rows = [['Name',d.name],['Business',d.business_type],['Monthly leads',d.monthly_leads],['Challenge',d.challenge],['Tools',d.current_tools],['Contact',d.contact]]
      .filter(r=>r[1])
      .map(([k,v])=>`<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.06)"><span style="color:#8b88a8">${k}</span><span style="color:#f0eeff;font-weight:500">${v}</span></div>`)
      .join('')
    return `<div style="background:#22222e;border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:12px 14px;margin-top:6px"><div style="font-size:10px;color:#5a5870;text-transform:uppercase;letter-spacing:1px;font-weight:600;margin-bottom:8px">Your profile</div>${rows}</div>`
  }

  async function send(text) {
    text = text.trim()
    if (!text || busy) return
    setBusy(true)
    setInput('')
    addUser(text)
    const currentLead = { ...lead }
    try {
      if (phase === 'collect' && !isQuestion(text)) {
        currentLead[STEPS[step].key] = text
        setLead(currentLead)
        const next = step + 1
        setStep(next)
        await new Promise(r => setTimeout(r, 500))
        if (next < STEPS.length) {
          addBot(STEPS[next].question)
        } else {
          setPhase('done')
          await saveLead(currentLead)
          addBot(`Thanks ${currentLead.name || 'for sharing'}! Here is what I collected:${summaryCard(currentLead)}<br><br>Based on this you are a strong fit:${bookingCard()}`)
        }
      } else {
        const answer = await answerViaAI(text)
        addBot(answer.replace(/\n/g,'<br>'))
        if (phase === 'collect' && step < STEPS.length) {
          await new Promise(r => setTimeout(r, 400))
          addBot(STEPS[step].question)
        }
      }
    } catch(e) { addBot("Something went wrong. Please try again.") }
    setBusy(false)
  }

  const progress = phase === 'done' ? 100 : Math.round((step / STEPS.length) * 100)

  return (
    <>
      <style>{`
        @keyframes chatIn { from{opacity:0;transform:translateY(12px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes blink { 0%,60%,100%{opacity:0.25} 30%{opacity:1} }
        .cwscroll::-webkit-scrollbar{width:3px} .cwscroll::-webkit-scrollbar-thumb{background:#22222e;border-radius:3px}
        .cwinput:focus{border-color:#7c6ef7 !important} .cwinput::placeholder{color:#5a5870}
      `}</style>
      <div style={{position:'fixed',bottom:24,right:24,zIndex:99999,display:'flex',flexDirection:'column',alignItems:'flex-end',gap:12}}>
        {open && (
          <div style={{width:370,maxWidth:'calc(100vw - 48px)',height:580,borderRadius:16,border:'1px solid rgba(124,110,247,0.2)',background:'#111118',display:'flex',flexDirection:'column',overflow:'hidden',boxShadow:'0 8px 48px rgba(0,0,0,0.6)',animation:'chatIn 0.2s ease'}}>
            <div style={{padding:'14px 18px',borderBottom:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',gap:11,background:'linear-gradient(180deg,rgba(124,110,247,0.08) 0%,transparent 100%)',flexShrink:0}}>
              <div style={{width:38,height:38,borderRadius:10,background:'linear-gradient(135deg,#7c6ef7,#5b4fd4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:700,color:'#fff',flexShrink:0}}>L</div>
              <div>
                <div style={{fontSize:14,fontWeight:600,color:'#f0eeff'}}>Leads Up Advisor</div>
                <div style={{fontSize:11,color:'#8b88a8',display:'flex',alignItems:'center',gap:5,marginTop:2}}>
                  <span style={{width:6,height:6,borderRadius:'50%',background:'#4ade80',display:'inline-block'}}/>Online · Replies instantly
                </div>
              </div>
            </div>
            <div style={{padding:'8px 18px 7px',borderBottom:'1px solid rgba(255,255,255,0.07)',flexShrink:0}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#5a5870',marginBottom:5}}>
                <span>{progress < 20?'Getting started':progress < 50?'Qualifying':progress < 85?'Collecting info':progress < 100?'Almost done':'Ready!'}</span>
                <span>{progress}%</span>
              </div>
              <div style={{height:2,background:'#22222e',borderRadius:2}}>
                <div style={{height:'100%',width:`${progress}%`,background:'linear-gradient(90deg,#7c6ef7,#a594f9)',borderRadius:2,transition:'width 0.5s ease'}}/>
              </div>
            </div>
            <div className="cwscroll" style={{flex:1,overflowY:'auto',padding:'14px 16px',display:'flex',flexDirection:'column',gap:10}}>
              {messages.map((m,i)=>(
                <div key={i} style={{display:'flex',gap:8,alignItems:'flex-end',flexDirection:m.role==='user'?'row-reverse':'row'}}>
                  {m.role==='bot'&&<div style={{width:26,height:26,borderRadius:7,background:'linear-gradient(135deg,#7c6ef7,#5b4fd4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'#fff',fontWeight:700,flexShrink:0,marginBottom:2}}>L</div>}
                  <div style={{maxWidth:'80%',padding:'9px 13px',borderRadius:13,fontSize:13.5,lineHeight:1.6,wordBreak:'break-word',...(m.role==='bot'?{background:'#1a1a24',border:'1px solid rgba(255,255,255,0.07)',color:'#f0eeff',borderBottomLeftRadius:4}:{background:'linear-gradient(135deg,#7c6ef7,#5b4fd4)',color:'#fff',borderBottomRightRadius:4})}}
                    dangerouslySetInnerHTML={{__html:m.role==='bot'?m.html:m.text.replace(/</g,'&lt;').replace(/>/g,'&gt;')}}/>
                </div>
              ))}
              {busy&&(
                <div style={{display:'flex',gap:8,alignItems:'flex-end'}}>
                  <div style={{width:26,height:26,borderRadius:7,background:'linear-gradient(135deg,#7c6ef7,#5b4fd4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'#fff',fontWeight:700,flexShrink:0}}>L</div>
                  <div style={{background:'#1a1a24',border:'1px solid rgba(255,255,255,0.07)',padding:'10px 14px',borderRadius:13,borderBottomLeftRadius:4}}>
                    <div style={{display:'flex',gap:4,alignItems:'center'}}>
                      {[0,0.18,0.36].map((d,i)=><span key={i} style={{width:6,height:6,borderRadius:'50%',background:'#5a5870',display:'inline-block',animation:`blink 1.2s ${d}s infinite`}}/>)}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef}/>
            </div>
            <div style={{padding:'10px 14px 13px',borderTop:'1px solid rgba(255,255,255,0.07)',display:'flex',gap:8,flexShrink:0}}>
              <input className="cwinput" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!busy&&send(input)} placeholder="Type a message…"
                style={{flex:1,background:'#1a1a24',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,padding:'9px 14px',fontSize:13.5,color:'#f0eeff',fontFamily:'inherit',outline:'none',transition:'border-color 0.2s'}}/>
              <button onClick={()=>send(input)} disabled={busy}
                style={{width:40,height:40,borderRadius:10,background:busy?'#333':'linear-gradient(135deg,#7c6ef7,#5b4fd4)',border:'none',cursor:busy?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
            <div style={{textAlign:'center',padding:'3px 0 8px',fontSize:10,color:'#5a5870',flexShrink:0}}>Powered by <span style={{color:'#a594f9'}}>Leads Up AI</span></div>
          </div>
        )}
        <button onClick={()=>{setOpen(o=>!o);setBadge(false)}}
          style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg,#7c6ef7,#5b4fd4)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 20px rgba(124,110,247,0.5)',position:'relative'}}>
          {open
            ?<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            :<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
          {badge&&!open&&<span style={{position:'absolute',top:-4,right:-4,background:'#ef4444',color:'#fff',borderRadius:'50%',width:18,height:18,fontSize:11,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>1</span>}
        </button>
      </div>
    </>
  )
}
