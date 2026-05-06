import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Plus, MoreHorizontal } from 'lucide-react'
import { pipelineData } from '../data/mockData'

const columns = [
  { key: 'new', label: 'New', dot: 'bg-indigo-500', badge: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' },
  { key: 'contacted', label: 'Contacted', dot: 'bg-blue-500', badge: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  { key: 'qualified', label: 'Qualified', dot: 'bg-purple-500', badge: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' },
  { key: 'booked', label: 'Booked', dot: 'bg-emerald-500', badge: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
  { key: 'lost', label: 'Lost', dot: 'bg-slate-500', badge: 'bg-slate-600/30 text-slate-400 border border-slate-600/30' },
]

const sourceColors = {
  'Web Form': 'bg-cyan-500/10 text-cyan-400',
  'Google Ads': 'bg-blue-500/10 text-blue-400',
  'Facebook': 'bg-indigo-500/10 text-indigo-400',
  'Referral': 'bg-emerald-500/10 text-emerald-400',
  'Yelp': 'bg-red-500/10 text-red-400',
}

function ScoreBadge({ score }) {
  const color = score >= 90 ? 'text-emerald-400' : score >= 70 ? 'text-amber-400' : 'text-red-400'
  return <span className={`text-xs font-bold ${color}`}>{score}</span>
}

function LeadCard({ lead, stageKey }) {
  const col = columns.find(c => c.key === stageKey)
  return (
    <Link to={`/app/leads/${lead.id}`}
      className="block bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-xl p-4 transition-all group cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {lead.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors leading-tight">{lead.name}</div>
            <div className="text-xs text-slate-500">{lead.company}</div>
          </div>
        </div>
        <button className="text-slate-600 hover:text-slate-400 transition-colors opacity-0 group-hover:opacity-100">
          <MoreHorizontal size={15} />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm font-bold text-emerald-400">${lead.value.toLocaleString()}</div>
        <ScoreBadge score={lead.score} />
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className={`text-xs px-2 py-0.5 rounded-full ${sourceColors[lead.source] || 'bg-slate-700/50 text-slate-400'}`}>
          {lead.source}
        </span>
        <span className="text-xs text-slate-600">{lead.time}</span>
      </div>

      {lead.bookDate && (
        <div className="mt-3 text-xs text-emerald-400 bg-emerald-500/10 rounded-lg px-3 py-1.5 font-medium">
          Booked: {lead.bookDate}
        </div>
      )}
      {lead.lostReason && (
        <div className="mt-3 text-xs text-slate-500 bg-slate-700/30 rounded-lg px-3 py-1.5">
          {lead.lostReason}
        </div>
      )}
    </Link>
  )
}

export default function Leads() {
  const [search, setSearch] = useState('')

  const filtered = (key) => {
    const leads = pipelineData[key] || []
    if (!search) return leads
    const q = search.toLowerCase()
    return leads.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.company.toLowerCase().includes(q) ||
      l.source.toLowerCase().includes(q)
    )
  }

  const totalValue = Object.values(pipelineData).flat().reduce((s, l) => s + l.value, 0)

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Lead Pipeline</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {Object.values(pipelineData).flat().length} leads ·{' '}
            <span className="text-emerald-400 font-medium">${(totalValue / 1000).toFixed(0)}k total pipeline value</span>
          </p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2.5 rounded-xl font-medium transition-all">
          <Plus size={15} />
          Add Lead
        </button>
      </div>

      {/* Search & filter bar */}
      <div className="flex gap-3 mb-5 flex-shrink-0">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-white text-sm px-4 py-2.5 rounded-xl transition-all">
          <Filter size={14} />
          Filter
        </button>
      </div>

      {/* Kanban board */}
      <div className="kanban-scroll flex-1 pb-4">
        {columns.map(col => {
          const leads = filtered(col.key)
          const total = leads.reduce((s, l) => s + l.value, 0)
          return (
            <div key={col.key} className="flex-shrink-0 w-72 flex flex-col">
              {/* Column header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 ${col.dot} rounded-full`} />
                  <span className="text-sm font-semibold text-white">{col.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${col.badge}`}>{leads.length}</span>
                </div>
                {total > 0 && (
                  <span className="text-xs text-slate-500">${(total / 1000).toFixed(1)}k</span>
                )}
              </div>

              {/* Cards */}
              <div className="flex-1 space-y-2 min-h-16">
                {leads.length === 0 ? (
                  <div className="border-2 border-dashed border-slate-800 rounded-xl h-24 flex items-center justify-center text-slate-600 text-sm">
                    No leads
                  </div>
                ) : (
                  leads.map(lead => (
                    <LeadCard key={lead.id} lead={lead} stageKey={col.key} />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
