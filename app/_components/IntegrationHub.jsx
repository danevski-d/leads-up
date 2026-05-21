'use client'

const NODES = [
  { id: 'hubspot',  logo: 'https://cdn.simpleicons.org/hubspot/FF7A59',  ring: '#FF7A59', x: 450, y: 50  },
  { id: 'airtable', logo: 'https://cdn.simpleicons.org/airtable/18BFFF', ring: '#FCB400', x: 585, y: 99  },
  { id: 'gmail',    logo: 'https://cdn.simpleicons.org/gmail/EA4335',    ring: '#EA4335', x: 657, y: 224 },
  { id: 'zapier',   logo: 'https://cdn.simpleicons.org/zapier/FF4A00',   ring: '#FF4A00', x: 632, y: 365 },
  { id: 'openai',   logo: null,                                          ring: '#10A37F', x: 522, y: 457 },
  { id: 'n8n',      logo: 'https://cdn.simpleicons.org/n8n/EA4B71',      ring: '#E7498F', x: 378, y: 457 },
  { id: 'linkedin', logo: null,                                          ring: '#0A66C2', x: 268, y: 365 },
  { id: 'outlook',  logo: null,                                          ring: '#0078D4', x: 243, y: 224 },
  { id: 'clay',     logo: 'https://cdn.simpleicons.org/clay/ffffff',     ring: '#6B7EE0', x: 315, y: 99  },
]

const PATHS = {
  hubspot:  'M 450 50  Q 500 152 450 260',
  airtable: 'M 585 99  Q 558 182 450 260',
  gmail:    'M 657 224 Q 567 240 450 260',
  zapier:   'M 632 365 Q 555 322 450 260',
  openai:   'M 522 457 Q 494 368 450 260',
  n8n:      'M 378 457 Q 406 368 450 260',
  linkedin: 'M 268 365 Q 345 322 450 260',
  outlook:  'M 243 224 Q 333 240 450 260',
  clay:     'M 315 99  Q 342 182 450 260',
}

const DUR = { hubspot: 3.2, airtable: 2.6, gmail: 3.5, zapier: 2.3, openai: 3.0, n8n: 3.8, linkedin: 2.7, outlook: 3.1, clay: 3.4 }
const DEL = { hubspot: 0, airtable: 0.9, gmail: 0.4, zapier: 1.7, openai: 2.4, n8n: 1.1, linkedin: 0.7, outlook: 0.5, clay: 2.2 }

function NodeIcon({ n }) {
  if (n.id === 'openai') return (
    <svg viewBox="0 0 24 24" fill="white" style={{ width: '100%', height: '100%' }}>
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.032.067L9.73 19.95a4.5 4.5 0 0 1-6.13-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.369 2.02-1.168a.076.076 0 0 1 .071 0l4.83 2.786a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.402-.676zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
    </svg>
  )

  if (n.id === 'linkedin') return (
    <svg viewBox="0 0 24 24" fill="#0A66C2" style={{ width: '100%', height: '100%' }}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )

  if (n.id === 'outlook') return (
    <svg viewBox="0 0 24 24" fill="#0078D4" style={{ width: '100%', height: '100%' }}>
      <path d="M14.594 0v.005l-3.73 3.73H7.125v2.132L0 9.403v12.574L14.594 24V0zM7.125 5.866h3.74L7.125 9.6V5.866zm0 4.91l4.302-4.3 3.167 3.167-4.3 4.3-3.169-3.167zm-5.6.899l4.075-2.713v8.3L1.525 15.55V11.675zm5.6 7.98v-2.758l3.169 3.169-3.17-.41zM24 7.387v9.227l-7.88 7.38V0l7.88 7.387z"/>
    </svg>
  )

  return (
    <img
      src={n.logo}
      alt={n.id}
      loading="lazy"
      style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', borderRadius: 4 }}
      onError={e => { e.target.style.opacity = '0.3' }}
    />
  )
}

export default function IntegrationHub() {
  const W = 900, H = 520, cx = 450, cy = 260
  return (
    <div className="relative w-full max-w-5xl mx-auto select-none" style={{ paddingBottom: '54%' }}>
      <div className="absolute" style={{ left: '50%', top: `${(cy / H) * 100}%`, transform: 'translate(-50%,-50%)', width: '340px', height: '340px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-sm" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.8" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {[90, 130, 170].map((r, i) => (
          <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="#6366F1" strokeWidth={0.5 - i * 0.12} strokeOpacity={0.12 - i * 0.03}>
            <animate attributeName="r" values={`${r - 6};${r + 6};${r - 6}`} dur={`${4 + i * 1.2}s`} repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values={`${0.12 - i * 0.03};0.02;${0.12 - i * 0.03}`} dur={`${4 + i * 1.2}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {NODES.map(n => (
          <path key={`line-${n.id}`} d={PATHS[n.id]} stroke={n.ring} strokeWidth="1" fill="none" strokeOpacity="0.2" strokeDasharray="4 5" strokeLinecap="round" />
        ))}
        {NODES.map(n => (
          <g key={`d1-${n.id}`} filter="url(#glow)">
            <circle r="3.5" fill={n.ring} opacity="0.9">
              <animateMotion dur={`${DUR[n.id]}s`} repeatCount="indefinite" begin={`${DEL[n.id]}s`} path={PATHS[n.id]} />
            </circle>
          </g>
        ))}
        {NODES.map(n => (
          <g key={`d2-${n.id}`} filter="url(#glow-sm)">
            <circle r="2" fill={n.ring} opacity="0.45">
              <animateMotion dur={`${DUR[n.id]}s`} repeatCount="indefinite" begin={`${DEL[n.id] + DUR[n.id] * 0.45}s`} path={PATHS[n.id]} />
            </circle>
          </g>
        ))}
      </svg>
      {NODES.map(n => (
        <div key={`node-${n.id}`} className="absolute" style={{ left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%`, transform: 'translate(-50%,-50%)', zIndex: 5 }}>
          <div
            className="hub-node"
            style={{ width: 54, height: 54, borderRadius: '50%', background: '#1a2235', border: `1.5px solid ${n.ring}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 20px rgba(0,0,0,0.5), 0 0 16px -4px ${n.ring}30`, padding: 10, transition: 'box-shadow 0.3s' }}
            onMouseOver={e => e.currentTarget.style.boxShadow = `0 0 0 2px ${n.ring}50, 0 6px 24px rgba(0,0,0,0.6), 0 0 24px -4px ${n.ring}55`}
            onMouseOut={e => e.currentTarget.style.boxShadow = `0 6px 20px rgba(0,0,0,0.5), 0 0 16px -4px ${n.ring}30`}
          >
            <NodeIcon n={n} />
          </div>
        </div>
      ))}
      <div className="absolute" style={{ left: '50%', top: `${(cy / H) * 100}%`, transform: 'translate(-50%,-50%)', zIndex: 10 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#0D0F18', border: '1px solid #1A1D2E', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 4px rgba(99,102,241,0.08), 0 0 32px -8px rgba(99,102,241,0.4)' }}>
          <img src="/leadsup-icon.png" alt="LeadsUp" width="48" height="48" style={{ background: 'transparent', objectFit: 'contain' }} />
        </div>
      </div>
    </div>
  )
}