'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { T, font } from './constants'

const items = [
  {
    q: 'What exactly does LeadsUp do?',
    a: 'Leads Up is an AI-powered lead conversion system. When a potential customer reaches out — by phone, text, web form, or email — Leads Up responds instantly, qualifies the lead, and either books them or routes them to your team. It works 24/7 so you never miss an opportunity.',
  },
  {
    q: 'How is this different from a marketing agency?',
    a: "A marketing agency brings leads to your door. Leads Up makes sure those leads actually turn into paying customers. We don't run ads — we convert the leads you're already getting but losing to slow response times or missed calls.",
  },
  {
    q: 'How fast can we go live?',
    a: 'Most businesses are fully set up within 48 hours. Our team handles the configuration, connects your existing tools, and trains the AI on your business before going live.',
  },
  {
    q: 'What tools do you integrate with?',
    a: 'Leads Up integrates with the tools you already use — including Google Calendar, HubSpot, Salesforce, GoHighLevel, Jobber, ServiceTitan, and more. If you use a CRM or scheduling tool, we almost certainly connect to it.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. All data is encrypted in transit and at rest. We are SOC 2 compliant and never share your customer data with third parties. Your data belongs to you.',
  },
  {
    q: "What if AI replies don't sound like our brand?",
    a: 'We train the AI on your tone, your services, and your business before going live. You review and approve the response templates. If anything sounds off, you can edit it anytime from your dashboard.',
  },
  {
    q: 'Do you offer a guarantee?',
    a: "Yes. If you don't see measurable improvement in lead response rate within the first 30 days, we'll work with you for free until you do. We stand behind the results.",
  },
]

export default function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            aria-expanded={openIdx === i}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '22px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: font }}
          >
            <span style={{ fontSize: 16, fontWeight: 500, color: T.text }}>{item.q}</span>
            <ChevronDown size={18} style={{ color: T.sub, flexShrink: 0, transform: openIdx === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>
          {openIdx === i && (
            <div style={{ fontSize: 15, color: T.sub, lineHeight: 1.75, paddingBottom: 22 }}>{item.a}</div>
          )}
        </div>
      ))}
    </div>
  )
}
