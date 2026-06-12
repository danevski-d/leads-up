'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../src/lib/supabase'

const ACCENT = '#6B8AFF'

// Your workspace token — this is YOUR marketing site form
// It routes leads into your own Leads Up workspace
const LEADS_UP_WORKSPACE_TOKEN = 'test-token-123'
const LEADS_UP_WORKSPACE_ID    = '8c00a710-b9c3-4b96-98d5-1bddb32b1e24'

const inputBase = {
  width: '100%', background: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#f0eeff',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s',
}
const selectStyle = { ...inputBase, cursor: 'pointer', paddingRight: 36, appearance: 'none', WebkitAppearance: 'none' }
const labelStyle  = { display: 'block', fontSize: 12, fontWeight: 600, color: '#8b88a8', marginBottom: 6 }

// Budget range → numeric midpoint for pipeline value
const BUDGET_VALUES = {
  'Under $1,000/mo':    500,
  '$1,000–$2,500/mo':  1750,
  '$2,500–$5,000/mo':  3750,
  '$5,000+/mo':        7500,
}

function ChevronDown() {
  return (
    <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5a5870" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export default function LeadFormModal() {
  const [open, setOpen]           = useState(false)
  const [step, setStep]           = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy]           = useState(false)
  const [form, setForm] = useState({
    fullName: '', email: '', company: '',
    businessType: '', monthlyLeads: '', budget: '', timeline: '',
  })

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

  useEffect(() => {
    if (!open) {
      setStep(1); setSubmitted(false)
      setForm({ fullName: '', email: '', company: '', businessType: '', monthlyLeads: '', budget: '', timeline: '' })
    }
  }, [open])

  const step1Valid = form.fullName.trim() !== '' && form.email.trim() !== '' && form.company.trim() !== ''
  const step2Valid = form.businessType !== '' && form.monthlyLeads !== '' && form.budget !== '' && form.timeline !== ''

  async function submit(e) {
    e.preventDefault()
    if (!step2Valid) return
    setBusy(true)

    try {
      // 1 — Insert lead with proper numeric value (no more $NaN)
      const { data: insertedLead, error } = await supabase.from('leads').insert([{
        name:          form.fullName     || null,
        email:         form.email        || null,
        company:       form.company      || null,
        status:        'new',
        source:        'lead_form',
        value:         null,
        budget_range:  form.budget       || null,
        business_type: form.businessType || null,
        monthly_leads: form.monthlyLeads || null,
        notes:         `Via lead form | Budget: ${form.budget} | Timeline: ${form.timeline}`,
        workspace_id:  LEADS_UP_WORKSPACE_ID,,
        // No hardcoded user_id — workspace_id + RLS is enough
      }]).select()

      if (error) console.error('Lead save failed:', error)

      // 2 — Trigger n8n for AI qualification + follow-up
      try {
        await fetch('/api/n8n-webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            workspace_token: LEADS_UP_WORKSPACE_TOKEN,
            lead_id:         insertedLead?.[0]?.id || null,
            source:          'lead_form',
            name:            form.fullName,
            email:           form.email,
            company:         form.company,
            business_type:   form.businessType,
            monthly_leads:   form.monthlyLeads,
            budget:          form.budget,
            timeline:        form.timeline,
            message:         `Business: ${form.businessType} | Leads/mo: ${form.monthlyLeads} | Budget: ${form.budget} | Timeline: ${form.timeline}`,
            priority:        form.timeline === 'Immediately' ? 'urgent' : 'normal',
          })
        })
      } catch (webhookErr) {
        console.error('n8n webhook failed (non-blocking):', webhookErr)
      }

    } catch (err) {
      console.error('Submit failed:', err)
    }

    setSubmitted(true)
    setBusy(false)
  }

  function field(key, e) { setForm(p => ({ ...p, [key]: e.target.value })) }
  function focusOn(e)    { e.target.style.borderColor = ACCENT }
  function focusOff(e)   { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }

  if (!open) return null

  return (
    <>
      <style>{`
        .lf-select option { background: #1a1a24; color: #f0eeff; }
        .lf-back:hover { border-color: ${ACCENT} !important; color: #f0eeff !important; }
      `}</style>

      <div
        style={{ position: 'fixed', inset: 0, zIndex: 99998, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
        onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
      >
        <div style={{ background: '#111118', border: '1px solid rgba(107,138,255,0.25)', borderRadius: 20, padding: '36px 32px', width: '100%', maxWidth: 460, position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.7)' }}>

          <button onClick={() => setOpen(false)} aria-label="Close"
            style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', color: '#5a5870', cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: '2px 6px', borderRadius: 6 }}>×</button>

          {!submitted ? (
            <>
              {/* Progress */}
              <div style={{ marginBottom: 26 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {step === 2
                      ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      : '1'}
                  </div>
                  <div style={{ flex: 1, height: 2, background: 'rgba(107,138,255,0.15)', margin: '0 8px', borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, background: ACCENT, transformOrigin: 'left', transform: step === 2 ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform 0.35s ease' }} />
                  </div>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: step === 2 ? ACCENT : 'rgba(107,138,255,0.12)', border: step === 2 ? 'none' : '2px solid rgba(107,138,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: step === 2 ? '#fff' : '#5a5870', flexShrink: 0, transition: 'all 0.3s ease' }}>2</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 4, paddingRight: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: step === 1 ? '#f0eeff' : ACCENT }}>Contact</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: step === 2 ? '#f0eeff' : '#5a5870' }}>Qualify</span>
                </div>
              </div>

              {/* Header */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: ACCENT, textTransform: 'uppercase', marginBottom: 8 }}>Step {step} of 2</div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f0eeff', margin: '0 0 7px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  {step === 1 ? 'Book your strategy call' : 'Tell us about your business'}
                </h2>
                <p style={{ fontSize: 13, color: '#8b88a8', margin: 0, lineHeight: 1.6 }}>
                  {step === 1 ? 'We will show you exactly how Leads Up converts your pipeline.' : 'Help us personalise your experience before the call.'}
                </p>
              </div>

              {/* Step 1 */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Full name <span style={{ color: ACCENT }}>*</span></label>
                    <input type="text" value={form.fullName} onChange={e => field('fullName', e)} placeholder="Jane Smith" required style={inputBase} onFocus={focusOn} onBlur={focusOff} />
                  </div>
                  <div>
                    <label style={labelStyle}>Business email <span style={{ color: ACCENT }}>*</span></label>
                    <input type="email" value={form.email} onChange={e => field('email', e)} placeholder="jane@company.com" required style={inputBase} onFocus={focusOn} onBlur={focusOff} />
                  </div>
                  <div>
                    <label style={labelStyle}>Company name <span style={{ color: ACCENT }}>*</span></label>
                    <input type="text" value={form.company} onChange={e => field('company', e)} placeholder="Acme Inc." required style={inputBase} onFocus={focusOn} onBlur={focusOff} />
                  </div>
                  <button type="button" onClick={() => { if (step1Valid) setStep(2) }} disabled={!step1Valid}
                    style={{ marginTop: 4, width: '100%', background: `linear-gradient(135deg, ${ACCENT}, #4f6ce8)`, color: '#fff', border: 'none', borderRadius: 12, padding: '13px 20px', fontSize: 15, fontWeight: 600, cursor: step1Valid ? 'pointer' : 'not-allowed', opacity: step1Valid ? 1 : 0.45, transition: 'opacity 0.2s' }}>
                    Next →
                  </button>
                  <p style={{ textAlign: 'center', fontSize: 12, color: '#5a5870', margin: 0 }}>No credit card · No commitment</p>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>What best describes your business? <span style={{ color: ACCENT }}>*</span></label>
                    <div style={{ position: 'relative' }}>
                      <select className="lf-select" value={form.businessType} onChange={e => field('businessType', e)} required style={selectStyle} onFocus={focusOn} onBlur={focusOff}>
                        <option value="" disabled>Select…</option>
                        {['B2B SaaS','Marketing Agency','Consulting / Coaching','Legal / Financial Services','Home Services','Recruiting / Staffing','Real Estate','Other'].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Monthly inbound leads? <span style={{ color: ACCENT }}>*</span></label>
                    <div style={{ position: 'relative' }}>
                      <select className="lf-select" value={form.monthlyLeads} onChange={e => field('monthlyLeads', e)} required style={selectStyle} onFocus={focusOn} onBlur={focusOff}>
                        <option value="" disabled>Select…</option>
                        {['Less than 50','50–200','200–500','500+'].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>What is your budget for this? <span style={{ color: ACCENT }}>*</span></label>
                    <div style={{ position: 'relative' }}>
                      <select className="lf-select" value={form.budget} onChange={e => field('budget', e)} required style={selectStyle} onFocus={focusOn} onBlur={focusOff}>
                        <option value="" disabled>Select…</option>
                        {Object.keys(BUDGET_VALUES).map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Timeline to start? <span style={{ color: ACCENT }}>*</span></label>
                    <div style={{ position: 'relative' }}>
                      <select className="lf-select" value={form.timeline} onChange={e => field('timeline', e)} required style={selectStyle} onFocus={focusOn} onBlur={focusOff}>
                        <option value="" disabled>Select…</option>
                        {['Immediately','Within 30 days','Within 90 days','Just exploring'].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <button type="button" onClick={() => setStep(1)} className="lf-back"
                      style={{ flexShrink: 0, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '13px 18px', fontSize: 15, fontWeight: 600, color: '#8b88a8', cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s' }}>
                      ← Back
                    </button>
                    <button type="submit" disabled={busy || !step2Valid}
                      style={{ flex: 1, background: `linear-gradient(135deg, ${ACCENT}, #4f6ce8)`, color: '#fff', border: 'none', borderRadius: 12, padding: '13px 20px', fontSize: 15, fontWeight: 600, cursor: (busy || !step2Valid) ? 'not-allowed' : 'pointer', opacity: (busy || !step2Valid) ? 0.45 : 1, transition: 'opacity 0.2s' }}>
                      {busy ? 'Saving…' : 'Book strategy call →'}
                    </button>
                  </div>
                  <p style={{ textAlign: 'center', fontSize: 12, color: '#5a5870', margin: 0 }}>No credit card · No commitment</p>
                </form>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg, ${ACCENT}, #4f6ce8)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f0eeff', margin: '0 0 10px', letterSpacing: '-0.02em' }}>You are all set!</h2>
              <p style={{ fontSize: 14, color: '#8b88a8', lineHeight: 1.6, marginBottom: 24 }}>Pick a time that works for you and we will walk you through exactly how Leads Up converts your pipeline.</p>
              <a href="https://cal.com/leads-up" target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-block', background: `linear-gradient(135deg, ${ACCENT}, #4f6ce8)`, color: '#fff', textDecoration: 'none', padding: '12px 28px', borderRadius: 12, fontSize: 15, fontWeight: 600 }}>
                Choose your time →
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  )
}