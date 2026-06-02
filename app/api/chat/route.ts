import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { messages, system, qualify, lead } = await req.json()

  if (qualify && lead) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: `You are a lead qualification AI for Leads Up. Evaluate this lead and respond ONLY with valid JSON, no extra text:\n\n{"score":0-100,"outcome":"book_meeting|send_followup|save_only","qualified":true/false,"closing_message":"warm personalized 2-3 sentence message to the lead","reason":"brief internal note"}\n\nSCORING:\n- Monthly leads >= 50 = +25pts\n- Monthly leads 20-49 = +15pts\n- Monthly leads 10-19 = +8pts\n- Monthly leads < 10 = +0pts\n- Real pain point = +25pts\n- Using a CRM = +20pts\n- Valid email or phone = +20pts\n- Clear urgency = +10pts\n\nbook_meeting if score >= 70, send_followup if 40-69, save_only if < 40`,
        messages: [{ role: 'user', content: `Qualify this lead:\n\nBusiness: ${lead.business_type}\nMonthly leads: ${lead.monthly_leads}\nChallenge: ${lead.challenge}\nTools: ${lead.current_tools}\nName: ${lead.name}\nContact: ${lead.contact}` }]
      })
    })
    const data = await res.json()
    const text = data.content?.[0]?.text || '{}'
    try {
      return NextResponse.json(JSON.parse(text))
    } catch {
      return NextResponse.json({ score: 0, outcome: 'save_only', qualified: false, closing_message: 'Thank you for reaching out! We will be in touch.', reason: 'parse error' })
    }
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_KEY!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 300, system, messages })
  })
  const data = await res.json()
  return NextResponse.json(data)
}
