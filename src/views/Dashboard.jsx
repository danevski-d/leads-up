'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, Users, DollarSign, Calendar, TrendingUp } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const cardStyle = { background: '#111827', border: '1px solid #1F2937', borderRadius: 16 }

const STATUS_LABELS = {
  new:               'New',
  ai_responded:      'AI Responded',
  engaged:           'Engaged',
  qualified:         'Qualified',
  meeting_scheduled: 'Meeting Scheduled',
  won:               'Won',
  nurture:           'Nurture',
  lost:              'Lost',
}

function MetricCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div style={{ ...cardStyle, padding: 18 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div style={{ fontSize: 26, fontWeight: 900, color: 'white', letterSpacing: '-0.02em', marginBottom: 3 }}>{value}</div>
      <div style={{ fontSize: 11, color: '#6B7280' }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: '#4B5563', marginTop: 3 }}>{sub}</div>}
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
          <div className="hidden sm:block" style={{ fontSize: 11, color: '#4B5563', marginTop: 2 }}>
            Automatically responding, qualifying and booking leads 24/7
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#34D399', flexShrink: 0 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} />
        Live
      </div>
    </div>
  )
}

function IntentBreakdown({ leads }) {
  const hot  = leads.filter(l => l.intent_level === 'hot').length
  const warm = leads.filter(l => l.intent_level === 'warm').length
  const cold = leads.filter(l => l.intent_level === 'cold').length
  const total = hot + warm + cold || 1

  return (
    <div style={{ ...cardStyle, padding: 18 }}>
      <div className="flex items-center justify-between mb-4">
        <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Lead Intent</span>
        <span style={{ fontSize: 10, color: '#4B5563' }}>AI scored</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { label: '🔥 Hot',  count: hot,  color: '#EF4444' },
          { label: '🟡 Warm', count: warm, color: '#F59E0B' },
          { label: '🔵 Cold', count: cold, color: '#60A5FA' },
        ].map(({ label, count, color }) => (
          <div key={label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>{label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color }}>{count}</span>
            </div>
            <div style={{ height: 4, borderRadius: 4, background: '#1F2937' }}>
              <div style={{ height: '100%', borderRadius: 4, background: color, width: `${(count / total) * 100}%`, transition: 'width 0.5s ease' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PipelineSummary({ leads }) {
  const cols = [
    { key: 'new',               label: 'New',      color: '#818CF8' },
    { key: 'ai_responded',      label: 'AI Reply', color: '#67E8F9' },
    { key: 'engaged',           label: 'Engaged',  color: '#F59E0B' },
    { key: 'qualified',         label: 'Qualified',color: '#A78BFA' },
    { key: 'meeting_scheduled', label: 'Meeting',  color: '#34D399' },
    { key: 'won',               label: 'Won',      color: '#FBBF24' },
    { key: 'lost',              label: 'Lost',     color: '#4B5563' },
  ]

  return (
    <div style={{ ...cardStyle, padding: 18 }}>
      <div className="flex items-center justify-between mb-4">
        <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Pipeline Overview</span>
        <Link href="/app/leads" style={{ fontSize: 11, color: '#6366F1', display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}>
          View all <ArrowRight size={11} />
        </Link>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols.length}, minmax(56px, 1fr))`, gap: 6, minWidth: 400 }}>
          {cols.map(({ key, label, color }) => {
            const colLeads = leads.filter(l => (l.status || '') === key)
            const val = colLeads.reduce((s, l) => s + (Number(l.value) || 0), 0)
            return (
              <div key={key} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color, marginBottom: 2 }}>{colLeads.length}</div>
                <div style={{ fontSize: 8, color: '#4B5563', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.07em', lineHeight: 1.3 }}>{label}</div>
                <div style={{ height: 3, borderRadius: 3, background: `${color}20` }}>
                  <div style={{ height: '100%', borderRadius: 3, background: color, width: `${leads.length ? Math.min((colLeads.length / leads.length) * 100, 100) : 0}%`, transition: 'width 0.5s ease' }} />
                </div>
                <div style={{ fontSize: 8, color: '#374151', marginTop: 3 }}>${(val / 1000).toFixed(1)}k</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function RecentLeads({ leads }) {
  const recent = leads.slice(0, 5)
  const getStatusLabel = (s) => STATUS_LABELS[s] || s || '—'
  const getStatusColor = (s) => ({ new: '#818CF8', ai_responded: '#67E8F9', engaged: '#F59E0B', qualified: '#A78BFA', meeting_scheduled: '#34D399', won: '#FBBF24', nurture: '#60A5FA', lost: '#6B7280' }[s] || '#6B7280')

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
          {recent.map(lead => {
            const score = lead.lead_score || lead.bant_score || 0
            const scoreColor = score >= 70 ? '#EF4444' : score >= 40 ? '#F59E0B' : '#60A5FA'
            return (
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
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#34D399' }}>
                      {lead.value ? `$${Number(lead.value).toLocaleString()}` : lead.budget_range || '—'}
                    </div>
                    <div style={{ fontSize: 9, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                      <span style={{ color: getStatusColor(lead.status) }}>{getStatusLabel(lead.status)}</span>
                      {score > 0 && <span style={{ color: scoreColor, fontWeight: 700 }}>{score}</span>}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { user, workspaceId, displayName } = useAuth()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !workspaceId) return
    fetchLeads()

    const channel = supabase
      .channel('dashboard-leads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, fetchLeads)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [user, workspaceId])

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })
    if (error) console.error('Dashboard:', error.message)
    setLeads(data || [])
    setLoading(false)
  }

  const totalValue    = leads.reduce((s, l) => s + (Number(l.value) || 0), 0)
  const wonLeads      = leads.filter(l => l.status === 'won')
  const meetingLeads  = leads.filter(l => l.status === 'meeting_scheduled')
  const meetingRate   = leads.length > 0 ? Math.round((meetingLeads.length / leads.length) * 100) : 0
  const newThisWeek   = leads.filter(l => (Date.now() - new Date(l.created_at)) < 7 * 86400000).length
  const avgScore      = leads.length > 0 ? Math.round(leads.reduce((s, l) => s + (l.lead_score || l.bant_score || 0), 0) / leads.length) : 0
  const hotLeads      = leads.filter(l => l.intent_level === 'hot').length

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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <MetricCard label="Total Leads" value={leads.length} icon={Users} color="#818CF8" sub={`${newThisWeek} new this week`} />
            <MetricCard label="Hot Leads" value={hotLeads} icon={Zap} color="#EF4444" sub="🔥 High intent" />
            <MetricCard label="Meeting Rate" value={`${meetingRate}%`} icon={Calendar} color="#34D399" sub={`${meetingLeads.length} scheduled`} />
            <MetricCard label="Pipeline Value" value={`$${(totalValue / 1000).toFixed(1)}k`} icon={DollarSign} color="#FBBF24" sub={`Avg score: ${avgScore}/100`} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
            <PipelineSummary leads={leads} />
            <RecentLeads leads={leads} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <IntentBreakdown leads={leads} />

            <div style={{ ...cardStyle, padding: 18 }}>
              <div className="flex items-center justify-between mb-4">
                <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Won This Month</span>
                <TrendingUp size={14} style={{ color: '#FBBF24' }} />
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#FBBF24', letterSpacing: '-1px', marginBottom: 4 }}>{wonLeads.length}</div>
              <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 12 }}>clients converted</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#34D399' }}>
                ${wonLeads.reduce((s, l) => s + (Number(l.value) || 0), 0).toLocaleString()}
              </div>
              <div style={{ fontSize: 10, color: '#4B5563' }}>total revenue</div>
            </div>

            <div style={{ ...cardStyle, padding: 18 }}>
              <div className="flex items-center justify-between mb-4">
                <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Avg Lead Score</span>
                <span style={{ fontSize: 10, color: '#4B5563' }}>AI qualified</span>
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px', marginBottom: 4, color: avgScore >= 70 ? '#EF4444' : avgScore >= 40 ? '#F59E0B' : '#60A5FA' }}>
                {avgScore}<span style={{ fontSize: 16, fontWeight: 500, color: '#4B5563' }}>/100</span>
              </div>
              <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 14 }}>
                {avgScore >= 70 ? '🔥 Strong pipeline' : avgScore >= 40 ? '🟡 Mixed quality' : '🔵 Needs nurturing'}
              </div>
              <div style={{ height: 6, borderRadius: 6, background: '#1F2937' }}>
                <div style={{ height: '100%', borderRadius: 6, width: `${avgScore}%`, background: avgScore >= 70 ? '#EF4444' : avgScore >= 40 ? '#F59E0B' : '#60A5FA', transition: 'width 0.5s ease' }} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}