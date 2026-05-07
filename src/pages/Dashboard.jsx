import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Clock, Users, DollarSign, Calendar, TrendingUp, TrendingDown } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const card = { background: '#0A0B16', border: '1px solid #181928', borderRadius: 16 }

function MetricCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div style={{ ...card, padding: 20 }}>
      <div style={{ width: 38, height: 38, borderRadius: 12, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Icon size={17} style={{ color }} />
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, color: 'white', letterSpacing: '-0.02em', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#2D3050' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#34D399', marginTop: 4 }}>{sub}</div>}
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
          <div style={{ fontSize: 11, color: '#3D4165', marginTop: 2 }}>Automatically responding, qualifying and booking leads 24/7</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#34D399' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', animation: 'pulse 2s infinite' }} />
        Live
      </div>
    </div>
  )
}

function PipelineSummary({ leads }) {
  const cols = [
    { key: 'new',       label: 'New',       color: '#818CF8' },
    { key: 'contacted', label: 'Contacted', color: '#67E8F9' },
    { key: 'qualified', label: 'Qualified', color: '#A78BFA' },
    { key: 'booked',    label: 'Booked',    color: '#6EE7B7' },
    { key: 'lost',      label: 'Lost',      color: '#4B4F6E' },
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
          const colLeads = leads.filter(l => l.status === key)
          const val = colLeads.reduce((s, l) => s + (Number(l.value) || 0), 0)
          return (
            <div key={key} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 900, color, marginBottom: 2 }}>{colLeads.length}</div>
              <div style={{ fontSize: 10, color: '#2D3050', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
              <div style={{ height: 2, borderRadius: 2, background: `${color}25` }}>
                <div style={{ height: '100%', borderRadius: 2, background: color, width: `${leads.length ? Math.min((colLeads.length / leads.length) * 100, 100) : 0}%` }} />
              </div>
              <div style={{ fontSize: 10, color: '#1E2035', marginTop: 4 }}>${(val / 1000).toFixed(1)}k</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RecentLeads({ leads }) {
  const recent = leads.slice(0, 3)
  return (
    <div style={{ ...card, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Recent Leads</span>
        <Link to="/app/leads" style={{ fontSize: 12, color: '#6D71F4', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
          Pipeline <ArrowRight size={12} />
        </Link>
      </div>
      {recent.length === 0 ? (
        <div style={{ fontSize: 13, color: '#2D3050', textAlign: 'center', padding: '20px 0' }}>No leads yet — add your first one in Pipeline.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {recent.map(lead => (
            <Link key={lead.id} to={`/app/leads/${lead.id}`} style={{ textDecoration: 'none' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid #141526', cursor: 'pointer', transition: 'border-color 0.15s' }}
                onMouseOver={e => e.currentTarget.style.borderColor = '#1E2035'}
                onMouseOut={e => e.currentTarget.style.borderColor = '#141526'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(109,113,244,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#818CF8' }}>
                    {lead.name?.split(' ').map(n => n[0]).join('') || '?'}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{lead.name}</div>
                    <div style={{ fontSize: 11, color: '#2D3050' }}>
                      {lead.source || 'Unknown'} · {new Date(lead.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#6EE7B7' }}>
                    ${Number(lead.value || 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 10, color: '#3D4165', marginTop: 2, textTransform: 'capitalize' }}>{lead.status}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { user, displayName } = useAuth()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetchLeads = async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) console.error('Dashboard fetch error:', error.message)
      setLeads(data || [])
      setLoading(false)
    }
    fetchLeads()
  }, [user])

  const totalValue   = leads.reduce((s, l) => s + (Number(l.value) || 0), 0)
  const booked       = leads.filter(l => l.status === 'booked')
  const bookingRate  = leads.length > 0 ? Math.round((booked.length / leads.length) * 100) : 0
  const newThisWeek  = leads.filter(l => {
    const d = new Date(l.created_at)
    const now = new Date()
    return (now - d) < 7 * 24 * 60 * 60 * 1000
  }).length

  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 13, color: '#2D3050', marginTop: 4 }}>
          Welcome back{displayName ? `, ${displayName}` : ''}. Here's your inbound lead pipeline.
        </p>
      </div>

      <AIStatusBanner />

      {loading ? (
        <div style={{ color: '#2D3050', textAlign: 'center', padding: 60, fontSize: 13 }}>Loading your pipeline...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
            <MetricCard label="Total Leads"         value={leads.length}             icon={Users}     color="#818CF8" />
            <MetricCard label="New This Week"        value={newThisWeek}              icon={Clock}     color="#A78BFA" />
            <MetricCard label="Booking Rate"         value={`${bookingRate}%`}        icon={Calendar}  color="#6EE7B7" />
            <MetricCard label="Total Pipeline Value" value={`$${(totalValue/1000).toFixed(1)}k`} icon={DollarSign} color="#FCD34D" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <PipelineSummary leads={leads} />
            <RecentLeads leads={leads} />
          </div>
        </>
      )}
    </div>
  )
}
