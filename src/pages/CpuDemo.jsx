import { Link } from 'react-router-dom'
import { CpuArchitecture } from '@/components/ui/cpu-architecture'
import { Zap, ArrowLeft, ArrowRight } from 'lucide-react'

export default function CpuDemo() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-600/8 rounded-full blur-3xl" />

      {/* Nav */}
      <div className="fixed top-0 left-0 right-0 h-14 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl flex items-center px-6 justify-between z-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap size={13} className="text-white" />
          </div>
          <span className="text-sm font-bold text-white">Leads Up</span>
        </Link>
        <Link to="/" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors">
          <ArrowLeft size={14} />
          Back to site
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl text-center pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-8 text-sm text-indigo-300">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse-slow" />
          CPU Architecture · Live Visualization
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          AI Engine,{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Visualized
          </span>
        </h1>
        <p className="text-slate-400 text-lg mb-12 max-w-lg mx-auto">
          Watch the Leads Up intelligence layer route, qualify, and convert every inbound signal in real time.
        </p>

        {/* Component showcase */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
          <div className="bg-slate-900 rounded-xl p-6">
            <CpuArchitecture
              className="text-slate-600 w-full"
              width="100%"
              height="280"
              text="Leads Up"
              showCpuConnections
              animateText
              animateLines
              animateMarkers
            />
          </div>
        </div>

        {/* Variant grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-left">
            <div className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Minimal variant</div>
            <div className="bg-slate-900 rounded-xl p-4">
              <CpuArchitecture
                className="text-slate-700 w-full"
                width="100%"
                height="140"
                text="AI"
                showCpuConnections={false}
                animateText={false}
                animateLines={false}
              />
            </div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-left">
            <div className="text-xs text-indigo-400 mb-2 font-medium uppercase tracking-wider">Accent variant</div>
            <div className="bg-indigo-950/50 rounded-xl p-4">
              <CpuArchitecture
                className="text-indigo-800 w-full"
                width="100%"
                height="140"
                text="Leads Up"
                showCpuConnections
                animateText
                animateLines
              />
            </div>
          </div>
        </div>

        <Link to="/login"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-semibold transition-all">
          Try Leads Up Free
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
