import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, Eye, EyeOff, ArrowLeft } from 'lucide-react'

export default function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect after auth state is set — never call navigate() during render
  useEffect(() => {
    if (user) navigate('/app/dashboard', { replace: true })
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      // navigate happens via the useEffect above once user state updates
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#06060F' }}>
      <div className="absolute inset-0 opacity-[0.018]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-3xl"
        style={{ background: 'rgba(109,113,244,0.08)' }} />

      <div className="relative z-10 w-full max-w-md px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm mb-10 transition-colors"
          style={{ color: '#3D4165' }}
          onMouseOver={e => e.currentTarget.style.color = '#fff'}
          onMouseOut={e => e.currentTarget.style.color = '#3D4165'}>
          <ArrowLeft size={15} />
          Back to home
        </Link>

        <div className="p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6D71F4, #8B5CF6)' }}>
              <Zap size={17} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">Leads Up</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-sm mb-7" style={{ color: '#3D4165' }}>Sign in to your dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: '#5A5E80' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none transition-all"
                style={{ background: '#0D0E1C', border: '1px solid #1E2035' }}
                onFocus={e => e.target.style.borderColor = '#6D71F4'}
                onBlur={e => e.target.style.borderColor = '#1E2035'}
                placeholder="you@company.com"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: '#5A5E80' }}>Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 pr-11 text-white text-sm outline-none transition-all"
                  style={{ background: '#0D0E1C', border: '1px solid #1E2035' }}
                  onFocus={e => e.target.style.borderColor = '#6D71F4'}
                  onBlur={e => e.target.style.borderColor = '#1E2035'}
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#3D4165' }}
                  onMouseOver={e => e.currentTarget.style.color = '#9296C4'}
                  onMouseOut={e => e.currentTarget.style.color = '#3D4165'}>
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm rounded-xl px-4 py-3"
                style={{ color: '#F87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer" style={{ color: '#3D4165' }}>
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <a href="#" className="transition-colors" style={{ color: '#7677F4' }}>Forgot password?</a>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #6D71F4, #7C3AED)' }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#3D4165' }}>
            Don't have an account?{' '}
            <a href="#" style={{ color: '#7677F4' }}>Start free trial</a>
          </p>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#1E2035' }}>
          Protected by enterprise-grade security · SOC 2 Type II Compliant
        </p>
      </div>
    </div>
  )
}
