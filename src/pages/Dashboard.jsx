import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Clock, Users, DollarSign, Calendar } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const font = "system-ui,-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif"
const card = { background: '#FFFFFF', border: '1px solid #E8E8E8', borderRadius: 14 }

const STATUS_COLORS = {
  new:       '#2563EB',
  contacted: '#0891B2',
  qualified: '#F59E0B',
  booked:    '#10B981',
  lost:      '#9B9B9B',
}

function MetricCard({ label, value, icon: Icon, color }) {
  return (
    <div style={{ ...card, padding: 18, fontFamily: font }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div style={{ fontSize: 26, fontWeight: 900, color: '#0A0A0A', letterSpacing: '-0.02em', marginBottom: 3 }}>{value}</div>
      <div style={{ fontSize: 11, color: '#9B9B9B' }}>{label}</div>
    </div>
  )
}

function AIStatusBanner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 20, padding: '12px 16px', borderRadius: 12, background: '#EFF6FF', border: '1px solid #BFDBFE', fontFamily: font }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Zap size={14} style={{ color: '#2563EB' }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A' }}>AI Receptionist + Lead Engine Active</div>
          <div style={{ fontSize: 11, color: '#6B6B6B', marginTop: 2 }}>Automatically responding, qualifying and booking leads 24/7</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#10B981', flexShrink: 0 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
        Live
      </div>
    </div>
  )
}

function PipelineSummary({ leads }) {
  const cols = [
    { key: 'new',       label: 'New',       color: STATUS_COLORS.new },
    { key: 'contacted', label: 'Contacted', color: STATUS_COLORS.contacted },
    { key: 'qualified', label: 'Qualified', color: STATUS_COLORS.qualified },
    { key: 'booked',    label: 'Booked',    color: STATUS_COLORS.booked },
    { key: 'lost',      label: 'Lost',      color: STATUS_COLORS.lost },
  ]
  return (
    <div style={{ ...card, padding: 18, fontFamily: font }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0A0A0A' }}>Pipeline Overview</span>
        <Link to="/app/leads" style={{ fontSize: 11, color: '#2563EB', display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}>
          View all <ArrowRight size={11} />
        </Link>
      </div>
      <div style={{ overflowX: 'auto', margin: '0 -2px', padding: '0 2px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(72px, 1fr))', gap: 8, minWidth: 360 }}>
          {cols.map(({ key, label, color }) => {
            const colLeads = leads.filter(l => l.status === key)
            const val = colLeads.reduce((s, l) => s + (Number(l.value) || 0), 0)
            return (
              <div key={key} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color, marginBottom: 2 }}>{colLeads.length}</div>
                <div style={{ fontSize: 9, color: '#9B9B9B', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
                <div style={{ height: 2, borderRadius: 2, background: `${color}20` }}>
                  <div style={{ height: '100%', borderRadius: 2, background: color, width: `${leads.length ? Math.min((colLeads.length / leads.length) * 100, 100) : 0}%` }} />
                </div>
                <div style={{ fontSize: 9, color: '#C8C8C8', marginTop: 3 }}>${(val / 1000).toFixed(1)}k</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function RecentLeads({ leads }) {
  const recent = leads.slice(0, 4)
  return (
    <div style={{ ...card, padding: 18, fontFamily: font }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0A0A0A' }}>Recent Leads</span>
        <Link to="/app/leads" style={{ fontSize: 11, color: '#2563EB', display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}>
          Pipeline <ArrowRight size={11} />
        </Link>
      </div>
      {recent.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{ fontSize: 13, color: '#9B9B9B', marginBottom: 8 }}>No leads yet.</div>
          <Link to="/app/leads" style={{ fontSize: 12, color: '#2563EB', textDecoration: 'none' }}>Add your first lead →</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {recent.map(lead => (
            <Link key={lead.id} to={`/app/leads/${lead.id}`} style={{ textDecoration: 'none' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 10, background: '#FAFAFA', border: '1px solid #E8E8E8', transition: 'border-color 0.15s', minHeight: 44 }}
                onMouseOver={e => e.currentTarget.style.borderColor = '#D1D5DB'}
                onMouseOut={e => e.currentTarget.style.borderColor = '#E8E8E8'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#2563EB', flexShrink: 0 }}>
                    {lead.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#0A0A0A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.name}</div>
                    <div style={{ fontSize: 10, color: '#9B9B9B' }}>{lead.source || '—'}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#10B981' }}>${Number(lead.value || 0).toLocaleString()}</div>
                  <div style={{ fontSize: 9, color: '#9B9B9B', textTransform: 'capitalize' }}>{lead.status}</div>
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
    supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('Dashboard:', error.message)
        setLeads(data || [])
        setLoading(false)
      })
  }, [user])

  const totalValue  = leads.reduce((s, l) => s + (Number(l.value) || 0), 0)
  const booked      = leads.filter(l => l.status === 'booked')
  const bookingRate = leads.length > 0 ? Math.round((booked.length / leads.length) * 100) : 0
  const newThisWeek = leads.filter(l => (Date.now() - new Date(l.created_at)) < 7 * 86400000).length

  return (
    <div style={{ padding: '16px', maxWidth: 1152, margin: '0 auto', fontFamily: font }} className="md:p-6">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em', margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: '#9B9B9B', marginTop: 4 }}>
          Welcome back{displayName ? `, ${displayName}` : ''}
        </p>
      </div>

      <AIStatusBanner />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: '#9B9B9B', fontSize: 13 }}>Loading your pipeline...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <MetricCard label="Total Leads"   value={leads.length}                           icon={Users}      color="#2563EB" />
            <MetricCard label="New This Week"  value={newThisWeek}                            icon={Clock}      color="#0891B2" />
            <MetricCard label="Booking Rate"   value={`${bookingRate}%`}                      icon={Calendar}   color="#10B981" />
            <MetricCard label="Pipeline Value" value={`$${(totalValue / 1000).toFixed(1)}k`} icon={DollarSign} color="#F59E0B" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <PipelineSummary leads={leads} />
            <RecentLeads leads={leads} />
          </div>
        </>
      )}
    </div>
  )
}
