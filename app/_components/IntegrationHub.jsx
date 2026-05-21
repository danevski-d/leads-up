'use client'

const NODES = [
  { id: 'hubspot',  logo: 'https://cdn.simpleicons.org/hubspot/FF7A59',        ring: '#FF7A59', x: 450, y: 50  },
  { id: 'airtable', logo: 'https://cdn.simpleicons.org/airtable/18BFFF',       ring: '#FCB400', x: 585, y: 99  },
  { id: 'gmail',    logo: 'https://cdn.simpleicons.org/gmail/EA4335',           ring: '#EA4335', x: 657, y: 224 },
  { id: 'zapier',   logo: 'https://cdn.simpleicons.org/zapier/FF4A00',          ring: '#FF4A00', x: 632, y: 365 },
  { id: 'openai',   logo: 'https://cdn.brandfetch.io/microsoft.com/w/400/h/400/icon', ring: '#0078D4', x: 243, y: 224 },
  { id: 'n8n',      logo: 'https://cdn.simpleicons.org/n8n/EA4B71',             ring: '#E7498F', x: 378, y: 457 },
  { id: 'linkedin', logo: 'https://cdn.simpleicons.org/linkedin/0A66C2',        ring: '#0A66C2', x: 268, y: 365 },
  { id: 'outlook',  logo: 'https://cdn.brandfetch.io/microsoft.com/w/400/h/400/icon', ring: '#0078D4', x: 243, y: 224 },
  { id: 'clay',     logo: 'https://cdn.brandfetch.io/clay.com/w/400/h/400',     ring: '#6B7EE0', x: 315, y: 99  },
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

export default function IntegrationHub() {
  const W = 900, H = 520, cx = 450, cy = 260

  function NodeIcon({ n }) {
    const fallbacks = {
      clay:    'https://framerusercontent.com/images/AzMiXeQCDMeUNqaflFPYWAiHY.png',
      outlook: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg',
      linkedin: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
      openai:  'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
    }
    return (
      <img
        src={n.logo}
        alt={n.id}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', borderRadius: 4 }}
        onError={e => {
          if (fallbacks[n.id] && e.target.src !== fallbacks[n.id]) {
            e.target.src = fallbacks[n.id]
          } else {
            e.target.style.opacity = '0.3'
          }
        }}
      />
    )
  }

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