import { useState } from 'react'
import { TrendingUp, TrendingDown, Clock, Calendar, DollarSign } from 'lucide-react'
import { revenueChart } from '../data/mockData'

const ranges = ['7d', '30d', '90d', 'All']

/* ── 1. Revenue Recovered — line chart ─────────────────────── */
function RevenueChart() {
  const data = revenueChart
  const max = Math.max(...data.map(d => d.value))
  const min = Math.min(...data.map(d => d.value))
  const span = max - min || 1

  const W = 700, H = 160
  const padL = 44, padR = 12, padT = 10, padB = 28
  const cW = W - padL - padR
  const cH = H - padT - padB

  const pts = data.map((d, i) => ({
    x: padL + (i / (data.length - 1)) * cW,
    y: padT + cH - ((d.value - min) / span) * cH,
    ...d,
  }))

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L ${pts.at(-1).x} ${H - padB} L ${pts[0].x} ${H - padB} Z`

  return (
    <div className="p-6 rounded-2xl" style={{ background: '#0A0B16', border: '1px solid #181928' }}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={15} style={{ color: '#6EE7B7' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6EE7B7' }}>Revenue Recovered</span>
          </div>
          <div className="text-3xl font-black text-white">$128,400</div>
          <div className="flex items-center gap-1 text-xs mt-1" style={{ color: '#6EE7B7' }}>
            <TrendingUp size={11} /> +22% vs last period
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm" style={{ color: '#3D4165' }}>This month</div>
          <div className="text-sm font-semibold" style={{ color: '#9296C4' }}>Peak: $128.4K</div>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
        <defs>
          <linearGradient id="rev-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y grid lines */}
        {[0, 0.33, 0.66, 1].map((t, i) => (
          <g key={i}>
            <line x1={padL} y1={padT + cH * (1 - t)} x2={padL + cW} y2={padT + cH * (1 - t)}
              stroke="#141526" strokeWidth="1" />
            <text x={padL - 6} y={padT + cH * (1 - t) + 4} textAnchor="end" fontSize="9" fill="#2D3050">
              ${((min + span * t) / 1000).toFixed(0)}k
            </text>
          </g>
        ))}

        <path d={areaPath} fill="url(#rev-area)" />
        <path d={linePath} fill="none" stroke="#6EE7B7" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {pts.map(p => (
          <g key={p.month}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="#0A0B16" stroke="#6EE7B7" strokeWidth="2" />
            <text x={p.x} y={H - padB + 14} textAnchor="middle" fontSize="9" fill="#2D3050">{p.month}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

/* ── 2. Avg Response Time — horizontal gauge ────────────────── */
function ResponseTimeChart() {
  // Simulated daily response time data (seconds)
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const values = [61, 44, 38, 52, 39, 41, 43]
  const target = 60
  const max = 90

  return (
    <div className="p-6 rounded-2xl" style={{ background: '#0A0B16', border: '1px solid #181928' }}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock size={15} style={{ color: '#818CF8' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#818CF8' }}>Avg Response Time</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">43s</span>
            <span className="text-sm font-bold" style={{ color: '#6EE7B7' }}>↓ 12% faster</span>
          </div>
          <div className="text-xs mt-1" style={{ color: '#3D4165' }}>vs 49s last period</div>
        </div>
        <div className="text-right">
          <div className="text-xs mb-1" style={{ color: '#3D4165' }}>Target</div>
          <div className="text-sm font-bold" style={{ color: '#FCD34D' }}>&lt; 60s</div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="space-y-2.5 mt-4">
        {days.map((day, i) => {
          const pct = (values[i] / max) * 100
          const overTarget = values[i] > target
          const barColor = overTarget ? '#FCA5A5' : '#818CF8'
          return (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs w-4 flex-shrink-0" style={{ color: '#3D4165' }}>{day}</span>
              <div className="flex-1 h-5 rounded-lg overflow-hidden" style={{ background: '#141526' }}>
                <div
                  className="h-full rounded-lg flex items-center justify-end pr-2 transition-all"
                  style={{ width: `${pct}%`, background: barColor, opacity: 0.8 }}
                >
                  <span className="text-[9px] font-bold text-white">{values[i]}s</span>
                </div>
              </div>
            </div>
          )
        })}
        {/* Target line indicator */}
        <div className="flex items-center gap-2 mt-3">
          <div className="w-4 h-px" style={{ background: '#FCD34D', borderTop: '1px dashed #FCD34D' }} />
          <span className="text-[10px]" style={{ color: '#3D4165' }}>60s target threshold</span>
        </div>
      </div>
    </div>
  )
}

/* ── 3. Booking Rate — funnel + big number ──────────────────── */
function BookingRateChart() {
  const stages = [
    { label: 'Leads Captured',  count: 284, pct: 100 },
    { label: 'AI Contacted',    count: 271, pct: 95  },
    { label: 'Responded',       count: 189, pct: 67  },
    { label: 'Qualified',       count: 142, pct: 50  },
    { label: 'Booked',          count: 97,  pct: 34  },
  ]
  const colors = ['#6D71F4', '#7C6BF8', '#8B5CF6', '#9B4EF4', '#A78BFA']

  return (
    <div className="p-6 rounded-2xl" style={{ background: '#0A0B16', border: '1px solid #181928' }}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={15} style={{ color: '#A78BFA' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#A78BFA' }}>Booking Rate</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">34.2%</span>
            <span className="text-sm font-bold" style={{ color: '#6EE7B7' }}>↑ 6.1%</span>
          </div>
          <div className="text-xs mt-1" style={{ color: '#3D4165' }}>97 of 284 leads booked this period</div>
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

      <div className="mt-5 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid #181928' }}>
        <span className="text-xs" style={{ color: '#3D4165' }}>AI handles qualification + booking</span>
        <span className="text-xs font-semibold" style={{ color: '#6EE7B7' }}>2.8× above industry</span>
      </div>
    </div>
  )
}

export default function Reports() {
  const [range, setRange] = useState('30d')

  const kpis = [
    { label: 'Revenue Recovered', value: '$128,400', change: +22, icon: DollarSign, color: '#6EE7B7' },
    { label: 'Avg Response Time',  value: '43s',      change: -12, icon: Clock,      color: '#818CF8' },
    { label: 'Booking Rate',       value: '34.2%',    change: +6,  icon: Calendar,   color: '#A78BFA' },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-sm mt-0.5" style={{ color: '#3D4165' }}>Response time, booking rate, and revenue recovered</p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#0A0B16', border: '1px solid #181928' }}>
          {ranges.map(r => (
            <button key={r} onClick={() => setRange(r)}
              className="text-xs px-3 py-2 rounded-lg font-medium transition-all"
              style={range === r
                ? { background: '#181928', color: '#ECEEFF' }
                : { color: '#3D4165' }
              }>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {kpis.map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="p-5 rounded-2xl" style={{ background: '#0A0B16', border: '1px solid #181928' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${change > 0 ? 'text-emerald-400' : 'text-red-400'}`}
                style={{ background: change > 0 ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)' }}>
                {change > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {Math.abs(change)}%
              </div>
            </div>
            <div className="text-2xl font-black text-white mb-1">{value}</div>
            <div className="text-xs" style={{ color: '#3D4165' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="space-y-5">
        <RevenueChart />
        <div className="grid md:grid-cols-2 gap-5">
          <ResponseTimeChart />
          <BookingRateChart />
        </div>
      </div>
    </div>
  )
}
