import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Clock, Calendar, DollarSign } from 'lucide-react'
import { supabase } from '../lib/supabase'

const ranges = ['7d', '30d', '90d', 'All']

function RevenueChart({ leads }) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  
  // Group booked leads by month
  const monthlyData = months.map((month, i) => {
    const total = leads
      .filter(l => l.status === 'booked' && new Date(l.created_at).getMonth() === i)
      .reduce((s, l) => s + (Number(l.value) || 0), 0)
    return { month, value: total }
  }).filter(d => d.value > 0)

  if (monthlyData.length === 0) {
    return (
      <div className="p-6 rounded-2xl" style={{ background: '#0A0B16', border: '1px solid #181928' }}>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={15} style={{ color: '#6EE7B7' }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6EE7B7' }}>Revenue Recovered</span>
        </div>
        <div className="text-3xl font-black text-white mb-2">$0</div>
        <div className="text-sm" style={{ color: '#3D4165' }}>No booked leads yet</div>
      </div>
    )
  }

  const max = Math.max(...monthlyData.map(d => d.value))
  const min = Math.min(...monthlyData.map(d => d.value))
  const span = max - min || 1
  const W = 700, H = 160
  const padL = 44, padR = 12, padT = 10, padB = 28
  const cW = W - padL - padR
  const cH = H - padT - padB
  const pts = monthlyData.map((d, i) => ({
    x: padL + (i / Math.max(monthlyData.length - 1, 1)) * cW,
    y: padT + cH - ((d.value - min) / span) * cH,
    ...d,
  }))
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L ${pts.at(-1).x} ${H - padB} L ${pts[0].x} ${H - padB} Z`
  const total = leads.filter(l => l.status === 'booked').reduce((s, l) => s + (Number(l.value) || 0), 0)

  return (
    <div className="p-6 rounded-2xl" style={{ background: '#0A0B16', border: '1px solid #181928' }}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={15} style={{ color: '#6EE7B7' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6EE7B7' }}>Revenue Recovered</span>
          </div>
          <div className="text-3xl font-black text-white">${total.toLocaleString()}</div>
        </div>
        <div className="text-right">
          <div className="text-sm" style={{ color: '#3D4165' }}>Booked leads value</div>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
        <defs>
          <linearGradient id="rev-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.33, 0.66, 1].map((t, i) => (
          <g key={i}>
            <line x1={padL} y1={padT + cH * (1 - t)} x2={padL + cW} y2={padT + cH * (1 - t)} stroke="#141526" strokeWidth="1" />
            <text x={padL - 6} y={padT + cH * (1 - t) + 4} textAnchor="end" fontSize="9" fill="#2D3050">
              ${((min + span * t) / 1000).toFixed(0)}k
            </text>
          </g>
        ))}
        <path d={areaPath} fill="url(#rev-area)" />
        <path d={linePath} fill="none" stroke="#6EE7B7" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="#0A0B16" stroke="#6EE7B7" strokeWidth="2" />
            <text x={p.x} y={H - padB + 14} textAnchor="middle" fontSize="9" fill="#2D3050">{p.month}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function BookingRateChart({ leads }) {
  const total = leads.length
  const booked = leads.filter(l => l.status === 'booked').length
  const qualified = leads.filter(l => l.status === 'qualified').length
  const contacted = leads.filter(l => l.status === 'contacted').length
  const bookingRate = total > 0 ? ((booked / total) * 100).toFixed(1) : 0

  const stages = [
    { label: 'Leads Captured', count: total, pct: 100 },
    { label: 'Contacted', count: contacted + qualified + booked, pct: total > 0 ? Math.round(((contacted + qualified + booked) / total) * 100) : 0 },
    { label: 'Qualified', count: qualified + booked, pct: total > 0 ? Math.round(((qualified + booked) / total) * 100) : 0 },
    { label: 'Booked', count: booked, pct: total > 0 ? Math.round((booked / total) * 100) : 0 },
  ]
  const colors = ['#6D71F4', '#8B5CF6', '#9B4EF4', '#A78BFA']

  return (
    <div className="p-6 rounded-2xl" style={{ background: '#0A0B16', border: '1px solid #181928' }}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={15} style={{ color: '#A78BFA' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#A78BFA' }}>Booking Rate</span>
          </div>
          <div className="text-3xl font-black text-white">{bookingRate}%</div>
          <div className="text-xs mt-1" style={{ color: '#3D4165' }}>{booked} of {total} leads booked</div>
        </div>
        <div className="text-right">
          <div className="text-xs mb-1" style={{ color: '#3D4165' }}>Industry avg</div>
          <div className="text-sm font-bold" style={{ color: '#FCA5A5' }}>~12%</div>
        </div>
      </div>
      <div className="space-y-2">
        {stages.map(({ label, count, pct }, i) => (
          <div key={label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs" style={{ color: '#4B4F6E' }}>{label}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold" style={{ color: colors[i] }}>{pct}%</span>
                <span className="text-xs w-6 text-right" style={{ color: '#2D3050' }}>{count}</span>
              </div>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#141526' }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: colors[i], opacity: 0.85 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Reports() {
  const [range, setRange] = useState('30d')
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeads = async () => {
      let query = supabase.from('leads').select('*')

      if (range !== 'All') {
        const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
        const from = new Date()
        from.setDate(from.getDate() - days)
        query = query.gte('created_at', from.toISOString())
      }

      const { data } = await query
      setLeads(data || [])
      setLoading(false)
    }
    fetchLeads()
  }, [range])

  const totalValue = leads.filter(l => l.status === 'booked').reduce((s, l) => s + (Number(l.value) || 0), 0)
  const bookingRate = leads.length > 0 ? ((leads.filter(l => l.status === 'booked').length / leads.length) * 100).toFixed(1) : 0

  const kpis = [
    { label: 'Revenue Recovered', value: `$${totalValue.toLocaleString()}`, icon: DollarSign, color: '#6EE7B7' },
    { label: 'Total Leads', value: leads.length, icon: Clock, color: '#818CF8' },
    { label: 'Booking Rate', value: `${bookingRate}%`, icon: Calendar, color: '#A78BFA' },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-sm mt-0.5" style={{ color: '#3D4165' }}>Real data from your Supabase leads</p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#0A0B16', border: '1px solid #181928' }}>
          {ranges.map(r => (
            <button key={r} onClick={() => setRange(r)}
              className="text-xs px-3 py-2 rounded-lg font-medium transition-all"
              style={range === r ? { background: '#181928', color: '#ECEEFF' } : { color: '#3D4165' }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ color: '#2D3050', textAlign: 'center', padding: 40 }}>Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {kpis.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="p-5 rounded-2xl" style={{ background: '#0A0B16', border: '1px solid #181928' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}15` }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div className="text-2xl font-black text-white mb-1">{value}</div>
                <div className="text-xs" style={{ color: '#3D4165' }}>{label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-5">
            <RevenueChart leads={leads} />
            <BookingRateChart leads={leads} />
          </div>
        </>
      )}
    </div>
  )
}