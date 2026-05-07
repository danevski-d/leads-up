import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Mail, MessageSquare, Calendar,
  CheckCircle, FileText, ExternalLink, X
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const stageConfig = {
  new:       { label: 'New',       color: '#818CF8', bg: 'rgba(129,140,248,0.1)',  border: 'rgba(129,140,248,0.25)' },
  contacted: { label: 'Contacted', color: '#67E8F9', bg: 'rgba(103,232,249,0.1)', border: 'rgba(103,232,249,0.25)' },
  qualified: { label: 'Qualified', color: '#A78BFA', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)' },
  booked:    { label: 'Booked',    color: '#6EE7B7', bg: 'rgba(110,231,183,0.1)', border: 'rgba(110,231,183,0.25)' },
  lost:      { label: 'Lost',      color: '#4B4F6E', bg: 'rgba(75,79,110,0.15)',  border: 'rgba(75,79,110,0.3)' },
}

function NoteModal({ onClose, onSave }) {
  const [text, setText] = useState('')
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#0A0B16', border: '1px solid #1E2035' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Add Note</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={16} /></button>
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={4}
          placeholder="Write a note about this lead..."
          className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none resize-none"
          style={{ background: '#0D0E1C', border: '1px solid #1E2035' }}
          autoFocus
        />
        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1E2035', color: '#5A5E80' }}>
            Cancel
          </button>
          <button onClick={() => { if (text.trim()) { onSave(text.trim()); onClose() } }}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white"
            style={{ background: 'linear-gradient(135deg, #6D71F4, #7C3AED)' }}>
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
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [notes, setNotes] = useState([])

  useEffect(() => {
    if (user) fetchLead()
  }, [id, user])

  const fetchLead = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)   // only the owner can view
      .maybeSingle()

    if (error) console.error('LeadDetail fetch error:', error.message)
    setLead(data ?? null)
    if (data?.notes) setNotes(Array.isArray(data.notes) ? data.notes : [])
    setLoading(false)
  }

  const updateStatus = async (newStatus) => {
    setUpdating(true)
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', id)
      .eq('user_id', user.id)
    if (!error) setLead(l => ({ ...l, status: newStatus }))
    setUpdating(false)
  }

  const saveNote = async (text) => {
    const updated = [...notes, { text, at: new Date().toISOString() }]
    const { error } = await supabase
      .from('leads')
      .update({ notes: updated })
      .eq('id', id)
      .eq('user_id', user.id)
    if (!error) setNotes(updated)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-sm" style={{ color: '#3D4165' }}>Loading...</div>
  )

  if (!lead) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <p className="text-sm" style={{ color: '#3D4165' }}>Lead not found or you don't have access.</p>
      <button onClick={() => navigate('/app/leads')} className="text-sm text-indigo-400 hover:text-indigo-300">
        ← Back to Pipeline
      </button>
    </div>
  )

  const cfg = stageConfig[lead.status] || stageConfig.new

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {showNoteModal && <NoteModal onClose={() => setShowNoteModal(false)} onSave={saveNote} />}

      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm mb-6 transition-colors"
        style={{ color: '#3D4165' }}
        onMouseOver={e => e.currentTarget.style.color = '#fff'}
        onMouseOut={e => e.currentTarget.style.color = '#3D4165'}>
        <ArrowLeft size={14} /> Back to Pipeline
      </button>

      {/* Lead header */}
      <div className="rounded-2xl p-6 mb-4" style={{ background: '#0A0B16', border: '1px solid #181928' }}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
              style={{ background: 'linear-gradient(135deg, #6D71F4, #8B5CF6)' }}>
              {lead.name?.split(' ').map(n => n[0]).join('') || '?'}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-white">{lead.name}</h1>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                  {cfg.label}
                </span>
              </div>
              <div className="text-sm mt-1" style={{ color: '#3D4165' }}>{lead.email}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black" style={{ color: '#6EE7B7' }}>
              ${Number(lead.value || 0).toLocaleString()}
            </div>
            <div className="text-xs mt-1" style={{ color: '#2D3050' }}>Est. value</div>
          </div>
        </div>

        {/* Contact row */}
        <div className="grid sm:grid-cols-2 gap-3 mt-5">
          <a href={`mailto:${lead.email}`}
            className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #141526' }}
            onMouseOver={e => e.currentTarget.style.borderColor = '#1E2035'}
            onMouseOut={e => e.currentTarget.style.borderColor = '#141526'}>
            <Mail size={14} style={{ color: '#3D4165' }} />
            <div>
              <div className="text-xs" style={{ color: '#2D3050' }}>Email</div>
              <div className="text-sm text-white">{lead.email}</div>
            </div>
          </a>
          <div className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #141526' }}>
            <ExternalLink size={14} style={{ color: '#3D4165' }} />
            <div>
              <div className="text-xs" style={{ color: '#2D3050' }}>Source</div>
              <div className="text-sm text-white">{lead.source || '—'}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-5">
          <a href={`mailto:${lead.email}`}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-medium text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #6D71F4, #7C3AED)' }}>
            <MessageSquare size={13} /> Send Email
          </a>
          <button onClick={() => updateStatus('booked')}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-medium transition-all"
            style={{ background: 'rgba(110,231,183,0.1)', color: '#6EE7B7', border: '1px solid rgba(110,231,183,0.25)' }}>
            <Calendar size={13} /> Mark as Booked
          </button>
          <button onClick={() => setShowNoteModal(true)}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-medium transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1E2035', color: '#5A5E80' }}>
            <FileText size={13} /> Add Note
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Notes */}
        <div className="md:col-span-2 rounded-2xl p-5" style={{ background: '#0A0B16', border: '1px solid #181928' }}>
          <h3 className="text-white font-semibold mb-4 text-sm">Notes</h3>
          {notes.length === 0 ? (
            <div className="text-sm text-center py-8" style={{ color: '#2D3050' }}>
              No notes yet.{' '}
              <button onClick={() => setShowNoteModal(true)} style={{ color: '#7677F4' }}>Add one →</button>
            </div>
          ) : (
            <div className="space-y-3">
              {[...notes].reverse().map((n, i) => (
                <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #141526' }}>
                  <p className="text-sm text-white leading-relaxed">{n.text}</p>
                  <div className="text-xs mt-2" style={{ color: '#2D3050' }}>
                    {new Date(n.at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details + stage mover */}
        <div className="space-y-4">
          <div className="rounded-2xl p-5" style={{ background: '#0A0B16', border: '1px solid #181928' }}>
            <h4 className="text-white font-semibold mb-4 text-sm">Move Stage</h4>
            <div className="space-y-1.5">
              {Object.entries(stageConfig).map(([key, { label, color, bg, border }]) => (
                <button key={key}
                  onClick={() => updateStatus(key)}
                  disabled={updating || lead.status === key}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all disabled:cursor-default"
                  style={lead.status === key
                    ? { background: bg, color, border: `1px solid ${border}` }
                    : { background: 'rgba(255,255,255,0.02)', border: '1px solid #141526', color: '#3D4165' }
                  }>
                  {label}
                  {lead.status === key && <CheckCircle size={13} />}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: '#0A0B16', border: '1px solid #181928' }}>
            <h4 className="text-white font-semibold mb-4 text-sm">Details</h4>
            <div className="space-y-3">
              {[
                { label: 'Name',    value: lead.name },
                { label: 'Email',   value: lead.email },
                { label: 'Source',  value: lead.source },
                { label: 'Value',   value: `$${Number(lead.value || 0).toLocaleString()}` },
                { label: 'Status',  value: cfg.label },
                { label: 'Created', value: new Date(lead.created_at).toLocaleDateString() },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-2">
                  <span className="text-xs" style={{ color: '#3D4165' }}>{label}</span>
                  <span className="text-xs font-medium text-white text-right">{value || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
