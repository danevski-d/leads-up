'use client'
import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Clock, Calendar, DollarSign, BarChart2, Zap } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const RANGES = ['7d', '30d', '90d', 'All']

/* ── Revenue chart ── */
function RevenueChart({ leads }) {
  const wonLeads = leads.filter(l => l.status === 'won' && l.value)

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const byMonth = months.map((month, i) => ({
    month,
    value: wonLeads
      .filter(l => new Date(l.created_at).getMonth() === i)
      .reduce((s, l) => s + Number(l.value), 0),
  })).filter(d => d.value > 0)

  const total = wonLeads.reduce((s, l) => s + Number(l.value), 0)

  if (byMonth.length === 0) {
    return (
      <div className="p-5 rounded-2xl" style={{ background: '#111827', border: '1px solid #1F2937' }}>
        <div className="flex items-center gap-2 mb-3">
          <DollarSign size={14} style={{ color: '#34D399' }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#34D399' }}>Revenue Won</span>
        </div>
        <div className="text-2xl font-black text-white mb-1">$0</div>
        <p className="text-xs" style={{ color: '#6B7280' }}>No won leads yet. Revenue will appear here once leads are marked Won.</p>
      </div>
    )
  }

  const max  = Math.max(...byMonth.map(d => d.value))
  const min  = Math.min(...byMonth.map(d => d.value))
  const span = max - min || 1
  const W = 700, H = 160
  const padL = 44, padR = 12, padT = 10, padB = 28
  const cW = W - padL - padR, cH = H - padT - padB

  const pts = byMonth.map((d, i) => ({
    x: padL + (i / Math.max(byMonth.length - 1, 1)) * cW,
    y: padT + cH - ((d.value - min) / span) * cH,
    ...d,
  }))
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L ${pts.at(-1).x} ${H - padB} L ${pts[0].x} ${H - padB} Z`

  return (
    <div className="p-5 rounded-2xl" style={{ background: '#111827', border: '1px solid #1F2937' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={14} style={{ color: '#34D399' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#34D399' }}>Revenue Won</span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-white">${total.toLocaleString()}</div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-xs" style={{ color: '#4B5563' }}>Won leads value</div>
          <div className="text-sm font-semibold" style={{ color: '#9CA3AF' }}>{wonLeads.length} clients</div>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 140 }}>
        <defs>
          <linearGradient id="rev-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.33, 0.66, 1].map((t, i) => (
          <g key={i}>
            <line x1={padL} y1={padT + cH * (1-t)} x2={padL+cW} y2={padT + cH * (1-t)} stroke="#1F2937" strokeWidth="1" />
            <text x={padL-5} y={padT + cH * (1-t) + 4} textAnchor="end" fontSize="9" fill="#374151">
              ${((min + span * t) / 1000).toFixed(0)}k
            </text>
          </g>
        ))}
        <path d={areaPath} fill="url(#rev-area)" />
        <path d={linePath} fill="none" stroke="#34D399" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="#111827" stroke="#34D399" strokeWidth="2" />
            <text x={p.x} y={H-padB+13} textAnchor="middle" fontSize="9" fill="#374151">{p.month}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

/* ── Conversion funnel ── */
function ConversionFunnel({ leads }) {
  const total     = leads.length
  const aiResp    = leads.filter(l => ['ai_responded','engaged','qualified','meeting_scheduled','won'].includes(l.status)).length
  const engaged   = leads.filter(l => ['engaged','qualified','meeting_scheduled','won'].includes(l.status)).length
  const qualified = leads.filter(l => ['qualified','meeting_scheduled','won'].includes(l.status)).length
  const meeting   = leads.filter(l => ['meeting_scheduled','won'].includes(l.status)).length
  const won       = leads.filter(l => l.status === 'won').length
  const rate      = total > 0 ? ((meeting / total) * 100).toFixed(1) : 0

  const stages = [
    { label: 'Leads Captured',    count: total,     pct: 100 },
    { label: 'AI Responded',      count: aiResp,    pct: total > 0 ? Math.round((aiResp/total)*100)    : 0 },
    { label: 'Engaged',           count: engaged,   pct: total > 0 ? Math.round((engaged/total)*100)   : 0 },
    { label: 'Qualified',         count: qualified, pct: total > 0 ? Math.round((qualified/total)*100) : 0 },
    { label: 'Meeting Scheduled', count: meeting,   pct: total > 0 ? Math.round((meeting/total)*100)   : 0 },
    { label: 'Won',               count: won,       pct: total > 0 ? Math.round((won/total)*100)       : 0 },
  ]
  const colors = ['#6366F1', '#67E8F9', '#F59E0B', '#A78BFA', '#34D399', '#FBBF24']

  return (
    <div className="p-5 rounded-2xl" style={{ background: '#111827', border: '1px solid #1F2937' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={14} style={{ color: '#A78BFA' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#A78BFA' }}>Meeting Rate</span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-white">{rate}%</div>
          <div className="text-xs mt-1" style={{ color: '#4B5563' }}>{meeting} of {total} leads scheduled</div>
        </div>
        <div className="text-right">
          <div className="text-xs mb-1" style={{ color: '#4B5563' }}>Industry avg</div>
          <div className="text-sm font-bold" style={{ color: '#FCA5A5' }}>~12%</div>
        </div>
      </div>
      {total === 0 ? (
        <p className="text-xs" style={{ color: '#6B7280' }}>Add leads to see your conversion funnel.</p>
      ) : (
        <div className="space-y-2">
          {stages.map(({ label, count, pct }, i) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: '#6B7280' }}>{label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold" style={{ color: colors[i] }}>{pct}%</span>
                  <span className="text-xs w-5 text-right" style={{ color: '#4B5563' }}>{count}</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1F2937' }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: colors[i], opacity: 0.85, transition: 'width 0.5s ease' }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Intent breakdown ── */
function IntentChart({ leads }) {
  const hot    = leads.filter(l => l.intent_level === 'hot').length
  const warm   = leads.filter(l => l.intent_level === 'warm').length
  const cold   = leads.filter(l => l.intent_level === 'cold').length
  const scored = hot + warm + cold

  if (scored === 0) return null

  const avgScore = Math.round(leads.reduce((s, l) => s + (l.lead_score || l.bant_score || 0), 0) / leads.length)

  return (
    <div className="p-5 rounded-2xl" style={{ background: '#111827', border: '1px solid #1F2937' }}>
      <div className="flex items-center gap-2 mb-4">
        <Zap size={14} style={{ color: '#818CF8' }} />
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#818CF8' }}>Lead Intelligence</span>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: '🔥 Hot',  count: hot,  color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
          { label: '🟡 Warm', count: warm, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
          { label: '🔵 Cold', count: cold, color: '#60A5FA', bg: 'rgba(96,165,250,0.1)' },
        ].map(({ label, count, color, bg }) => (
          <div key={label} className="text-center p-3 rounded-xl" style={{ background: bg }}>
            <div style={{ fontSize: 22, fontWeight: 900, color, letterSpacing: '-1px' }}>{count}</div>
            <div style={{ fontSize: 10, color, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 12, color: '#6B7280' }}>Avg lead score</span>
        <span style={{ fontSize: 16, fontWeight: 900, color: avgScore >= 70 ? '#EF4444' : avgScore >= 40 ? '#F59E0B' : '#60A5FA' }}>
          {avgScore}/100
        </span>
      </div>
      <div style={{ height: 4, borderRadius: 4, background: '#1F2937', marginTop: 6 }}>
        <div style={{
          height: '100%', borderRadius: 4, width: `${avgScore}%`,
          background: avgScore >= 70 ? '#EF4444' : avgScore >= 40 ? '#F59E0B' : '#60A5FA',
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  )
}

/* ── Response time chart ── */
function ResponseTimeChart({ leads }) {
  const target = 60
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const withTime = leads.filter(l => l.response_time_seconds > 0 && l.response_time_seconds <= 3600)

  const avgTime = withTime.length > 0
    ? Math.round(withTime.reduce((s, l) => s + l.response_time_seconds, 0) / withTime.length)
    : null

  const byDay = [1, 2, 3, 4, 5, 6, 0].map((dayIndex, i) => {
    const dayLeads = withTime.filter(l => new Date(l.created_at).getDay() === dayIndex)
    const avg = dayLeads.length > 0
      ? Math.round(dayLeads.reduce((s, l) => s + l.response_time_seconds, 0) / dayLeads.length)
      : null
    return { label: days[i], avg, count: dayLeads.length }
  })

  const hasData = withTime.length > 0
  const maxVal = hasData ? Math.max(...byDay.filter(d => d.avg).map(d => d.avg), target + 20) : 90

  if (!hasData) {
    return (
      <div className="p-5 rounded-2xl" style={{ background: '#111827', border: '1px solid #1F2937' }}>
        <div className="flex items-center gap-2 mb-3">
          <Clock size={14} style={{ color: '#818CF8' }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#818CF8' }}>Avg Response Time</span>
        </div>
        <div className="text-2xl font-black text-white mb-1">No data yet</div>
        <p className="text-xs" style={{ color: '#6B7280' }}>
          Response times will appear here once n8n starts saving them to leads.
          Make sure Workflow 1 is writing <code style={{ color: '#818CF8' }}>response_time_seconds</code> to Supabase.
        </p>
      </div>
    )
  }

  return (
    <div className="p-5 rounded-2xl" style={{ background: '#111827', border: '1px solid #1F2937' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} style={{ color: '#818CF8' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#818CF8' }}>Avg Response Time</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-white">{avgTime}s</span>
            {avgTime <= target && (
              <span className="text-sm font-bold" style={{ color: '#34D399' }}>
                ↓ {Math.round(((target - avgTime) / target) * 100)}% under target
              </span>
            )}
            {avgTime > target && (
              <span className="text-sm font-bold" style={{ color: '#FCA5A5' }}>↑ above target</span>
            )}
          </div>
          <div className="text-xs mt-1" style={{ color: '#4B5563' }}>Based on {withTime.length} real responses</div>
        </div>
        <div className="text-right">
          <div className="text-xs mb-1" style={{ color: '#4B5563' }}>Target</div>
          <div className="text-sm font-bold" style={{ color: '#FBBF24' }}>&lt; 60s</div>
        </div>
      </div>
      <div className="space-y-2 mt-3">
        {byDay.map(({ label, avg, count }, i) => {
          if (!avg) return (
            <div key={i} className="flex items-center gap-2.5">
              <span className="text-xs w-7 flex-shrink-0" style={{ color: '#4B5563' }}>{label}</span>
              <div className="flex-1 h-5 rounded-lg" style={{ background: '#1F2937' }}>
                <div className="h-full flex items-center pl-2">
                  <span className="text-[9px]" style={{ color: '#374151' }}>No data</span>
                </div>
              </div>
            </div>
          )
          const pct = Math.min((avg / maxVal) * 100, 100)
          const over = avg > target
          return (
            <div key={i} className="flex items-center gap-2.5">
              <span className="text-xs w-7 flex-shrink-0" style={{ color: '#4B5563' }}>{label}</span>
              <div className="flex-1 h-5 rounded-lg overflow-hidden" style={{ background: '#1F2937' }}>
                <div className="h-full rounded-lg flex items-center justify-end pr-2"
                  style={{ width: `${pct}%`, background: over ? '#FCA5A5' : '#818CF8', opacity: 0.85, transition: 'width 0.5s ease' }}>
                  <span className="text-[9px] font-bold text-white">{avg}s</span>
                </div>
              </div>
              <span className="text-[9px] flex-shrink-0" style={{ color: '#374151' }}>{count}</span>
            </div>
          )
        })}
        <div className="flex items-center gap-2 mt-2">
          <div className="w-4 h-px border-t border-dashed" style={{ borderColor: '#FBBF24' }} />
          <span className="text-[10px]" style={{ color: '#4B5563' }}>60s target threshold</span>
        </div>
      </div>
    </div>
  )
}

function EmptyReports() {
  return (
    <div className="text-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ background: 'rgba(99,102,241,0.1)' }}>
        <BarChart2 size={28} style={{ color: '#6366F1' }} />
      </div>
      <h3 className="text-white font-semibold mb-2">No data yet</h3>
      <p className="text-sm max-w-xs mx-auto" style={{ color: '#6B7280' }}>
        Add leads to your pipeline and reports will automatically populate here.
      </p>
    </div>
  )
}

/* ── Main page ── */
export default function Reports() {
  const { user, workspaceId } = useAuth()
  const [range, setRange] = useState('30d')
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !workspaceId) return
    const fetchLeads = async () => {
      setLoading(true)
      let query = supabase
        .from('leads')
        .select('*')
        .eq('workspace_id', workspaceId)

      if (range !== 'All') {
        const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
        const from = new Date(Date.now() - days * 86400000).toISOString()
        query = query.gte('created_at', from)
      }

      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) console.error('Reports:', error.message)
      setLeads(data || [])
      setLoading(false)
    }
    fetchLeads()
  }, [user, workspaceId, range])

  const wonLeads     = leads.filter(l => l.status === 'won')
  const totalValue   = wonLeads.reduce((s, l) => s + Number(l.value || 0), 0)
  const meetingLeads = leads.filter(l => ['meeting_scheduled', 'won'].includes(l.status))
  const meetingRate  = leads.length > 0 ? ((meetingLeads.length / leads.length) * 100).toFixed(1) : 0

  const leadsWithTime   = leads.filter(l => l.response_time_seconds > 0 && l.response_time_seconds <= 3600)
  const avgResponseTime = leadsWithTime.length > 0
    ? Math.round(leadsWithTime.reduce((s, l) => s + l.response_time_seconds, 0) / leadsWithTime.length)
    : null
  const avgResponseLabel = avgResponseTime ? `${avgResponseTime}s` : 'No data'

  const kpis = [
    { label: 'Revenue Won',  value: `$${totalValue.toLocaleString()}`, change: null, icon: DollarSign, color: '#34D399' },
    { label: 'Meeting Rate', value: `${meetingRate}%`,                 change: null, icon: Calendar,   color: '#A78BFA' },
    { label: 'Avg Response', value: avgResponseLabel,                  change: null, icon: Clock,      color: '#818CF8',
      sub: leadsWithTime.length > 0 ? `${leadsWithTime.length} measured` : 'Update n8n workflow' },
  ]

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Reports</h1>
          <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Response time, meeting rate, revenue won</p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl self-start sm:self-auto"
          style={{ background: '#111827', border: '1px solid #1F2937' }}>
          {RANGES.map(r => (
            <button key={r} onClick={() => setRange(r)}
              className="text-xs px-3 rounded-lg font-medium transition-all"
              style={{ minHeight: 36, background: range === r ? '#1F2937' : 'transparent', color: range === r ? '#F9FAFB' : '#6B7280' }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-sm" style={{ color: '#6B7280' }}>Loading reports...</div>
      ) : leads.length === 0 ? (
        <EmptyReports />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {kpis.map(({ label, value, change, icon: Icon, color, sub }) => (
              <div key={label} className="p-4 rounded-2xl" style={{ background: '#111827', border: '1px solid #1F2937' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                    <Icon size={15} style={{ color }} />
                  </div>
                  {change !== null && (
                    <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${change > 0 ? 'text-emerald-400' : 'text-red-400'}`}
                      style={{ background: change > 0 ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)' }}>
                      {change > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {Math.abs(change)}%
                    </div>
                  )}
                </div>
                <div className="text-2xl font-black text-white mb-1">{value}</div>
                <div className="text-xs" style={{ color: '#6B7280' }}>{label}</div>
                {sub && <div className="text-xs mt-1" style={{ color: '#4B5563' }}>{sub}</div>}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <RevenueChart leads={leads} />
            <IntentChart leads={leads} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResponseTimeChart leads={leads} />
              <ConversionFunnel leads={leads} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}