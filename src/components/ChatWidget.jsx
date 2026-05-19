import { useState, useRef, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const STEPS = [
  { key: 'business_type', question: "What kind of business do you run?" },
  { key: 'monthly_leads', question: "Roughly how many inbound leads do you get per month?" },
  { key: 'challenge',     question: "What's your biggest challenge right now — slow follow-up, missed calls, no-shows, or something else?" },
  { key: 'current_tools', question: "What tools are you currently using to manage leads or bookings?" },
  { key: 'name',          question: "What's your first name?" },
  { key: 'contact',       question: "Last thing — what's the best email or phone number to reach you?" },
]

const SYSTEM_PROMPT = `You are the AI advisor for Leads Up — a premium AI revenue system that converts inbound leads automatically for service businesses.

ABOUT LEADS UP:
- We respond to every lead in under 60 seconds, 24/7 via SMS, email, and chat
- We qualify leads, book appointments, recover lost revenue automatically
- Integrates with HubSpot, Salesforce, GoHighLevel, Jobber, ServiceTitan, Calendly, Stripe and 1000+ others
- Most clients go live within 48 hours
- 30-day guarantee: measurable improvement or we work for free

WHO WE ARE: An AI revenue system for service businesses — HVAC, plumbing, cleaning, landscaping, legal, dental, agencies. We replace slow manual follow-up with instant intelligent AI engagement.

WHY US: The average service business loses 78% of leads due to slow response. We fix that. AI trained on your specific business, not generic.

PRICING: Never give specific prices. Say pricing depends on complexity and the premium tier selected. Always invite them to book a strategy call for a custom quote.

RULES:
- Answer the question they asked in 2-3 sentences max
- Warm, professional, confident — trusted advisor not salesperson
- After answering, say: "Let me continue learning about your business —" then ask the next collection question`

export default function ChatWidget() {
  const [open, setOpen]       = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput]     = useState('')
  const [busy, setBusy]       = useState(false)
  const [step, setStep]       = useState(0)
  const [phase, setPhase]     = useState('collect')
  const [lead, setLead]       = useState({})
  const [badge, setBadge]     = useState(true)
  const [aiHistory, setAiHistory] = useState([])
  const [saved, setSaved]     = useState(false)
  const bottomRef             = useRef(null)

  useEffect(() => {
    if (open && messages.length === 0) {
      setTimeout(() => {
        addBot("Welcome! I'm the AI advisor for Leads Up — we help service businesses convert more inbound leads automatically, without hiring more staff.<br><br>Let me ask you a few quick questions to see how we can help.")
        setTimeout(() => addBot(STEPS[0].question), 900)
      }, 300)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, busy])

  function addBot(html) {
    setMessages(prev => [...prev, { role: 'bot', html }])
  }
  function addUser(text) {
    setMessages(prev => [...prev, { role: 'user', text }])
  }

  async function saveLead(leadData) {
    if (saved) return
    setSaved(true)
    try {
      await supabase.from('leads').insert([{
        name:          leadData.name || null,
        email:         leadData.contact?.includes('@') ? leadData.contact : null,
        phone:         leadData.contact && !leadData.contact.includes('@') ? leadData.contact : null,
        status:        'new',
        source:        'website_chat',
        value:         0,
        business_type: leadData.business_type || null,
        monthly_leads: leadData.monthly_leads || null,
        challenge:     leadData.challenge || null,
        current_tools: leadData.current_tools || null,
        notes:         `Business: ${leadData.business_type || '-'} | Leads/mo: ${leadData.monthly_leads || '-'} | Challenge: ${leadData.challenge || '-'} | Tools: ${leadData.current_tools || '-'}`,
        chat_source:   'website_chat',
      }])
    } catch (e) {
      console.error('Lead save failed:', e)
    }
  }

  async function answerQuestion(userText, currentLead) {
    const updatedHistory = [...aiHistory, { role: 'user', content: userText }]
    setAiHistory(updatedHistory)
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: updatedHistory,
      })
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
    return `<div style="background:linear-gradient(135deg,rgba(124,110,247,0.12),rgba(91,79,212,0.08));border:1px solid rgba(124,110,247,0.35);border-radius:12px;padding:14px 16px;margin-top:6px">
      <div style="font-size:14px;font-weight:600;color:#f0eeff;margin-bottom:4px">You're a great fit ✦</div>
      <div style="font-size:12px;color:#8b88a8;margin-bottom:12px;line-height:1.5">Book a free 30-minute strategy call. We'll walk you through exactly how Leads Up would work for your business — no commitment.</div>
      <a href="https://cal.com/leads-up" target="_blank" style="display:inline-block;background:linear-gradient(135deg,#7c6ef7,#5b4fd4);color:#fff;text-decoration:none;padding:9px 18px;border-radius:8px;font-size:13px;font-weight:600;font-family:inherit">Book your strategy call →</a>
    </div>`
  }

  function summaryCard(d) {
    const rows = [
      ['Name', d.name], ['Business', d.business_type], ['Monthly leads', d.monthly_leads],
      ['Challenge', d.challenge], ['Tools', d.current_tools], ['Contact', d.contact],
    ].filter(r => r[1]).map(([k, v]) =>
      `<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
        <span style="color:#8b88a8">${k}</span><span style="color:#f0eeff;font-weight:500">${v}</span>
      </div>`
    ).join('')
    return `<div style="background:#22222e;border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:12px 14px;margin-top:6px">
      <div style="font-size:10px;color:#5a5870;text-transform:uppercase;letter-spacing:1px;font-weight:600;margin-bottom:8px">Your profile</div>
      ${rows}
    </div>`
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
        // Store this answer
        currentLead[STEPS[step].key] = text
        setLead(currentLead)
        const nextStep = step + 1
        setStep(nextStep)

        await new Promise(r => setTimeout(r, 500))

        if (nextStep < STEPS.length) {
          addBot(STEPS[nextStep].question)
        } else {
          // All done — save and show booking
          setPhase('done')
          await saveLead(currentLead)
          const name = currentLead.name || 'there'
          addBot(`Thanks ${name}! Here's what I've collected:${summaryCard(currentLead)}<br>Based on what you've shared, you're a strong fit for Leads Up:${bookingCard()}`)
        }
      } else {
        // They asked a question — answer via AI then resume
        const answer = await answerQuestion(text, currentLead)
        addBot(answer.replace(/\n/g, '<br>'))

        // Resume collection if still collecting
        if (phase === 'collect' && step < STEPS.length) {
          await new Promise(r => setTimeout(r, 400))
          addBot(STEPS[step].question)
        }
      }
    } catch (e) {
      addBot("Something went wrong. Please try again.")
    }

    setBusy(false)
  }

  const progress = phase === 'done' ? 100 : Math.round((step / STEPS.length) * 100)
  const progressLabel = progress < 20 ? 'Getting started' : progress < 50 ? 'Qualifying' : progress < 85 ? 'Collecting info' : progress < 100 ? 'Almost done' : 'Ready!'

  return (
    <>
      <style>{`
        @keyframes chatSlideIn {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes typingBlink {
          0%, 60%, 100% { opacity: 0.25; transform: scale(1); }
          30% { opacity: 1; transform: scale(1.3); }
        }
        .chat-messages::-webkit-scrollbar { width: 3px; }
        .chat-messages::-webkit-scrollbar-thumb { background: #22222e; border-radius: 3px; }
        .chat-input:focus { border-color: #7c6ef7 !important; }
        .chat-input::placeholder { color: #5a5870; }
      `}</style>

      {/* ── Floating bubble ── */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>

        {/* ── Chat window ── */}
        {open && (
          <div style={{
            width: 380, maxWidth: 'calc(100vw - 48px)',
            height: 600,
            borderRadius: 16,
            border: '1px solid rgba(124,110,247,0.2)',
            background: '#111118',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 8px 48px rgba(0,0,0,0.6)',
            animation: 'chatSlideIn 0.2s ease',
          }}>

            {/* Header */}
            <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 11, background: 'linear-gradient(180deg,rgba(124,110,247,0.08) 0%,transparent 100%)', flexShrink: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#7c6ef7,#5b4fd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0 }}>L</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#f0eeff' }}>Leads Up Advisor</div>
                <div style={{ fontSize: 11, color: '#8b88a8', display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                  Online · Replies instantly
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ padding: '8px 18px 7px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#5a5870', marginBottom: 5 }}>
                <span>{progressLabel}</span><span>{progress}%</span>
              </div>
              <div style={{ height: 2, background: '#22222e', borderRadius: 2 }}>
                <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#7c6ef7,#a594f9)', borderRadius: 2, transition: 'width 0.5s ease' }} />
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                  {m.role === 'bot' && (
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#7c6ef7,#5b4fd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', fontWeight: 700, flexShrink: 0, marginBottom: 2 }}>L</div>
                  )}
                  <div
                    style={{
                      maxWidth: '80%', padding: '9px 13px', borderRadius: 13,
                      fontSize: 13.5, lineHeight: 1.6, wordBreak: 'break-word',
                      ...(m.role === 'bot'
                        ? { background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', color: '#f0eeff', borderBottomLeftRadius: 4 }
                        : { background: 'linear-gradient(135deg,#7c6ef7,#5b4fd4)', color: '#fff', borderBottomRightRadius: 4 })
                    }}
                    dangerouslySetInnerHTML={{ __html: m.role === 'bot' ? m.html : m.text.replace(/</g, '&lt;').replace(/>/g, '&gt;') }}
                  />
                </div>
              ))}

              {busy && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#7c6ef7,#5b4fd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', fontWeight: 700, flexShrink: 0 }}>L</div>
                  <div style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', padding: '10px 14px', borderRadius: 13, borderBottomLeftRadius: 4 }}>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      {[0, 0.18, 0.36].map((d, i) => (
                        <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#5a5870', display: 'inline-block', animation: `typingBlink 1.2s ${d}s infinite` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '10px 14px 13px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 8, flexShrink: 0 }}>
              <input
                className="chat-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !busy && send(input)}
                placeholder="Type a message…"
                style={{ flex: 1, background: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '9px 14px', fontSize: 13.5, color: '#f0eeff', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s' }}
              />
              <button
                onClick={() => send(input)}
                disabled={busy}
                style={{ width: 40, height: 40, borderRadius: 10, background: busy ? '#333' : 'linear-gradient(135deg,#7c6ef7,#5b4fd4)', border: 'none', cursor: busy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>

            <div style={{ textAlign: 'center', padding: '3px 0 8px', fontSize: 10, color: '#5a5870', flexShrink: 0 }}>
              Powered by <span style={{ color: '#a594f9' }}>Leads Up AI</span>
            </div>
          </div>
        )}

        {/* Bubble button */}
        <button
          onClick={() => { setOpen(o => !o); setBadge(false) }}
          style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg,#7c6ef7,#5b4fd4)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(124,110,247,0.5)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            position: 'relative',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(124,110,247,0.65)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,110,247,0.5)' }}
        >
          {open
            ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          }
          {badge && !open && (
            <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>1</span>
          )}
        </button>
      </div>
    </>
  )
}