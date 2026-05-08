import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'

const font = "system-ui,-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif"

export default function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) navigate('/app/dashboard', { replace: true })
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA', fontFamily: font }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '0 24px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9B9B9B', textDecoration: 'none', marginBottom: 32, transition: 'color 0.15s' }}
          onMouseOver={e => e.currentTarget.style.color = '#0A0A0A'}
          onMouseOut={e => e.currentTarget.style.color = '#9B9B9B'}>
          <ArrowLeft size={14} />
          Back to home
        </Link>

        <div style={{ background: '#FFFFFF', border: '1px solid #E8E8E8', borderRadius: 16, padding: 32 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
            <img src="/leadsup-icon.png" alt="" style={{ height: 28, objectFit: 'contain', mixBlendMode: 'multiply', flexShrink: 0 }} />
            <img src="/leadsup-text.png" alt="Leads Up" style={{ height: 22, objectFit: 'contain', mixBlendMode: 'multiply' }} />
          </div>

          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0A0A0A', marginBottom: 4, fontFamily: font }}>Welcome back</h1>
          <p style={{ fontSize: 13, color: '#9B9B9B', marginBottom: 24, fontFamily: font }}>Sign in to your dashboard</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#6B6B6B', display: 'block', marginBottom: 6, fontFamily: font }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#0A0A0A', background: '#FFFFFF', border: '1px solid #E8E8E8', outline: 'none', boxSizing: 'border-box', fontFamily: font, transition: 'border-color 0.15s' }}
                onFocus={e => e.target.style.borderColor = '#2563EB'}
                onBlur={e => e.target.style.borderColor = '#E8E8E8'}
                placeholder="you@company.com"
                required
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#6B6B6B', display: 'block', marginBottom: 6, fontFamily: font }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ width: '100%', borderRadius: 10, padding: '10px 44px 10px 14px', fontSize: 14, color: '#0A0A0A', background: '#FFFFFF', border: '1px solid #E8E8E8', outline: 'none', boxSizing: 'border-box', fontFamily: font, transition: 'border-color 0.15s' }}
                  onFocus={e => e.target.style.borderColor = '#2563EB'}
                  onBlur={e => e.target.style.borderColor = '#E8E8E8'}
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9B9B9B', padding: 4 }}
                  onMouseOver={e => e.currentTarget.style.color = '#6B6B6B'}
                  onMouseOut={e => e.currentTarget.style.color = '#9B9B9B'}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ fontSize: 13, borderRadius: 10, padding: '10px 14px', color: '#EF4444', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', fontFamily: font }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: '#6B6B6B', fontFamily: font }}>
                <input type="checkbox" style={{ borderRadius: 4 }} />
                Remember me
              </label>
              <a href="#" style={{ color: '#2563EB', textDecoration: 'none', fontFamily: font }}>Forgot password?</a>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '12px', borderRadius: 10, fontWeight: 600, fontSize: 14, color: '#FFFFFF', background: loading ? '#93C5FD' : '#2563EB', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4, fontFamily: font, transition: 'background 0.15s' }}
              onMouseOver={e => { if (!loading) e.currentTarget.style.background = '#1D4ED8' }}
              onMouseOut={e => { if (!loading) e.currentTarget.style.background = '#2563EB' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <svg style={{ animation: 'spin 1s linear infinite', width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, marginTop: 20, color: '#9B9B9B', fontFamily: font }}>
            Don't have an account?{' '}
            <a href="#" style={{ color: '#2563EB', textDecoration: 'none' }}>Start free trial</a>
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, marginTop: 20, color: '#C8C8C8', fontFamily: font }}>
          Protected by enterprise-grade security · SOC 2 Type II Compliant
        </p>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
