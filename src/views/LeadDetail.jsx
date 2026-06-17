'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Mail, MessageSquare, Calendar, CheckCircle, FileText, ExternalLink, X, Zap } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const STAGES = {
  new:               { label: 'New',              color: '#818CF8', bg: 'rgba(129,140,248,0.1)',  border: 'rgba(129,140,248,0.25)' },
  ai_responded:      { label: 'AI Responded',     color: '#67E8F9', bg: 'rgba(103,232,249,0.1)', border: 'rgba(103,232,249,0.25)' },
  engaged:           { label: 'Engaged',          color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)' },
  qualified:         { label: 'Qualified',        color: '#A78BFA', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)' },
  meeting_scheduled: { label: 'Meeting Scheduled',color: '#34D399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.25)' },
  won:               { label: 'Won',              color: '#FBBF24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)' },
  nurture:           { label: 'Nurture',          color: '#60A5FA', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.25)' },
  lost:              { label: 'Lost',             color: '#6B7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.25)' },
}

const INTENT_CONFIG = {
  hot:    { label: '🔥 Hot',    color: '#EF4444', bg: 'rgba(239,68,68,0.1)',    border: 'rgba(239,68,68,0.25)' },
  warm:   { label: '🟡 Warm',   color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.25)' },
  cold:   { label: '🔵 Cold',   color: '#60A5FA', bg: 'rgba(96,165,250,0.1)',   border: 'rgba(96,165,250,0.25)' },
  nurture:{ label: '🟣 Nurture',color: '#A78BFA', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)' },
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
          <button onClick={onClose} className="text-slate-500 hover:text-white p-1" style={{ minWidth: 36, minHeight: 36 }}>
            <X size={17} />
          </button>
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

function CommunicationsTab({ leadId }) {
  const [comms, setComms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('communications')
      .select('*')
      .eq('lead_id', leadId)
      .order('sent_at', { ascending: false })
      .then(({ data }) => {
        setComms(data || [])
        setLoading(false)
      })
  }, [leadId])

  const channelIcon = (channel) => {
    if (channel === 'email') return '✉️'
    if (channel === 'call')  return '📞'
    if (channel === 'sms')   return '💬'
    if (channel === 'chat')  return '🤖'
    return '📋'
  }

  const channelColor = (channel) => {
    if (channel === 'email') return '#818CF8'
    if (channel === 'call')  return '#34D399'
    if (channel === 'sms')   return '#F59E0B'
    if (channel === 'chat')  return '#67E8F9'
    return '#6B7280'
  }

  if (loading) return null
  if (comms.length === 0) return null

  return (
    <div className="rounded-2xl p-4 sm:p-5 mt-4" style={{ background: '#111827', border: '1px solid #1F2937' }}>
      <h3 className="text-white font-semibold mb-4 text-sm">
        Communications
        <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(99,102,241,0.15)', color: '#818CF8' }}>
          {comms.length}
        </span>
      </h3>
      <div className="space-y-3">
        {comms.map((c, i) => (
          <div key={i} className="rounded-xl p-3.5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937' }}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 14 }}>{channelIcon(c.channel)}</span>
                <span className="text-xs font-semibold capitalize" style={{ color: channelColor(c.channel) }}>
                  {c.channel}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{
                  background: c.direction === 'outbound' ? 'rgba(52,211,153,0.1)' : 'rgba(245,158,11,0.1)',
                  color: c.direction === 'outbound' ? '#34D399' : '#F59E0B',
                }}>
                  {c.direction === 'outbound' ? '↑ Outbound' : '↓ Inbound'}
                </span>
                {c.ai_generated && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(129,140,248,0.1)', color: '#818CF8' }}>
                    AI
                  </span>
                )}
              </div>
              <span className="text-xs flex-shrink-0" style={{ color: '#4B5563' }}>
                {new Date(c.sent_at).toLocaleString()}
              </span>
            </div>
            {c.subject && (
              <div className="text-xs font-medium text-white mb-1">{c.subject}</div>
            )}
            {c.body && (
              <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
                {c.body.length > 300 ? c.body.slice(0, 300) + '...' : c.body}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ScoreBadge({ score }) {
  if (!score && score !== 0) return null
  const color = score >= 70 ? '#EF4444' : score >= 40 ? '#F59E0B' : '#60A5FA'
  const bg    = score >= 70 ? 'rgba(239,68,68,0.1)' : score >= 40 ? 'rgba(245,158,11,0.1)' : 'rgba(96,165,250,0.1)'
  const label = score >= 70 ? '🔥' : score >= 40 ? '🟡' : '🔵'
  return (
    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: bg, color, border: `1px solid ${color}40` }}>
      {label} {score}/100
    </span>
  )
}

export default function LeadDetail() {
  const { id } = useParams()
  const router = useRouter()
  const { user, workspaceId, isAdmin } = useAuth()

  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [showNote, setShowNote] = useState(false)
  const [notes, setNotes] = useState([])

  useEffect(() => { if (user && (isAdmin || workspaceId)) fetchLead() }, [id, user, workspaceId, isAdmin])

  const fetchLead = async () => {
    let query = supabase.from('leads').select('*').eq('id', id)
    if (!isAdmin) query = query.eq('workspace_id', workspaceId)
    const { data, error } = await query.maybeSingle()
    if (error) console.error('LeadDetail:', error.message)
    setLead(data ?? null)
    if (data?.notes) setNotes(Array.isArray(data.notes) ? data.notes : [])
    setLoading(false)
  }

  const updateStatus = async (newStatus) => {
    setUpdating(true)
    let query = supabase.from('leads').update({ status: newStatus }).eq('id', id)
    if (!isAdmin) query = query.eq('workspace_id', workspaceId)
    const { error } = await query
    if (!error) setLead(l => ({ ...l, status: newStatus }))
    setUpdating(false)
  }

  const saveNote = async (text) => {
    const updated = [...notes, { text, at: new Date().toISOString() }]
    let query = supabase.from('leads').update({ notes: updated }).eq('id', id)
    if (!isAdmin) query = query.eq('workspace_id', workspaceId)
    const { error } = await query
    if (!error) setNotes(updated)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-sm" style={{ color: '#6B7280' }}>
      Loading...
    </div>
  )

  if (!lead) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 p-6">
      <p className="text-sm text-center" style={{ color: '#6B7280' }}>Lead not found or access denied.</p>
      <button onClick={() => router.push('/app/leads')} className="text-sm" style={{ color: '#6366F1' }}>
        ← Back to Pipeline
      </button>
    </div>
  )

  const cfg        = STAGES[lead.status]       || STAGES.new
  const intentCfg  = INTENT_CONFIG[lead.intent_level] || null

  return (
    <div className="p-4 sm:p-5 md:p-6 max-w-4xl mx-auto">
      {showNote && <NoteModal onClose={() => setShowNote(false)} onSave={saveNote} />}

      {/* Back button */}
      <button onClick={() => router.back()}
        className="flex items-center gap-2 text-sm mb-5 transition-colors"
        style={{ color: '#6B7280', minHeight: 44 }}
        onMouseOver={e => e.currentTarget.style.color = '#fff'}
        onMouseOut={e => e.currentTarget.style.color = '#6B7280'}>
        <ArrowLeft size={15} /> Back to Pipeline
      </button>

      {/* Lead header card */}
      <div className="rounded-2xl p-4 sm:p-6 mb-4" style={{ background: '#111827', border: '1px solid #1F2937' }}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366F1, #7C3AED)', fontSize: 16 }}>
              {lead.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-white">{lead.name}</h1>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                  {cfg.label}
                </span>
                {intentCfg && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: intentCfg.bg, color: intentCfg.color, border: `1px solid ${intentCfg.border}` }}>
                    {intentCfg.label}
                  </span>
                )}
                {lead.lead_score > 0 && <ScoreBadge score={lead.lead_score} />}
              </div>
              <div className="text-sm mt-0.5 truncate max-w-[220px] sm:max-w-none" style={{ color: '#6B7280' }}>
                {lead.email}
              </div>
            </div>
          </div>
          <div className="sm:text-right flex-shrink-0">
            <div className="text-xl sm:text-2xl font-black" style={{ color: '#34D399' }}>
              ${Number(lead.value || 0).toLocaleString()}
            </div>
            <div className="text-xs mt-0.5" style={{ color: '#4B5563' }}>Est. value</div>
            {lead.response_time_seconds > 0 && (
              <div className="text-xs mt-1 flex items-center gap-1 justify-end" style={{ color: '#4B5563' }}>
                <Zap size={10} style={{ color: '#34D399' }} />
                <span style={{ color: '#34D399' }}>AI replied in {lead.response_time_seconds}s</span>
              </div>
            )}
          </div>
        </div>

        {/* AI Summary */}
        {lead.ai_summary && (
          <div className="rounded-xl px-4 py-3 mb-4" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={11} style={{ color: '#818CF8' }} />
              <span className="text-xs font-semibold" style={{ color: '#818CF8' }}>AI Summary</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>{lead.ai_summary}</p>
          </div>
        )}

        {/* Contact info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          <a href={`mailto:${lead.email}`}
            className="flex items-center gap-3 rounded-xl px-3 py-3 transition-all"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', minHeight: 52 }}>
            <Mail size={14} style={{ color: '#4B5563', flexShrink: 0 }} />
            <div className="min-w-0">
              <div className="text-xs" style={{ color: '#374151' }}>Email</div>
              <div className="text-sm text-white truncate">{lead.email || '—'}</div>
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

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <a href={`mailto:${lead.email}`}
            className="flex items-center gap-2 text-sm px-4 rounded-xl font-medium text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #6366F1, #7C3AED)', minHeight: 44, paddingTop: 10, paddingBottom: 10 }}>
            <MessageSquare size={13} /> Send Email
          </a>
          <button onClick={() => updateStatus('won')} disabled={updating}
            className="flex items-center gap-2 text-sm px-4 rounded-xl font-medium transition-all disabled:opacity-50"
            style={{ background: 'rgba(52,211,153,0.1)', color: '#34D399', border: '1px solid rgba(52,211,153,0.25)', minHeight: 44 }}>
            <Calendar size={13} /> Mark Won
          </button>
          <button onClick={() => setShowNote(true)}
            className="flex items-center gap-2 text-sm px-4 rounded-xl font-medium transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1F2937', color: '#9CA3AF', minHeight: 44 }}>
            <FileText size={13} /> Add Note
          </button>
        </div>
      </div>

      {/* Meetings briefing */}
      {lead.meetings_briefing && (
        <div className="rounded-2xl p-4 sm:p-5 mb-4" style={{ background: '#111827', border: '1px solid #1F2937' }}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={14} style={{ color: '#34D399' }} />
            <h3 className="text-white font-semibold text-sm">Pre-Call Briefing</h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>{lead.meetings_briefing}</p>
        </div>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Notes — 2/3 width on desktop */}
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

        {/* Sidebar */}
        <div className="space-y-4">

          {/* Move Stage */}
          <div className="rounded-2xl p-4 sm:p-5" style={{ background: '#111827', border: '1px solid #1F2937' }}>
            <h4 className="text-white font-semibold mb-3 text-sm">Move Stage</h4>
            <div className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:space-y-1.5 md:gap-0">
              {Object.entries(STAGES).map(([key, { label, color, bg, border }]) => (
                <button key={key}
                  onClick={() => updateStatus(key)}
                  disabled={updating || lead.status === key}
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

          {/* Details */}
          <div className="rounded-2xl p-4 sm:p-5" style={{ background: '#111827', border: '1px solid #1F2937' }}>
            <h4 className="text-white font-semibold mb-3 text-sm">Details</h4>
            <div className="space-y-2.5">
              {[
                { label: 'Lead Score',  value: lead.lead_score ? `${lead.lead_score}/100` : '—' },
                { label: 'Intent',      value: lead.intent_level ? lead.intent_level.charAt(0).toUpperCase() + lead.intent_level.slice(1) : '—' },
                { label: 'Response',    value: lead.response_time_seconds ? `${lead.response_time_seconds}s` : '—' },
                { label: 'Name',        value: lead.name },
                { label: 'Email',       value: lead.email },
                { label: 'Phone',       value: lead.phone },
                { label: 'Company',     value: lead.company },
                { label: 'Source',      value: lead.source },
                { label: 'Value',       value: `$${Number(lead.value || 0).toLocaleString()}` },
                { label: 'Status',      value: cfg.label },
                { label: 'Created',     value: new Date(lead.created_at).toLocaleDateString() },
                { label: 'Last Contact',value: lead.last_contacted_at ? new Date(lead.last_contacted_at).toLocaleDateString() : '—' },
              ].map(({ label, value }) => value && value !== '—' ? (
                <div key={label} className="flex justify-between gap-3">
                  <span className="text-xs flex-shrink-0" style={{ color: '#6B7280' }}>{label}</span>
                  <span className="text-xs font-medium text-white text-right truncate max-w-[130px]">{value}</span>
                </div>
              ) : null)}
            </div>
          </div>

          {/* Call info if exists */}
          {(lead.call_summary || lead.call_duration) && (
            <div className="rounded-2xl p-4 sm:p-5" style={{ background: '#111827', border: '1px solid #1F2937' }}>
              <h4 className="text-white font-semibold mb-3 text-sm">Call Details</h4>
              <div className="space-y-2.5">
                {lead.call_duration && (
                  <div className="flex justify-between gap-3">
                    <span className="text-xs" style={{ color: '#6B7280' }}>Duration</span>
                    <span className="text-xs font-medium text-white">{lead.call_duration}s</span>
                  </div>
                )}
                {lead.call_summary && (
                  <p className="text-xs leading-relaxed mt-2" style={{ color: '#6B7280' }}>{lead.call_summary}</p>
                )}
                {lead.call_recording_url && (
                  <a href={lead.call_recording_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs mt-2"
                    style={{ color: '#6366F1' }}>
                    <ExternalLink size={11} /> Listen to recording
                  </a>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Communications */}
      <CommunicationsTab leadId={id} />

    </div>
  )
}