import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, ArrowRight, Zap, Clock, Users, DollarSign, Calendar, Mic } from 'lucide-react'
import { metrics, pipelineData } from '../data/mockData'

const card = { background: '#0A0B16', border: '1px solid #181928', borderRadius: 16 }

function MetricCard({ label, value, change, icon: Icon, color }) {
  const up = change > 0
  return (
    <div style={{ ...card, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={17} style={{ color }} />
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99,
          background: up ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
          color: up ? '#34D399' : '#F87171'
        }}>
          {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {up ? '+' : ''}{change}%
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, color: 'white', letterSpacing: '-0.02em', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#2D3050' }}>{label}</div>
    </div>
  )
}

function AIStatusBanner() {
  return (
    <div style={{ background: 'rgba(109,113,244,0.06)', border: '1px solid rgba(109,113,244,0.15)', borderRadius: 14, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(109,113,244,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={15} style={{ color: '#818CF8' }} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>AI Receptionist + Lead Engine Active</div>
          <div style={{ fontSize: 11, color: '#3D4165', marginTop: 2 }}>Last response: 38 seconds ago · 4 follow-ups sent today · 1 call answered after hours</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#34D399' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', animation: 'pulse 2s infinite' }} />
        Live
      </div>
    </div>
  )
}

function PipelineSummary() {
  const cols = [
    { key: 'new',       label: 'New',        color: '#818CF8' },
    { key: 'contacted', label: 'Contacted',  color: '#67E8F9' },
    { key: 'qualified', label: 'Qualified',  color: '#A78BFA' },
    { key: 'booked',    label: 'Booked',     color: '#6EE7B7' },
    { key: 'lost',      label: 'Lost',       color: '#4B4F6E' },
  ]
  return (
    <div style={{ ...card, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Pipeline Overview</span>
        <Link to="/app/leads" style={{ fontSize: 12, color: '#6D71F4', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
          View all <ArrowRight size={12} />
        </Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {cols.map(({ key, label, color }) => {
          const leads = pipelineData[key]
          const val = leads.reduce((s, l) => s + l.value, 0)
          return (
            <div key={key} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 900, color, marginBottom: 2 }}>{leads.length}</div>
              <div style={{ fontSize: 10, color: '#2D3050', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
              <div style={{ height: 2, borderRadius: 2, background: `${color}30` }}>
                <div style={{ height: '100%', borderRadius: 2, background: color, width: `${(leads.length / 5) * 100}%`, maxWidth: '100%' }} />
              </div>
              <div style={{ fontSize: 10, color: '#1E2035', marginTop: 4 }}>${(val / 1000).toFixed(1)}k</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RecentLeads() {
  const recent = [...pipelineData.new.slice(0, 2), ...pipelineData.contacted.slice(0, 1)]
  return (
    <div style={{ ...card, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Recent Leads</span>
        <Link to="/app/leads" style={{ fontSize: 12, color: '#6D71F4', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
          Pipeline <ArrowRight size={12} />
        </Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {recent.map(lead => (
          <Link key={lead.id} to={`/app/leads/${lead.id}`} style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid #141526', cursor: 'pointer', transition: 'border-color 0.15s' }}
              onMouseOver={e => e.currentTarget.style.borderColor = '#1E2035'}
              onMouseOut={e => e.currentTarget.style.borderColor = '#141526'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(109,113,244,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#818CF8' }}>
                  {lead.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{lead.name}</div>
                  <div style={{ fontSize: 11, color: '#2D3050' }}>{lead.source} · {lead.time}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#6EE7B7' }}>${lead.value.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: '#3D4165', marginTop: 2 }}>Score {lead.score}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function ActivityFeed() {
  const items = [
    { dot: '#6EE7B7', text: 'Marcus Johnson responded to AI follow-up', time: '2m ago' },
    { dot: '#818CF8', text: 'New inbound lead: Priya Mehta via Google Ads', time: '14m ago' },
    { dot: '#A78BFA', text: 'AI Receptionist answered after-hours call — lead booked', time: '31m ago' },
    { dot: '#FCD34D', text: 'AI re-engaged 3 dormant leads from March', time: '1h ago' },
    { dot: '#67E8F9', text: 'Sandra Kim qualified — Score: 95/100', time: '2h ago' },
  ]
  return (
    <div style={{ ...card, padding: 20 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 16 }}>Live Activity</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {items.map(({ dot, text, time }, i) => (
          <div key={i} style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: dot, marginTop: 5, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 12, color: '#9296C4', lineHeight: 1.4 }}>{text}</div>
              <div style={{ fontSize: 10, color: '#2D3050', marginTop: 3 }}>{time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: '#2D3050', marginTop: 4 }}>Welcome back. Here's your inbound lead pipeline.</p>
      </div>

      <AIStatusBanner />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
        <MetricCard label="New Leads (This Week)" value={metrics.newLeads.value} change={metrics.newLeads.change} icon={Users} color="#818CF8" />
        <MetricCard label="Avg. Response Time" value={metrics.responseTime.value} change={metrics.responseTime.change} icon={Clock} color="#A78BFA" />
        <MetricCard label="Booking Rate" value={metrics.conversionRate.value} change={metrics.conversionRate.change} icon={Calendar} color="#6EE7B7" />
        <MetricCard label="Revenue Recovered" value={metrics.bookedRevenue.value} change={metrics.bookedRevenue.change} icon={DollarSign} color="#FCD34D" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 12, marginBottom: 12 }}>
        <PipelineSummary />
        <ActivityFeed />
      </div>

      <RecentLeads />
    </div>
  )
}
