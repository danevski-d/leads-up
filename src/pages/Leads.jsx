import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const font = "system-ui,-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif"

const COLUMNS = [
  { key: 'new',       label: 'New',       dot: '#2563EB', badgeBg: 'rgba(37,99,235,0.1)',   badgeColor: '#2563EB',  badgeBorder: 'rgba(37,99,235,0.2)' },
  { key: 'contacted', label: 'Contacted', dot: '#0891B2', badgeBg: 'rgba(8,145,178,0.1)',   badgeColor: '#0891B2',  badgeBorder: 'rgba(8,145,178,0.2)' },
  { key: 'qualified', label: 'Qualified', dot: '#F59E0B', badgeBg: 'rgba(245,158,11,0.1)',  badgeColor: '#F59E0B',  badgeBorder: 'rgba(245,158,11,0.2)' },
  { key: 'booked',    label: 'Booked',    dot: '#10B981', badgeBg: 'rgba(16,185,129,0.1)',  badgeColor: '#10B981',  badgeBorder: 'rgba(16,185,129,0.2)' },
  { key: 'lost',      label: 'Lost',      dot: '#9B9B9B', badgeBg: 'rgba(155,155,155,0.1)', badgeColor: '#9B9B9B',  badgeBorder: 'rgba(155,155,155,0.2)' },
]

const SOURCE_BADGE = {
  'Web Form':   { bg: 'rgba(8,145,178,0.08)',   color: '#0891B2' },
  'Google Ads': { bg: 'rgba(37,99,235,0.08)',   color: '#2563EB' },
  'Facebook':   { bg: 'rgba(37,99,235,0.08)',   color: '#2563EB' },
  'Referral':   { bg: 'rgba(16,185,129,0.08)',  color: '#10B981' },
  'Yelp':       { bg: 'rgba(239,68,68,0.08)',   color: '#EF4444' },
}

function LeadCard({ lead }) {
  const src = SOURCE_BADGE[lead.source] || { bg: 'rgba(155,155,155,0.1)', color: '#9B9B9B' }
  return (
    <Link to={`/app/leads/${lead.id}`}
      style={{ display: 'block', borderRadius: 12, padding: '12px 14px', border: '1px solid #E8E8E8', background: '#FFFFFF', textDecoration: 'none', transition: 'border-color 0.15s', fontFamily: font }}
      onMouseOver={e => e.currentTarget.style.borderColor = '#D1D5DB'}
      onMouseOut={e => e.currentTarget.style.borderColor = '#E8E8E8'}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
          {lead.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {lead.name || 'Unnamed Lead'}
          </div>
          <div style={{ fontSize: 11, color: '#9B9B9B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.email || '—'}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: src.bg, color: src.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
          {lead.source || 'Unknown'}
        </span>
        {lead.value ? (
          <span style={{ fontSize: 12, fontWeight: 700, color: '#10B981', flexShrink: 0 }}>
            ${Number(lead.value).toLocaleString()}
          </span>
        ) : null}
      </div>
      <div style={{ fontSize: 11, marginTop: 8, color: '#C8C8C8' }}>
        {new Date(lead.created_at).toLocaleDateString()}
      </div>
    </Link>
  )
}

function AddLeadModal({ onClose, onAdded, userId }) {
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const inputStyle = {
    width: '100%', background: '#FFFFFF', border: '1px solid #E8E8E8',
    borderRadius: 10, padding: '10px 14px', color: '#0A0A0A', fontSize: 14,
    outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box', fontFamily: font,
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr(''); setSaving(true)
    const fd = new FormData(e.target)
    const { error } = await supabase.from('leads').insert({
      user_id: userId,
      name:    fd.get('leadName'),
      email:   fd.get('leadEmail'),
      source:  fd.get('source'),
      value:   fd.get('value') ? Number(fd.get('value')) : null,
      status:  'new',
    })
    if (error) { setErr(error.message); setSaving(false) }
    else { onAdded(); onClose() }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', fontFamily: font }}
      className="sm:items-center sm:px-4">
      <div style={{ width: '100%', maxWidth: 448, borderRadius: '16px 16px 0 0', padding: 20, background: '#FFFFFF', border: '1px solid #E8E8E8', maxHeight: '90vh', overflowY: 'auto' }}
        className="sm:rounded-2xl">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontWeight: 700, fontSize: 15, color: '#0A0A0A' }}>Add New Lead</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9B9B9B', padding: 4, minWidth: 36, minHeight: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseOver={e => e.currentTarget.style.color = '#0A0A0A'}
            onMouseOut={e => e.currentTarget.style.color = '#9B9B9B'}>
            <X size={18} />
          </button>
        </div>

        {err && <div style={{ marginBottom: 14, fontSize: 13, borderRadius: 10, padding: '10px 14px', color: '#EF4444', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>{err}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'Full Name', name: 'leadName', type: 'text', required: true },
            { label: 'Email',     name: 'leadEmail', type: 'email', required: true },
          ].map(({ label, name, type, required }) => (
            <div key={name}>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>{label}</label>
              <input name={name} type={type} required={required} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563EB'}
                onBlur={e => e.target.style.borderColor = '#E8E8E8'} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>Source</label>
            <select name="source" style={{ ...inputStyle, cursor: 'pointer' }}>
              {['Web Form','Google Ads','Facebook','Referral','Yelp','Other'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>Deal Value ($)</label>
            <input name="value" type="number" min="0" style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#2563EB'}
              onBlur={e => e.target.style.borderColor = '#E8E8E8'} />
          </div>
          <div style={{ display: 'flex', gap: 10, paddingTop: 6 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 10, fontSize: 13, fontWeight: 500, background: '#FAFAFA', border: '1px solid #E8E8E8', color: '#6B6B6B', cursor: 'pointer', minHeight: 44, fontFamily: font }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} style={{ flex: 1, padding: '12px', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#FFFFFF', background: saving ? '#93C5FD' : '#2563EB', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', minHeight: 44, fontFamily: font }}>
              {saving ? 'Saving...' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Leads() {
  const { user } = useAuth()
  const [leads, setLeads] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (user) fetchLeads()
  }, [user])

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (error) console.error('Leads fetch:', error.message)
    setLeads(data || [])
    setLoading(false)
  }

  const byStatus = (status) => {
    let list = leads.filter(l => l.status === status)
    if (!search) return list
    const q = search.toLowerCase()
    return list.filter(l =>
      l.name?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.source?.toLowerCase().includes(q)
    )
  }

  const totalValue = leads.reduce((s, l) => s + (Number(l.value) || 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '12px 16px', fontFamily: font }} className="sm:p-5 md:p-6">
      {showModal && <AddLeadModal userId={user?.id} onClose={() => setShowModal(false)} onAdded={fetchLeads} />}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0A0A0A', margin: 0 }}>Pipeline</h1>
          <p style={{ fontSize: 12, color: '#9B9B9B', marginTop: 4 }}>
            {leads.length} leads ·{' '}
            <span style={{ color: '#10B981' }}>${(totalValue / 1000).toFixed(1)}k total value</span>
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#FFFFFF', background: '#2563EB', border: 'none', borderRadius: 10, padding: '10px 16px', cursor: 'pointer', flexShrink: 0, minHeight: 44, fontFamily: font, transition: 'background 0.15s' }}
          onMouseOver={e => e.currentTarget.style.background = '#1D4ED8'}
          onMouseOut={e => e.currentTarget.style.background = '#2563EB'}>
          <Plus size={15} />
          <span className="hidden sm:inline">Add Lead</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <div style={{ marginBottom: 16, flexShrink: 0 }}>
        <div style={{ position: 'relative', maxWidth: 280 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9B9B9B' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search leads..."
            style={{ width: '100%', borderRadius: 10, paddingLeft: 36, paddingRight: 16, paddingTop: 10, paddingBottom: 10, fontSize: 13, color: '#0A0A0A', background: '#FFFFFF', border: '1px solid #E8E8E8', outline: 'none', boxSizing: 'border-box', minHeight: 44, fontFamily: font, transition: 'border-color 0.15s' }}
            onFocus={e => e.target.style.borderColor = '#2563EB'}
            onBlur={e => e.target.style.borderColor = '#E8E8E8'}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, fontSize: 13, color: '#9B9B9B' }}>Loading leads...</div>
      ) : (
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', flex: 1, paddingBottom: 16, WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}>
          {COLUMNS.map(col => {
            const colLeads = byStatus(col.key)
            const total = colLeads.reduce((s, l) => s + (Number(l.value) || 0), 0)
            return (
              <div key={col.key} style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, width: 284, minWidth: 280, scrollSnapAlign: 'start' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '0 2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.dot }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A' }}>{col.label}</span>
                    <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 99, background: col.badgeBg, color: col.badgeColor, border: `1px solid ${col.badgeBorder}` }}>{colLeads.length}</span>
                  </div>
                  {total > 0 && <span style={{ fontSize: 11, color: '#9B9B9B' }}>${(total / 1000).toFixed(1)}k</span>}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 80 }}>
                  {colLeads.length === 0 ? (
                    <div style={{ height: 80, borderRadius: 12, border: '2px dashed #E8E8E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#C8C8C8' }}>
                      No leads
                    </div>
                  ) : (
                    colLeads.map(lead => <LeadCard key={lead.id} lead={lead} />)
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
