import { useState, useEffect } from 'react'
import { Check, Mail, MessageSquare, Calendar, Zap, Bell, User, Shield, Plug } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const font = "system-ui,-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif"
const card = { background: '#FFFFFF', border: '1px solid #E8E8E8', borderRadius: 14 }

const TABS = [
  { id: 'profile',       label: 'Profile',       icon: User },
  { id: 'integrations',  label: 'Integrations',  icon: Plug },
  { id: 'ai',            label: 'AI Settings',   icon: Zap },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security',      label: 'Security',      icon: Shield },
]

const inputStyle = {
  width: '100%', background: '#FFFFFF', border: '1px solid #E8E8E8',
  borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#0A0A0A',
  outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box', fontFamily: font,
}

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      style={{ position: 'relative', flexShrink: 0, width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer', background: checked ? '#2563EB' : '#E8E8E8', transition: 'background 0.2s', minWidth: 44, minHeight: 24 }}>
      <div style={{ position: 'absolute', top: 2, width: 20, height: 20, background: '#FFFFFF', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.15)', transition: 'transform 0.2s', transform: checked ? 'translateX(22px)' : 'translateX(2px)' }} />
    </button>
  )
}

function ProfileTab() {
  const { user, profile, refetchProfile } = useAuth()
  const [form, setForm] = useState({ full_name: '', phone: '', company: '', timezone: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    setForm({
      full_name: profile?.full_name || '',
      phone:     profile?.phone     || '',
      company:   profile?.company   || '',
      timezone:  profile?.timezone  || '',
    })
  }, [profile])

  const handleSave = async () => {
    if (!user) return
    setSaving(true); setErr(''); setSaved(false)
    const { error } = await supabase.from('profiles').upsert({
      id: user.id, ...form, updated_at: new Date().toISOString(),
    })
    if (error) setErr(error.message)
    else { setSaved(true); refetchProfile(); setTimeout(() => setSaved(false), 3000) }
    setSaving(false)
  }

  const initials = form.full_name
    ? form.full_name.split(' ').map(w => w[0]?.toUpperCase() ?? '').slice(0, 2).join('')
    : user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ ...card, padding: '20px 24px', fontFamily: font }}>
        <h3 style={{ fontWeight: 600, fontSize: 15, color: '#0A0A0A', marginBottom: 20, marginTop: 0 }}>Account Details</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#0A0A0A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.full_name || user?.email}</div>
            <div style={{ fontSize: 12, color: '#9B9B9B', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          </div>
        </div>

        {err && <div style={{ marginBottom: 14, fontSize: 13, borderRadius: 10, padding: '10px 14px', color: '#EF4444', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>{err}</div>}

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: '#9B9B9B', display: 'block', marginBottom: 6 }}>Email (from login)</label>
          <input value={user?.email || ''} disabled style={{ ...inputStyle, background: '#FAFAFA', color: '#9B9B9B', cursor: 'not-allowed' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }} className="sm:grid-cols-2">
          {[
            { label: 'Full Name',  key: 'full_name',  placeholder: 'Jane Smith' },
            { label: 'Phone',      key: 'phone',      placeholder: '+1 (555) 000-0000' },
            { label: 'Company',    key: 'company',    placeholder: 'Acme Services LLC' },
            { label: 'Time Zone',  key: 'timezone',   placeholder: 'America/New_York' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label style={{ fontSize: 12, color: '#9B9B9B', display: 'block', marginBottom: 6 }}>{label}</label>
              <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563EB'}
                onBlur={e => e.target.style.borderColor = '#E8E8E8'} />
            </div>
          ))}
        </div>

        <button onClick={handleSave} disabled={saving}
          style={{ marginTop: 20, fontSize: 13, padding: '10px 20px', borderRadius: 10, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 7, minHeight: 44, fontFamily: font, transition: 'all 0.15s', border: saved ? '1px solid rgba(16,185,129,0.3)' : 'none', background: saved ? 'rgba(16,185,129,0.08)' : '#2563EB', color: saved ? '#10B981' : '#FFFFFF' }}>
          {saving ? 'Saving...' : saved ? <><Check size={14} /> Saved</> : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

function IntegrationsTab() {
  const [connected, setConnected] = useState({ gmail: false, twilio: false, gcal: false, hubspot: false, zapier: false, outlook: false })

  const groups = [
    { group: 'Email', icon: Mail, items: [
      { key: 'gmail',   name: 'Gmail / Google Workspace', desc: 'Send and receive emails through Gmail' },
      { key: 'outlook', name: 'Microsoft Outlook',        desc: 'Connect your Outlook or Office 365 inbox' },
    ]},
    { group: 'SMS', icon: MessageSquare, items: [
      { key: 'twilio', name: 'Twilio SMS', desc: 'Send two-way SMS messages to leads' },
    ]},
    { group: 'Calendar', icon: Calendar, items: [
      { key: 'gcal',    name: 'Google Calendar', desc: 'Auto-book appointments and sync availability' },
      { key: 'outlook', name: 'Outlook Calendar', desc: 'Sync with Microsoft 365 calendar' },
    ]},
    { group: 'CRM & Automation', icon: Plug, items: [
      { key: 'hubspot', name: 'HubSpot CRM', desc: 'Sync leads, deals, and contacts bidirectionally' },
      { key: 'zapier',  name: 'Zapier',      desc: 'Connect to 5,000+ apps via Zapier' },
    ]},
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: font }}>
      {groups.map(({ group, icon: Icon, items }) => (
        <div key={group} style={{ ...card, padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Icon size={14} style={{ color: '#9B9B9B' }} />
            <h3 style={{ fontWeight: 600, fontSize: 14, color: '#0A0A0A', margin: 0 }}>{group}</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map(({ key, name, desc }) => (
              <div key={key+name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 14px', background: '#FAFAFA', borderRadius: 10, border: '1px solid #E8E8E8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <div style={{ width: 36, height: 36, background: '#EFF6FF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={14} style={{ color: '#2563EB' }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#0A0A0A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
                    <div style={{ fontSize: 11, color: '#9B9B9B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="hidden sm:block">{desc}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {connected[key] && <span style={{ fontSize: 11, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4 }} className="hidden sm:flex"><Check size={11}/> Connected</span>}
                  <button onClick={() => setConnected(c => ({ ...c, [key]: !c[key] }))}
                    style={{ fontSize: 12, padding: '6px 12px', borderRadius: 8, fontWeight: 500, cursor: 'pointer', minHeight: 34, fontFamily: font, transition: 'all 0.15s', background: connected[key] ? 'rgba(239,68,68,0.08)' : '#EFF6FF', color: connected[key] ? '#EF4444' : '#2563EB', border: connected[key] ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(37,99,235,0.2)' }}>
                    {connected[key] ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function AISettingsTab() {
  const [settings, setSettings] = useState({ autoRespond: true, qualify: true, followUp: true, reactivate: true, businessHours: false })
  const toggle = k => setSettings(s => ({ ...s, [k]: !s[k] }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: font }}>
      <div style={{ ...card, padding: '20px 24px' }}>
        <h3 style={{ fontWeight: 600, fontSize: 15, color: '#0A0A0A', marginBottom: 4, marginTop: 0 }}>AI Behavior</h3>
        <p style={{ fontSize: 13, color: '#9B9B9B', marginBottom: 20 }}>Control how the AI interacts with your leads</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { key:'autoRespond',   label:'Auto-Respond to New Leads',    desc:'Send an immediate personalized reply to every new inbound lead' },
            { key:'qualify',       label:'Automatic Lead Qualification',  desc:'Conduct qualification conversations and score leads automatically' },
            { key:'followUp',      label:'Automated Follow-up Sequences', desc:'Enroll unresponsive leads in multi-touch follow-up campaigns' },
            { key:'reactivate',    label:'Dormant Lead Reactivation',     desc:'Automatically re-engage contacts that haven\'t been active in 30+ days' },
            { key:'businessHours', label:'Restrict to Business Hours',    desc:'Only send AI messages between 8 AM – 8 PM in the lead\'s time zone' },
          ].map(({ key, label, desc }) => (
            <div key={key} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#0A0A0A' }}>{label}</div>
                <div style={{ fontSize: 12, color: '#9B9B9B', marginTop: 2 }} className="hidden sm:block">{desc}</div>
              </div>
              <Toggle checked={settings[key]} onChange={() => toggle(key)} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...card, padding: '20px 24px' }}>
        <h3 style={{ fontWeight: 600, fontSize: 15, color: '#0A0A0A', marginBottom: 4, marginTop: 0 }}>Response Template</h3>
        <p style={{ fontSize: 13, color: '#9B9B9B', marginBottom: 16 }}>Customize the AI's first message</p>
        <textarea
          defaultValue="Hi {first_name}! Thanks for reaching out to {business_name}. I'm here to help get your {service} project started. Can I ask a few quick questions?"
          rows={4}
          style={{ ...inputStyle, resize: 'none' }}
          onFocus={e => e.target.style.borderColor = '#2563EB'}
          onBlur={e => e.target.style.borderColor = '#E8E8E8'}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          <button style={{ background: '#2563EB', color: '#FFFFFF', fontSize: 13, padding: '8px 16px', borderRadius: 10, fontWeight: 600, border: 'none', cursor: 'pointer', minHeight: 40, fontFamily: font, transition: 'background 0.15s' }}
            onMouseOver={e => e.currentTarget.style.background = '#1D4ED8'}
            onMouseOut={e => e.currentTarget.style.background = '#2563EB'}>Save Template</button>
          <button style={{ background: '#FAFAFA', color: '#6B6B6B', fontSize: 13, padding: '8px 16px', borderRadius: 10, border: '1px solid #E8E8E8', cursor: 'pointer', minHeight: 40, fontFamily: font, transition: 'border-color 0.15s' }}
            onMouseOver={e => e.currentTarget.style.borderColor = '#D1D5DB'}
            onMouseOut={e => e.currentTarget.style.borderColor = '#E8E8E8'}>Reset</button>
        </div>
      </div>
    </div>
  )
}

function NotificationsTab() {
  const [s, setS] = useState({ newLead: true, booked: true, qualified: true, lost: false, weekly: true, reactivation: false })
  const toggle = k => setS(prev => ({ ...prev, [k]: !prev[k] }))

  return (
    <div style={{ ...card, padding: '20px 24px', fontFamily: font }}>
      <h3 style={{ fontWeight: 600, fontSize: 15, color: '#0A0A0A', marginBottom: 4, marginTop: 0 }}>Notification Preferences</h3>
      <p style={{ fontSize: 13, color: '#9B9B9B', marginBottom: 20 }}>Choose what triggers a notification</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[
          { key:'newLead',      label:'New lead arrives',              desc:'Get notified when a new lead is captured' },
          { key:'booked',       label:'Appointment booked',            desc:'When a lead books a time on your calendar' },
          { key:'qualified',    label:'Lead qualified',                desc:'When AI marks a lead as qualified (score ≥ 80)' },
          { key:'lost',         label:'Lead marked lost',              desc:'When a lead enters the Lost stage' },
          { key:'weekly',       label:'Weekly report digest',          desc:'A weekly summary of pipeline performance' },
          { key:'reactivation', label:'Reactivation campaign results', desc:'Summary of dormant lead re-engagement results' },
        ].map(({ key, label, desc }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#0A0A0A' }}>{label}</div>
              <div style={{ fontSize: 12, color: '#9B9B9B', marginTop: 2 }} className="hidden sm:block">{desc}</div>
            </div>
            <Toggle checked={s[key]} onChange={() => toggle(key)} />
          </div>
        ))}
      </div>
    </div>
  )
}

function SecurityTab() {
  const [pw, setPw] = useState({ next: '', confirm: '' })
  const [msg, setMsg] = useState(''); const [err, setErr] = useState('')

  const handleChange = async () => {
    setMsg(''); setErr('')
    if (pw.next !== pw.confirm) { setErr('Passwords do not match.'); return }
    if (pw.next.length < 8) { setErr('Minimum 8 characters.'); return }
    const { error } = await supabase.auth.updateUser({ password: pw.next })
    if (error) setErr(error.message)
    else { setMsg('Password updated.'); setPw({ next: '', confirm: '' }) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: font }}>
      <div style={{ ...card, padding: '20px 24px' }}>
        <h3 style={{ fontWeight: 600, fontSize: 15, color: '#0A0A0A', marginBottom: 16, marginTop: 0 }}>Change Password</h3>
        {err && <div style={{ marginBottom: 12, fontSize: 12, borderRadius: 10, padding: '10px 14px', color: '#EF4444', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>{err}</div>}
        {msg && <div style={{ marginBottom: 12, fontSize: 12, borderRadius: 10, padding: '10px 14px', color: '#10B981', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>{msg}</div>}
        {[
          { label: 'New Password',         key: 'next' },
          { label: 'Confirm New Password', key: 'confirm' },
        ].map(({ label, key }) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: '#9B9B9B', display: 'block', marginBottom: 6 }}>{label}</label>
            <input type="password" value={pw[key]} onChange={e => setPw(p => ({ ...p, [key]: e.target.value }))} style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#2563EB'}
              onBlur={e => e.target.style.borderColor = '#E8E8E8'} />
          </div>
        ))}
        <button onClick={handleChange} style={{ marginTop: 8, background: '#2563EB', color: '#FFFFFF', fontSize: 13, padding: '10px 20px', borderRadius: 10, fontWeight: 600, border: 'none', cursor: 'pointer', minHeight: 44, fontFamily: font, transition: 'background 0.15s' }}
          onMouseOver={e => e.currentTarget.style.background = '#1D4ED8'}
          onMouseOut={e => e.currentTarget.style.background = '#2563EB'}>
          Update Password
        </button>
      </div>
      <div style={{ ...card, padding: '20px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#0A0A0A' }}>Two-Factor Authentication</div>
            <div style={{ fontSize: 13, color: '#9B9B9B', marginTop: 2 }}>Add an extra layer of security</div>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(16,185,129,0.08)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)', fontSize: 13, padding: '10px 16px', borderRadius: 10, fontWeight: 500, cursor: 'pointer', minHeight: 44, alignSelf: 'flex-start', fontFamily: font, transition: 'background 0.15s' }}
            className="sm:self-auto"
            onMouseOver={e => e.currentTarget.style.background = 'rgba(16,185,129,0.14)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(16,185,129,0.08)'}>
            <Shield size={14} /> Enable 2FA
          </button>
        </div>
      </div>
    </div>
  )
}

const tabContent = { profile: ProfileTab, integrations: IntegrationsTab, ai: AISettingsTab, notifications: NotificationsTab, security: SecurityTab }

export default function Settings() {
  const [active, setActive] = useState('profile')
  const ActiveTab = tabContent[active]

  return (
    <div style={{ padding: '16px', maxWidth: 960, margin: '0 auto', fontFamily: font }} className="sm:p-5 md:p-6">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0A0A0A', margin: 0, letterSpacing: '-0.02em' }}>Settings</h1>
        <p style={{ fontSize: 13, color: '#9B9B9B', marginTop: 4 }}>Manage your account, integrations, and AI configuration</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="md:flex-row md:gap-5">
        {/* Tab nav */}
        <div style={{ flexShrink: 0 }} className="md:w-48">
          <nav style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 4, WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
            className="md:flex-col md:overflow-visible md:pb-0 md:space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActive(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 12px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                  cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                  fontFamily: font, transition: 'all 0.15s', textAlign: 'left',
                  minHeight: 44,
                  background: active === id ? '#EFF6FF' : 'transparent',
                  color: active === id ? '#2563EB' : '#9B9B9B',
                  border: active === id ? '1px solid rgba(37,99,235,0.2)' : '1px solid transparent',
                }}
                className="md:w-full md:flex-shrink"
                onMouseOver={e => { if (active !== id) { e.currentTarget.style.background = '#F5F5F5'; e.currentTarget.style.color = '#0A0A0A' }}}
                onMouseOut={e => { if (active !== id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9B9B9B' }}}>
                <Icon size={15} style={{ flexShrink: 0 }} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <ActiveTab />
        </div>
      </div>
    </div>
  )
}
