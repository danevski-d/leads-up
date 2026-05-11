'use client'
import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Clock, Calendar, DollarSign, BarChart2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const RANGES = ['7d', '30d', '90d', 'All']

/* ── Revenue chart ──────────────────────────────────────────── */
function RevenueChart({ leads }) {
  const bookedLeads = leads.filter(l => l.status === 'booked' && l.value)

  // Group by month
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const byMonth = months.map((month, i) => ({
    month,
    value: bookedLeads
      .filter(l => new Date(l.created_at).getMonth() === i)
      .reduce((s, l) => s + Number(l.value), 0),
  })).filter(d => d.value > 0)

  const total = bookedLeads.reduce((s, l) => s + Number(l.value), 0)

  if (byMonth.length === 0) {
    return (
      <div className="p-5 rounded-2xl" style={{ background: '#111827', border: '1px solid #1F2937' }}>
        <div className="flex items-center gap-2 mb-3">
          <DollarSign size={14} style={{ color: '#34D399' }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#34D399' }}>Revenue Recovered</span>
        </div>
        <div className="text-2xl font-black text-white mb-1">$0</div>
        <p className="text-xs" style={{ color: '#6B7280' }}>No booked leads yet. Revenue will appear here once leads are booked.</p>
      </div>
    )
  }

  const max = Math.max(...byMonth.map(d => d.value))
  const min = Math.min(...byMonth.map(d => d.value))
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
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#34D399' }}>Revenue Recovered</span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-white">${total.toLocaleString()}</div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-xs" style={{ color: '#4B5563' }}>Booked leads value</div>
          <div className="text-sm font-semibold" style={{ color: '#9CA3AF' }}>{bookedLeads.length} leads</div>
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

/* ── Booking funnel ─────────────────────────────────────────── */
function BookingFunnel({ leads }) {
  const total     = leads.length
  const contacted = leads.filter(l => ['contacted','qualified','booked'].includes(l.status)).length
  const qualified = leads.filter(l => ['qualified','booked'].includes(l.status)).length
  const booked    = leads.filter(l => l.status === 'booked').length
  const rate      = total > 0 ? ((booked / total) * 100).toFixed(1) : 0

  const stages = [
    { label: 'Leads Captured', count: total,     pct: 100 },
    { label: 'Contacted',      count: contacted, pct: total > 0 ? Math.round((contacted/total)*100) : 0 },
    { label: 'Qualified',      count: qualified, pct: total > 0 ? Math.round((qualified/total)*100) : 0 },
    { label: 'Booked',         count: booked,    pct: total > 0 ? Math.round((booked/total)*100)    : 0 },
  ]
  const colors = ['#6366F1', '#7C6BF8', '#8B5CF6', '#A78BFA']

  return (
    <div className="p-5 rounded-2xl" style={{ background: '#111827', border: '1px solid #1F2937' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={14} style={{ color: '#A78BFA' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#A78BFA' }}>Booking Rate</span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-white">{rate}%</div>
          <div className="text-xs mt-1" style={{ color: '#4B5563' }}>{booked} of {total} leads booked</div>
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
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: colors[i], opacity: 0.85 }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Response time chart (static — real data would require logs) */
function ResponseTimeChart() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const vals = [61, 44, 38, 52, 39, 41, 43]
  const max = 90, target = 60

  return (
    <div className="p-5 rounded-2xl" style={{ background: '#111827', border: '1px solid #1F2937' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} style={{ color: '#818CF8' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#818CF8' }}>Avg Response Time</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-white">43s</span>
            <span className="text-sm font-bold" style={{ color: '#34D399' }}>↓ 12% faster</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs mb-1" style={{ color: '#4B5563' }}>Target</div>
          <div className="text-sm font-bold" style={{ color: '#FBBF24' }}>&lt; 60s</div>
        </div>
      </div>
      <div className="space-y-2 mt-3">
        {days.map((day, i) => {
          const pct = (vals[i] / max) * 100
          const over = vals[i] > target
          return (
            <div key={i} className="flex items-center gap-2.5">
              <span className="text-xs w-7 flex-shrink-0" style={{ color: '#4B5563' }}>{day}</span>
              <div className="flex-1 h-5 rounded-lg overflow-hidden" style={{ background: '#1F2937' }}>
                <div className="h-full rounded-lg flex items-center justify-end pr-2"
                  style={{ width: `${pct}%`, background: over ? '#FCA5A5' : '#818CF8', opacity: 0.85 }}>
                  <span className="text-[9px] font-bold text-white">{vals[i]}s</span>
                </div>
              </div>
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

/* ── Empty state ────────────────────────────────────────────── */
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

/* ── Main page ──────────────────────────────────────────────── */
export default function Reports() {
  const { user } = useAuth()
  const [range, setRange] = useState('30d')
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetchLeads = async () => {
      setLoading(true)
      let query = supabase.from('leads').select('*').eq('user_id', user.id)
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
  }, [user, range])

  const totalValue  = leads.filter(l => l.status === 'booked').reduce((s, l) => s + Number(l.value || 0), 0)
  const booked      = leads.filter(l => l.status === 'booked').length
  const bookingRate = leads.length > 0 ? ((booked / leads.length) * 100).toFixed(1) : 0

  const kpis = [
    { label: 'Revenue Recovered', value: `$${totalValue.toLocaleString()}`, change: null, icon: DollarSign, color: '#34D399' },
    { label: 'Booking Rate',      value: `${bookingRate}%`,                 change: null, icon: Calendar,   color: '#A78BFA' },
    { label: 'Avg Response',      value: '43s',                             change: -12,  icon: Clock,      color: '#818CF8' },
  ]

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Reports</h1>
          <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Response time, booking rate, revenue recovered</p>
        </div>
        {/* Range selector */}
        <div className="flex gap-1 p-1 rounded-xl self-start sm:self-auto" style={{ background: '#111827', border: '1px solid #1F2937' }}>
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
          {/* KPI strip — 1 col mobile, 3 col sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {kpis.map(({ label, value, change, icon: Icon, color }) => (
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
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="space-y-4">
            <RevenueChart leads={leads} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResponseTimeChart />
              <BookingFunnel leads={leads} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
