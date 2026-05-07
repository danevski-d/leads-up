import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Phone, Mail, MessageSquare, Calendar,
  CheckCircle, Bot, FileText, Star, MoreHorizontal, ExternalLink
} from 'lucide-react'
import { supabase } from '../lib/supabase'

const stageConfig = {
  new: { label: 'New', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  contacted: { label: 'Contacted', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  qualified: { label: 'Qualified', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  booked: { label: 'Booked', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  lost: { label: 'Lost', color: 'bg-slate-600/30 text-slate-400 border-slate-600/30' },
}

export default function LeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchLead()
  }, [id])

  const fetchLead = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()

    if (error) console.error(error)
    else setLead(data)
    setLoading(false)
  }

  const updateStatus = async (newStatus) => {
    setUpdating(true)
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', id)
    if (!error) setLead({ ...lead, status: newStatus })
    setUpdating(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full text-slate-500">Loading...</div>
  )

  if (!lead) return (
    <div className="flex items-center justify-center h-full text-slate-500">Lead not found.</div>
  )

  const cfg = stageConfig[lead.status] || stageConfig.new

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft size={15} />
        Back to Pipeline
      </button>

      {/* Lead header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
              {lead.name?.split(' ').map(n => n[0]).join('') || '?'}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">{lead.name}</h1>
                <span className={`text-xs px-2.5 py-1 rounded-full border ${cfg.color}`}>{cfg.label}</span>
              </div>
              <div className="text-slate-400 mt-0.5">{lead.email}</div>
              {lead.source && (
                <div className="text-xs text-slate-500 mt-1">Source: {lead.source}</div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-emerald-400">${Number(lead.value || 0).toLocaleString()}</div>
            <div className="text-xs text-slate-500">Est. value</div>
          </div>
        </div>

        {/* Contact info */}
        <div className="grid sm:grid-cols-2 gap-3 mt-6">
          <a href={`mailto:${lead.email}`} className="flex items-center gap-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl px-4 py-3 transition-all group">
            <Mail size={15} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
            <div>
              <div className="text-xs text-slate-600">Email</div>
              <div className="text-sm text-white truncate">{lead.email}</div>
            </div>
          </a>
          <div className="flex items-center gap-3 bg-slate-800/50 rounded-xl px-4 py-3">
            <ExternalLink size={15} className="text-slate-500" />
            <div>
              <div className="text-xs text-slate-600">Source</div>
              <div className="text-sm text-white">{lead.source || '—'}</div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 mt-5">
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-xl font-medium transition-all">
            <MessageSquare size={14} />
            Send Message
          </button>
          <button className="flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-sm px-4 py-2 rounded-xl font-medium transition-all">
            <Calendar size={14} />
            Book Appointment
          </button>
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-sm px-4 py-2 rounded-xl font-medium transition-all">
            <FileText size={14} />
            Add Note
          </button>
        </div>
      </div>

      {/* Stage selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h4 className="text-white font-semibold mb-4 text-sm">Move Stage</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(stageConfig).map(([key, { label, color }]) => (
            <button
              key={key}
              onClick={() => updateStatus(key)}
              disabled={updating || lead.status === key}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all disabled:opacity-50
                ${lead.status === key ? `border ${color}` : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'}`}
            >
              {lead.status === key && <CheckCircle size={13} className="inline mr-1.5" />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mt-5">
        <h4 className="text-white font-semibold mb-4 text-sm">Details</h4>
        <div className="space-y-3">
          {[
            { label: 'Name', value: lead.name },
            { label: 'Email', value: lead.email },
            { label: 'Source', value: lead.source },
            { label: 'Value', value: `$${Number(lead.value || 0).toLocaleString()}` },
            { label: 'Status', value: lead.status },
            { label: 'Created', value: new Date(lead.created_at).toLocaleDateString() },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start justify-between gap-2">
              <span className="text-xs text-slate-500">{label}</span>
              <span className="text-xs text-white font-medium text-right">{value || '—'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}