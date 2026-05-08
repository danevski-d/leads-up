import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, X, Filter } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const COLUMNS = [
  { key: 'new',       label: 'New',       dot: '#6366F1', badge: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' },
  { key: 'contacted', label: 'Contacted', dot: '#67E8F9', badge: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' },
  { key: 'qualified', label: 'Qualified', dot: '#A78BFA', badge: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' },
  { key: 'booked',    label: 'Booked',    dot: '#34D399', badge: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
  { key: 'lost',      label: 'Lost',      dot: '#6B7280', badge: 'bg-slate-500/20 text-slate-400 border border-slate-500/30' },
]

const SOURCE_COLORS = {
  'Web Form':   'bg-cyan-500/10 text-cyan-400',
  'Google Ads': 'bg-blue-500/10 text-blue-400',
  'Facebook':   'bg-indigo-500/10 text-indigo-400',
  'Referral':   'bg-emerald-500/10 text-emerald-400',
  'Yelp':       'bg-red-500/10 text-red-400',
}

/* ── Lead card ──────────────────────────────────────────────── */
function LeadCard({ lead }) {
  return (
    <Link to={`/app/leads/${lead.id}`}
      className="block rounded-xl p-3.5 border transition-all group"
      style={{ background: 'rgba(255,255,255,0.03)', borderColor: '#1F2937' }}
      onMouseOver={e => e.currentTarget.style.borderColor = '#374151'}
      onMouseOut={e => e.currentTarget.style.borderColor = '#1F2937'}
    >
      <div className="flex items-start gap-2.5 mb-2.5">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: 'rgba(99,102,241,0.2)', color: '#818CF8' }}>
          {lead.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
            {lead.name || 'Unnamed Lead'}
          </div>
          <div className="text-xs truncate" style={{ color: '#6B7280' }}>{lead.email || '—'}</div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className={`text-xs px-2 py-0.5 rounded-full truncate max-w-[120px] ${SOURCE_COLORS[lead.source] || 'bg-slate-700/50 text-slate-400'}`}>
          {lead.source || 'Unknown'}
        </span>
        {lead.value ? (
          <span className="text-xs font-bold text-emerald-400 flex-shrink-0">
            ${Number(lead.value).toLocaleString()}
          </span>
        ) : null}
      </div>
      <div className="text-xs mt-2" style={{ color: '#374151' }}>
        {new Date(lead.created_at).toLocaleDateString()}
      </div>
    </Link>
  )
}

/* ── Add Lead Modal ─────────────────────────────────────────── */
function AddLeadModal({ onClose, onAdded, userId }) {
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const inputStyle = {
    width: '100%', background: '#0D1117', border: '1px solid #1F2937',
    borderRadius: 12, padding: '10px 14px', color: 'white', fontSize: 14,
    outline: 'none', transition: 'border-color 0.15s',
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 sm:p-6"
        style={{ background: '#111827', border: '1px solid #1F2937', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-base">Add New Lead</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1" style={{ minWidth: 36, minHeight: 36 }}>
            <X size={18} />
          </button>
        </div>

        {err && <div className="mb-4 text-sm rounded-xl px-4 py-3" style={{ color: '#F87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>{err}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            { label: 'Full Name', name: 'leadName', type: 'text', required: true },
            { label: 'Email',     name: 'leadEmail', type: 'email', required: true },
          ].map(({ label, name, type, required }) => (
            <div key={name}>
              <label className="text-xs font-medium block mb-1.5" style={{ color: '#9CA3AF' }}>{label}</label>
              <input name={name} type={type} required={required} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#6366F1'}
                onBlur={e => e.target.style.borderColor = '#1F2937'} />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: '#9CA3AF' }}>Source</label>
            <select name="source" style={{ ...inputStyle, cursor: 'pointer' }}>
              {['Web Form','Google Ads','Facebook','Referral','Yelp','Other'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: '#9CA3AF' }}>Deal Value ($)</label>
            <input name="value" type="number" min="0" style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#6366F1'}
              onBlur={e => e.target.style.borderColor = '#1F2937'} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-medium transition-all" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1F2937', color: '#6B7280', minHeight: 44 }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #6366F1, #7C3AED)', minHeight: 44 }}>
              {saving ? 'Saving...' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Main page ──────────────────────────────────────────────── */
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
    <div className="flex flex-col h-full p-3 sm:p-5 md:p-6">
      {showModal && <AddLeadModal userId={user?.id} onClose={() => setShowModal(false)} onAdded={fetchLeads} />}

      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-3 mb-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white">Pipeline</h1>
          <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
            {leads.length} leads ·{' '}
            <span style={{ color: '#34D399' }}>${(totalValue / 1000).toFixed(1)}k total value</span>
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-white rounded-xl px-4 py-2.5 flex-shrink-0 transition-all"
          style={{ background: 'linear-gradient(135deg, #6366F1, #7C3AED)', minHeight: 44 }}>
          <Plus size={15} />
          <span className="hidden sm:inline">Add Lead</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-4 flex-shrink-0">
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none"
            style={{ background: '#111827', border: '1px solid #1F2937', minHeight: 44 }}
            onFocus={e => e.target.style.borderColor = '#6366F1'}
            onBlur={e => e.target.style.borderColor = '#1F2937'}
          />
        </div>
      </div>

      {/* Kanban */}
      {loading ? (
        <div className="flex items-center justify-center flex-1 text-sm" style={{ color: '#6B7280' }}>Loading leads...</div>
      ) : (
        <div className="flex gap-3 overflow-x-auto flex-1 pb-4" style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}>
          {COLUMNS.map(col => {
            const colLeads = byStatus(col.key)
            const total = colLeads.reduce((s, l) => s + (Number(l.value) || 0), 0)
            return (
              <div key={col.key} className="flex flex-col flex-shrink-0" style={{ width: 284, minWidth: 280, scrollSnapAlign: 'start' }}>
                {/* Column header */}
                <div className="flex items-center justify-between mb-2.5 px-0.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: col.dot }} />
                    <span className="text-sm font-semibold text-white">{col.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${col.badge}`}>{colLeads.length}</span>
                  </div>
                  {total > 0 && <span className="text-xs" style={{ color: '#4B5563' }}>${(total / 1000).toFixed(1)}k</span>}
                </div>

                {/* Cards */}
                <div className="flex-1 space-y-2 min-h-[80px]">
                  {colLeads.length === 0 ? (
                    <div className="h-20 rounded-xl border-2 border-dashed flex items-center justify-center text-xs"
                      style={{ borderColor: '#1F2937', color: '#374151' }}>
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
