'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const FIELDS = [
  { key: 'name',          label: 'First name',                        required: true,  placeholder: 'Jane' },
  { key: 'contact',       label: 'Email or phone',                    required: true,  placeholder: 'jane@company.com' },
  { key: 'business_type', label: 'What kind of business do you run?', required: false, placeholder: 'HVAC, cleaning, legal…' },
  { key: 'monthly_leads', label: 'How many inbound leads per month?', required: false, placeholder: '50, 200, 500+' },
]

const inputStyle = {
  width: '100%', background: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#f0eeff',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s',
}

export default function LeadFormModal() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', contact: '', business_type: '', monthly_leads: '' })
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    window.__openLeadForm = () => setOpen(true)
    return () => { delete window.__openLeadForm }
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [open])

  async function submit(e) {
    e.preventDefault()
    if (!form.name || !form.contact) return
    setBusy(true)
    try {
      await supabase.from('leads').insert([{
        name: form.name || null,
        email: form.contact?.includes('@') ? form.contact : null,
        phone: form.contact && !form.contact.includes('@') ? form.contact : null,
        status: 'new',
        source: 'lead_form',
        value: 0,
        business_type: form.business_type || null,
        monthly_leads: form.monthly_leads || null,
        notes: `Via lead form | Business: ${form.business_type || '-'} | Leads/mo: ${form.monthly_leads || '-'}`,
        chat_source: 'website_form',
        user_id: 'af90ab79-739c-4483-9cf3-d6ffbdd67fa1',
        workspace_id: '8c00a710-b9c3-4b96-98d5-1bddb32b1e24',
      }])
    } catch(err) { console.error('Lead save failed:', err) }
    setSubmitted(true)
    setBusy(false)
  }

  if (!open) return null

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 99998, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
    >
      <div style={{ background: '#111118', border: '1px solid rgba(124,110,247,0.25)', borderRadius: 20, padding: '36px 32px', width: '100%', maxWidth: 460, position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.7)', animation: 'chatIn 0.18s ease' }}>
        <button
          onClick={() => setOpen(false)}
          style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', color: '#5a5870', cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: '2px 6px', borderRadius: 6 }}
          aria-label="Close"
        >×</button>

        {!submitted ? (
          <>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#7c6ef7', textTransform: 'uppercase', marginBottom: 10 }}>Get started free</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0eeff', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>Book your strategy call</h2>
              <p style={{ fontSize: 14, color: '#8b88a8', marginTop: 8, lineHeight: 1.6, marginBottom: 0 }}>Tell us about your business — we will show you exactly how Leads Up converts your pipeline.</p>
            </div>

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {FIELDS.map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8b88a8', marginBottom: 6 }}>
                    {f.label}{f.required && <span style={{ color: '#7c6ef7', marginLeft: 2 }}>*</span>}
                  </label>
                  <input
                    type="text"
                    value={form[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    required={f.required}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#7c6ef7'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={busy || !form.name || !form.contact}
                style={{ marginTop: 6, background: 'linear-gradient(135deg,#7c6ef7,#5b4fd4)', color: '#fff', border: 'none', borderRadius: 12, padding: '13px 20px', fontSize: 15, fontWeight: 600, cursor: busy ? 'not-allowed' : 'pointer', opacity: (busy || !form.name || !form.contact) ? 0.55 : 1, transition: 'opacity 0.2s' }}
              >
                {busy ? 'Saving…' : 'Book strategy call →'}
              </button>
              <p style={{ textAlign: 'center', fontSize: 12, color: '#5a5870', margin: 0 }}>No credit card · No commitment</p>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#7c6ef7,#5b4fd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f0eeff', margin: '0 0 10px', letterSpacing: '-0.02em' }}>You are all set!</h2>
            <p style={{ fontSize: 14, color: '#8b88a8', lineHeight: 1.6, marginBottom: 24 }}>Pick a time that works for you and we will walk you through exactly how Leads Up converts your pipeline.</p>
            <a
              href="https://cal.com/leads-up"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', background: 'linear-gradient(135deg,#7c6ef7,#5b4fd4)', color: '#fff', textDecoration: 'none', padding: '12px 28px', borderRadius: 12, fontSize: 15, fontWeight: 600 }}
            >
              Choose your time →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
