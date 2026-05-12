import dynamic from 'next/dynamic'
import Link from 'next/link'
import { T, font } from './constants'

const NavMobile = dynamic(() => import('./NavMobile'), { ssr: false })

const navLinks = [
  ['#system', 'System'],
  ['#features', 'Features'],
  ['#pricing', 'Pricing'],
  ['#faq', 'FAQ'],
]

export default function SiteNav() {
  return (
    <header>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: T.bg, borderBottom: `1px solid ${T.border}`, height: 60, display: 'flex', alignItems: 'center', fontFamily: font, width: '100%' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, background: 'transparent' }}>
            <img src="/leadsup-icon.png.png" style={{ height: 32, width: 'auto', background: 'transparent', objectFit: 'contain' }} alt="Leads Up" />
            <span style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>Leads <span style={{ color: '#6B8AFF' }}>up</span></span>
          </Link>

          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 32 }}>
            {navLinks.map(([href, label]) => (
              <a key={href} href={href} className="lp-nav-link" style={{ fontSize: 14 }}>{label}</a>
            ))}
          </div>

          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 20 }}>
            <Link href="/login" className="lp-nav-link" style={{ fontSize: 14 }}>Sign in</Link>
            <Link href="/login?mode=signup" className="lp-btn-fade" style={{ fontSize: 14, fontWeight: 600, color: '#080A0F', background: '#FFFFFF', padding: '8px 18px', borderRadius: 99, textDecoration: 'none', fontFamily: font }}>
              Get started
            </Link>
          </div>

          <NavMobile />
        </div>
      </nav>
    </header>
  )
}
