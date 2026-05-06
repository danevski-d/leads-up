import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, Phone, Mail, MessageSquare, Calendar,
  CheckCircle, Bot, FileText, Star, MoreHorizontal, ExternalLink
} from 'lucide-react'
import { pipelineData, activityTimeline } from '../data/mockData'

const stageConfig = {
  new: { label: 'New', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  contacted: { label: 'Contacted', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  qualified: { label: 'Qualified', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  booked: { label: 'Booked', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  lost: { label: 'Lost', color: 'bg-slate-600/30 text-slate-400 border-slate-600/30' },
}

const activityIcons = {
  bot: { icon: Bot, bg: 'bg-indigo-500/20', color: 'text-indigo-400' },
  message: { icon: MessageSquare, bg: 'bg-blue-500/20', color: 'text-blue-400' },
  check: { icon: CheckCircle, bg: 'bg-emerald-500/20', color: 'text-emerald-400' },
  phone: { icon: Phone, bg: 'bg-purple-500/20', color: 'text-purple-400' },
  note: { icon: FileText, bg: 'bg-amber-500/20', color: 'text-amber-400' },
}

export default function LeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Find lead in all pipeline stages
  let lead = null
  let stage = null
  for (const [key, leads] of Object.entries(pipelineData)) {
    const found = leads.find(l => l.id === id)
    if (found) { lead = found; stage = key; break }
  }

  // Default to first qualified lead for demo
  if (!lead) {
    lead = pipelineData.qualified[0]
    stage = 'qualified'
  }

  const cfg = stageConfig[stage] || stageConfig.new
  const timeline = activityTimeline.filter(a => a.leadId === lead.id)
  // If no timeline for this lead, show the demo timeline
  const displayTimeline = timeline.length > 0 ? timeline : activityTimeline

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft size={15} />
        Back to Pipeline
      </button>

      {/* Lead header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
              {lead.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">{lead.name}</h1>
                <span className={`text-xs px-2.5 py-1 rounded-full border ${cfg.color}`}>{cfg.label}</span>
              </div>
              <div className="text-slate-400 mt-0.5">{lead.company}</div>
              <div className="flex items-center gap-1 mt-2">
                <Star size={13} className="text-amber-400 fill-amber-400" />
                <span className="text-sm font-semibold text-white">Lead Score: {lead.score}/100</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right mr-2">
              <div className="text-2xl font-black text-emerald-400">${lead.value.toLocaleString()}</div>
              <div className="text-xs text-slate-500">Est. value</div>
            </div>
            <button className="text-slate-400 hover:text-white p-2 transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* Contact info */}
        <div className="grid sm:grid-cols-3 gap-3 mt-6">
          <a href={`tel:${lead.phone}`} className="flex items-center gap-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl px-4 py-3 transition-all group">
            <Phone size={15} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
            <div>
              <div className="text-xs text-slate-600">Phone</div>
              <div className="text-sm text-white">{lead.phone}</div>
            </div>
          </a>
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
              <div className="text-sm text-white">{lead.source}</div>
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
          <button className="flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 text-sm px-4 py-2 rounded-xl font-medium transition-all">
            <Phone size={14} />
            Log Call
          </button>
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-sm px-4 py-2 rounded-xl font-medium transition-all">
            <FileText size={14} />
            Add Note
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Activity Timeline */}
        <div className="md:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-5">Activity Timeline</h3>
            <div className="space-y-2">
              {displayTimeline.map(({ id: aid, type, text, detail, time, icon }) => {
                const cfg = activityIcons[icon] || activityIcons.note
                const Icon = cfg.icon
                return (
                  <div key={aid} className="relative flex gap-4 pb-6 timeline-item">
                    <div className={`w-10 h-10 ${cfg.bg} rounded-xl flex items-center justify-center flex-shrink-0 z-10`}>
                      <Icon size={16} className={cfg.color} />
                    </div>
                    <div className="flex-1 min-w-0 pt-1.5">
                      <div className="text-sm font-medium text-white">{text}</div>
                      {detail && (
                        <div className="mt-1.5 text-sm text-slate-400 bg-slate-800/50 rounded-xl px-4 py-3 leading-relaxed">
                          {detail}
                        </div>
                      )}
                      <div className="text-xs text-slate-600 mt-2">{time}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Side info */}
        <div className="space-y-4">
          {/* Stage progression */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h4 className="text-white font-semibold mb-4 text-sm">Stage</h4>
            <div className="space-y-2">
              {Object.entries(stageConfig).map(([key, { label, color }]) => (
                <div key={key} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${stage === key ? `border ${color}` : 'text-slate-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${stage === key ? 'bg-current' : 'bg-slate-700'}`} />
                  {label}
                  {stage === key && <CheckCircle size={13} className="ml-auto" />}
                </div>
              ))}
            </div>
          </div>

          {/* Lead details */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h4 className="text-white font-semibold mb-4 text-sm">Details</h4>
            <div className="space-y-3">
              {[
                { label: 'Lead Score', value: `${lead.score}/100` },
                { label: 'Est. Value', value: `$${lead.value.toLocaleString()}` },
                { label: 'Source', value: lead.source },
                { label: 'Created', value: lead.time },
                ...(lead.bookDate ? [{ label: 'Appointment', value: lead.bookDate }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-2">
                  <span className="text-xs text-slate-500">{label}</span>
                  <span className="text-xs text-white font-medium text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
