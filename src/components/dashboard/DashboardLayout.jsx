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

const SB = {
  bg: '#08090F', border: '#111220',
  text: '#3D4165', textHover: '#9296C4',
  activeText: '#818CF8', activeBg: 'rgba(129,140,248,0.08)', activeBorder: 'rgba(129,140,248,0.25)',
}

function Sidebar({ collapsed, mobile, onClose, onLogout, avatarInitials, displayName, userEmail }) {
  const width = collapsed && !mobile ? 64 : 232
  return (
    <aside style={{
      background: SB.bg,
      borderRight: `1px solid ${SB.border}`,
      width,
      transition: 'width 0.2s',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflowX: 'hidden',
    }}>
      {/* Logo row */}
      <div style={{
        height: 64, display: 'flex', alignItems: 'center',
        padding: collapsed && !mobile ? '0 17px' : '0 20px',
        borderBottom: `1px solid ${SB.border}`,
        justifyContent: collapsed && !mobile ? 'center' : 'space-between',
        gap: 10, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {collapsed && !mobile ? (
            <img src="/leadsup-icon.png.png" alt="Leads Up" style={{ height: 28, objectFit: 'contain', mixBlendMode: 'lighten' }} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src="/leadsup-icon.png.png" alt="" style={{ height: 28, objectFit: 'contain', mixBlendMode: 'lighten' }} />
              <img src="/leadsup-text.png.png" alt="Leads Up" style={{ height: 22, objectFit: 'contain', mixBlendMode: 'lighten' }} />
            </div>
          )}
        </div>
        {/* Close button on mobile only */}
        {mobile && (
          <button onClick={onClose} style={{ color: SB.text, background: 'none', border: 'none', cursor: 'pointer', padding: 8, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={onClose}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 12px', borderRadius: 12, marginBottom: 2,
              fontSize: 13, fontWeight: 500, textDecoration: 'none',
              minHeight: 44,
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

      {/* User footer */}
      <div style={{ padding: 12, borderTop: `1px solid ${SB.border}`, flexShrink: 0 }}>
        {(!collapsed || mobile) ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6366F1, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
              {avatarInitials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</div>
              <div style={{ fontSize: 11, color: SB.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</div>
            </div>
            <button onClick={onLogout} style={{ color: SB.text, cursor: 'pointer', background: 'none', border: 'none', padding: 6, minWidth: 32, minHeight: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}
              onMouseOver={e => e.currentTarget.style.color = '#F87171'}
              onMouseOut={e => e.currentTarget.style.color = SB.text}>
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button onClick={onLogout} style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '10px 0', color: SB.text, cursor: 'pointer', background: 'none', border: 'none', minHeight: 44 }}
            onMouseOver={e => e.currentTarget.style.color = '#F87171'}
            onMouseOut={e => e.currentTarget.style.color = SB.text}>
            <LogOut size={16} />
          </button>
        )}
      </div>
    </aside>
  )
}

export default function DashboardLayout() {
  const { user, logout, displayName, avatarInitials } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }
  const closeMobile = () => setMobileOpen(false)

  const sidebarProps = {
    avatarInitials,
    displayName,
    userEmail: user?.email,
    onLogout: handleLogout,
    onClose: closeMobile,
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0D1117', overflow: 'hidden' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex" style={{ height: '100%' }}>
        <Sidebar {...sidebarProps} collapsed={collapsed} mobile={false} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" style={{ display: 'flex' }}>
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)' }}
            onClick={closeMobile}
          />
          {/* Drawer */}
          <div style={{
            position: 'relative', height: '100%', width: 260,
            animation: 'slideInLeft 0.22s ease-out',
          }}>
            <Sidebar {...sidebarProps} collapsed={false} mobile={true} />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Top header */}
        <header style={{
          height: 56, borderBottom: `1px solid #1F2937`,
          background: 'rgba(13,17,23,0.9)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', padding: '0 16px',
          gap: 8, flexShrink: 0, zIndex: 40,
        }}>
          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', padding: 8, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}
          >
            <Menu size={20} />
          </button>
          {/* Desktop collapse toggle */}
          <button
            className="hidden md:flex"
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', padding: 8, minWidth: 36, minHeight: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}
          >
            <Menu size={17} />
          </button>

          <div style={{ flex: 1 }} />

          {/* Bell */}
          <button style={{ position: 'relative', color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', padding: 8, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
            <Bell size={18} />
            <span style={{ position: 'absolute', top: 8, right: 8, width: 7, height: 7, borderRadius: '50%', background: '#6366F1', border: '1.5px solid #0D1117' }} />
          </button>

          {/* User chip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6366F1, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
              {avatarInitials}
            </div>
            <span className="hidden sm:block" style={{ color: '#9CA3AF', fontSize: 13, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</span>
            <ChevronDown size={13} style={{ color: '#6B7280' }} />
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#1F2937 transparent' }}>
          <Outlet />
        </main>
      </div>

      {/* Slide-in animation */}
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0.6; }
          to   { transform: translateX(0);     opacity: 1;   }
        }
      `}</style>
    </div>
  )
}
