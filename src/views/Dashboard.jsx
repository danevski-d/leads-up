'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, Clock, Users, DollarSign, Calendar } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const cardStyle = { background: '#111827', border: '1px solid #1F2937', borderRadius: 16 }

function MetricCard({ label, value, icon: Icon, color }) {
  return (
    <div style={{ ...cardStyle, padding: 18 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div style={{ fontSize: 26, fontWeight: 900, color: 'white', letterSpacing: '-0.02em', marginBottom: 3 }}>{value}</div>
      <div style={{ fontSize: 11, color: '#6B7280' }}>{label}</div>
    </div>
  )
}

function AIStatusBanner() {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap mb-5 p-3 sm:p-4 rounded-xl"
      style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.18)' }}>
      <div className="flex items-center gap-3 min-w-0">
        <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Zap size={14} style={{ color: '#818CF8' }} />
        </div>
        <div className="min-w-0">
          <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>AI Receptionist + Lead Engine Active</div>
          <div className="hidden sm:block" style={{ fontSize: 11, color: '#4B5563', marginTop: 2 }}>Automatically responding, qualifying and booking leads 24/7</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#34D399', flexShrink: 0 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} />
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
    { key: 'booked',    label: 'Booked',    color: '#34D399' },
    { key: 'lost',      label: 'Lost',      color: '#4B5563' },
  ]
  return (
    <div style={{ ...cardStyle, padding: 18 }}>
      <div className="flex items-center justify-between mb-4">
        <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Pipeline Overview</span>
        <Link href="/app/leads" style={{ fontSize: 11, color: '#6366F1', display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}>
          View all <ArrowRight size={11} />
        </Link>
      </div>
      {/* Scrollable on mobile, grid on larger */}
      <div style={{ overflowX: 'auto', margin: '0 -2px', padding: '0 2px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(72px, 1fr))', gap: 8, minWidth: 360 }}>
          {cols.map(({ key, label, color }) => {
            const colLeads = leads.filter(l => l.status === key)
            const val = colLeads.reduce((s, l) => s + (Number(l.value) || 0), 0)
            return (
              <div key={key} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color, marginBottom: 2 }}>{colLeads.length}</div>
                <div style={{ fontSize: 9, color: '#4B5563', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
                <div style={{ height: 2, borderRadius: 2, background: `${color}20` }}>
                  <div style={{ height: '100%', borderRadius: 2, background: color, width: `${leads.length ? Math.min((colLeads.length / leads.length) * 100, 100) : 0}%` }} />
                </div>
                <div style={{ fontSize: 9, color: '#374151', marginTop: 3 }}>${(val / 1000).toFixed(1)}k</div>
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
    <div style={{ ...cardStyle, padding: 18 }}>
      <div className="flex items-center justify-between mb-4">
        <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Recent Leads</span>
        <Link href="/app/leads" style={{ fontSize: 11, color: '#6366F1', display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}>
          Pipeline <ArrowRight size={11} />
        </Link>
      </div>
      {recent.length === 0 ? (
        <div className="text-center py-8">
          <div style={{ fontSize: 13, color: '#4B5563', marginBottom: 8 }}>No leads yet.</div>
          <Link href="/app/leads" style={{ fontSize: 12, color: '#6366F1', textDecoration: 'none' }}>Add your first lead →</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {recent.map(lead => (
            <Link key={lead.id} href={`/app/leads/${lead.id}`} style={{ textDecoration: 'none' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 11, background: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', transition: 'border-color 0.15s', minHeight: 44 }}
                onMouseOver={e => e.currentTarget.style.borderColor = '#374151'}
                onMouseOut={e => e.currentTarget.style.borderColor = '#1F2937'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#818CF8', flexShrink: 0 }}>
                    {lead.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.name}</div>
                    <div style={{ fontSize: 10, color: '#4B5563' }}>{lead.source || '—'}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#34D399' }}>${Number(lead.value || 0).toLocaleString()}</div>
                  <div style={{ fontSize: 9, color: '#4B5563', textTransform: 'capitalize' }}>{lead.status}</div>
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
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-5">
        <h1 className="text-xl md:text-2xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>Dashboard</h1>
        <p className="text-xs md:text-sm mt-1" style={{ color: '#6B7280' }}>
          Welcome back{displayName ? `, ${displayName}` : ''}
        </p>
      </div>

      <AIStatusBanner />

      {loading ? (
        <div className="text-center py-16" style={{ color: '#4B5563', fontSize: 13 }}>Loading your pipeline...</div>
      ) : (
        <>
          {/* Metrics — 2 cols on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <MetricCard label="Total Leads"      value={leads.length}                           icon={Users}     color="#818CF8" />
            <MetricCard label="New This Week"     value={newThisWeek}                            icon={Clock}     color="#A78BFA" />
            <MetricCard label="Booking Rate"      value={`${bookingRate}%`}                      icon={Calendar}  color="#34D399" />
            <MetricCard label="Pipeline Value"    value={`$${(totalValue / 1000).toFixed(1)}k`} icon={DollarSign} color="#FBBF24" />
          </div>

          {/* Main content — 1 col on mobile, 2 on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <PipelineSummary leads={leads} />
            <RecentLeads leads={leads} />
          </div>
        </>
      )}
    </div>
  )
}
