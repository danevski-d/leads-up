import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Zap, LayoutDashboard, Users, BarChart2, Settings, LogOut, Menu, X, Bell, ChevronDown } from 'lucide-react'

const nav = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/leads',     icon: Users,            label: 'Pipeline' },
  { to: '/app/reports',   icon: BarChart2,         label: 'Reports' },
  { to: '/app/settings',  icon: Settings,          label: 'Settings' },
]

const SB = { bg: '#08090F', border: '#111220', text: '#3D4165', textHover: '#9296C4', activeText: '#818CF8', activeBg: 'rgba(129,140,248,0.08)', activeBorder: 'rgba(129,140,248,0.25)' }

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const Sidebar = ({ mobile = false }) => (
    <aside style={{ background: SB.bg, borderRight: `1px solid ${SB.border}`, width: collapsed && !mobile ? 64 : 232, transition: 'width 0.2s', flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: collapsed && !mobile ? '0 16px' : '0 20px', borderBottom: `1px solid ${SB.border}`, justifyContent: collapsed && !mobile ? 'center' : 'flex-start', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #6D71F4 0%, #8B5CF6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Zap size={14} color="white" />
        </div>
        {(!collapsed || mobile) && <span style={{ color: 'white', fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>Leads Up</span>}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 12, marginBottom: 2,
              fontSize: 13, fontWeight: 500, textDecoration: 'none',
              justifyContent: collapsed && !mobile ? 'center' : 'flex-start',
              background: isActive ? SB.activeBg : 'transparent',
              border: `1px solid ${isActive ? SB.activeBorder : 'transparent'}`,
              color: isActive ? SB.activeText : SB.text,
              transition: 'all 0.15s',
            })}
            onMouseOver={e => { if (!e.currentTarget.style.background.includes('rgba(129')) e.currentTarget.style.color = SB.textHover }}
            onMouseOut={e => { if (!e.currentTarget.style.background.includes('rgba(129')) e.currentTarget.style.color = SB.text }}
          >
            <Icon size={16} style={{ flexShrink: 0 }} />
            {(!collapsed || mobile) && label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: 12, borderTop: `1px solid ${SB.border}` }}>
        {(!collapsed || mobile) ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #6D71F4, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
              {user?.avatar}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: SB.text }}>{user?.role}</div>
            </div>
            <button onClick={handleLogout} style={{ color: SB.text, cursor: 'pointer', background: 'none', border: 'none', padding: 4 }}
              onMouseOver={e => e.currentTarget.style.color = '#F87171'}
              onMouseOut={e => e.currentTarget.style.color = SB.text}>
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '8px 0', color: SB.text, cursor: 'pointer', background: 'none', border: 'none' }}
            onMouseOver={e => e.currentTarget.style.color = '#F87171'}
            onMouseOut={e => e.currentTarget.style.color = SB.text}>
            <LogOut size={16} />
          </button>
        )}
      </div>
    </aside>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#06060F', overflow: 'hidden' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex" style={{ height: '100%' }}>
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 232 }}>
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Header */}
        <header style={{ height: 64, borderBottom: `1px solid #111220`, background: 'rgba(8,9,15,0.8)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, flexShrink: 0 }}>
          <button className="md:hidden" style={{ color: '#3D4165', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
          <button className="hidden md:block" style={{ color: '#3D4165', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <Menu size={17} /> : <X size={17} />}
          </button>
          <div style={{ flex: 1 }} />
          <button style={{ position: 'relative', color: '#3D4165', background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
            <Bell size={17} />
            <span style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: '50%', background: '#6D71F4' }} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#3D4165', cursor: 'pointer', fontSize: 13 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #6D71F4, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700 }}>
              {user?.avatar}
            </div>
            <span className="hidden sm:block" style={{ color: '#9296C4', fontSize: 13 }}>{user?.name}</span>
            <ChevronDown size={13} />
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#1E2035 transparent' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
