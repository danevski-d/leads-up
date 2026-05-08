import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Users, BarChart2, Settings, LogOut, Menu, X, Bell, ChevronDown } from 'lucide-react'

const NAV = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/leads',     icon: Users,            label: 'Pipeline' },
  { to: '/app/reports',   icon: BarChart2,         label: 'Reports' },
  { to: '/app/settings',  icon: Settings,          label: 'Settings' },
]

const font = "system-ui,-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif"

function Sidebar({ collapsed, mobile, onClose, onLogout, avatarInitials, displayName, userEmail }) {
  const width = collapsed && !mobile ? 64 : 240
  return (
    <aside style={{
      background: '#FFFFFF',
      borderRight: '1px solid #E8E8E8',
      width, flexShrink: 0,
      display: 'flex', flexDirection: 'column',
      height: '100%', overflowX: 'hidden',
      transition: 'width 0.2s',
      fontFamily: font,
    }}>
      {/* Logo row */}
      <div style={{
        height: 56, display: 'flex', alignItems: 'center',
        padding: collapsed && !mobile ? '0 16px' : '0 20px',
        borderBottom: '1px solid #E8E8E8',
        justifyContent: collapsed && !mobile ? 'center' : 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          {collapsed && !mobile ? (
            <img src="/leadsup-icon.png" alt="Leads Up" style={{ height: 28, objectFit: 'contain', mixBlendMode: 'multiply', flexShrink: 0 }} />
          ) : (
            <>
              <img src="/leadsup-icon.png" alt="" style={{ height: 28, objectFit: 'contain', mixBlendMode: 'multiply', flexShrink: 0 }} />
              <img src="/leadsup-text.png" alt="Leads Up" style={{ height: 22, objectFit: 'contain', mixBlendMode: 'multiply' }} />
            </>
          )}
        </div>
        {mobile && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9B9B9B', padding: 8, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={onClose}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8, marginBottom: 2,
              fontSize: 14, fontWeight: isActive ? 500 : 400,
              textDecoration: 'none', fontFamily: font,
              minHeight: 44,
              justifyContent: collapsed && !mobile ? 'center' : 'flex-start',
              background: isActive ? '#EFF6FF' : 'transparent',
              color: isActive ? '#2563EB' : '#6B6B6B',
              transition: 'all 0.15s',
            })}
            onMouseOver={e => { if (!e.currentTarget.style.background.includes('#EFF6FF')) e.currentTarget.style.background = '#F5F5F5' }}
            onMouseOut={e => { if (!e.currentTarget.style.background.includes('#EFF6FF')) e.currentTarget.style.background = 'transparent' }}
          >
            <Icon size={17} style={{ flexShrink: 0 }} />
            {(!collapsed || mobile) && label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid #E8E8E8', flexShrink: 0 }}>
        {(!collapsed || mobile) ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, fontFamily: font }}>
              {avatarInitials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: font }}>{displayName}</div>
              <div style={{ fontSize: 11, color: '#9B9B9B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: font }}>{userEmail}</div>
            </div>
            <button onClick={onLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9B9B9B', padding: 6, minWidth: 32, minHeight: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}
              onMouseOver={e => e.currentTarget.style.color = '#EF4444'}
              onMouseOut={e => e.currentTarget.style.color = '#9B9B9B'}>
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button onClick={onLogout} style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer', color: '#9B9B9B', minHeight: 44 }}
            onMouseOver={e => e.currentTarget.style.color = '#EF4444'}
            onMouseOut={e => e.currentTarget.style.color = '#9B9B9B'}>
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

  const sidebarProps = {
    avatarInitials, displayName,
    userEmail: user?.email,
    onLogout: handleLogout,
    onClose: () => setMobileOpen(false),
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#FAFAFA', overflow: 'hidden', fontFamily: font }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex" style={{ height: '100%' }}>
        <Sidebar {...sidebarProps} collapsed={collapsed} mobile={false} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" style={{ display: 'flex' }}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} onClick={() => setMobileOpen(false)} />
          <div style={{ position: 'relative', height: '100%', width: 240, animation: 'slideInLeft 0.2s ease-out' }}>
            <Sidebar {...sidebarProps} collapsed={false} mobile={true} />
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Header */}
        <header style={{
          height: 56, borderBottom: '1px solid #E8E8E8',
          background: '#FFFFFF',
          display: 'flex', alignItems: 'center', padding: '0 20px',
          gap: 8, flexShrink: 0,
        }}>
          <button className="md:hidden" onClick={() => setMobileOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9B9B9B', padding: 8, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
            <Menu size={20} />
          </button>
          <button className="hidden md:flex" onClick={() => setCollapsed(!collapsed)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9B9B9B', padding: 8, minWidth: 36, minHeight: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
            <Menu size={17} />
          </button>

          <div style={{ flex: 1 }} />

          <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#9B9B9B', padding: 8, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
            <Bell size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, fontFamily: font }}>
              {avatarInitials}
            </div>
            <span className="hidden sm:block" style={{ color: '#6B6B6B', fontSize: 13, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: font }}>{displayName}</span>
            <ChevronDown size={13} color="#9B9B9B" />
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto' }} className="scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
