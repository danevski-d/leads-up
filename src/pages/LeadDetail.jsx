import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, MessageSquare, Calendar, CheckCircle, FileText, ExternalLink, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const STAGES = {
  new:       { label: 'New',       color: '#818CF8', bg: 'rgba(129,140,248,0.1)',  border: 'rgba(129,140,248,0.25)' },
  contacted: { label: 'Contacted', color: '#67E8F9', bg: 'rgba(103,232,249,0.1)', border: 'rgba(103,232,249,0.25)' },
  qualified: { label: 'Qualified', color: '#A78BFA', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)' },
  booked:    { label: 'Booked',    color: '#34D399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.25)' },
  lost:      { label: 'Lost',      color: '#6B7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.25)' },
}

function NoteModal({ onClose, onSave }) {
  const [text, setText] = useState('')
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5"
        style={{ background: '#111827', border: '1px solid #1F2937' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Add Note</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white p-1" style={{ minWidth: 36, minHeight: 36 }}><X size={17} /></button>
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={4}
          placeholder="Write a note about this lead..."
          className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none resize-none"
          style={{ background: '#0D1117', border: '1px solid #1F2937', minHeight: 100 }}
          autoFocus
        />
        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1F2937', color: '#6B7280', minHeight: 44 }}>
            Cancel
          </button>
          <button onClick={() => { if (text.trim()) { onSave(text.trim()); onClose() } }}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #6366F1, #7C3AED)', minHeight: 44 }}>
            Save Note
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [showNote, setShowNote] = useState(false)
  const [notes, setNotes] = useState([])

  useEffect(() => { if (user) fetchLead() }, [id, user])

  const fetchLead = async () => {
    const { data, error } = await supabase
      .from('leads').select('*').eq('id', id).eq('user_id', user.id).maybeSingle()
    if (error) console.error('LeadDetail:', error.message)
    setLead(data ?? null)
    if (data?.notes) setNotes(Array.isArray(data.notes) ? data.notes : [])
    setLoading(false)
  }

  const updateStatus = async (newStatus) => {
    setUpdating(true)
    const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', id).eq('user_id', user.id)
    if (!error) setLead(l => ({ ...l, status: newStatus }))
    setUpdating(false)
  }

  const saveNote = async (text) => {
    const updated = [...notes, { text, at: new Date().toISOString() }]
    const { error } = await supabase.from('leads').update({ notes: updated }).eq('id', id).eq('user_id', user.id)
    if (!error) setNotes(updated)
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-sm" style={{ color: '#6B7280' }}>Loading...</div>

  if (!lead) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 p-6">
      <p className="text-sm text-center" style={{ color: '#6B7280' }}>Lead not found or access denied.</p>
      <button onClick={() => navigate('/app/leads')} className="text-sm" style={{ color: '#6366F1' }}>← Back to Pipeline</button>
    </div>
  )

  const cfg = STAGES[lead.status] || STAGES.new

  return (
    <div className="p-4 sm:p-5 md:p-6 max-w-4xl mx-auto">
      {showNote && <NoteModal onClose={() => setShowNote(false)} onSave={saveNote} />}

      {/* Back button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm mb-5 transition-colors" style={{ color: '#6B7280', minHeight: 44 }}
        onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#6B7280'}>
        <ArrowLeft size={15} /> Back to Pipeline
      </button>

      {/* Lead header card */}
      <div className="rounded-2xl p-4 sm:p-6 mb-4" style={{ background: '#111827', border: '1px solid #1F2937' }}>
        {/* Name + value row — stack on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366F1, #7C3AED)', fontSize: 16 }}>
              {lead.name?.split(' ').map(n => n[0]).join('').slice(0,2) || '?'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-white">{lead.name}</h1>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                  {cfg.label}
                </span>
              </div>
              <div className="text-sm mt-0.5 truncate max-w-[200px] sm:max-w-none" style={{ color: '#6B7280' }}>{lead.email}</div>
            </div>
          </div>
          <div className="sm:text-right">
            <div className="text-xl sm:text-2xl font-black" style={{ color: '#34D399' }}>
              ${Number(lead.value || 0).toLocaleString()}
            </div>
            <div className="text-xs mt-0.5" style={{ color: '#4B5563' }}>Est. value</div>
          </div>
        </div>

        {/* Contact info — 1 col mobile, 2 col sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          <a href={`mailto:${lead.email}`}
            className="flex items-center gap-3 rounded-xl px-3 py-3 transition-all"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', minHeight: 52 }}>
            <Mail size={14} style={{ color: '#4B5563', flexShrink: 0 }} />
            <div className="min-w-0">
              <div className="text-xs" style={{ color: '#374151' }}>Email</div>
              <div className="text-sm text-white truncate">{lead.email}</div>
            </div>
          </a>
          <div className="flex items-center gap-3 rounded-xl px-3 py-3"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', minHeight: 52 }}>
            <ExternalLink size={14} style={{ color: '#4B5563', flexShrink: 0 }} />
            <div>
              <div className="text-xs" style={{ color: '#374151' }}>Source</div>
              <div className="text-sm text-white">{lead.source || '—'}</div>
            </div>
          </div>
        </div>

        {/* Action buttons — wrap on mobile */}
        <div className="flex flex-wrap gap-2">
          <a href={`mailto:${lead.email}`}
            className="flex items-center gap-2 text-sm px-4 rounded-xl font-medium text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #6366F1, #7C3AED)', minHeight: 44, paddingTop: 10, paddingBottom: 10 }}>
            <MessageSquare size={13} /> Send Email
          </a>
          <button onClick={() => updateStatus('booked')} disabled={updating}
            className="flex items-center gap-2 text-sm px-4 rounded-xl font-medium transition-all disabled:opacity-50"
            style={{ background: 'rgba(52,211,153,0.1)', color: '#34D399', border: '1px solid rgba(52,211,153,0.25)', minHeight: 44 }}>
            <Calendar size={13} /> Mark Booked
          </button>
          <button onClick={() => setShowNote(true)}
            className="flex items-center gap-2 text-sm px-4 rounded-xl font-medium transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1F2937', color: '#9CA3AF', minHeight: 44 }}>
            <FileText size={13} /> Add Note
          </button>
        </div>
      </div>

      {/* Main content — stacks on mobile, 3-col grid on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Notes — full width on mobile, 2/3 on desktop */}
        <div className="md:col-span-2 rounded-2xl p-4 sm:p-5" style={{ background: '#111827', border: '1px solid #1F2937' }}>
          <h3 className="text-white font-semibold mb-4 text-sm">Notes</h3>
          {notes.length === 0 ? (
            <div className="text-sm text-center py-8" style={{ color: '#4B5563' }}>
              No notes yet.{' '}
              <button onClick={() => setShowNote(true)} style={{ color: '#6366F1' }}>Add one →</button>
            </div>
          ) : (
            <div className="space-y-3">
              {[...notes].reverse().map((n, i) => (
                <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937' }}>
                  <p className="text-sm text-white leading-relaxed">{n.text}</p>
                  <div className="text-xs mt-2" style={{ color: '#374151' }}>{new Date(n.at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar — stage mover + details */}
        <div className="space-y-4">
          <div className="rounded-2xl p-4 sm:p-5" style={{ background: '#111827', border: '1px solid #1F2937' }}>
            <h4 className="text-white font-semibold mb-3 text-sm">Move Stage</h4>
            {/* Horizontal scroll on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:space-y-1.5 md:gap-0">
              {Object.entries(STAGES).map(([key, { label, color, bg, border }]) => (
                <button key={key} onClick={() => updateStatus(key)} disabled={updating || lead.status === key}
                  className="flex items-center justify-between rounded-xl text-sm font-medium transition-all disabled:cursor-default flex-shrink-0 md:flex-shrink md:w-full"
                  style={{
                    padding: '10px 14px', minHeight: 44, whiteSpace: 'nowrap',
                    ...(lead.status === key
                      ? { background: bg, color, border: `1px solid ${border}` }
                      : { background: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', color: '#6B7280' }),
                  }}>
                  {label}
                  {lead.status === key && <CheckCircle size={13} className="ml-2 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5" style={{ background: '#111827', border: '1px solid #1F2937' }}>
            <h4 className="text-white font-semibold mb-3 text-sm">Details</h4>
            <div className="space-y-2.5">
              {[
                { label: 'Name',    value: lead.name },
                { label: 'Email',   value: lead.email },
                { label: 'Source',  value: lead.source },
                { label: 'Value',   value: `$${Number(lead.value || 0).toLocaleString()}` },
                { label: 'Status',  value: cfg.label },
                { label: 'Created', value: new Date(lead.created_at).toLocaleDateString() },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-3">
                  <span className="text-xs flex-shrink-0" style={{ color: '#6B7280' }}>{label}</span>
                  <span className="text-xs font-medium text-white text-right truncate">{value || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
