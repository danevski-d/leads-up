import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, MessageSquare, Calendar, CheckCircle, FileText, ExternalLink, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const font = "system-ui,-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif"
const card = { background: '#FFFFFF', border: '1px solid #E8E8E8', borderRadius: 14 }

const STAGES = {
  new:       { label: 'New',       color: '#2563EB', bg: 'rgba(37,99,235,0.08)',   border: 'rgba(37,99,235,0.2)' },
  contacted: { label: 'Contacted', color: '#0891B2', bg: 'rgba(8,145,178,0.08)',   border: 'rgba(8,145,178,0.2)' },
  qualified: { label: 'Qualified', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)' },
  booked:    { label: 'Booked',    color: '#10B981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)' },
  lost:      { label: 'Lost',      color: '#9B9B9B', bg: 'rgba(155,155,155,0.08)', border: 'rgba(155,155,155,0.2)' },
}

function NoteModal({ onClose, onSave }) {
  const [text, setText] = useState('')
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', fontFamily: font }}
      className="sm:items-center sm:px-4">
      <div style={{ width: '100%', maxWidth: 448, borderRadius: '16px 16px 0 0', padding: 20, background: '#FFFFFF', border: '1px solid #E8E8E8' }}
        className="sm:rounded-2xl">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontWeight: 600, fontSize: 15, color: '#0A0A0A', margin: 0 }}>Add Note</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9B9B9B', padding: 4, minWidth: 36, minHeight: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={17} />
          </button>
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={4}
          placeholder="Write a note about this lead..."
          style={{ width: '100%', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#0A0A0A', background: '#FAFAFA', border: '1px solid #E8E8E8', outline: 'none', resize: 'none', minHeight: 100, fontFamily: font, boxSizing: 'border-box', transition: 'border-color 0.15s' }}
          onFocus={e => e.target.style.borderColor = '#2563EB'}
          onBlur={e => e.target.style.borderColor = '#E8E8E8'}
          autoFocus
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 10, fontSize: 13, fontWeight: 500, background: '#FAFAFA', border: '1px solid #E8E8E8', color: '#6B6B6B', cursor: 'pointer', minHeight: 44, fontFamily: font }}>
            Cancel
          </button>
          <button onClick={() => { if (text.trim()) { onSave(text.trim()); onClose() } }}
            style={{ flex: 1, padding: '12px', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#FFFFFF', background: '#2563EB', border: 'none', cursor: 'pointer', minHeight: 44, fontFamily: font, transition: 'background 0.15s' }}
            onMouseOver={e => e.currentTarget.style.background = '#1D4ED8'}
            onMouseOut={e => e.currentTarget.style.background = '#2563EB'}>
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

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256, fontSize: 13, color: '#9B9B9B', fontFamily: font }}>Loading...</div>

  if (!lead) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 256, gap: 12, padding: 24, fontFamily: font }}>
      <p style={{ fontSize: 13, textAlign: 'center', color: '#9B9B9B' }}>Lead not found or access denied.</p>
      <button onClick={() => navigate('/app/leads')} style={{ fontSize: 13, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer' }}>← Back to Pipeline</button>
    </div>
  )

  const cfg = STAGES[lead.status] || STAGES.new

  return (
    <div style={{ padding: '16px', maxWidth: 896, margin: '0 auto', fontFamily: font }} className="sm:p-5 md:p-6">
      {showNote && <NoteModal onClose={() => setShowNote(false)} onSave={saveNote} />}

      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, marginBottom: 20, color: '#9B9B9B', background: 'none', border: 'none', cursor: 'pointer', minHeight: 44, fontFamily: font, transition: 'color 0.15s' }}
        onMouseOver={e => e.currentTarget.style.color = '#0A0A0A'} onMouseOut={e => e.currentTarget.style.color = '#9B9B9B'}>
        <ArrowLeft size={15} /> Back to Pipeline
      </button>

      {/* Lead header card */}
      <div style={{ ...card, padding: '20px 24px', marginBottom: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }} className="sm:flex-row sm:items-start sm:justify-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
              {lead.name?.split(' ').map(n => n[0]).join('').slice(0,2) || '?'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 18, fontWeight: 700, color: '#0A0A0A', margin: 0 }}>{lead.name}</h1>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, fontWeight: 500, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                  {cfg.label}
                </span>
              </div>
              <div style={{ fontSize: 13, marginTop: 2, color: '#9B9B9B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }} className="sm:max-w-none">{lead.email}</div>
            </div>
          </div>
          <div className="sm:text-right">
            <div style={{ fontSize: 22, fontWeight: 900, color: '#10B981' }}>
              ${Number(lead.value || 0).toLocaleString()}
            </div>
            <div style={{ fontSize: 11, marginTop: 2, color: '#9B9B9B' }}>Est. value</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10, marginBottom: 16 }} className="sm:grid-cols-2">
          <a href={`mailto:${lead.email}`}
            style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 10, padding: '12px 14px', background: '#FAFAFA', border: '1px solid #E8E8E8', minHeight: 52, textDecoration: 'none', transition: 'border-color 0.15s' }}
            onMouseOver={e => e.currentTarget.style.borderColor = '#D1D5DB'}
            onMouseOut={e => e.currentTarget.style.borderColor = '#E8E8E8'}>
            <Mail size={14} style={{ color: '#9B9B9B', flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, color: '#9B9B9B' }}>Email</div>
              <div style={{ fontSize: 13, color: '#0A0A0A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.email}</div>
            </div>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 10, padding: '12px 14px', background: '#FAFAFA', border: '1px solid #E8E8E8', minHeight: 52 }}>
            <ExternalLink size={14} style={{ color: '#9B9B9B', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, color: '#9B9B9B' }}>Source</div>
              <div style={{ fontSize: 13, color: '#0A0A0A' }}>{lead.source || '—'}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <a href={`mailto:${lead.email}`}
            style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, padding: '10px 16px', borderRadius: 10, fontWeight: 600, color: '#FFFFFF', background: '#2563EB', textDecoration: 'none', minHeight: 44, transition: 'background 0.15s' }}
            onMouseOver={e => e.currentTarget.style.background = '#1D4ED8'}
            onMouseOut={e => e.currentTarget.style.background = '#2563EB'}>
            <MessageSquare size={13} /> Send Email
          </a>
          <button onClick={() => updateStatus('booked')} disabled={updating}
            style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, padding: '10px 16px', borderRadius: 10, fontWeight: 500, background: 'rgba(16,185,129,0.08)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)', cursor: updating ? 'not-allowed' : 'pointer', minHeight: 44, fontFamily: font, opacity: updating ? 0.5 : 1 }}>
            <Calendar size={13} /> Mark Booked
          </button>
          <button onClick={() => setShowNote(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, padding: '10px 16px', borderRadius: 10, fontWeight: 500, background: '#FAFAFA', border: '1px solid #E8E8E8', color: '#6B6B6B', cursor: 'pointer', minHeight: 44, fontFamily: font, transition: 'border-color 0.15s' }}
            onMouseOver={e => e.currentTarget.style.borderColor = '#D1D5DB'}
            onMouseOut={e => e.currentTarget.style.borderColor = '#E8E8E8'}>
            <FileText size={13} /> Add Note
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }} className="md:grid-cols-3">
        {/* Notes */}
        <div style={{ ...card, padding: '20px 24px' }} className="md:col-span-2">
          <h3 style={{ fontWeight: 600, fontSize: 14, color: '#0A0A0A', marginBottom: 16, marginTop: 0 }}>Notes</h3>
          {notes.length === 0 ? (
            <div style={{ fontSize: 13, textAlign: 'center', padding: '32px 0', color: '#9B9B9B' }}>
              No notes yet.{' '}
              <button onClick={() => setShowNote(true)} style={{ color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>Add one →</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[...notes].reverse().map((n, i) => (
                <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: '#FAFAFA', border: '1px solid #E8E8E8' }}>
                  <p style={{ fontSize: 13, color: '#0A0A0A', lineHeight: 1.6, margin: 0 }}>{n.text}</p>
                  <div style={{ fontSize: 11, marginTop: 8, color: '#C8C8C8' }}>{new Date(n.at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ ...card, padding: '20px' }}>
            <h4 style={{ fontWeight: 600, fontSize: 14, color: '#0A0A0A', marginBottom: 14, marginTop: 0 }}>Move Stage</h4>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }} className="md:flex-col md:overflow-visible md:gap-0 md:space-y-2">
              {Object.entries(STAGES).map(([key, { label, color, bg, border }]) => (
                <button key={key} onClick={() => updateStatus(key)} disabled={updating || lead.status === key}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderRadius: 10, fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
                    padding: '10px 14px', minHeight: 44, whiteSpace: 'nowrap',
                    flexShrink: 0, cursor: (updating || lead.status === key) ? 'default' : 'pointer',
                    fontFamily: font,
                    ...(lead.status === key
                      ? { background: bg, color, border: `1px solid ${border}` }
                      : { background: '#FAFAFA', border: '1px solid #E8E8E8', color: '#6B6B6B' }),
                  }}>
                  {label}
                  {lead.status === key && <CheckCircle size={13} style={{ marginLeft: 8, flexShrink: 0 }} />}
                </button>
              ))}
            </div>
          </div>

          <div style={{ ...card, padding: '20px' }}>
            <h4 style={{ fontWeight: 600, fontSize: 14, color: '#0A0A0A', marginBottom: 14, marginTop: 0 }}>Details</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Name',    value: lead.name },
                { label: 'Email',   value: lead.email },
                { label: 'Source',  value: lead.source },
                { label: 'Value',   value: `$${Number(lead.value || 0).toLocaleString()}` },
                { label: 'Status',  value: cfg.label },
                { label: 'Created', value: new Date(lead.created_at).toLocaleDateString() },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ fontSize: 12, flexShrink: 0, color: '#9B9B9B' }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#0A0A0A', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
