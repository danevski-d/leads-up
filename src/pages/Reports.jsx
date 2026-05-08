import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Clock, Calendar, DollarSign, BarChart2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const font = "system-ui,-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif"
const card = { background: '#FFFFFF', border: '1px solid #E8E8E8', borderRadius: 14 }
const RANGES = ['7d', '30d', '90d', 'All']

function RevenueChart({ leads }) {
  const bookedLeads = leads.filter(l => l.status === 'booked' && l.value)

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
      <div style={{ ...card, padding: 20, fontFamily: font }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <DollarSign size={14} style={{ color: '#10B981' }} />
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#10B981' }}>Revenue Recovered</span>
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: '#0A0A0A', marginBottom: 6 }}>$0</div>
        <p style={{ fontSize: 12, color: '#9B9B9B' }}>No booked leads yet. Revenue will appear here once leads are booked.</p>
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
    <div style={{ ...card, padding: 20, fontFamily: font }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <DollarSign size={14} style={{ color: '#10B981' }} />
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#10B981' }}>Revenue Recovered</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#0A0A0A' }}>${total.toLocaleString()}</div>
        </div>
        <div style={{ textAlign: 'right' }} className="hidden sm:block">
          <div style={{ fontSize: 11, color: '#9B9B9B' }}>Booked leads value</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#6B6B6B', marginTop: 2 }}>{bookedLeads.length} leads</div>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 140 }}>
        <defs>
          <linearGradient id="rev-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.33, 0.66, 1].map((t, i) => (
          <g key={i}>
            <line x1={padL} y1={padT + cH * (1-t)} x2={padL+cW} y2={padT + cH * (1-t)} stroke="#E8E8E8" strokeWidth="1" />
            <text x={padL-5} y={padT + cH * (1-t) + 4} textAnchor="end" fontSize="9" fill="#C8C8C8">
              ${((min + span * t) / 1000).toFixed(0)}k
            </text>
          </g>
        ))}
        <path d={areaPath} fill="url(#rev-area)" />
        <path d={linePath} fill="none" stroke="#10B981" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" />
            <text x={p.x} y={H-padB+13} textAnchor="middle" fontSize="9" fill="#C8C8C8">{p.month}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

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
  const colors = ['#2563EB', '#0891B2', '#F59E0B', '#10B981']

  return (
    <div style={{ ...card, padding: 20, fontFamily: font }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Calendar size={14} style={{ color: '#2563EB' }} />
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#2563EB' }}>Booking Rate</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#0A0A0A' }}>{rate}%</div>
          <div style={{ fontSize: 11, marginTop: 4, color: '#9B9B9B' }}>{booked} of {total} leads booked</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#9B9B9B', marginBottom: 4 }}>Industry avg</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#EF4444' }}>~12%</div>
        </div>
      </div>
      {total === 0 ? (
        <p style={{ fontSize: 12, color: '#9B9B9B' }}>Add leads to see your conversion funnel.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {stages.map(({ label, count, pct }, i) => (
            <div key={label}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: '#6B6B6B' }}>{label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: colors[i] }}>{pct}%</span>
                  <span style={{ fontSize: 12, width: 20, textAlign: 'right', color: '#9B9B9B' }}>{count}</span>
                </div>
              </div>
              <div style={{ height: 6, borderRadius: 99, overflow: 'hidden', background: '#F3F4F6' }}>
                <div style={{ height: '100%', borderRadius: 99, width: `${pct}%`, background: colors[i], opacity: 0.85 }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ResponseTimeChart() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const vals = [61, 44, 38, 52, 39, 41, 43]
  const max = 90, target = 60

  return (
    <div style={{ ...card, padding: 20, fontFamily: font }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Clock size={14} style={{ color: '#2563EB' }} />
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#2563EB' }}>Avg Response Time</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: '#0A0A0A' }}>43s</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#10B981' }}>↓ 12% faster</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#9B9B9B', marginBottom: 4 }}>Target</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#F59E0B' }}>&lt; 60s</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
        {days.map((day, i) => {
          const pct = (vals[i] / max) * 100
          const over = vals[i] > target
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, width: 28, flexShrink: 0, color: '#9B9B9B' }}>{day}</span>
              <div style={{ flex: 1, height: 20, borderRadius: 8, overflow: 'hidden', background: '#F3F4F6' }}>
                <div style={{ height: '100%', borderRadius: 8, width: `${pct}%`, background: over ? '#FCA5A5' : '#2563EB', opacity: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#FFFFFF' }}>{vals[i]}s</span>
                </div>
              </div>
            </div>
          )
        })}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <div style={{ width: 16, height: 0, borderTop: '1px dashed #F59E0B' }} />
          <span style={{ fontSize: 10, color: '#9B9B9B' }}>60s target threshold</span>
        </div>
      </div>
    </div>
  )
}

function EmptyReports() {
  return (
    <div style={{ textAlign: 'center', padding: '64px 24px', fontFamily: font }}>
      <div style={{ width: 64, height: 64, borderRadius: 16, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <BarChart2 size={28} style={{ color: '#2563EB' }} />
      </div>
      <h3 style={{ fontWeight: 600, fontSize: 15, color: '#0A0A0A', marginBottom: 8 }}>No data yet</h3>
      <p style={{ fontSize: 13, maxWidth: 280, margin: '0 auto', color: '#9B9B9B' }}>
        Add leads to your pipeline and reports will automatically populate here.
      </p>
    </div>
  )
}

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
    { label: 'Revenue Recovered', value: `$${totalValue.toLocaleString()}`, change: null, icon: DollarSign, color: '#10B981' },
    { label: 'Booking Rate',      value: `${bookingRate}%`,                 change: null, icon: Calendar,   color: '#2563EB' },
    { label: 'Avg Response',      value: '43s',                             change: -12,  icon: Clock,      color: '#0891B2' },
  ]

  return (
    <div style={{ padding: '16px', maxWidth: 960, margin: '0 auto', fontFamily: font }} className="md:p-6">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }} className="sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0A0A0A', margin: 0, letterSpacing: '-0.02em' }}>Reports</h1>
          <p style={{ fontSize: 12, color: '#9B9B9B', marginTop: 4 }}>Response time, booking rate, revenue recovered</p>
        </div>
        <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 10, background: '#FFFFFF', border: '1px solid #E8E8E8', alignSelf: 'flex-start' }} className="sm:self-auto">
          {RANGES.map(r => (
            <button key={r} onClick={() => setRange(r)}
              style={{ fontSize: 12, padding: '6px 12px', borderRadius: 7, fontWeight: 500, cursor: 'pointer', minHeight: 34, border: 'none', background: range === r ? '#EFF6FF' : 'transparent', color: range === r ? '#2563EB' : '#9B9B9B', fontFamily: font, transition: 'all 0.15s' }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px 0', fontSize: 13, color: '#9B9B9B' }}>Loading reports...</div>
      ) : leads.length === 0 ? (
        <EmptyReports />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 20 }} className="sm:grid-cols-3">
            {kpis.map(({ label, value, change, icon: Icon, color }) => (
              <div key={label} style={{ ...card, padding: 18, fontFamily: font }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={15} style={{ color }} />
                  </div>
                  {change !== null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '4px 8px', borderRadius: 99, background: change > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: change > 0 ? '#10B981' : '#EF4444' }}>
                      {change > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {Math.abs(change)}%
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#0A0A0A', marginBottom: 4 }}>{value}</div>
                <div style={{ fontSize: 12, color: '#9B9B9B' }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <RevenueChart leads={leads} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }} className="md:grid-cols-2">
              <ResponseTimeChart />
              <BookingFunnel leads={leads} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
